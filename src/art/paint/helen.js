// Helen's reference-led sprite, 16x32. Photos: brown hair, clear glasses.
// Keep the established plaid pinafore. Rows are edited pixels, not scaled art.
const PAL = {
  h: '#76503c', H: '#a57952', d: '#49362f', s: '#ecc0a4', S: '#f7d4b7',
  r: '#cf927f', g: '#e5ddd0', e: '#455360', w: '#f4eee0', W: '#c8c5bc',
  p: '#b94854', P: '#df6a62', b: '#526581', y: '#d6ac65', q: '#793e4d',
  l: '#b88972', k: '#4a3734', K: '#82624b',
};
const FRONT = [
  '................', '.......hhh......', '......hHHhh.....', '.....hhHhdh.....',
  '....hhHHhhhd....', '...hhHHhhhhhd...', '...hHHhSSSshd...', '...hSSSSSSsshd..',
  '...hgggsgggsh...', '...ggegggeggg...', '....gggsgggs....', '....sSrssrss....',
  '.....ssrrss.....', '......ssss......', '....wwssssww....', '...wwpwwwwpww...',
  '...wWpPPPPpWw...', '...sWpPbbPpWs...', '...sWpPyyPpWs...', '...sspPPPPpss...',
  '....qpPbbPpq....', '....pPPbbPPp....', '....pyyyyyyp....', '...qpPPbbPPpq...',
  '...pPPPPPPPPp...', '...qqqqqqqqqq...', '.....ss..ss.....', '.....sl..sl.....',
  '.....sl..sl.....', '....KKk..KKk....', '....kkk..kkk....', '................',
];
const BACK = [
  '................', '.......hhh......', '......hHHhh.....', '.....hhHhdh.....',
  '....hhHHhhhd....', '...hhHHhhhhhd...', '...hHHhhhhhhhd..', '...hHhhhhhhddd..',
  '...hHhhhhhddhd..', '...hhhhhhhddhd..', '....hhhhhddhd...', '....hhhhddhd....',
  '.....hhdddh.....', '......ssss......', '....wwssssww....', '...wwpwwwwpww...',
  '...wWpwwwwpWw...', '...sWppwwppWs...', '...sWpPyyPpWs...', '...sspPPPPpss...',
  '....qpPbbPpq....', '....pPPbbPPp....', '....pyyyyyyp....', '...qpPPbbPPpq...',
  '...pPPPPPPPPp...', '...qqqqqqqqqq...', '.....ss..ss.....', '.....sl..sl.....',
  '.....sl..sl.....', '.....kk..kk.....', '....kkk..kkk....', '................',
];
const SIDE = [
  '................', '........hhh.....', '.......hHHhh....', '......hhHhdh....',
  '.....hhHHhhhd...', '....hhHHhhhhhd..', '....hSSSshhhhd..', '....SSSSshhhhd..',
  '...gggegshhhhd..', '...gSSegggghhd..', '...ssggshhhhd...', '....srsshhhhd...',
  '.....ssshhhd....', '......ssshh.....', '.....wwssww.....', '....wpwwwwwW....',
  '....pPwwwwwW....', '....pPbwssWW....', '....pyywssW.....', '....pPPwssW.....',
  '....pPbbssq.....', '....pPbbPPp.....', '....pyyyyyq.....', '....pPbbPPpq....',
  '....pPPPPPpq....', '....qqqqqqqq....', '......ss.ss.....', '......sl.sl.....',
  '......sl.sl.....', '.....KKkKKk.....', '.....kkkkkk.....', '................',
];

export function drawHelen(p, dir, step = 0) {
  const rows = dir === 'up' ? BACK : dir === 'left' ? SIDE : FRONT;
  // Keep feet on the same baseline; alternate planted and lifted legs.
  p.sprite(rows.slice(0, 26), PAL, 0, step ? -1 : 0);
  if (!step) p.sprite(rows.slice(26), PAL, 0, 26);
  else {
    const left = step === 1 ? 1 : -1, side = dir === 'left';
    p.r(PAL.s, side ? 6 - left : 5, 26, 2, left > 0 ? 3 : 2);
    p.r(PAL.l, side ? 9 + left : 9, 26, 2, left > 0 ? 2 : 3);
    p.r(PAL.k, side ? 5 - left : 4, left > 0 ? 29 : 28, 3, 2);
    p.r(PAL.k, side ? 8 + left : 9, left > 0 ? 28 : 29, 3, 2);
    p.r(PAL.K, side ? 5 - left : 4, left > 0 ? 29 : 28, 2, 1);
  }
}
