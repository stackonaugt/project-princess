// Furniture for the house, from Franco Cozzo in Footscray. Buy a piece and it
// goes in the house straight away; swap back any time from the same shop.
// state.data.furniture: { couch: id, owned: [ids] }. home.js draws the couch.
export const COUCHES = {
  old: { name: 'The old blue couch', price: 0, desc: 'Came with Paddy. Saggy in the middle. Beloved.' },
  banana: { name: 'The banana couch', price: 180, desc: 'A curved yellow lounge, straight out of the ads. Megalo!' },
  leather: { name: 'Brown leather couch', price: 150, desc: 'Buttoned, brown and very serious. Sticks to your legs in summer.' },
};
export const COUCH_ORDER = Object.keys(COUCHES);
