import { element, field, gameURL } from './utils.js';
import { assetFrameRect, assetLayout, NPC_WALK_FRAME_RATE } from '../src/art/asset-rules.js';
import { drawPersonPreview } from '../src/art/paint/people.js';

const WALK_FRAME_MS = 1000 / NPC_WALK_FRAME_RATE;

function characterPreview(look, testId, caption) {
  const figure = element('figure', { className: 'studio-art-comparison-card' });
  const canvas = element('canvas', { width: 16, height: 32, 'data-testid': testId,
    'aria-label': caption });
  drawPersonPreview(canvas.getContext('2d'), look);
  figure.append(canvas, element('figcaption', { text: caption }));
  return figure;
}

export function artworkPicker(entity, kind, id, context) {
  const box = element('fieldset', { className: 'studio-nested', 'data-testid': 'artwork-picker' },
    [element('legend', { text: 'Supplied artwork' })]);
  box.append(element('p', { className: 'studio-muted',
    text: 'Select files already supplied in assets/sprites/pets, npcs or portraits. An assigned walking PNG replaces the generated character look; clearing it restores the code-drawn fallback. Templates are not supplied artwork. Preview before applying; assignments take effect after saving and reloading the game. No files or player saves are changed.' }));
  const controls = element('div');
  const cycleStops = new Set();
  const render = () => {
    for (const stop of cycleStops) stop();
    cycleStops.clear();
    controls.replaceChildren();
    const catalog = context.catalog.suppliedArt;
    const slots = [
      ['sprite', kind, 'Walking sprite'],
      ['portrait', 'portraits', 'Portrait'],
      ...(kind === 'pets' && entity.record.evolution ? [
        ['evolvedSprite', 'pets', 'Evolved walking sprite'],
        ['evolvedPortrait', 'portraits', 'Evolved portrait'],
      ] : []),
    ];
    for (const [slot, folder, title] of slots) {
      const saved = entity.art?.[slot] || '';
      const select = element('select', { 'data-testid': `art-${slot}` });
      select.append(element('option', { value: '', text: 'Automatic file by stable ID / built-in template' }));
      const files = catalog.assets.filter(asset => asset.folder === folder);
      for (const asset of files) {
        select.append(element('option', { value: asset.path, disabled: !asset.valid,
          text: asset.valid ? `${asset.path} — ${asset.width}×${asset.height}${folder === 'portraits' ? '' : `, ${asset.frames} frame(s)`}` :
            `${asset.path} — rejected: ${asset.error}` }));
      }
      if (saved && !files.some(asset => asset.path === saved)) {
        select.append(element('option', { value: saved, disabled: true, text: `${saved} — missing file (choose another or reset)` }));
      }
      select.value = saved;
      const status = element('p', { className: 'studio-muted', role: 'status', 'data-testid': `art-status-${slot}` });
      const preview = element('div', { className: 'studio-art-preview', 'data-testid': `art-preview-${slot}` });
      const compareCharacter = kind === 'npcs' && slot === 'sprite';
      const generatedLook = compareCharacter ? entity.record?.look ?? {} : null;
      const apply = element('button', { className: 'studio-button', text: 'Use previewed artwork', type: 'button',
        disabled: true, 'data-testid': `art-apply-${slot}` });
      let requestNumber = 0;
      let ready = false;
      let stopCycle = () => {};
      const show = async () => {
        const token = ++requestNumber;
        stopCycle();
        cycleStops.delete(stopCycle);
        stopCycle = () => {};
        ready = false; apply.disabled = true; preview.replaceChildren();
        if (compareCharacter && generatedLook) {
          preview.append(characterPreview(generatedLook, 'art-generated-sprite', 'Generated look (fallback)'));
        }
        const file = select.value;
        if (!file) {
          status.textContent = compareCharacter ?
            'Generated code-drawn fallback. Apply to clear this assignment.' :
            'Automatic stable-ID artwork, if supplied; otherwise the built-in template. Apply to clear this assignment.';
          ready = true; apply.disabled = saved === '';
          return;
        }
        const asset = files.find(item => item.path === file);
        if (!asset?.valid) {
          status.textContent = asset?.error || 'File is missing. Choose a valid file or reset the assignment.';
          return;
        }
        status.textContent = 'Loading preview…';
        const image = new Image();
        // Avoid stale cached art while the creator is editing their supplied files.
        image.src = new URL(`assets/sprites/${file}?studio=${Date.now()}`, gameURL).href;
        try {
          await image.decode();
          const layout = assetLayout(folder, image.naturalWidth, image.naturalHeight);
          if (layout.width !== asset.width || layout.height !== asset.height) throw new Error('File changed. Refresh supplied files before applying.');
          if (token !== requestNumber || !select.isConnected) return;
          image.alt = `${title}: ${file}`;
          if (folder === 'portraits') {
            image.className = 'studio-art-portrait'; preview.append(image);
          } else if (compareCharacter) {
            const scale = Math.min(4, 256 / Math.max(layout.frameWidth, layout.frameHeight));
            const frame = element('canvas', {
              width: Math.max(1, Math.round(layout.frameWidth * scale)),
              height: Math.max(1, Math.round(layout.frameHeight * scale)),
              'data-testid': 'art-cycle-preview', 'aria-label': `${title}, walking cycle preview`,
            });
            const g = frame.getContext('2d');
            g.imageSmoothingEnabled = false;
            const drawFrame = index => {
              const source = assetFrameRect(layout, index);
              g.clearRect(0, 0, frame.width, frame.height);
              g.drawImage(image, source.x, source.y, source.width, source.height,
                0, 0, frame.width, frame.height);
            };
            drawFrame(0);
            const supplied = element('figure', { className: 'studio-art-comparison-card' });
            supplied.append(frame, element('figcaption', {
              text: layout.frames > 1 ? 'Selected PNG (walking cycle)' : 'Selected PNG',
            }));
            if (layout.frames > 1) {
              const cycleControls = element('div', { className: 'studio-art-cycle-controls',
                'aria-label': 'Walking cycle controls' });
              const play = element('button', { className: 'studio-button', type: 'button',
                text: 'Play', 'data-testid': 'art-cycle-play' });
              const stop = element('button', { className: 'studio-button subtle', type: 'button',
                text: 'Stop', disabled: true, 'data-testid': 'art-cycle-stop' });
              let animationFrame = null;
              let currentFrame = 0;
              let lastFrameTime = null;
              stopCycle = () => {
                if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
                animationFrame = null;
                currentFrame = 0;
                lastFrameTime = null;
                drawFrame(currentFrame);
                play.disabled = false;
                stop.disabled = true;
              };
              cycleStops.add(stopCycle);
              const tick = timestamp => {
                if (token !== requestNumber || !select.isConnected || !image.isConnected) {
                  stopCycle();
                  return;
                }
                if (lastFrameTime === null) lastFrameTime = timestamp;
                const elapsedFrames = Math.floor((timestamp - lastFrameTime) / WALK_FRAME_MS);
                if (elapsedFrames > 0) {
                  currentFrame = (currentFrame + elapsedFrames) % layout.frames;
                  lastFrameTime += elapsedFrames * WALK_FRAME_MS;
                  drawFrame(currentFrame);
                }
                animationFrame = window.requestAnimationFrame(tick);
              };
              play.onclick = () => {
                if (animationFrame !== null) return;
                play.disabled = true;
                stop.disabled = false;
                lastFrameTime = null;
                animationFrame = window.requestAnimationFrame(tick);
              };
              stop.onclick = stopCycle;
              cycleControls.append(play, stop);
              supplied.append(cycleControls);
            }
            image.className = 'studio-art-sheet';
            preview.append(supplied, element('div', { className: 'studio-art-sheet-wrap' }, [
              element('p', { className: 'studio-art-sheet-label', text: 'Full supplied sheet' }), image,
            ]));
          } else {
            const canvas = element('canvas', { width: Math.min(128, layout.frameWidth * 4),
              height: Math.min(128, layout.frameHeight * 4), 'aria-label': `${title}, first frame` });
            const g = canvas.getContext('2d');
            g.imageSmoothingEnabled = false;
            const source = assetFrameRect(layout, 0);
            g.drawImage(image, source.x, source.y, source.width, source.height, 0, 0, canvas.width, canvas.height);
            image.className = 'studio-art-sheet';
            preview.append(canvas, element('span', { text: 'First frame and full sheet' }), image);
          }
          status.textContent = `${layout.width}×${layout.height}${folder === 'portraits' ? '' :
            ` • ${layout.frames} frame(s), ${layout.frameWidth}×${layout.frameHeight} each`}. ${file === saved ? 'Assigned in draft.' : 'Preview only — apply to assign.'}`;
          ready = true; apply.disabled = file === saved;
        } catch (error) {
          if (token !== requestNumber || !select.isConnected) return;
          status.textContent = `Rejected: ${error.message || 'Image could not be decoded.'} Assignment unchanged.`;
          context.message(`Cannot preview ${file}. Refresh supplied files or choose another image.`, true);
        }
      };
      select.onchange = show;
      apply.onclick = () => {
        if (!ready || !select.isConnected) return;
        entity.art ||= {};
        if (select.value) entity.art[slot] = select.value;
        else delete entity.art[slot];
        if (!Object.keys(entity.art).length) delete entity.art;
        context.changed(); render();
      };
      controls.append(field(title, select),
        element('p', { className: 'studio-muted', text: catalog.requirements[folder] }),
        preview, status, apply);
      // Initial preview starts once this picker is attached by the inspector.
      queueMicrotask(show);
    }
  };
  box.append(element('button', { className: 'studio-button subtle', text: 'Refresh supplied files', type: 'button',
    'data-testid': 'refresh-art',
    onclick: async event => {
      event.target.disabled = true;
      try {
        const catalog = await context.request('art');
        if (!box.isConnected) return;
        context.catalog.suppliedArt = catalog; render();
      } catch (error) { context.message(error.message, true); }
      finally { event.target.disabled = false; }
    },
  }), controls);
  render();
  return box;
}
