// Time of day helpers. Minutes run from 6:00am (360) to 2:00am (1560).
import { lerp, clamp } from '../util.js';

export function timeLabel(min) {
  const h24 = Math.floor(min / 60) % 24, m = Math.floor((min % 60) / 10) * 10;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')}${h24 < 12 ? 'am' : 'pm'}`;
}

// 0 = full daylight, 1 = deepest night.
export function darkness(min) {
  if (min < 7 * 60) return lerp(0.5, 0, clamp((min - 6 * 60) / 60, 0, 1));
  if (min < 18 * 60) return 0;
  if (min < 21 * 60) return (min - 18 * 60) / 180;
  return 1;
}

export const isNight = min => min >= 20 * 60 || min < 6 * 60;

export function partOfDay(min) {
  if (min < 12 * 60) return 'morning';
  if (min < 17 * 60) return 'afternoon';
  if (min < 20 * 60) return 'evening';
  return 'night';
}

export function inWindow(min, win) {
  if (!win) return false;
  const [a, b] = win;
  return min >= a && min < b;
}
