import path from 'path';
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import { listSprites } from './game/tools/build-manifest.mjs';
import { createEditorApiPlugin } from './tools/dev-studio-plugin.mjs';
import { validateBuildArt } from './tools/studio-art.mjs';
import { siteConfig } from './tools/site-config.mjs';

const { port, base: basePath, host } = siteConfig();

const gameRoot = path.resolve(import.meta.dirname, 'game');

const assignedArtValidationPlugin: Plugin = {
  name: 'project-princess-validate-assigned-art',
  apply: 'build',
  async buildStart() {
    await validateBuildArt(gameRoot);
  },
};

// Phaser and HTML audio load these paths at runtime, outside Vite's import graph.
// Keep their names and directory structure instead of hashing or bundling them.
function* runtimeFiles(directory: string, prefix: string): Generator<string> {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const name = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      yield* runtimeFiles(path.join(directory, entry.name), name);
    } else if (entry.isFile() && !entry.name.startsWith('.')) {
      yield name;
    }
  }
}

const spriteManifestPlugin: Plugin = {
  name: 'project-princess-sprite-manifest',
  configureServer(server: {
    middlewares: {
      use: (
        route: string,
        handler: (
          request: unknown,
          response: {
            setHeader: (name: string, value: string) => void;
            end: (body: string) => void;
          },
        ) => void,
      ) => void;
    };
  }) {
    server.middlewares.use('/assets/sprites/manifest.json', (_request, response) => {
      response.setHeader('Content-Type', 'application/json');
      response.setHeader('Cache-Control', 'no-store');
      response.end(JSON.stringify({ files: listSprites() }));
    });
  },
  generateBundle() {
    for (const fileName of [
      ...runtimeFiles(path.join(gameRoot, 'assets'), 'assets'),
      ...runtimeFiles(path.join(gameRoot, 'icons'), 'icons'),
      'lib/phaser.min.js',
      'lib/PHASER-LICENSE.md',
    ]) {
      // Always generate this from current sprites, never copy a stale manifest.
      if (fileName === 'assets/sprites/manifest.json') continue;
      this.emitFile({
        type: 'asset',
        fileName,
        source: readFileSync(path.join(gameRoot, fileName)),
      });
    }
    this.emitFile({
      type: 'asset',
      fileName: 'assets/sprites/manifest.json',
      source: JSON.stringify({ files: listSprites() }, null, 2),
    });
    this.emitFile({ type: 'asset', fileName: '.nojekyll', source: '' });
  },
};

export default defineConfig({
  base: basePath,
  plugins: [assignedArtValidationPlugin, spriteManifestPlugin, createEditorApiPlugin()],
  root: path.resolve(import.meta.dirname, 'game'),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    // Keep the web manifest at the site root so its relative icon URLs,
    // start_url and scope still resolve correctly. Leave the source untouched.
    rollupOptions: {
      output: {
        assetFileNames: (asset) =>
          asset.names.some((name) => name.endsWith('.webmanifest'))
            ? '[name][extname]'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host,
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host,
    allowedHosts: true,
  },
});
