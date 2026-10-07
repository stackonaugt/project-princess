import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

if (!process.env.npm_config_user_agent?.startsWith('pnpm/')) {
  console.error('This workspace uses pnpm. Install pnpm 10.26.1, then run pnpm install.');
  process.exit(1);
}

// Preserve the existing single-lockfile policy without requiring a Unix shell.
for (const name of ['package-lock.json', 'yarn.lock']) {
  rmSync(fileURLToPath(new URL(`../${name}`, import.meta.url)), { force: true });
}
