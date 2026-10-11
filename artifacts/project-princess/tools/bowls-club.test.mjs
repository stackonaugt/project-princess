// Bowls distance fix, the club membership and championship prizes, the trophy
// cabinet data and the event pop-up registry.
import test from 'node:test';
import assert from 'node:assert/strict';

const root = new URL('../game/src/', import.meta.url);
const { gapCm, centreDistance, rivalBowls, rivalMark, BOWL_R, JACK_R } = await import(new URL('systems/bowls.js', root));
const club = await import(new URL('data/bowls-club.js', root));
const { ITEMS } = await import(new URL('data/items.js', root));
const { CROPS, CROP_ORDER } = await import(new URL('data/crops.js', root));
const { UPGRADES, UPGRADE_ORDER } = await import(new URL('data/upgrades.js', root));
const { GEAR } = await import(new URL('data/gear.js', root));
const trophies = await import(new URL('data/trophies.js', root));
const events = await import(new URL('data/events.js', root));
const { NPCS } = await import(new URL('data/npcs.js', root));
const { getMap } = await import(new URL('data/regions.js', root));
const { weekday } = await import(new URL('data/routines.js', root));

const jack = { x: 100, y: 100 };
const dayOf = name => [1, 2, 3, 4, 5, 6, 7].find(d => weekday(d) === name);

test('a bowl resting against the jack is a toucher, not 64 cm', () => {
  assert.equal(gapCm(jack.x + BOWL_R + JACK_R, jack.y, jack), 0);
  assert.equal(gapCm(jack.x + 2, jack.y, jack), 0, 'overlapping the jack still reads 0');
  // One bowl's width (10 px) off the jack used to read 100+ cm. Now it is about 12 cm.
  assert.equal(gapCm(jack.x + BOWL_R + JACK_R + 10, jack.y, jack), 13);
  assert.ok(gapCm(jack.x + 60, jack.y, jack) < 100);
  // centreDistance is the inverse of gapCm
  for (const cm of [0, 5, 20, 47]) assert.equal(gapCm(jack.x + centreDistance(cm), jack.y, jack), cm);
  // feeding the ducks keeps its scale (centre to centre, 8 cm a pixel)
  assert.equal(gapCm(jack.x + 5, jack.y, jack, 'ducks'), 40);
});

test('the rival bowls are drawn on the green at the mark you have to beat', () => {
  const bounds = { x0: 14, y0: 14, x1: 206, y1: 354 };
  for (let i = 0; i < 200; i++) {
    const j = { x: 110 + (Math.random() - 0.5) * 90, y: 60 + Math.random() * 70 }, mark = rivalMark(i % 5);
    const bowls = rivalBowls(j, mark, bounds);
    assert.equal(bowls.length, 3);
    assert.equal(gapCm(bowls[0].x, bowls[0].y, j), mark, 'the closest one sits exactly at the mark');
    assert.ok(bowls.slice(1).every(b => gapCm(b.x, b.y, j) > mark), 'the others are further out');
    for (const b of bowls) assert.ok(b.x > bounds.x0 && b.x < bounds.x1 && b.y > bounds.y0 && b.y < bounds.y1, 'on the green');
  }
  assert.ok(rivalMark(0, () => 0) > rivalMark(4, () => 0) || rivalMark(0, () => 1) > rivalMark(4, () => 1), 'the old blokes tighten up');
});

test('membership: beat Crazy Jeff, then pay the treasurer', () => {
  assert.ok(NPCS.treasurer, 'Maureen exists');
  assert.ok(getMap('bowls').npcs.some(n => n.id === 'treasurer'), 'she stands at the bowls club');
  const d = { beaten: {}, side: { bowlsWins: 0 } };
  assert.equal(club.canJoin(d), false);
  assert.equal(club.canJoin({ ...d, beaten: { crazyjeff: 4 } }), true, 'a play-fight win');
  assert.equal(club.canJoin({ ...d, side: { bowlsWins: 1 } }), true, 'or an end on the green');
  assert.equal(club.MEMBERSHIP_FEE, 40);
});

test('the championship: Wednesdays 10 to 4, harder rivals, unique prizes', () => {
  const wed = dayOf('Wednesday');
  assert.equal(club.compOpen(wed, 11 * 60), true);
  assert.equal(club.compOpen(wed, 17 * 60), false);
  assert.equal(club.compOpen(wed + 1, 11 * 60), false);
  // each round is harder than a friendly end against the blokes at their toughest
  const worst = club.CLUB_COMP.rounds.map((r, i) => club.compMark(i, () => 1));
  assert.ok(worst.every(m => m <= rivalMark(0, () => 0) + 20));
  assert.ok(worst[2] < worst[0], 'the final is the hardest');
  // prizes: $100, giant tomato seeds, the cup the first time only
  const d = { day: wed, money: 5, inventory: {}, seeds: {}, side: {} };
  const first = club.awardComp(d);
  assert.deepEqual([first.money, first.trophy], [100, 'bowlscup']);
  assert.equal(d.money, 105); assert.equal(d.seeds.gianttomato, 3); assert.equal(d.inventory.bowlscup, 1);
  const again = club.awardComp(d);
  assert.equal(again.trophy, null); assert.equal(d.inventory.bowlscup, 1); assert.equal(d.seeds.gianttomato, 6);
  // giant tomatoes: a real crop, but no shop sells the seeds
  assert.ok(CROPS.gianttomato && ITEMS.gianttomato?.crop);
  assert.ok(!CROP_ORDER.includes('gianttomato'));
});

