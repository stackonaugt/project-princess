import { clone, escapeHtml } from './utils.js';
import {
  activeTerrainFeatures, curveValues, validateTerrainFeatureEdits,
} from '../src/art/paint/terrain-features.js';

const labels = {
  cx: 'Center X', cy: 'Center Y', rx: 'Horizontal radius', ry: 'Vertical radius',
  innerRx: 'Inner horizontal radius', innerRy: 'Inner vertical radius',
  x: 'Approach X', y: 'Approach Y', w: 'Approach width', h: 'Approach height',
};

export function mountCurveEditor(parent, context, callbacks) {
  const panel = document.createElement('section');
  panel.setAttribute('aria-label', 'Curved landmarks');
  parent.prepend(panel);
  let selected = '', shapeKey = '0:0', inputRemembered = false;
  const feature = () => callbacks.map()?.terrainFeatures?.find(item => item.id === selected);
  const values = () => clone(callbacks.edits().terrainFeatures?.[selected] || curveValues(feature()));

  function status() {
    const source = feature();
    if (!source) return;
    const usingCurve = activeTerrainFeatures(callbacks.currentGround()).some(item => item.id === selected);
    panel.querySelector('#curve-status').textContent = usingCurve
      ? `${callbacks.edits().terrainFeatures?.[selected] ? 'Edited' : 'Defined'} curve is active.`
      : 'Tile-edited geometry is active. The curve is retained, but painting inside this landmark takes precedence.';
    panel.querySelector('#restore-curve-tiles').disabled = usingCurve;
  }

  function fields() {
    const current = values(), [layerIndex, shapeIndex] = shapeKey.split(':').map(Number);
    const shape = current.layers[layerIndex].shapes[shapeIndex];
    panel.querySelector('#curve-fields').innerHTML = `
      <div class="studio-coordinate-grid">${Object.keys(shape).filter(key => key !== 'kind').map(key => `
        <label class="studio-field"><span>${labels[key]}</span><input type="number" step="0.1"
          data-curve-key="${key}" data-testid="curve-${key}" value="${shape[key]}"></label>`).join('')}</div>
      <details><summary>Landmark clipping area</summary><p class="studio-muted">Only the part inside this tile-aligned area is drawn. Expand it when moving or enlarging the curve. Approaches may extend beyond it to join existing roads.</p>
        <div class="studio-coordinate-grid">${['Left', 'Top', 'Width', 'Height'].map((label, index) => `
          <label class="studio-field"><span>${label}</span><input type="number" step="1"
            data-bound-index="${index}" data-testid="curve-bound-${index}" value="${current.bounds[index]}"></label>`).join('')}</div>
      </details>`;
    inputRemembered = false;
    const fieldContainer = panel.querySelector('#curve-fields');
    fieldContainer.onfocusin = () => { inputRemembered = false; };
    fieldContainer.oninput = event => {
      const input = event.target;
      if (!input.matches('input') || input.value.trim() === '') return;
      const next = values(), value = Number(input.value);
      if (input.dataset.curveKey) next.layers[layerIndex].shapes[shapeIndex][input.dataset.curveKey] = value;
      else next.bounds[Number(input.dataset.boundIndex)] = value;
      try {
        validateTerrainFeatureEdits(callbacks.map(), { [selected]: next });
      } catch {
        panel.querySelector('#curve-error').textContent = 'Keep shapes inside the map, dimensions positive, and inner radii smaller than outer radii. Clipping bounds must use whole tiles.';
        return;
      }
      panel.querySelector('#curve-error').textContent = '';
      if (JSON.stringify(next) === JSON.stringify(values())) return;
      if (!inputRemembered) { callbacks.remember(); inputRemembered = true; }
      const edits = callbacks.writable();
      edits.terrainFeatures ||= {};
      edits.terrainFeatures[selected] = next;
      callbacks.changed({ terrain: true });
      status();
    };
  }

  function inspector() {
    const source = feature(), area = panel.querySelector('#curve-inspector');
    if (!source) { area.innerHTML = ''; return; }
    const choices = source.layers.flatMap((layer, layerIndex) => layer.shapes.map((shape, shapeIndex) => ({
      key: `${layerIndex}:${shapeIndex}`,
      label: `${layer.material} layer ${layerIndex + 1} · ${shape.kind === 'rect' ? 'Straight approach' : shape.kind === 'ring' ? 'Oval path loop' : 'Ellipse'} ${shapeIndex + 1}`,
    })));
    if (!choices.some(choice => choice.key === shapeKey)) shapeKey = choices[0].key;
    area.innerHTML = `<p id="curve-status" data-testid="curve-status" class="studio-muted" role="status"></p>
      <label class="studio-field"><span>Curve or connection</span><select id="curve-shape" data-testid="curve-shape">
        ${choices.map(choice => `<option value="${choice.key}">${escapeHtml(choice.label)}</option>`).join('')}</select></label>
      <div id="curve-fields"></div><p id="curve-error" class="studio-muted" role="alert"></p>
      <div class="studio-actions"><button class="studio-button subtle" id="reset-curve" data-testid="reset-curve">Reset curve dimensions</button>
      <button class="studio-button subtle" id="restore-curve-tiles" data-testid="restore-curve-tiles">Restore curve over tile edits…</button></div>
      <p class="studio-muted">Changes preview immediately. Undo map edit restores them; Save to project keeps them. Each layer and straight approach can be adjusted separately. Props and artwork are not moved.</p>`;
    const picker = panel.querySelector('#curve-shape');
    picker.value = shapeKey;
    picker.onchange = () => { shapeKey = picker.value; fields(); };
    panel.querySelector('#reset-curve').onclick = () => {
      if (!callbacks.edits().terrainFeatures?.[selected]) return;
      callbacks.remember();
      delete callbacks.writable().terrainFeatures[selected];
      callbacks.changed({ terrain: true });
      inspector();
    };
    panel.querySelector('#restore-curve-tiles').onclick = () => {
      const edited = values().bounds;
      const within = (tile, bounds) => tile.x >= bounds[0] && tile.y >= bounds[1] &&
        tile.x < bounds[0] + bounds[2] && tile.y < bounds[1] + bounds[3];
      const tiles = callbacks.edits().tiles || [];
      const kept = tiles.filter(tile => !within(tile, source.bounds) && !within(tile, edited));
      const count = tiles.length - kept.length;
      if (!count || !confirm(`Remove ${count} painted tile edit(s) inside this landmark to restore its smooth curve? Other terrain edits, props and supplied artwork will be kept. You can undo this.`)) return;
      callbacks.remember();
      callbacks.writable().tiles = kept;
      callbacks.changed({ terrain: true });
      inspector();
    };
    fields(); status();
  }

  function refresh() {
    const features = callbacks.map()?.terrainFeatures || [];
    if (!features.some(item => item.id === selected)) selected = features[0]?.id || '';
    panel.innerHTML = `<h3>Curved landmarks</h3>${features.length ? `
      <label class="studio-field"><span>Landmark</span><select id="curve-landmark" data-testid="curve-landmark">
        ${features.map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name || item.id)}</option>`).join('')}</select></label>
      <div id="curve-inspector"></div>` : '<p class="studio-muted">This area has no defined curved landmarks. Terrain painting is still available.</p>'}`;
    if (!features.length) return;
    const picker = panel.querySelector('#curve-landmark');
    picker.value = selected;
    picker.onchange = () => { selected = picker.value; shapeKey = '0:0'; inspector(); };
    inspector();
  }
  return { refresh, status };
}
