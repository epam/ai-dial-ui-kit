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
  renameSync,
  rmSync,
} from 'node:fs';
import { dirname, join, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

const fixturesDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolvePath(fixturesDir, '..');
const npmExecPath = process.env.npm_execpath;

/*
 * `npm pack` names its output after `package.json#version`, and it cannot be
 * told otherwise — so the filename is `…-0.0.0.tgz` on `development` and
 * `…-0.14.0.tgz` on `release-0.14`. A fixture cannot pin a filename that
 * moves with the branch: every one of them pinned the `0.0.0` spelling, so on
 * a release branch all ten failed to install with `ENOENT` and this suite
 * reported ten regressions that were really one wrong path. The packed
 * artifact is therefore renamed to this one canonical, version-free name,
 * which is what the fixtures pin.
 */
const CANONICAL_TARBALL = 'ai-dial-ui-kit.tgz';

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

  const packed = readdirSync(tarballDir).filter((f) => f.endsWith('.tgz'));
  if (packed.length !== 1) {
    throw new Error(
      `Expected exactly one packed tarball in ${tarballDir}, found ${
        packed.length === 0 ? 'none' : packed.join(', ')
      }`,
    );
  }
  renameSync(join(tarballDir, packed[0]), join(tarballDir, CANONICAL_TARBALL));
  console.log(`Packed ${packed[0]} as ${CANONICAL_TARBALL}`);

  const results = [];
  for (const name of listFixtureDirs()) {
    const dir = join(fixturesDir, name);
    const pkgPath = join(dir, 'package.json');
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    const scripts = Object.keys(pkg.scripts ?? {});

    console.log(`\n=== ${name} ===`);
    try {
      // The tarball is rebuilt under the same canonical filename on every
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
