// Lists every custom sprite in assets/sprites/ so the game knows what to load.
// Run automatically by the GitHub Pages workflow and by tools/serve.mjs.
//   node tools/build-manifest.mjs          -> writes assets/sprites/manifest.json
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'assets', 'sprites');
const FOLDERS = ['player', 'pets', 'portraits', 'npcs', 'objects', 'tiles', 'items', 'vehicles', 'enemies', 'backgrounds'];

export function listSprites() {
  const files = [];
  for (const folder of FOLDERS) {
    let names = [];
    try { names = readdirSync(join(ROOT, folder)); } catch { continue; }
    for (const name of names) {
      const full = join(ROOT, folder, name);
      if (!statSync(full).isFile() || !/^[a-z0-9_-]+\.(png|jpe?g|webp)$/i.test(name)) continue;
      if (folder !== 'portraits' && !/\.png$/i.test(name)) continue;
      files.push(relative(ROOT, full).split(sep).join('/'));
    }
  }
  return files.sort();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const files = listSprites();
  writeFileSync(join(ROOT, 'manifest.json'), JSON.stringify({ files }, null, 2) + '\n');
  console.log(`manifest.json: ${files.length} custom sprite${files.length === 1 ? '' : 's'}`);
  files.forEach(f => console.log('  ' + f));
}
