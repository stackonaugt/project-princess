export const CRAFT_ITEMS = {
  courseextension: { name: 'Course extension', story: true, desc: 'Adds a tunnel, stay ring and recall marker to your yard course.' },
  timber: {
    name: "Salvaged timber",
    farm: true,
    price: 5,
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
};
