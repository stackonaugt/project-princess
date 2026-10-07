import { clone, element, escapeHtml, field, label, readView, rememberView } from './utils.js';
import { dataset, overlayCustom, persistCollection, removalReferences, scheduleCharacters } from './custom-content.js';
import { artworkPicker } from './art-picker.js';

const titles = {
  PETS: 'Pets', MOVES: 'Battle moves', PET_MOVES: 'Pet move lists', ITEMS: 'Items',
  PEOPLE: 'Character dialogue', PET_TEXT: 'Pet dialogue', PLACES: 'Place descriptions',
  NPCS: 'Character information', SHOPS: 'Shops & inventory',
  ROUTINE_OVERRIDES: 'Schedule overrides', CHAPTERS: 'Chapter cards', GOALS: 'Chapter goals',
  CH1: 'Chapter 1 requirements', CH4: 'Chapter 4 requirements',
};
const dictionaries = new Set([
  'PEOPLE', 'PET_TEXT', 'PLACES', 'NPCS', 'SHOPS', 'ROUTINE_OVERRIDES', 'MOVES',
  'PET_MOVES', 'ITEMS', 'CHAPTERS', 'GOALS', 'SCHOOL_LINES', 'RECIPES',
  'PRANKS', 'PARTY_STORIES',
]);
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function blankLike(value) {
  if (Array.isArray(value)) return [];
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, blankLike(item)]));
  if (typeof value === 'number') return 0;
  if (typeof value === 'boolean') return false;
  return '';
}

