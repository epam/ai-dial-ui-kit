import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const baselinePath = resolvePath(
  __dirname,
  '..',
  '..',
  'openspec',
  'changes',
  'modularize-package-exports',
  'baseline',
  'root-exports.json',
);
const outputPath = resolvePath(__dirname, 'root-surface.generated.ts');
const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));

const namesByKind = (kind) =>
  baseline
    .filter((entry) => entry.kind === kind)
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

const values = namesByKind('value');
const types = namesByKind('type');
const generated =
  '// Generated from the pre-change public API baseline. Do not edit.\n' +
  `import { ${values.join(', ')} } from '@epam/ai-dial-ui-kit';\n` +
  `import type { ${types.join(', ')} } from '@epam/ai-dial-ui-kit';\n\n` +
  'export {};\n';

writeFileSync(outputPath, generated, 'utf8');
console.info(
  `Generated root import fixture for ${values.length} values and ${types.length} types.`,
);
