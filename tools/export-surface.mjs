#!/usr/bin/env node
/**
 * Parses the package's public export surface and compares it against a
 * checked-in baseline. Used by openspec/changes/modularize-package-exports
 * Task 1.1 (capture baseline) and Task 3.3 (verify no export was dropped or
 * renamed by the module-layout restructuring).
 *
 * Modes:
 *   --write <baseline.json>              Parse src/index.ts, write the export
 *                                         list to <baseline.json>.
 *   --check <baseline.json>              Parse src/index.ts, compare against
 *                                         <baseline.json>; exit 1 on any diff.
 *   --verify-against-baseline <baseline.json> [--entry <path>] [--types <path>]
 *                                         Load the *built* JS entry (default:
 *                                         package.json#exports['.'].import)
 *                                         and its declaration file (default:
 *                                         package.json#exports['.'].types),
 *                                         and confirm every baseline symbol
 *                                         name is still exported by one of
 *                                         them. Exits 1 if any symbol is
 *                                         missing.
 *   --verify-against-baseline <baseline.json> --from-tarball <tgz-path>
 *                                         Same check, but against an
 *                                         `npm pack` tarball instead of the
 *                                         local dist/ working tree - catches
 *                                         a `files`/`.npmignore`/`exports`
 *                                         mismatch a local build wouldn't
 *                                         reveal (Task 6.4). Extracts the
 *                                         tarball to a temp dir and resolves
 *                                         entry/types from *its*
 *                                         package.json#exports.
 */
import ts from 'typescript';
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  mkdtempSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const sourceEntry = resolvePath(repoRoot, 'src/index.ts');

/**
 * Parses a TS/DTS source file's top-level export statements and returns a
 * sorted list of { name, kind } where kind is 'value' or 'type'.
 *
 * Handles:
 *   export { A, B } from '...'
 *   export type { A, B } from '...'
 *   export { type A, B } from '...'        (element-level type marker)
 *   export const NAME = ...                (value)
 *   export function NAME(...) {}           (value)
 *   export interface / type / enum NAME     (type, except enum which is a value)
 *   export class NAME                       (value)
 */
