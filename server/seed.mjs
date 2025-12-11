import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilsPath = path.resolve(__dirname, '..', 'src', 'utils', 'utils.js');
const dbPath = path.resolve(__dirname, 'db.json');

async function main() {
  try {
    const fileUrl = 'file://' + utilsPath.replace(/\\/g, '/');
    const mod = await import(fileUrl);
    const projects = mod.projects || [];
    fs.writeFileSync(dbPath, JSON.stringify({ projects }, null, 2), 'utf8');
    console.log(`Seeded ${projects.length} projects to ${dbPath}`);
  } catch (err) {
    console.error('Failed to seed projects:', err.message || err);
    process.exit(1);
  }
}

main();
