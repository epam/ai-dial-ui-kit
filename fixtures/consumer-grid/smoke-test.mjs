#!/usr/bin/env node
/**
 * Runtime rendering smoke test for the consumer-grid fixture (tasks.md
 * Task 4.3). Proves `Grid`/`DialGrid` actually renders - not just that the
 * static module graph has the right shape (that's assert-static-graph.mjs's
 * job) - by executing the fixture's own production bundle in a jsdom
 * document and reading back one row's rendered cell text.
 *
 * Deliberately does NOT `import()` `@epam/ai-dial-ui-kit` directly: plain
 * Node ESM cannot resolve the package's internal `react/jsx-runtime` shim
 * outside a bundler context (see
 * openspec/changes/modularize-package-exports/tasks.md Task 3.1 regression
 * note #2 - a pre-existing, out-of-scope gap). Instead this loads
 * `dist/assets/index-*.js`, the fixture's own Vite-built bundle: Vite/Rollup
 * already resolved that gap correctly at fixture-build time (a real
 * consumer's bundler always does), so the emitted bundle is fully
 * self-contained and safe to execute directly.
 *
 * No Vitest, no Playwright/Puppeteer: just jsdom (already a repo
 * devDependency elsewhere) plus a handful of browser-API stubs AG Grid/
 * @floating-ui need to mount without throwing.
 */
import { JSDOM } from 'jsdom';
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXPECTED_CELL_TEXT = 'Smoke-Test-Cell-Alpha';
const __dirname = dirname(fileURLToPath(import.meta.url));

const dom = new JSDOM(
  '<!doctype html><html><body><div id="root"></div></body></html>',
  { url: 'http://localhost/', pretendToBeVisual: true },
);

/* Node >=21 ships its own read-only `navigator` global getter, so a plain
 * `globalThis.navigator = ...` throws; `defineProperty` overrides it. */
const defineGlobal = (name, value) =>
  Object.defineProperty(globalThis, name, {
    value,
    writable: true,
    configurable: true,
  });

defineGlobal('window', dom.window);
defineGlobal('document', dom.window.document);
defineGlobal('navigator', dom.window.navigator);
defineGlobal('HTMLElement', dom.window.HTMLElement);
defineGlobal('Node', dom.window.Node);
defineGlobal('CustomEvent', dom.window.CustomEvent);
defineGlobal('MutationObserver', dom.window.MutationObserver);
defineGlobal('DocumentFragment', dom.window.DocumentFragment);
defineGlobal('Element', dom.window.Element);
defineGlobal('Text', dom.window.Text);
defineGlobal('getComputedStyle', dom.window.getComputedStyle.bind(dom.window));

/* AG Grid and @floating-ui both call these on mount/resize; jsdom has no
 * layout engine, so real behavior isn't needed - just enough of the shape
 * that nothing throws. */
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
const requestAnimationFrameStub = (cb) => setTimeout(() => cb(Date.now()), 0);
const cancelAnimationFrameStub = (id) => clearTimeout(id);
const matchMediaStub = () => ({
  matches: false,
  media: '',
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {
    return false;
  },
});

defineGlobal('ResizeObserver', ResizeObserverStub);
defineGlobal('requestAnimationFrame', requestAnimationFrameStub);
defineGlobal('cancelAnimationFrame', cancelAnimationFrameStub);
defineGlobal('matchMedia', matchMediaStub);
dom.window.ResizeObserver = ResizeObserverStub;
dom.window.requestAnimationFrame = requestAnimationFrameStub;
dom.window.cancelAnimationFrame = cancelAnimationFrameStub;
dom.window.matchMedia = matchMediaStub;
if (!dom.window.HTMLElement.prototype.scrollIntoView) {
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
}

const assetsDir = resolvePath(__dirname, 'dist', 'assets');
const bundleFile = readdirSync(assetsDir).find(
  (f) => f.startsWith('index-') && f.endsWith('.js'),
);
if (!bundleFile) {
  console.error(
    `No built bundle found under ${assetsDir} - run \`npm run build\` first.`,
  );
  process.exit(1);
}

await import(pathToFileURL(resolvePath(assetsDir, bundleFile)).href);

/* AG Grid's own render pass is requestAnimationFrame/microtask-driven -
 * poll briefly rather than guessing a single fixed delay. */
let found = false;
for (let attempt = 0; attempt < 20 && !found; attempt += 1) {
  await new Promise((r) => setTimeout(r, 100));
  found = (globalThis.document.body.textContent || '').includes(
    EXPECTED_CELL_TEXT,
  );
}

if (found) {
  console.log(`OK: rendered cell text found in DOM: "${EXPECTED_CELL_TEXT}"`);
  console.log(
    'This proves ModuleRegistry.registerModules(...) executed and AG Grid rendered real row data.',
  );
  process.exit(0);
}

console.error(`FAIL: expected cell text "${EXPECTED_CELL_TEXT}" not found.`);
console.error(
  'Rendered body text (first 2000 chars):',
  (globalThis.document.body.textContent || '').slice(0, 2000),
);
process.exit(1);
