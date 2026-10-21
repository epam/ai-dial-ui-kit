/**
 * Builds the host stylesheet twice: once through Tailwind's own CSS `@import`
 * resolution, and once with a Sass entry compiled first, the way a Sass-based
 * host (Next.js with sass-loader) would load it.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as sass from 'sass';

const root = dirname(fileURLToPath(import.meta.url));
// The package's `exports` does not expose its bin, so address the file the `bin` field names.
const tailwindBin = join(root, 'node_modules/@tailwindcss/cli/dist/index.mjs');

export const runTailwind = (input, output) =>
  execFileSync(process.execPath, [tailwindBin, '-i', input, '-o', output], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

const main = () => {
  mkdirSync(join(root, 'dist'), { recursive: true });

  runTailwind('src/host.css', 'dist/host.css');

  const { css } = sass.compile(join(root, 'src/host.scss'), {
    silenceDeprecations: ['import'],
    url: pathToFileURL(join(root, 'src/')),
  });
  writeFileSync(join(root, 'dist/host-from-sass.css'), css);
  runTailwind('dist/host-from-sass.css', 'dist/host-from-sass.out.css');
};

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
