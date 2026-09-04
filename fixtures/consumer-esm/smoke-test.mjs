import { JSDOM } from 'jsdom';
import { readdirSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
defineGlobal('requestAnimationFrame', (callback) =>
  setTimeout(() => callback(Date.now()), 0),
);
defineGlobal('cancelAnimationFrame', clearTimeout);

const assetsDir = resolvePath(__dirname, 'dist', 'assets');
const bundleFile = readdirSync(assetsDir).find(
  (fileName) => fileName.startsWith('index-') && fileName.endsWith('.js'),
);

if (!bundleFile) {
  throw new Error(`No built ESM consumer bundle found under ${assetsDir}.`);
}

await import(pathToFileURL(resolvePath(assetsDir, bundleFile)).href);

let button;
for (let attempt = 0; attempt < 20 && !button; attempt += 1) {
  await new Promise((resolve) => setTimeout(resolve, 25));
  button = dom.window.document.querySelector('button');
}

if (button?.textContent !== 'Hello' || button.ariaLabel !== 'Hello') {
  throw new Error(
    `Expected an accessible "Hello" button, received ${dom.window.document.body.innerHTML}`,
  );
}

console.info('PASS: root ESM Button mounted with accessible name "Hello".');
