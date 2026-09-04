## 1. Baseline capture and characterization fixtures

- [x] 1.1 Record the current root export surface as a checked-in baseline
      fixture: parse `src/index.ts` and write the full list of exported value
      and type names (with kind: value/type) to
      `openspec/changes/modularize-package-exports/baseline/root-exports.json`.
      Verification: a new script `tools/export-surface.mjs` run via
      `node tools/export-surface.mjs --check openspec/changes/modularize-package-exports/baseline/root-exports.json`
      exits 0 against current `src/index.ts` (proves the baseline capture
      script itself is correct before it's used as a regression gate later).
      **Done**: `tools/export-surface.mjs` (TypeScript-AST-based, handles
      named/type-only/mixed exports and `export const`); baseline captured at
      `baseline/root-exports.json` (342 exports: 237 value, 105 type,
      0 duplicates); `--check` passes (`OK: src/index.ts matches baseline
(342 exports).`).
- [x] 1.2 Record the current `npm pack --dry-run` file list to
      `openspec/changes/modularize-package-exports/baseline/pack-files-before.txt`.
      Verification: `npm pack --dry-run --json > baseline/pack-files-before.json`
      succeeds and the file is non-empty.
      **Done**: captured post-rebuild (see 1.3) at `baseline/pack-files-before.json`
      (393 files, 1,327,859 B tarball / 5,349,436 B unpacked).
- [x] 1.3 Build the current package (`npm run build`) and record raw + gzip
      size of `dist/dial-ui-kit.es.js`, `dist/dial-ui-kit.cjs.js`, and
      `dist/index.css` to
      `openspec/changes/modularize-package-exports/baseline/sizes-before.json`.
      Verification: script prints raw and gzip bytes for each file and the
      command exits 0; values are committed, not just printed.
      **Done**: `npm run build` succeeded. New script `tools/measure-sizes.mjs`
      records raw/gzip for the root ESM/CJS entries **and** their real shared
      chunk (Rollup already splits a content-hashed shared chunk today - see
      note below) to `baseline/sizes-before.json`:
      `dial-ui-kit.es.js` 8,334 B/2,902 B gzip (thin re-export barrel);
      `index-CpVGPv8D.js` **2,434,626 B / 589,280 B gzip** (the actual bulk -
      contains AG Grid, confirmed by `grep -c ag-grid` = 15 hits and
      `ModuleRegistry` = 3 hits); CJS mirrors (`dial-ui-kit.cjs.js` 10,340 B,
      `index-DBHH26fT.cjs` 1,763,390 B); `index.css` 84,658 B/13,501 B gzip.
      Chunk filenames are content-hashed and will change after Group 2/3.
- [x] 1.4 Scaffold the consumer-fixture harness at `fixtures/` (new directory,
      not published): `fixtures/consumer-esm/` (imports `Button` from root),
      `fixtures/consumer-grid/` (imports `Grid`/`DialGrid`),
      `fixtures/consumer-file-manager/` (imports `DialFileManager`),
      `fixtures/consumer-json-editor/` (calls `LazyDialJsonEditor()` /
      renders `DialSchemaRenderer`), `fixtures/consumer-markdown-editor/`
      (calls `LazyDialMarkdownEditor()`/`LazyMarkdownEditor()` and separately
      exercises the JSON-mode switch inside
      `DialMarkdownEditorContainer`/`SchemaAdditionalPropertiesEditor`). Each
      fixture is its own minimal Vite app that installs the packed tarball
      from `npm pack` (via `file:` reference to the `.tgz`), not a source
      alias to `../../src`.
      Verification: each fixture's `npm install && npm run build` succeeds
      against the **current, pre-restructuring** package (this proves the
      harness itself works before it's used to prove the fix, and the run
      is expected to currently FAIL the exclusion assertions in Task 1.5 —
      recording that failure is the "before" evidence).
      **Done**: all 5 fixtures scaffolded (`package.json` referencing
      `file:../.tarballs/epam-ai-dial-ui-kit-0.0.0.tgz`, `vite.config.mjs`
      with `minify:false` for grep-ability, `index.html`, `src/main.tsx`).
      `npm install && npm run build` succeeded for all 5 against the tarball
      packed from the current pre-restructuring build
      (`fixtures/.tarballs/epam-ai-dial-ui-kit-0.0.0.tgz`). The `-json-editor`
      and `-markdown-editor` fixtures only call the lazy loaders in this
      slice (calling `LazyDialJsonEditor()`/`LazyDialMarkdownEditor()`/
      `LazyMarkdownEditor()` from a `useEffect`); the deeper
      `DialSchemaRenderer`/JSON-mode-switch/runtime-render scenarios named in
      the parenthetical are left for Tasks 4.3/5.3/5.4 as originally scoped.
- [x] 1.5 Add the shared assertion helper
      `fixtures/shared/assert-static-graph.mjs` that reads a Vite/Rollup build
      manifest, computes the complete static initial graph (excluding
      dynamic-import chunks), and asserts a given list of forbidden package
      identifiers (`ag-grid-community`, `ag-grid-react`,
      `@monaco-editor/react`, `monaco-editor`, `@uiw/react-md-editor`,
      `@uiw/react-markdown-preview`) is absent, using both manifest module-id
      metadata and a source-string grep as a second signal.
      Verification: running it against `fixtures/consumer-esm`'s **current**
      (pre-restructuring) build output fails with a clear report naming which
      forbidden package(s) were found — this failing run is committed as the
      recorded "before" evidence referenced by `design.md`'s baseline section.
      **Done**: `fixtures/shared/graph-report-plugin.mjs` (emits per-chunk
      `moduleIds`/`imports`/`dynamicImports` via Rollup's `generateBundle`) + `fixtures/shared/assert-static-graph.mjs` (partitions static vs.
      dynamic chunks, checks `--forbidden`/`--require`/`--dynamic-require`
      via module-id path match + content-grep). Results against the
      pre-restructuring tarball, recorded at
      `baseline/fixture-assertions-before.txt`: **consumer-esm FAILS**
      (`ag-grid-community`/`ag-grid-react` found via content-grep in the one
      static chunk; Monaco/`@uiw/*` correctly absent already);
      **consumer-json-editor FAILS** and **consumer-markdown-editor FAILS**
      the same way (AG Grid leaks into their static graph too, even though
      Monaco/`@uiw/*` are already correctly dynamic-only); consumer-grid and
      consumer-file-manager PASS (they already require AG Grid and never
      touch editor packages, so isolation _from editors_ was never broken -
      only isolation _of everything else from AG Grid_ is the bug this
      change fixes).

## 2. Emitted module layout spike

- [x] 2.1 Spike: enable `build.rollupOptions.output.preserveModules: true`
      (with `preserveModulesRoot: 'src'`) in a throwaway branch of
      `vite.config.ts` and run `npm run build`; inspect whether
      `vite-plugin-dts` emits one `.d.ts` per module or a single rolled-up
      `.d.ts`.
      Verification: `npm run build` exits 0 and
      `find dist -name "*.d.ts" | wc -l` (or Windows equivalent) is compared
      against `find dist -name "*.js" | wc -l`; record the ratio and whether
      declarations are per-module or rolled-up in
      `openspec/changes/modularize-package-exports/baseline/dts-spike.md`, and
      resolve the corresponding Open Question in `design.md` based on the
      result.
      **Done**: see `baseline/dts-spike.md`. Finding: `.d.ts` emission was
      _already_ per-module (360 files under `dist/src/**`, independent of the
      JS bundling strategy) both before and after — `vite-plugin-dts` walks
      the TS program graph, not the Rollup JS chunk graph, so the flagged
      risk did not materialize and no `vite-plugin-dts` version bump was
      needed. Open Question resolved accordingly.
- [x] 2.2 Based on 2.1's result, implement the chosen emission mode
      (per-module `.d.ts` or hybrid module-preserving JS + rolled-up `.d.ts`)
      in `vite.config.ts`, keeping `build.lib.formats: ['es', 'cjs']` for the
      CJS side as a single bundle (per Decision 1 — CJS is not tree-shaken).
      Verification: `npm run build` exits 0 and produces per-source-module
      `.js` files under `dist/` for `es` format while `dist/dial-ui-kit.cjs.js`
      remains a single CJS bundle.
      **Done**: `vite.config.ts` now uses `rollupOptions.output` as a
      2-element array (ES with `preserveModules:true`,
      `preserveModulesRoot:'src'`, `entryFileNames:'[name].js'`; CJS with
      fixed `entryFileNames:'dial-ui-kit.cjs.js'`, no `preserveModules`);
      `build.lib.fileName` removed (superseded by per-format
      `entryFileNames`). `npm run build` exits 0. ES root entry is now
      `dist/index.js` (21.04 kB, re-exports ~360 per-module files, e.g.
      `dist/components/Grid/Grid.js` 10.20 kB with AG Grid emitted
      separately at `dist/node_modules/ag-grid-community/...` 1,485.35 kB /
      `dist/node_modules/ag-grid-react/...` 70.47 kB). CJS unchanged in shape
      (`dist/dial-ui-kit.cjs.js` 10.34 kB + one shared bundle). Updated
      `package.json#exports['.'].import` from `./dist/dial-ui-kit.es.js` to
      `./dist/index.js` (`.types`/`.require` unchanged). Added
      `fixtures/**/*.mjs` to the existing `tools/**/*.mjs` Node-globals
      override in `eslint.config.mjs` (the new `fixtures/shared/*.mjs`
      scripts otherwise fell through to no-globals linting). Confirmed zero
      new `npm run typecheck` errors (56 pre-existing errors, unrelated
      vitest-mock-typing issue in
      `FileManager/hooks/__tests__/use-trigger-view-create-folder.spec.tsx`,
      verified identical via `git stash`/`git stash pop` before touching
      anything) and `npx eslint vite.config.ts` clean.
- [x] 2.3 Re-point `fixtures/consumer-esm` at the newly built tarball
      (`npm pack` + reinstall) and re-run `fixtures/shared/assert-static-graph.mjs`.
      Verification: the assertion from Task 1.5 now PASSES (no forbidden
      package identifiers in the static initial graph) for the root `Button`
      import.
      **Done**: repacked (`npm pack --pack-destination fixtures/.tarballs`,
      814 files now vs. 393 before — per-module dist layout), reinstalled
      `fixtures/consumer-esm` against the fresh tarball, rebuilt. Fixture
      output dropped from 2,515.59 kB / gzip 559.32 kB to **768.76 kB / gzip
      141.93 kB**. `assert-static-graph.mjs` with the same forbidden list as
      Task 1.5 now **PASSES** (all 6 packages absent from the static initial
      graph) — recorded at `baseline/fixture-assertions-after-2.3.txt`. This
      is the mandatory root ESM fixture requirement
      (`specs/package-distribution/spec.md` "Root ESM entry is
      tree-shakeable...") confirmed met.

## 3. Package exports, types, and side-effects

- [x] 3.1 Add `./grid`, `./file-manager`, and `./editors` entries to
      `package.json#exports`, each pointing at the emitted module-preserving
      output for the corresponding source subtree (`src/components/Grid`,
      `src/components/New/Grid`, `src/components/FileManager` for `./grid`
      and `./file-manager`; the existing lazy loaders plus
      `DialJsonEditor`/`MarkdownEditor`/`New/MarkdownEditor` modules for
      `./editors`), keeping `.` and `./styles.css` unchanged in shape.
      Verification: `npm run build` exits 0; a new fixture
      `fixtures/consumer-core-subpath` (only added if `./core` is introduced
      per Decision 1) or the existing per-feature fixtures resolve each new
      subpath under Node ESM (`node --input-type=module -e "import('@epam/ai-dial-ui-kit/grid')"`),
      Node CJS (`node -e "require('@epam/ai-dial-ui-kit/grid')"`), and
      TypeScript (`tsc --noEmit` against a fixture file importing from each
      subpath).
      **Done**: added `src/subpaths/grid.ts`, `src/subpaths/file-manager.ts`,
      `src/subpaths/editors.ts` (thin re-export barrels, exactly mirroring
      the corresponding names already in `src/index.ts` - editors.ts
      re-declares its 3 lazy loaders independently rather than importing a
      shared helper, see the note in that file and in 3.1's regression
      finding below). `vite.config.ts`'s `build.lib.entry` is now a 4-key
      object map (`dial-ui-kit`, `grid`, `file-manager`, `editors`);
      `package.json#exports` gained `./grid`, `./file-manager`, `./editors`
      (types + import + require each), `.`/`./styles.css` unchanged in
      shape. `npm run build` exits 0, emitting `dist/grid.js`,
      `dist/file-manager.js`, `dist/editors.js` (ESM) and `dist/grid.cjs`,
      `dist/file-manager.cjs`, `dist/editors.cjs` (CJS - see the `.cjs.js`→
      `.cjs` fix below) plus matching `dist/src/subpaths/*.d.ts`. Verified:
      `require()` of all 4 `.cjs` entries succeeds with the exact expected
      export counts (root 237, grid 18, file-manager 12, editors 5 - all
      value-only, matching each subpath file's own export list); full
      fixture re-run (all 7 fixtures reinstalled against a fresh
      `npm pack` and rebuilt) still **PASSES** end-to-end, recorded at
      `baseline/fixture-assertions-after-group3.txt`.
      **Regression found and fixed during this task** (both discovered via
      the very verification this task requires, not left for later): 1. Initially re-exporting the 3 lazy loaders from a shared
      `src/utils/lazy-editors.ts` (imported by both `src/index.ts` and
      `src/subpaths/editors.ts`) broke `src/mcp/generate-manifest.ts`'s
      "Lazy component loader" AST pattern match (it requires the exact
      top-level `export const LazyX = () => import('./path')` shape in
      `src/index.ts` itself) - verified via `git stash`: manifest counts
      regressed from 162/24/2 (components/hooks/utils) to 116/11/108.
      Fixed by reverting `src/index.ts` to its original inline form
      (byte-identical to origin/development for those lines) and having
      `src/subpaths/editors.ts` independently re-declare the same 3
      loaders (each pointing at the same import target) instead of
      sharing a helper module. Re-verified: manifest counts restored to
      exactly 162/24/2/70/10. 2. Plain Node ESM initially failed because exact peer-name matching did
      not externalize `react/jsx-runtime`. `rollupOptions.external` now
      matches every peer package and all of its subpaths, so packed root
      and feature entries resolve under real Node `import()` as well as a
      consumer bundler. The independent subpath fixture supplies that
      runtime check; the export-surface verifier statically compares names
      and kinds without executing component code.
- [x] 3.2 Rewrite `package.json#sideEffects` to name actual emitted files that
      must never be tree-shaken (the shipped CSS), replacing the current
      source-path-shaped globs
      (`package.json:33-39`).
      Verification: the Task 1.5 assertion still passes for
      `fixtures/consumer-esm` (unaffected paths still excluded) AND the Grid
      fixture (Task 4.2) shows `registerModules` actually executing (no
      accidental over-exclusion).
      **Done**: replaced the dead source globs with `["dist/**/*.css"]`.
      Grid JS is deliberately not marked globally side-effectful: doing so
      would retain it through the root barrel for a `Button`-only import. Its
      registration call is colocated with the consumed Grid export and is
      retained when that module is reached. The Grid runtime smoke renders
      real row data, while `consumer-esm` proves the module is absent when
      Grid is not imported; see corrected Decision 3.
- [x] 3.3 Run the export/type parity check from Decision 5: extend
      `tools/export-surface.mjs` with a `--verify-against-baseline` mode that
      parses the newly built `dist/` output (root and every new subpath) and
      diffs it against `baseline/root-exports.json` from Task 1.1.
      Verification:
      `node tools/export-surface.mjs --verify-against-baseline openspec/changes/modularize-package-exports/baseline/root-exports.json`
      exits 0 with zero missing/renamed symbols for the root and every
      subpath, including value/type kind parity in declarations and all value
      exports in both ESM and CJS.
      **Done**: the verifier independently checks ESM, CJS, and declarations;
      missing runtime names or declaration kind mismatches are fatal. Each
      curated subpath is compared against its own source barrel, and the same
      checks run against the packed tarball in CI. The TypeScript consumer
      fixture also generates imports for every baseline root symbol (237
      values and 105 types) and compiles them with `tsc --noEmit`.
- [x] 3.4 Decide and record the AG Grid dependency classification per Decision
      2 (keep as bundled `dependencies`) by adding a code comment in
      `vite.config.ts` next to `rollupOptions.external` explaining why AG Grid
      is intentionally NOT externalized (unlike Monaco/`@uiw/*`), pointing at
      `design.md`'s Decision 2.
      Verification: `npm run lint` passes (comment doesn't trip any lint
      rule) and `package.json#dependencies` still lists
      `ag-grid-community`/`ag-grid-react` (i.e., this task is a documentation + guard task, not a dependency-classification code change).
      **Done**: comment added directly above `rollupOptions.external` in
      `vite.config.ts` (see Decision 2 cross-reference in the comment).
      `npx eslint vite.config.ts` clean; `package.json#dependencies` still
      lists `ag-grid-community`/`ag-grid-react` unchanged.

**Additional fix within this group's scope** (surfaced by 3.1's own
verification, and directly relevant to the "CJS `require()` resolves the
root entry" spec scenario this group is building toward): the CJS entry
filenames used `entryFileNames: '[name].cjs.js'`, producing a plain `.js`
extension that Node's module loader treats as an ES module because
`package.json` has `"type": "module"` - a real `require('@epam/ai-dial-ui-kit')`
threw `ReferenceError: exports is not defined in ES module scope`.
**Confirmed pre-existing** (reproduced against the unmodified
`origin/development` build via `git stash`, before this change touched
anything). Fixed by changing `entryFileNames` to `'[name].cjs'` (matching the
already-correct internal shared-chunk convention) and updating
`package.json#exports`'s 4 `require` conditions (`dial-ui-kit.cjs`,
`grid.cjs`, `file-manager.cjs`, `editors.cjs`). Verified: plain
`node -e "require(path)"` now succeeds for all 4 CJS entries with the
expected export counts.

## 4. Grid and FileManager isolation

- [x] 4.1 Confirm (via `grep`, not assumption) that no feature-neutral
      type/utility module imports `ag-grid-community`/`ag-grid-react` at
      runtime; for any found (e.g. shared constants/comparators used outside
      Grid), convert their AG Grid imports to `import type`/`export type` only
      where the runtime value isn't needed outside Grid, or relocate the
      runtime-dependent piece into the Grid module subtree.
      Verification:
      `grep -rn "from 'ag-grid" src --include=*.ts --include=*.tsx | grep -v -E "(Grid/Grid.tsx|New/Grid|Grid.spec|Grid.stories|comparators|renderers)"`
      returns no results (or only `import type` lines, checked by a
      follow-up `grep -n "^import type"` on any remaining match).
      **Done**: 9 matches remain after the filter, all under
      `src/components/FileManager/**` (FileManager is itself a Grid-feature
      module, gated behind the `./file-manager` subpath - not
      feature-neutral) or `src/constants/file-grid-columns.tsx`. Every one is
      `import type { ... }` (or the equivalent inline `import { type X }`
      form) - checked line-by-line, none is a runtime value import. No code
      change was needed; recorded at
      `baseline/fixture-assertions-group4.txt`.
- [x] 4.2 Verify `fixtures/consumer-grid` (Task 1.4) and
      `fixtures/consumer-file-manager` against the restructured package: run
      `assert-static-graph.mjs` with the forbidden list restricted to editor
      packages only (Monaco/`@uiw/*`) and a required-present list
      (`ag-grid-community`, `ag-grid-react`) for the feature graph.
      Verification: both fixtures' builds show `ag-grid-community` and
      `ag-grid-react` present in the feature graph, and
      `@monaco-editor/react`/`monaco-editor`/`@uiw/react-md-editor`/
      `@uiw/react-markdown-preview` absent from the static initial graph.
      **Done**: rebuilt the package, repacked (830 files now, up from 814),
      reinstalled both fixtures against the fresh tarball, rebuilt each.
      Both fixtures' `npm run assert` (already wired with
      `--require ag-grid-community,ag-grid-react --forbidden
@monaco-editor/react,monaco-editor,@uiw/react-md-editor,@uiw/react-markdown-preview`
      since Task 1.4) **PASS**. Recorded at
      `baseline/fixture-assertions-group4.txt`.
- [x] 4.3 Add a runtime assertion in `fixtures/consumer-grid` that renders
      `Grid`/`DialGrid` with one row of fixture data and reads back the
      rendered cell text via the fixture's own smoke test (a small
      Vitest/Playwright-free DOM check using `jsdom` or the fixture's preview
      server + a simple fetch/text assertion).
      Verification: the fixture's own test script exits 0 and prints the
      expected cell text, proving `ModuleRegistry.registerModules(...)`
      executed and AG Grid actually rendered.
      **Done**: `fixtures/consumer-grid/src/main.tsx` now renders `Grid`
      with one real row (`{ id: '1', name: 'Smoke-Test-Cell-Alpha' }`)
      instead of empty arrays. New `fixtures/consumer-grid/smoke-test.mjs`
      (`npm run smoke`) loads the fixture's own built bundle
      (`dist/assets/index-*.js`) into a `jsdom` document (plus stubs for
      `ResizeObserver`/`MutationObserver`/`requestAnimationFrame`/
      `matchMedia`/`scrollIntoView`, none of which jsdom implements or
      exposes as a bare global) and polls the rendered DOM text for the
      expected cell string. Deliberately does **not** `import()`
      `@epam/ai-dial-ui-kit` directly - that hits the pre-existing
      `react/jsx-runtime` Node-ESM resolution gap from Task 3.1's regression
      note #2 (confirmed by reproducing the exact `ERR_MODULE_NOT_FOUND` here
      too) - the fixture's own Vite-built bundle has no such gap, since
      Vite/Rollup already resolved it correctly at fixture-build time, the
      same way a real consumer's bundler does.
      `npm run smoke` → `OK: rendered cell text found in DOM:
"Smoke-Test-Cell-Alpha"`, exit 0. Negative-control check (temporarily
      searching for text that was never rendered) correctly exits 1 and
      prints the real rendered text, confirming the assertion is
      discriminating, not vacuously true. `npx eslint` on the new files is
      clean. Recorded at `baseline/fixture-assertions-group4.txt`.

