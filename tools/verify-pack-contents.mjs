#!/usr/bin/env node
/**
 * Verifies that the packed npm tarball's file list is complete:
 *
 *   1. Every file referenced by `package.json#exports` (root + every new
 *      subpath, for every condition: types/import/require/default) is
 *      present in the pack.
 *   2. Every file actually emitted to the local `dist/` build is present in
 *      the pack - a stronger, simpler guarantee than tracing each
 *      consumer-fixture's reachable-chunk set individually: since every
 *      fixture's bundler can only ever resolve into files that exist under
 *      `dist/`, proving the *entire* build output is packed trivially
 *      covers any subset of it a fixture's static-or-lazy module graph
 *      could reach.
 *
 * Usage:
 *   node tools/verify-pack-contents.mjs
 *   node tools/verify-pack-contents.mjs --pack-json <existing-pack-json>
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, relative, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolvePath(fileURLToPath(import.meta.url), '..', '..');

const parseArgs = (argv) => {
  const out = { packJson: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--pack-json') out.packJson = argv[++i];
  }
  return out;
};

const parsePackFiles = (json) => {
  const parsed = JSON.parse(json)[0];
  return new Set(parsed.files.map((f) => f.path.replace(/\\/g, '/')));
};

const loadPackFiles = (packJsonPath) =>
  packJsonPath
    ? parsePackFiles(readFileSync(packJsonPath, 'utf8'))
    : parsePackFiles(
        process.env.npm_execpath
          ? execFileSync(
              process.execPath,
              [process.env.npm_execpath, 'pack', '--dry-run', '--json'],
              { cwd: repoRoot, encoding: 'utf8' },
            )
          : execFileSync('npm', ['pack', '--dry-run', '--json'], {
              cwd: repoRoot,
              encoding: 'utf8',
              shell: process.platform === 'win32',
            }),
      );

const walkDist = () => {
  const distRoot = join(repoRoot, 'dist');
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else files.push(relative(repoRoot, full).replace(/\\/g, '/'));
    }
  };
  walk(distRoot);
  return files;
};

const collectExportsFiles = (pkg) => {
  const files = [];
  for (const [, conditions] of Object.entries(pkg.exports)) {
    if (typeof conditions === 'string') {
      files.push(conditions.replace(/^\.\//, ''));
      continue;
    }
    for (const [, p] of Object.entries(conditions)) {
      files.push(p.replace(/^\.\//, ''));
    }
  }
  return files;
};

const main = () => {
  const { packJson } = parseArgs(process.argv.slice(2));

  const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
  const packFiles = loadPackFiles(packJson);

  let failed = false;

  // 1. package.json#exports files.
  const exportsFiles = collectExportsFiles(pkg);
  const missingExports = exportsFiles.filter((f) => !packFiles.has(f));
  if (missingExports.length > 0) {
    failed = true;
    console.error(
      `FAIL: ${missingExports.length} package.json#exports file(s) missing from the pack:`,
    );
    for (const f of missingExports) console.error(`  - ${f}`);
  } else {
    console.log(
      `OK: all ${exportsFiles.length} package.json#exports file(s) present in the pack.`,
    );
  }

  // 2. Entire local dist/ build output.
  const distFiles = walkDist();
  const missingDist = distFiles.filter((f) => !packFiles.has(f));
  if (missingDist.length > 0) {
    failed = true;
    console.error(
      `\nFAIL: ${missingDist.length} file(s) under dist/ are missing from the pack (any of these could be a chunk some consumer fixture's bundler needs to resolve):`,
    );
    for (const f of missingDist.slice(0, 20)) console.error(`  - ${f}`);
    if (missingDist.length > 20) {
      console.error(`  ... and ${missingDist.length - 20} more`);
    }
  } else {
    console.log(
      `OK: all ${distFiles.length} file(s) under dist/ are present in the pack (superset check - covers every chunk any fixture could reach).`,
    );
  }

  console.log(`\nPack total: ${packFiles.size} files.`);

  if (failed) {
    console.error('\nFAIL');
    process.exit(1);
  }
  console.log('\nPASS');
};

main();
