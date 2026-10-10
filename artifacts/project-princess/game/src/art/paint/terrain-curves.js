// Walk actual cell boundaries; diagonal contacts belong to separate loops.
function boundaryLoops(map, letters, tile = 1) {
  const inside = (x, y) => x >= 0 && y >= 0 && x < map.w && y < map.h &&
    letters.includes(map.ground[y][x]);
  const edges = [], starts = new Map();
  const add = (a, b) => {
    const edge = { a, b, used: false };
    edges.push(edge);
    const key = a.join(',');
    if (!starts.has(key)) starts.set(key, []);
    starts.get(key).push(edge);
  };
  for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
    if (!inside(x, y)) continue;
    if (!inside(x, y - 1)) add([x, y], [x + 1, y]);
    if (!inside(x + 1, y)) add([x + 1, y], [x + 1, y + 1]);
    if (!inside(x, y + 1)) add([x + 1, y + 1], [x, y + 1]);
    if (!inside(x - 1, y)) add([x, y + 1], [x, y]);
  }
  const loops = [], cross = (a, b) => a[0] * b[1] - a[1] * b[0];
  for (const first of edges) {
    if (first.used) continue;
    let edge = first;
    const points = [];
    while (edge) {
      edge.used = true;
      points.push(edge.a.map(n => n * tile));
      // Do not consume a second component's unused edge on returning here.
      if (edge.b[0] === first.a[0] && edge.b[1] === first.a[1]) break;
      const direction = [edge.b[0] - edge.a[0], edge.b[1] - edge.a[1]];
      edge = (starts.get(edge.b.join(',')) || []).filter(next => !next.used)
        .sort((a, b) => cross(direction, [b.b[0] - b.a[0], b.b[1] - b.a[1]]) -
          cross(direction, [a.b[0] - a.a[0], a.b[1] - a.a[1]]))[0];
    }
    if (points.length >= 4) loops.push(points);
  }
  return loops;
}

export function terrainContours(map, letters, tile = 16) {
  return boundaryLoops(map, letters, tile).map(loop => loop.map(point => {
    const [x, y] = point.map(n => n / tile);
    // Banks next to constructed embankments and map-edge continuations are
    // flush, not rounded pool ends. Grass-facing banks remain natural.
    point.square = x === 0 || y === 0 || x === map.w || y === map.h ||
      [[x - 1, y - 1], [x, y - 1], [x - 1, y], [x, y]].some(([a, b]) =>
        'f#k+xpbcR'.includes(map.ground[b]?.[a] || '!'));
    return point;
  }));
}
// Cell-boundary contours for paths. Unlike natural banks, a built path's
// terminal edge must not shrink to a rounded cap. Diagonal contacts stay
// separate. Only short staircase runs on the sides are softened.
export function pathContours(map, letters, tile = 16) {
  const inside = (x, y) => x >= 0 && y >= 0 && x < map.w && y < map.h &&
    letters.includes(map.ground[y][x]);
  const terminals = new Set();
  for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
    if (!inside(x, y)) continue;
    const neighbours = [[0, -1], [1, 0], [0, 1], [-1, 0]]
      .filter(([dx, dy]) => inside(x + dx, y + dy)).length;
    if (neighbours <= 1) for (const corner of [[x, y], [x + 1, y],
      [x + 1, y + 1], [x, y + 1]]) terminals.add(corner.join(','));
  }
  const loops = [];
  const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
  for (const points of boundaryLoops(map, letters)) {
    const corners = points.filter((p, i) => {
      const a = points[(i + points.length - 1) % points.length];
      const b = points[(i + 1) % points.length];
      return cross([p[0] - a[0], p[1] - a[1]], [b[0] - p[0], b[1] - p[1]]) !== 0;
    });
    const endEdge = (a, b) => {
      // A genuine terminal edge has no continuation just beyond either end
      // on its outside. A staircase side DOES have a diagonally adjacent
      // continuation there, even when a step is several tiles wide.
      if (a[1] === b[1]) {
        const y = a[1] + (b[0] > a[0] ? -1 : 0);
        for (let x = Math.min(a[0], b[0]) - 1; x <= Math.max(a[0], b[0]); x++)
          if (inside(x, y)) return false;
      } else {
        const x = a[0] + (b[1] > a[1] ? 0 : -1);
        for (let y = Math.min(a[1], b[1]) - 1; y <= Math.max(a[1], b[1]); y++)
          if (inside(x, y)) return false;
      }
      return true;
    };
    loops.push(corners.map((p, i) => {
      const a = corners[(i + corners.length - 1) % corners.length];
      const b = corners[(i + 1) % corners.length];
      const besideStreet = letters === 'f' && [-2, -1, 0, 1, 2].some(dy =>
        [-2, -1, 0, 1, 2].some(dx =>
          '#+xzPkbcRh'.includes(map.ground[p[1] + dy]?.[p[0] + dx] || '!')));
      const square = besideStreet || terminals.has(p.join(',')) || endEdge(a, p) ||
        endEdge(p, b) || p[0] === 0 || p[1] === 0 ||
        p[0] === map.w || p[1] === map.h || corners.length <= 4;
      return { point: p.map(n => n * tile), square };
    }));
  }
  return loops;
}

export function tracePaths(ctx, loops, radius = 8) {
  // Resample before averaging. Simplified corners can be hundreds of pixels
  // apart; averaging them directly cuts across lawns and playgrounds.
  traceSmooth(ctx, loops.map(source => source.flatMap((vertex, i) => {
    const next = source[(i + 1) % source.length];
    const steps = Math.max(1, Math.ceil(Math.hypot(
      next.point[0] - vertex.point[0], next.point[1] - vertex.point[1]) / Math.max(1, radius)));
    return Array.from({ length: steps }, (_, j) => ({
      point: vertex.point.map((n, axis) => n + (next.point[axis] - n) * j / steps),
      square: j === 0 ? vertex.square : vertex.square && next.square,
    }));
  })), 3);
}

export function traceTerrain(ctx,loops) {
  traceSmooth(ctx, loops.map(loop => loop.map(point =>
    ({ point, square: !!point.square }))), 3);
}

function traceSmooth(ctx, loops, passes) {
  ctx.beginPath();
  for (const source of loops) {
    if (!source.length) continue;
    let loop = source;
    for (let pass = 0; pass < Math.min(passes, Math.floor(source.length / 8)); pass++)
      loop = loop.map((vertex, i) => {
        if (vertex.square) return vertex;
        const a = loop[(i + loop.length - 1) % loop.length].point;
        const b = loop[(i + 1) % loop.length].point;
        return { ...vertex, point: vertex.point.map((n, axis) =>
          (a[axis] + 2 * n + b[axis]) / 4) };
      });
    const midpoint = (a, b) => a.map((n, axis) => (n + b[axis]) / 2);
    const first = loop[0], last = loop.at(-1);
    ctx.moveTo(...(first.square ? first.point : midpoint(last.point, first.point)));
    for (let i = 0; i < loop.length; i++) {
      const vertex = loop[i], next = loop[(i + 1) % loop.length];
      if (vertex.square) ctx.lineTo(...vertex.point);
      else ctx.quadraticCurveTo(...vertex.point,
        ...(next.square ? next.point : midpoint(vertex.point, next.point)));
    }
    ctx.closePath();
  }
}
