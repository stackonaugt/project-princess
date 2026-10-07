import { element, field, gameURL } from './utils.js';
import { assetLayout } from '../src/art/asset-rules.js';

export function artworkPicker(entity, kind, id, context) {
  const box = element('fieldset', { className: 'studio-nested', 'data-testid': 'artwork-picker' },
    [element('legend', { text: 'Supplied artwork' })]);
  box.append(element('p', { className: 'studio-muted',
    text: 'Select files already supplied in assets/sprites/pets, npcs or portraits. Templates are not supplied artwork. Preview before applying; assignments take effect in the game after Save project and reload. No files or player saves are changed.' }));
  const controls = element('div');
  const render = () => {
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
      const apply = element('button', { className: 'studio-button', text: 'Use previewed artwork', type: 'button',
        disabled: true, 'data-testid': `art-apply-${slot}` });
      let requestNumber = 0;
      let ready = false;
      const show = async () => {
        const token = ++requestNumber;
        ready = false; apply.disabled = true; preview.replaceChildren();
        const file = select.value;
        if (!file) {
          status.textContent = 'Automatic stable-ID artwork, if supplied; otherwise the built-in template. Apply to clear this assignment.';
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
          } else {
            const canvas = element('canvas', { width: Math.min(128, layout.frameWidth * 4),
              height: Math.min(128, layout.frameHeight * 4), 'aria-label': `${title}, first frame` });
            const g = canvas.getContext('2d');
            g.imageSmoothingEnabled = false;
            g.drawImage(image, 0, 0, layout.frameWidth, layout.frameHeight, 0, 0, canvas.width, canvas.height);
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
