// Run after `pnpm --filter @workspace/project-princess run build`.
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listSprites } from '../game/tools/build-manifest.mjs';
import { validateBuildArt } from './studio-art.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'game');
const output = join(root, 'dist/public');

await validateBuildArt(source);

for (const privatePath of ['studio', '__studio_api', 'src', 'tools', '.replit-artifact']) {
  assert.equal(existsSync(join(output, privatePath)), false, `${privatePath} must not be published`);
}
assert.ok(existsSync(join(output, '.nojekyll')), 'Static release must disable Jekyll processing');

function* files(directory, prefix) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const name = posix.join(prefix, entry.name);
    if (entry.isDirectory()) yield* files(join(directory, entry.name), name);
    else if (entry.isFile() && !entry.name.startsWith('.')) yield name;
  }
}

let checked = 0;
for (const name of [
  ...files(join(source, 'assets'), 'assets'),
  ...files(join(source, 'icons'), 'icons'),
  'lib/phaser.min.js',
  'lib/PHASER-LICENSE.md',
]) {
  if (name === 'assets/sprites/manifest.json') continue;
  assert.deepEqual(readFileSync(join(output, name)), readFileSync(join(source, name)), name);
  checked++;
}

const manifest = JSON.parse(readFileSync(join(output, 'assets/sprites/manifest.json')));
assert.deepEqual(manifest.files, listSprites(), 'Manifest must reflect current sprites');
for (const name of manifest.files) assert.ok(readFileSync(join(output, 'assets/sprites', name)).length);

const html = readFileSync(join(output, 'index.html'), 'utf8');
assert.match(html, /<title>Project Princess<\/title>/);
assert.match(html, /src="lib\/phaser\.min\.js"/);
const manifestURL = html.match(/rel="manifest" href="([^"]+)"/)?.[1];
assert.ok(manifestURL, 'HTML must link the web manifest');
// Support root and prefixed Vite base paths.
const webManifestPath = join(output, manifestURL.split('/').at(-1));
assert.deepEqual(readFileSync(webManifestPath), readFileSync(join(source, 'manifest.webmanifest')));
const webManifest = JSON.parse(readFileSync(webManifestPath));
for (const icon of webManifest.icons) {
  assert.ok(readFileSync(join(dirname(webManifestPath), icon.src)).length, icon.src);
}

const songs = JSON.parse(readFileSync(join(output, 'assets/karaoke/songs.json')));
for (const song of songs) {
  assert.ok(readFileSync(join(output, 'assets/karaoke', `${song.id}.mp3`)).length, song.id);
}
console.log(`Build verified: ${checked} unchanged runtime files, ${manifest.files.length} custom sprites, ${songs.length} audio URLs, web manifest and icons.`);
