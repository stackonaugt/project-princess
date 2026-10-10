// Persistent tutorial notes and unread quest IDs. Opening To Do acknowledges
// notifications without completing quests; completion follows game progress.
import { state } from './state.js';
import { bus } from '../bus.js';
import { objectives } from './story.js';
import { showUnlocked } from './show-progress.js';
const journal = () => state.data.flags.todo ||= { tutorials: {}, known: [], read: [] };
export function addTutorial(id, title, text) {
  const j = journal();
  if (!j.tutorials[id]) j.tutorials[id] = { id, title, text, done: false };
  syncTodo();
}
export function completeTutorial(id) {
  const t = journal().tutorials[id]; if (t) { t.done = true; state.save(); }
}
export function tutorialNotes() { return Object.values(journal().tutorials); }
function questIds() {
  const n = state.data.story.chapter, ids = n > 0 && n < 5 ? objectives(n).filter(o => !o.done).map((o,i) => `chapter:${n}:${o.id || i}`) : state.isFound('princess') ? [] : ['find-princess'];
  if (state.data.side.bake === 1) ids.push('side:betty-bake');
  if (showUnlocked() && !state.data.side.show?.claimed.includes('champion')) ids.push('side:dog-show');
  for (const t of tutorialNotes()) if (!t.done) ids.push(`tutorial:${t.id}`);
  return ids;
}
export function syncTodo() {
  const j = journal();
  if (state.data.beaten.julie && j.tutorials.julie) j.tutorials.julie.done = true;
  if (state.isFound('marty') && state.pet('marty').hp == null && j.tutorials['marty-care']) j.tutorials['marty-care'].done = true;
  const added = questIds().filter(id => !j.known.includes(id));
  if (added.length) { j.known.push(...added); state.save(); bus.emit('todo:new', added.length); }
  return unreadTodo();
}
export function unreadTodo() {
  const j = journal(); return questIds().filter(id => j.known.includes(id) && !j.read.includes(id)).length;
}
export function readTodo() { const j = journal(); j.read = [...new Set([...j.read,...j.known])]; state.save(); bus.emit('todo:read'); }
