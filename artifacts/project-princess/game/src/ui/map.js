// Map app: a live local map (pan, pinch, tap to pick, Walk) plus the whole route as a list of stops.
import './map.css';
import { h } from './dom.js';
import { bus } from '../bus.js';
import { state } from '../systems/state.js';
import { ZONES, SUBURBS, ROUTE, TRAM_ZONES } from '../data/regions.js';
import { NPCS } from '../data/npcs.js';
import { PETS } from '../data/pets.js';
import { TILE as T } from '../config.js';
import * as guidance from '../systems/guidance.js';


const WALKABLE = new Set(['local', 'exit']);

export function openMap(panel, close, scene) {
  const here = state.data.region, disposers = [];
  let dead = false, tab = scene?.map ? 'local' : 'world', sel = null, pin = null, guide = guidance, raf = 0, dirty = true;
  const cleanup = () => { dead = true; cancelAnimationFrame(raf); disposers.splice(0).forEach(f => f()); };
  const on = (t, e, f, o) => { t.addEventListener(e, f, o); disposers.push(() => t.removeEventListener(e, f, o)); };

  const body = h('div', { class: 'mp-wrap' });
  const tabs = h('div', { class: 'mp-tabs' });
  const closeAll = () => { cleanup(); close(); };
  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Map'), h('button', { class: 'wood-btn small', onclick: closeAll }, 'Back')),
    tabs, body);

  const resolve = d => guide.resolveDestination(d, scene);
  const routeOk = (point, target) => {
    try {
      const r = scene.navigation.router.route(scene.player, point, target ? (target.r || 22) : 0);
      return r.status === 'ok' && r.points.length ? r : null;
    } catch { return null; }
  };

  // ---------------- local map ----------------
  const M = scene?.map;
  let canvas, ctx, img, view = { s: 1, x: 0, y: 0 }, W = 0, H = 0, info, walkBtn, sheetTxt, route = null, fixed = false;
  const worldW = () => (M?.w || 1) * T, worldH = () => (M?.h || 1) * T;
  const fit = () => {
    if (!W) return;
    view.s = Math.min(W / worldW(), H / worldH());
    view.x = (W - worldW() * view.s) / 2; view.y = (H - worldH() * view.s) / 2; dirty = true;
  };
  const clamp = () => {
    const ww = worldW() * view.s, hh = worldH() * view.s;
    view.x = ww <= W ? (W - ww) / 2 : Math.min(0, Math.max(W - ww, view.x));
    view.y = hh <= H ? (H - hh) / 2 : Math.min(0, Math.max(H - hh, view.y));
  };
  const zoomAt = (f, cx, cy) => {
    const minS = Math.min(W / worldW(), H / worldH()) * 0.9, ns = Math.min(Math.max(view.s * f, minS), 10);
    f = ns / view.s; view.x = cx - (cx - view.x) * f; view.y = cy - (cy - view.y) * f; view.s = ns; clamp(); dirty = true;
  };

  const markers = () => {
    const out = [];
    if (!scene?.player) return out;
    for (const e of M.exits || []) {
      const dest = e.to, seen = dest && state.data.visited.includes(dest);
      const restriction = guide.exitRestriction(scene.regionId, e, scene);
      let res = restriction ? { status: 'unreachable', text: restriction } : null, label = 'Unexplored exit';
      if (seen) label = ZONES[dest]?.name || 'Exit';
      const pt = { x: (e.x + e.w / 2) * T, y: (e.y + e.h / 2) * T };
      const locked = res && !WALKABLE.has(res.status);
      out.push({ kind: 'exit', x: pt.x, y: pt.y, label, point: res?.point || pt, res, locked, rw: e.w * T, rh: e.h * T, ex: e });
    }
    for (const n of scene.npcs || []) {
      if (n.gone || !n.visible || !state.data.friends[n.id]?.met) continue;
      out.push({ kind: 'npc', x: n.x, y: n.y, label: NPCS[n.id]?.name || 'Friend', point: { x: n.x, y: n.y }, target: { kind: 'npc', ref: n, r: n.spot.counter ? 30 : 22 } });
    }
    for (const p of scene.pets || []) {
      if (!state.isFound(p.id)) continue;
      out.push({ kind: 'pet', x: p.x, y: p.y, label: PETS.find(q => q.id === p.id)?.name || 'Pet', point: { x: p.x, y: p.y }, target: { kind: 'pet', ref: p, r: 22 } });
    }
    if (pin?.res?.point) out.push({ kind: 'pin', x: pin.res.point.x, y: pin.res.point.y, label: guide.pinnedObjective()?.text || 'Pinned', point: pin.res.point, res: pin.res, target: pin.res.target });
    return out;
  };

  const COL = { exit: '#e8a030', npc: '#3a7ad8', pet: '#e2506a', pin: '#d83a3a', me: '#ffffff' };
  const draw = () => {
    raf = requestAnimationFrame(draw);
    if (!dirty || !ctx || !W) return;
    dirty = false;
    const dpr = devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = false;
    ctx.save(); ctx.translate(view.x, view.y); ctx.scale(view.s, view.s);
    if (img) ctx.drawImage(img, 0, 0, worldW(), worldH());
    // The ground texture omits standing objects: show their actual collision footprint.
    ctx.fillStyle = 'rgba(47,35,28,.6)';
    for (let y = 0; y < M.h; y++) for (let x = 0; x < M.w; x++)
      if (M.solid[y * M.w + x]) ctx.fillRect(x * T, y * T, T, T);
    const ms = markers(), u = 1 / view.s;
    for (const m of ms) if (m.kind === 'exit') {
      ctx.fillStyle = m.locked ? 'rgba(176,42,32,.35)' : 'rgba(232,160,48,.4)';
      ctx.strokeStyle = m.locked ? '#b02a20' : '#e8a030'; ctx.lineWidth = 2 * u;
      ctx.fillRect(m.x - m.rw / 2, m.y - m.rh / 2, m.rw, m.rh); ctx.strokeRect(m.x - m.rw / 2, m.y - m.rh / 2, m.rw, m.rh);
    }
    if (route?.points?.length) {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 5 * u; ctx.lineCap = ctx.lineJoin = 'round'; ctx.setLineDash([]);
      const trace = () => { ctx.beginPath(); ctx.moveTo(scene.player.x, scene.player.y); for (const p of route.points) ctx.lineTo(p.x, p.y); ctx.stroke(); };
      trace(); ctx.strokeStyle = '#3a7ad8'; ctx.lineWidth = 3 * u; ctx.setLineDash([8 * u, 6 * u]); trace(); ctx.setLineDash([]);
    }
    for (const m of ms) {
      if (m.kind === 'exit') continue;
      const r = (m.kind === 'pin' ? 8 : 6) * u;
      ctx.beginPath(); ctx.arc(m.x, m.y, r, 0, 7); ctx.fillStyle = COL[m.kind]; ctx.fill();
      ctx.lineWidth = 2 * u; ctx.strokeStyle = '#1e1e24'; ctx.stroke();
    }
    if (sel) { ctx.beginPath(); ctx.arc(sel.point.x, sel.point.y, 11 * u, 0, 7); ctx.lineWidth = 3 * u; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.lineWidth = 1.5 * u; ctx.strokeStyle = '#1e1e24'; ctx.stroke(); }
    if (scene?.player) {
      ctx.beginPath(); ctx.arc(scene.player.x, scene.player.y, 8 * u, 0, 7); ctx.fillStyle = COL.me; ctx.fill();
      ctx.lineWidth = 3 * u; ctx.strokeStyle = '#d83a3a'; ctx.stroke();
      ctx.beginPath(); ctx.arc(scene.player.x, scene.player.y, 3 * u, 0, 7); ctx.fillStyle = '#d83a3a'; ctx.fill();
    }
    ctx.restore();
  };

  const toWorld = (px, py) => ({ x: (px - view.x) / view.s, y: (py - view.y) / view.s });
  const pick = (px, py) => {
    const w = toWorld(px, py), rad = 20 / view.s;
    let best = null, bd = rad * rad;
    const ms = markers();
    for (const m of ms) {
      const d = (m.x - w.x) ** 2 + (m.y - w.y) ** 2;
      const inRect = m.kind === 'exit' && Math.abs(w.x - m.x) <= m.rw / 2 + 6 / view.s && Math.abs(w.y - m.y) <= m.rh / 2 + 6 / view.s;
      const dd = inRect ? 0 : d;
      if (dd <= bd) { bd = dd; best = m; }
    }
    if (best) return best;
    const tx = Math.floor(w.x / T), ty = Math.floor(w.y / T);
    if (tx < 0 || ty < 0 || tx >= M.w || ty >= M.h || M.solid?.[ty * M.w + tx]) return { kind: 'spot', label: 'Blocked', point: w, blocked: true };
    return { kind: 'spot', label: 'Walk here', point: { x: (tx + 0.5) * T, y: (ty + 0.5) * T } };
  };

  const select = m => {
    if (m.kind === 'exit' && !m.locked) {
      const point = guide.exitPoint(m.ex, scene);
      if (point) m.point = point;
      else m.blocked = true;
    }
    sel = m; route = null;
    if (m && !m.blocked && (!m.res || WALKABLE.has(m.res.status))) {
      route = routeOk(m.point, m.target);
      m.unreachable = !route;
    }
    dirty = true; renderSheet();
  };
  const renderSheet = () => {
    if (!sheetTxt) return;
    if (!sel) { sheetTxt.replaceChildren(h('b', {}, 'Tap a place on the map'), 'Drag to pan, pinch or use + and - to zoom.'); walkBtn.disabled = true; return; }
    const bad = sel.blocked ? 'Nothing to walk to here.' : sel.res && !WALKABLE.has(sel.res.status) ? (sel.res.text || 'You cannot go that way yet.') : sel.unreachable ? 'No walkable route from here.' : '';
    const kind = { exit: 'Exit', npc: 'Friend', pet: 'Pet', pin: 'Pinned', spot: 'Spot' }[sel.kind];
    sheetTxt.replaceChildren(h('b', {}, sel.label), kind + (sel.res?.text && !bad && sel.kind !== 'spot' ? ' - ' + sel.res.text : ''), ...(bad ? [h('div', { class: 'bad' }, bad)] : []));
    walkBtn.disabled = !!bad;
  };
  const walk = () => {
    if (!sel || walkBtn.disabled) return;
    const m = sel;
    if (!routeOk(m.point, m.target)) { m.unreachable = true; renderSheet(); return; }
    cleanup();
    bus.emit('navigation:request', m.point, m.target);
  };

  const buildLocal = () => {
    canvas = h('canvas', { 'aria-label': 'Local map' });
    ctx = canvas.getContext('2d');
    try { img = scene.textures.get('ground-' + scene.regionId + '-' + (M.rev || 0)).getSourceImage(); } catch { img = null; }
    const stage = h('div', { class: 'mp-stage' }, canvas,
      h('div', { class: 'mp-zoom' },
        h('button', { 'aria-label': 'Zoom in', onclick: () => zoomAt(1.5, W / 2, H / 2) }, '+'),
        h('button', { 'aria-label': 'Zoom out', onclick: () => zoomAt(1 / 1.5, W / 2, H / 2) }, '-'),
        h('button', { 'aria-label': 'Centre on me', style: { fontSize: '13px' }, onclick: () => { view.s = Math.max(view.s, 3); view.x = W / 2 - scene.player.x * view.s; view.y = H / 2 - scene.player.y * view.s; clamp(); dirty = true; } }, 'Me')),
      h('div', { class: 'mp-key' },
        ...[['me', 'You'], ['exit', 'Exit'], ['npc', 'Friend'], ['pet', 'Pet']].map(([k, t]) => h('span', {}, h('i', { style: { background: COL[k], border: '1px solid #1e1e24' } }), t))));
    sheetTxt = h('div', { class: 'txt' });
    walkBtn = h('button', { class: 'wood-btn', onclick: walk }, 'Walk');
    info = h('div', { class: 'mp-sheet' }, sheetTxt, walkBtn);
    const side = h('div', { class: 'mp-side' }, info);
    if (pin !== null) side.prepend(pinStrip());
    body.replaceChildren(stage, side);
    body.classList.toggle('land', innerWidth > innerHeight);

    const size = () => {
      const r = stage.getBoundingClientRect(), dpr = devicePixelRatio || 1;
      const first = !W; W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      if (first || !fixed) fit(); else { clamp(); dirty = true; }
      dirty = true;
    };
    const ro = new ResizeObserver(size); ro.observe(stage); disposers.push(() => ro.disconnect());
    requestAnimationFrame(() => !dead && size());

    // pointers: drag, pinch, tap
    const ptrs = new Map(); let moved = 0, pinch0 = 0, down = null;
    const pos = e => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    on(canvas, 'pointerdown', e => { canvas.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, pos(e)); if (ptrs.size === 1) { moved = 0; down = pos(e); } else { pinch0 = 0; moved = 99; } });
    on(canvas, 'pointermove', e => {
      if (!ptrs.has(e.pointerId)) return;
      const prev = ptrs.get(e.pointerId), p = pos(e); ptrs.set(e.pointerId, p);
      if (ptrs.size === 1) {
        moved += Math.abs(p.x - prev.x) + Math.abs(p.y - prev.y);
        if (moved > 6) { view.x += p.x - prev.x; view.y += p.y - prev.y; clamp(); fixed = true; dirty = true; }
      } else if (ptrs.size === 2) {
        const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y), cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
        if (pinch0) zoomAt(d / pinch0, cx, cy);
        pinch0 = d; fixed = true;
      }
    });
    const up = e => {
      if (!ptrs.has(e.pointerId)) return;
      ptrs.delete(e.pointerId);
      if (ptrs.size === 0 && e.type === 'pointerup' && moved <= 6 && down) select(pick(down.x, down.y));
      if (ptrs.size < 2) pinch0 = 0;
    };
    on(canvas, 'pointerup', up); on(canvas, 'pointercancel', up);
    on(canvas, 'wheel', e => { e.preventDefault(); const p = pos(e); zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, p.x, p.y); fixed = true; }, { passive: false });
    renderSheet();
    cancelAnimationFrame(raf); draw();
  };

  const pinStrip = () => {
    if (!guide?.pinnedObjective) return h('div');
    const o = guide.pinnedObjective();
    if (!o) return h('div');
    const res = pin?.res;
    return h('div', { class: 'mp-pin' + (o.done ? ' done' : '') }, h('span', {}, o.text + (res && res.text && !o.done ? ' (' + res.text + ')' : '')),
      res?.point && !o.done ? h('button', { class: 'wood-btn small', onclick: () => select({ kind: 'pin', label: o.text, x: res.point.x, y: res.point.y, point: res.point, res, target: res.target }) }, 'Show') : null);
  };

  // ---------------- world list ----------------
  const groups = [];
  for (const id of ROUTE) {
    const sub = ZONES[id].suburb;
    if (!groups.length || groups[groups.length - 1].sub !== sub) groups.push({ sub, zones: [] });
    groups[groups.length - 1].zones.push(id);
  }
  let worldMsg = null;
  const pickZone = z => {
    const res = resolve({ region: z });
    if (!res) { worldMsg = { text: ZONES[z].name, bad: 'Directions are not available yet.' }; return buildWorld(); }
    if (z === here) { worldMsg = { text: ZONES[z].name, bad: 'You are already here.' }; return buildWorld(); }
    if (res.point && WALKABLE.has(res.status)) {
      tab = 'local'; build();
      select({ kind: 'pin', label: ZONES[z].name, x: res.point.x, y: res.point.y, point: res.point, res, target: res.target });
      return;
    }
    worldMsg = { text: ZONES[z].name, bad: res.text || 'No directions yet.' }; buildWorld();
  };
  const buildWorld = () => {
    body.classList.remove('land');
    body.replaceChildren(
      h('div', { class: 'ptv-key' }, h('span', { class: 'ptv-badge train' }, 'Train'), h('span', { class: 'ptv-badge tram' }, 'Tram'), h('span', {}, 'Walk anywhere, or tap your myki at a station.')),
      ...(worldMsg ? [h('div', { class: 'mp-sheet' }, h('div', { class: 'txt' }, h('b', {}, worldMsg.text), h('span', { class: 'bad' }, worldMsg.bad)))] : []),
      h('div', { class: 'm-scroll mp-world' }, h('ol', { class: 'route' }, ...groups.map(g => {
        const S = SUBURBS[g.sub], seen = state.suburbVisited(g.sub);
        return h('li', { class: 'route-suburb' + (S.between ? ' between' : '') },
          h('h4', {}, seen ? S.name : '???'),
          h('ul', {}, ...g.zones.map(z => {
            const visited = state.data.visited.includes(z), Z = ZONES[z];
            const train = visited && z === S.station && !S.between, tram = visited && TRAM_ZONES.includes(z);
            return h('li', { class: 'stop' + (visited ? ' seen' : '') + (z === here ? ' here' : '') + (Z.indoor ? ' inside' : '') },
              h('i', { class: 'dot' }),
              visited ? h('button', { class: 'stop-btn', onclick: () => pickZone(z) }, Z.name) : h('span', {}, '???'),
              train ? h('span', { class: 'ptv-badge train' }, 'Train') : null, tram ? h('span', { class: 'ptv-badge tram' }, 'Tram') : null,
              z === here ? h('b', { class: 'you' }, 'You are here') : null);
          })));
      }))));
  };

  const build = () => {
    disposers.splice(0).forEach(f => f());
    cancelAnimationFrame(raf); W = 0;
    tabs.replaceChildren(...(M ? [['local', 'Here'], ['world', 'World']] : [['world', 'World']]).map(([k, t]) =>
      h('button', { class: tab === k ? 'on' : '', onclick: () => { if (tab !== k) { tab = k; sel = null; route = null; build(); } } }, t)));
    if (tab === 'local' && M) buildLocal(); else buildWorld();
  };
  const objective = guide.pinnedObjective();
  if (objective) {
    pin = { res: !objective.done && scene ? resolve(objective.destination) : null };
  }
  build();

  return cleanup;
}
