import { terrainContours, traceTerrain } from './terrain-curves.js';

const TILE = 16;
const RESOLUTION = 2;
const traceCache = new WeakMap();

// Map-defined landmarks, not a global rule rounding all roads or rooms.
// Terrain changes within a landmark take precedence over its exact outline.
export function withTerrainFeatures(map, features) {
  return { ...map, terrainFeatures: features.map(feature => ({
    ...feature, source: snapshot(map, feature.bounds),
  })) };
}

function snapshot(map, [x, y, w, h]) {
  return map.ground.slice(y, y + h).map(row => [...row].slice(x, x + w).join(''));
}

export function activeTerrainFeatures(map) {
  return (map.terrainFeatures || []).filter(feature =>
    !feature.tileEdited &&
    snapshot(map, feature.bounds).every((row, i) => row === feature.source[i]));
}

export function curveValues(feature) {
  return {
    bounds: [...feature.bounds],
    layers: feature.layers.map(layer => ({ shapes: layer.shapes.map(shape => ({ ...shape })) })),
  };
}

// Only geometry is authorable: materials, artwork rules and source identity
// remain owned by the map builder.
export function validateTerrainFeatureEdits(map, edits = {}) {
  const fail = () => { throw new Error(`Invalid landmark geometry on ${map.id}.`); };
  if (!edits || typeof edits !== 'object' || Array.isArray(edits)) fail();
  for (const [id, edit] of Object.entries(edits)) {
    const feature = map.terrainFeatures?.find(item => item.id === id);
    if (!feature || !edit || typeof edit !== 'object' || Array.isArray(edit) ||
        Object.keys(edit).some(key => !['bounds', 'layers'].includes(key))) fail();
    const bounds = edit.bounds;
    if (!Array.isArray(bounds) || bounds.length !== 4 ||
        !bounds.every(Number.isInteger) || bounds[0] < 0 || bounds[1] < 0 ||
        bounds[2] < 1 || bounds[3] < 1 ||
        bounds[0] + bounds[2] > map.w || bounds[1] + bounds[3] > map.h) fail();
    if (!Array.isArray(edit.layers) || edit.layers.length !== feature.layers.length) fail();
    edit.layers.forEach((layer, index) => {
      if (!layer || Object.keys(layer).some(key => key !== 'shapes') ||
          !Array.isArray(layer.shapes) || layer.shapes.length !== feature.layers[index].shapes.length) fail();
      layer.shapes.forEach((shape, shapeIndex) => {
        const original = feature.layers[index].shapes[shapeIndex];
        if (!shape || shape.kind !== original.kind ||
            Object.keys(shape).length !== Object.keys(original).length ||
            Object.keys(shape).some(key => !Object.hasOwn(original, key))) fail();
        for (const key of Object.keys(original).filter(key => key !== 'kind')) {
          if (!Number.isFinite(shape[key])) fail();
        }
        if (shape.kind === 'rect') {
          if (shape.x < 0 || shape.y < 0 || shape.w <= 0 || shape.h <= 0 ||
              shape.x + shape.w > map.w || shape.y + shape.h > map.h) fail();
        } else {
          if (shape.rx <= 0 || shape.ry <= 0 ||
              shape.cx - shape.rx < 0 || shape.cy - shape.ry < 0 ||
              shape.cx + shape.rx > map.w || shape.cy + shape.ry > map.h) fail();
          if (shape.kind === 'ring' && (shape.innerRx <= 0 || shape.innerRy <= 0 ||
              shape.innerRx >= shape.rx || shape.innerRy >= shape.ry)) fail();
        }
      });
    });
  }
}

function unionBounds(a, b) {
  const x = Math.min(a[0], b[0]), y = Math.min(a[1], b[1]);
  return [x, y, Math.max(a[0] + a[2], b[0] + b[2]) - x,
    Math.max(a[1] + a[3], b[1] + b[3]) - y];
}

export function insideFeatureBounds(x, y, bounds) {
  return x >= bounds[0] && y >= bounds[1] &&
    x < bounds[0] + bounds[2] && y < bounds[1] + bounds[3];
}

