export const BAKE_CONTESTANTS = [
  { id: 'bakemeghan', name: 'Meghan Hopper', dish: 'Lemon layer cake', base: 25,
    lines: ['Meghan smooths her apron. "Betty has been talking about this for weeks. I hope you brought more than confidence."', '"A level cake, a light crumb, a clean finish. That is all. Apparently that is quite a lot."'] },
  { id: 'bakeanil', name: 'Anil', dish: 'Spiced apple sponge', base: 22,
    lines: ['Anil has labelled every bowl. "I do not improvise until the cake is out of the oven."', '"Dry ingredients first. Gentle folding after the wet ingredients. Stop when the batter goes glossy."'] },
  { id: 'bakedot', name: 'Dot', dish: 'Garden berry cake', base: 21,
    lines: ['Dot is arranging berries with surgical care. "Half of baking is knowing when to leave it alone."', '"Watch the cake, not just the temperature. A tall, golden cake is ready. A dark cake is a rescue operation."'] },
];
export const BAKE_NPCS = Object.fromEntries(BAKE_CONTESTANTS.map((c, i) => [c.id, {
  name: c.name, role: 'Bake-off contestant', lines: c.lines.map(line => [line]),
  look: { hair: ['#683b28', '#28222a', '#cac0b3'][i], shirt: ['#a65e75', '#559284', '#8a75a0'][i],
    skin: ['#edc6a1', '#a97655', '#f0cba8'][i], pants: '#343b45', hairStyle: i === 1 ? 'short' : 'long' },
}]));
BAKE_NPCS.bakejudge = {
  name: 'Ruth', role: 'Bake-off judge', lines: [['I judge taste, texture and presentation. Betty judges the level of neighbourhood drama.']],
  look: { hair: '#b1aba0', hairStyle: 'short', shirt: '#4b6878', pants: '#343b45', skin: '#dfbb97', glasses: true },
};
BAKE_NPCS.bakehallie = {
  name: 'Hallie', role: 'Presentation judge', lines: [['Give every decoration room. A clear centre and a balanced ring make the cake look finished.']],
  look: { hair: '#47362d', hairStyle: 'long', shirt: '#6c8298', pants: '#343b45', skin: '#c5916c' },
};
