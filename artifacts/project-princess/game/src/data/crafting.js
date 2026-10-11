// Crafting at the shed in the yard (WorldScene.workbench, systems/crafting.js).
//
// Materials come two ways. Scrap (timber, cloth, cord, bolts) is scavenged for
// free: wheelie bins (WorldScene.checkBin) and the junk pile by the shed in the
// yard (a forage spot, one a day). New stock (wood, fabric, rope, screws) is
// sold in the Materials tab at Bunnings and costs more. Recipes are written in
// scrap; MATERIAL_ALTS lets new stock stand in for it (scrap is used first).
export const MATERIAL_ALTS = { timber: ['wood'], cloth: ['fabric'], cord: ['rope'], bolts: ['screws'] };
// What the shed calls each material (either kind counts).
export const MATERIAL_NAMES = { timber: 'Timber', cloth: 'Fabric', cord: 'Cord', bolts: 'Bolts' };

export const CRAFT_ITEMS = {
  courseextension: { name: 'Course extension', story: true, desc: 'Adds a tunnel, stay ring and recall marker to your yard course.' },
  // Scrap: scavenged, never sold.
  timber: {
    name: "Salvaged timber",
    farm: true,
    price: 5,
    desc: "Out of somebody's hard rubbish. Sand the splinters off first.",
  },
  cloth: {
    name: "Fabric offcuts",
    farm: true,
    price: 3,
    desc: "Left over from a very ambitious sewing project.",
  },
  cord: {
    name: "Old cord",
    farm: true,
    price: 3,
    desc: "A tangle of string and old rope. Good enough for homemade toys.",
  },
  bolts: {
    name: "Bolts and washers",
    farm: true,
    price: 3,
    desc: "A jar Paddy has been keeping for years.",
  },
  // New stock from Bunnings: dearer, does the same job.
  wood: { name: "Wood", farm: true, price: 12, desc: "Fresh pine lengths from the timber aisle. Straight, smooth and smells like a sausage sizzle." },
  fabric: { name: "Fabric", farm: true, price: 9, desc: "A new canvas drop sheet. Too nice to drop paint on." },
  rope: { name: "Rope", farm: true, price: 7, desc: "A coil of new rope. Olly ties a knot in it to show off." },
  screws: { name: "Box of screws", farm: true, price: 8, desc: "Galvanised. For once, exactly the right size." },
  // Homemade presents (gift: true). lovedBy / likedBy are merged into their
  // tastes in data/friends.js.
  birdhouse: { name: "Homemade birdhouse", gift: true, lovedBy: ['gordon', 'trish', 'chris'], likedBy: ['mem', 'olly', 'concetta'], desc: "A wonky little birdhouse. The rosellas will not mind." },
  planterbox: { name: "Timber planter box", gift: true, lovedBy: ['olly', 'chris', 'concetta'], likedBy: ['gordon', 'betty', 'mem'], desc: "Big enough for a lemon tree. Nonna approved, nearly." },
  winerack: { name: "Homemade wine rack", gift: true, lovedBy: ['slinks', 'ward'], likedBy: ['corni', 'paddy', 'rose'], desc: "Holds six bottles. Seven if you lean on it." },
  totebag: { name: "Patchwork tote bag", gift: true, lovedBy: ['rose', 'shannon', 'mem'], likedBy: ['sinead', 'betty', 'slinks'], desc: "Sturdy enough for a stack of library books, or a week of Coles." },
  cushion: { name: "Patchwork cushion", gift: true, lovedBy: ['trish', 'betty'], likedBy: ['paddy', 'nicholas', 'sinead'], desc: "Every offcut you own, sewn into one cheerful square." },
  tram: { name: "Wooden toy tram", gift: true, lovedBy: ['tim', 'nicholas'], likedBy: ['paddy', 'gordon'], desc: "A little green and gold W-class. It does not run on time either." },
  coursekit: {
    name: "Starter hurdles",
    story: true,
    desc: "Two beginner jumps for the yard. Upgrade at the shed to add stations.",
  },
  weavekit: {
    name: "Weave poles",
    story: true,
    desc: "A harder yard practice layout.",
  },
  trainingvest: {
    name: "Training vest",
    story: true,
    equipment: "clothing",   // listed in the Bag's Equipment tab
    desc: "Pockets for treats. Adds 10% pet lesson XP.",
  },
  ropeball: {
    name: "Homemade rope ball",
    gift: true,
    desc: "Made with care. A present for a friend with a dog.",
  },
  showrosette: {
    name: "Exhibition champion rosette",
    story: true,
    desc: "The whole school helped win this.",
  },
};
// Icon colours: packet art by default, a few with their own colours.
const ART = {
  showrosette: { body: "#bc4b70" },
  wood: { body: "#e8c890", label: "#f4e8c8" }, fabric: { body: "#e8e0c8", label: "#c8b890" },
  rope: { body: "#d8b878", label: "#8a6a3a" }, screws: { body: "#b8bcc4", label: "#2a5a9a" },
  birdhouse: { kind: "cake", body: "#b8804a", cap: "#c8443a", label: "#3a2416" },
  planterbox: { kind: "cake", body: "#a27c50", cap: "#5ab04a", label: "#67452d" },
  winerack: { kind: "wine", body: "#a27c50", label: "#5a1a2a", cap: "#67452d" },
  totebag: { kind: "packet", body: "#d86a8a", label: "#4a8ac8", cap: "#f0d878" },
  cushion: { kind: "packet", body: "#e8a040", label: "#5ab04a", cap: "#d83a4a" },
  tram: { kind: "packet", body: "#3a8a4a", label: "#e8c040", cap: "#1e1e24" },
};
for (const [id, item] of Object.entries(CRAFT_ITEMS))
  item.art = {
    kind: "packet",
    body: "#a27c50",
    label: "#f0d878",
    cap: "#67452d",
    ...ART[id],
  };
export const CRAFT_RECIPES = {
  courseextension: {
    name: "Course extension: tunnel and cue rings", level: 2,
    needs: { timber: 6, cloth: 4, cord: 4, bolts: 3 }, requires: 'coursekit', xp: 80, unique: true,
  },
  coursekit: {
    name: "Starter hurdles",
    level: 1,
    needs: { timber: 4, cord: 2, cloth: 1, bolts: 2 },
    xp: 55,
    unique: true,
  },
  ropeball: {
    name: "Rope ball",
    level: 1,
    needs: { cloth: 1, cord: 1 },
    xp: 18,
  },
  weavekit: {
    name: "Weave poles",
    level: 3,
    requires: "courseextension",
    needs: { timber: 4, bolts: 2, cord: 1 },
    xp: 65,
    unique: true,
  },
  trainingvest: {
    name: "Training vest",
    level: 3,
    needs: { cloth: 4, cord: 2, ribbon: 1 },
    xp: 80,
    unique: true,
  },
  // Homemade presents
  cushion: { name: "Patchwork cushion", level: 1, needs: { cloth: 3 }, xp: 15 },
  totebag: { name: "Patchwork tote bag", level: 1, needs: { cloth: 2, cord: 1 }, xp: 18 },
  birdhouse: { name: "Homemade birdhouse", level: 1, needs: { timber: 2, bolts: 1 }, xp: 22 },
  tram: { name: "Wooden toy tram", level: 2, needs: { timber: 2, bolts: 2, cord: 1 }, xp: 30 },
  planterbox: { name: "Timber planter box", level: 2, needs: { timber: 3, bolts: 2 }, xp: 30 },
  winerack: { name: "Homemade wine rack", level: 2, needs: { timber: 3, bolts: 2, cord: 1 }, xp: 35 },
};
