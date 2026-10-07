import test from 'node:test';
import assert from 'node:assert/strict';
import { siteConfig } from './site-config.mjs';

test('an independent checkout needs no Replit environment variables', () => {
  assert.deepEqual(siteConfig({}), { port: 5173, base: '/', host: '127.0.0.1' });
});
test('managed preview settings and proxy binding are preserved', () => {
  assert.deepEqual(siteConfig({ PORT: '19204', BASE_PATH: '/', REPL_ID: 'test' }),
    { port: 19204, base: '/', host: '0.0.0.0' });
});
test('repository paths, nested paths and custom-domain roots normalize', () => {
  for (const [input, expected] of [['/', '/'], ['/princess', '/princess/'], ['/games/princess/', '/games/princess/']]) {
    assert.equal(siteConfig({ BASE_PATH: input }).base, expected);
  }
});
test('invalid ports and paths fail explicitly', () => {
  for (const PORT of ['', 'no', '0', '-1', '65536', '1.5']) assert.throws(() => siteConfig({ PORT }));
  for (const BASE_PATH of ['', 'princess/', 'https://example.com/', '/a/../', '/a?x/', '/a#x/', '//host/']) {
    assert.throws(() => siteConfig({ BASE_PATH }));
  }
});
