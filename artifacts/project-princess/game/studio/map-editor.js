import { clone, escapeHtml, readView, rememberView } from './utils.js';

const colours = {
  '.': '#91b267', ',': '#829c56', '"': '#547943', L: '#71a252',
  '#': '#676b70', '+': '#77746e', f: '#c5beac', '~': '#6394ac',
  d: '#987853', z: '#aaa99f', c: '#aba898', b: '#ad8169',
  r: '#665957', W: '#aa9a80', V: '#aaa294', R: '#c39a78', Y: '#c9b990',
};

export async function mountMapEditor(container, context, active) {
  let regionId = context.catalog.regions.find(region => region.id === 'allen')?.id || context.catalog.regions[0].id;
  const previousRegion = readView('region', regionId);
  if (context.catalog.regions.some(region => region.id === previousRegion)) regionId = previousRegion;
  let map;
  let cell = 16;
  let mode = 'select';
  let selectedObject = null;
  let selectedExit = null;
  let drag = null;
  let showGrid = true;
  let showCollision = false;
  const undo = [];
  const images = new Map();
  const kindMap = new Map(context.catalog.objectKinds.map(kind => [kind.id, kind]));
  const edits = () => context.document.maps[regionId] || {};
  function writable() {
    context.document.maps[regionId] ||= {};
    const edit = context.document.maps[regionId];
    edit.tiles ||= [];
    edit.objects ||= { move: [], add: [], remove: [] };
    edit.exits ||= { update: [], add: [], remove: [] };
    return edit;
  }
  function remember() { undo.push(clone(context.document.maps[regionId] || null)); if (undo.length > 30) undo.shift(); }
  function changed() { context.changed(); draw(); updateCounts(); }

  container.innerHTML = `
    <div class="studio-map-toolbar">
      <label class="studio-field"><span>Area</span><select id="map-region" data-testid="map-region">${context.catalog.regions.map(region =>
        `<option value="${region.id}">${escapeHtml(region.name)}</option>`).join('')}</select></label>
      <label class="studio-field"><span>Tool</span><select id="map-tool" data-testid="map-tool"><option value="select">Select / drag prop</option><option value="paint">Paint terrain</option><option value="place">Place prop</option><option value="exit">Select exit</option></select></label>
      <label class="studio-field"><span>Terrain brush</span><select id="tile-brush" data-testid="tile-brush">${context.catalog.tiles.map(tile => `<option value="${escapeHtml(tile.id)}">${escapeHtml(tile.name)}</option>`).join('')}</select></label>
      <label class="studio-field"><span>Prop</span><select id="object-kind" data-testid="object-kind">${context.catalog.objectKinds.map(kind => `<option value="${kind.id}">${escapeHtml(kind.id)}</option>`).join('')}</select></label>
      <label class="studio-field"><span>Variant</span><input id="object-variant" placeholder="Default variant" data-testid="object-variant"></label>
    </div>
    <div class="studio-map-options"><label><input id="show-grid" type="checkbox" checked> Grid</label><label><input id="show-collision" type="checkbox"> Collision footprint</label><label>Zoom <select id="map-zoom"><option value="12">Small</option><option value="16" selected>Normal</option><option value="24">Large</option><option value="32">Extra large</option></select></label><button class="studio-button" id="undo-map" data-testid="undo-map">Undo map edit</button><button class="studio-button subtle" id="revert-map" data-testid="revert-map">Revert this area</button><span id="map-counts" class="studio-muted"></span></div>
    <div class="studio-map-layout"><div class="studio-map-scroll"><canvas id="map-canvas" aria-label="Editable world map" data-testid="map-canvas"></canvas><p class="studio-muted">Select a prop to drag it. Paint terrain or place a prop by clicking a tile. Existing artwork is used when available.</p></div>
      <aside class="studio-inspector"><h3>Prop inspector</h3><select id="object-picker" aria-label="Select a prop"></select><div id="object-inspector"><p class="studio-muted">Select a prop on the map.</p></div>
      <hr><h3>Exit inspector</h3><select id="exit-picker" aria-label="Select an exit"></select><div class="studio-coordinate-grid"><label class="studio-field"><span>X</span><input id="exit-x" type="number" value="0"></label><label class="studio-field"><span>Y</span><input id="exit-y" type="number" value="0"></label><label class="studio-field"><span>Width</span><input id="exit-w" type="number" value="1" min="1"></label><label class="studio-field"><span>Height</span><input id="exit-h" type="number" value="1" min="1"></label></div>
      <label class="studio-field"><span>Destination</span><select id="exit-destination"><option value="">Message only</option>${context.catalog.regions.map(region => `<option value="${region.id}">${escapeHtml(region.name)}</option>`).join('')}</select></label>
      <label class="studio-field"><span>Arrival entry</span><select id="exit-entry"></select></label><label class="studio-field"><span>Label</span><input id="exit-label" value="Exit"></label>
      <div class="studio-actions"><button id="update-exit" class="studio-button" data-testid="update-exit">Update exit</button><button id="add-exit" class="studio-button" data-testid="add-exit">Add exit</button><button id="remove-exit" class="studio-button subtle" data-testid="remove-exit">Remove exit</button></div>
      <p class="studio-muted">Connections are directional. Add or update the return exit in the destination area too. Existing progression locks are preserved when updating an exit.</p></aside></div>`;
  const canvas = container.querySelector('#map-canvas');
  const drawing = canvas.getContext('2d');
  const control = id => container.querySelector(`#${id}`);
  const npcPanel = document.createElement('section');
  npcPanel.innerHTML = `<hr><h3>Custom character placements</h3>
    <label class="studio-field"><span>Character</span><select id="npc-character" data-testid="npc-character">${Object.entries(context.document.custom?.npcs || {}).map(([id, npc]) =>
      `<option value="${escapeHtml(id)}">${escapeHtml(npc.record.name)} (${escapeHtml(id)})</option>`).join('')}</select></label>
    <label class="studio-field"><span>Placement</span><select id="npc-placement" data-testid="npc-placement"></select></label>
    <div class="studio-coordinate-grid"><label class="studio-field"><span>X</span><input id="npc-x" type="number" value="1"></label><label class="studio-field"><span>Y</span><input id="npc-y" type="number" value="1"></label></div>
    <label class="studio-field"><span>Schedule place ID</span><input id="npc-at" value="home" data-testid="npc-at"></label>
    <div class="studio-actions"><button class="studio-button" id="add-npc" data-testid="add-npc">Add placement</button><button class="studio-button" id="move-npc" data-testid="move-npc">Update placement</button><button class="studio-button subtle" id="remove-npc" data-testid="remove-npc">Remove placement</button></div>
    <p class="studio-muted">Create characters in Characters & shops first. Select a placement to update or remove it. Place IDs link to schedule rules; the last placement cannot be removed unless you also remove the character before saving.</p>`;
  container.querySelector('.studio-inspector').append(npcPanel);
  const placements = () => edits().npcs || [];
  const npcValues = () => ({ id: control('npc-character').value,
    x: Number(control('npc-x').value), y: Number(control('npc-y').value), at: control('npc-at').value.trim() });
  function editNpc(add) {
    const npc = npcValues();
    if (!npc.id || !npc.at || !Number.isInteger(npc.x) || !Number.isInteger(npc.y) ||
        npc.x < 0 || npc.y < 0 || npc.x >= map.w || npc.y >= map.h) {
      context.message('Choose a custom character, valid tile coordinates, and a schedule place ID.', true); return;
    }
    const index = Number(control('npc-placement').value);
    if (!add && control('npc-placement').value === '') return;
    remember();
    writable().npcs ||= [];
    if (add) writable().npcs.push(npc);
    else writable().npcs[index] = npc;
    changed();
  }
  control('add-npc').onclick = () => editNpc(true);
  control('move-npc').onclick = () => editNpc(false);
  control('remove-npc').onclick = () => {
    if (control('npc-placement').value === '') return;
    const index = Number(control('npc-placement').value);
    if (!confirm('Remove this character placement? Remove linked schedule rules too, or keep another placement with the same place ID.')) return;
    remember(); writable().npcs.splice(index, 1); changed();
  };
  control('npc-placement').onchange = () => {
    const npc = placements()[Number(control('npc-placement').value)];
    if (!npc || control('npc-placement').value === '') return;
    for (const [key, value] of Object.entries(npc)) control(`npc-${key === 'id' ? 'character' : key}`).value = value;
  };

  function effectiveObjects() {
    const edit = edits().objects || {};
    const moves = new Map((edit.move || []).map(move => [move.index, move]));
    const result = map.objects.map((object, index) => ({
      ...object, ...moves.get(index), _base: index,
    })).filter(object => !(edit.remove || []).includes(object._base));
    for (const [index, object] of (edit.add || []).entries()) {
      const [w, h] = kindMap.get(object.kind)?.foot || [1, 1];
      result.push({ ...object, w, h, _added: index });
    }
    return result;
  }
  function effectiveExits() {
    const edit = edits().exits || {};
    const updates = new Map((edit.update || []).map(update => [update.index, update]));
    return map.exits.map((exit, index) => ({ ...exit, ...updates.get(index), _base: index }))
      .filter(exit => !(edit.remove || []).includes(exit._base))
      .concat((edit.add || []).map((exit, index) => ({ ...exit, _added: index })));
  }
  const objectKey = object => object._base !== undefined ? `base:${object._base}` : `added:${object._added}`;
  const exitKey = exit => exit._base !== undefined ? `base:${exit._base}` : `added:${exit._added}`;
  function imageFor(object) {
    const variant = String(object.v || '').split(':')[0];
    const names = [`${object.kind}${variant ? `-${variant}` : ''}.png`, `${object.kind}.png`];
    let url;
    for (const name of names) {
      if (context.catalog.spriteFiles.active.includes(name)) { url = new URL(`../assets/sprites/objects/${name}`, import.meta.url).href; break; }
      if (context.catalog.spriteFiles.templates.includes(name)) { url = new URL(`../assets/sprites/templates/objects/${name}`, import.meta.url).href; break; }
    }
    if (!url) return null;
    if (!images.has(url)) {
      const image = new Image();
      image.onload = () => { if (active()) draw(); };
      image.src = url;
      images.set(url, image);
    }
    const image = images.get(url);
    return image.complete && image.naturalWidth ? image : null;
  }
  function draw() {
    if (!map || !active()) return;
    canvas.width = map.w * cell;
    canvas.height = map.h * cell;
    drawing.imageSmoothingEnabled = false;
    const rows = map.ground.map(row => row.split(''));
    for (const tile of edits().tiles || []) if (rows[tile.y]?.[tile.x] !== undefined) rows[tile.y][tile.x] = tile.tile;
    for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
      drawing.fillStyle = colours[rows[y][x]] || '#ded2b8';
      drawing.fillRect(x * cell, y * cell, cell, cell);
      if (showCollision && '~rWVRY'.includes(rows[y][x])) {
        drawing.fillStyle = '#bf37386e'; drawing.fillRect(x * cell, y * cell, cell, cell);
      }
    }
    for (const object of effectiveObjects().sort((a, b) => a.y + a.h - b.y - b.h)) {
      const image = imageFor(object);
      if (image) {
        const w = image.naturalWidth * cell / 16, h = image.naturalHeight * cell / 16;
        drawing.drawImage(image, (object.x + object.w / 2) * cell - w / 2, (object.y + object.h) * cell - h, w, h);
      } else {
        drawing.fillStyle = '#465642aa'; drawing.fillRect(object.x * cell, object.y * cell, object.w * cell, object.h * cell);
        if (object.w > 1) { drawing.fillStyle = '#fff6de'; drawing.font = '9px monospace'; drawing.fillText(object.kind.slice(0, 12), object.x * cell + 2, object.y * cell + 10); }
      }
      if (showCollision && kindMap.get(object.kind)?.solid) {
        drawing.strokeStyle = '#bf3738'; drawing.lineWidth = 1;
        drawing.strokeRect(object.x * cell + .5, object.y * cell + .5, object.w * cell - 1, object.h * cell - 1);
      }
      if (selectedObject && objectKey(object) === selectedObject) {
        drawing.strokeStyle = '#20b9df'; drawing.lineWidth = 2;
        drawing.strokeRect(object.x * cell, object.y * cell, object.w * cell, object.h * cell);
      }
    }
    if (showGrid) {
      drawing.strokeStyle = '#273c322b'; drawing.lineWidth = .5;
      for (let x = 0; x <= map.w; x++) { drawing.beginPath(); drawing.moveTo(x * cell, 0); drawing.lineTo(x * cell, canvas.height); drawing.stroke(); }
      for (let y = 0; y <= map.h; y++) { drawing.beginPath(); drawing.moveTo(0, y * cell); drawing.lineTo(canvas.width, y * cell); drawing.stroke(); }
    }
    for (const exit of effectiveExits()) {
      drawing.strokeStyle = selectedExit === exitKey(exit) ? '#20b9df' : '#e9b65d'; drawing.lineWidth = 3;
      drawing.strokeRect(exit.x * cell + 1, exit.y * cell + 1, exit.w * cell - 2, exit.h * cell - 2);
    }
    for (const npc of placements()) {
      drawing.fillStyle = '#20b9df';
      drawing.beginPath(); drawing.arc((npc.x + .5) * cell, (npc.y + .5) * cell, cell / 3, 0, Math.PI * 2); drawing.fill();
      drawing.fillStyle = '#182e37'; drawing.font = '10px monospace';
      drawing.fillText(npc.id, npc.x * cell, npc.y * cell - 2);
    }
  }
  function updateCounts() {
    const edit = edits();
    control('map-counts').textContent = `${map.w} × ${map.h} tiles · ${effectiveObjects().length} props · ${(edit.tiles || []).length} painted tiles`;
    control('undo-map').disabled = !undo.length;
    const objectPicker = control('object-picker');
    objectPicker.innerHTML = '<option value="">Select a prop…</option>' + effectiveObjects().map(object =>
      `<option value="${objectKey(object)}">${escapeHtml(object.kind)} (${object.x}, ${object.y})</option>`).join('');
    objectPicker.value = selectedObject || '';
    const exitPicker = control('exit-picker');
    exitPicker.innerHTML = '<option value="">Select an exit…</option>' + effectiveExits().map(exit =>
      `<option value="${exitKey(exit)}">${escapeHtml(exit.label || exit.to || 'Exit')}</option>`).join('');
    exitPicker.value = selectedExit || '';
    const npcPicker = control('npc-placement');
    const selectedNpc = npcPicker.value;
    npcPicker.innerHTML = '<option value="">Select a placement…</option>' + placements().map((npc, index) =>
      `<option value="${index}">${escapeHtml(npc.id)} / ${escapeHtml(npc.at)} (${npc.x}, ${npc.y})</option>`).join('');
    npcPicker.value = selectedNpc;
  }
  function moveObject(object, x, y) {
    if (x < 0 || y < 0 || x + object.w > map.w || y + object.h > map.h) return;
    const edit = writable().objects;
    if (object._added !== undefined) Object.assign(edit.add[object._added], { x, y });
    else {
      const existing = edit.move.find(move => move.index === object._base);
      if (existing) Object.assign(existing, { x, y });
      else edit.move.push({ index: object._base, x, y });
    }
    changed();
  }
  function inspectObject() {
    const object = effectiveObjects().find(item => objectKey(item) === selectedObject);
    const area = control('object-inspector');
    if (!object) { area.innerHTML = '<p class="studio-muted">Select a prop on the map.</p>'; return; }
    area.innerHTML = `<p class="studio-code-label">${escapeHtml(object.kind)} ${escapeHtml(object.v || '')}</p><div class="studio-coordinate-grid"><label class="studio-field"><span>X</span><input id="object-x" type="number" value="${object.x}" data-testid="object-x"></label><label class="studio-field"><span>Y</span><input id="object-y" type="number" value="${object.y}" data-testid="object-y"></label></div><div class="studio-actions"><button class="studio-button" id="move-object" data-testid="move-object">Move prop</button><button class="studio-button subtle" id="remove-object" data-testid="remove-object">Remove prop</button></div>`;
    control('move-object').onclick = () => { remember(); moveObject(object, Number(control('object-x').value), Number(control('object-y').value)); inspectObject(); };
    control('remove-object').onclick = () => {
      if (!confirm(`Remove this ${object.kind} from the area? Original map code stays intact; the change is only applied after saving.`)) return;
      remember();
      if (object._added !== undefined) writable().objects.add.splice(object._added, 1);
      else writable().objects.remove.push(object._base);
      selectedObject = null; changed(); inspectObject();
    };
  }
  async function arrivalEntries(destination, selected = '') {
    const dropdown = control('exit-entry');
    dropdown.innerHTML = '';
    if (!destination) { dropdown.innerHTML = '<option value="">None</option>'; return; }
    const target = await context.request(`map?id=${encodeURIComponent(destination)}`);
    if (!active()) return;
    dropdown.innerHTML = Object.keys(target.map.entries).map(key => `<option value="${escapeHtml(key)}">${escapeHtml(key)}</option>`).join('');
    if (selected && [...dropdown.options].some(option => option.value === selected)) dropdown.value = selected;
  }
  async function inspectExit() {
    const exit = effectiveExits().find(item => exitKey(item) === selectedExit);
    if (!exit) return;
    for (const key of ['x', 'y', 'w', 'h']) control(`exit-${key}`).value = exit[key];
    control('exit-destination').value = exit.to || '';
    control('exit-label').value = exit.label || '';
    await arrivalEntries(exit.to, exit.entry);
    draw();
  }
  function exitValues() {
    return {
      x: Number(control('exit-x').value), y: Number(control('exit-y').value),
      w: Number(control('exit-w').value), h: Number(control('exit-h').value),
      to: control('exit-destination').value || null,
      entry: control('exit-entry').value || null, label: control('exit-label').value,
    };
  }
  function coordinates(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor((event.clientX - rect.left) / rect.width * map.w),
      y: Math.floor((event.clientY - rect.top) / rect.height * map.h),
    };
  }
  function paint(x, y) {
    if (x < 0 || y < 0 || x >= map.w || y >= map.h) return;
    const tiles = writable().tiles;
    const existing = tiles.find(tile => tile.x === x && tile.y === y);
    if (existing) existing.tile = control('tile-brush').value;
    else tiles.push({ x, y, tile: control('tile-brush').value });
    changed();
  }
  canvas.onpointerdown = event => {
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    const { x, y } = coordinates(event);
    if (mode === 'paint') { remember(); drag = { paint: true }; paint(x, y); }
    else if (mode === 'place') {
      const kind = control('object-kind').value;
      const [w, h] = kindMap.get(kind).foot;
      if (x + w > map.w || y + h > map.h) { context.message('That prop footprint would extend outside the area.', true); return; }
      remember(); const add = writable().objects.add;
      add.push({ kind, x, y, v: control('object-variant').value || kindMap.get(kind).variants[0] || '' });
      selectedObject = `added:${add.length - 1}`; changed(); inspectObject();
    } else if (mode === 'exit') {
      const exit = effectiveExits().find(item => x >= item.x && y >= item.y && x < item.x + item.w && y < item.y + item.h);
      selectedExit = exit ? exitKey(exit) : null;
      control('exit-x').value = x; control('exit-y').value = y;
      if (exit) inspectExit();
      updateCounts(); draw();
    } else {
      const object = effectiveObjects().reverse().find(item => x >= item.x && y >= item.y && x < item.x + item.w && y < item.y + item.h);
      selectedObject = object ? objectKey(object) : null;
      drag = object ? { object, offsetX: x - object.x, offsetY: y - object.y, started: false } : null;
      updateCounts(); inspectObject(); draw();
    }
  };
  canvas.onpointermove = event => {
    if (!drag) return;
    const { x, y } = coordinates(event);
    if (drag.paint) paint(x, y);
    else {
      if (!drag.started) { remember(); drag.started = true; }
      moveObject(drag.object, x - drag.offsetX, y - drag.offsetY);
      inspectObject();
    }
  };
  canvas.onpointerup = canvas.onpointercancel = () => { drag = null; };
  control('map-tool').onchange = event => { mode = event.target.value; };
  control('map-zoom').onchange = event => { cell = Number(event.target.value); draw(); };
  control('show-grid').onchange = event => { showGrid = event.target.checked; draw(); };
  control('show-collision').onchange = event => { showCollision = event.target.checked; draw(); };
  control('object-picker').onchange = event => { selectedObject = event.target.value || null; inspectObject(); draw(); };
  control('exit-picker').onchange = event => { selectedExit = event.target.value || null; inspectExit(); };
  control('exit-destination').onchange = event => arrivalEntries(event.target.value).catch(error => context.message(error.message, true));
  control('undo-map').onclick = () => {
    if (!undo.length) return;
    const previous = undo.pop();
    if (previous) context.document.maps[regionId] = previous;
    else delete context.document.maps[regionId];
    selectedObject = selectedExit = null; changed(); inspectObject();
  };
  control('revert-map').onclick = () => {
    if (!confirm('Remove this area’s studio edits and use the original map? Save afterward to apply the reset.')) return;
    remember(); delete context.document.maps[regionId]; selectedObject = selectedExit = null; changed(); inspectObject();
  };
  control('update-exit').onclick = () => {
    const exit = effectiveExits().find(item => exitKey(item) === selectedExit);
    if (!exit) { context.message('Select an existing exit first, or use Add exit.', true); return; }
    remember();
    if (exit._added !== undefined) Object.assign(writable().exits.add[exit._added], exitValues());
    else {
      const updates = writable().exits.update;
      const update = updates.find(item => item.index === exit._base);
      if (update) Object.assign(update, exitValues());
      else updates.push({ index: exit._base, ...exitValues() });
    }
    changed();
  };
  control('add-exit').onclick = () => {
    remember(); const added = writable().exits.add; const values = exitValues();
    if (!values.to) values.lines = [values.label];
    added.push(values); selectedExit = `added:${added.length - 1}`; changed();
  };
  control('remove-exit').onclick = () => {
    const exit = effectiveExits().find(item => exitKey(item) === selectedExit);
    if (!exit || !confirm('Remove this exit? This can make routes one-way or cut off an area. The original exit can be restored with Revert this area.')) return;
    remember();
    if (exit._added !== undefined) writable().exits.add.splice(exit._added, 1);
    else writable().exits.remove.push(exit._base);
    selectedExit = null; changed();
  };
  async function loadRegion() {
    const loaded = await context.request(`map?id=${encodeURIComponent(regionId)}`);
    if (!active()) return;
    map = loaded.map; undo.length = 0; selectedObject = selectedExit = null;
    updateCounts(); inspectObject(); draw();
  }
  control('map-region').value = regionId;
  control('map-region').onchange = async event => {
    regionId = event.target.value;
    rememberView('region', regionId);
    try { await loadRegion(); } catch (error) { context.message(error.message, true); }
  };
  await loadRegion();
}
