import { state } from './state.js';
import { form } from './forms.js';
import { SHOW_JUDGES } from '../data/dog-show.js';
import { hallCriteria, recordScorecard } from './scorecards.js';

export function recordHallScorecard(result, pet, division, practice = false) {
  if (result.cancelled || !result.complete) return;
  recordScorecard(state.data, {
    kind: 'exhibition', entryId: pet, entryName: form(pet).name,
    event: result.mode === 'course' ? 'Agility' : 'Obedience', division,
    criteria: hallCriteria(result.mode).map((label, i) => ({
      label, judge: SHOW_JUDGES[i].name, score: result.marks[i],
    })),
    outcome: result.passed ? (practice ? 'Qualifying practice' : 'Qualified') :
      (practice ? 'Practice completed · not qualifying' : 'Completed · not qualifying'),
  });
}
