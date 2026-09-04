## Context

### Measured baseline (cited, not assumed)

- **Single entry, two formats.** `vite.config.ts:22-27` builds only
  `./src/index.ts`, emitting `dial-ui-kit.es.js` and `dial-ui-kit.cjs.js`.
  `package.json:16-26` exposes only `.` and `./styles.css` in `exports`.
- **Grid is statically re-exported from root and self-registers at module
  scope.** `src/index.ts:57-69` (legacy `DialGrid` + renderers),
  `src/index.ts:427-449` (2.0 `Grid`). Both implementations call
  `ModuleRegistry.registerModules([AllCommunityModule])` at module top level:
  `src/components/Grid/Grid.tsx:1-16,85` and
  `src/components/New/Grid/Grid.tsx:1-15,56`.
- **FileManager reaches the legacy Grid via a static import, not lazily.**
  `src/components/FileManager/FileManager.tsx:46`:
  `import { DialGrid, type DialGridProps } from '@/components/Grid/Grid';`.
  `src/index.ts:149-157` re-exports `DialFileManager` from root.
- **AG Grid is a bundled dependency, not externalized.** `package.json:79-81`
  lists `ag-grid-community`/`ag-grid-react` under `dependencies`.
  `vite.config.ts:29-33`'s `rollupOptions.external` only lists
  `'monaco-editor'`, `'@monaco-editor/react'`, and
  `Object.keys(peerDependencies)` — AG Grid is not in `peerDependencies`
  (`package.json:88-98`), so today's `dial-ui-kit.es.js`/`.cjs.js` contain AG
  Grid's runtime code. No other repo file imports `ag-grid-community`/
  `ag-grid-react` outside `Grid/Grid.tsx`, `New/Grid/Grid.tsx`, and their
  renderer/comparator/constant helpers (`grep` over `src/` for
  `from 'ag-grid` matched only Grid-tree and Grid-tree-test files).
- **Editors are already peer-dependency + lazy-loader isolated; preserve as
  reference pattern.** `@monaco-editor/react`, `monaco-editor`,
  `@uiw/react-md-editor`, `@uiw/react-markdown-preview` are `peerDependencies`
  (`package.json:88-98`) and externalized (`vite.config.ts:29-33`). Root only
  exposes them behind loader functions: `LazyDialJsonEditor` /
  `LazyDialMarkdownEditor` (`src/index.ts:266-272`) and `LazyMarkdownEditor`
  (2.0) (`src/index.ts:326-328`). `DialJsonEditor.tsx:5-6` is the only direct
  `@monaco-editor/react`/`monaco-editor` importer.
  `MarkdownEditor.tsx` (legacy) and `New/MarkdownEditor/MarkdownEditor.tsx:2`
  import `@uiw/react-md-editor` directly; neither imports Monaco.
  `MarkdownEditorContainer.tsx:89` and
  `SchemaAdditionalPropertiesEditor.tsx:36` each do a **nested** dynamic
  `import('@/components/JsonEditor/JsonEditor')` so JSON mode's Monaco load
  stays lazy even inside an already-lazy Markdown container / schema editor.
  These four boundaries are the reference for how Grid/FileManager isolation
  should behave, and none of them may regress.
- **`sideEffects` is source-path-shaped, not emitted-file-shaped.**
  `package.json:33-39`:
  `["*.css", "*.scss", "./src/styles/*", "./src/components/JsonEditor/*", "./src/components/MarkdownEditor/*"]`.
  These globs describe `src/`, but the published package only ships `dist/`
  (`package.json:30-32` `files: ["dist"]`) — none of these globs match
  anything under `dist/`, and neither Grid file nor `New/MarkdownEditor` is
  covered by a matching entry today. This is audited as its own risk below,
  not fixed opportunistically as a side effect of the module split.
- **Styles are one aggregate file that already contains Grid CSS.**
  `src/styles/tailwind-entry.scss:1-15` imports `ag-grid.scss`, `grid.scss`,
  and `markdown-editor.scss` unconditionally into the one build step
  (`package.json:43`: `build:css` → `dist/index.css`, the sole `./styles.css`
  export target).
