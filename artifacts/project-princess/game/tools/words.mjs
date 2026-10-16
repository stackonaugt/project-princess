// Writes game/words.js: every line of dialogue and story text in one file the
// owner can search and edit on GitHub. The game reads it back over the data
// files (src/authoring/overrides.js), so running this again keeps any edits.
//   node game/tools/words.mjs           write game/words.js
//   node game/tools/words.mjs --check   exit 1 if it is out of date
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { WORD_TABLES, writeWords } from '../src/authoring/words-file.js';

const file = fileURLToPath(new URL('../words.js', import.meta.url));

export async function buildWords() {
  const tables = {};
  for (const [mod, names] of Object.entries(WORD_TABLES)) {
    const m = await import(new URL(`../src/${mod}`, import.meta.url).href);
    for (const n of names) if (m[n] !== undefined) tables[n] = m[n];
  }
  const { NPCS } = await import(new URL('../src/data/npcs.js', import.meta.url).href);
  const names = Object.fromEntries(Object.entries(NPCS).map(([id, n]) => [id, n.name]));
  const body = writeWords(tables, names);
  return `// The words file. Open it on GitHub, press the pencil to edit, change the\n// text after " = ", then Commit changes. See the notes just below.\nexport default String.raw\`\n${body}\`;\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const text = await buildWords();
  if (process.argv.includes('--check')) {
    if (readFileSync(file, 'utf8') !== text) { console.error('game/words.js is out of date: run node game/tools/words.mjs'); process.exit(1); }
  } else { writeFileSync(file, text); console.log(`Wrote ${file} (${text.split('\n').length} lines)`); }
}
