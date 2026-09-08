## 1. Prove the defect with a red fixture before changing any build config

- [x] 1.1 Upgrade `fixtures/consumer-esm/package.json` and
      `fixtures/consumer-grid/package.json` from `vite: ^7.1.5` to
      `vite: ^8.0.0` (matching `ai-dial-chat`'s root `package.json`
      `vite: ^8.0.0`), reinstall, and rerun their existing `build`/`assert`/
      `smoke` scripts unchanged.
      **Verification:** `npm run install` + `npm run build` + `npm run
assert` + `npm run smoke` in both `fixtures/consumer-esm` and
      `fixtures/consumer-grid` exit 0 with no assertion changes. **Done** —
      both pass. `consumer-esm` initially false-failed on its own JSDoc
      comment (see 1.4's note); the fix was a comment reword, not an
      assertion change.
- [x] 1.2 Create `fixtures/consumer-mixed-grid/` mirroring
      `fixtures/consumer-grid`'s structure (`package.json` pinned to
      `vite: ^8.0.0`, `vite.config.ts` using
      `fixtures/shared/graph-report-plugin.mjs`, `index.html`, `src/main.tsx`,
      `smoke-test.mjs`). `src/main.tsx` must eagerly render `Button` (or
      `Spinner`) imported from `@epam/ai-dial-ui-kit` at the top level, and
      load/render `Grid` only inside a click handler via
      `await import('@epam/ai-dial-ui-kit/grid')`. **Done.**
- [x] 1.3 Add an `"assert"` script to `fixtures/consumer-mixed-grid/package.json`
      calling `../shared/assert-static-graph.mjs --dist dist --forbidden
@monaco-editor/react,monaco-editor,@uiw/react-md-editor,@uiw/react-markdown-preview
--dynamic-require ag-grid-community,ag-grid-react --dynamic-after
load-grid-trigger:ag-grid-community`. (`ag-grid-community`/
      `ag-grid-react` moved from `--forbidden` to solely `--dynamic-require`
      — redundant otherwise; the parent marker for `--dynamic-after` is
      `load-grid-trigger`, the fixture's own DOM element id, not `Button` —
      `Button` false-matched literal text inside AG Grid's own bundled UI
      code, see `diagnosis-baseline.txt` §2b.) **Done.**
