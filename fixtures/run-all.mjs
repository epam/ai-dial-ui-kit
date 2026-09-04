#!/usr/bin/env node
/**
 * Runs every consumer fixture end-to-end against the final built/packed
 * `@epam/ai-dial-ui-kit` artifact. Rebuilds and repacks the package once,
 * then for each fixture under `fixtures/`
 * reinstalls against the fresh tarball, builds, and re-runs every
 * assertion script it defines (`assert`, plus `smoke` where present),
 * exiting non-zero if any fixture regresses.
 *
 * Usage (from repo root): node fixtures/run-all.mjs
 */
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { dirname, join, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

const fixturesDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolvePath(fixturesDir, '..');
const npmExecPath = process.env.npm_execpath;

const runNpm = (args, cwd) => {
  if (npmExecPath) {
    execFileSync(process.execPath, [npmExecPath, ...args], {
      cwd,
      stdio: 'inherit',
    });
    return;
  }
  // Direct `node fixtures/run-all.mjs` invocations may not provide
  // npm_execpath. The Windows npm.cmd shim needs a shell; all arguments here
  // are hardcoded literals or repository paths, never user/network input.
  execFileSync('npm', args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
};

const listFixtureDirs = () => {
  return readdirSync(fixturesDir, { withFileTypes: true })
    .filter(
      (e) => e.isDirectory() && e.name !== 'shared' && e.name !== '.tarballs',
    )
    .map((e) => e.name)
    .sort();
};

const main = () => {
  console.log('=== Rebuilding and repacking @epam/ai-dial-ui-kit ===');
  rmSync(join(repoRoot, 'dist'), { recursive: true, force: true });
  runNpm(['run', 'build'], repoRoot);

  const tarballDir = join(fixturesDir, '.tarballs');
  rmSync(tarballDir, { recursive: true, force: true });
  // `npm pack --pack-destination` requires the destination directory to
  // already exist - it fails with ENOENT trying to open its own output
  // path otherwise.
  mkdirSync(tarballDir, { recursive: true });
  runNpm(['pack', '--pack-destination', tarballDir], repoRoot);

  const results = [];
  for (const name of listFixtureDirs()) {
    const dir = join(fixturesDir, name);
    const pkgPath = join(dir, 'package.json');
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    const scripts = Object.keys(pkg.scripts ?? {});

    console.log(`\n=== ${name} ===`);
    try {
      // The tarball is rebuilt under the same versioned filename on every
      // run. Remove the generated lockfile (which pins the old tarball's
      // integrity) and the installed package itself. Keeping unrelated,
      // already-valid dependencies makes local re-runs fast; a clean CI
      // checkout still installs the complete tree normally.
      rmSync(join(dir, 'package-lock.json'), { force: true });
      rmSync(join(dir, 'node_modules', '@epam', 'ai-dial-ui-kit'), {
        recursive: true,
        force: true,
      });
      runNpm(['install', '--no-audit', '--no-fund'], dir);
      runNpm(['run', 'build'], dir);
      if (scripts.includes('assert')) runNpm(['run', 'assert'], dir);
      if (scripts.includes('smoke')) runNpm(['run', 'smoke'], dir);
      results.push({ name, ok: true });
    } catch (err) {
      results.push({ name, ok: false, error: err.message });
    }
  }

  console.log('\n=== Summary ===');
  let failed = false;
  for (const r of results) {
    console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}`);
    if (!r.ok) failed = true;
  }

  if (failed) {
    console.error('\nFAIL: one or more fixtures regressed.');
    process.exit(1);
  }
  console.log(`\nPASS: all ${results.length} fixtures passed end-to-end.`);
};

main();
