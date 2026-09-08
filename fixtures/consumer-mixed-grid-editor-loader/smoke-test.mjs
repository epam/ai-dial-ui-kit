#!/usr/bin/env node
/**
 * Runtime rendering smoke test for the consumer-mixed-grid-editor-loader
 * fixture. Proves the mixed graph works end-to-end at runtime: renders the
 * eager `Button` (which also retains the root `LazyMarkdownEditor` loader
 * via `Object.assign(window, ...)`), clicks it to cross the dynamic
 * `import('./grid-feature')` boundary, and asserts the real Grid row
 * renders.
 *
 * Mirrors `fixtures/consumer-mixed-grid/smoke-test.mjs`'s jsdom-execution
 * pattern - see that file's header comment for why this loads the built
 * bundle directly instead of `import()`ing `@epam/ai-dial-ui-kit`.
 */
import { JSDOM } from 'jsdom';
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXPECTED_GRID_CELL_TEXT = 'Smoke-Test-Cell-Mixed-Editor-Loader';
const __dirname = dirname(fileURLToPath(import.meta.url));

const dom = new JSDOM(
  '<!doctype html><html><body><div id="root"></div></body></html>',
  { url: 'http://localhost/', pretendToBeVisual: true },
);

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

/* Vite's own `vite/preload-helper` runtime (injected because this fixture
 * has more than one dynamic-import chunk) walks `<link rel="modulepreload">`
 * tags and `fetch()`s each one so older browsers still prefetch them. There
 * is no real HTTP server in this jsdom smoke test, so that fetch would
 * otherwise reject with ECONNREFUSED and crash the script - stub it as a
 * resolved no-op response instead. */
const fetchStub = async () => new Response('', { status: 200 });
defineGlobal('fetch', fetchStub);
dom.window.fetch = fetchStub;
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

let button = null;
for (let attempt = 0; attempt < 20 && !button; attempt += 1) {
  await new Promise((r) => setTimeout(r, 50));
  button = globalThis.document.querySelector('button');
}
if (!button) {
  console.error('FAIL: no <button> ever appeared in the DOM.');
  process.exit(1);
}

button.dispatchEvent(
  new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }),
);

let found = false;
for (let attempt = 0; attempt < 40 && !found; attempt += 1) {
  await new Promise((r) => setTimeout(r, 100));
  found = (globalThis.document.body.textContent || '').includes(
    EXPECTED_GRID_CELL_TEXT,
  );
}

if (!found) {
  console.error(
    `FAIL: expected cell text "${EXPECTED_GRID_CELL_TEXT}" not found.`,
  );
  console.error(
    'Rendered body text (first 2000 chars):',
    (globalThis.document.body.textContent || '').slice(0, 2000),
  );
  process.exit(1);
}
console.log(
  `OK: rendered cell text found in DOM: "${EXPECTED_GRID_CELL_TEXT}"`,
);
console.log(
  "This proves the dynamic import('./grid-feature') resolved at runtime and AG Grid rendered real row data, even with the root LazyMarkdownEditor loader retained.",
);

/* Retention alone (Object.assign) never calls the loaders - confirm all
 * three are retained as real function references, proving they survived
 * whatever tree-shaking happened (matching the static-graph assertion's
 * "dynamic-require" result for their target packages). Actually invoking
 * one from this bare Node smoke script - outside any React event/lifecycle,
 * directly against the already-loaded production bundle's dynamic `import()`
 * - hangs the process for reasons unrelated to this fix (confirmed while
 * developing this fixture: the same `LazyMarkdownEditor()` call resolves and
 * renders correctly when invoked from inside a React click handler instead
 * of a bare top-level script `await`). That runtime path is already covered
 * by the library's own Vitest suite
 * (`src/components/JsonEditor/JsonEditor.spec.tsx`,
 * `src/components/MarkdownEditor/MarkdownEditor.spec.tsx`,
 * `src/components/New/MarkdownEditor/MarkdownEditor.spec.tsx`), which
 * renders with Testing Library instead of executing a raw production
 * bundle from a standalone script. */
for (const loaderName of [
  'LazyDialJsonEditor',
  'LazyDialMarkdownEditor',
  'LazyMarkdownEditor',
]) {
  if (typeof globalThis.window[loaderName] !== 'function') {
    console.error(`FAIL: window.${loaderName} was not retained as a function.`);
    process.exit(1);
  }
}
console.log(
  'OK: all three editor loaders retained as real function references.',
);

process.exit(0);