- **Consumer-side symptom already exists.** `apps/chat/vite.config.mts:154-160`
  assigns every module whose id includes `@epam/ai-dial-ui-kit` to a single
  `ui-kit` manual chunk, with no per-feature (JsonEditor/MarkdownEditor/Grid)
  exclusion. Reported baseline: ~2.8 MiB raw for that chunk, with AG Grid
  markers present. This is evidence of the mechanism (root graph carries AG
  Grid unconditionally), not a permanent target number — the actual
  before/after budget is established from a freshly recorded measurement in
  Task 1, not from this narrative figure.
- **No `openspec/` existed in this repo before this change** (`openspec init
--tools none` was run to bootstrap it as planning infrastructure only).

### Constraints

- `AGENTS.md`'s "No breaking changes to existing UI components" rule and this
  change's own non-goal both rule out renaming/removing exports or forcing
  import-path migration for the root entry.
- `ai-dial-chat`'s library-isolation rules are out of scope for this repo, but
  the consumer-validation task (Task in the final tasks phase) touches
  `apps/chat/vite.config.mts` only as a temporary, reversible local edit —
  never a permanent change landed from this repo's change.
- Windows dev environment (`win32`, PowerShell primary) — verification commands
  must work from `C:\dial_projects\ai-dial-ui-kit` without POSIX-only syntax
  where `tasks.md` gives literal commands.

## Goals / Non-Goals

**Goals:**

- Make the existing root ESM entry tree-shakeable: a static `import { Button }
from '@epam/ai-dial-ui-kit'` pulls no AG Grid, Monaco, or `@uiw/*` code into
  the consumer's initial graph.
- Isolate both Grid generations and every FileManager path that reaches AG Grid
  into their own reachable-on-demand module graph.
- Preserve, byte-for-byte in _behavior_ (not necessarily in emitted chunk
  identity), the existing four lazy-loader boundaries for JSON/Markdown
  editors.
- Keep the complete existing root export surface compiling and resolving,
  unchanged, under both `import` and `require()`.
- Keep `./styles.css` as a working aggregate stylesheet for every existing
  consumer without a required import change.
- Produce automated, repeatable evidence (bundler metadata + packed-tarball
  inspection) for every claim above, so this is a regression-tested contract,
  not a one-time manual check.

**Non-Goals:**

- Component redesigns, prop renames, or removal of any current export.
- Forcing any consumer (including `ai-dial-chat`) to migrate to a new subpath.
- Deciding `ai-dial-chat`'s own manual-chunk strategy going forward — this
  change only proves the packed artifact supports removing the blanket
  `ui-kit` chunk; it does not land that removal permanently.
- Claiming CJS `require()` becomes tree-shakeable — CJS is resolution/lazy-chunk
  compatibility only.
- Any dependency major-version bump unrelated to the peer/bundled
  classification decision below.
- Redesigning the JSON/Markdown lazy-loader mechanism itself (dynamic
  `import()` + `useState`/`useEffect`) — it is preserved as-is.

## Decisions

### Decision 1 — Module-preserving ESM output over a single bundled entry

**Chosen: `preserveModules`-equivalent ESM build** (Rollup's
`output.preserveModules: true` via Vite's `build.rollupOptions.output`, keeping
`build.lib` for the CJS side, or an explicit multi-entry `rollupOptions.input`
map that mirrors the source module graph closely enough that a bundler doing
real tree shaking drops unreached modules).

Rationale: with a single bundled `dial-ui-kit.es.js`, Rollup's tree shaking
operates on symbols inside one file, but AG Grid's module-scope
`registerModules(...)` calls are **side effects** — Rollup/Terser cannot prove
they're safe to drop even if `DialGrid` itself is unreferenced, because nothing
tells the bundler that call is scoped to Grid usage. The only way to make a
_consumer's_ bundler exclude that code is for the exclusion boundary to already
exist as a separate emitted module/chunk that the consumer's own static import
graph does not reach. `preserveModules` gets there by keeping the emitted ESM
layout isomorphic to source — each component/module becomes its own file, so a
consumer bundler doing standard ESM tree shaking (Vite/Rollup/webpack/esbuild)
naturally does not include a file whose only importers are unreached.

Comparison against the two other required alternatives:

