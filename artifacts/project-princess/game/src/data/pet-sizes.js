// Display height in world pixels, independent of PNG resolution.
// A tile is 16 pixels; Helen is 32 pixels tall. Edit these values freely.
// Battle pets use the same proportions, enlarged to suit the screen.
export const PET_SIZES = {
  marty: 18, princess: 17, salami: 15, spooky: 14, poppy: 18, rusty: 18,
  stanley: 18, girlie: 20, chloe: 20, ziggy: 14, emilio: 14, toby: 13,
};
// Evolved forms that change size. BIG MART is Marty, just very tall.
export const EVOLVED_SIZES = { spooky: 20, princess: 18, marty: 30 };
export function petSize(id, evolved = false) {
  const size = evolved && EVOLVED_SIZES[id] ? EVOLVED_SIZES[id] : PET_SIZES[id];
  return Number.isFinite(size) ? Math.max(6, Math.min(32, size)) : 16;
}