test('the dog show champion gets something nobody else has', () => {
  assert.ok(ITEMS.bestinshow?.trophy);
  assert.ok(GEAR.championsash?.gift, 'the sash is a prize, never in the pet shop');
});

test('trophy cabinet: an upgrade, six trophies, each says what it is for', () => {
  assert.ok(UPGRADE_ORDER.includes('trophyshelf') && UPGRADES.trophyshelf.price > 0);
  const ids = trophies.trophyIds();
  for (const id of ['newcomerscup', 'bowlscup', 'blueribbon', 'bestinshow', 'fishtrophy']) assert.ok(ids.includes(id), id);
  assert.equal(trophies.shelfVariant({ inventory: { fishtrophy: 1 }, side: {} }), 'fish');
  for (const id of ids) assert.ok(ITEMS[id].story, `${id} is never a treat or a present`);
  assert.ok(trophies.trophyLines('bowlscup')[1].includes('championship'));
  // an old save with only side.trophy still has the Newcomer's Cup
  assert.deepEqual(trophies.ownedTrophies({ inventory: {}, side: { trophy: true } }), ['newcomerscup']);
  const inventory = Object.fromEntries(ids.map(id => [id, 1]));
  const d = { inventory, side: {}, shelf: [] };
  const shown = trophies.shelfTrophies(d);
  assert.ok(shown.length <= trophies.SHELF_SIZE);
  assert.equal(trophies.shelfVariant(d).split('.').length, shown.length);
  assert.equal(trophies.shelfVariant({ inventory: {}, side: {} }), 'empty');
});

test('trophy cabinet: swapping one on show for one in the cupboard', () => {
  const extra = ['t1', 't2', 't3'];
  for (const id of extra) ITEMS[id] = { name: id, story: true, trophy: true, trophyArt: 'fish', trophyText: id };
  try {
    const ids = trophies.trophyIds();
    const d = { inventory: Object.fromEntries(ids.map(id => [id, 1])), side: {}, shelf: ['bestinshow'] };
    const shown = trophies.shelfTrophies(d);
    assert.equal(shown.length, trophies.SHELF_SIZE, 'the cabinet holds six');
    assert.equal(shown[0], 'bestinshow', 'your pick goes first');
    const spare = ids.find(id => !shown.includes(id));
    assert.ok(trophies.swapTrophy(d, 'blueribbon', spare));
    assert.ok(trophies.shelfTrophies(d).includes(spare) && !trophies.shelfTrophies(d).includes('blueribbon'));
    assert.equal(trophies.swapTrophy(d, 'blueribbon', spare), false, 'cannot take down what is not up');
  } finally { for (const id of extra) delete ITEMS[id]; }
});

test('event registry: known, on, once a day, not where you are', () => {
  const ids = events.EVENTS.map(e => e.id);
  for (const id of ['council', 'bakeoff', 'dogshow', 'bowlscomp', 'fishcomp']) assert.ok(ids.includes(id), id);
  const sat = dayOf('Saturday'), tue = dayOf('Tuesday'), wed = dayOf('Wednesday');
  const base = () => ({ day: sat, minutes: 10 * 60, flags: {}, side: { bake: 0, show: { claimed: [] } }, council: { known: [], given: {}, passed: [] }, story: { chapter: 1 } });
  let d = base();
  assert.equal(events.dueEvents(d, 'allen').length, 0, 'not before Betty tells you');
  d.side.bake = 1;
  assert.deepEqual(events.dueEvents(d, 'allen').map(e => e.id), ['bakeoff']);
  assert.equal(events.dueEvents(d, 'bakeoff').length, 0, 'not when you are already there');
  events.markPrompted(d, 'bakeoff');
  assert.equal(events.dueEvents(d, 'allen').length, 0, 'once a day');
  d = base(); d.day = tue; d.minutes = 19 * 60;
  assert.equal(events.dueEvents(d, 'allen').length, 0, 'council: not before you know about it');
  d.story.chapter = 2;
  assert.deepEqual(events.dueEvents(d, 'allen').map(e => e.id), ['council']);
  d = base(); d.day = wed; d.minutes = 11 * 60; d.side.bowlsMember = true;
  assert.deepEqual(events.dueEvents(d, 'allen').map(e => e.id), ['bowlscomp']);
  d.side.bowlsCompWeek = club.compWeek(wed);
  assert.equal(events.dueEvents(d, 'allen').length, 0, 'already played this week');
  const sun = dayOf('Sunday');
  d = base(); d.day = sun; d.minutes = 8 * 60;
  assert.ok(!events.dueEvents(d, 'allen').some(e => e.id === 'fishcomp'), 'fishing comp: not before you join');
  d.fishing = { member: true, compWeek: -1 };
  assert.ok(events.dueEvents(d, 'allen').some(e => e.id === 'fishcomp'));
  assert.ok(!events.dueEvents(d, 'coburglake').some(e => e.id === 'fishcomp'));
  // others can add their own
  events.registerEvent({ id: 'testcomp', name: 'Test', zone: 'lake', entry: 'west', where: 'the lake', known: () => true, active: () => true });
  assert.ok(events.dueEvents(base(), 'allen').some(e => e.id === 'testcomp'));
  events.EVENTS.splice(events.EVENTS.findIndex(e => e.id === 'testcomp'), 1);
});
