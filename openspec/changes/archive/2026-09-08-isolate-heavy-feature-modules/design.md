## Context

`proposal.md` establishes that AG Grid still reaches a consumer's cold-load
graph in the mixed eager-root + lazy-`./grid` scenario, and that the emitted
root entry (`dist/dial-ui-kit.js:30-32,155-158,239,313-314`) is an
import-then-export aggregator rather than a passthrough re-export. This
section adds the remaining measured facts needed before deciding _how_ to
fix it, and corrects one assumption in the originating follow-up brief.

**Side-effect declarations are not the problem, on either side of the
boundary.** `package.json`'s `"sideEffects": ["dist/**/*.css"]` already tells
a bundler that every JS module in this package (including
`components/Grid/Grid.js`, which runs
`ModuleRegistry.registerModules([AllCommunityModule])` at module scope —
`src/components/Grid/Grid.tsx:85`, `src/components/New/Grid/Grid.tsx:56`) is
safe to drop when unused. `ag-grid-community`'s own installed package.json
(`node_modules/ag-grid-community/package.json`, v35.2.1) declares
`sideEffects` as a list of its CSS theme files only — its JS is also declared
side-effect-free. Neither package is lying about side effects in a way that
would force a compliant bundler to keep an unreached import.

**A second, independent cause exists in the consumer, and it contradicts a
claim in the originating brief.** The follow-up brief states "the blanket
`@epam/ai-dial-ui-kit` `manualChunks` rule was removed" from `ai-dial-chat`.
That is not the current state: `apps/chat/vite.config.mts:220-241` still has

```ts
manualChunks: (id) => {
  if (id.includes('classnames') || id.includes('tailwind-merge'))
    return 'vendor-utils';
  if (id.includes('@tabler/icons-react')) return 'tabler-icons';
  if (
    id.includes('@epam/ai-dial-ui-kit') &&
    !id.includes('JsonEditor') &&
    !id.includes('MarkdownEditor')
  )
    return 'ui-kit';
  return undefined;
},
```

This rule forces every non-editor module whose resolved id contains
`@epam/ai-dial-ui-kit` — including `components/Grid/Grid.js` and
`components/New/Grid/Grid.js` — into one fixed `ui-kit` chunk, regardless of
whether that module is reachable statically or only via the dynamic
`./grid` import. Rollup/Rolldown's `manualChunks` is a hard override that
runs _before_ reachability-based chunk assignment: once Grid's modules are
assigned to the same named chunk as `Button`/`Spinner`, that whole chunk
becomes part of the initial graph the moment anything needs `Button`, no
matter how cleanly the UI kit itself tree-shakes. **A UI-kit-only fix cannot
by itself close this gap while this rule stands** — Decision 5 and the
verification task account for this explicitly, without editing
`ai-dial-chat` as a deliverable of this change (per `AGENTS.md`'s task rule
for this repository: consumer edits made to verify are temporary and
reversible, not landed here).

## Goals / Non-Goals

**Goals:**

- Make the _emitted_ root entry's relationship to Grid-only code something a
  standards-compliant downstream bundler can actually split, in the absence
  of any consumer-side `manualChunks` override.
- Prove the fix with build-graph evidence (module-preload lists, recursive
  static-import resolution), not chunk-filename inspection or a root-only
  fixture.
- Preserve every compatibility guarantee already codified in
  `openspec/specs/package-distribution/spec.md` (root/subpath ESM+CJS+TS
  resolution, `./styles.css` completeness, existing editor lazy boundaries,
  `npm pack` contents).
- Produce enough evidence in the verification step to state clearly whether
  `ai-dial-chat`'s current `manualChunks` rule is still required, now
  redundant, or actively harmful once the package-level fix lands — as input
  to a _separate_, later `ai-dial-chat` proposal, not as part of this one.

**Non-Goals:**

- Landing any code change in `ai-dial-chat`. Task 5's consumer verification
  uses a temporary, reverted-after-measurement local edit only.
- Moving `ag-grid-community`/`ag-grid-react` to `peerDependencies`. Nothing
  in the diagnosis above requires it (both packages already declare
  side-effect-free JS); doing it anyway would just shift an install burden
  onto every existing Grid/FileManager consumer for no measured
  tree-shaking benefit, matching the rejection already recorded in
  `vite.config.ts:56-66`.
