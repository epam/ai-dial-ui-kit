import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  addDtsRelativeExtensions,
  createSpecifierResolver,
  rewriteRelativeSpecifiers,
} from './dts-relative-extensions.mjs';

const sourceDir = resolve('/repo/src/components/Button');
const existing = new Set(
  [
    'Button.tsx',
    '../../models/button.ts',
    '../../types/button.d.ts',
    '../Analytics/index.ts',
    './icon.svg',
  ].map((path) => resolve(sourceDir, path)),
);
const fileExists = (path: string) => existing.has(resolve(path));
const resolveSpecifier = createSpecifierResolver(sourceDir, fileExists);

describe('createSpecifierResolver', () => {
  it.each([
    ['./Button', './Button.js'],
    ['../../models/button', '../../models/button.js'],
    ['../../types/button', '../../types/button.js'],
    ['../Analytics', '../Analytics/index.js'],
    ['../Analytics/', '../Analytics/index.js'],
    ['./Button.tsx', './Button.js'],
    ['../../models/button.ts', '../../models/button.js'],
    ['./Button.js', './Button.js'],
    ['./icon.svg', './icon.svg'],
  ])('resolves %s to %s', (specifier, expected) => {
    expect(resolveSpecifier(specifier)).toBe(expected);
  });

  it('fails loudly on a specifier it cannot resolve', () => {
    expect(() => resolveSpecifier('./Missing')).toThrow(/Cannot resolve/);
  });
});

describe('rewriteRelativeSpecifiers', () => {
  it('rewrites every relative import form and leaves packages alone', () => {
    const input = [
      "import { a } from './Button';",
      "export { b } from '../../models/button';",
      'export * from "../Analytics";',
      "import './Button';",
      "type C = import('./Button').ButtonProps;",
      "import { FC } from 'react';",
    ].join('\n');

    expect(rewriteRelativeSpecifiers(input, resolveSpecifier)).toBe(
      [
        "import { a } from './Button.js';",
        "export { b } from '../../models/button.js';",
        'export * from "../Analytics/index.js";',
        "import './Button.js';",
        "type C = import('./Button.js').ButtonProps;",
        "import { FC } from 'react';",
      ].join('\n'),
    );
  });
});

describe('addDtsRelativeExtensions', () => {
  const hook = addDtsRelativeExtensions({
    root: resolve('/repo'),
    outDir: resolve('/repo/dist'),
  });

  it('ignores files that are not declarations', () => {
    expect(hook('/repo/dist/src/index.js', "from './a'")).toBeUndefined();
  });

  it('resolves against the source directory the declaration mirrors', () => {
    // The error names the directory it searched: dist/src/… maps to src/….
    expect(() =>
      hook(
        resolve('/repo/dist/src/components/Button/Button.d.ts'),
        "export * from './DoesNotExist';",
      ),
    ).toThrow(resolve('/repo/src/components/Button'));
  });
});
