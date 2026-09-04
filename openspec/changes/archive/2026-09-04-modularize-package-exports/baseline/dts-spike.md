# Task 2.1 spike results: `vite-plugin-dts` + `preserveModules`

## Finding: declaration emission was already per-module, independent of JS bundling

Before any change, `vite-plugin-dts` (invoked via `dts({ exclude: [...] })` in
`vite.config.ts`) already emitted one `.d.ts` file per source module under
`dist/src/**`, mirroring `src/**` 1:1 (360 `.d.ts` files, matching `tsconfig.json`'s
`declarationDir: "dist/types"`-style per-file emission behavior — verified via
`find dist/src -name "*.d.ts" | wc -l` → 360, vs. only 2 JS bundle files
(`dial-ui-kit.es.js`, `dial-ui-kit.cjs.js`) pre-change). This was true even
though the JS output was a single 2.4 MB bundle. **The risk flagged in
design.md ("preserveModules emits far more files, which can break declaration
bundling") did not materialize**, because `.d.ts` generation was never coupled
to the JS chunking strategy in the first place — `vite-plugin-dts` walks the
TypeScript program's module graph directly, not the Rollup JS bundle graph.

## Chosen emission mode

Enabled `preserveModules: true` + `preserveModulesRoot: 'src'` +
`entryFileNames: '[name].js'` on the **ES** output only, via
`rollupOptions.output` as a 2-element array (one config per format — required
by Vite/Rollup once a custom `output` accompanies `build.lib.formats.length >
1`). The **CJS** output config in the same array omits `preserveModules` and
keeps a fixed `entryFileNames: 'dial-ui-kit.cjs.js'`, producing a single
bundle exactly as before (per design.md Decision 1 — CJS `require()` is a
resolution/compatibility guarantee only, never a tree-shaking one).

`build.lib.fileName` was removed (it conflicted with the per-format
`entryFileNames` now driving both outputs).

## Build result

`npm run build` (`vite build && build:css && build:manifest && build:mcp`)
succeeded. Root ESM entry moved from `dist/dial-ui-kit.es.js` (a thin
re-export of one 2.4 MB shared chunk) to `dist/index.js` (21.04 kB, a
preserveModules root that re-exports ~360 individual per-module files, e.g.
`dist/components/Grid/Grid.js` 10.20 kB, with `ag-grid-community`/
`ag-grid-react` now emitted as their own separate files under
`dist/node_modules/ag-grid-community/...` (1,485.35 kB) /
`dist/node_modules/ag-grid-react/...` (70.47 kB) — reachable only through
`Grid.js`'s own import, not from the root barrel). CJS output unchanged in
shape: `dist/dial-ui-kit.cjs.js` (10.34 kB) + one shared `index-*.cjs` bundle.

`package.json#exports['.'].import` updated from `./dist/dial-ui-kit.es.js` to
`./dist/index.js`; `.types` (`./dist/src/index.d.ts`) and `.require`
(`./dist/dial-ui-kit.cjs.js`) unchanged.

## Consumer-fixture proof (Task 2.3)

Re-packed the tarball and rebuilt `fixtures/consumer-esm` (imports only
`Button`) against it:

- Fixture build output dropped from 2,515.59 kB / gzip 559.32 kB (one shared
  chunk containing everything) to **769.62 kB / gzip 142.20 kB** (one chunk,
  still large because Vite/Rollup's default tree-shaking through this
  package's many intermediate re-export barrels does not reach a minimal
  per-component size — no numeric budget was promised for this slice, only
  exclusion of the forbidden packages).
- `assert-static-graph.mjs --forbidden ag-grid-community,ag-grid-react,@monaco-editor/react,monaco-editor,@uiw/react-md-editor,@uiw/react-markdown-preview`
  → **PASS** (all six absent from the static initial graph). This was a
  **FAIL** against the pre-restructuring tarball (see
  `baseline/fixture-assertions-before.txt`) - the mandatory root ESM fixture
  requirement (`specs/package-distribution/spec.md` "Root ESM entry is
  tree-shakeable...") is now met.

## Resolved open question

design.md's open question "whether `vite-plugin-dts`'s per-module emission
needs a pinned version bump to support `preserveModules` cleanly" is
resolved: **no version bump was needed** (`vite-plugin-dts@^4.5.4`, already
installed, worked unchanged) - because, as above, its emission was already
module-granular and independent of the JS bundler's chunking strategy.
