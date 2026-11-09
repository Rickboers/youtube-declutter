// npm test — checks that the extension Chrome loads is complete and that every
// option in the popup actually does something.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = (f) => readFileSync(new URL(f, root), 'utf8');
const manifest = JSON.parse(read('manifest.json'));
const ctx = vm.createContext({});
vm.runInContext(read('settings.js') + '\nglobalThis.SETTINGS = SETTINGS; globalThis.DEFAULTS = DEFAULTS;', ctx);
const { SETTINGS, DEFAULTS } = ctx;

// Options handled in content.js rather than by a CSS rule.
const SCRIPTED = new Set(['home-redirect']);

test('manifest is Manifest V3 with a valid version', () => {
  assert.equal(manifest.manifest_version, 3);
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.ok(manifest.description.length <= 132, 'Chrome limits the description to 132 characters');
});

test('every file the manifest names exists', () => {
  const files = [
    ...Object.values(manifest.icons),
    ...Object.values(manifest.action.default_icon),
    manifest.action.default_popup,
    ...manifest.content_scripts.flatMap((c) => [...(c.js || []), ...(c.css || [])]),
  ];
  for (const f of files) assert.ok(existsSync(new URL(f, root)), `missing ${f}`);
});

test('settings.js loads before content.js and popup.js', () => {
  const js = manifest.content_scripts[0].js;
  assert.ok(js.indexOf('settings.js') < js.indexOf('content.js'));
  const html = read('popup.html');
  assert.ok(html.indexOf('src="settings.js"') > -1 && html.indexOf('src="settings.js"') < html.indexOf('src="popup.js"'));
});

test('every option has a unique key, a label and a default', () => {
  const keys = SETTINGS.map((s) => s.key);
  assert.equal(new Set(keys).size, keys.length, 'duplicate key');
  for (const s of SETTINGS) {
    assert.match(s.key, /^[a-z][a-z-]*$/);
    assert.ok(s.label, `${s.key} has no label`);
    assert.equal(typeof s.on, 'boolean', `${s.key} has no default`);
    assert.equal(DEFAULTS[s.key], s.on);
  }
  assert.equal(DEFAULTS.enabled, true);
});

test('every option has a rule in hide.css, and every rule has an option', () => {
  const css = read('hide.css');
  const used = new Set([...css.matchAll(/html\[ydc-([a-z-]+)\]/g)].map((m) => m[1]));
  for (const { key } of SETTINGS) {
    if (SCRIPTED.has(key)) assert.ok(read('content.js').includes(`"${key}"`), `content.js never reads ${key}`);
    else assert.ok(used.has(key), `hide.css has no rule for ${key}`);
  }
  for (const key of used) assert.ok(SETTINGS.some((s) => s.key === key), `hide.css uses ydc-${key}, which no option sets`);
});

test('no stray personal paths or secrets in the shipped files', () => {
  const shipped = readdirSync(root).filter((f) => /\.(js|css|html|json)$/.test(f));
  for (const f of shipped) {
    const text = read(f);
    assert.doesNotMatch(text, /\/Users\/[a-z]|\/home\/[a-z]|C:\\Users\\/, `${f} holds a personal file path`);
    assert.doesNotMatch(text, /[\w.+-]+@[\w-]+\.[a-z]{2,}/i, `${f} holds an email address`);
    assert.doesNotMatch(text, /(api[_-]?key|secret|token|password)\s*[:=]\s*['"][^'"]{8,}/i, `${f} looks like it holds a key`);
  }
});
