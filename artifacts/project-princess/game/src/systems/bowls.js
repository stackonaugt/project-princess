// Lawn bowls rules shared by the bowls screen (ui/bowls.js), the club
// championship (systems/bowls-club.js) and the tests. No DOM here.
//
// Distances are measured the way bowlers do: the gap between the bowl and the
// jack, edge to edge, so a bowl resting against the jack (a toucher) is 0 cm.
// The green is drawn to the scale of the bowls themselves: a 10 px bowl is
// about 12.5 cm across and the 6 px jack about 6.4 cm, so a pixel is 1.25 cm.
// (It used to be centre to centre at 8 cm a pixel, so a bowl sitting right
// against the jack read as 64 cm and one a bowl's width off read as 100 cm.)

export const BOWL_R = 5, JACK_R = 3, CM_PER_PX = 1.25;
export const DUCK_CM_PER_PX = 8;   // feeding the ducks keeps its old, centre to centre scale

// The gap in centimetres between a stopped bowl at (x, y) and the jack.
export function gapCm(x, y, jack, mode = 'bowls') {
  const d = Math.hypot(x - jack.x, y - jack.y);
  if (mode === 'ducks') return Math.round(d * DUCK_CM_PER_PX);
  return Math.max(0, Math.round((d - BOWL_R - JACK_R) * CM_PER_PX));
}
// How far from the jack's centre a bowl sits for a given gap (the inverse).
export const centreDistance = cm => BOWL_R + JACK_R + cm / CM_PER_PX;

// The old blokes' best bowl in a friendly end. They lift their game every
// time you beat them (`wins`, capped at 4), so their mark tightens.
export function rivalMark(wins = 0, rand = Math.random) {
  const lift = Math.min(4, Math.max(0, wins | 0));
  return Math.round(Math.max(4, 12 - lift * 2) + rand() * (40 - lift * 6));
}

// Where the rival's bowls lie, so you can see what you have to beat: the
// closest exactly `best` cm off the jack, the other two further out. Each one
// is kept on the green (bounds { x0, y0, x1, y1 }); if a random angle would
// put it off, it falls back to lying short of the jack, towards the mat.
export function rivalBowls(jack, best, bounds, rand = Math.random, n = 3) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const cm = i === 0 ? best : best + 15 + Math.round(rand() * 70);
    const r = centreDistance(cm);
    let pos = null;
    for (let tries = 0; tries < 12 && !pos; tries++) {
      const a = rand() * Math.PI * 2, x = jack.x + Math.cos(a) * r, y = jack.y + Math.sin(a) * r;
      if (x > bounds.x0 + BOWL_R && x < bounds.x1 - BOWL_R && y > bounds.y0 + BOWL_R && y < bounds.y1 - BOWL_R
        && !out.some(o => Math.hypot(o.x - x, o.y - y) < BOWL_R * 2 + 1)) pos = { x, y };
    }
    if (!pos) { const a = Math.PI / 2 + (i - 1) * 0.5; pos = { x: jack.x + Math.cos(a) * r, y: jack.y + Math.sin(a) * r }; }
    out.push({ ...pos, cm });
  }
  return out;
}