const parseExports = (filePath) => {
  const text = readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    text,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  /** @type {Map<string, 'value' | 'type'>} */
  const exports = new Map();

  const addExport = (name, kind) => {
    // A name may legitimately appear as both a value and a type (e.g. a
    // class also used as a type position) - prefer 'value' since it is the
    // stronger guarantee (a value export also satisfies a type-only usage
    // for parity-checking purposes).
    const existing = exports.get(name);
    if (existing === 'value') return;
    exports.set(name, kind);
  };

  for (const stmt of sourceFile.statements) {
    if (ts.isExportDeclaration(stmt)) {
      const declIsTypeOnly = stmt.isTypeOnly;
      const clause = stmt.exportClause;
      if (clause && ts.isNamedExports(clause)) {
        for (const el of clause.elements) {
          const elementIsTypeOnly = declIsTypeOnly || el.isTypeOnly;
          const exportedName = el.name.text;
          addExport(exportedName, elementIsTypeOnly ? 'type' : 'value');
        }
      }
      // `export * from '...'` (namespace re-export) is intentionally not
      // resolved recursively here - src/index.ts uses only named exports.
      continue;
    }

    if (ts.isVariableStatement(stmt)) {
      const isExported = stmt.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword,
      );
      if (!isExported) continue;
      for (const decl of stmt.declarationList.declarations) {
        if (ts.isIdentifier(decl.name)) {
          addExport(decl.name.text, 'value');
        }
      }
      continue;
    }

    if (ts.isFunctionDeclaration(stmt) || ts.isClassDeclaration(stmt)) {
      const isExported = stmt.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword,
      );
      if (isExported && stmt.name) addExport(stmt.name.text, 'value');
      continue;
    }

    if (ts.isEnumDeclaration(stmt)) {
      const isExported = stmt.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword,
      );
      if (isExported) addExport(stmt.name.text, 'value');
      continue;
    }

    if (ts.isInterfaceDeclaration(stmt) || ts.isTypeAliasDeclaration(stmt)) {
      const isExported = stmt.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword,
      );
      if (isExported) addExport(stmt.name.text, 'type');
      continue;
    }
  }

  return [...exports.entries()]
    .map(([name, kind]) => ({ name, kind }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

const loadBaseline = (path) => {
  return JSON.parse(readFileSync(path, 'utf8'));
};

const diffLists = (baseline, actual) => {
  const actualByName = new Map(actual.map((e) => [e.name, e.kind]));
  const baselineNames = new Set(baseline.map((e) => e.name));

  const missing = baseline.filter((e) => !actualByName.has(e.name));
  const kindMismatches = baseline.filter((e) => {
    const actualKind = actualByName.get(e.name);
    return actualKind && actualKind !== e.kind;
  });
  const added = actual.filter((e) => !baselineNames.has(e.name));

  return { missing, kindMismatches, added };
};

const printDiff = ({ missing, kindMismatches, added }) => {
  if (missing.length) {
    console.error(`Missing ${missing.length} export(s) present in baseline:`);
    for (const e of missing) console.error(`  - ${e.name} (${e.kind})`);
  }
  if (kindMismatches.length) {
    console.error(`${kindMismatches.length} export(s) changed kind:`);
    for (const e of kindMismatches)
      console.error(`  - ${e.name} (was ${e.kind})`);
  }
  if (added.length) {
    console.log(
      `${added.length} export(s) added since baseline (informational only):`,
    );
    for (const e of added) console.log(`  + ${e.name} (${e.kind})`);
  }
};

const parseCjsExports = (filePath) => {
  const text = readFileSync(filePath, 'utf8');
  const names = new Set();
  for (const match of text.matchAll(/\bexports\.([A-Za-z_$][\w$]*)\s*=/g)) {
    names.add(match[1]);
  }
  return [...names].sort((a, b) => a.localeCompare(b));
};

const verifyBuiltSurface = ({
  label,
  expected,
  entry,
  requireEntry,
  typesFile,
  baseDir,
}) => {
  const expectedValues = expected.filter(({ kind }) => kind === 'value');
  const esm = parseExports(resolvePath(baseDir, entry));
  const cjsNames = new Set(parseCjsExports(resolvePath(baseDir, requireEntry)));
  const declarations = parseExports(resolvePath(baseDir, typesFile));
  const esmNames = new Set(esm.map(({ name }) => name));
  const declarationDiff = diffLists(expected, declarations);
  const missingEsm = expectedValues.filter(({ name }) => !esmNames.has(name));
  const missingCjs = expectedValues.filter(({ name }) => !cjsNames.has(name));

  let failed = false;
  if (missingEsm.length) {
    failed = true;
    console.error(
      `${label}: ${missingEsm.length} runtime export(s) missing from ESM:`,
    );
    for (const { name } of missingEsm) console.error(`  - ${name}`);
  }
  if (missingCjs.length) {
    failed = true;
    console.error(
      `${label}: ${missingCjs.length} runtime export(s) missing from CJS:`,
    );
    for (const { name } of missingCjs) console.error(`  - ${name}`);
  }
  if (declarationDiff.missing.length || declarationDiff.kindMismatches.length) {
    failed = true;
    console.error(
      `${label}: declaration surface differs from its source of truth:`,
    );
    printDiff(declarationDiff);
  }

  if (!failed) {
    console.log(
      `OK: ${label} preserves ${expectedValues.length} runtime export(s) in ESM/CJS and all ${expected.length} declaration export(s) with matching kinds.`,
    );
  }
  return !failed;
};

const readPackageJson = (baseDir = repoRoot) => {
  return JSON.parse(readFileSync(resolvePath(baseDir, 'package.json'), 'utf8'));
};

/**
 * Extracts an `npm pack` tarball to a fresh temp directory and returns the
 * path to the extracted package root (npm tarballs always nest their
 * contents under a top-level `package/` directory).
 */
const extractTarball = (tgzPath) => {
  const extractDir = mkdtempSync(join(tmpdir(), 'ai-dial-ui-kit-pack-'));
  const archivePath = resolvePath(process.cwd(), tgzPath).replace(/\\/g, '/');
  const destinationPath = extractDir.replace(/\\/g, '/');
  const extractArgs = ['-xzf', archivePath, '-C', destinationPath];

  try {
    // Works with BSD tar on Windows and with the standard tar available on
    // Linux/macOS CI.
    execFileSync('tar', extractArgs);
  } catch (error) {
    if (process.platform !== 'win32') throw error;
    // Some GNU tar builds on Windows interpret a drive-letter colon as the
    // `host:path` remote syntax. BSD tar rejects this flag, so use it only as
    // a Windows fallback after the portable invocation actually failed.
    execFileSync('tar', ['--force-local', ...extractArgs]);
  }
  return join(extractDir, 'package');
};

const main = async () => {
  const args = process.argv.slice(2);
  const flag = args[0];

  if (flag === '--write') {
    const outPath = resolvePath(process.cwd(), args[1]);
    const list = parseExports(sourceEntry);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, JSON.stringify(list, null, 2) + '\n', 'utf8');
    console.log(`Wrote ${list.length} exports to ${outPath}`);
    return;
  }

  if (flag === '--check') {
    const baselinePath = resolvePath(process.cwd(), args[1]);
    const baseline = loadBaseline(baselinePath);
    const actual = parseExports(sourceEntry);
    const diff = diffLists(baseline, actual);
    const hasBreakage =
      diff.missing.length > 0 || diff.kindMismatches.length > 0;
    printDiff(diff);
    if (hasBreakage) {
      console.error('FAIL: src/index.ts no longer matches the baseline.');
      process.exitCode = 1;
      return;
    }
    console.log(
      `OK: src/index.ts matches baseline (${baseline.length} exports).`,
    );
    return;
  }

  if (flag === '--verify-against-baseline') {
    const baselinePath = resolvePath(process.cwd(), args[1]);
    const baseline = loadBaseline(baselinePath);

    const entryFlagIndex = args.indexOf('--entry');
    const typesFlagIndex = args.indexOf('--types');
    const tarballFlagIndex = args.indexOf('--from-tarball');

    let baseDir = repoRoot;
    let source = 'dist/ working tree';
    if (tarballFlagIndex !== -1) {
      const tgzPath = args[tarballFlagIndex + 1];
      baseDir = extractTarball(tgzPath);
      source = `tarball ${tgzPath}`;
    }

    const pkg = readPackageJson(baseDir);
    const rootExport = pkg.exports?.['.'];
    const defaultEntry = rootExport?.import;
    const defaultRequire = rootExport?.require;
    const defaultTypes = rootExport?.types ?? pkg.types;

    const entry =
      entryFlagIndex !== -1 ? args[entryFlagIndex + 1] : defaultEntry;
    const typesFile =
      typesFlagIndex !== -1 ? args[typesFlagIndex + 1] : defaultTypes;

    if (!entry || !defaultRequire || !typesFile) {
      console.error(
        'No complete ESM/CJS/types root surface resolved from package.json#exports.',
      );
      process.exitCode = 1;
      return;
    }

    let passed = verifyBuiltSurface({
      label: `root (${source})`,
      expected: baseline,
      entry,
      requireEntry: defaultRequire,
      typesFile,
      baseDir,
    });

    // With default package paths, verify each curated subpath against its
    // checked-in source barrel as well. Explicit --entry/--types overrides
    // intentionally scope the command to the root/custom surface only.
    if (entryFlagIndex === -1 && typesFlagIndex === -1) {
      for (const [subpath, conditions] of Object.entries(pkg.exports ?? {})) {
        if (subpath === '.' || subpath === './styles.css') continue;
        const sourcePath = resolvePath(
          repoRoot,
          'src/subpaths',
          `${subpath.slice(2)}.ts`,
        );
        if (!existsSync(sourcePath)) continue;
        const expected = parseExports(sourcePath);
        passed =
          verifyBuiltSurface({
            label: subpath,
            expected,
            entry: conditions.import,
            requireEntry: conditions.require,
            typesFile: conditions.types,
            baseDir,
          }) && passed;
      }
    }

    if (!passed) {
      console.error(
        `FAIL: built package (${source}) export parity check failed.`,
      );
      process.exitCode = 1;
      return;
    }
    console.log(`OK: built package (${source}) export parity check passed.`);
    return;
  }

  console.error(
    'Usage: node tools/export-surface.mjs --write <path> | --check <path> | --verify-against-baseline <path> [--entry <path>] [--types <path>] [--from-tarball <tgz-path>]',
  );
  process.exitCode = 1;
};

await main();
