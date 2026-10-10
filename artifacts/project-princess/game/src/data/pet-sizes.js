// Display height in world pixels, independent of PNG resolution.
// A tile is 16 pixels; Helen is 32 pixels tall. Edit these values freely.
// Battle pets use the same proportions, enlarged to suit the screen.
export const PET_SIZES = {
  marty: 18, princess: 16, salami: 10, spooky: 16, poppy: 18, rusty: 18,
  stanley: 18, girlie: 20, chloe: 20, ziggy: 16, emilio: 16,
};
export function petSize(id, evolved = false) {
  const size = evolved && id === 'spooky' ? 20 : evolved && id === 'princess' ? 18 : PET_SIZES[id];
  return Number.isFinite(size) ? Math.max(6, Math.min(32, size)) : 16;
}
