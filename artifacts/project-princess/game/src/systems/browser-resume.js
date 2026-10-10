const KEY = 'project-princess-resume-slot';
export function resumeSlot(storage) {
  try {
    storage ||= window.sessionStorage;
    const slot = Number(storage.getItem(KEY));
    return Number.isInteger(slot) && slot >= 1 && slot <= 3 ? slot : 0;
  } catch { return 0; }
}
export function rememberResume(slot, storage) {
  if (!Number.isInteger(slot) || slot < 1 || slot > 3) return false;
  try { storage ||= window.sessionStorage; storage.setItem(KEY, String(slot)); return true; } catch { return false; }
}
export function clearResume(storage) {
  try { storage ||= window.sessionStorage; storage.removeItem(KEY); } catch { /* Optional tab-resume storage may be blocked. */ }
}
