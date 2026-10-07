import { clone, escapeHtml, gameURL, readView, rememberView, request } from './utils.js';
import { mountMapEditor } from './map-editor.js';
import { mountDataEditor } from './data-editor.js';

const root = document.getElementById('studio-root');
const tabs = [
  ['maps', 'World maps', 'Terrain, props and exits'],
  ['story', 'Stories & dialogue', 'Chapters and conversations'],
  ['gameplay', 'Pets & gameplay', 'Stats, moves and items'],
  ['world', 'Characters & shops', 'Characters, schedules and stock'],
];
const model = {
  active: readView('section', 'maps'), catalog: null, doc: null, saved: null, revision: '',
  dirty: false, saving: false, datasets: new Map(), view: 0,
};
if (!tabs.some(tab => tab[0] === model.active)) model.active = 'maps';

function message(text, error = false) {
  const area = document.getElementById('studio-message');
  if (!area) return;
  area.textContent = text;
  area.classList.toggle('is-error', error);
}

function updateSaveState() {
  const state = document.getElementById('save-state');
  if (!state) return;
  state.textContent = model.saving ? 'Saving…' : model.dirty ? 'Unsaved changes' : 'Saved to this project';
  state.classList.toggle('is-dirty', model.dirty);
  document.getElementById('save-project').disabled = model.saving || !model.dirty;
  document.getElementById('discard-drafts').disabled = model.saving || !model.dirty;
}

const context = {
  get catalog() { return model.catalog; },
  get document() { return model.doc; },
  datasets: model.datasets,
  changed() { model.dirty = true; message('Draft changes are not in the game until you save.'); updateSaveState(); },
  message,
  request,
};

async function showView() {
  const viewId = ++model.view;
  const body = document.getElementById('studio-content');
  for (const button of root.querySelectorAll('[data-section]')) {
    button.classList.toggle('is-current', button.dataset.section === model.active);
  }
  document.getElementById('studio-heading').textContent = tabs.find(tab => tab[0] === model.active)[1];
  body.innerHTML = '<p class="studio-muted" role="status">Loading game data…</p>';
  try {
    if (model.active === 'maps') await mountMapEditor(body, context, () => viewId === model.view);
    else await mountDataEditor(body, context, model.active, () => viewId === model.view);
  } catch (error) {
    if (viewId !== model.view) return;
    body.innerHTML = `<div class="studio-error"><strong>This view could not load.</strong><p>${escapeHtml(error.message)}</p></div>`;
  }
}

async function saveProject(documentToSave = model.doc) {
  model.saving = true;
  updateSaveState();
  try {
    const result = await request('save', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'If-Match': model.revision },
      body: JSON.stringify(documentToSave),
    });
    model.doc = clone(result.saved);
    model.saved = clone(result.saved);
    model.revision = result.revision;
    model.dirty = false;
    message('Saved. Reload the game preview to use the new content. Player save slots were not changed.');
    return true;
  } catch (error) {
    message(error.message, true);
    return false;
  } finally {
    model.saving = false;
    updateSaveState();
  }
}

