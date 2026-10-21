/**
 * Resolves each style export under the `style` and default conditions
 * from the installed tarball; all three must succeed and agree on one file.
 */
import { execFileSync } from 'node:child_process';

const specifiers = ['theme', 'mixins', 'typography'].map(
  (name) => `@epam/ai-dial-ui-kit/styles/${name}.css`,
);
const conditions = ['style', null];

const resolve = (specifier, condition) =>
  execFileSync(
    process.execPath,
    [
      ...(condition ? [`--conditions=${condition}`] : []),
      '--input-type=module',
      '-e',
      `console.log(import.meta.resolve(${JSON.stringify(specifier)}))`,
    ],
    { cwd: process.cwd(), encoding: 'utf8' },
  ).trim();

let failed = false;
for (const specifier of specifiers) {
  const resolved = new Set(conditions.map((c) => resolve(specifier, c)));
  const ok = resolved.size === 1;
  failed ||= !ok;
  console.log(
    `${ok ? 'ok  ' : 'FAIL'} ${specifier} -> ${[...resolved].join(' | ')}`,
  );
}
if (failed) process.exit(1);
console.log(
  '\nPASS: style exports resolve identically under style and default',
);
