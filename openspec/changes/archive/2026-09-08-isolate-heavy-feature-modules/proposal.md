## Why

The published root entry of `@epam/ai-dial-ui-kit` still pulls AG Grid into a
consumer's cold-load graph even when the consumer only eagerly imports core
components (e.g. `Button`, `Spinner`) from the root and reaches
`@epam/ai-dial-ui-kit/grid` only through a dynamic `import()`. This is
measured, not assumed: with package version `0.14.0-dev.30` consumed by
`ai-dial-chat` (whose integration is already reduced to the intended
root-plus-lazy-`./grid` shape — no blanket UI-kit `manualChunks`, `Grid`
imported only from `@epam/ai-dial-ui-kit/grid`, AG Grid types converted to
type-only imports), the production build's initial `dial-ui-kit` chunk is
still ~1,376,786 raw / 390,684 gzip bytes and contains AG Grid.

The root cause is visible in the emitted artifact itself, not just in
`ai-dial-chat`'s build config. `src/index.ts:58` and `src/index.ts:427`
re-export both Grid generations (`DialGrid`, `Grid`) directly from the root
barrel, and the built `dist/dial-ui-kit.js` turns that into concrete
`import { DialGrid as fo } from "./components/Grid/Grid.js";` /
`import { GRID_SELECTION_COLUMN_ID as qi, Grid as Qi } from "./components/New/Grid/Grid.js";`
statements (`dist/dial-ui-kit.js:30-32,155-158`) that are later re-exported by
name (`dist/dial-ui-kit.js:239,313-314`) — an eager import-then-export
aggregator, not a re-export a downstream bundler can freely split. Both Grid
modules also run `ModuleRegistry.registerModules([AllCommunityModule])` at
module scope (`src/components/Grid/Grid.tsx:85`,
`src/components/New/Grid/Grid.tsx:56`), so a downstream bundler cannot safely
drop the import even if it wanted to, unless it trusts the package's
`sideEffects` classification (`package.json`'s `"sideEffects":
["dist/**/*.css"]`, which does not mention this JS side effect at all).

The `./grid` subpath added by the prior `modularize-package-exports` change
does not fix this: its own file comment says so directly —
`src/subpaths/grid.ts:1-11` states it is "an ergonomic feature boundary, not
a substitute for the root entry's own tree-shaking" and that "Importing from
here pulls in ag-grid-community / ag-grid-react, exactly as importing
Grid/DialGrid from the root does." The `vite.config.ts:37-53` build comment
assumed `preserveModules: true` alone makes the root tree-shakeable for any
consumer, and treated bundled-vs-peer AG Grid classification as irrelevant to
tree-shaking "once `preserveModules` isolates both Grid generations" — an
assumption this proposal's measured evidence contradicts for the mixed
eager-root-plus-lazy-`./grid` case.

The existing distribution fixtures cannot catch this because none of them
build the failing scenario: `fixtures/consumer-esm` proves a root-only
Button-only build, `fixtures/consumer-grid` proves a Grid-only build, and
`fixtures/consumer-subpaths` only checks ESM/CJS/TypeScript _resolution_, not
bundler tree-shaking. All bundler-build fixtures also currently pin
`vite: ^7.1.5` (plain Rollup), not the Vite 8 / Rolldown pipeline
`ai-dial-chat` actually builds with — so even a passing existing fixture
suite does not exercise the toolchain where the regression was observed.

## What Changes

- Diagnose, from generated build/graph metadata (not source-level assumptions),
  exactly why the emitted root entry keeps AG Grid statically reachable in a
  mixed eager-root + lazy-`./grid` consumer graph, and record which of the
  root-barrel topology, shared-chunk construction, `sideEffects`
  classification, or AG Grid registration placement is the cause.
- Change the library build/emitted entry topology (or, only if that proves
  insufficient, add a fallback lightweight entry) so that the published root
  keeps a genuinely splittable/tree-shakeable relationship to Grid-only code,
  instead of the current import-then-export aggregator.
- Add a new mixed-graph regression fixture — eager root import of a core
  component plus a dynamic `import('@epam/ai-dial-ui-kit/grid')` — built with
  Vite 8 / Rolldown, asserting the recursively-resolved initial graph
  (including HTML module-preload entries) excludes AG Grid while the lazy
  Grid graph includes it and can render.
- Keep every existing fixture (root-only, Grid-only, file-manager-only,
  editor-only, subpath resolution) passing unchanged, and extend the same
  mixed-graph pattern to another heavy feature if the diagnosis in the first
  bullet turns out to be a general root-barrel defect rather than
  Grid-specific.
- Verify the fix against the real `ai-dial-chat` consumer: pack/publish a dev
  build, confirm AG Grid is absent from its cold-load graph while remaining
  present in the lazy catalog/Grid graph, and confirm the archived chat
  budgets (JS gzip ≤ 1,100,000 B, CSS gzip ≤ 60,000 B, combined gzip ≤
  1,160,000 B) still hold.
- No export is renamed or removed. **Not BREAKING** under the current plan —
  see the compatibility note below for the one scenario that could change
  this.

## Capabilities

### New Capabilities

_(none — this change extends the existing distribution contract below rather
than introducing a new capability area)_

### Modified Capabilities

- `package-distribution`: the "Root ESM entry is tree-shakeable for non-Grid,
  non-editor components" requirement currently has only a root-only-fixture
  scenario; this change adds a mixed eager-root-plus-lazy-`./grid` scenario
  built against Vite 8 / Rolldown as a required scenario of that same
  requirement (a root-only fixture passing is explicitly insufficient
  evidence going forward). If the investigation lands on the `./core`
  fallback entry (the requirement's existing "Optional `./core` subpath"
  clause), that clause's status changes from optional/hypothetical to
  implemented, with migration guidance added per the compatibility note
  below.

## Impact

- **Code**: `src/index.ts` (root barrel topology), `vite.config.ts` (library
  build/entry/output config), possibly a new `src/subpaths/core.ts` (fallback
  only), `package.json#exports`/`#sideEffects` if the fix changes side-effect
  classification or adds an entry.
- **Fixtures**: a new mixed-graph fixture under `fixtures/`, and a Vite 8 /
  Rolldown upgrade for the fixtures that need to reproduce the real
  toolchain (currently pinned to `vite: ^7.1.5`); existing fixtures are
  retained.
- **Specs**: `openspec/specs/package-distribution/spec.md` gets a delta for
  the strengthened requirement described above.
- **Consumers**: no required change for existing root/`./grid`/
  `./file-manager`/`./editors` imports. `ai-dial-chat` is used as the
  real-world verification target (already on the intended
  `@epam/ai-dial-ui-kit/grid` import shape from the archived
  `2026-09-03-optimize-chat-cold-load-performance` change) but this proposal
  does not land any change inside that repository.
- **Dependencies**: `ag-grid-community`/`ag-grid-react` stay bundled
  `dependencies` (not moved to `peerDependencies`) unless the design phase
  finds package-level isolation is unreachable without it — that would be
  raised as its own explicit compatibility decision, not folded in here.

## Compatibility note

Not breaking under the current plan: every existing named export from the
root, and every existing `./grid`, `./file-manager`, `./editors` subpath,
keeps resolving exactly as it does today under ESM, CJS, and TypeScript. The
one scenario that would change this classification is the documented
fallback in the follow-up brief — if package-level root isolation turns out
to be technically impossible and a new `./core` entry becomes the
_recommended_ replacement import path for existing root consumers. That is a
consumer migration, not an export removal, so it still would not meet this
repo's breaking-change definition (renamed/removed props, changed component
behavior, removed exports, altered CSS token names) by itself; it would still
get a `CHANGELOG.md` entry and a `migration-guides/<next-version>/` guide
documenting the recommended switch, decided explicitly in `design.md` rather
than treated as a byproduct.

## Rollback

Every step is additive/reversible until the final build-config change lands:
the new fixture and its Vite 8/Rolldown fixture upgrade can be reverted on
their own without touching `src/`. If the `src/index.ts` / `vite.config.ts`
change regresses an existing fixture or the real `ai-dial-chat` build, revert
that single commit — the prior emitted root topology (import-then-export
aggregator, functionally correct but not isolated) is restored, existing
consumers see no behavior change, and the package version simply stays a
non-isolating "known limitation" until retried.
