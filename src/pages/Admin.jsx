import { useEffect, useState, useRef } from "react";
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import toast, { Toaster } from 'react-hot-toast';
import GradientBuilder from '../components/GradientBuilder';
import { FiEdit, FiTrash2, FiCopy, FiImage, FiLink, FiType, FiCode, FiFile, FiSearch, FiChevronLeft, FiChevronRight, FiLogOut, FiClipboard, FiBold, FiItalic, FiExternalLink } from 'react-icons/fi';


import Dashboard from './Dashboard';
import Uploads from './Uploads';
import Projects from './Projects';
import Settings from './Settings';
import ProjectPopup from '../components/ProjectPopup';

const API = "";

function Admin() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('adminToken') || localStorage.getItem('adminKey')));
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ id: null, title: '', description: '', tech: '', code: '', url: '', markdown: '', gradient: '' });
  const mdRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [editProject, setEditProject] = useState(null); // project being edited or null
  const [projectQuery, setProjectQuery] = useState('');

  const [uploads, setUploads] = useState([]);
  const [toastLog, setToastLog] = useState(() => {
    try {
      const s = localStorage.getItem('adminToastLog');
      return s ? JSON.parse(s) : [];
    } catch (e) { return []; }
  });

  const [confirm, setConfirm] = useState({ open: false, title: '', onConfirm: null });
  const [sideOpen, setSideOpen] = useState(true);
  // Default to 'dashboard' for the main admin entry
  const [navSection, setNavSection] = useState('dashboard');

  useEffect(() => {
    fetchProjects();
    fetchUploads();
  }, []);

  const navigate = useNavigate();
  // redirect to login page when not authenticated
  useEffect(() => {
    if (!loggedIn) {
      navigate('/admin/login');
    }
  }, [loggedIn, navigate]);

  const [uploadPage, setUploadPage] = useState(1);
  const [uploadPerPage] = useState(24);
  const [uploadQuery, setUploadQuery] = useState('');

  function fetchUploads(page = 1, perPage = uploadPerPage, q = '') {
    const headers = {};
    const token = localStorage.getItem('adminToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    else {
      const key = localStorage.getItem('adminKey');
      if (key) headers['x-admin-key'] = key;
    }
    const qs = new URLSearchParams();
    if (q) qs.set('q', q);
    qs.set('page', String(page));
    qs.set('perPage', String(perPage));
    fetch(`${API}/api/uploads/list?${qs.toString()}`, { headers })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        if (data && Array.isArray(data.uploads)) setUploads(data.uploads);
        else setUploads([]);
        setUploadPage(data.page || page);
      })
      .catch(() => setUploads([]));
  }

  function getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    const key = localStorage.getItem('adminKey') || '';
    const base = { 'Content-Type': 'application/json' };
    if (token) return { ...base, Authorization: `Bearer ${token}` };
    return { ...base, 'x-admin-key': key };
  }

  function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminKey');
    setLoggedIn(false);
    notify('Logged out', 'info');
    try { navigate('/admin/login'); } catch (e) { window.location.href = '/admin/login'; }
  }

  function notify(message, type = 'success') {
    // type: 'success' | 'error' | 'info'
    if (type === 'success') toast.success(message);
    else if (type === 'error') toast.error(message);
    else toast(message);
    setToastLog(prev => [{ message, type, time: Date.now() }, ...prev].slice(0, 20));
  }

  // persist toast log
  useEffect(() => {
    try { localStorage.setItem('adminToastLog', JSON.stringify(toastLog)); } catch (e) {}
  }, [toastLog]);

  function openConfirm(title, onConfirm) {
    setConfirm({ open: true, title, onConfirm });
  }

  function closeConfirm() {
    setConfirm({ open: false, title: '', onConfirm: null });
  }

  function fetchProjects() {
    fetch(`${API}/api/projects`)
      .then(r => r.json())
      .then((data) => {
        // normalize response: some APIs return { projects: [...] }
        if (Array.isArray(data)) setProjects(data);
        else if (Array.isArray(data.projects)) setProjects(data.projects);
        else setProjects([]);
      })
      .catch(() => setProjects([]));
  }

  function login(e) {
    e.preventDefault();
    fetch(`${API}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error('bad');
        const data = await r.json();
        if (data && data.token) {
          localStorage.setItem('adminToken', data.token);
        } else {
          // fallback to storing key
          localStorage.setItem('adminKey', password);
        }
        setLoggedIn(true);
        notify('Logged in', 'success');
        fetchProjects();
      })
      .catch(() => notify('Login failed (check server config/adminKey)', 'error'));
  }

  function startEdit(p) {
    setEditing(true);
    setEditProject(p);
  }

  function insertAtCursor(insertText) {
    const ta = mdRef.current || document.querySelector('textarea[placeholder="Markdown"]');
    if (!ta) {
      setForm(prev => ({ ...prev, markdown: (prev.markdown || '') + '\n' + insertText }));
      return;
    }
    const start = ta.selectionStart || 0;
    const end = ta.selectionEnd || 0;
    const before = ta.value.substring(0, start);
    const after = ta.value.substring(end);
    const newVal = before + insertText + after;
    setForm(prev => ({ ...prev, markdown: newVal }));
    // update textarea value and set cursor after inserted text
    try {
      ta.value = newVal;
      const pos = start + insertText.length;
      ta.setSelectionRange(pos, pos);
      ta.focus();
    } catch (e) {}
  }

  function wrapSelection(prefix, suffix = prefix) {
    const ta = mdRef.current || document.querySelector('textarea[placeholder="Markdown"]');
    if (!ta) return insertAtCursor(prefix + suffix);
    const start = ta.selectionStart || 0;
    const end = ta.selectionEnd || 0;
    const selected = ta.value.substring(start, end) || 'text';
    insertAtCursor(prefix + selected + suffix);
  }

  function gradientStyleFromClass(cls) {
    if (!cls) return null;
    // find bracketed hex values like from-[#RRGGBB]
    const re = /#\[?([0-9a-fA-F]{6})\]?/g;
    const matches = [...cls.matchAll(re)].map(m => m[1]);
    if (matches.length === 0) return null;
    const parts = matches.join(',');
    return { background: `linear-gradient(90deg, ${matches.map(h => `#${h}`).join(',')})` };
  }

  function handleUpdate(e) {
    e.preventDefault();
    const payload = { ...form, tech: (form.tech || '').split(',').map(t => t.trim()) };
    fetch(`${API}/api/projects`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then(() => {
        notify('Project updated', 'success');
        setForm({ title: '', description: '', tech: '', code: '', url: '', markdown: '', gradient: '' });
        setEditing(false);
        fetchProjects();
      })
      .catch(() => notify('Update failed (unauthorized?)', 'error'));
  }

  function handleCreate(e) {
    e.preventDefault();
    const payload = { ...form, tech: form.tech.split(',').map(t => t.trim()) };
    fetch(`${API}/api/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then(() => {
        notify('Project created', 'success');
        setForm({ title: '', description: '', tech: '', code: '', url: '', markdown: '', gradient: '' });
        fetchProjects();
      })
      .catch(() => notify('Create failed (unauthorized?)', 'error'));
  }

  function handleDelete(title) {
    openConfirm(`Delete project "${title}"? This cannot be undone.`, async () => {
      try {
        const res = await fetch(`${API}/api/projects`, { method: 'DELETE', headers: getAuthHeaders(), body: JSON.stringify({ title }) });
        await res.json();
        notify('Deleted', 'success');
        fetchProjects();
      } catch (e) {
        notify('Delete failed', 'error');
      } finally { closeConfirm(); }
    });
  }

  async function uploadFile(file) {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const fd = new FormData();
      fd.append('file', file, file.name);

      const res = await fetch(`${API}/api/uploads`, {
        method: 'POST',
        headers,
        body: fd,
      });
      if (!res.ok) throw new Error('upload failed');
      const data = await res.json();
      if (data && data.url) {
        // insert at cursor position in textarea
        const ta = document.querySelector('textarea[placeholder="Markdown"]');
        const insert = `![](${data.url})`;
        if (ta) {
          const start = ta.selectionStart || ta.value.length;
          const end = ta.selectionEnd || start;
          const before = ta.value.substring(0, start);
          const after = ta.value.substring(end);
          const newVal = before + insert + after;
          setForm({...form, markdown: newVal});
        } else {
          setForm({...form, markdown: (form.markdown || '') + '\n' + insert});
        }
        notify('Upload complete', 'success');
        // refresh upload list
        fetchUploads(uploadPage, uploadPerPage, uploadQuery);
      } else {
        throw new Error('no url');
      }
    } catch (err) {
      notify('Upload failed', 'error');
    }
  }

  function deleteUpload(filename) {
    openConfirm(`Delete upload "${filename}" (original + optimized + thumb)?`, async () => {
      const token = localStorage.getItem('adminToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) { headers['Authorization'] = `Bearer ${token}`; delete headers['x-admin-key']; }
      else {
        const key = localStorage.getItem('adminKey');
        if (key) headers['x-admin-key'] = key;
      }
      try {
        const res = await fetch(`${API}/api/uploads`, { method: 'DELETE', headers, body: JSON.stringify({ filename }) });
        await res.json();
        notify('Deleted upload', 'success');
        fetchUploads(uploadPage, uploadPerPage, uploadQuery);
      } catch (e) {
        notify('Delete failed', 'error');
      } finally { closeConfirm(); }
    });
  }

  function insertImage(url) {
    const ta = document.querySelector('textarea[placeholder="Markdown"]');
    const insert = `![](${url})`;
    if (ta) {
      const start = ta.selectionStart || ta.value.length;
      const end = ta.selectionEnd || start;
      const before = ta.value.substring(0, start);
      const after = ta.value.substring(end);
      const newVal = before + insert + after;
      setForm({...form, markdown: newVal});
    } else {
      setForm({...form, markdown: (form.markdown || '') + '\n' + insert});
    }
  }

  // Render confirm modal and toast log

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
        }} 
      />

      <div className="">
        {/* Sidebar is fixed, so add left margin to main content */}
        <Sidebar 
          open={sideOpen} 
          onToggle={() => setSideOpen(s => !s)} 
          onNavigate={setNavSection} 
          navSection={navSection}
          onLogout={logout} 
        />
        <main
          className={`ml-${sideOpen ? '56' : '14'} transition-all duration-200 flex-1 p-6 max-w-7xl mx-auto`}
          style={{ marginLeft: sideOpen ? '14rem' : '3.5rem' }}
        >
          {/* Header and Toast log always visible */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1">Manage projects, uploads, and content</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => { navigator.clipboard?.writeText(localStorage.getItem('adminToken')||''); notify('Token copied'); }} 
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg flex items-center gap-2 transition-colors duration-200"
              >
                <FiClipboard className="text-sm" />
                Copy Token
              </button>
              <button 
                onClick={logout} 
                className="px-4 py-2 bg-red-900/30 hover:bg-red-800/30 text-red-200 rounded-lg border border-red-800/50 flex items-center gap-2 transition-colors duration-200"
              >
                <FiLogOut className="text-sm" />
                Logout
              </button>
            </div>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-300">Recent Actions</h2>
              <span className="text-xs text-gray-500">{toastLog.length} items</span>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              {toastLog.length === 0 ? (
                <div className="text-gray-500 text-center py-4">No recent actions</div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {toastLog.map((t, i) => (
                    <div 
                      key={i} 
                      className={`p-3 rounded-lg border-l-4 ${
                        t.type === 'success' ? 'border-l-green-500 bg-green-900/10' :
                        t.type === 'error' ? 'border-l-red-500 bg-red-900/10' :
                        'border-l-blue-500 bg-blue-900/10'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span>{t.message}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(t.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Main content area: switch by navSection, always using the same layout */}
          <div>
            {navSection === 'dashboard' && (
              <div className="py-4">
                <Dashboard stats={{ projects: projects.length }} />
              </div>
            )}
            {navSection === 'projects' && (
              <div className="py-4">
                <Projects
                  projects={projects}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                  onAdd={() => {
                    setEditing(true);
                    setEditProject(null);
                  }}
                />
              </div>
            )}
                  {/* Project Add/Edit Popup */}
                  <ProjectPopup
                    open={editing}
                    onClose={() => { setEditing(false); setEditProject(null); }}
                    initialData={editProject}
                    onSubmit={async (data) => {
                      setEditing(false);
                      setEditProject(null);
                      // If editing, update; else, create
                      const payload = { ...data };
                      if (editProject) {
                        payload.id = editProject.id || editProject._id || editProject.title;
                        await fetch(`${API}/api/projects`, {
                          method: 'PUT',
                          headers: getAuthHeaders(),
                          body: JSON.stringify(payload),
                        });
                        notify('Project updated', 'success');
                      } else {
                        await fetch(`${API}/api/projects`, {
                          method: 'POST',
                          headers: getAuthHeaders(),
                          body: JSON.stringify(payload),
                        });
                        notify('Project created', 'success');
                      }
                      fetchProjects();
                    }}
                  />
            {navSection === 'uploads' && (
              <div className="py-4">
                <Uploads />
              </div>
            )}
            {navSection === 'settings' && (
              <div className="py-4">
                <Settings />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Confirm Modal */}
      {confirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-xl font-semibold text-gray-200 mb-4">{confirm.title}</div>
            <p className="text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={closeConfirm} 
                className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => { 
                  if (confirm.onConfirm) confirm.onConfirm(); 
                  closeConfirm(); 
                }} 
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-lg transition-all duration-200"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