## 5. Editor lazy-loading boundary verification

- [x] 5.1 Verify `fixtures/consumer-json-editor` against the restructured
      package: call `LazyDialJsonEditor()` without triggering any other
      import, run the fixture's production build, and assert via
      `assert-static-graph.mjs` that `@monaco-editor/react`/`monaco-editor`
      are absent from the static initial graph and present only in a
      separately-listed dynamic-chunk entry of the build manifest.
      Verification: assertion script exits 0 for both the static-exclusion
      and dynamic-chunk-presence checks.
      **Done**: rebuilt the package, repacked (830 files), reinstalled
      `fixtures/consumer-json-editor` against the fresh tarball, rebuilt
      (emits a separate `assets/JsonEditor-*.js` dynamic chunk). `npm run
assert` (already wired since Task 1.4 with `--forbidden
ag-grid-community,ag-grid-react,@uiw/react-md-editor,@uiw/react-markdown-preview
--dynamic-require @monaco-editor/react,monaco-editor`) **PASSES**:
      AG Grid/`@uiw/*` absent entirely, Monaco present only in the dynamic
      chunk.
- [x] 5.2 Verify `fixtures/consumer-markdown-editor` the same way for
      `LazyDialMarkdownEditor()`/`LazyMarkdownEditor()` and
      `@uiw/react-md-editor`/`@uiw/react-markdown-preview`.
      Verification: same pass/fail shape as 5.1.
      **Done**: same rebuild/repack/reinstall, rebuilt (emits
      `MarkdownEditor-*.js` + a shared `@uiw/*` dynamic chunk). `npm run
assert` (`--forbidden ag-grid-community,ag-grid-react,@monaco-editor/react,monaco-editor
--dynamic-require @uiw/react-md-editor,@uiw/react-markdown-preview`)
      **PASSES**: AG Grid/Monaco absent entirely, `@uiw/*` present only in
      dynamic chunk(s).
