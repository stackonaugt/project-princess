// "More below" cue for anything that scrolls: long gift and shop lists,
// the Pawphone, battle menus, the pet school and activity panels. A pink
// chip with a bobbing arrow sits on the bottom edge of the list while there
// is more to see, and goes once you reach the end. Tapping it scrolls down.
const SCROLLERS = '.d-choices, .m-scroll, .bt-menu.list, .phone-screen, .activity-overlay, .bt-panel, .bag-detail, .yard-course-bar, #title';
const hints = new Map();   // scroller -> chip
let queued = false;

function chipFor(el) {
  let chip = hints.get(el);
  if (!chip) {
    chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'scroll-hint';
    chip.setAttribute('aria-label', 'Scroll down for more');
    chip.innerHTML = '<span class="scroll-hint-arrow">▼</span> More below';
    chip.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); });
    chip.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      el.scrollBy({ top: Math.max(60, el.clientHeight * 0.7), behavior: 'smooth' });
    });
    document.body.appendChild(chip);
    hints.set(el, chip);
  }
  return chip;
}

function update() {
  queued = false;
  for (const [el, chip] of hints) if (!el.isConnected) { chip.remove(); hints.delete(el); }
  for (const el of document.querySelectorAll(SCROLLERS)) {
    const r = el.getBoundingClientRect();
    const visible = r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden' && !el.closest('.hidden, [hidden]');
    const more = visible && el.scrollHeight - el.clientHeight - el.scrollTop > 8;
    el.classList.toggle('has-more', more);
    if (!more) { hints.get(el)?.classList.remove('on'); continue; }
    const chip = chipFor(el);
    // Fixed to the list's bottom edge, kept on screen.
    chip.style.left = `${r.left + r.width / 2}px`;
    chip.style.top = `${Math.min(r.bottom, window.innerHeight - 8)}px`;
    chip.style.zIndex = String(zFor(el));
    chip.classList.add('on');
  }
}
function zFor(el) {
  let z = 0;
  for (let n = el; n && n !== document.body; n = n.parentElement) {
    const v = parseInt(getComputedStyle(n).zIndex, 10);
    if (Number.isFinite(v)) z = Math.max(z, v);
  }
  return z + 1;
}
const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };

export function startScrollHints() {
  document.addEventListener('scroll', schedule, true);
  window.addEventListener('resize', schedule);
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'hidden'] });
  schedule();
}
