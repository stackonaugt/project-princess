// Serialized into a disposable browser page by check-supplied-terrain.mjs.
// PNGs are decoded in memory, never installed as the owner's sprite files.
export async function suppliedTerrainFixtures({ entry, outputMode, injectSeam }) {
  const [{ paintGround, TILE_NAMES }, { painter }, { ZONES }, config, { WorldScene },
    { custom }, curves, features] = await Promise.all([
    import(new URL('../src/art/paint/tiles.js', entry)),
    import(new URL('../src/art/paint/painter.js', entry)),
    import(new URL('../src/data/regions.js', entry)),
    import(new URL('../src/config.js', entry)),
    import(new URL('../src/scenes/WorldScene.js', entry)),
    import(new URL('../src/art/textures.js', entry)),
    import(new URL('../src/art/paint/terrain-curves.js', entry)),
    import(new URL('../src/art/paint/terrain-features.js', entry)),
  ]);
  const T = config.TILE, S = config.GROUND_SCALE;
  const canvas = (w, h) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.getContext('2d').imageSmoothingEnabled = false;
    return c;
  };
  const images = {};
  // High-resolution PNGs, asymmetric marks, clear holes and half-alpha pixels
  // exercise real PNG decoding, resampling, quarter turns and alpha clipping.
  for (const [i, name] of [...new Set(Object.values(TILE_NAMES))].entries()) {
    const c = canvas(32, 32), ctx = c.getContext('2d');
    ctx.fillStyle = `hsl(${i * 43 % 360} 65% 48%)`; ctx.fillRect(0, 0, 32, 32);
    // Align detail boundaries to eight source pixels so 12/24px Studio
    // cells don't land exactly on ambiguous nearest-neighbour sample ties.
    // Transparent areas still meet tile edges and every curved clip.
    ctx.fillStyle = '#fff8d0'; ctx.fillRect(0, 0, 8, 8);
    ctx.fillStyle = '#151127'; ctx.fillRect(16, 24, 16, 8);
    ctx.clearRect(8, 8, 8, 8);
    ctx.clearRect(0, 16, 8, 8);
    ctx.clearRect(24, 0, 8, 8);
    ctx.clearRect(16, 8, 8, 8);
    ctx.fillStyle = '#ffffff80'; ctx.fillRect(16, 8, 8, 8);
    const image = new Image();
    image.src = c.toDataURL('image/png');
    await image.decode();
    images[name] = image;
  }
  // Verify that the assets really exercise PNG alpha and asymmetric rotation;
  // a future simplification must not silently remove fixture coverage.
  for (const name of ['road', 'footpath', 'water', 'timber', 'wall']) {
    const signatures = [];
    for (let turn = 0; turn < 4; turn++) {
      const c = canvas(32, 32), ctx = c.getContext('2d');
      ctx.translate(16, 16); ctx.rotate(turn * Math.PI / 2);
      ctx.drawImage(images[name], -16, -16);
      const pixels = ctx.getImageData(0, 0, 32, 32).data;
      if (![...pixels].some((value, i) => i % 4 === 3 && value === 0) ||
          ![...pixels].some((value, i) => i % 4 === 3 && value > 0 && value < 255))
        throw new Error(`${name}: fixture lost clear or partial-alpha pixels`);
      signatures.push(c.toDataURL());
      c.width = c.height = 0;
    }
    if (new Set(signatures).size !== 4) throw new Error(`${name}: fixture lost rotation asymmetry`);
  }
  const oldCustom = [...custom];
  for (const name of Object.keys(images)) custom.add(`tile-${name}`);

  // Independent compositing oracle: assemble un-clipped PNG mosaics, then
  // clip each entire surface once. It deliberately does not call paintGround,
  // paintGroundTile, paintFeature or WorldScene. Existing geometry unit checks
  // own the traces; this check owns PNG assembly, rotation and scaled alpha.
  function stamp(ctx, map, x, y, material = map.ground[y][x], turn = map.tileRotations[y][x]) {
    const image = images[TILE_NAMES[material]];
    ctx.save();
    if (turn) {
      ctx.translate((x + .5) * T, (y + .5) * T);
      ctx.rotate(turn * Math.PI / 2);
      ctx.drawImage(image, 0, 0, image.width, image.height, -T / 2, -T / 2, T, T);
    } else ctx.drawImage(image, 0, 0, image.width, image.height, x * T, y * T, T, T);
    ctx.restore();
  }
  function reference(map, scale) {
    const c = canvas(map.w * T * scale, map.h * T * scale), ctx = c.getContext('2d');
    ctx.scale(scale, scale);
    const outdoor = !map.wallPaint && !map.ground.some(row => row.includes('W'));
    const active = features.activeTerrainFeatures(map);
    const paths = outdoor ? '=ug' : '';
    for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
      const tile = map.ground[y][x];
      if (tile === '~' || paths.includes(tile) || (outdoor && tile === 'f'))
        stamp(ctx, map, x, y, '.', 0);
      else stamp(ctx, map, x, y);
    }
    const mosaic = (draw, trace, edge, width, feature) => {
      const m = canvas(c.width, c.height), mc = m.getContext('2d');
      mc.scale(scale, scale); draw(mc);
      ctx.save(); trace(ctx); ctx.clip(feature ? 'nonzero' : 'evenodd');
      // Already rasterized at destination resolution; avoid a second sample
      // through fractional world transforms at nearest-neighbour ties.
      ctx.save(); ctx.resetTransform(); ctx.drawImage(m, 0, 0); ctx.restore();
      m.width = m.height = 0;
      if (feature) features.strokeFeature(ctx, feature, trace);
      else trace(ctx);
      ctx.strokeStyle = edge; ctx.lineWidth = width; ctx.stroke();
      ctx.restore();
    };
    const contour = (sourceMap, letters, isPath, edge, width) => {
      const loops = isPath ? curves.pathContours(sourceMap, letters, T) :
        curves.terrainContours(sourceMap, letters, T);
      if (!loops.length) return;
      const trace = ctx => isPath ? curves.tracePaths(ctx, loops) : curves.traceTerrain(ctx, loops);
      mosaic(mc => {
        for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
          let source = letters.includes(sourceMap.ground[y][x]) ? [x, y] : null;
          for (let dy = -1; dy <= 1 && !source; dy++)
            for (let dx = -1; dx <= 1 && !source; dx++)
              if (letters.includes(sourceMap.ground[y + dy]?.[x + dx] || '!'))
                source = [x + dx, y + dy];
          if (source) stamp(mc, map, x, y, isPath ? sourceMap.ground[source[1]][source[0]] : '~',
            map.tileRotations[source[1]][source[0]]);
        }
      }, trace, edge, width);
    };
    if (paths) contour(map, paths, true, '#a19473', 2.5);
    if (outdoor) {
      const rings = active.filter(f => f.onlyReplace);
      const footpathMap = { ...map, ground: map.ground.map((row, y) =>
        [...row].map((tile, x) => tile === 'f' && rings.some(({ bounds: [l, t, w, h] }) =>
          x >= l && x < l + w && y >= t && y < t + h) ? '.' : tile).join('')) };
      contour(footpathMap, 'f', true, '#9c9686', 2.5);
    }
    contour(map, '~w', false, '#2f6aa3', 2);
    for (const f of active) {
      const [l, t, w, h] = f.bounds;
      ctx.save(); ctx.beginPath(); ctx.rect(l * T, t * T, w * T, h * T); ctx.clip();
      for (let y = t; y < t + h; y++) for (let x = l; x < l + w; x++) {
        const tile = map.ground[y][x];
        if (f.onlyReplace && !f.replace.includes(tile)) continue;
        if (f.replace.includes(tile) && !(f.preserveBase || '').includes(tile))
          stamp(ctx, map, x, y, f.indoor ? 'W' : '.', f.indoor ? map.tileRotations[y][x] : 0);
        else stamp(ctx, map, x, y);
      }
      for (const layer of f.layers) {
        mosaic(mc => {
          for (let y = t; y < t + h; y++) for (let x = l; x < l + w; x++)
            stamp(mc, map, x, y, layer.material);
        }, features.featureTrace(f, layer), layer.edge, layer.lineWidth || 3, f);
      }
      for (let y = t; y < t + h; y++) for (let x = l; x < l + w; x++) {
        const tile = map.ground[y][x];
        if (!f.onlyReplace && !f.replace.includes(tile) && !'.,\"L'.includes(tile))
          stamp(ctx, map, x, y);
      }
      ctx.restore();
    }
    for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++)
      if (map.ground[y][x] === 'w') stamp(ctx, map, x, y);
    return c;
  }
  function gameplay(map, region) {
    let ground, displayScale;
    const scene = {
      map, region, regionId: 'fixture',
      tweens: { add() {} },
      textures: {
        exists: () => false,
        createCanvas: (_key, w, h) => {
          ground = canvas(w, h);
          return { getContext: () => ground.getContext('2d'), refresh() {} };
        },
        get: key => ({ getSourceImage: () => images[key.slice(5)] }),
      },
      add: { image: () => {
        const image = { setOrigin: () => image, setScale: scale => {
          displayScale = scale; return image;
        }, setDepth: () => image, setCrop: () => image, setAlpha: () => image };
        return image;
      } },
    };
    WorldScene.prototype.buildGround.call(scene);
    if (ground.width !== map.w * T * S || displayScale !== 1 / S)
      throw new Error('Gameplay ground texture/display scaling contract changed');
    const camera = { setZoom(zoom) { this.zoom = zoom; },
      setFollowOffset() {}, setBounds() {} };
    WorldScene.prototype.onResize.call({ map, region, cameras: { main: camera },
      scale: { width: 390, height: 844 } });
    return { ground, zoom: camera.zoom, displayScale };
  }
  const display = (source, map, pixelsPerWorldPixel) => {
    const c = canvas(Math.round(map.w * T * pixelsPerWorldPixel),
      Math.round(map.h * T * pixelsPerWorldPixel));
    c.getContext('2d').drawImage(source, 0, 0, c.width, c.height);
    return c;
  };
  function compare(actual, expected, collectPoints = true) {
    if (actual.width !== expected.width || actual.height !== expected.height)
      throw new Error('Comparison dimensions differ');
    const a = actual.getContext('2d').getImageData(0, 0, actual.width, actual.height).data;
    const b = expected.getContext('2d').getImageData(0, 0, expected.width, expected.height).data;
    let count = 0, first;
    const points = [];
    for (let i = 0; i < a.length; i += 4) {
      // Compare premultiplied colour, not meaningless RGB in nearly clear
      // pixels. Equivalent clip/composite orders round by up to three
      // 8-bit values across multiple translucent layers. There is no spatial
      // or percentage mismatch allowance.
      const alphaDifference = Math.abs(a[i + 3] - b[i + 3]);
      const colourDifference = Math.max(
        Math.abs(a[i] * a[i + 3] / 255 - b[i] * b[i + 3] / 255),
        Math.abs(a[i + 1] * a[i + 3] / 255 - b[i + 1] * b[i + 3] / 255),
        Math.abs(a[i + 2] * a[i + 3] / 255 - b[i + 2] * b[i + 3] / 255));
      if (Math.max(alphaDifference, colourDifference) <= 3) continue;
      count++;
      const x = i / 4 % actual.width, y = Math.floor(i / 4 / actual.width);
      first ||= [x, y];
      if (collectPoints && Math.abs(x - first[0]) < 64 && Math.abs(y - first[1]) < 64)
        points.push([x, y]);
    }
    return { count, bounds: first ? [first[0], first[1], first[0] + 63, first[1] + 63] : null, points };
  }
  function crop(c, bounds) {
    const [l, t, r, b] = bounds;
    const x = Math.max(0, l - 8), y = Math.max(0, t - 8);
    const w = Math.min(192, c.width - x, r - l + 17);
    const h = Math.min(192, c.height - y, b - t + 17);
    const out = canvas(w, h);
    out.getContext('2d').drawImage(c, x, y, w, h, 0, 0, w, h);
    const png = out.toDataURL('image/png');
    out.width = out.height = 0;
    return { png, x, y, w, h };
  }
  const failures = [], samples = [];
  let comparisons = 0, controls = 0;
  const ids = ['allen', 'glasgow', 'reading', 'lake', 'coburglake',
    'wetlands', 'lakepark', 'gardens', 'nicholson', 'flinders', 'civic'];
  // Source-world join locations. The explicit landmarks connect curves to
  // straight approaches here; remaining regions exercise contour/tile joins.
  const joins = { allen: [19, 16], glasgow: [43, 16], reading: [12, 17],
    lake: [21, 25], flinders: [34, 2] };
  function seamControl(source, map, kind) {
    const mutated = canvas(source.width, source.height), mc = mutated.getContext('2d');
    mc.drawImage(source, 0, 0);
    const [wx, wy] = joins[map.id] || [map.w / 2, map.h / 2];
    let x = Math.min(source.width - 1, Math.floor(wx / map.w * source.width));
    let y = Math.min(source.height - 1, Math.floor(wy / map.h * source.height));
    // A clear hole in the supplied image is valid; find the nearest painted
    // pixel so clearing it always represents a new gap, not an existing hole.
    if (kind === 'gap') {
      let found = false;
      for (let dy = -8; dy <= 8 && !found; dy++) for (let dx = -8; dx <= 8 && !found; dx++) {
        const a = Math.max(0, Math.min(source.width - 1, x + dx));
        const b = Math.max(0, Math.min(source.height - 1, y + dy));
        if (mc.getImageData(a, b, 1, 1).data[3] > 128) {
          x = a; y = b; found = true;
        }
      }
      if (!found) throw new Error(`${map.id}: no painted pixel near seam control`);
      mc.clearRect(x, y, 1, 1);
    } else {
      mc.fillStyle = '#ff00ff'; mc.fillRect(x, y, 1, 1);
    }
    return mutated;
  }
  try {
    for (const id of ids) for (const turn of [0, 1, 2, 3]) {
      const region = ZONES[id], map = structuredClone(region.build()), before = JSON.stringify(map);
      map.id = id;
      map.tileRotations = Array.from({ length: map.h }, () => Array(map.w).fill(turn));
      const game = gameplay(map, region);
      const expectedGame = reference(map, S);
      const views = [
        ...[12, 16, 24, 32].map(cell => ({ name: `studio-${cell}`, scale: cell / T })),
        ...[1, 2, 3].map(dpr => ({ name: `phone-dpr-${dpr}`, dpr })),
      ];
      for (const view of views) {
        let actual, expected;
        if (view.dpr) {
          const factor = game.displayScale * S * game.zoom * view.dpr;
          actual = display(game.ground, map, factor);
          expected = display(expectedGame, map, factor);
        } else {
          actual = canvas(map.w * T * view.scale, map.h * T * view.scale);
          const ctx = actual.getContext('2d'); ctx.scale(view.scale, view.scale);
          paintGround(painter(ctx), map, region.grass, images);
          expected = reference(map, view.scale);
        }
        const label = `${id}-turn-${turn}-${view.name}`;
        // Opt-in fault injection demonstrates the full failing-check and
        // comparison-image path without touching artwork or saved geometry.
        if (injectSeam && id === 'allen' && !turn && view.dpr === 3) {
          const fault = seamControl(actual, map, injectSeam);
          actual.width = actual.height = 0;
          actual = fault;
        }
        const result = compare(actual, expected);
        comparisons++;
        if (result.count) {
          const actualCrop = crop(actual, result.bounds);
          const diff = canvas(actualCrop.w, actualCrop.h), dc = diff.getContext('2d');
          dc.fillStyle = '#ff0050';
          for (const [x, y] of result.points)
            dc.fillRect(x - actualCrop.x, y - actualCrop.y, 1, 1);
          failures.push({ label, count: result.count,
            actual: actualCrop, expected: crop(expected, result.bounds),
            diff: { ...actualCrop, png: diff.toDataURL('image/png') } });
          diff.width = diff.height = 0;
        }
        // Negative controls prove a one-pixel gap OR protrusion is never lost
        // in the comparator, including at the scaled phone resolutions.
        if (!turn) {
          for (const kind of ['gap', 'protrusion']) {
            const mutated = seamControl(expected, map, kind);
            if (compare(mutated, expected, false).count !== 1)
              throw new Error(`${label}: ${kind} control did not detect exactly one seam pixel`);
            mutated.width = mutated.height = 0;
            controls++;
          }
        }
        if (!turn && view.dpr === 3) samples.push({
          label, png: game.ground.toDataURL('image/png'),
        });
        actual.width = actual.height = expected.width = expected.height = 0;
      }
      game.ground.width = game.ground.height = expectedGame.width = expectedGame.height = 0;
      delete map.tileRotations;
      // Builders may supply a rotation matrix; compare only the untouched
      // geometry here, rather than deleting that source metadata.
      const original = JSON.parse(before); delete original.tileRotations;
      original.id = id;
      if (JSON.stringify(map) !== JSON.stringify(original)) throw new Error(`${id}: map mutated`);
    }
    return { comparisons, controls, failures, samples: outputMode ? samples : [],
      materials: ['road', 'footpath', 'water', 'timber', 'wall'], groundScale: S };
  } finally {
    custom.clear(); oldCustom.forEach(key => custom.add(key));
  }
}
