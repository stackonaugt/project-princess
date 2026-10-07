// Managed previews supply these settings; an independent checkout needs defaults.
export function siteConfig(env = process.env) {
  const port = Number(env.PORT ?? 5173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer from 1 to 65535.');
  }
  const suppliedBase = env.BASE_PATH ?? '/';
  if (!/^\/[a-zA-Z0-9._~/-]*$/.test(suppliedBase) ||
      suppliedBase.split('/').some(part => part === '.' || part === '..') ||
      suppliedBase.includes('//')) {
    throw new Error('BASE_PATH must be a site path such as / or /project-princess/.');
  }
  const base = suppliedBase.endsWith('/') ? suppliedBase : `${suppliedBase}/`;
  // Keep the file-writing Studio on loopback locally, while allowing Replit's proxy.
  const host = env.REPL_ID || env.REPLIT_DEV_DOMAIN ? '0.0.0.0' : '127.0.0.1';
  return { port, base, host };
}
