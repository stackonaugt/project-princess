// Eligibility is distinct from discovery: an available quest is not yet known.
export function trainingStarted(data) {
  const school = data.side?.school || {};
  return !!(data.flags?.trainingStarted || data.side?.show?.entered ||
    Object.keys(school.lessonDay || {}).length ||
    Object.values(school.skills || {}).some(skills => Object.values(skills || {}).some(n => n > 0)));
}

export function binManReady(data) {
  return (data.story?.chapter || 0) >= 2 ||
    Object.values(data.pets || {}).filter(pet => pet?.found).length >= 3;
}

export function knowsMotion(data, id) {
  return !!(data.flags?.knownMotions?.includes(id) || data.council?.passed?.includes(id) ||
    data.council?.known?.some(key => key.startsWith(`${id}:`)) ||
    Object.values(data.council?.given?.[id] || {}).some(n => n > 0));
}

// A gated exit (the Premier's police line) only stays open on the day you beat
// its keeper: sleep, and it is shut again in the morning (Seb, 2026-10-18).
export function gateOpen(data, id) {
  return data.beaten?.[id] === data.day;
}