- Redesigning `DialFileManager`'s dependency on the legacy `DialGrid`
  (`src/components/FileManager/FileManager.tsx`) — it inherits whatever
  isolation boundary Grid ends up with, unchanged.
- Changing the JSON/Markdown editor lazy-loading boundaries
  (`LazyDialJsonEditor`, `LazyDialMarkdownEditor`, `LazyMarkdownEditor`,
  the nested load inside `MarkdownEditorContainer` /
  `SchemaAdditionalPropertiesEditor`) — out of scope and explicitly
  preserved.

## Decisions

### Decision 1 — Diagnose from generated artifacts before changing build config

Before touching `vite.config.ts` or `src/index.ts`, build the mixed fixture
(Decision 4) against the _current_ package and use its bundler's build
metadata (Vite/Rolldown's manifest, the emitted HTML's
`<link rel="modulepreload">` list, and a recursive static-import walk from
the HTML entry) to name the exact module(s) that pull
`ag-grid-community`/`ag-grid-react` into the initial graph, and via which
import edge. Do this with the consumer's `manualChunks` rule _disabled_ first
(isolating the package's own behavior), then again with it enabled (matching
today's real `ai-dial-chat` build), and record both.

_Why first:_ every fix option below targets a different suspected cause
(root-barrel topology vs. registration placement vs. build topology limits).
Picking one without the graph evidence risks fixing a symptom that Decision
5's consumer-side override would have masked anyway.

_Alternative rejected:_ proceed straight to "the obvious fix" (rewrite
`src/index.ts`'s Grid exports) on the assumption that import-then-export
codegen is sufcient explanation. Rejected — `proposal.md`'s own evidence
already shows Rollup/Rolldown routinely compiles `export { X } from 'mod'`
into import+export codegen for entries with many re-exports; that codegen
shape is not automatically disqualifying for tree-shaking, so treating it as
the _proven_ sole cause without graph evidence would risk shipping a change
that doesn't move the measured numbers.

### Decision 2 — Prefer restructuring emitted topology over adding a new entry

If Decision 1 shows the root barrel itself is the blocker, prefer changing
_how_ `src/index.ts`'s Grid-related re-exports are emitted (e.g. isolating
them into their own re-export module that the build can preserve as a
pure `export … from` passthrough, or adjusting `vite.config.ts`'s
`rollupOptions.output` so entry-level re-exports are not flattened into a
combined import+export block) over introducing a new `./core` entry.

_Alternatives considered:_

- **Add `./core` immediately** (the brief's fallback option 4): rejected as
  the _first_ move — it is additive and safe, but it is also a consumer
  migration (existing root imports keep working but stop being the
  recommended path), which this repo's rules require justifying with
  evidence that root-level isolation is technically unreachable, not
  reaching for as a shortcut.
- **Split the library into two separate Vite build invocations** (one
  Grid-free root, one Grid-inclusive): rejected as a first move — bigger
  build-pipeline change than the evidence currently justifies; kept as
  Decision 3's fallback if one `preserveModules` build cannot emit the
  needed topology at all.

### Decision 3 — Move AG Grid's module-scope side effect behind actual usage, not behind import

Regardless of what Decision 1 finds about the root barrel, relocate
`ModuleRegistry.registerModules([AllCommunityModule])` out of
`Grid.tsx`/`New/Grid/Grid.tsx` module scope (`src/components/Grid/Grid.tsx:85`,
`src/components/New/Grid/Grid.tsx:56`) so that merely being _re-exported_
from the root never executes it; registration still runs exactly once before
first render (e.g. component-mount-time or a shared lazy-init guard both
Grid generations call), preserving the existing spec scenario "AG Grid module
registration runs when Grid is reached" (`openspec/specs/package-distribution/spec.md`)
under a "reached" defined as _rendered_, not _imported_.

_Why:_ even with a perfectly passthrough-shaped root barrel, a downstream
bundler that cannot prove a module has zero side effects has to keep it.
Making the side effect provably absent from the module body (rather than
only asserted via the `sideEffects` package field) removes the one piece of
this chain that depends on trusting a field a downstream tool might apply
inconsistently, and is cheap insurance alongside Decision 2's topology fix.

_Alternative rejected:_ rely solely on the `sideEffects` field (already
correctly set) and Decision 2's topology fix. Rejected as the sole approach
because it leaves a real behavioral side effect sitting in a module the
build declares side-effect-free — a latent correctness risk independent of
this bug, not just a tree-shaking one — even though Decision 1's diagnosis
may show it was not the proximate cause here (this repo's spec assertions
must reflect this regardless, per the rule against manual-inspection-only
tree-shaking claims: this decision converts an assumed-safe side effect into
a _provably_ absent one).

### Decision 4 — New mixed fixture, upgraded to Vite 8 / Rolldown, added alongside existing fixtures

Add `fixtures/consumer-mixed-grid` (naming mirrors the existing
`consumer-*` fixtures): eagerly renders a root component (`Button` or
`Spinner`) and loads `Grid` only behind a dynamic
`import('@epam/ai-dial-ui-kit/grid')` triggered by user interaction, packed
from `npm pack` like the existing fixtures. Upgrade this fixture (and, for
consistency and because they exercise the same shared bundler behavior, the
existing `fixtures/consumer-esm` and `fixtures/consumer-grid`) from
`vite: ^7.1.5` to `^8.0.0`, matching `ai-dial-chat`'s actual
`vite: ^8.0.0` (root `package.json`).

_Why upgrade the existing fixtures too, not just add a new one on Vite 8:_
leaving root-only/Grid-only fixtures on Vite 7 would mean the suite has two
different bundler behaviors for "isolated" vs. "mixed" scenarios, which
makes any future regression ambiguous — is it the scenario or the bundler
version? A single bundler version across all bundler-build fixtures removes
that ambiguity.

_Alternative rejected:_ reproduce the mixed scenario by adding a
Vite-8-specific project only, keeping Vite 7 fixtures untouched to minimize
diff size. Rejected — the whole point of this proposal is that Vite 7
(plain Rollup) fixtures already pass and did not catch the regression;
leaving them as the "baseline truth" going forward would be misleading.

### Decision 5 — Verification step must run with and without `ai-dial-chat`'s current `manualChunks` rule

Task 5's real-consumer verification runs the `ai-dial-chat` Nx build twice
against the packed dev build: once unmodified (today's
`apps/chat/vite.config.mts:220-241` `manualChunks`, to measure whatever
improvement the package-level fix delivers under real conditions), and once
with that rule's `ui-kit` branch temporarily commented out locally (reverted
before finishing the task, never committed) to measure whether the
package-level fix alone, with no consumer override, achieves full isolation.
Report both numbers.

_Why:_ Decision statement in Context already shows the `manualChunks` rule
can mask or block a package-level fix on its own. Reporting only the
unmodified-config number would not tell us whether a remaining gap is a
UI-kit defect or a consumer-config decision that needs its own proposal in
`ai-dial-chat`. This is explicitly a measurement step, not a change to that
repository.

## Risks / Trade-offs

- **[Risk] Decision 1's diagnosis finds the root-barrel topology is not
  fixable within one `preserveModules` build** (e.g. Rolldown always
  compiles many-re-export entries into import+export form, and that form is
  provably unsplittable downstream regardless of side-effect purity) →
  **Mitigation:** fall back to Decision 2's rejected alternatives in order
  (split build phases, then the `./core` entry) exactly as
  `proposal.md`'s Modified Capabilities section already anticipates, with a
  `CHANGELOG.md` entry and a `migration-guides/<next-version>/` guide if
  `./core` becomes the recommended path.
- **[Risk] `ai-dial-chat`'s `manualChunks` rule turns out to still be
  necessary for other reasons** (e.g. controlling chunk count/caching
  independent of Grid) → **Mitigation:** Decision 5's dual measurement
  produces the evidence either way; this proposal's Deliverable 6 (remaining
  limitation writeup) states plainly if full isolation still needs a
  companion `ai-dial-chat` change, rather than claiming a false full fix.
