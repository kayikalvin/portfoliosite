const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const FileType = require('file-type');
const sharp = require('sharp');
const Busboy = require('busboy');

const DB_PATH = path.join(__dirname, 'db.json');
const CONFIG_PATH = path.join(__dirname, 'config.json');

function readJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    return null;
  }
}

function writeJSON(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8');
}

const config = readJSON(CONFIG_PATH) || { adminKey: 'changeme', adminHash: '', adminSalt: '', jwtSecret: 'changeme-secret', pbkdf2: { iterations: 310000, keylen: 64, digest: 'sha512' }, port: 4000 };

function deriveKey(password, salt, opts) {
  const iterations = (opts && opts.iterations) || 310000;
  const keylen = (opts && opts.keylen) || 64;
  const digest = (opts && opts.digest) || 'sha512';
  return crypto.pbkdf2Sync(String(password), String(salt), iterations, keylen, digest).toString('hex');
}

function genSalt(len = 16) {
  return crypto.randomBytes(len).toString('hex');
}

// If adminHash/salt missing, derive and persist from adminKey
if ((!config.adminHash || config.adminHash === '') && config.adminKey) {
  try {
    if (!config.adminSalt || config.adminSalt === '') config.adminSalt = genSalt(16);
    config.adminHash = deriveKey(config.adminKey, config.adminSalt, config.pbkdf2);
    writeJSON(CONFIG_PATH, config);
    console.log('Wrote adminHash/adminSalt to config.json (change adminKey/jwtSecret before deploy)');
  } catch (e) {
    console.warn('Could not write adminHash to config.json:', e.message || e);
  }
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const method = req.method;
  const headers = req.headers;

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key, Authorization, x-filename');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (parsed.pathname === '/api/projects' && method === 'GET') {
    const db = readJSON(DB_PATH) || { projects: [] };
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(db.projects));
    return;
  }

  // Serve uploaded files under /uploads/<filename>
  if (parsed.pathname && parsed.pathname.startsWith('/uploads/')) {
    const rel = parsed.pathname.replace('/uploads/', '');
    const filePath = path.join(__dirname, 'uploads', rel);
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      const stream = fs.createReadStream(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const mime = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.gif' ? 'image/gif' : 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime, 'Content-Length': stat.size });
      stream.pipe(res);
      return;
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  // GET project by title encoded in path: /api/projects/<encodedTitle>
  if (parsed.pathname && parsed.pathname.startsWith('/api/projects/') && method === 'GET') {
    const encoded = parsed.pathname.replace('/api/projects/', '');
    const title = decodeURIComponent(encoded);
    const db = readJSON(DB_PATH) || { projects: [] };
    const proj = db.projects.find(p => p.title === title);
    if (!proj) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(proj));
    return;
  }

  // Admin endpoints: require valid admin token or x-admin-key header matching config.adminHash
  if (parsed.pathname === '/api/projects' && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
    // check Authorization: Bearer <token>
    const auth = headers['authorization'] || '';
    let authorized = false;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const token = auth.slice(7).trim();
      try {
        jwt.verify(token, config.jwtSecret || 'changeme-secret');
        authorized = true;
      } catch (e) {
        authorized = false;
      }
    }

    // fallback to x-admin-key PBKDF2 compare
    if (!authorized) {
      const key = headers['x-admin-key'] || '';
      if (key && config.adminSalt && config.adminHash) {
        const provided = deriveKey(key, config.adminSalt, config.pbkdf2);
        if (provided === config.adminHash) authorized = true;
      }
    }

    if (!authorized) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    // collect body
    let body = '';
    for await (const chunk of req) body += chunk;
    try {
      const payload = body ? JSON.parse(body) : {};
      const db = readJSON(DB_PATH) || { projects: [] };

      if (method === 'POST') {
        // create
        db.projects.push(payload);
        writeJSON(DB_PATH, db);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(payload));
        return;
      }

      if (method === 'PUT') {
        const idx = db.projects.findIndex(p => p.title === payload.title);
        if (idx === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not found' }));
          return;
        }
        db.projects[idx] = payload;
        writeJSON(DB_PATH, db);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(payload));
        return;
      }

      if (method === 'DELETE') {
        const title = payload.title;
        const before = readJSON(DB_PATH) || { projects: [] };
        const after = { projects: before.projects.filter(p => p.title !== title) };
        writeJSON(DB_PATH, after);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true }));
        return;
      }

    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
      return;
    }
  }

  // Upload endpoint: POST /api/uploads with raw body and header `x-filename`.
  if (parsed.pathname === '/api/uploads' && method === 'POST') {
    // require admin auth for uploads
    const auth = headers['authorization'] || '';
    let authorized = false;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const token = auth.slice(7).trim();
      try {
        jwt.verify(token, config.jwtSecret || 'changeme-secret');
        authorized = true;
      } catch (e) {
        authorized = false;
      }
    }
    if (!authorized) {
      const key = headers['x-admin-key'] || '';
      if (key && config.adminSalt && config.adminHash) {
        const provided = deriveKey(key, config.adminSalt, config.pbkdf2);
        if (provided === config.adminHash) authorized = true;
      }
    }
    if (!authorized) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    // Support multipart/form-data uploads via busboy or raw body with x-filename
    let buffer = null;
    let originalName = null;
    const contentType = headers['content-type'] || '';
    if (contentType.toLowerCase().startsWith('multipart/')) {
      // parse with busboy
      const bb = new Busboy({ headers: req.headers });
      const parts = [];
      let fileBuffers = [];
      let fileCollected = false;
      await new Promise((resolve, reject) => {
        bb.on('file', (fieldname, file, info) => {
          originalName = info.filename || 'upload.dat';
          file.on('data', (data) => fileBuffers.push(data));
          file.on('end', () => { fileCollected = true; });
        });
        bb.on('field', (name, val) => {
          // accept optional filename field
          if (!originalName && name === 'filename') originalName = val;
          parts.push({ name, val });
        });
        bb.on('finish', () => {
          buffer = Buffer.concat(fileBuffers);
          resolve();
        });
        bb.on('error', (err) => reject(err));
        req.pipe(bb);
      });
    } else {
      const filenameHeader = headers['x-filename'] || headers['x_file_name'] || 'upload.dat';
      originalName = String(filenameHeader).replace(/[^a-zA-Z0-9.\-_%()\[\]]+/g, '_');
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      buffer = Buffer.concat(chunks);
    }
    const timestamp = Date.now();
    if (!originalName) originalName = 'upload.dat';

    // size limit (5MB)
    const MAX_BYTES = 5 * 1024 * 1024;
    if (buffer.length > MAX_BYTES) {
      res.writeHead(413, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'File too large (max 5MB)' }));
      return;
    }

    // detect file type from buffer
    let ft = null;
    try {
      ft = await FileType.fromBuffer(buffer);
    } catch (e) {
      ft = null;
    }
    const mime = ft && ft.mime ? ft.mime : (headers['content-type'] || 'application/octet-stream');
    if (!mime.startsWith('image/')) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Only image uploads are allowed' }));
      return;
    }

    // derive extension
    const ext = ft && ft.ext ? '.' + ft.ext : path.extname(saveName) || '.bin';
    const baseName = `${timestamp}-${originalName}`;
    const originalPath = path.join(__dirname, 'uploads', baseName);
    const optName = `${timestamp}-opt-${originalName}`;
    const optPath = path.join(__dirname, 'uploads', optName);
    const thumbName = `${timestamp}-thumb-${originalName}`;
    const thumbPath = path.join(__dirname, 'uploads', thumbName);

    try {
      // save original
      fs.writeFileSync(originalPath, buffer);

      // optimized (max width 1600)
      await sharp(buffer).resize({ width: 1600, withoutEnlargement: true }).toFile(optPath);

      // thumbnail (width 400)
      await sharp(buffer).resize({ width: 400, withoutEnlargement: true }).toFile(thumbPath);

      const hostPort = `http://localhost:${config.port || port}`;
      const urlOriginal = `${hostPort}/uploads/${encodeURIComponent(baseName)}`;
      const urlOpt = `${hostPort}/uploads/${encodeURIComponent(optName)}`;
      const urlThumb = `${hostPort}/uploads/${encodeURIComponent(thumbName)}`;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ url: urlOriginal, optimized: urlOpt, thumb: urlThumb, name: baseName, size: buffer.length }));
      return;
    } catch (err) {
      console.error('Upload save error', err && err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to process image' }));
      return;
    }
  }

  // List uploads: GET /api/uploads/list (admin-only)
  if (parsed.pathname === '/api/uploads/list' && method === 'GET') {
    // require admin auth
    const auth = headers['authorization'] || '';
    let authorized = false;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const token = auth.slice(7).trim();
      try { jwt.verify(token, config.jwtSecret || 'changeme-secret'); authorized = true; } catch (e) { authorized = false; }
    }
    if (!authorized) {
      const key = headers['x-admin-key'] || '';
      if (key && config.adminSalt && config.adminHash) {
        const provided = deriveKey(key, config.adminSalt, config.pbkdf2);
        if (provided === config.adminHash) authorized = true;
      }
    }
    if (!authorized) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    try {
      const files = fs.readdirSync(path.join(__dirname, 'uploads'));
      const grouped = {};
      files.forEach(f => {
        if (f.startsWith('.')) return;
        const m = f.match(/^(\d+)(?:-(opt|thumb))?-(.+)$/);
        if (!m) return;
        const ts = m[1];
        const tag = m[2];
        const name = m[3];
        const key = `${ts}-${name}`;
        if (!grouped[key]) grouped[key] = { name: name, timestamp: Number(ts), original: null, optimized: null, thumb: null };
        const stat = fs.statSync(path.join(__dirname, 'uploads', f));
        const hostPort = `http://localhost:${config.port || port}`;
        const urlf = `${hostPort}/uploads/${encodeURIComponent(f)}`;
        if (!tag) grouped[key].original = { url: urlf, filename: f, size: stat.size, mtime: stat.mtimeMs };
        else if (tag === 'opt') grouped[key].optimized = { url: urlf, filename: f, size: stat.size, mtime: stat.mtimeMs };
        else if (tag === 'thumb') grouped[key].thumb = { url: urlf, filename: f, size: stat.size, mtime: stat.mtimeMs };
      });
      let out = Object.keys(grouped).sort((a,b)=> grouped[b].timestamp - grouped[a].timestamp).map(k => grouped[k]);
      // apply search and pagination
      const q = parsed.query.q ? String(parsed.query.q).toLowerCase() : '';
      const page = parsed.query.page ? Math.max(1, Number(parsed.query.page) || 1) : 1;
      const perPage = parsed.query.perPage ? Math.max(1, Number(parsed.query.perPage) || 20) : 20;
      if (q) out = out.filter(item => item.name.toLowerCase().includes(q));
      const total = out.length;
      const start = (page - 1) * perPage;
      const paged = out.slice(start, start + perPage);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ uploads: paged, page, perPage, total }));
      return;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to list uploads' }));
      return;
    }
  }

  // DELETE /api/uploads - remove original, optimized and thumb files by filename (admin-only)
  if (parsed.pathname === '/api/uploads' && method === 'DELETE') {
    // require admin auth
    const auth2 = headers['authorization'] || '';
    let authorized2 = false;
    if (auth2 && auth2.toLowerCase().startsWith('bearer ')) {
      const token = auth2.slice(7).trim();
      try { jwt.verify(token, config.jwtSecret || 'changeme-secret'); authorized2 = true; } catch (e) { authorized2 = false; }
    }
    if (!authorized2) {
      const key = headers['x-admin-key'] || '';
      if (key && config.adminSalt && config.adminHash) {
        const provided = deriveKey(key, config.adminSalt, config.pbkdf2);
        if (provided === config.adminHash) authorized2 = true;
      }
    }
    if (!authorized2) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    // read json body
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString('utf8') || '{}';
    let data = {};
    try { data = JSON.parse(body); } catch (e) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Invalid JSON' })); return; }
    const { filename } = data;
    if (!filename) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'filename required' })); return; }
    const uploadsDir = path.join(__dirname, 'uploads');
    const orig = path.join(uploadsDir, filename);
    const opt = path.join(uploadsDir, filename.replace(/^(\d+)-/, '$1-opt-'));
    const thumb = path.join(uploadsDir, filename.replace(/^(\d+)-/, '$1-thumb-'));
    const removed = [];
    for (const p of [orig, opt, thumb]) {
      try { if (fs.existsSync(p)) { fs.unlinkSync(p); removed.push(path.basename(p)); } } catch (e) { /* ignore */ }
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ deleted: removed }));
    return;
  }

  // Admin login: POST /api/admin/login with JSON { password }
  if (parsed.pathname === '/api/admin/login' && method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;
    try {
      const payload = body ? JSON.parse(body) : {};
      const pw = payload.password || '';
      let valid = false;
      if (config.adminSalt && config.adminHash) {
        const derived = deriveKey(pw, config.adminSalt, config.pbkdf2);
        valid = derived === config.adminHash;
      }
      if (valid) {
        // sign JWT
        const token = jwt.sign({ admin: true }, config.jwtSecret || 'changeme-secret', { expiresIn: '2h' });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: true, token }));
        return;
      }
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid password' }));
      return;
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const port = config.port || 4000;
server.listen(port, () => {
  console.log(`Portfolio API server running on http://localhost:${port}`);
});
