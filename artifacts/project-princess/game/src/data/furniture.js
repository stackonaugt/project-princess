// Furniture for the house. Franco Cozzo (Barkly St, Footscray) sells couches,
// beds, rugs, lamps, bookcases, side tables and armchairs; Olly at Bunnings
// sells pot plants. Walk up to a piece in the showroom to see its name and
// price and buy it; it is delivered straight away. Swap back any time from the
// shop's Furniture tab.
// state.data.furniture: { couch, bed, rug, lamp, bookcase, sidetable, armchair,
// plant, owned: [ids] }. Each slot holds the id of the piece in the house;
// home.js draws them. `obj` and `v` are the object kind and variant it is drawn
// as (the couch faces away in the lounge, so home.js swaps front for back).
export const SLOTS = { couch: 'Couch', bed: 'Bed', rug: 'Rug', lamp: 'Lamp', bookcase: 'Bookcase', sidetable: 'Side table', armchair: 'Armchair', plant: 'Pot plants' };

export const FURNITURE = {
  // couches
  old:      { slot: 'couch', obj: 'couch', v: 'front', price: 0, name: 'The old blue couch', desc: 'Came with Paddy. Saggy in the middle. Beloved.' },
  velvet:   { slot: 'couch', obj: 'couch', v: 'front-velvet', price: 640, name: 'Emerald velvet chesterfield', desc: 'Deep green, deeply buttoned. You have to sit up straight on it.' },
  banana:   { slot: 'couch', obj: 'couch', v: 'front-banana', price: 180, name: 'The banana couch', desc: 'A curved yellow lounge, straight out of the ads. Megalo!' },
  leather:  { slot: 'couch', obj: 'couch', v: 'front-leather', price: 150, name: 'Brown leather couch', desc: 'Buttoned, brown and very serious. Sticks to your legs in summer.' },
  floral:   { slot: 'couch', obj: 'couch', v: 'front-floral', price: 35, name: 'Floral nanna couch', desc: 'Cabbage roses and a plastic cover. Smells faintly of lavender.' },
  // beds
  sage:     { slot: 'bed', obj: 'bed', v: 'sage', price: 0, name: 'The old bed', desc: 'Sage doona, one wonky leg. It does the job.' },
  canopy:   { slot: 'bed', obj: 'bed', v: 'canopy', price: 580, name: 'Four poster canopy bed', desc: 'Carved posts and a gold canopy. Fit for a Mayor. Megalo!' },
  waterbed: { slot: 'bed', obj: 'bed', v: 'waterbed', price: 260, name: 'Heated waterbed', desc: 'Straight from 1986. Sloshes when you roll over. The twins love it.' },
  brass:    { slot: 'bed', obj: 'bed', v: 'brass', price: 140, name: 'Brass bed', desc: 'Shiny brass rails and a patchwork quilt. Squeaks a little.' },
  futon:    { slot: 'bed', obj: 'bed', v: 'futon', price: 45, name: 'Futon', desc: 'A share house classic. Folds into a couch. Nobody has ever folded it back.' },
  // rugs
  red:      { slot: 'rug', obj: 'rug', v: 'red', price: 0, name: 'The old red rug', desc: 'Faded in the middle where the sun hits it.' },
  persian:  { slot: 'rug', obj: 'rug', v: 'persian', price: 420, name: 'Persian rug', desc: 'Hand knotted, deep red and blue. Franco swears it is older than him.' },
  shag:     { slot: 'rug', obj: 'rug', v: 'shag', price: 120, name: 'Orange shag pile', desc: 'Toes sink right in. Lose a Lego in it and it is gone for good.' },
  stripe:   { slot: 'rug', obj: 'rug', v: 'stripe', price: 60, name: 'Striped flatweave', desc: 'Cheerful stripes. Easy to hose off after a pet accident.' },
  jute:     { slot: 'rug', obj: 'rug', v: 'jute', price: 20, name: 'Jute mat', desc: 'Scratchy, sensible, smells like a hessian sack.' },
  // lamps
  brasslamp:{ slot: 'lamp', obj: 'floorlamp', v: 'brass', price: 0, name: 'The old floor lamp', desc: 'A brass lamp with a cream shade. Flickers when the fridge kicks in.' },
  crystal:  { slot: 'lamp', obj: 'floorlamp', v: 'crystal', price: 360, name: 'Crystal standing lamp', desc: 'Dripping with crystals. Throws rainbows all over the lounge.' },
  arc:      { slot: 'lamp', obj: 'floorlamp', v: 'arc', price: 150, name: 'Arc lamp', desc: 'A big chrome arc, like a fancy apartment in a magazine.' },
  lava:     { slot: 'lamp', obj: 'floorlamp', v: 'lava', price: 50, name: 'Lava lamp', desc: 'Purple blobs, very slowly. Hypnotises pets for hours.' },
  paper:    { slot: 'lamp', obj: 'floorlamp', v: 'paper', price: 15, name: 'Paper lantern lamp', desc: 'A round paper shade on a stick. Light as air, very flammable.' },
  // bookcases
  oak:      { slot: 'bookcase', obj: 'bookshelf', v: 'oak', price: 0, name: 'The old bookshelf', desc: 'Full of Rose\'s recommendations Helen hasn\'t got to yet.' },
  walnut:   { slot: 'bookcase', obj: 'bookshelf', v: 'walnut', price: 300, name: 'Walnut glass front bookcase', desc: 'Glass doors, brass handles. Makes every paperback look important.' },
  crates:   { slot: 'bookcase', obj: 'bookshelf', v: 'crates', price: 25, name: 'Milk crate bookcase', desc: 'Stacked milk crates. Every Brunswick share house has one.' },
  // side tables
  oaktable: { slot: 'sidetable', obj: 'sidetable', v: 'oak', price: 0, name: 'The old side table', desc: 'Oak, a lamp and a ring stain from someone\'s coffee.' },
  marble:   { slot: 'sidetable', obj: 'sidetable', v: 'marble', price: 280, name: 'Marble side table', desc: 'White marble on gold legs. Cold to touch and to look at.' },
  glass:    { slot: 'sidetable', obj: 'sidetable', v: 'glass', price: 90, name: 'Glass side table', desc: 'Smoked glass. Shows every paw print.' },
  cane:     { slot: 'sidetable', obj: 'sidetable', v: 'cane', price: 40, name: 'Cane side table', desc: 'Woven cane, very seventies, very Queensland holiday.' },
  stump:    { slot: 'sidetable', obj: 'sidetable', v: 'stump', price: 10, name: 'Tree stump table', desc: 'A sanded red gum stump. Gordon approves.' },
  // armchairs
  mustard:  { slot: 'armchair', obj: 'armchair', v: 'mustard', price: 0, name: 'The old mustard armchair', desc: 'Paddy\'s chair. Nobody else sits in it. The cats do.' },
  wingback: { slot: 'armchair', obj: 'armchair', v: 'wingback', price: 390, name: 'Gold wingback throne', desc: 'Gold brocade and carved claw feet. Megalo! Very mayoral.' },
  recliner: { slot: 'armchair', obj: 'armchair', v: 'recliner', price: 210, name: 'Electric recliner', desc: 'Push a button, feet go up. Push it again, feet stay up.' },
  egg:      { slot: 'armchair', obj: 'armchair', v: 'egg', price: 95, name: 'Hanging egg chair', desc: 'A rattan egg on a stand. Spin slowly and think about rates.' },
  beanbag:  { slot: 'armchair', obj: 'armchair', v: 'beanbag', price: 30, name: 'Beanbag', desc: 'A purple vinyl beanbag. Getting out of it is the hard part.' },
  // pot plants (Olly, Bunnings). They replace every pot plant in the house.
  mixed:    { slot: 'plant', obj: 'plant', v: 'fiddle', price: 0, name: 'The old pot plants', desc: 'A fiddle leaf fig and some ferns. Hanging in there.', shop: 'bunnings' },
  monstera: { slot: 'plant', obj: 'plant', v: 'monstera', price: 65, name: 'Monstera', desc: 'Big holey leaves. Every Brunswick lounge room has one.', shop: 'bunnings' },
  bird:     { slot: 'plant', obj: 'plant', v: 'bird', price: 80, name: 'Bird of paradise', desc: 'Tall paddle leaves and orange flowers like a bird\'s head.', shop: 'bunnings' },
  lemon:    { slot: 'plant', obj: 'plant', v: 'lemon', price: 55, name: 'Potted lemon tree', desc: 'A dwarf Meyer lemon. Every nonna on the street will have opinions.', shop: 'bunnings' },
  lily:     { slot: 'plant', obj: 'plant', v: 'lily', price: 30, name: 'Peace lily', desc: 'Droops dramatically when thirsty, perks up when watered. Very theatrical.', shop: 'bunnings' },
  ivy:      { slot: 'plant', obj: 'plant', v: 'ivy', price: 20, name: 'Devil\'s ivy', desc: 'Trails everywhere and will not die. Not even if you try.', shop: 'bunnings' },
  cactus:   { slot: 'plant', obj: 'plant', v: 'cactus', price: 12, name: 'Cactus', desc: 'Prickly, low effort, keeps the cats off the windowsill.', shop: 'bunnings' },
};
export const FURNITURE_ORDER = Object.keys(FURNITURE);
// What starts in the house.
export const DEFAULT_FURNITURE = { couch: 'old', bed: 'sage', rug: 'red', lamp: 'brasslamp', bookcase: 'oak', sidetable: 'oaktable', armchair: 'mustard', plant: 'mixed' };
// The piece in a slot of the house right now.
export const placed = (furn, slot) => FURNITURE[furn?.[slot]]?.slot === slot ? FURNITURE[furn[slot]] : FURNITURE[DEFAULT_FURNITURE[slot]];