- **[Risk] Moving `registerModules` out of module scope (Decision 3) changes
  the exact timing of AG Grid module registration relative to first paint**
  → **Mitigation:** existing spec scenario requires only that registration
  "has executed" before the fixture "renders that row's data" — a
  mount-time or first-render guard satisfies this; add a unit test per Grid
  generation asserting registration has run before the first row renders.
- **[Risk] Upgrading fixture Vite versions (Decision 4) surfaces unrelated
  Vite 7→8 breaking changes in the existing root-only/Grid-only fixtures**
  → **Mitigation:** upgrade and re-run each existing fixture's current
  assertions unchanged before adding the new mixed fixture, so a Vite-8
  regression in an existing fixture is caught and fixed (or reported)
  separately from the new isolation work.
- **[Trade-off] Running the chat build twice in Task 5 (Decision 5) roughly
  doubles that task's verification time** → accepted; it is the only way to
  separate this package's contribution from the consumer's existing
  override, and the task only runs once per change, not per CI run.

## Migration Plan

No consumer migration is required for the primary path (Decisions 1-4):
root, `./grid`, `./file-manager`, `./editors` all keep resolving exactly as
they do today. Steps, in order:

1. Land Decision 1's diagnostic fixture run (read-only; produces the graph
   evidence used to pick between Decision 2's options).
