// The words file (game/words.js): every line of dialogue and story text in one
// plain, searchable file the owner can edit on GitHub. It wins over the text in
// the data files, the same way Studio overrides do (see overrides.js).
//
// Format, one line of text per line:
//   # a comment
//   [PEOPLE.ardi]                  a heading: where the next lines belong
//   lines.1.1 = Hi neighbour...    a key under that heading, then the text
// Lists count from 1. "\n" is a line break inside one piece of text.

// Which data file each top-level table lives in.
export const WORD_TABLES = {
  'data/dialogue.js': ['PEOPLE', 'PET_TEXT', 'PLACES'],
  'data/story.js': [
    'CHAPTERS', 'GOALS', 'CH1', 'CH1_PAPER', 'CH1_HELEN', 'CH1_ENROLLED', 'SCHOOL_FEE', 'SCHOOL_LINES',
    'SCHOOL_DEFAULT', 'CH2_RECIPE', 'CH3_PRANKS', 'CH4', 'PADDY_SPILL', 'PADDY_SPILL_HINT', 'LUNCH',
    'RECIPES', 'PRANKS', 'RSVP', 'TRIVIA', 'PARTY_STORIES', 'PARTY_MINGLE', 'PARTY_SLUMP', 'PADDY_PARTY',
    'PADDY_SPEECH', 'PARTY_END', 'ELECTION_LOST', 'THE_END',
  ],
};

// Text, not an id: ids never have spaces or end in punctuation.
export const isWords = s => typeof s === 'string' && (/\s/.test(s.trim()) || /[.!?"')]$/.test(s));

const unescape = s => s.replace(/\\(n|x60|x24|\\)/g, (_, c) => ({ n: '\n', x60: '`', x24: '$', '\\': '\\' }[c]));
export const escapeWords = s => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/`/g, '\\x60').replace(/\$\{/g, '\\x24{');

// Words file text -> { EXPORT: [[path segments as written], text], ... }
export function parseWords(text) {
  const out = {};
  let head = null;
  for (const raw of String(text || '').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const h = line.match(/^\[([^\]]+)\]/);
    if (h) { head = h[1].trim().split('.'); continue; }
    const eq = line.indexOf(' = ');
    if (!head || eq < 0) continue;
    const key = line.slice(0, eq).trim(), value = unescape(raw.slice(raw.indexOf(' = ') + 3));
    const path = [...head.slice(1), ...key.split('.')];
    (out[head[0]] ||= []).push([path, value]);
  }
  return out;
}

// Copy-on-write: replace the text at each path (only where text already is),
// or add it at the end of a list.
export function applyWords(value, entries) {
  if (!entries?.length) return value;
  const root = Array.isArray(value) ? [...value] : { ...value };
  for (const [path, text] of entries) {
    // In a list the file counts from 1; keys of a table stay as written.
    const at = (n, k) => Array.isArray(n) && /^\d+$/.test(k) ? Number(k) - 1 : k;
    let node = root, ok = true;
    // The next number after the end of a list adds a new entry (a new chat
    // line, or another sentence in one); numbers further on are ignored.
    const adds = (n, k) => Array.isArray(n) && k === n.length && n.every(v => typeof v !== 'object' || Array.isArray(v));
    for (let i = 0; i < path.length - 1; i++) {
      const k = at(node, path[i]);
      let next = node?.[k];
      if (next === undefined && adds(node, k) && /^\d+$/.test(path[i + 1]) && (!node.length || Array.isArray(node[0]))) next = [];
      if (!next || typeof next !== 'object') { ok = false; break; }
      node = node[k] = Array.isArray(next) ? [...next] : { ...next };
    }
    const last = at(node, path[path.length - 1]);
    if (ok && (isWords(node?.[last]) || (adds(node, last) && node.every(v => typeof v === 'string')))) node[last] = text;
  }
  return root;
}

// Tables -> words file text (tools/words.mjs writes game/words.js with this).
export function writeWords(tables, names = {}) {
  const out = [
    '# Project Princess: every line of dialogue and story text.',
    '# Search with Ctrl+F (or Cmd+F). Change the text after " = " and save (commit) the file.',
    '# Leave the part before " = " and the [headings] alone: they say where each line goes.',
    '# Lists count from 1. Type \\n for a line break inside one piece of text.',
    '# To add a line, copy the last one and give it the next number (lines.6.1 after lines.5.1).',
    '# Australian spelling, no em dashes, keep lines short (under about 140 characters).',
    '',
  ];
  const walk = (node, path, rows) => {
    if (typeof node === 'string') { if (isWords(node)) rows.push([path, node]); return; }
    if (!node || typeof node !== 'object') return;
    const entries = Array.isArray(node) ? node.map((v, i) => [i + 1, v]) : Object.entries(node);
    for (const [k, v] of entries) walk(v, [...path, k], rows);
  };
  for (const [table, value] of Object.entries(tables)) {
    // People, pets and places get a heading each; everything else one per table.
    const split = ['PEOPLE', 'PET_TEXT', 'PLACES', 'PRANKS', 'RECIPES', 'LUNCH'].includes(table) && value && typeof value === 'object' && !Array.isArray(value);
    const groups = split ? Object.entries(value).map(([id, v]) => [`${table}.${id}`, v, names[id]]) : [[table, value]];
    for (const [head, v, name] of groups) {
      const rows = []; walk(v, [], rows);
      if (!rows.length) continue;
      out.push(`[${head}]${name ? `  # ${name}` : ''}`);
      for (const [path, text] of rows) out.push(`${path.join('.') || 'text'} = ${escapeWords(text)}`);
      out.push('');
    }
  }
  return out.join('\n');
}
