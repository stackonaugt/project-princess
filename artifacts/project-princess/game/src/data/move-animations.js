// Keep the Studio editor, preview and battle renderer on the same animation set.
// The first fourteen are the general moves; the rest are pet routines that
// pose the pet's own sheet (walk 1-4, jump 5-7, paw 8-10).
export const MOVE_ANIMATIONS = Object.freeze([
  'lunge', 'bite', 'claw', 'beam', 'shout', 'heal',
  'fade', 'hop', 'dig', 'gust', 'stink', 'flame', 'bed', 'burnbed',
  'scoot', 'zoomies', 'herd', 'nap', 'stare', 'puppyeyes', 'snack',
  'fetch', 'splash', 'shake', 'string', 'stretch', 'sharpen',
]);

// Signature moves: move id -> the routine it plays in battle. This wins over
// the move's own `anim`, so a pet's special keeps its routine even if the move
// data is resynced. A list plays each routine in turn. To give a new move a
// routine, add it here (or set its `anim` to any name in MOVE_ANIMATIONS).
export const SIGNATURE_ANIMATIONS = Object.freeze({
  humpbed: 'bed',                       // Princess
  scoot: 'scoot',                       // Poppy
  bluestring: 'string', extendclaws: 'stretch',            // Salami
  stretch: 'stretch',                   // Spooky
  staredown: 'stare',                   // Stanley (and Centurionely)
  fetch: 'fetch', fountaindive: 'splash', puppyeyes: 'puppyeyes', benchsnack: 'snack', // Girlie
  puddlejump: 'splash', shakeoff: 'shake', dirtnap: 'nap',  // Muddy
  shakeleaf: 'shake', runaway: ['zoomies', 'fade'],        // Rusty
  turbozoom: 'zoomies', sharpen: 'sharpen',                // Steely
  herd: 'herd', kelpiestare: 'stare', pubnap: 'nap',       // Chloe
  twister: 'zoomies',                   // Chlo-nado
  zoomcat: 'zoomies',                   // Ziggy
  breadcrumbs: 'snack',                 // Emilio
  gordonfood: 'snack',                  // Marty
  royalrest: 'nap',                     // Queencess
  cured: 'nap',                         // Sopressa
});

// Which pet sheet action each routine cycles through while it plays.
export const ANIMATION_POSES = Object.freeze({
  lunge: 'walk', hop: 'jump', bite: 'walk', claw: 'paw', shout: 'jump', dig: 'paw',
  bed: 'paw', burnbed: 'paw', scoot: 'paw', zoomies: 'walk', herd: 'walk',
  fetch: 'walk', splash: 'jump', shake: 'walk', string: 'paw', stretch: 'paw', sharpen: 'paw',
});

// The routine(s) a move plays, always as a list.
export function moveAnimations(id, move) {
  const anim = SIGNATURE_ANIMATIONS[id] ?? move?.anim;
  return [].concat(anim ?? []).filter(Boolean);
}
