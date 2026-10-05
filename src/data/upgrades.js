// House upgrades and garden tools, bought from Olly at Bunnings Warehouse
// (Altona North). House upgrades change something at home: the home and yard
// maps check state.data.upgrades when they are built (world/maps/home.js,
// yard.js). Tools (tool: true) change how farming works (WorldScene.usePlot,
// state.newDay).
export const UPGRADES = {
  veggiepatch: { name: 'Backyard veggie patch', price: 60, desc: 'Six garden beds in the backyard. Grow your own pet treats.' },
  petdoor:     { name: 'Pet door', price: 80, desc: 'Pets at home wander out and bring you a little something most mornings.' },
  twinsroom:   { name: 'Finish the twins\' room', price: 120, desc: 'Paint it, clear the renovation junk, add a rug and a mobile. Finally.' },
  pool:        { name: 'Paddling pool', price: 100, desc: 'A splash pool in the backyard. Pets at home get happier every day you visit.' },
  hose:        { name: 'Long garden hose', price: 45, tool: true, desc: 'Water one bed and you water every bed in that garden.' },
  sprinkler:   { name: 'Backyard sprinkler', price: 90, tool: true, desc: 'Your backyard beds water themselves every morning.' },
};
export const UPGRADE_ORDER = Object.keys(UPGRADES).filter(id => !UPGRADES[id].tool);
export const TOOL_ORDER = Object.keys(UPGRADES).filter(id => UPGRADES[id].tool);
