import { clone, escapeHtml, readView, rememberView } from './utils.js';
import { painter } from '../src/art/paint/painter.js';
import { OBJECTS } from '../src/art/paint/objects.js';
import { paintGround, TILE_NAMES } from '../src/art/paint/tiles.js';
import { resolveSourceObjectIndex, sourceObjectIdentity } from '../src/authoring/map-overrides.js';
import { propArtworkBounds, propArtworkSize } from './prop-artwork.js';
import { terrainWithCurveEdits } from '../src/art/paint/terrain-features.js';
import { mountCurveEditor } from './curve-editor.js';

const rotations = [0, 90, 180, 270];

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
  let pendingPointer = null;
  let frameQueued = false;
  let groundFrame = null;
  let groundCache = null;
  let tileArtCache = null;
  const undo = [];
  const images = new Map();
  const tileImages = new Map();
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
  function changed({ terrain = false } = {}) {
    context.changed();
    if (terrain) { groundCache = null; drawGround(); }
    drawProps();
    draw();
    updateCounts();
  }

  container.innerHTML = `
    <div class="studio-map-toolbar">
      <label class="studio-field"><span>Area</span><select id="map-region" data-testid="map-region">${context.catalog.regions.map(region =>
        `<option value="${region.id}">${escapeHtml(region.name)}</option>`).join('')}</select></label>
      <label class="studio-field"><span>Tool</span><select id="map-tool" data-testid="map-tool"><option value="select">Select / drag prop</option><option value="paint">Paint terrain</option><option value="place">Place prop</option><option value="exit">Select exit</option></select></label>
      <label class="studio-field"><span>Terrain brush</span><select id="tile-brush" data-testid="tile-brush">${context.catalog.tiles.map(tile => `<option value="${escapeHtml(tile.id)}">${escapeHtml(tile.name)}</option>`).join('')}</select></label>
      <div class="studio-asset-preview"><canvas id="tile-preview" width="48" height="48" aria-label="Terrain brush preview"></canvas><label class="studio-field"><span>Terrain artwork rotation</span><select id="tile-rotation" data-testid="tile-rotation">${rotations.map((degrees, i) => `<option value="${i}">${degrees}°</option>`).join('')}</select></label></div>
      <label class="studio-field"><span>Prop</span><select id="object-kind" data-testid="object-kind">${context.catalog.objectKinds.map(kind => `<option value="${escapeHtml(kind.id)}">${escapeHtml(kind.id)}</option>`).join('')}</select></label>
      <label class="studio-field"><span>Prop variant</span><select id="object-variant" data-testid="object-variant"></select></label>
      <div class="studio-asset-preview"><canvas id="object-preview" width="64" height="64" aria-label="Prop preview"></canvas><label class="studio-field"><span>Prop artwork rotation</span><select id="place-rotation" data-testid="place-rotation">${rotations.map((degrees, i) => `<option value="${i}">${degrees}°</option>`).join('')}</select></label></div>
    </div>
    <div class="studio-map-options"><label><input id="show-grid" type="checkbox" checked> Grid</label><label><input id="show-collision" type="checkbox"> Collision footprint</label><label>Zoom <select id="map-zoom"><option value="12">Small</option><option value="16" selected>Normal</option><option value="24">Large</option><option value="32">Extra large</option></select></label><button class="studio-button" id="undo-map" data-testid="undo-map">Undo map edit</button><button class="studio-button subtle" id="revert-map" data-testid="revert-map">Revert this area</button><span id="map-counts" class="studio-muted"></span><span id="map-source-warning" class="studio-muted" role="status" aria-live="polite"></span></div>
    <div class="studio-map-layout"><div class="studio-map-scroll"><div class="studio-map-stage"><canvas id="map-ground" aria-hidden="true"></canvas><canvas id="map-props" aria-hidden="true"></canvas><canvas id="map-canvas" aria-label="Editable world map" data-testid="map-canvas"></canvas></div><p class="studio-muted">Drag props by their footprint. Draw terrain by dragging across tiles; place props with a tap or click. Artwork rotation does not change collision footprints.</p></div>
      <aside class="studio-inspector"><h3>Prop inspector</h3><select id="object-picker" aria-label="Select a prop"></select><div id="object-inspector"><p class="studio-muted">Select a prop on the map.</p></div><div id="map-source-repairs" aria-label="Unmatched prop edits"></div>
      <hr><h3>Exit inspector</h3><select id="exit-picker" aria-label="Select an exit"></select><div class="studio-coordinate-grid"><label class="studio-field"><span>X</span><input id="exit-x" type="number" value="0"></label><label class="studio-field"><span>Y</span><input id="exit-y" type="number" value="0"></label><label class="studio-field"><span>Width</span><input id="exit-w" type="number" value="1" min="1"></label><label class="studio-field"><span>Height</span><input id="exit-h" type="number" value="1" min="1"></label></div>
      <label class="studio-field"><span>Destination</span><select id="exit-destination"><option value="">Message only</option>${context.catalog.regions.map(region => `<option value="${region.id}">${escapeHtml(region.name)}</option>`).join('')}</select></label>
      <label class="studio-field"><span>Arrival entry</span><select id="exit-entry"></select></label><label class="studio-field"><span>Label</span><input id="exit-label" value="Exit"></label>
      <div class="studio-actions"><button id="update-exit" class="studio-button" data-testid="update-exit">Update exit</button><button id="add-exit" class="studio-button" data-testid="add-exit">Add exit</button><button id="remove-exit" class="studio-button subtle" data-testid="remove-exit">Remove exit</button></div>
      <p class="studio-muted">Connections are directional. Add or update the return exit in the destination area too. Existing progression locks are preserved when updating an exit.</p></aside></div>`;
  const canvas = container.querySelector('#map-canvas');
  const drawing = canvas.getContext('2d');
  const groundCanvas = container.querySelector('#map-ground');
  const groundDrawing = groundCanvas.getContext('2d');
  const propsCanvas = container.querySelector('#map-props');
  const propsDrawing = propsCanvas.getContext('2d');
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
  const curveEditor = mountCurveEditor(container.querySelector('.studio-inspector'), context, {
    map: () => map, edits, writable, remember, changed, currentGround,
  });
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

  function sourceIndex(reference) {
    if (reference && typeof reference === 'object' && Object.hasOwn(reference, 'source')) {
      return resolveSourceObjectIndex(map.objects, reference.source);
    }
    const index = typeof reference === 'number' ? reference : reference?.index;
    return Number.isInteger(index) && index >= 0 && index < map.objects.length ? index : -1;
  }
  function unresolvedObjectEdits() {
    const objectEdits = edits().objects || {};
    return [
      ...(objectEdits.move || []).flatMap((reference, index) =>
        sourceIndex(reference) < 0 ? [{ type: 'move', index, reference }] : []),
      ...(objectEdits.remove || []).flatMap((reference, index) =>
        sourceIndex(reference) < 0 ? [{ type: 'remove', index, reference }] : []),
    ];
  }
  function repairCandidates(type, editIndex, reference) {
    const objectEdits = edits().objects || {};
    const occupiedByMove = new Set((objectEdits.move || [])
      .filter((_, index) => type !== 'move' || index !== editIndex)
      .map(sourceIndex).filter(index => index >= 0));
    const occupiedByRemoval = new Set((objectEdits.remove || [])
      .filter((_, index) => type !== 'remove' || index !== editIndex)
      .map(sourceIndex).filter(index => index >= 0));
    const x = reference?.x, y = reference?.y;
    return map.objects.flatMap((object, index) => {
      const identity = sourceObjectIdentity(object);
      const uniqueSource = resolveSourceObjectIndex(map.objects, identity) === index;
      const footprintFits = type !== 'move' ||
        (Number.isInteger(x) && Number.isInteger(y) && x >= 0 && y >= 0 &&
         x + object.w <= map.w && y + object.h <= map.h);
      const alreadyEdited = type === 'move'
        ? occupiedByMove.has(index) || occupiedByRemoval.has(index)
        : occupiedByRemoval.has(index);
      return uniqueSource && footprintFits && !alreadyEdited ? [{ index, object, identity }] : [];
    });
  }
  function describeSource(reference) {
    const source = reference?.source;
    if (source && typeof source === 'object') {
      const dimensions = Number.isInteger(source.w) && Number.isInteger(source.h)
        ? ` · ${source.w}×${source.h}` : '';
      const position = Number.isInteger(source.x) && Number.isInteger(source.y)
        ? ` at (${source.x}, ${source.y})` : '';
      return `${source.kind || 'Unknown prop'}${position}${dimensions}`;
    }
    const index = typeof reference === 'number' ? reference : reference?.index;
    return Number.isInteger(index) ? `source prop #${index + 1}` : 'unknown source prop';
  }
  function renderSourceRepairs() {
    const area = control('map-source-repairs');
    const unresolved = unresolvedObjectEdits();
    if (!unresolved.length) { area.innerHTML = ''; return; }
    area.innerHTML = `<hr><h3>Unmatched prop edits</h3><p class="studio-muted">These saved changes are skipped because their original props are missing or ambiguous. Clear an edit or rebind it to a unique current prop.</p>
      ${unresolved.map(({ type, index, reference }) => {
        const candidates = repairCandidates(type, index, reference);
        const label = type === 'move' ? 'Move' : 'Removal';
        const title = `${label} ${index + 1}: ${describeSource(reference)}`;
        const target = type === 'move' && Number.isInteger(reference?.x) && Number.isInteger(reference?.y)
          ? `<p class="studio-muted">Saved destination: (${reference.x}, ${reference.y})</p>` : '';
        return `<article class="studio-stale-prop-edit" data-testid="unresolved-prop-edit" data-edit-type="${type}" data-edit-index="${index}">
          <strong>${escapeHtml(title)}</strong>${target}
          <label class="studio-field"><span>Rebind to current prop</span><select data-testid="repair-prop-source" aria-label="${escapeHtml(`Rebind ${label.toLowerCase()} ${index + 1} to a current prop`)}">
            <option value="">Choose a prop…</option>${candidates.map(({ index: candidateIndex, object }) =>
              `<option value="${candidateIndex}">${escapeHtml(object.kind)} (${object.x}, ${object.y}) · #${candidateIndex + 1}</option>`).join('')}
          </select></label>
          ${candidates.length ? '' : '<p class="studio-muted">No unique, unused prop can accept this edit. Clear it to remove the stale change.</p>'}
          <div class="studio-actions"><button class="studio-button" data-testid="rebind-prop-edit" ${candidates.length ? '' : 'disabled'}>Rebind edit</button><button class="studio-button subtle" data-testid="clear-prop-edit">Clear edit</button></div>
        </article>`;
      }).join('')}`;
    for (const article of area.querySelectorAll('[data-testid="unresolved-prop-edit"]')) {
      const type = article.dataset.editType;
      const index = Number(article.dataset.editIndex);
      const sourcePicker = article.querySelector('[data-testid="repair-prop-source"]');
      article.querySelector('[data-testid="rebind-prop-edit"]').onclick = () => {
        const candidate = repairCandidates(type, index, edits().objects[type][index])
          .find(item => String(item.index) === sourcePicker.value);
        if (!candidate) return;
        remember();
        if (type === 'move') {
          const move = edits().objects.move[index];
          edits().objects.move[index] = {
            ...move, index: candidate.index, source: candidate.identity,
          };
        } else {
          edits().objects.remove[index] = {
            ...(typeof edits().objects.remove[index] === 'object' ? edits().objects.remove[index] : {}),
            index: candidate.index, source: candidate.identity,
          };
        }
        changed();
        context.message(`${type === 'move' ? 'Move' : 'Removal'} rebound to ${candidate.object.kind}. Save to project to keep the repair.`);
        inspectObject();
      };
      article.querySelector('[data-testid="clear-prop-edit"]').onclick = () => {
        remember();
        edits().objects[type].splice(index, 1);
        changed();
        context.message(`Unmatched ${type === 'move' ? 'move' : 'removal'} cleared. Save to project to keep the repair.`);
        inspectObject();
      };
    }
  }
  function bindLegacyObjectReferences() {
    const objectEdits = edits().objects;
    if (!objectEdits) return false;
    let changed = false;
    for (const move of objectEdits.move || []) {
      if (Object.hasOwn(move, 'source') || !map.objects[move.index]) continue;
      move.source = sourceObjectIdentity(map.objects[move.index]);
      changed = true;
    }
    if (objectEdits.remove) objectEdits.remove = objectEdits.remove.map(reference => {
      if (typeof reference !== 'number' || !map.objects[reference]) return reference;
      changed = true;
      return { index: reference, source: sourceObjectIdentity(map.objects[reference]) };
    });
    return changed;
  }
  function effectiveObjects() {
    const edit = edits().objects || {};
    const moves = new Map((edit.move || []).map(move => [sourceIndex(move), move])
      .filter(([index]) => Number.isInteger(index) && index >= 0));
    const removed = new Set((edit.remove || []).map(sourceIndex).filter(Number.isInteger));
    const result = map.objects.map((object, index) => ({
      ...object, ...map.objectLayout?.[index], ...moves.get(index), _base: index,
    })).filter(object => !removed.has(object._base));
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
  const regionInfo = () => context.catalog.regions.find(region => region.id === regionId);
  const rotationOptions = () => rotations.map((degrees, i) =>
    `<option value="${i}">${degrees}°</option>`).join('');
  function variantsFor(kindId) {
    const kind = kindMap.get(kindId);
    if (!kind) return [''];
    if (kind.styles?.length) return kind.styles.map(style => `${style}:15`);
    return kind.variants?.length ? kind.variants : [''];
  }
  function fillVariantPicker(select, kindId, selected = '') {
    const variants = variantsFor(kindId);
    if (selected && !variants.includes(selected)) variants.unshift(selected);
    select.innerHTML = variants.map(variant => `<option value="${escapeHtml(variant)}">${escapeHtml(variant || 'Default')}</option>`).join('');
    select.value = selected || variants[0] || '';
  }
  function tileImage(name) {
    const filename = `${name}.png`;
    const files = context.catalog.spriteFiles;
    const url = files.tileActive?.includes(filename) ?
      new URL(`../assets/sprites/tiles/${filename}`, import.meta.url).href : null;
    if (!url) return null;
    if (!tileImages.has(url)) {
      const image = new Image();
      image.onload = () => {
        if (!active()) return;
        tileArtCache = null;
        drawGround();
        drawTilePreview();
      };
      image.src = url;
      tileImages.set(url, image);
    }
    const image = tileImages.get(url);
    return image.complete && image.naturalWidth ? image : null;
  }
  function tileImageSet() {
    if (tileArtCache) return tileArtCache;
    const result = {};
    for (const name of new Set(Object.values(TILE_NAMES))) {
      const image = tileImage(name);
      if (image) result[name] = image;
    }
    tileArtCache = result;
    return tileArtCache;
  }
  function currentGround() {
    if (groundCache) return groundCache;
    const curved = terrainWithCurveEdits(map, edits().terrainFeatures, edits().tiles);
    const ground = curved.ground.map(row => row.split(''));
    const tileRotations = map.tileRotations?.map(row => [...row]) ||
      Array.from({ length: map.h }, () => Array(map.w).fill(0));
    for (const tile of edits().tiles || []) {
      if (!ground[tile.y]?.[tile.x]) continue;
      ground[tile.y][tile.x] = tile.tile;
      tileRotations[tile.y][tile.x] = tile.rotation || 0;
    }
    groundCache = { ...curved, ground, tileRotations };
    return groundCache;
  }
  function drawTilePreview() {
    const preview = control('tile-preview');
    const brush = control('tile-brush').value;
    const surrounding = Array.from({ length: 3 }, () => Array(3).fill('.'));
    if (brush === '#') {
      surrounding[1] = ['#', '#', '#'];
      surrounding[0][1] = surrounding[2][1] = 'f';
    } else if (brush === 'f') {
      surrounding[1] = ['f', 'f', 'f'];
      surrounding[2][1] = '#';
    } else if (brush === '=') {
      surrounding[1].fill('=');
    } else if (brush === 'r' || brush === 'B' || brush === '+' || brush === 'A') {
      surrounding[0][1] = brush;
      surrounding[1][0] = surrounding[1][2] = brush;
      surrounding[2][1] = brush;
    } else if (brush === '~' || brush === 'w') {
      surrounding[0][1] = surrounding[1][0] = surrounding[1][2] = surrounding[2][1] = brush;
    }
    surrounding[1][1] = brush;
    const rotationsByRow = Array.from({ length: 3 }, () => Array(3).fill(0));
    rotationsByRow[1][1] = Number(control('tile-rotation').value);
    const sample = {
      w: 3, h: 3, ground: surrounding,
      tileRotations: rotationsByRow, wallPaint: map?.wallPaint,
    };
    const stamp = document.createElement('canvas');
    stamp.width = stamp.height = 48;
    paintGround(painter(stamp.getContext('2d')), sample, regionInfo()?.grass || ['#91b267', '#829c56', '#547943', '#71a252'], tileImageSet());
    const ctx = preview.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, preview.width, preview.height);
    ctx.drawImage(stamp, 16, 16, 16, 16, 0, 0, preview.width, preview.height);
  }
  function drawObjectPreview(kindId = control('object-kind').value, value = control('object-variant').value,
    rotation = Number(control('place-rotation').value)) {
    const preview = control('object-preview');
    const def = OBJECTS[kindId];
    if (!def) return;
    const image = imageFor({ kind: kindId, v: value });
    const { width, height } = image ? propArtworkSize(image, def) :
      { width: def.tex[0], height: def.tex[1] };
    const size = Math.max(width, height, 16);
    preview.width = preview.height = size;
    const ctx = preview.getContext('2d');
    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = false;
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate(rotation * Math.PI / 2);
    if (image) ctx.drawImage(image, -width / 2, -height / 2, width, height);
    else if (typeof def.paint === 'function') {
      const p = painter(ctx);
      ctx.translate(-def.tex[0] / 2, -def.tex[1] / 2);
      const [footW, footH] = def.foot || [1, 1];
      def.paint.call(def, p, value || '', { kind: kindId, x: 0, y: 0, w: footW, h: footH });
    }
    ctx.restore();
  }
  function imageFor(object) {
    const variant = String(object.v || '').split(':')[0];
    const names = [`${object.kind}${variant ? `-${variant}` : ''}.png`, `${object.kind}.png`];
    let url;
    for (const name of names) {
      if (context.catalog.spriteFiles.active.includes(name)) { url = new URL(`../assets/sprites/objects/${name}`, import.meta.url).href; break; }
    }
    if (!url) return null;
    if (!images.has(url)) {
      const image = new Image();
      image.onload = () => {
        if (!active()) return;
        drawProps();
        drawObjectPreview();
      };
      image.src = url;
      images.set(url, image);
    }
    const image = images.get(url);
    return image.complete && image.naturalWidth ? image : null;
  }
  function objectImageFor(object) {
    const supplied = imageFor(object);
    if (supplied) return supplied;
    const def = OBJECTS[object.kind];
    if (!def || typeof def.paint !== 'function') return null;
    const key = `procedural:${object.kind}:${object.v || ''}`;
    if (!images.has(key)) {
      const image = document.createElement('canvas');
      image.width = def.tex[0]; image.height = def.tex[1];
      def.paint.call(def, painter(image.getContext('2d')), object.v || '', object);
      images.set(key, image);
    }
    return images.get(key);
  }
  function drawGround() {
    if (groundFrame !== null) window.cancelAnimationFrame(groundFrame);
    groundFrame = null;
    if (!map || !active()) return;
    const width = map.w * cell, height = map.h * cell;
    if (groundCanvas.width !== width || groundCanvas.height !== height) {
      groundCanvas.width = width; groundCanvas.height = height;
      propsCanvas.width = width; propsCanvas.height = height;
      canvas.width = width; canvas.height = height;
      groundCanvas.style.width = canvas.style.width = `${width}px`;
      groundCanvas.style.height = canvas.style.height = `${height}px`;
      propsCanvas.style.width = `${width}px`;
      propsCanvas.style.height = `${height}px`;
      const stage = canvas.parentElement;
      stage.style.width = `${width}px`;
      stage.style.height = `${height}px`;
    }
    const ctx = groundDrawing;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(cell / 16, 0, 0, cell / 16, 0, 0);
    paintGround(painter(ctx), currentGround(), regionInfo()?.grass || ['#91b267', '#829c56', '#547943', '#71a252'], tileImageSet());
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  function queueGroundRedraw() {
    // A join/removal can change a whole contour, not just adjacent cells.
    // Coalesce all pointer events in one frame; leave the independent prop
    // layer intact so painting does not repaint trees, roofs and shadows.
    if (groundFrame !== null) return;
    groundFrame = window.requestAnimationFrame(() => {
      groundFrame = null;
      drawGround();
      if (showCollision) draw();
    });
  }
  function objectBounds(object) {
    const image = objectImageFor(object);
    const size = image ? propArtworkSize(image, OBJECTS[object.kind], cell) : null;
    return propArtworkBounds(object, size, cell);
  }
  function paintObject(ctx, object) {
    const image = objectImageFor(object);
    if (image) {
      const { width, height } = propArtworkSize(image, OBJECTS[object.kind], cell);
      ctx.save();
      ctx.translate((object.x + object.w / 2) * cell, (object.y + object.h) * cell);
      ctx.rotate(((object.rotation || 0) % 4) * Math.PI / 2);
      ctx.drawImage(image, -width / 2, -height, width, height);
      ctx.restore();
    } else {
      ctx.fillStyle = '#465642aa';
      ctx.fillRect(object.x * cell, object.y * cell, object.w * cell, object.h * cell);
      if (object.w > 1) {
        ctx.fillStyle = '#fff6de'; ctx.font = '9px monospace';
        ctx.fillText(object.kind.slice(0, 12), object.x * cell + 2, object.y * cell + 10);
      }
    }
    if (showCollision && kindMap.get(object.kind)?.solid) {
      ctx.strokeStyle = '#bf3738'; ctx.lineWidth = 1;
      ctx.strokeRect(object.x * cell + .5, object.y * cell + .5, object.w * cell - 1, object.h * cell - 1);
    }
    if (selectedObject && objectKey(object) === selectedObject) {
      ctx.strokeStyle = '#20b9df'; ctx.lineWidth = 2;
      ctx.strokeRect(object.x * cell, object.y * cell, object.w * cell, object.h * cell);
    }
  }
  function drawProps() {
    if (!map || !active()) return;
    propsDrawing.setTransform(1, 0, 0, 1, 0, 0);
    propsDrawing.clearRect(0, 0, propsCanvas.width, propsCanvas.height);
    propsDrawing.imageSmoothingEnabled = false;
    for (const object of effectiveObjects().sort((a, b) => a.y + a.h - b.y - b.h)) {
      paintObject(propsDrawing, object);
    }
  }
  function drawPropPatch(...changedObjects) {
    if (!changedObjects.length) return;
    const bounds = changedObjects.map(objectBounds);
    const patch = {
      left: Math.max(0, Math.floor(Math.min(...bounds.map(box => box.left)))),
      top: Math.max(0, Math.floor(Math.min(...bounds.map(box => box.top)))),
      right: Math.min(propsCanvas.width, Math.ceil(Math.max(...bounds.map(box => box.right)))),
      bottom: Math.min(propsCanvas.height, Math.ceil(Math.max(...bounds.map(box => box.bottom)))),
    };
    if (patch.right <= patch.left || patch.bottom <= patch.top) return;
    propsDrawing.clearRect(patch.left, patch.top, patch.right - patch.left, patch.bottom - patch.top);
    // Intersecting props may extend outside the cleared patch. Clip their
    // redraw so translucent shadows do not accumulate on untouched pixels.
    propsDrawing.save();
    try {
      propsDrawing.beginPath();
      propsDrawing.rect(patch.left, patch.top, patch.right - patch.left, patch.bottom - patch.top);
      propsDrawing.clip();
      for (const object of effectiveObjects().sort((a, b) => a.y + a.h - b.y - b.h)) {
        const box = objectBounds(object);
        if (box.right >= patch.left && box.left <= patch.right &&
            box.bottom >= patch.top && box.top <= patch.bottom) paintObject(propsDrawing, object);
      }
    } finally {
      propsDrawing.restore();
    }
  }
  function draw() {
    if (!map || !active()) return;
    if (canvas.width !== map.w * cell || canvas.height !== map.h * cell) drawGround();
    drawing.setTransform(1, 0, 0, 1, 0, 0);
    drawing.clearRect(0, 0, canvas.width, canvas.height);
    drawing.imageSmoothingEnabled = false;
    const rows = currentGround().ground;
    if (showCollision) for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
      if ('~rWVRY'.includes(rows[y][x])) {
        drawing.fillStyle = '#bf37386e'; drawing.fillRect(x * cell, y * cell, cell, cell);
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
    drawing.setTransform(1, 0, 0, 1, 0, 0);
  }
  function updateCounts() {
    const edit = edits();
    control('map-counts').textContent = `${map.w} × ${map.h} tiles · ${effectiveObjects().length} props · ${(edit.tiles || []).length} painted tiles`;
    const unresolved = unresolvedObjectEdits().length;
    control('map-source-warning').textContent = unresolved ?
      `${unresolved} saved prop edit${unresolved === 1 ? '' : 's'} could not be matched to a unique source prop; those edits are skipped. Repair them in the prop inspector.` : '';
    renderSourceRepairs();
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
    curveEditor.status();
  }
  function moveObject(object, x, y, variant = object.v || '', rotation = object.rotation || 0) {
    if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 ||
        x + object.w > map.w || y + object.h > map.h) return false;
    const edit = writable().objects;
    if (object._added !== undefined) {
      const target = edit.add[object._added];
      if (target.x === x && target.y === y && (target.v || '') === variant &&
          (target.rotation || 0) === rotation) return false;
      Object.assign(target, { x, y, v: variant, rotation });
      return true;
    }
    const base = map.objects[object._base];
    const existing = edit.move.find(move => sourceIndex(move) === object._base);
    const baseVariant = base.v || '', baseRotation = base.rotation || 0;
    const next = { index: object._base, source: sourceObjectIdentity(base), x, y };
    if (variant !== baseVariant) next.v = variant;
    if (rotation !== baseRotation) next.rotation = rotation;
    if (!existing && x === base.x && y === base.y && variant === baseVariant && rotation === baseRotation) return false;
    if (existing && existing.x === next.x && existing.y === next.y &&
        existing.v === next.v && existing.rotation === next.rotation) return false;
    if (existing && x === base.x && y === base.y && variant === baseVariant && rotation === baseRotation) {
      edit.move.splice(edit.move.indexOf(existing), 1);
      return true;
    }
    if (existing) {
      Object.assign(existing, next);
      if (next.v === undefined) delete existing.v;
      if (next.rotation === undefined) delete existing.rotation;
    } else edit.move.push(next);
    return true;
  }
  function inspectObject() {
    const object = effectiveObjects().find(item => objectKey(item) === selectedObject);
    const area = control('object-inspector');
    if (!object) { area.innerHTML = '<p class="studio-muted">Select a prop on the map.</p>'; return; }
    const currentVariant = object.v || '';
    const variants = [currentVariant, ...variantsFor(object.kind).filter(variant => variant !== currentVariant)];
    area.innerHTML = `<p class="studio-code-label">${escapeHtml(object.kind)} ${escapeHtml(object.v || '')}</p>
      <label class="studio-field"><span>Artwork variant</span><select id="selected-object-variant" data-testid="selected-object-variant">${variants.map(variant => `<option value="${escapeHtml(variant)}">${escapeHtml(variant || 'Default')}</option>`).join('')}</select></label>
      <label class="studio-field"><span>Artwork rotation</span><select id="selected-object-rotation" data-testid="selected-object-rotation">${rotationOptions()}</select></label>
      <div class="studio-coordinate-grid"><label class="studio-field"><span>X</span><input id="object-x" type="number" value="${object.x}" data-testid="object-x"></label><label class="studio-field"><span>Y</span><input id="object-y" type="number" value="${object.y}" data-testid="object-y"></label></div>
      <div class="studio-actions"><button class="studio-button" id="move-object" data-testid="move-object">Apply prop changes</button><button class="studio-button subtle" id="remove-object" data-testid="remove-object">Remove prop</button></div>`;
    control('selected-object-variant').value = currentVariant;
    control('selected-object-rotation').value = object.rotation || 0;
    control('move-object').onclick = () => {
      const x = Number(control('object-x').value), y = Number(control('object-y').value);
      const variant = control('selected-object-variant').value;
      const rotation = Number(control('selected-object-rotation').value);
      if (x < 0 || y < 0 || x + object.w > map.w || y + object.h > map.h) {
        context.message('That prop footprint would extend outside the area.', true); return;
      }
      if (x === object.x && y === object.y && variant === (object.v || '') && rotation === (object.rotation || 0)) return;
      remember();
      if (moveObject(object, x, y, variant, rotation)) {
        context.changed(); drawProps(); updateCounts(); inspectObject();
      }
    };
    control('remove-object').onclick = () => {
      if (!confirm(`Remove this ${object.kind} from the area? Original map code stays intact; the change is only applied after saving.`)) return;
      remember();
      if (object._added !== undefined) writable().objects.add.splice(object._added, 1);
      else {
        const objectEdits = writable().objects;
        if (!objectEdits.remove.some(reference => sourceIndex(reference) === object._base)) {
          objectEdits.remove.push({
            index: object._base,
            source: sourceObjectIdentity(map.objects[object._base]),
          });
        }
      }
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
    if (x < 0 || y < 0 || x >= map.w || y >= map.h) return false;
    const tiles = writable().tiles;
    const existing = tiles.find(tile => tile.x === x && tile.y === y);
    const ground = currentGround();
    const tile = control('tile-brush').value, rotation = Number(control('tile-rotation').value);
    if (ground.ground[y][x] === tile && ground.tileRotations[y][x] === rotation) return false;
    if (drag?.paint && !drag.started) { remember(); drag.started = true; }
    // A curve may have changed this cell's default material (e.g. floor to
    // wall). Painting the original source material must still create an edit.
    const baseTile = edits().terrainFeatures && Object.keys(edits().terrainFeatures).length
      ? terrainWithCurveEdits(map, edits().terrainFeatures).ground[y][x] : map.ground[y][x];
    const baseRotation = map.tileRotations?.[y]?.[x] || 0;
    if (tile === baseTile && rotation === baseRotation) {
      if (existing) tiles.splice(tiles.indexOf(existing), 1);
    } else if (existing) {
      existing.tile = tile;
      if (rotation) existing.rotation = rotation;
      else delete existing.rotation;
    } else {
      tiles.push({ x, y, tile, ...(rotation ? { rotation } : {}) });
    }
    context.changed();
    // Painting may switch the entire landmark back to tile geometry.
    groundCache = null;
    queueGroundRedraw();
    return true;
  }
  function applyPendingPointer() {
    const point = pendingPointer;
    pendingPointer = null;
    if (!point || !drag || drag.paint) return;
    const x = point.x - drag.offsetX, y = point.y - drag.offsetY;
    if (!drag.started && (x !== drag.object.x || y !== drag.object.y)) {
      remember();
      drag.started = true;
    }
    const previous = { ...drag.object };
    if (moveObject(drag.object, x, y)) {
      drag.object.x = x;
      drag.object.y = y;
      context.changed();
      drawPropPatch(previous, drag.object);
    }
  }
  function endDrag() {
    if (frameQueued) window.cancelAnimationFrame(frameQueued);
    frameQueued = false;
    applyPendingPointer();
    if (groundFrame !== null) drawGround();
    drag = null;
    updateCounts();
    inspectObject();
  }
  canvas.onpointerdown = event => {
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    const { x, y } = coordinates(event);
    if (mode === 'paint') { drag = { paint: true, started: false }; paint(x, y); }
    else if (mode === 'place') {
      const kind = control('object-kind').value;
      const [w, h] = kindMap.get(kind).foot;
      if (x + w > map.w || y + h > map.h) { context.message('That prop footprint would extend outside the area.', true); return; }
      remember(); const add = writable().objects.add;
      add.push({ kind, x, y, v: control('object-variant').value || '', rotation: Number(control('place-rotation').value) });
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
       updateCounts(); inspectObject(); drawProps();
    }
  };
  canvas.onpointermove = event => {
    if (!drag) return;
    const { x, y } = coordinates(event);
    if (drag.paint) paint(x, y);
    else {
      pendingPointer = { x, y };
      if (!frameQueued) frameQueued = window.requestAnimationFrame(() => {
        frameQueued = false;
        applyPendingPointer();
      });
    }
  };
  canvas.onpointerup = canvas.onpointercancel = endDrag;
  control('map-tool').onchange = event => { mode = event.target.value; };
  control('map-zoom').onchange = event => { cell = Number(event.target.value); drawGround(); drawProps(); draw(); };
  control('show-grid').onchange = event => { showGrid = event.target.checked; draw(); };
  control('show-collision').onchange = event => { showCollision = event.target.checked; drawProps(); draw(); };
  control('tile-brush').onchange = drawTilePreview;
  control('tile-rotation').onchange = drawTilePreview;
  control('object-kind').onchange = event => {
    fillVariantPicker(control('object-variant'), event.target.value);
    drawObjectPreview();
  };
  control('object-variant').onchange = () => drawObjectPreview();
  control('place-rotation').onchange = () => drawObjectPreview();
  control('object-picker').onchange = event => {
    selectedObject = event.target.value || null;
    inspectObject();
    drawObjectPreview(
      effectiveObjects().find(object => objectKey(object) === selectedObject)?.kind || control('object-kind').value,
      effectiveObjects().find(object => objectKey(object) === selectedObject)?.v || control('object-variant').value,
      effectiveObjects().find(object => objectKey(object) === selectedObject)?.rotation || 0,
    );
    drawProps();
  };
  control('exit-picker').onchange = event => { selectedExit = event.target.value || null; inspectExit(); };
  control('exit-destination').onchange = event => arrivalEntries(event.target.value).catch(error => context.message(error.message, true));
  control('undo-map').onclick = () => {
    if (!undo.length) return;
    const previous = undo.pop();
    if (previous) context.document.maps[regionId] = previous;
    else delete context.document.maps[regionId];
    selectedObject = selectedExit = null; changed({ terrain: true }); inspectObject();
    curveEditor.refresh();
  };
  control('revert-map').onclick = () => {
    if (!confirm('Remove this area’s studio edits and use the original map? Save afterward to apply the reset.')) return;
    remember(); delete context.document.maps[regionId]; selectedObject = selectedExit = null; changed({ terrain: true }); inspectObject();
    curveEditor.refresh();
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
    map = { ...loaded.map, grass: regionInfo()?.grass };
    if (bindLegacyObjectReferences()) {
      context.changed();
      context.message('Legacy prop references were upgraded for map-change safety. Save to project to keep the update.');
    }
    groundCache = null;
    undo.length = 0; selectedObject = selectedExit = null;
    updateCounts(); inspectObject(); drawGround(); drawProps(); drawTilePreview(); drawObjectPreview(); draw();
    curveEditor.refresh();
  }
  control('map-region').value = regionId;
  fillVariantPicker(control('object-variant'), control('object-kind').value);
  control('map-region').onchange = async event => {
    regionId = event.target.value;
    rememberView('region', regionId);
    try { await loadRegion(); } catch (error) { context.message(error.message, true); }
  };
  await loadRegion();
}
