// Practical training: watching and cueing a moving pet, not answering a quiz.
import { h } from './dom.js';
import { petIcon } from './images.js';
import { sfx } from '../systems/sfx.js';

export function openTraining(panel, close, { id, name, behaviour, day, done }) {
  const energetic = ['zoomies', 'patrol'].includes(behaviour);
  const cat = ['stalk', 'aloof', 'phase'].includes(behaviour);
  const drills = cat ? ['Recall', 'Settle', 'Pounce course'] : ['Recall', 'Settle', 'Obstacle course'];
  let drill = (day + [...id].reduce((n, c) => n + c.charCodeAt(0), 0)) % 3;
  let round = 0, score = 0, running = false, finished = false, raf = 0;
  let start = 0, attentionAt = 0, settleAt = 0, answered = false, feedbackUntil = 0, last = 0;
  const status = h('p', { role: 'status', 'aria-live': 'polite' });
  const pet = h('img', { src: petIcon(id, 64), alt: name, class: 'pix', style: 'position:absolute;width:64px;height:64px;object-fit:contain;bottom:12px;left:20%;image-rendering:pixelated;transition:filter .15s' });
  const marker = h('div', { style: 'position:absolute;left:64%;bottom:12px;width:10px;height:32px;background:#b47b44;border:2px solid #67452d' });
  const trainer = h('span', { style: 'position:absolute;left:8%;bottom:12px' }, 'Handler');
  const board = h('div', { style: 'position:relative;height:150px;background:#a8c989;border:3px solid #67452d;border-radius:8px;overflow:hidden' }, trainer, marker, pet);
  const tally = h('p');
  const instructions = h('p');
  const action = h('button', { class: 'wood-btn', onclick: () => act() }, 'Start');
  const chooser = h('div', { class: 'center' }, ...drills.map((label, index) => h('button', { class: 'wood-btn small', onclick: () => { if (!running) { drill = index; explain(); } } }, label)));
  function explain() {
    instructions.textContent = drill === 0 ? `Wait until ${name} looks towards the handler, then call once. A distracted pet needs a moment to check in.` : drill === 1 ? `Let ${name} move about, then settle. Reward after one full second of stillness. Rewarding movement starts another attempt.` : `Press Jump as ${name} reaches the hurdle. Watch their approach, rather than tapping repeatedly.`;
    marker.hidden = drill !== 2; trainer.hidden = drill !== 0;
    status.textContent = `${drills[drill]}: ${energetic ? 'quick and easily distracted' : cat ? 'independent and curious' : 'steady and patient'}. Three attempts.`;
  }
  function next(now) {
    round++; start = now; answered = false; feedbackUntil = 0;
    attentionAt = 1000 + Math.random() * 1400;
    settleAt = 1300 + Math.random() * 1300;
    action.textContent = drill === 0 ? 'Call' : drill === 1 ? 'Reward' : 'Jump';
    tally.textContent = `Attempt ${round}/3. Successful behaviours: ${score}.`;
  }
  function resolveAttempt(success, now) {
    if (answered) return;
    answered = true; if (success) { score++; sfx.select(); } else sfx.sad();
    status.textContent = success ? drill === 0 ? `${name} comes back. Reward that check-in!` : drill === 1 ? `${name} stays settled. Calmly rewarded.` : `${name} clears the hurdle!` : drill === 0 ? 'Still distracted. Give them space before calling.' : drill === 1 ? 'A little too early. Wait for a full second of calm.' : 'Missed the hurdle. Try a later or earlier cue next time.';
    feedbackUntil = now + 1000;
    action.disabled = true;
  }
  function act() {
    if (finished) return close();
    const now = performance.now();
    if (!running) { running = true; chooser.hidden = true; next(now); raf = requestAnimationFrame(tick); return; }
    if (answered) return;
    const elapsed = now - start;
    const pace = energetic ? 2300 : 3000;
    const success = drill === 0 ? elapsed >= attentionAt && elapsed <= attentionAt + (energetic ? 850 : 1200) : drill === 1 ? elapsed >= settleAt + 1000 && elapsed <= settleAt + 2100 : Math.abs((elapsed / pace) - 0.62) <= (energetic ? 0.13 : 0.16);
    resolveAttempt(success, now);
  }
  function tick(now) {
    // Returning from a hidden tab must not consume all the remaining attempts.
    if (last && now - last > 250) { start += now - last; if (feedbackUntil) feedbackUntil += now - last; }
    last = now;
    const elapsed = now - start;
    if (answered) {
      if (drill === 0 && score && status.textContent.includes('comes back')) pet.style.left = '12%';
      if (now >= feedbackUntil) {
        if (round === 3) {
          finished = true; running = false; action.disabled = false; action.textContent = 'Finish';
          tally.textContent = `${score}/3 successful behaviours. Training complete.`;
          return;
        }
        next(now); action.disabled = false;
      }
    } else if (drill === 0) {
      const attentive = elapsed >= attentionAt && elapsed <= attentionAt + (energetic ? 850 : 1200);
      pet.style.left = `${55 + Math.sin(elapsed / 330) * 8}%`;
      pet.style.transform = attentive ? 'scaleX(-1)' : '';
      status.textContent = attentive ? `${name} is looking at you. Call now!` : `${name} is sniffing. Wait for a check-in.`;
      if (elapsed > attentionAt + 1500) resolveAttempt(false, now);
    } else if (drill === 1) {
      const still = elapsed >= settleAt;
      pet.style.left = still ? '48%' : `${48 + Math.sin(elapsed / 220) * 18}%`;
      pet.style.transform = still ? 'scaleY(.8)' : '';
      status.textContent = still ? elapsed >= settleAt + 1000 ? 'One second of calm. Reward now.' : 'Settling. Wait a full second...' : `${name} is still moving. Let them settle.`;
      if (elapsed > settleAt + 2300) resolveAttempt(false, now);
    } else {
      const progress = elapsed / (energetic ? 2300 : 3000);
      pet.style.left = `${8 + Math.min(1, progress) * 90}%`;
      pet.style.transform = '';
      status.textContent = 'Cue the jump near the hurdle.';
      if (progress > .83) resolveAttempt(false, now);
    }
    if (answered && drill === 2) pet.style.transform = status.textContent.includes('clears') ? 'translateY(-35px)' : '';
    raf = requestAnimationFrame(tick);
  }
  panel.replaceChildren(h('div', { class: 'm-head' }, h('h2', {}, `${name}: pet school`), h('button', { class: 'wood-btn small', onclick: close }, 'Stop')), chooser, instructions, board, status, tally, h('div', { class: 'center' }, action));
  explain();
  let cleaned = false;
  return { action: act, cleanup() { if (cleaned) return; cleaned = true; cancelAnimationFrame(raf); done(finished ? { score, drill: drills[drill] } : null); } };
}