// Shared by Studio and gameplay, including the tile-center collision surface.
// A painted terrain change anywhere in the original or edited landmark keeps
// the original tile-based map; curve drafts are retained, not discarded.
export function terrainWithCurveEdits(map, edits = {}, tiles = []) {
  if (!Object.keys(edits).length) return map;
  validateTerrainFeatureEdits(map, edits);
  const ground = map.ground.map(row => [...row]);
  const features = (map.terrainFeatures || []).map(original => {
    const edit = edits[original.id];
    if (!edit) return original;
    const watch = unionBounds(original.bounds, edit.bounds);
    const [left, top, width, height] = watch;
    const feature = {
      ...original, bounds: watch, onlyReplace: false,
      layers: original.layers.map((layer, index) => ({
        ...layer, shapes: edit.layers[index].shapes.map(shape => ({ ...shape })),
      })),
    };
    const [x0, y0, w, h] = edit.bounds;
    const touched = [];
    for (let y = top; y < top + height; y++) for (let x = left; x < left + width; x++) {
      if (!insideFeatureBounds(x, y, original.bounds) &&
          !insideFeatureBounds(x, y, edit.bounds)) continue;
      const c = map.ground[y][x];
      // Special tiles, such as tram tracks and doorways, remain intact.
      if (!original.replace.includes(c) && !'.,\"L'.includes(c)) continue;
      let material = original.replace.includes(c) && !(original.preserveBase || '').includes(c)
        ? (original.indoor ? 'W' : '.') : c;
      if (x >= x0 && x < x0 + w && y >= y0 && y < y0 + h) {
        for (const layer of feature.layers) {
          if (featureContains(layer, x + .5, y + .5)) material = layer.material;
        }
      }
      touched.push([x, y, ground[y][x]]);
      ground[y][x] = material;
    }
    const tileEdited = tiles.some(tile =>
      (insideFeatureBounds(tile.x, tile.y, original.bounds) ||
       insideFeatureBounds(tile.x, tile.y, edit.bounds)) &&
      (map.ground[tile.y]?.[tile.x] !== tile.tile || ground[tile.y]?.[tile.x] !== tile.tile));
    if (tileEdited) {
      for (const [x, y, value] of touched) ground[y][x] = value;
      return { ...original, tileEdited: true };
    }
    // Clip the authored shapes to the requested landmark area when painting.
    feature.bounds = edit.bounds;
    feature.source = snapshot({ ground }, feature.bounds);
    return feature;
  });
  return { ...map, ground: ground.map(row => row.join('')), terrainFeatures: features };
}

function distance(shape, x, y) {
  if (shape.kind === 'ring') {
    const outer = (1 - Math.hypot((x - shape.cx) / shape.rx, (y - shape.cy) / shape.ry)) *
      Math.min(shape.rx, shape.ry);
    const inner = (Math.hypot((x - shape.cx) / shape.innerRx, (y - shape.cy) / shape.innerRy) - 1) *
      Math.min(shape.innerRx, shape.innerRy);
    return Math.min(outer, inner);
  }
  if (shape.kind === 'ellipse') {
    return (1 - Math.hypot((x - shape.cx) / shape.rx, (y - shape.cy) / shape.ry)) *
      Math.min(shape.rx, shape.ry);
  }
  const dx = Math.abs(x - shape.x - shape.w / 2) - shape.w / 2;
  const dy = Math.abs(y - shape.y - shape.h / 2) - shape.h / 2;
  return -Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) - Math.min(Math.max(dx, dy), 0);
}

export function featureContains(layer, x, y) {
  let result = -Infinity;
  for (const shape of layer.shapes) {
    const next = distance(shape, x, y), blend = layer.blend || 0;
    if (!Number.isFinite(result) || !blend) result = Math.max(result, next);
    else {
      // A small fillet at the straight approach's join with the curved street.
      const h = Math.max(0, Math.min(1, .5 + .5 * (result - next) / blend));
      result = next * (1 - h) + result * h + blend * h * (1 - h);
    }
  }
  return result >= 0;
}

export function featureTrace(feature, layer) {
  if (traceCache.has(layer)) return traceCache.get(layer);
  let trace;
  if (layer.shapes.length === 1 && layer.shapes[0].kind === 'ellipse') {
    const shape = layer.shapes[0];
    trace = ctx => {
      ctx.beginPath();
      ctx.ellipse(shape.cx * TILE, shape.cy * TILE, shape.rx * TILE,
        shape.ry * TILE, 0, 0, Math.PI * 2);
      ctx.closePath();
    };
  } else {
    const [left, top, width, height] = feature.bounds;
    const w = width * TILE / RESOLUTION, h = height * TILE / RESOLUTION;
    const map = { w, h, ground: Array.from({ length: h }, (_, y) =>
      Array.from({ length: w }, (_, x) => featureContains(layer,
        left + (x + .5) * RESOLUTION / TILE,
        top + (y + .5) * RESOLUTION / TILE) ? '=' : '.').join('')) };
    const loops = terrainContours(map, '=', RESOLUTION).map(loop => loop.map(point => {
      const moved = [point[0] + left * TILE, point[1] + top * TILE];
      moved.square = point.square;
      return moved;
    }));
    trace = ctx => traceTerrain(ctx, loops);
  }
  traceCache.set(layer, trace);
  return trace;
}

// Do not draw a cap where a feature's approach continues outside its local
// bounds. The surface still fills to the boundary, with continuous side kerbs.
export function strokeFeature(ctx, feature, trace) {
  const [x, y, w, h] = feature.bounds.map(n => n * TILE);
  let last, first;
  const onSameEdge = (a, b) => a && b &&
    ((a[0] === x && b[0] === x) || (a[0] === x + w && b[0] === x + w) ||
     (a[1] === y && b[1] === y) || (a[1] === y + h && b[1] === y + h));
  const lineTo = (a, b) => {
    const next = [a, b];
    if (onSameEdge(last, next)) ctx.moveTo(a, b);
    else ctx.lineTo(a, b);
    last = next;
  };
  trace({
    beginPath() { ctx.beginPath(); last = first = null; },
    moveTo(a, b) { ctx.moveTo(a, b); last = first = [a, b]; },
    lineTo,
    quadraticCurveTo(a, b, c, d) { ctx.quadraticCurveTo(a, b, c, d); last = [c, d]; },
    ellipse(...args) { ctx.ellipse(...args); },
    closePath() {
      if (first && last) lineTo(...first);
      else ctx.closePath();
    },
  });
}