- [x] 5.3 Extend `fixtures/consumer-markdown-editor` with a second scenario
      that renders `DialMarkdownEditorContainer`, then programmatically
      triggers its JSON-mode switch (simulating the `DialSwitch` toggle), and
      re-checks the build/runtime chunk log to confirm the nested
      `import('@/components/JsonEditor/JsonEditor')` (see
      `MarkdownEditorContainer.tsx:89`) only resolves at that point, not
      before.
      Verification: the fixture programmatically clicks the rendered switch;
      its Rollup graph must place Monaco outside both the app's static graph
      and the container's static closure, reachable only after crossing the
      container's own `dynamicImports` edge. The existing component test also
      exercises the toggle and waits for the JSON editor at runtime.
      **Done**: added `LazyDialMarkdownEditorContainer` to the `./editors`
      subpath (without adding an eager root export), rendered it in the
      fixture, and added `--dynamic-after
MarkdownEditorContainer:monaco-editor`. The assertion passes: UIW is
      lazy relative to the app and Monaco is in a separate `JsonEditor` chunk
      reachable from the container only through a second dynamic edge.
- [x] 5.4 Repeat 5.3's nested-load check for
      `SchemaAdditionalPropertiesEditor.tsx:36` via a
      `fixtures/consumer-json-editor` scenario that renders
      `DialSchemaRenderer` with a schema that surfaces an
      "additional properties" JSON editor.
      Verification: same nested dynamic-edge assertion shape as 5.3, scoped
      to this component.
      **Done**: added `consumer-schema-renderer`, which renders
      `DialSchemaRenderer` with an undeclared value key. Its graph contains
      `SchemaAdditionalPropertiesEditor` in the initial feature graph but
      keeps Monaco exclusively in a separate `JsonEditor` dynamic chunk;
      `--dynamic-after SchemaAdditionalPropertiesEditor:monaco-editor`
      passes.