export async function mountDataEditor(container, context, sectionId, active) {
  const datasets = await dataset(context, sectionId);
  overlayCustom(datasets, context.document);
  if (!active()) return;
  const options = Object.entries(datasets).flatMap(([file, values]) =>
    Object.keys(values).map(name => ({ file, name, value: `${file}|${name}` })));
  let selected = options.find(option => option.value === readView(`collection:${sectionId}`, '')) || options[0];
  let selectedRecord = readView(`record:${sectionId}`, '');
  let search = '';

  container.innerHTML = `
    <div class="studio-view-heading"><div><h2>Edit game content</h2><p class="studio-muted">Create or duplicate pets and characters with explicit stable IDs. Built-in IDs stay fixed; changes reach the game after saving.</p></div></div>
    <label class="studio-field"><span>Collection</span><select id="data-collection" data-testid="data-collection">${options.map(option =>
      `<option value="${escapeHtml(option.value)}">${escapeHtml(titles[option.name] || label(option.name))} — ${escapeHtml(option.file.split('/').at(-1))}</option>`).join('')}</select></label>
    <div class="studio-data-layout"><aside class="studio-record-list"><input id="record-search" type="search" placeholder="Find a record…" aria-label="Find a record"><div id="data-records"></div></aside><section id="record-fields" class="studio-inspector" aria-label="Record inspector"></section></div>`;
  const collectionControl = container.querySelector('#data-collection');
  collectionControl.value = selected.value;
  const list = container.querySelector('#data-records');
  const inspector = container.querySelector('#record-fields');

  const current = () => datasets[selected.file][selected.name];
  const entityId = () => selected.name === 'PETS' ? current()[selectedRecord]?.id : selectedRecord;
  const entityKind = () => selected.name === 'PETS' ? 'pets' : 'npcs';
  const customEntity = () => ['PETS', 'NPCS'].includes(selected.name) ?
    context.document.custom?.[entityKind()]?.[entityId()] : null;
  function records() {
    const value = current();
    if (selected.name === 'PETS' || (Array.isArray(value) && value[0] && typeof value[0] === 'object')) {
      return value.map((record, index) => ({ key: String(index), title: (record.name || record.id || record.question || `Entry ${index + 1}`) +
        (selected.name === 'PETS' && context.document.custom?.pets?.[record.id]?.archived ? ' [Archived]' : '') }));
    }
    if (dictionaries.has(selected.name)) {
      return Object.entries(value).map(([key, record]) => ({ key, title: (record?.name || key) +
        (selected.name === 'NPCS' && context.document.custom?.npcs?.[key]?.archived ? ' [Archived]' : '') }));
    }
    return [{ key: '', title: titles[selected.name] || label(selected.name) }];
  }
  const recordPath = () => dictionaries.has(selected.name) ||
    (Array.isArray(current()) && current()[0] && typeof current()[0] === 'object') ||
    selected.name === 'PETS' ? [selectedRecord] : [];

  function getAt(path, target = selected) {
    if (path[0]?.startsWith('@')) {
      let value = customEntity()[path[0].slice(1)];
      for (const key of path.slice(1)) value = value[key];
      return value;
    }
    let value = datasets[target.file][target.name];
    for (const key of path) value = value[key];
    return value;
  }
  function setAt(path, value, target = selected) {
    if (path[0]?.startsWith('@')) {
      if (path.length === 1) customEntity()[path[0].slice(1)] = value;
      else getAt(path.slice(0, -1))[path.at(-1)] = value;
      for (const data of context.datasets.values()) overlayCustom(data, context.document);
      context.changed();
      return;
    }
    if (!path.length) datasets[target.file][target.name] = value;
    else {
      const parent = getAt(path.slice(0, -1), target);
      parent[path.at(-1)] = value;
    }
    persistCollection(context, sectionId, target.file, target.name, datasets[target.file][target.name]);
  }

  function renderList() {
    const all = records();
    const visible = all.filter(record => `${record.title} ${record.key}`.toLowerCase().includes(search.toLowerCase()));
    if (!all.some(record => record.key === selectedRecord)) selectedRecord = all[0]?.key ?? '';
    list.replaceChildren();
    for (const record of visible) {
      list.append(element('button', {
        className: `studio-record${record.key === selectedRecord ? ' selected' : ''}`,
        type: 'button', text: record.title,
        'data-testid': `record-${selected.name}-${record.key || 'root'}`,
        onclick: () => { selectedRecord = record.key; rememberView(`record:${sectionId}`, selectedRecord); renderList(); renderInspector(); },
      }));
    }
    if (!visible.length) list.append(element('p', { className: 'studio-muted', text: 'No matching records.' }));
    if (['PETS', 'NPCS'].includes(selected.name)) {
      const idInput = element('input', { placeholder: 'e.g. custom_milo', 'data-testid': 'new-entity-id' });
      const nameInput = element('input', { placeholder: 'Display name', 'data-testid': 'new-entity-name' });
      const create = async duplicate => {
        const id = idInput.value.trim(), name = nameInput.value.trim();
        const kind = entityKind();
        const taken = [...context.catalog.builtIn[kind], ...Object.keys(context.document.custom?.[kind] || {}),
          ...(context.document.retiredIds?.[kind] || [])];
        if (!/^[a-z][a-z0-9_]{1,47}$/.test(id) || taken.includes(id) ||
            ['constructor', 'prototype', '__proto__'].includes(id) || !name) {
          context.message('Enter a unique lowercase ID (2–48 letters, numbers or underscores) and a display name.', true);
          return;
        }
        const target = selected;
        const sourceId = entityId();
        const record = clone(kind === 'pets' ? current()[selectedRecord] || current()[0] : current()[selectedRecord] || Object.values(current())[0]);
        const story = await dataset(context, 'story');
        const gameplay = kind === 'pets' ? await dataset(context, 'gameplay') : null;
        if (!active() || target !== selected) return;
        const text = clone(story['data/dialogue.js'][kind === 'pets' ? 'PET_TEXT' : 'PEOPLE'][sourceId]);
        if (!text) { context.message('Choose a template with dialogue first.', true); return; }
        record.name = name;
        if (kind === 'pets') record.id = id;
        if (!duplicate && kind === 'npcs') { delete record.gift; delete record.shop; }
        if (!duplicate) text.lines = kind === 'pets' ? clone(text.lines) : [[`Hello, I'm ${name}.`]];
        context.document.custom ||= { pets: {}, npcs: {} };
        context.document.custom[kind][id] = { record, text,
          ...(duplicate && context.document.custom[kind][sourceId]?.art ?
            { art: clone(context.document.custom[kind][sourceId].art) } : {}), ...(kind === 'pets' ?
          { moves: clone(gameplay['data/moves.js'].PET_MOVES[sourceId]) } : {}) };
        for (const data of context.datasets.values()) overlayCustom(data, context.document);
        selectedRecord = kind === 'pets' ? String(current().findIndex(pet => pet.id === id)) : id;
        rememberView(`record:${sectionId}`, selectedRecord);
        context.changed(); renderList(); renderInspector();
        if (kind === 'npcs') context.message('Character created in your draft. Place it in World maps before saving.');
      };
      list.append(field('New stable ID', idInput), field('Display name', nameInput),
        element('button', { className: 'studio-button', text: 'Create new', 'data-testid': 'create-entity', onclick: () => create(false).catch(error => context.message(error.message, true)) }),
        element('button', { className: 'studio-button subtle', text: 'Duplicate selected', 'data-testid': 'duplicate-entity', onclick: () => create(true).catch(error => context.message(error.message, true)) }));
    }
    if (selected.name === 'ROUTINE_OVERRIDES') {
      const select = element('select', { 'aria-label': 'Character for a schedule', 'data-testid': 'schedule-character' });
      for (const character of scheduleCharacters(context)) {
        select.append(element('option', { value: character.id, text: character.name }));
      }
      list.append(field('Add a schedule', select), element('button', {
        className: 'studio-button', text: 'Add schedule rules', type: 'button', 'data-testid': 'add-schedule',
        onclick: () => {
          const character = scheduleCharacters(context).find(item => item.id === select.value);
          if (!character) return;
          if (current()[character.id]) { selectedRecord = character.id; renderList(); renderInspector(); return; }
          const value = clone(current());
          value[character.id] = [{ days: [], from: 540, until: 1020, place: character.places[0] }];
          setAt([], value);
          selectedRecord = character.id;
          renderList();
          renderInspector();
        },
      }));
    }
  }

  function renderValue(value, path, title, depth = 0) {
    const target = selected;
    const setValue = (path, value) => setAt(path, value, target);
    const testId = `field-${selected.name}-${path.join('-') || 'root'}`;
    if (Array.isArray(value)) {
      const box = element('fieldset', { className: 'studio-nested' }, [element('legend', { text: label(title) })]);
      value.forEach((item, index) => {
        const row = element('div', { className: 'studio-array-row' }, [
          renderValue(item, [...path, String(index)], `Entry ${index + 1}`, depth + 1),
        ]);
        if (!['home', 'sleeps'].includes(String(path.at(-1)))) {
          row.append(element('button', {
            className: 'studio-button subtle', text: 'Remove', type: 'button',
            onclick: () => { const next = clone(value); next.splice(index, 1); setValue(path, next); renderInspector(); },
          }));
        }
        box.append(row);
      });
      if (!['home', 'sleeps'].includes(String(path.at(-1)))) box.append(element('button', {
        className: 'studio-button', text: 'Add entry', type: 'button', 'data-testid': `${testId}-add`,
        onclick: () => {
          let nextItem = value.length ? blankLike(value[0]) : '';
          if (title === 'days') nextItem = 'Monday';
          if (selected.name === 'ROUTINE_OVERRIDES' && path.length === 1) {
            const character = scheduleCharacters(context).find(item => item.id === selectedRecord);
            nextItem = { days: [], from: 540, until: 1020, place: character?.places[0] || 'home' };
          }
          setValue(path, [...clone(value), nextItem]);
          renderInspector();
        },
      }));
      return box;
    }
    if (value && typeof value === 'object') {
      const box = element('details', { className: 'studio-nested', open: depth < 2 }, [
        element('summary', { text: label(title) }),
      ]);
      for (const [key, item] of Object.entries(value)) box.append(renderValue(item, [...path, key], key, depth + 1));
      return box;
    }
    if (selected.name === 'ROUTINE_OVERRIDES' && title === 'place') {
      const character = scheduleCharacters(context).find(item => item.id === selectedRecord);
      const select = element('select', { 'data-testid': testId });
      select.append(element('option', { value: '', text: 'Not present anywhere' }));
      for (const place of character?.places || []) select.append(element('option', { value: place, text: place }));
      select.value = value ?? '';
      select.onchange = () => setValue(path, select.value || null);
      return field(title, select);
    }
    if (path.at(-2) === 'days') {
      const select = element('select', { 'data-testid': testId });
      for (const day of weekdays) select.append(element('option', { value: day, text: day }));
      select.value = value;
      select.onchange = () => setValue(path, select.value);
      return field(title, select);
    }
    let input;
    if (typeof value === 'boolean') {
      input = element('input', { type: 'checkbox', checked: value, 'data-testid': testId });
      input.onchange = () => { if (input.isConnected) setValue(path, input.checked); };
    } else if (typeof value === 'number') {
      input = element('input', { type: 'number', step: 'any', value, 'data-testid': testId });
      input.onchange = () => {
        if (input.value === '' || !Number.isFinite(Number(input.value))) { input.value = value; return; }
        if (input.isConnected) setValue(path, Number(input.value));
      };
    } else if (value === null) {
      return element('p', { className: 'studio-muted', text: `${label(title)}: none` });
    } else {
      const multiline = value.length > 80 || value.includes('\n');
      input = element(multiline ? 'textarea' : 'input', {
        value, ...(multiline ? { rows: 3 } : { type: 'text' }), 'data-testid': testId,
        readOnly: title === 'id',
      });
      input.onchange = () => { if (input.isConnected) setValue(path, input.value); };
    }
    return field(title, input);
  }

  function renderInspector() {
    inspector.replaceChildren();
    const all = records();
    if (!all.length) {
      inspector.append(element('h3', { text: 'Add an override when you need one.' }),
        element('p', { className: 'studio-muted', text: 'Existing scripted routines remain active until you add schedule rules for a character.' }));
      return;
    }
    const path = recordPath();
    const value = getAt(path);
    inspector.append(element('h3', { text: all.find(item => item.key === selectedRecord)?.title || titles[selected.name] || selected.name }),
      element('p', { className: 'studio-code-label', text: `${selected.file} / ${selected.name}` }));
    if (selected.name === 'PETS' || selected.name === 'NPCS') {
      inspector.append(element('p', { className: 'studio-muted', text: 'Custom dialogue, moves and supplied artwork are linked below. Built-in artwork stays in the sprite-file workflow; built-in text is edited in Stories & dialogue.' }));
    }
    if (selected.name === 'ROUTINE_OVERRIDES') {
      inspector.append(element('p', { className: 'studio-muted', text: 'Rules take precedence only at matching days and times. Empty days means every day. Times are minutes after midnight (9am = 540, 5pm = 1020). Places match existing NPC placements.' }));
    }
    inspector.append(renderValue(value, path, 'Record'));
    if (selected.name === 'ROUTINE_OVERRIDES') inspector.append(element('button', {
      className: 'studio-button subtle', text: 'Remove schedule override', 'data-testid': 'remove-schedule',
      onclick: () => {
        if (!confirm('Remove these schedule rules? Built-in scripted routines remain intact.')) return;
        const next = clone(current()); delete next[selectedRecord];
        setAt([], next); selectedRecord = ''; renderList(); renderInspector();
      },
    }));
    const entity = customEntity();
    if (entity) {
      inspector.append(element('p', { className: 'studio-muted', text: entity.archived ?
        'Archived: no new world encounters. Owned pets stay in the party, at home and in the Petdex. Placements, schedules, linked content and player history are retained.' :
        'Archive to retire this entity temporarily without losing its ID, linked content or player history.' }));
      inspector.append(element('button', {
        className: 'studio-button', text: entity.archived ? 'Restore custom entity' : 'Archive custom entity',
        'data-testid': 'archive-entity',
        onclick: () => {
          entity.archived = !entity.archived;
          context.changed(); renderList(); renderInspector();
        },
      }));
      inspector.append(artworkPicker(entity, entityKind(), entityId(), context));
      inspector.append(renderValue(entity.text, ['@text'], 'Linked dialogue'));
      if (entity.moves) inspector.append(renderValue(entity.moves, ['@moves'], 'Linked battle moves'));
      inspector.append(element('button', {
        className: 'studio-button subtle', text: 'Remove custom entity', 'data-testid': 'remove-entity',
        onclick: () => {
          const id = entityId(), kind = entityKind();
          const references = removalReferences(context, kind, id);
          if (references.length) { context.message(`Remove references first: ${references.join(', ')}.`, true); return; }
          if (!confirm(`Permanently remove ${id}? Its ID will be reserved and cannot be reused, even by importing a backup. Archive instead if you may want to restore it. Player saves are not edited.`)) return;
          context.document.retiredIds ||= { pets: [], npcs: [] };
          context.document.retiredIds[kind] ||= [];
          if (!context.document.retiredIds[kind].includes(id)) context.document.retiredIds[kind].push(id);
          delete context.document.custom[kind][id];
          for (const data of context.datasets.values()) for (const values of Object.values(data)) {
            for (const name of kind === 'pets' ? ['PETS', 'PET_TEXT', 'PET_MOVES'] : ['NPCS', 'PEOPLE']) {
              if (name === 'PETS' && values[name]) values[name] = values[name].filter(pet => pet.id !== id);
              else if (values[name]) delete values[name][id];
            }
          }
          selectedRecord = ''; context.changed(); renderList(); renderInspector();
        },
      }));
    }
  }

  collectionControl.onchange = () => {
    selected = options.find(option => option.value === collectionControl.value);
    rememberView(`collection:${sectionId}`, selected.value);
    selectedRecord = '';
    search = '';
    container.querySelector('#record-search').value = '';
    renderList();
    renderInspector();
  };
  container.querySelector('#record-search').oninput = event => { search = event.target.value; renderList(); };
  renderList();
  renderInspector();
}
