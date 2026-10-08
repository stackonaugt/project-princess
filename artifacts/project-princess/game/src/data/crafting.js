export const CRAFT_ITEMS = {
  timber: {
    name: "Salvaged timber",
    farm: true,
    price: 3,
    desc: "Sand the splinters off first.",
  },
  cloth: {
    name: "Fabric offcuts",
    farm: true,
    price: 3,
    desc: "Left over from a very ambitious sewing project.",
  },
  cord: {
    name: "Soft cord",
    farm: true,
    price: 3,
    desc: "For homemade toys and equipment.",
  },
  bolts: {
    name: "Bolts and washers",
    farm: true,
    price: 3,
    desc: "A jar Paddy has been keeping for years.",
  },
  coursekit: {
    name: "Training course kit",
    story: true,
    desc: "Portable hurdles and markers for the yard.",
  },
  weavekit: {
    name: "Weave poles",
    story: true,
    desc: "A harder yard practice layout.",
  },
  trainingvest: {
    name: "Training vest",
    story: true,
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
for (const [id, item] of Object.entries(CRAFT_ITEMS))
  item.art = {
    kind: "packet",
    body: id === "showrosette" ? "#bc4b70" : "#a27c50",
    label: "#f0d878",
    cap: "#67452d",
  };
export const CRAFT_RECIPES = {
  coursekit: {
    name: "Training course kit",
    level: 1,
    needs: { timber: 3, cord: 2, cloth: 1, bolts: 1 },
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
    level: 2,
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
};
