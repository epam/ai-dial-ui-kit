import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// @ts-expect-error - plain ESM tool script without type declarations
import {
  copyStyleSources,
  findImportDirective,
} from './copy-style-sources.mjs';

const makeDirs = () => {
  const root = mkdtempSync(join(tmpdir(), 'copy-style-sources-'));
  const srcDir = join(root, 'src');
  const outDir = join(root, 'out', 'styles');
  mkdirSync(srcDir);
  return { srcDir, outDir };
};

describe('findImportDirective', () => {
  it('finds an import outside comments', () => {
    expect(findImportDirective(".a { color: red }\n@import './x.scss';")).toBe(
      '@import',
    );
  });

  it('finds @use and @forward', () => {
    expect(findImportDirective("@use 'x';")).toBe('@use');
    expect(findImportDirective("@forward 'x';")).toBe('@forward');
  });

  it('ignores directives mentioned in comments', () => {
    expect(
      findImportDirective('/* an @import here */\n// and @use there\n.a {}'),
    ).toBeNull();
  });
});

describe('copyStyleSources', () => {
  it('copies each listed file into the output directory as .css', () => {
    const { srcDir, outDir } = makeDirs();
    writeFileSync(join(srcDir, 'a.scss'), '.a { color: red }');

    const copied = copyStyleSources({ srcDir, outDir, files: ['a.scss'] });

    expect(copied).toEqual(['a.scss']);
    expect(readFileSync(join(outDir, 'a.css'), 'utf8')).toBe(
      '.a { color: red }',
    );
  });

  it('fails naming the file when a source contains a relative import', () => {
    const { srcDir, outDir } = makeDirs();
    writeFileSync(join(srcDir, 'a.scss'), "@import './x.scss';");

    expect(() =>
      copyStyleSources({ srcDir, outDir, files: ['a.scss'] }),
    ).toThrow(/a\.scss contains @import/);
  });
});