function exportEdits() {
  const blob = new Blob([`${JSON.stringify(model.doc, null, 2)}\n`], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'project-princess-edits.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

async function importEdits(file) {
  if (!file) return;
  try {
    if (file.size > 2 * 1024 * 1024) throw new Error('Edit files must be smaller than 2 MB.');
    const imported = JSON.parse(await file.text());
    if (!confirm('Importing replaces studio-authored edits. Custom entities absent from the import are permanently removed and their IDs cannot be restored from a later backup. Archive them instead to allow restoration. Original source content and player save slots stay intact. Export your edits first. Continue?')) return;
    if (await saveProject(imported)) {
      model.datasets.clear();
      await showView();
    }
  } catch (error) { message(error.message, true); }
}

function renderShell() {
  root.innerHTML = `
    <a class="skip-link" href="#studio-content">Skip to editor</a>
    <aside class="rail" aria-label="Studio navigation">
      <a class="brand" href="${escapeHtml(gameURL)}"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="brand-copy"><strong>Princess</strong><small>DEVELOPER STUDIO</small></span></a>
      <div class="rail-rule" aria-hidden="true"></div>
      <nav class="primary-nav"><p class="nav-label">EDIT YOUR WORLD</p>${tabs.map(([id, title, description]) =>
        `<button type="button" class="nav-item" data-section="${id}" data-testid="nav-${id}"><span><strong>${title}</strong><small class="nav-description">${description}</small></span></button>`).join('')}</nav>
      <div class="rail-bottom"><div class="local-note"><span class="local-indicator" aria-hidden="true"></span><span><strong>Development only</strong><small>This studio is not shipped with the published game.</small></span></div><a class="profile-link" href="${escapeHtml(gameURL)}" target="_blank" rel="noopener"><span class="profile-stamp">PP</span><span class="profile-copy"><strong>Open game preview</strong><small>Test saved changes</small></span></a></div>
    </aside>
    <div class="studio-frame">
      <header class="topbar"><div class="breadcrumbs"><span>Project Princess</span><span>/</span><strong>Creator workspace</strong></div><span id="save-state" class="save-state" role="status" data-testid="save-state"></span></header>
      <main class="workspace">
        <div class="page-heading"><div><p class="eyebrow">DEVELOPER STUDIO</p><h1 id="studio-heading"></h1><p class="intro">Edit game content without replacing the original source or touching player saves.</p></div></div>
        <div class="studio-actions"><button id="save-project" class="studio-button primary" data-testid="save-project">Save to project</button><button id="discard-drafts" class="studio-button" data-testid="discard-drafts">Discard drafts</button><button id="export-edits" class="studio-button" data-testid="export-edits">Export edits</button><button id="import-edits" class="studio-button" data-testid="import-edits">Import edits</button><input id="import-file" type="file" accept=".json,application/json" hidden><button id="restore-defaults" class="studio-button subtle" data-testid="restore-defaults">Restore original content</button></div>
        <p id="studio-message" class="studio-message" role="status" aria-live="polite">Changes are validated and saved as a separate authoring file. Your original game data stays intact.</p>
        <section id="studio-content" aria-label="Content editor"></section>
        <footer class="workspace-footer"><span>Saved edits become part of the next game build.</span><span>Studio editing endpoints run only in development.</span></footer>
      </main>
    </div>`;
  for (const button of root.querySelectorAll('[data-section]')) {
    button.onclick = () => { model.active = button.dataset.section; rememberView('section', model.active); showView(); };
  }
  document.getElementById('save-project').onclick = () => saveProject();
  document.getElementById('export-edits').onclick = exportEdits;
  document.getElementById('discard-drafts').onclick = () => {
    if (!confirm('Discard the unsaved studio draft? Saved project edits and player saves are not affected.')) return;
    model.doc = clone(model.saved);
    model.datasets.clear();
    model.dirty = false;
    updateSaveState();
    message('Unsaved draft discarded.');
    showView();
  };
  document.getElementById('import-edits').onclick = () => document.getElementById('import-file').click();
  document.getElementById('import-file').onchange = event => {
    importEdits(event.target.files[0]);
    event.target.value = '';
  };
  document.getElementById('restore-defaults').onclick = async () => {
    if (!confirm('Remove all studio-authored changes and return to original content? Custom entity IDs will be permanently reserved and cannot be restored from a backup. Archive individual entities instead to keep them restorable. Artwork files and player save slots stay intact. Export your edits first.')) return;
    if (await saveProject({ version: 1, maps: {}, data: {} })) {
      model.datasets.clear();
      await showView();
    }
  };
  updateSaveState();
}

window.addEventListener('beforeunload', event => {
  if (model.dirty && !model.saving) { event.preventDefault(); event.returnValue = ''; }
});

try {
  model.catalog = await request('catalog');
  model.doc = clone(model.catalog.saved);
  model.saved = clone(model.catalog.saved);
  model.revision = model.catalog.revision;
  renderShell();
  await showView();
} catch (error) {
  root.innerHTML = `<main class="workspace"><h1>Studio unavailable</h1><p class="studio-error">${escapeHtml(error.message)}</p><p>The studio needs the development server. The normal game remains available.</p><a href="${escapeHtml(gameURL)}">Open Project Princess</a></main>`;
}
