// A tiny event bus shared by the Phaser scenes and the HTML interface.
const listeners = new Map();

export const bus = {
  on(name, fn) {
    if (!listeners.has(name)) listeners.set(name, new Set());
    listeners.get(name).add(fn);
    return () => listeners.get(name).delete(fn);
  },
  emit(name, ...args) {
    const set = listeners.get(name);
    if (set) [...set].forEach(fn => fn(...args));
  },
};
