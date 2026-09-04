#!/usr/bin/env node
/**
 * Diffs two `tools/measure-sizes.mjs` output files and prints a table of
 * raw/gzip byte deltas per matching file key.
 *
 * Only exact key matches are diffed directly; keys present in only one file
 * are listed separately (expected here - the restructuring renamed the root
 * entries and introduced brand-new subpath files, so most "after" keys have
 * no "before" counterpart to diff against, by design).
 *
 * Usage: node tools/diff-sizes.mjs <before.json> <after.json>
 */
import { readFileSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';

const load = (path) => {
  return JSON.parse(readFileSync(resolvePath(process.cwd(), path), 'utf8'));
};

const fmtDelta = (before, after) => {
  const delta = after - before;
  const pct = before === 0 ? 'n/a' : `${((delta / before) * 100).toFixed(1)}%`;
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta} B (${pct})`;
};

const main = () => {
  const [beforePath, afterPath] = process.argv.slice(2);
  if (!beforePath || !afterPath) {
    console.error(
      'Usage: node tools/diff-sizes.mjs <before.json> <after.json>',
    );
    process.exit(1);
  }

  const before = load(beforePath).files;
  const after = load(afterPath).files;

  const commonKeys = Object.keys(before).filter((k) => k in after);
  const beforeOnly = Object.keys(before).filter((k) => !(k in after));
  const afterOnly = Object.keys(after).filter((k) => !(k in before));

  console.log('=== Matching files (before -> after) ===');
  for (const key of commonKeys) {
    const b = before[key];
    const a = after[key];
    console.log(`${key}:`);
    console.log(
      `  raw:  ${b.rawBytes} -> ${a.rawBytes}  (${fmtDelta(b.rawBytes, a.rawBytes)})`,
    );
    console.log(
      `  gzip: ${b.gzipBytes} -> ${a.gzipBytes}  (${fmtDelta(b.gzipBytes, a.gzipBytes)})`,
    );
  }

  if (beforeOnly.length) {
    console.log(
      '\n=== Only in "before" (renamed/removed by the restructuring) ===',
    );
    for (const key of beforeOnly) {
      console.log(
        `  ${key}: ${before[key].rawBytes} raw / ${before[key].gzipBytes} gzip`,
      );
    }
  }

  if (afterOnly.length) {
    console.log('\n=== Only in "after" (new subpaths / renamed entries) ===');
    for (const key of afterOnly) {
      console.log(
        `  ${key}: ${after[key].rawBytes} raw / ${after[key].gzipBytes} gzip`,
      );
    }
  }
};

main();
