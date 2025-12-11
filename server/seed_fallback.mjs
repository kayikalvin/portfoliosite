import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilsPath = path.resolve(__dirname, '..', 'src', 'utils', 'utils.js');
const dbPath = path.resolve(__dirname, 'db.json');

function extractArrayLiteral(source, marker) {
  const idx = source.indexOf(marker);
  if (idx === -1) return null;
  // find the first '[' after marker
  let i = source.indexOf('[', idx);
  if (i === -1) return null;

  const start = i;
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let prevChar = '';
  // track template expression braces depth when inside `${...}`
  let templateExprDepth = 0;

  for (let pos = i; pos < source.length; pos++) {
    const ch = source[pos];
    const next = source[pos + 1];

    // handle line comments
    if (!inSingle && !inDouble && !inTemplate && !inBlockComment && ch === '/' && next === '/') {
      inLineComment = true;
      pos++; // skip next
      continue;
    }
    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }

    // handle block comments
    if (!inSingle && !inDouble && !inTemplate && !inLineComment && ch === '/' && next === '*') {
      inBlockComment = true;
      pos++;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        pos++;
      }
      continue;
    }

    // handle escapes
    if ((inSingle || inDouble || inTemplate) && ch === '\\') {
      pos++; // skip escaped char
      continue;
    }

    // handle strings
    if (!inDouble && !inTemplate && !inLineComment && !inBlockComment && ch === "'") {
      inSingle = !inSingle;
      continue;
    }
    if (!inSingle && !inTemplate && !inLineComment && !inBlockComment && ch === '"') {
      inDouble = !inDouble;
      continue;
    }

    // handle template literals
    if (!inSingle && !inDouble && !inLineComment && !inBlockComment && ch === '`') {
      inTemplate = !inTemplate;
      // when closing a template, reset any template expression depth
      if (!inTemplate) templateExprDepth = 0;
      continue;
    }

    // when inside template literal, detect `${` and `}` balancing
    if (inTemplate) {
      if (ch === '$' && next === '{') {
        templateExprDepth++;
        pos++;
        continue;
      }
      if (ch === '}') {
        if (templateExprDepth > 0) templateExprDepth--;
        continue;
      }
      continue; // ignore other chars inside template
    }

    // only count brackets when not inside any string/comment/template
    if (!inSingle && !inDouble && !inTemplate && !inLineComment && !inBlockComment) {
      if (ch === '[') depth++;
      if (ch === ']') {
        depth--;
        if (depth === 0) {
          const end = pos + 1;
          return source.slice(start, end);
        }
      }
    }

    prevChar = ch;
  }
  return null;
}

function parseArrayLiteral(arrayText) {
  // Evaluate the array literal safely using Function. It should contain only literals.
  try {
    // Wrap in parentheses to ensure it's an expression
    const fn = new Function('return (' + arrayText + ')');
    const result = fn();
    return result;
  } catch (err) {
    throw new Error('Eval failed: ' + (err && err.message));
  }
}

async function main() {
  try {
    const src = fs.readFileSync(utilsPath, 'utf8');
    const marker = 'export const projects';
    const arrText = extractArrayLiteral(src, marker);
    if (!arrText) {
      console.error('Could not find projects array in', utilsPath);
      process.exit(1);
    }
    const projects = parseArrayLiteral(arrText);
    if (!Array.isArray(projects)) {
      console.error('Parsed value is not array');
      process.exit(1);
    }
    fs.writeFileSync(dbPath, JSON.stringify({ projects }, null, 2), 'utf8');
    console.log(`Seeded ${projects.length} projects to ${dbPath} (fallback)`);
  } catch (err) {
    console.error('Fallback seeder failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();
