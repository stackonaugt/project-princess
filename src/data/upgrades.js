// House upgrades, bought at Gaz's sausage sizzle stand (Laverton Station).
// Each one changes something at home. The home and yard maps check
// state.data.upgrades when they are built (see world/maps/home.js, yard.js).
export const UPGRADES = {
  veggiepatch: { name: 'Backyard veggie patch', price: 60, desc: 'Six garden beds in the backyard. Grow your own pet treats.' },
  petdoor:     { name: 'Pet door', price: 80, desc: 'Pets at home wander out and bring you a little something most mornings.' },
  twinsroom:   { name: 'Finish the twins\' room', price: 120, desc: 'Paint it, clear the renovation junk, add a rug and a mobile. Finally.' },
  pool:        { name: 'Paddling pool', price: 100, desc: 'A splash pool in the backyard. Pets at home get happier every day you visit.' },
};
export const UPGRADE_ORDER = Object.keys(UPGRADES);
