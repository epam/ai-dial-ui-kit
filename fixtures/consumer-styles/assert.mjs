/**
 * Asserts the compiled host stylesheets (see build.mjs): utilities are generated
 * from the kit's tokens, the type scale compiles, a host override wins, the
 * Sass-loaded variant produces the same classes, and typography without
 * mixins fails loudly.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runTailwind } from './build.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const read = (path) => readFileSync(join(root, path), 'utf8');

const failures = [];
const check = (name, ok) => {
  if (!ok) failures.push(name);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}`);
};

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Every `<selector> { … }` block, wherever it sits (inside an @layer included).
const rulesFor = (css, selector) =>
  [
    ...css.matchAll(
      new RegExp(`${escapeRegExp(selector)}\\s*\\{[^}]*\\}`, 'g'),
    ),
  ].map((m) => m[0]);

const css = read('dist/host.css');

check(
  'bg-layer-base reads the kit token',
  rulesFor(css, '.bg-layer-base').some((r) =>
    r.includes('var(--bg-layer-base'),
  ),
);
check(
  'text-secondary reads the kit token',
  rulesFor(css, '.text-secondary').some((r) =>
    r.includes('var(--text-secondary'),
  ),
);
check(
  'kit token keys are not declared on :root',
  !css.includes('--background-color-layer-base:'),
);
check(
  '.dial-small-text compiles',
  rulesFor(css, '.dial-small-text').length > 0,
);
check('.dial-body-text compiles', rulesFor(css, '.dial-body-text').length > 0);
check(
  'global h1 carries the kit size and line height',
  rulesFor(css, 'h1').some(
    (r) => r.includes('font-size: 20px') && r.includes('line-height: 28px'),
  ),
);

const small = rulesFor(css, '.dial-small-text');
check(
  'host override follows the kit rule',
  small.length >= 2 &&
    small.at(-1).includes('line-height: 17px') &&
    !small[0].includes('17px'),
);

const sassCss = read('dist/host-from-sass.out.css');
check(
  'Sass-first host resolves the kit imports and keeps its own Sass',
  [
    '.bg-layer-base',
    '.text-secondary',
    '.dial-small-text',
    '.dial-body-text',
    '.host-gap',
  ].every((selector) => rulesFor(sassCss, selector).length > 0) &&
    rulesFor(sassCss, '.host-gap').some((r) => r.includes('padding-left: 4px')),
);

let missingMixinsError = '';
try {
  runTailwind('src/missing-mixins.css', 'dist/missing-mixins.css');
} catch (err) {
  missingMixinsError = `${err.stdout ?? ''}${err.stderr ?? ''}${err.message}`;
}
check(
  'typography without mixins fails naming a dial-mixin utility',
  /dial-mixin-/.test(missingMixinsError),
);

const readme = readFileSync(join(root, '../../README.md'), 'utf8');
const kitImports = read('src/host.css')
  .split('\n')
  .filter((line) => line.startsWith("@import '@epam/ai-dial-ui-kit/styles/"));
check(
  'README documents the same three imports in the same order',
  kitImports.length === 3 && readme.includes(kitImports.join('\n')),
);

if (failures.length) {
  console.error(`\nFAIL: ${failures.length} assertion(s) failed`);
  process.exit(1);
}
console.log('\nPASS: consumer-styles');
