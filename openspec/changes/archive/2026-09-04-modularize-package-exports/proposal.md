## Why

`@epam/ai-dial-ui-kit` ships one ESM/CJS bundle built from a single `src/index.ts`
barrel (`vite.config.ts:22-27`). That barrel statically re-exports both Grid
generations and `DialFileManager` (`src/index.ts:57-69`, `src/index.ts:149-157`,
`src/index.ts:427-449`), and both `Grid.tsx` files call
`ModuleRegistry.registerModules([AllCommunityModule])` at module scope
(`src/components/Grid/Grid.tsx:16,85`, `src/components/New/Grid/Grid.tsx:15,56`).
`ag-grid-community`/`ag-grid-react` are plain `dependencies`
(`package.json:79-81`) and are not in `vite.config.ts`'s `rollupOptions.external`
list (`vite.config.ts:29-33`, which externalizes only `monaco-editor`,
`@monaco-editor/react`, and `peerDependencies`), so AG Grid is bundled into the
published root entry and is unavoidably pulled into any ESM consumer's initial
module graph the moment it imports anything from the package root — including a
consumer that only wants `Button`. The downstream effect is already visible: in
`ai-dial-chat`, `apps/chat/vite.config.mts:154-160` buckets **every**
`@epam/ai-dial-ui-kit` module into one `ui-kit` manual chunk with no
JsonEditor/MarkdownEditor exclusions, and that chunk is reported at roughly
2.8 MiB raw with AG Grid markers present — evidence to reproduce and shrink, not
an exact permanent budget.

The Monaco- and `@uiw/react-md-editor`-based editors are already better
isolated: they are peer dependencies (`package.json:88-98`), externalized in
`vite.config.ts:29-33`, and reached only through the lazy loaders
`LazyDialJsonEditor` / `LazyDialMarkdownEditor` / `LazyMarkdownEditor`
(`src/index.ts:266-272`, `src/index.ts:326-328`) plus the nested dynamic
`import('@/components/JsonEditor/JsonEditor')` inside
`MarkdownEditorContainer.tsx:89` and
`SchemaAdditionalPropertiesEditor.tsx:36`. That existing laziness must be
preserved exactly, not redesigned, while the Grid/FileManager path is fixed.

## What Changes

- Restructure the emitted ESM build so importing a basic component (e.g.
  `Button`) from the existing root `@epam/ai-dial-ui-kit` entry no longer pulls
  `ag-grid-community`, `ag-grid-react`, or either Grid/FileManager
  implementation into the consumer's static initial module graph — without
  requiring any import-path migration.
- Isolate both Grid generations (`src/components/Grid/Grid.tsx`,
  `src/components/New/Grid/Grid.tsx`) and every FileManager path that reaches
  AG Grid (`src/components/FileManager/FileManager.tsx:46` imports `DialGrid`
  statically) into their own feature-scoped module graph, reachable only when a
  Grid/FileManager export is actually imported.
- Decide and document whether `ag-grid-community`/`ag-grid-react` stay bundled
  `dependencies` (proven reachable only from Grid/FileManager graphs) or move to
  `peerDependencies` alongside Monaco and `@uiw/*` (a compatibility/release
  decision, not a free optimization) — resolved in `design.md`, not assumed here.
- Preserve the existing `LazyDialJsonEditor` / `LazyDialMarkdownEditor` /
  `LazyMarkdownEditor` dynamic-import boundaries and the nested Monaco load in
  `MarkdownEditorContainer` / `SchemaAdditionalPropertiesEditor` exactly as they
  are today, under both ESM and CJS output.
- Keep the full existing root export surface (every current value/type export in
  `src/index.ts`) compiling and resolving unchanged for both `import` and
  `require()`. **Not BREAKING**: this change is additive/internal-restructuring
  only from a consumer's point of view; no existing import path, prop, or
  behavior changes.
- Audit and, where needed, correct `package.json#sideEffects`
  (`package.json:33-39`) so it matches the new emitted-file layout rather than
  the current source-oriented globs, and so AG Grid's module-scope
  `registerModules` call is not treated as reachable outside a Grid/FileManager
  import.
- Keep `./styles.css` backward-compatible as the single aggregate stylesheet
  built from `src/styles/tailwind-entry.scss` (`tailwind-entry.scss:1-15`,
  includes `ag-grid.scss`, `grid.scss`, `markdown-editor.scss`). Any additional
  per-feature stylesheet entries are additive only; existing consumers are not
  required to change their stylesheet import.
- Add a consumer-fixture test harness (installs the packed tarball, not source
  aliases) that asserts, from bundler metadata, which packages appear in each
  fixture's static initial graph — this becomes the durable regression gate for
  the tree-shaking claim.
- Add automated root export/type parity checking so a hand-maintained module
  split cannot silently drop or rename a public symbol.

## Capabilities

### New Capabilities

- `package-distribution`: the contract for how `@epam/ai-dial-ui-kit` is built
  and published — emitted ESM/CJS/type/style layout, which features are
  reachable from the root import vs. gated behind a feature import or existing
  lazy loader, and the packed-artifact/export-parity guarantees consumers can
  rely on.

### Modified Capabilities

- None — no `openspec/specs/` exist yet in this repository; this is the first
  capability defined here.

## Impact

- **Affected code (this repo only)**: `vite.config.ts`, `package.json`
  (`exports`, `sideEffects`, `dependencies`/`peerDependencies`), `src/index.ts`
  and any module split it requires, `tsconfig.json` (declaration output layout
  if it changes), `src/styles/tailwind-entry.scss` (only if additive per-feature
  stylesheets are introduced), and new test fixtures under a consumer-fixture
  harness (path to be fixed in `design.md`).
- **Not affected in this change**: `ai-dial-chat` source is not modified as part
  of this planning change or its implementation tasks; only a temporary,
  reversible local edit (removing the `ui-kit` manual chunk) is used during
  verification to measure the consumer-side effect, then reverted.
- **Dependencies**: `ag-grid-community` / `ag-grid-react` classification
  (bundled dependency vs. peer dependency) is an open decision resolved in
  `design.md`; `@monaco-editor/react`, `monaco-editor`, `@uiw/react-md-editor`,
  `@uiw/react-markdown-preview` remain peer dependencies, unchanged.
- **Compatibility / release impact**: targeted as non-breaking (no minor-version
  forced migration) for the root CJS/ESM import surface. If the peer-dependency
  option is selected for AG Grid, that is itself a breaking change for any
  consumer that does not already install AG Grid, and must be called out with
  its own migration note and version bump per this repo's breaking-change
  process (`AGENTS.md` breaking-change section) rather than folded silently into
  this change.
- **Rollback**: the build/export restructuring is confined to `vite.config.ts`,
  `package.json`, and the module layout under `src/`; reverting those files (or
  the merge commit that lands them) restores today's single-bundle behavior
  with no data or consumer-state migration involved.