2. Land the chosen root-topology change plus Decision 3's registration
   relocation together (they are validated by the same fixture and the same
   existing Grid unit tests).
3. Land Decision 4's new/upgraded fixtures.
4. Run Decision 5's dual `ai-dial-chat` verification and record both numbers
   in the verification report (Deliverable 5), without committing the
   temporary `manualChunks` edit.
5. Only if Decision 2's primary options are exhausted: introduce `./core`,
   with its own `CHANGELOG.md` + migration guide, as a separate, clearly
   labeled follow-up inside this same change (tasks.md sequences it last and
   conditionally).

**Rollback:** each step lands as an independently revertable commit
(`proposal.md`'s Rollback section). Reverting step 2 alone restores today's
functionally-correct-but-not-isolated root topology with no consumer-visible
change.

## Open Questions

- ~~Does Decision 1's graph walk, with the consumer `manualChunks` rule
  disabled, show the root-barrel import-then-export shape as _sufficient by
  itself_ to explain AG Grid's presence, or does it tree-shake cleanly once
  that rule is out of the way?~~ **Resolved** (see
  `diagnosis-baseline.txt`): built the `fixtures/consumer-mixed-grid`
  fixture from Decision 4 against the package's current, unmodified source
  and inspected its `graph-report.json` directly. The static chunk's 43
  module ids contain zero Grid-related modules — not a content-grep
  absence, Rollup's own per-module dead-code elimination excludes them
  entirely — while the dynamic `./grid` chunk's 66 module ids include both
  Grid generations and `ag-grid-community`/`ag-grid-react`. The pre-existing
  root-only fixture (`consumer-esm`) tree-shakes cleanly too once a false-
  positive in its own test comment was fixed (see `diagnosis-baseline.txt`
  §2a). **The root-barrel import-then-export topology is not, by itself, an
  obstacle to correct tree-shaking in a real Vite 8 downstream build.** This
  means the package-level defect Decision 2 targets is not demonstrated —
  the measured `ai-dial-chat` regression is most likely explained primarily
  or entirely by that consumer's own `manualChunks` rule (Context section
  above), not by anything in this package's current build. **Consequence:**
  Decision 2's root-topology restructuring (tasks.md Section 3) is
  downgraded from required to conditional — do not undertake it as a
  package source change until Decision 5's `ai-dial-chat` dual-measurement
  (Section 7, with the consumer's `manualChunks` override actually disabled)
  confirms a real package-level gap remains once the known consumer-side
  cause is accounted for. Decision 3 (relocate the AG Grid registration side
  effect) remains worth doing regardless, on its own side-effect-hygiene
  merits.
- If Decision 2's primary restructuring is not sufficient on its own, is the
  cause specific to Grid, or a general defect in how this build emits _any_
  multi-entry preserved-module root with many re-exports (which would also
  affect `./file-manager`/`./editors`)? `proposal.md` already asks for a
  second heavy-feature mixed fixture if this proves general — Decision 1's
  diagnosis is what answers it.
- Should the dual measurement in Decision 5 also record whether
  `ai-dial-chat`'s `tabler-icons`/`vendor-utils` manual chunks interact with
  the fix, or is isolating just the `ui-kit` branch sufficient evidence for
  this change's verification report? Default: isolate only the `ui-kit`
  branch unless Task 5's first run shows an unexplained result.