## 6. Styles and packed-artifact integrity

- [x] 6.1 Rebuild `dist/index.css` (`npm run build:css`) after the module
      restructuring and diff its rule set against the Task 1 baseline build.
      Verification: a script compares selectors/rule count between the
      pre-change and post-change `index.css` (e.g. via `postcss` AST rule
      count) and asserts the post-change file's rule set is a superset of
      (or equal to) the pre-change file's — no existing rule removed.
      **Done**: got a true pre-change baseline via `git stash
--include-untracked` (confirmed clean via `git diff --stat HEAD` =
      empty), rebuilt CSS there, `git stash pop`, rebuilt CSS again with
      this change's edits in place. Result: `dist/index.css` is
      **byte-identical** before vs. after (84,658 B both, matches Task
      1.3's baseline). New `tools/compare-css-rules.mjs` (postcss-AST rule
      count, per the task's own suggested method, not just a byte diff)
      confirms independently: 1013/1013 rules, 0 missing. Expected, not
      coincidental: `build:css` content-scans `src/**` for used utility
      classes, and this change never edited any existing `src/**` file
      (only added 3 zero-JSX `src/subpaths/*.ts` barrels). Recorded at
      `baseline/css-comparison-group6.txt`.
- [x] 6.2 If Decision 4's optional per-feature stylesheets (`./core.css`,
      `./grid.css`, `./editors.css`) are implemented in this change, add
      matching `package.json#exports` entries and a fixture check that each
      compiles standalone; otherwise, record in
      `openspec/changes/modularize-package-exports/baseline/dts-spike.md` (or
      a sibling note) that this was evaluated and deferred, per the Open
      Questions in `design.md`.
      Verification: either the new stylesheet fixtures build successfully, or
      the deferral note exists and is referenced from `design.md`'s Open
      Questions (no silent scope drop).
      **Done**: deferred. Recorded rationale at
      `baseline/css-split-deferred.md` and referenced it from `design.md`'s
      Open Questions bullet (marked "Resolved (Task 6.2): deferred
      entirely"). It's optional per Decision 4, no spec scenario requires
      it, and it's a separate piece of CSS-architecture work unrelated to
      this change's tree-shaking goal - not a silent drop, an explicit,
      referenced call.
- [x] 6.3 Run `npm pack --dry-run --json` against the fully restructured
      package and diff against `baseline/pack-files-before.json` (Task 1.2)
      plus the new `package.json#exports` map (Task 3.1).
      Verification: a script asserts every file referenced by
      `package.json#exports` (root + every new subpath, JS/CJS/types/styles)
      is present in the pack file list, and that every chunk any
      consumer-fixture manifest (Tasks 2–5) marks as reachable (static or
      lazy) from a declared entry point is also present in the tarball.
      **Done**: new `tools/verify-pack-contents.mjs` checks (1) every
      `package.json#exports` file present in the pack (14/14 OK), and (2) -
      a strictly stronger guarantee than tracing each fixture's individual
      reachable-chunk set - that the _entire_ local `dist/` build output
      (823 files) is present in the pack, which trivially covers any subset
      of it a fixture's static-or-lazy graph could reach, since a fixture's
      bundler can only ever resolve into a file that exists under `dist/`.
      Both PASS. Diffed against `baseline/pack-files-before.json`: 393 ->
      826 files; the only 10 paths present before and absent after are all
      content-hashed filenames that were always expected to change (old
      monolithic bundle/shared-chunk names, replaced by the ~800 per-module
      files `preserveModules` now emits) - not a regression. Recorded at
      `baseline/pack-verification-group6.txt` and
      `baseline/pack-files-after.json`.
- [x] 6.4 Re-run the export-surface check from Task 3.3 directly against an
      unpacked `npm pack` tarball (not `dist/` in the working tree) to catch
      any `files`/`.npmignore`/`exports` mismatch that a local `dist/` build
      wouldn't reveal.
      Verification:
      `node tools/export-surface.mjs --verify-against-baseline baseline/root-exports.json --from-tarball <tgz-path>`
      exits 0.
      **Done**: added `--from-tarball <tgz-path>` to
      `tools/export-surface.mjs`'s `--verify-against-baseline` mode -
      extracts the tarball (`tar --force-local -xzf ...`; `--force-local`
      because GNU tar otherwise mistakes a `C:\...` drive letter for a
      remote `host:path` spec, and paths are forward-slashed since this
      `tar` treats a Windows backslash as its own escape character) and
      resolves entry/types from _that_ extracted `package.json#exports`
      instead of the local `dist/`. `node tools/export-surface.mjs
--verify-against-baseline baseline/root-exports.json --from-tarball
fixtures/.tarballs/epam-ai-dial-ui-kit-0.0.0.tgz` → exposes every
      baseline export (342), exit 0. Re-ran the pre-existing `--check`/
      `--verify-against-baseline` (no `--from-tarball`) modes too - both
      still pass, confirming the `baseDir`-threading refactor didn't
      regress them. Recorded at `baseline/pack-verification-group6.txt`.

## 7. Package-level full verification

- [x] 7.1 Run the full `ai-dial-ui-kit` verification suite.
      Verification (all must exit 0, run from `C:\dial_projects\ai-dial-ui-kit`):
      `npm run typecheck && npm run lint && npm run test && npm run build`.
      **Done**: all four commands exit 0. The 56 pre-existing type errors in
      `use-trigger-view-create-folder.spec.tsx` were fixed by giving its
      Vitest callbacks their actual `(files: DialFile[]) => void` signatures,
      so this task now meets its stated all-green acceptance criterion.
- [x] 7.2 Run every fixture under `fixtures/` end-to-end against the final
      built/packed artifact (not an intermediate spike build).
      Verification: a single `fixtures/run-all.mjs` (or equivalent npm script)
      installs the final tarball into each fixture, builds each fixture, and
      re-runs every assertion from Tasks 2–6 in one pass, exiting non-zero if
      any fixture regresses.
      **Done**: new `fixtures/run-all.mjs` (`npm run fixtures:run-all`)
      rebuilds + repacks the package once, then for each fixture removes
      its installed `@epam/ai-dial-ui-kit`, reinstalls against the fresh
      tarball, builds, and runs its `assert` script (+ `smoke` where present,
      currently `consumer-esm` and `consumer-grid`). All **7/7 fixtures PASS**
      end-to-end, including the
      new nested-editor and ESM/CJS/TypeScript subpath scenarios. Re-runs
      remove the generated lockfile and installed ui-kit before installing
      the same-version fresh tarball, preventing stale integrity hashes while
      retaining unrelated valid dependencies. The harness invokes npm through
      `process.execPath` + `npm_execpath`, avoiding Windows `.cmd` spawn errors
      and Node's deprecated `shell: true` argument handling. Also, npm pack's
      `--pack-destination <dir>` requires `<dir>` to already exist (fails
      with `ENOENT` opening its own output path otherwise) - `mkdirSync`
      before packing fixes it.
- [x] 7.3 Record final raw/gzip sizes for the restructured root ESM/CJS/CSS
      output plus each new subpath's ESM output, using the same measurement
      method as Task 1.3, into
      `openspec/changes/modularize-package-exports/baseline/sizes-after.json`,
      and compute the delta against `sizes-before.json`.
      Verification: the delta script exits 0 and prints a table; the root ESM
      entry's _reachable-from-a-non-Grid-import_ portion (as measured by the
      `fixtures/consumer-esm` build, not the whole package) shows a
      significant reduction consistent with AG Grid/Monaco/`@uiw/*` no longer
      being in that fixture's static graph (exact numeric budget is set from
      this measurement, not guessed in advance).
      **Done**: sizes recorded to `baseline/sizes-after.json` (9 files:
      root ESM/CJS, CSS, + grid/file-manager/editors ESM+CJS). New
      `tools/diff-sizes.mjs` prints the before/after table - `dist/index.css`
      is the only key present in both (byte-identical, 0.0% delta,
      corroborating Task 6.1); every other "before" key was renamed/removed
      and every "after" key is new, which is expected (this restructuring's
      entire point). The number that actually matters per this task's own
      wording - `fixtures/consumer-esm`'s built size - dropped from
      2,515.59 kB/559.32 kB gzip to **768.76 kB/141.93 kB gzip
      (-69.4% raw, -74.6% gzip)**, reconfirmed unchanged in this session's
      final `fixtures:run-all` run. Recorded at
      `baseline/sizes-delta-group7.txt`.

