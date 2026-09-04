#!/usr/bin/env node
/**
 * Records raw + gzip byte sizes for a set of built files, for use as a
 * before/after regression baseline by
 * openspec/changes/modularize-package-exports (Task 1.3 records "before",
 * Task 7.3 records "after" and diffs against this file).
 *
 * Usage: node tools/measure-sizes.mjs <out.json> <file1> [file2 ...]
 * Missing files are recorded with size 0 and present:false rather than
 * failing the whole run, so a slice that hasn't produced a given output yet
 * (e.g. a new subpath chunk before Task 3.1 lands) doesn't block capture of
 * the files that do exist.
 */
import { gzipSync } from 'node:zlib';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';

const [outArg, ...fileArgs] = process.argv.slice(2);
if (!outArg || fileArgs.length === 0) {
  console.error(
    'Usage: node tools/measure-sizes.mjs <out.json> <file1> [file2 ...]',
  );
  process.exit(1);
}

const outPath = resolvePath(process.cwd(), outArg);
const results = {};

for (const relPath of fileArgs) {
  const absPath = resolvePath(process.cwd(), relPath);
  if (!existsSync(absPath)) {
    results[relPath] = { present: false, rawBytes: 0, gzipBytes: 0 };
    continue;
  }
  const buf = readFileSync(absPath);
  results[relPath] = {
    present: true,
    rawBytes: buf.length,
    gzipBytes: gzipSync(buf).length,
  };
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(
  outPath,
  JSON.stringify(
    { capturedAt: new Date().toISOString(), files: results },
    null,
    2,
  ) + '\n',
  'utf8',
);

console.log(`Recorded sizes for ${fileArgs.length} file(s) to ${outPath}`);
for (const [path, r] of Object.entries(results)) {
  console.log(
    `  ${path}: ${r.present ? `${r.rawBytes} raw / ${r.gzipBytes} gzip` : 'MISSING'}`,
  );
}
