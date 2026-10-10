// Saved snapshots, independent of current pet names, recipes or progression.
export const SCORECARD_LIMIT = 30;
export const BAKE_CRITERIA = ['Taste', 'Texture', 'Presentation'];
export const hallCriteria = mode => mode === 'course' ?
  ['Obstacle accuracy', 'Handler teamwork', 'Calm finish'] :
  ['Command accuracy', 'Handler teamwork', 'Composure'];

const text = value => typeof value === 'string' ? value.slice(0, 120) : '';
function normaliseCard(raw) {
  if (!raw || !['bakeoff', 'exhibition'].includes(raw.kind) ||
      !Number.isInteger(raw.day) || raw.day < 1 ||
      !Array.isArray(raw.criteria) || raw.criteria.length !== 3 ||
      !text(raw.entryName) || !text(raw.event) || !text(raw.division)) return null;
  const criteria = raw.criteria.map(c => c && ({
    label: text(c.label), judge: text(c.judge), score: c.score,
  }));
  if (criteria.some(c => !c || !c.label || !Number.isFinite(c.score) || c.score < 0 || c.score > 10)) return null;
  return {
    kind: raw.kind, day: raw.day, entryId: text(raw.entryId), entryName: text(raw.entryName),
    event: text(raw.event), division: text(raw.division), criteria,
    total: criteria.reduce((sum, c) => sum + c.score, 0), outcome: text(raw.outcome),
  };
}

export function normaliseScorecards(raw) {
  return Array.isArray(raw) ? raw.slice(-SCORECARD_LIMIT).map(normaliseCard).filter(Boolean) : [];
}

// Only completed judging paths call this; browsing never calls it.
export function recordScorecard(data, card) {
  const saved = normaliseCard({ ...card, day: data.day });
  if (!saved) throw new Error('Cannot record an incomplete judging card');
  data.scorecards = [...normaliseScorecards(data.scorecards), saved].slice(-SCORECARD_LIMIT);
}
