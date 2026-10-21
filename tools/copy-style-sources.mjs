#!/usr/bin/env node
/**
 * Copies the style sources a Tailwind v4 host can import into `dist/styles/`
 * as plain `.css`, where `package.json#exports` points at them
 * (`./styles/theme.css`, `./styles/mixins.css`, `./styles/typography.css`).
 *
 * They are published as `.css` on purpose: they hold Tailwind v4 at-rules
 * (`@theme`, `@utility`, `@apply`) and `--value()` that Sass cannot parse, and
 * Sass passes a `.css` `@import` through untouched for Tailwind to resolve.
 * The sources keep the `.scss` extension in `src/styles/` for the kit's own
 * build; they contain no Sass features.
 *
 * The files must stay self-contained: once copied out of `src/styles/` a
 * relative `@import`/`@use` would no longer resolve, so the copy fails
 * instead of shipping a file that breaks in the host.
 *
 * Usage (from repo root): node tools/copy-style-sources.mjs
 */
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolvePath(fileURLToPath(import.meta.url), '..', '..');

export const EXPORTED_STYLE_SOURCES = [
  'theme.scss',
  'mixins.scss',
  'typography.scss',
];

const BLOCK_COMMENT = /\/\*[\s\S]*?\*\//g;
const LINE_COMMENT = /^\s*\/\/.*$/gm;
const IMPORT_DIRECTIVE = /@(?:import|use|forward)\b/;

/** The first `@import`/`@use`/`@forward` outside comments, or `null`. */
export const findImportDirective = (source) => {
  const code = source.replace(BLOCK_COMMENT, '').replace(LINE_COMMENT, '');
  return IMPORT_DIRECTIVE.exec(code)?.[0] ?? null;
};

export const copyStyleSources = ({
  srcDir = join(repoRoot, 'src', 'styles'),
  outDir = join(repoRoot, 'dist', 'styles'),
  files = EXPORTED_STYLE_SOURCES,
} = {}) => {
  const sources = files.map((name) => {
    const source = readFileSync(join(srcDir, name), 'utf8');
    const directive = findImportDirective(source);
    if (directive) {
      throw new Error(
        `${name} contains ${directive}; exported style sources must be self-contained`,
      );
    }
    return name;
  });

  mkdirSync(outDir, { recursive: true });
  sources.forEach((name) =>
    copyFileSync(
      join(srcDir, name),
      join(outDir, name.replace(/.scss$/, '.css')),
    ),
  );
  return sources;
};

if (
  process.argv[1] &&
  resolvePath(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const copied = copyStyleSources();
    console.log(`Copied ${copied.length} style sources to dist/styles/`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