|                                                 | `preserveModules`                                                                                                           | Curated multi-entry (`./core`, `./grid`, `./file-manager`, `./editors` + `.`)                                                                                                                            | Component-level subpaths                                                                                  |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Fixes root ESM tree shaking (mandatory fixture) | Yes — root `.` import resolves through a barrel of per-module files; unreached files drop naturally                         | **No, by itself** — root `.` still needs to be one of the new entries or continue re-exporting everything eagerly; the prompt explicitly disallows treating new subpaths as a substitute for fixing root | Same gap as multi-entry: subpaths help opt-in consumers, but do nothing for the existing root import path |
| Root-import compatibility                       | Full — same specifier, same names                                                                                           | Full for existing names, but doesn't by itself change root behavior (see above)                                                                                                                          | Full, but no help for existing root import                                                                |
| CJS behavior                                    | `build.lib` CJS output stays a single bundle (CJS doesn't tree-shake in consumers regardless); unaffected                   | Same                                                                                                                                                                                                     | Same                                                                                                      |
| Declaration generation                          | `vite-plugin-dts` supports per-file `.d.ts` emission; more output files to keep in sync with `package.json#exports`/`types` | Simpler: a handful of new `.d.ts` roots                                                                                                                                                                  | Most files, most maintenance                                                                              |
| Dynamic imports (JSON/Markdown editors)         | Preserved unchanged — `LazyDialJsonEditor`/etc. keep working as dynamic imports of the same (now per-file) modules          | Preserved unchanged                                                                                                                                                                                      | Preserved unchanged                                                                                       |
| CSS delivery                                    | Unaffected — CSS build step is independent of JS module layout                                                              | Unaffected                                                                                                                                                                                               | Unaffected                                                                                                |
| Maintenance cost                                | Medium: mostly build-config, existing per-component file layout already matches `preserveModules` output shape closely      | Medium-high: a second, hand-curated grouping to keep in sync with `src/index.ts`                                                                                                                         | High: ~90+ export names each needing a deliberate subpath decision                                        |
| Publishing layout / `npm pack`                  | More files in `dist/`, but each traceable 1:1 to a source module                                                            | Fewer new top-level dirs                                                                                                                                                                                 | Many new top-level dirs, larger `exports` map                                                             |
| Migration for consumers                         | None required                                                                                                               | None required for root; optional adoption of new subpaths                                                                                                                                                | None required for root; optional adoption                                                                 |
| Rollback                                        | Revert `vite.config.ts`/`package.json` only                                                                                 | Same                                                                                                                                                                                                     | Same                                                                                                      |

Decision: use `preserveModules`-style output to fix the mandatory root fixture,
and _additionally_ introduce a small curated `./grid`, `./file-manager`
(re-exporting `./grid`'s pieces plus FileManager), and `./editors` export map
for ergonomics/stronger feature boundaries — **not** as a substitute for the
root fix, exactly as the proposal requires. Component-level subpaths are
rejected as unnecessary given `preserveModules` already makes the root
tree-shakeable; adding ~90 individual subpaths would be pure maintenance cost
with no tree-shaking benefit the module-preserving root doesn't already
provide.

### Decision 2 — AG Grid stays a bundled `dependency`, proven reachable only from Grid/FileManager graphs

Alternative considered: move `ag-grid-community`/`ag-grid-react` to
`peerDependencies`, mirroring Monaco/`@uiw/*`.

Chosen: **keep them bundled dependencies**, reachable only through the
isolated Grid/FileManager module subgraph after Decision 1's restructuring.
Rationale:

- Moving to peers is a breaking change for every current consumer that does
  not already install AG Grid directly — it forces an install-time action even
  for consumers who use Grid/FileManager today, where today it "just works."
  Monaco/`@uiw/*` were peers already (pre-existing contract); this change does
  not get to silently extend that pattern to a second dependency family under
  a "tree-shaking" banner. The proposal's non-goal ("removal/renaming of public
  exports, mandatory consumer migration") and this repo's breaking-change
  process both treat that shift as requiring a minor version bump + migration
  guide, not a side effect of solving the isolation problem.
- Once Decision 1 puts AG Grid's module registration and both `Grid.tsx` files
  behind an emitted module boundary only the Grid/FileManager entry points
  reach, "bundled dependency" and "peer dependency" become equivalent for the
  _tree-shaking_ goal — a consumer who never imports Grid/FileManager never
  evaluates that boundary either way. The only remaining argument for peers
  (shrinking the _published package's own_ install size / letting consumers
  pin their own AG Grid version) is a separate, optional future decision, not
  required to hit this change's acceptance criteria.
- This is recorded as a **decision**, not deferred: bundled stays the default;
  peer-promotion is documented as a rejected-for-now alternative with its own
  trigger condition (see Open Questions) rather than left ambiguous.

### Decision 3 — `sideEffects` matches shipped CSS; feature JS remains tree-shakeable

Current globs (`package.json:33-39`) describe `src/`, which the package never
ships. Decision: replace them with the emitted-file-shaped
`["dist/**/*.css"]`. No JS path is listed deliberately. Marking either Grid
module as globally side-effectful would make a consumer bundler retain it
through the root barrel even when the consumer imports only `Button`, defeating
the primary requirement. The Grid registration call remains in the same module
as the consumed Grid component, so it is retained whenever Grid/FileManager is
actually reached and the whole module is discarded only when that feature is
unused. The consumer-grid runtime smoke test verifies the registration by
rendering real row data; the root fixture independently verifies that the same
module is absent for a non-Grid import.

### Decision 4 — Styles stay one aggregate `./styles.css`; additive per-feature CSS is optional, not required

`tailwind-entry.scss` keeps building the single aggregate `dist/index.css`
consumers already import. Optional additive entries (`./core.css`,
`./grid.css`, `./editors.css`) may be introduced from split SCSS partials for
consumers that want to shed Grid/editor CSS too, but：

- the aggregate `./styles.css` must keep shipping every rule it ships today
  (no CSS removed from it), and
- this change does not claim "CSS is excluded" anywhere unless a consumer
  actually switches to a narrower stylesheet entry — code-splitting the JS
  graph is not conflated with CSS delivery in any acceptance criterion.

### Decision 5 — Automated export/type parity gate, not manual review

A `preserveModules` restructuring risks a symbol quietly moving file or being
dropped from the root barrel during the split. Decision: add a script/test
that (a) parses the current `src/index.ts` export list as the source-of-truth
baseline (captured once, in Task 1, before any module-layout change) and (b)
after the restructuring, asserts the built `.d.ts`/ESM/CJS entries still export
every one of those names with the same kind (value vs. type). This runs in CI
alongside `typecheck`/`lint`/`test`/`build`, not as a one-off manual diff.

### Decision 6 — Consumer-fixture harness drives the tree-shaking proof

Local `npm run build` output alone cannot prove a _consumer's_ bundler
excludes AG Grid — that depends on `package.json#exports`/`sideEffects`/module
shape as resolved through node/bundler resolution rules, which only a real
install-and-bundle of the packed tarball exercises faithfully. Decision: build
a minimal fixture workspace (e.g. `fixtures/consumer-esm/`,
`fixtures/consumer-grid/`, `fixtures/consumer-json-editor/`,
`fixtures/consumer-markdown-editor/`, plus a `./core` fixture if that subpath
is introduced) that:

1. Installs the actual `npm pack` tarball (not a path/workspace alias to
   `src/`),
2. Runs each fixture's own bundler (Vite, matching how real consumers build)
   in production mode,
3. Reads that bundler's build metadata/manifest to enumerate the complete
   static initial graph and separately the dynamic-chunk graph,
4. Asserts forbidden markers are absent from the static graph
   (`ag-grid-community`, `ag-grid-react`, `@monaco-editor/react`,
   `monaco-editor`, `@uiw/react-md-editor`, `@uiw/react-markdown-preview`) using
   both the bundler's own module-id metadata (primary signal) and a stable
   string/identifier grep as a second signal — never only a filename check
   (hashed chunk names are not a stable identity signal on their own).

## Risks / Trade-offs

- **[Risk] `preserveModules` emits far more files, which can break declaration
  bundling or the `types`/`exports` map if `vite-plugin-dts` doesn't cleanly
  emit per-module `.d.ts` alongside per-module `.js`.**
  → Mitigation: Task-level spike in `tasks.md` verifies `vite-plugin-dts`
  output shape before the full module split is attempted; if declaration
  emission doesn't cleanly follow `preserveModules`, fall back to a hybrid
  (module-preserving JS + a single rolled-up `.d.ts` entry, which is a common,
  supported `vite-plugin-dts` mode) rather than abandoning the approach.
- **[Risk] AG Grid's `ModuleRegistry.registerModules([AllCommunityModule])` is
  a required runtime side effect exactly when Grid is used.**
  → Mitigation: Decision 3 keeps the call colocated with the consumed Grid
  export and does not annotate that module as globally side-effectful (which
  would defeat root tree shaking). The task-level runtime fixture asserts that
  `registerModules` actually runs by rendering a real AG Grid row, not merely
  by checking that its dependency is present.
- **[Risk] Moving AG Grid to peers later (if the Open Question below resolves
  that way) is a breaking change that could get bundled into a later
  patch/minor release without following the breaking-change process.**
  → Mitigation: Decision 2 is recorded now as "stay bundled"; any future
  reversal must go through `AGENTS.md`'s breaking-change steps (CHANGELOG +
  migration guide) explicitly, not as a side effect of an unrelated change.
- **[Risk] A curated `./grid`/`./file-manager`/`./editors` export map drifts
  from `src/index.ts` over time (a new Grid export added to root but forgotten
  in `./grid`).**
  → Mitigation: Decision 5's export-parity check is run against every declared
  entry point, not only the root, so a subpath missing a symbol the root has
  fails the same gate.
- **[Risk] The consumer-fixture harness (Decision 6) is new infrastructure with
  its own maintenance cost and can go stale if fixture dependency versions
  drift from the real `peerDependencies` range.**
  → Mitigation: fixtures pin to the same peer version ranges declared in
  `package.json#peerDependencies`; a `tasks.md` step runs the fixtures as part
  of the same CI job as `typecheck`/`lint`/`test`/`build` so drift is caught
  immediately, not discovered later.
- **[Trade-off] `preserveModules` output is less optimized than a single
  minified bundle (more small files, less cross-module minification) — this is
  accepted because the goal is consumer-side tree shaking, not this package's
  own smallest possible artifact size.**

## Migration Plan

1. Land the build/export/`sideEffects` restructuring and the new fixtures in
   one PR to `ai-dial-ui-kit`'s `development` branch, gated on
   `typecheck`/`lint`/`test`/`build` plus the new fixture suite (see
   `tasks.md`).
2. Publish under the existing pre-1.0 versioning scheme used by this package
   (`package.json:3` `version: "0.0.0"`, driven by `CHANGELOG.md` + git tags per
   `AGENTS.md`) — this change qualifies as a normal (non-breaking) minor bump
   per that process, since no export/prop/behavior changes.
3. Consumers (including `ai-dial-chat`) update to the new version through their
   normal dependency-bump flow; no code change is required. `ai-dial-chat`'s
   own `apps/chat/vite.config.mts` manual-chunk rule is validated (temporarily,
   reversibly) in this change's own tasks to confirm the packed artifact
   supports removing it, but the removal itself is left to a follow-up change
   in `ai-dial-chat` if the maintainers choose to act on the measurement.
4. **Rollback**: revert the `ai-dial-ui-kit` release (git revert of the
   landing commit/tag) — no data migration, no consumer-visible state, since
   the change is confined to build/export configuration and internal module
   layout.

## Open Questions

- Should AG Grid eventually move to `peerDependencies` once this change proves
  it's reachable only from Grid/FileManager graphs? Decision 2 says "not in
  this change" — the trigger for revisiting would be a concrete ask to shrink
  `ai-dial-ui-kit`'s own installed size for Grid-using consumers, tracked as a
  separate future proposal, not resolved here.
- Exact new export-map entry names (`./grid` vs. `./Grid`, `./file-manager` vs.
  `./FileManager`) — proposed as lower-kebab (`./grid`, `./file-manager`,
  `./editors`) for consistency with the existing `./styles.css` naming, to be
  confirmed against any existing consumer convention discovered during Task 1
  of `tasks.md` (baseline audit) before the export map is finalized.
- Whether `vite-plugin-dts`'s per-module emission (Decision 1) needs a pinned
  version bump to support `preserveModules` cleanly — flagged for the spike
  task in `tasks.md`; unresolved until that spike runs.
- Whether the optional `./core.css`/`./grid.css`/`./editors.css` split
  (Decision 4) is worth doing in this change or deferred entirely — left as an
  implementation-time call in `tasks.md`, gated on whether splitting
  `tailwind-entry.scss` partials is low-risk once the JS split is proven out.
  **Resolved (Task 6.2): deferred entirely.** It's optional by Decision 4, no
  spec scenario requires it, and it's a distinct piece of CSS-architecture
  work unrelated to this change's tree-shaking goal. See
  `baseline/css-split-deferred.md` for the full rationale.