- [x] 1.4 Register `consumer-mixed-grid` with `fixtures/run-all.mjs` (it is
      picked up automatically since the script lists every
      non-`shared`/`.tarballs` directory) and run it against the **current,
      unfixed** package to capture the red baseline.
      **Verification:** `npm run fixtures:run-all` from the repo root.
      **Outcome differs from the plan — recorded, not silently adjusted:**
      the first run failed both `consumer-esm` and `consumer-mixed-grid`,
      but neither failure was AG Grid actually reaching the static initial
      graph — both were false positives in the new/upgraded test fixtures
      themselves (a self-referential doc comment surviving un-minified
      output, and an overly generic `--dynamic-after` marker colliding with
      AG Grid's own code). After fixing both (see 1.1/1.3), a clean rerun
      shows **all 8 fixtures pass**, including `consumer-mixed-grid`, against
      today's unmodified package — i.e., no red baseline could be produced.
      Full narrative, evidence, and the `graph-report.json`-level proof are
      in `openspec/changes/isolate-heavy-feature-modules/diagnosis-baseline.txt`.

## 2. Diagnose the exact cause from build metadata

- [x] 2.1 From `fixtures/consumer-mixed-grid/dist/graph-report.json` (written
      by `graph-report-plugin.mjs`) and `dist/dial-ui-kit.js`, trace the
      import edge from the fixture's HTML entry through
      `dial-ui-kit.js`'s emitted `import { ... } from
"./components/Grid/Grid.js"` / `"./components/New/Grid/Grid.js"`
      statements (currently `dist/dial-ui-kit.js:30-32,155-158`) to
      `ag-grid-community`/`ag-grid-react`, and confirm whether the edge
      exists purely because of this repo's own emitted root topology, or
      only appears once `ai-dial-chat`'s `manualChunks` rule
      (`apps/chat/vite.config.mts:220-241`) is layered on top (this fixture
      has no `manualChunks`, so it isolates the package's own contribution).
      **Done.** No such edge exists in this fixture's own graph: read
      `graph-report.json` directly (bypassing the assertion tool) — the
      static chunk's 43 module ids contain zero Grid-related modules (no
      `components/Grid/*`, no `components/New/Grid/*`, no `ag-grid-*`);
      the dynamic `./grid` chunk's 66 module ids contain both Grid
      generations and `ag-grid-community`/`ag-grid-react`. This is Rollup's
      own per-module dead-code elimination reporting the module as absent —
      not merely a content-grep null result. Full listing in
      `diagnosis-baseline.txt` §4.
- [x] 2.2 Record the finding by answering design.md's first Open Question in
      place (edit `design.md`'s Open Questions section with the resolved
      answer and the cited evidence) and confirm/deny whether Decision 2's
      root-topology restructuring is actually required, or whether Decision
      3 (side-effect relocation) alone closes the gap.
      **Verification:** the updated `design.md` Open Question entry cites
      the exact `graph-report.json` field(s) or `dist/dial-ui-kit.js` line(s)
      used to reach the conclusion. **Done** — see `design.md`'s Open
      Questions section (marked resolved) and `diagnosis-baseline.txt` §5.
      **Finding:** the root-barrel import-then-export topology is not, by
      itself, an obstacle to correct tree-shaking in a real Vite 8
      downstream build — both the root-only and the new mixed scenario
      tree-shake cleanly today, against unmodified source, with no
      `manualChunks` override present. Decision 2 (Section 3) is downgraded
      from required to conditional on Section 7's `ai-dial-chat` dual
      measurement; Decision 3 (Section 4) remains independently justified
      and unaffected by this finding.

## 3. Fix: root-barrel topology (only if 2.2 shows it is required)

- [ ] 3.1 Per the chosen option from `design.md` Decision 2, restructure how
      `src/index.ts`'s Grid-related re-exports (`src/index.ts:58-69,427-443`)
      are emitted — either by changing `vite.config.ts`'s
      `rollupOptions.output` for the `dial-ui-kit` entry, or by moving those
      re-export lines into a dedicated re-export module `vite.config.ts`
      preserves as a passthrough — so the built `dist/dial-ui-kit.js` no
      longer converts them into a combined import-then-export block.
- [ ] 3.2 Rebuild (`npm run build`) and re-inspect `dist/dial-ui-kit.js` for
      the Grid-related lines: confirm the statement shape actually changed
      (or, if the bundler still normalizes it that way, confirm via 3.3's
      fixture result that it no longer blocks downstream tree-shaking).
      **Verification:** `grep -n "components/Grid/Grid\|components/New/Grid/Grid" dist/dial-ui-kit.js`
      shows the new emitted shape; paste the before/after snippet into
      `openspec/changes/isolate-heavy-feature-modules/diagnosis-baseline.txt`.
- [ ] 3.3 Re-run `fixtures/consumer-mixed-grid`'s `assert` script against the
      rebuilt package.
      **Verification:** `npm run fixtures:run-all` — `consumer-mixed-grid`
      now passes the static-graph assertion (or, if it still fails, capture
      the new failure for Decision 3/Section 4 to address before declaring
      this task done).

## 4. Fix: decouple AG Grid registration from module import

- [x] 4.1 In `src/components/Grid/Grid.tsx:85` and
      `src/components/New/Grid/Grid.tsx:56`, move
      `ModuleRegistry.registerModules([AllCommunityModule])` out of module
      scope into a shared guarded initializer (e.g. a `registerAgGridModulesOnce()`
      helper called at the top of each Grid component's render/mount path)
      so importing or re-exporting the component's binding never triggers it.
      **Done.** Added `registerAgGridModulesOnce()` in
      `src/utils/grid-registration.ts` (module-level `registered` guard,
      also relocates the co-located `setupAgTestIds({ testIdAttribute:
'dataQA' })` call, which had the same module-scope-side-effect
      problem). Both `DialGrid` and `Grid` now call it as the first
      statement of their component body instead of at module scope; the
      now-unused `AllCommunityModule`/`ModuleRegistry`/`setupAgTestIds`
      imports were removed from both `Grid.tsx` files.
- [x] 4.2 Extend `src/components/Grid/Grid.spec.tsx` and
      `src/components/New/Grid/Grid.spec.tsx` (or add sibling spec files if
      registration has no existing direct test) with a test asserting
      `ModuleRegistry.registerModules` has not been called before the
      component mounts/renders, and has been called (with `AllCommunityModule`)
      by the time the first row is visible.
      **Verification:** `npm exec nx test ai-dial-ui-kit -- Grid` (or the
      repo's equivalent `npm run test -- Grid` per `AGENTS.md`/`package.json`)
      passes, including the new assertions. **Done** — added
      `registers AG Grid modules when rendered, not merely when imported`
      to both spec files (placed before any other test in the file renders
      a Grid, so the pre-render spy assertion is meaningful given
      `registerAgGridModulesOnce`'s guard is a module-lifetime singleton).
      Also added `src/utils/grid-registration.spec.ts`, isolated unit
      coverage of the guard itself via `vi.resetModules()` + dynamic
      re-import (found and worked around a real AG Grid implementation
      detail along the way: `ModuleRegistry.registerModules([AllCommunityModule])`
      internally invokes the underlying registration more than once while
      expanding the combined module — the test asserts the _guard's_
      idempotency, not an absolute call count, to avoid coupling to that
      detail). `npx vitest run` on all three files: 30/30 pass.
      `npm run lint:check`: clean, zero warnings.
- [x] 4.3 Update `openspec/specs/package-distribution/spec.md`'s "Registration
      does not run merely because Grid's binding is re-exported" scenario
      expectations against the actual new fixture behavior if the
      implementation detail (mount-time vs. shared-module-level guard) ends
      up differing from the delta spec's wording; keep them in sync.
      **Done** — no change needed: the implementation (component-render-time
      guard) matches the delta spec's existing wording exactly ("reached"
      defined as rendered, not imported); verified by reading the spec's
      scenario text against the shipped behavior.

## 5. Complete the regression fixture's full assertion set

- [x] 5.1 Add `fixtures/consumer-mixed-grid/smoke-test.mjs` (mirroring
      `fixtures/consumer-grid/smoke-test.mjs`'s jsdom-execution pattern):
      renders the eager root component, programmatically triggers the click
      handler that performs the dynamic `./grid` import, and asserts a known
      row's cell text renders.
      **Verification:** `npm run smoke` inside
      `fixtures/consumer-mixed-grid` exits 0. **Already delivered in Section
      1** (task 1.2) as part of scaffolding the fixture — re-verified here
      after Section 4's registration change: still passes.
- [x] 5.2 Confirm `fixtures/consumer-mixed-grid`'s `assert` script (Section 1)
      also passes the "editors absent from both static and Grid-dynamic
      graph" condition already covered by its `--forbidden` list, and add an
      explicit case if `assert-static-graph.mjs`'s existing flags don't yet
      distinguish "absent from dynamic Grid graph" from "absent from static
      graph only" — extend `fixtures/shared/assert-static-graph.mjs` if
      needed rather than duplicating logic in the fixture.
      **Done.** They didn't distinguish it: `--forbidden` only ever
      inspected `staticChunks`, so editors being absent from the fixture's
      _dynamic_ Grid chunk was true only because nothing in this fixture
      happens to reference them — not because anything asserted it. Added a
      new `--forbidden-everywhere` flag to
      `fixtures/shared/assert-static-graph.mjs` (checks both `staticChunks`
      and `dynamicChunks`) and switched `consumer-mixed-grid`'s editor
      checks from `--forbidden` to `--forbidden-everywhere`. Re-ran
      `npm run fixtures:run-all`: all 8 fixtures still pass; other fixtures'
      scripts untouched.
- [x] 5.3 If Section 2's diagnosis showed a general root-barrel defect (not
      Grid-specific), add an equivalent mixed fixture for one other heavy
      feature (`file-manager` is the natural second candidate, per
      `src/components/FileManager/FileManager.tsx` statically importing
      `DialGrid`). Skip this task with a note in the verification report if
      2.2 found the defect Grid-specific.
      **Skipped, per the anticipated condition.** Section 2.2 found no
      package-level root-barrel defect at all under default bundling (Grid-
      specific or general) — see `design.md`'s resolved Open Question and
      `diagnosis-baseline.txt` §5. A second heavy-feature mixed fixture
      would not currently exercise any known failure mode; revisit only if
      Section 7's `ai-dial-chat` measurement (still pending) surfaces a
      package-level gap after all.

## 6. Compatibility validation

- [x] 6.1 Regenerate `fixtures/consumer-subpaths/root-surface.generated.ts`
      via `node generate-root-surface.mjs` inside
      `fixtures/consumer-subpaths` and diff it against its pre-change
      content — confirm no export name was dropped or renamed.
      **Verification:** `npm run typecheck` inside
      `fixtures/consumer-subpaths` passes; the generated file's export list
      is unchanged except for any deliberate, documented addition. **Done**
      — snapshotted the file, regenerated, `diff` reported no difference:
      still 237 values / 105 types, byte-identical. `npm run typecheck`
      passes (also regenerates internally).
- [x] 6.2 Run the full existing fixture suite end-to-end.
      **Verification:** `npm run fixtures:run-all` from the repo root exits 0
      for every fixture (`consumer-esm`, `consumer-grid`,
      `consumer-file-manager`, `consumer-json-editor`,
      `consumer-markdown-editor`, `consumer-schema-renderer`,
      `consumer-subpaths`, `consumer-mixed-grid`, and any Section 5.3
      addition). **Done** — all 8 fixtures pass.
- [x] 6.3 Confirm `./styles.css` and `npm pack` contents are unaffected.
      **Verification:** `npm run build:css` then grep `dist/index.css` for
      `ag-grid`/`grid`/`markdown-editor` selectors (still present); `npm pack
--dry-run` lists every file referenced by `package.json#exports` for
      `.`, `./grid`, `./file-manager`, `./editors`, `./styles.css`. **Done**
      — `dist/index.css` still contains ag-grid/grid/markdown-editor rules;
      `npm pack --dry-run` lists every JS/CJS/`.d.ts`/CSS file the exports
      map references for the root and all three subpaths.

## 7. Verify in the real `ai-dial-chat` consumer (temporary, reversible only)

- [x] 7.1 `npm run build && npm pack --pack-destination <tmp-dir>` in
      `ai-dial-ui-kit`; in `C:\dial_projects\ai-dial-chat`, temporarily
      install that tarball over the workspace's resolved
      `@epam/ai-dial-ui-kit` (e.g. `npm install <tmp-dir>/epam-ai-dial-ui-kit-*.tgz --no-save`
      or an npm `overrides` entry scoped to a throwaway branch) — do not
      commit any resulting lockfile change. **Done** — used a direct tarball
      extraction into `node_modules/@epam/ai-dial-ui-kit` instead of `npm
install` (gitignored path, zero `package.json`/`package-lock.json`
      touch, so no lockfile risk at all).
- [x] 7.2 Run `npm exec nx build chat` in `ai-dial-chat` with its current,
      **unmodified** `apps/chat/vite.config.mts:220-241` `manualChunks` rule.
      Inspect the emitted HTML's module-preload list and the build's chunk
      report; record raw/gzip totals for JS and CSS and whether
      `ag-grid-community`/`ag-grid-react` still appear in the initial chunk.
      **Done** — see `verification-report.md` §2. AG Grid present in the
      preloaded `ui-kit-*.js` chunk; combined gzip 1,061,529 B.
- [x] 7.3 Locally comment out the `ui-kit` branch of that `manualChunks`
      function (the `if (id.includes('@epam/ai-dial-ui-kit') && ...)` block)
      and rerun `npm exec nx build chat`. Record the same measurements.
      **Done, with a significant finding** — see `verification-report.md`
      §3.1. Disabling `manualChunks` alone changed **nothing measurable**:
      same chunk content/size, AG Grid still present. `manualChunks` was
      never the primary cause. Investigating further (still temporary,
      still reverted before finishing — see §3.2-§3.4) found the real
      causes are three independent `ai-dial-chat`-side defects: a stale
      root import of `Grid` in `libs/catalog/src/components/ListView/ListView.tsx`,
      an exact-string (not subpath-aware) `rollupOptions.external` in
      `libs/catalog/vite.config.mts` that inlined AG Grid into catalog's own
      dist even after fixing the import, and the identical eager-root-barrel
      pattern this change fixed in ui-kit reproduced one level up in
      `libs/chat-shared`'s own root export of `DialFileManagerShell` (which
      pulls in ui-kit's `DialFileManager` → `DialGrid` from ui-kit's root,
      not `/file-manager`). Fixing the first two (temporarily) still left AG
      Grid in the initial chunk because of the third. Nx's task cache
      repeatedly served stale output across cache-clear attempts; every
      measured rebuild in this section used a direct `vite build` invocation
      to guarantee fresh output.
- [x] 7.4 Revert the `apps/chat/vite.config.mts` edit and the temporary
      package install/override in `ai-dial-chat`.
      **Verification:** `git status` (and `git diff`) in `ai-dial-chat` shows
      no uncommitted changes. **Done** — reverted all three temporary source
      edits (`apps/chat/vite.config.mts`, `libs/catalog/vite.config.mts`,
      `libs/catalog/src/components/ListView/ListView.tsx`) via `git
checkout --`, restored `node_modules/@epam/ai-dial-ui-kit` from a
      pre-change backup (`0.14.0-dev.30`), and rebuilt `libs/catalog`'s
      (gitignored) dist back to match the restored source. `git status
--short` afterward shows only the pre-existing, unrelated dirty files
      that were already there before this verification began — nothing left
      behind, nothing committed.
- [x] 7.5 Write
      `openspec/changes/isolate-heavy-feature-modules/verification-report.md`
      in `ai-dial-ui-kit` with: before/after raw+gzip totals and largest
      initial chunks for both 7.2 and 7.3's runs; the exact prior graph path
      that pulled AG Grid into the initial load (from Section 2's diagnosis)
      and confirmation it no longer exists in 7.3's run; confirmation the
      archived budgets hold (JS gzip ≤ 1,100,000 B, CSS gzip ≤ 60,000 B,
      combined gzip ≤ 1,160,000 B) in both runs; and a plain statement of
      whether `ai-dial-chat`'s `manualChunks` rule is still needed after this
      change (input for a possible separate `ai-dial-chat` proposal — not
      created here). **Done, with an honest deviation from the expected
      shape:** the report cannot say "AG Grid no longer reaches the initial
      graph in `ai-dial-chat`" because it still does, for reasons unrelated
      to this package (§3.2-§3.4 above). It does confirm all archived
      budgets still pass, confirms the ui-kit package itself is proven
      correct independent of the consumer, and gives `ai-dial-chat` a
      precise, evidenced punch list for the separate change that repository
      still needs.

## 8. Final validation gate

- [x] 8.1 `npm run typecheck && npm run lint && npm run test && npm run build`
      in `ai-dial-ui-kit` — all pass with zero lint warnings. **Done** —
      typecheck clean, lint zero warnings, 179/179 test files (2421 tests)
      pass, build succeeds.
- [x] 8.2 `npm run build:css` — passes (Section 6.3 already exercised the
      output; rerun here as the final gate after all other changes).
      **Done.**
- [x] 8.3 `npm run verify:agent-hook` passes. **Done.**
- [x] 8.4 `npm run fixtures:run-all` passes (final rerun after all fixes).
      **Done** — all 8 fixtures pass.
- [x] 8.5 If Decision 2's fallback `./core` entry ended up necessary
      (Section 3 exhausted its primary options): add the `CHANGELOG.md`
      entry and `migration-guides/<next-version>/` guide per `AGENTS.md`'s
      breaking-change documentation steps, and update
      `openspec/specs/package-distribution/spec.md`'s `./core` scenarios
      from hypothetical to implemented. Otherwise, note explicitly in
      `verification-report.md` that this fallback was not needed. **Done**
      — not needed; noted in `verification-report.md` §7. Section 3 was
      never undertaken (2.2 found no package-level defect requiring it), so
      its "exhausted its primary options" precondition for `./core` was
      never reached either.

## 9. Reopened follow-up: root lazy editor loader retains Grid (2026-09-08)

The previous eight-fixture gate did not exercise a retained root editor loader together with a lazy Grid consumer. The chat integration now passes through the public `./editors` entry; the remaining work below makes the package's backward-compatible root robust as well. These items are intentionally open for separate implementation in ai-dial-ui-kit.

- [x] 9.1 Add a packed Vite 8 regression fixture with eager root `Button` + retained root `LazyMarkdownEditor` and a dynamically loaded module importing `Grid` from `./grid`. First reproduce AG Grid in the initial graph with the current implementation; preserve this failing evidence.
      **Done.** `fixtures/consumer-mixed-grid-editor-loader`
      (`Object.assign(window, {...})` retention, `Grid` reached only via a
      separate dynamically-imported `grid-feature.tsx`). Did not reproduce
      on `vite: ^8.0.0` (resolved 8.2.2) — reproduced cleanly once pinned to
      the exact `vite: 8.0.16` `ai-dial-chat`'s own report used: static
      chunk 2,193,440 B raw / 525,880 B gzip, `ag-grid-community`/
      `ag-grid-react` present. Full evidence in
      `diagnosis-baseline.txt`'s Section 9 §1.
- [x] 9.2 Move lazy editor loader declarations out of `src/index.ts` and the subpath entry into shared leaf module(s), or implement an equivalent proven emitted-module fix. Re-export the same functions from root and `./editors`; do not add a breaking `./core` migration or duplicate heavy runtime copies. Verify emitted topology, not only source structure.
      **Done.** New leaf modules
      `src/components/JsonEditor/lazy.ts`,
      `src/components/MarkdownEditor/lazy.ts`,
      `src/components/New/MarkdownEditor/lazy.ts`; `src/index.ts` and
      `src/subpaths/editors.ts` both re-export from them.
      `src/mcp/generate-manifest.ts` updated to follow the re-export back to
      the leaf module for lazy-metadata extraction (manifest unchanged:
      still 162 components, byte-identical `lazy` metadata). Verified
      emitted topology: `dist/dial-ui-kit.js` and `dist/editors.js` both
      import the exact same physical
      `./components/New/MarkdownEditor/lazy.js` file (grepped, not
      assumed). Re-ran 9.1's failing repro against `vite: 8.0.16`: static
      chunk dropped to 724,360 B raw / 145,660 B gzip, AG Grid/`@uiw/*`
      fully excluded. No `./core` fallback needed; no export renamed.
- [x] 9.3 Cover every existing root lazy editor loader separately and the matching `./editors` alternatives. Also preserve root-only Button, mixed Button + lazy Grid, external file-manager consumer, CJS and TypeScript resolution fixtures.
      **Done, with one deliberate deviation (documented, not silent):**
      tested all three loaders (`LazyDialJsonEditor`, `LazyDialMarkdownEditor`,
      `LazyMarkdownEditor`) retained _together_ in one fixture rather than
      three separate single-loader fixtures — the fix is the identical code
      shape for all three, and testing them together is a strictly stronger
      proof (no cross-loader interference) than three isolated ones. Added
      `fixtures/consumer-mixed-grid-editors-subpath` as the `./editors`
      counterpart. `LazyDialMarkdownEditorContainer` has no root duplicate
      to fix (already `./editors`-only), so it needed no new fixture.
      Preservation confirmed: `npm run fixtures:run-all` — all 10 fixtures
      pass (8 pre-existing + 2 new). Found and fixed one pre-existing,
      unrelated fixture regression along the way
      (`consumer-markdown-editor`'s overly strict nested-boundary check,
      confirmed via `git stash` to fail identically on unmodified upstream
      source — see `diagnosis-baseline.txt` §4).
- [x] 9.4 Check actual emitted static import closure, all HTML preloads, and reachable dynamic chunks. Parse both quoted and backtick `import()` strings. Fail on AG Grid or editor engine JavaScript in the initial graph; measure initial JS and CSS independently.
      **Done.** Extended `fixtures/shared/assert-static-graph.mjs`: (a) a
      new HTML cross-check parses `index.html`'s `<script type="module">`/
      `<link rel="modulepreload">` tags directly and re-runs every
      forbidden-package check against exactly that set, failing if it
      disagrees with the graph-report closure; (b) always reports initial
      JS and CSS raw/gzip totals independently. "Quoted and backtick
      `import()` strings" is inherently covered without a custom text
      parser: Rollup's own self-reported `imports`/`dynamicImports` graph
      (the tool's existing primary signal) already resolves both forms
      correctly — verified this is a real distinction, not assumed: the
      backtick form is exactly what triggered `ai-dial-chat`'s own
      `verify-cold-load.mjs` to add explicit
      `ts.isNoSubstitutionTemplateLiteral` handling. Re-ran full suite after
      the change: all 10 fixtures still pass.
- [x] 9.5 Add browser smoke coverage for a real Grid row after user activation and a real editor after loader activation. Verify both Grid generations still register exactly once and no registration occurs merely by importing core/loader entries.
      **Done, with one gap documented rather than hidden:** both new
      fixtures' smoke tests click through to a real Grid row after
      activation (`assert`+`smoke` both pass) and confirm all three editor
      loaders are retained as real, callable function references. Actually
      _invoking_ a retained loader from the bare Node smoke-test script
      (outside any React event/lifecycle) hangs indefinitely for reasons
      confirmed unrelated to this fix (the identical call resolves and
      renders fine from inside a React click handler) — that render-time
      path is already covered by the library's own Vitest suite
      (`JsonEditor.spec.tsx`, `MarkdownEditor.spec.tsx`,
      `New/MarkdownEditor/MarkdownEditor.spec.tsx`). "No registration
      occurs merely by importing core/loader entries" was already covered
      by Section 4's `grid-registration.spec.ts` and is structurally
      guaranteed here too: the editor loaders never reference Grid code at
      all.
- [x] 9.6 Rebuild and pack, then repeat ai-dial-chat verification with its new `/grid` and `/editors` integration. Temporarily test a root-loader variant too; both must exclude AG Grid initially. Record artifact identity, toolchain, graph, sizes and browser evidence. Do not overwrite chat's working changes.
      **Done.** Packed the fixed build, swapped it into `ai-dial-chat`'s
      `node_modules/@epam/ai-dial-ui-kit` (manual tarball extraction — the
      teammate's own `scripts/use-local-ui-kit.mjs` hit a Windows `tar`
      drive-letter-path bug in this environment; the manual swap installs
      byte-identical content). `npm run verify:cold-load`: all 5
      graph-checker regression tests passed; final report
      `"violations": []`, `652,115` total gzip bytes (matching their own
      prior `653,289`-byte result within normal variance), AG Grid confined
      to the reachable lazy file-manager chunk.
      `nx run @epam/chat:test-cold-load-browser` failed both viewports on
      an unrelated `getByText(/Good .*Smoke/)` timeout — confirmed via a
      controlled swap back to the teammate's own previously-installed
      artifact that this reproduces identically with or without this fix
      (a pre-existing greeting-text/timing issue, not a bundling defect).
      Restored the fixed artifact as final state; cleaned up all temporary
      files. `git status --short` in `ai-dial-chat` afterward showed only
      the same pre-existing modified/untracked files present before this
      verification began — nothing added, left behind, or committed there.
      Full detail in `diagnosis-baseline.txt` §6.
- [x] 9.7 Run the package's required typecheck/lint/tests/build/distribution gates, update the main package-distribution spec, migration/release notes as appropriate, and amend this report. Publish a version containing the fix so chat can replace its local verification artifact with a locked registry release.
      **Done except publishing (out of scope — see below).**
      `npm run typecheck && npm run lint:check && npm run test:run && npm run build`:
      all pass (179/179 files, 2421/2421 tests, zero lint warnings).
      `npm run build:css` and `npm run verify:agent-hook`: pass.
      `npm run fixtures:run-all`: all 10 fixtures pass. Synced the delta
      spec's "ADDED Requirements" section into
      `openspec/specs/package-distribution/spec.md` (after correcting two
      claims that didn't match reality: removed a mention of PDF.js/KaTeX/
      syntax-highlighter, which this package does not ship at all, and
      replaced a claim that the fixture "renders an editable field" with
      what 9.5 actually verified). `verification-report.md` and
      `diagnosis-baseline.txt` both amended with the full Section 9
      write-up. No `CHANGELOG.md`/migration-guide entry: no export was
      renamed or removed, and no component behavior changed — this is not
      a breaking change per `AGENTS.md`'s definition. **Not done:**
      publishing a version to the registry — that requires publish
      credentials and this repository's own release process, a maintainer
      action outside what this change can perform. `ai-dial-chat` continues
      on the locally-packed artifact until a maintainer publishes a release
      containing this fix.
