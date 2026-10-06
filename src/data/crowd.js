// The crowd: unnamed people who walk through the streets, pop in and out of
// shops, browse shopfronts and wait at stations. They have a line or two, no
// menu, no gifts and no hearts. Looks are mixed from these lists, the same
// every time (seeded). Behaviour lives in src/world/crowd.js.
import { rng } from '../util.js';

const SKIN = ['#f2c79a', '#e8b48a', '#d49a6a', '#b07a4a', '#8a5a34', '#5e3a20', '#f6d8b8', '#c88a5a'];
const HAIR = ['#141012', '#3a2416', '#6b3f1f', '#a86a2a', '#d8b060', '#d8d4cc', '#8a8a88', '#7a2a1a', '#2a1a10'];
const STYLE = ['short', 'long', 'bob', 'bun', 'curly', 'bald', 'cap', 'spiky', 'pixie', 'wavy', 'wavyshort', 'messybun'];
const SHIRT = ['#3fa38f', '#c8443a', '#2f5f8f', '#e8c030', '#f4f0e6', '#2a2a30', '#7a3aa8', '#e2708a', '#5aa83a', '#d87a2a', '#8a8e98', '#1e3a5a'];
const PANTS = ['#33446e', '#2a2a30', '#5a4a3a', '#8a7a5a', '#3a3a48', '#6a6e78', '#2a3a5a'];
const CAP = ['#c8443a', '#2f5f8f', '#1e1e24', '#3fa38f'];

export const CROWD_COUNT = 16;
export const CROWD = Array.from({ length: CROWD_COUNT }, (_, i) => {
  const r = rng(9100 + i * 37);
  const pick = a => a[Math.floor(r() * a.length)];
  const look = { skin: pick(SKIN), hair: pick(HAIR), hairStyle: pick(STYLE), shirt: pick(SHIRT), pants: pick(PANTS) };
  if (look.hairStyle === 'cap') look.cap = pick(CAP);
  if (r() < 0.25) look.glasses = true;
  if (r() < 0.15) look.sunglasses = '#1e1e24';
  if (r() < 0.15) look.coat = pick(['#5a4a3a', '#2a2a30', '#8a6a4a']);
  if (r() < 0.12) look.hivis = true;
  if (r() < 0.12) look.beard = look.hair;
  if (r() < 0.1) look.hood = look.shirt;
  if (r() < 0.1) look.holding = pick(['book', 'vape']);
  return { id: `crowd${i}`, look };
});

// What they say when you talk to them. One line, picked at random.
export const CROWD_LINES = {
  street: [
    'Sorry, can\'t stop, my parking runs out in four minutes.',
    'Have you seen a little brown dog? Never mind, he\'s behind you.',
    'Lovely day for it. For what, I\'m not sure.',
    'I\'m just popping to the shops. Again.',
    'They\'re digging up the road again. Third time this year.',
    'Does the servo still do the $1 coffee? No? Fair enough.',
    'My rent went up $90 a week. For a balcony I can\'t stand on.',
    'Hi! Sorry, I thought you were someone else.',
    'I\'m on a walking meeting. With myself.',
    'Is it going to rain? My knee says yes, the app says no.',
    'Can\'t talk, I\'m listening to a podcast about podcasts.',
    'Cute pets! Mine is just a sourdough starter.',
  ],
  station: [
    'Next train in four minutes. It has said four minutes for ten minutes.',
    'Replacement buses again this weekend. Bring a book.',
    'I tapped on twice. Do I get two trips? No? Typical.',
    'Waiting for my partner. They are always on the next one.',
    'The display says "Express". It has never once been express.',
    'If the Myki Inspector asks, I definitely touched on.',
  ],
  shop: [
    'Just looking, thanks.',
    'I came in for milk. I have a basket full of everything except milk.',
    'Do you know if they price match? I\'m too shy to ask.',
    'This was half the price last week. I swear.',
    'Has anyone seen the self-serve that works?',
    'I\'m buying a present for my mum. I have no idea what she likes.',
  ],
};
