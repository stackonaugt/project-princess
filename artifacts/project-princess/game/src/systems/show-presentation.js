import { state } from './state.js';
import { ui } from '../ui/ui.js';
import { form } from './forms.js';
import { groomDog } from '../ui/grooming.js';
import { startHallEvent } from './hall-events.js';
import { awardSkill } from './player-skills.js';
import { sfx } from './sfx.js';
import { SHOW_JUDGES } from '../data/dog-show.js';
import { raiseScorecard } from './judge-votes.js';
import { recordScorecard } from './scorecards.js';

export async function showPresentation(world, opts = {}) {
  const pet = state.data.side.show.pet || await world.chooseCoursePet(true);
  if (!pet) return;
  const awards = state.data.flags.showAwards ||= { grooming: [], breed: [] };
  const category = await ui.say({ text: `${form(pet).name} · ${form(pet).species}. The presentation ring celebrates every breed.`,
    choices: [{ label: 'Grooming award', value: 'grooming' }, { label: 'Breed presentation award', value: 'breed' },
      { label: 'Recorded awards', value: 'awards' }, { label: 'Later', value: null }] }, { ...opts, cancelValue: null });
  if (!category) return;
  if (category === 'awards') return ui.say([
    `Grooming: ${awards.grooming.length ? awards.grooming.map(id => form(id).name).join(', ') : 'No awards yet.'}`,
    `Breed presentation: ${awards.breed.length ? awards.breed.map(id => `${form(id).name} (${form(id).species})`).join(', ') : 'No awards yet.'}`,
  ], opts);
  const groom = await groomDog(pet); if (!groom) return;
  let handling = null;
  if (category === 'breed') {
    await ui.say('Lead your dog into the ring, demonstrate a sit and hold a calm stay. The judges look at movement, condition and breed character.', opts);
    handling = await startHallEvent(world, { pet, mode: 'presentation', tier: 'novice' });
    if (handling.cancelled) return;
  }
  const marks = category === 'grooming' ?
    [Math.round(groom.quality / 10), Math.round(groom.quality / 10), Math.min(10, Math.round(groom.quality / 12) + 1)] :
    [handling.marks[0], Math.round(groom.quality / 10), handling.marks[1]];
  const labels = category === 'grooming' ? ['Coat finish', 'Gentle care', 'Presentation'] : ['Movement', 'Condition', `${form(pet).species} character`];
  const passed = marks.reduce((a, b) => a + b, 0) >= 24;
  const first = passed && !awards[category].includes(pet);
  if (first) {
    awards[category].push(pet); state.addItem(category === 'grooming' ? 'groomrosette' : 'breedrosette');
    state.addMoney(20); awardSkill('handling', 25); sfx.found();
  }
  recordScorecard(state.data, {
    kind: 'exhibition', entryId: pet, entryName: form(pet).name,
    event: category === 'grooming' ? 'Grooming' : 'Breed presentation',
    division: 'Presentation ring',
    criteria: labels.map((label, i) => ({ label, judge: SHOW_JUDGES[i].name, score: marks[i] })),
    outcome: passed ? (first ? 'Award won' : 'Award already recorded') : 'Completed · no award',
  });
  // Failed and repeat presentations need saving too, without repeating prizes.
  world.save();
  for (let i = 0; i < 3; i++) {
    const lowerCard = await raiseScorecard(world, SHOW_JUDGES[i].id, marks[i]);
    try { await ui.say(`${SHOW_JUDGES[i].name} · ${labels[i]}: ${marks[i]}/10.`, { ...opts, name: SHOW_JUDGES[i].name }); }
    finally { lowerCard(); }
  }
  await ui.say(passed ? first ?
    `${form(pet).name} wins the ${category === 'grooming' ? 'grooming' : form(pet).species.toLowerCase() + ' presentation'} award! A rosette and $20. The crowd applauds.` :
    'Another lovely presentation. Your award is already recorded; repeat attempts do not give duplicate prizes.' :
    'A good beginning. The judges suggest slower brushing and closer, calmer handling. You can try again freely.', opts);
}