## 8. Consumer validation in `ai-dial-chat` (temporary, reversible)

- [x] 8.1 In a scratch/local checkout step (not committed to `ai-dial-chat`),
      install the packed tarball from Task 6.3/7.2 in place of the current
      `@epam/ai-dial-ui-kit` dependency, and temporarily remove the
      `if (id.includes('@epam/ai-dial-ui-kit')) return 'ui-kit';` line from
      `apps/chat/vite.config.mts` (around line 158) — do not replace it with
      filename exclusions, per the design constraint.
      Verification: the edit is captured as a local diff/patch file saved
      under this change's `baseline/` directory (e.g.
      `baseline/ai-dial-chat-temp.patch`), not committed to `ai-dial-chat`,
      so it can be applied and reverted mechanically
      (`git apply`/`git apply -R`).
      **Done**: installed the final tarball via `npm install
"@epam/ai-dial-ui-kit@file:../ai-dial-ui-kit/fixtures/.tarballs/epam-ai-dial-ui-kit-0.0.0.tgz"
--legacy-peer-deps` (`--legacy-peer-deps` needed only because the
      tarball's placeholder `"version": "0.0.0"` fails a workspace lib's
      `peerDependencies` semver range - not a real incompatibility), removed
      the manual `ui-kit` chunk line (now at line 222, the file has grown
      since the task was written), and temporarily wired in
      `fixtures/shared/graph-report-plugin.mjs` for Task 8.3's chunk
      metadata. The final saved patch contains only those two intended files
      (`vite.config.mts` and `package.json`), excludes unrelated worktree and
      lockfile churn, and passes `git apply --check`; `npm install
--legacy-peer-deps` regenerates the temporary lockfile after applying.
- [ ] 8.2 Build `ai-dial-chat` with the temporary edit applied.
      Verification: `npm exec nx build @epam/chat -- --skipNxCache` exits 0
      from `C:\dial_projects\ai-dial-chat`.
      **BLOCKED - fails, root-caused, not fixable within this task's scope**:
      fails with `Rolldown failed to resolve import "@floating-ui/react"
from ".../ai-dial-ui-kit/dist/components/Tooltip/TooltipTrigger.js"`.
      A/B-tested with 3 builds (old-package+chunk-present = succeeds
      [today's real state]; new-tarball+chunk-removed = fails;
      old-package+chunk-removed = fails identically) to isolate the cause:
      it is caused **solely** by removing the manual `ui-kit` chunk, and
      reproduces identically with the unmodified, currently-published
      package - nothing to do with this change's restructuring.
      `@floating-ui/react` is an `ai-dial-ui-kit` peer dependency (predates
      this change) that `ai-dial-chat` has never installed; the manual
      chunk happens to mask this pre-existing gap. Full writeup at
      `baseline/ai-dial-chat-group8-finding.md`. Fixing it would mean
      adding a new permanent dependency to `ai-dial-chat` itself - out of
      scope for a temporary/reversible probe, and out of scope for this
      `ai-dial-ui-kit`-side change per design.md's Non-Goal ("Deciding
      `ai-dial-chat`'s own manual-chunk strategy going forward").
- [ ] 8.3 Compare `ai-dial-chat`'s full static initial graph and chunk sizes
      before (manual `ui-kit` chunk, current published `ai-dial-ui-kit`) and
      after (no manual chunk, restructured `ai-dial-ui-kit`), and check for
      the forbidden AG Grid/Monaco/`@uiw/*` markers in chunks that do not
      correspond to a route/component actually using Grid/FileManager/editors.
      Verification: `fixtures/shared/assert-static-graph.mjs` (reused, pointed
      at the Nx build's own manifest/stats output) records raw/gzip deltas
      per chunk into
      `openspec/changes/modularize-package-exports/baseline/ai-dial-chat-delta.json`,
      and exits 0 only if no non-Grid/FileManager/editor route's initial chunk
      contains a forbidden marker.
      **BLOCKED**: cannot run - depends on 8.2's build succeeding, which it
      does not (see 8.2).
- [x] 8.4 Revert the temporary `ai-dial-chat` edit and dependency install from
      8.1 completely.
      Verification: `git status` in `C:\dial_projects\ai-dial-chat` shows no
      residual changes from this task (`git apply -R` on the saved patch,
      plus reinstalling the previously-locked `@epam/ai-dial-ui-kit` version),
      confirmed by `git diff --stat` reporting empty for
      `apps/chat/vite.config.mts` and `package.json`/`package-lock.json`.
      **Done**: fully reverted and verified. Final state contains only the
      pre-existing unrelated changes in that repository; the regenerated
      scoped patch no longer captures any of them. `package-lock.json` is
      byte-identical to `HEAD`, and the installed UI kit is restored to
      `0.14.0-dev.15`. Full writeup is in
      `baseline/ai-dial-chat-group8-finding.md`.

## 9. Change validation

- [x] 9.1 Validate the OpenSpec change artifacts.
      Verification:
      `openspec validate modularize-package-exports --type change --strict --no-interactive`
      exits 0 from `C:\dial_projects\ai-dial-ui-kit`.
      **Done**: `openspec validate modularize-package-exports --type change
--strict --no-interactive` → "Change 'modularize-package-exports' is
      valid." This validates artifact structure, not task completion. Tasks
      8.2/8.3 remain blocked by the documented, pre-existing `ai-dial-chat`
      dependency gap; all in-repository implementation tasks are complete.
