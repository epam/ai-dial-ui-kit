# Verification report — `isolate-heavy-feature-modules`

Real-consumer verification against `C:\dial_projects\ai-dial-chat` (branch
`fix/failing-release` at verification time), per `tasks.md` Section 7. All
edits made to `ai-dial-chat` for this verification were temporary and have
been reverted (`git status` in that repo shows only its pre-existing,
unrelated dirty state — see §5). Nothing was committed there.

## 1. Summary

**The `@epam/ai-dial-ui-kit` package itself is fixed and verified isolating
correctly** (Sections 1–6 of this change: fixtures, diagnosis, the
`registerAgGridModulesOnce` relocation, full fixture suite, compatibility
checks — all passing against a Vite 8 / Rolldown consumer, matching
`ai-dial-chat`'s real toolchain).

**`ai-dial-chat`'s cold-load payload today is _not_ fixed by this change**,
and cannot be, from this repository alone. Real-consumer measurement found
AG Grid reaches the initial chunk through **three independent, `ai-dial-chat`-
side defects**, layered on top of each other — not through anything in the
published `@epam/ai-dial-ui-kit` package, and not primarily through the
`manualChunks` rule the original brief focused on. Disabling `manualChunks`
alone changes nothing measurable. Fixing two of the three defects (leaving
the third, described in §3.3, as the one requiring a design decision) still
left AG Grid in the initial chunk. Full isolation requires a dedicated
`ai-dial-chat` change; see §6.

## 2. Baseline: unmodified `ai-dial-chat`, packed fixed package

Built the packed dev output of this change's fixed `@epam/ai-dial-ui-kit`
into `ai-dial-chat`'s `node_modules` (direct tarball extraction, not `npm
install` — no `package.json`/`package-lock.json` touched) and ran
`vite build` for `apps/chat` with its current, **unmodified**
`apps/chat/vite.config.mts:220-241` `manualChunks` rule.

| Metric        |           Value |
| ------------- | --------------: |
| JS raw        | 3,605,184 bytes |
| JS gzip       | 1,009,601 bytes |
| CSS raw       |   292,149 bytes |
| CSS gzip      |    51,928 bytes |
| Combined gzip | 1,061,529 bytes |

Largest initial chunk: `ui-kit-DeKCmIlx.js` — 1,406,696 bytes raw /
400,804 bytes gzip, `<link rel="modulepreload">`'d from `index.html`, and
containing `ModuleRegistry`/`AllCommunityModule`/`ag-grid-community` markers
(8 hits by content grep).

This is very close to (slightly above) the pre-change baseline in
`ui-kit-cold-load-follow-up-prompt.md` (1,055,922 bytes combined gzip) — the
small increase is the new `grid-registration.ts` guard's own code, not a
regression signal. **All archived budgets still pass** (JS gzip
1,009,601 ≤ 1,100,000; CSS gzip 51,928 ≤ 60,000; combined 1,061,529 ≤
1,160,000) — but passing a generous absolute budget is not the same as
achieving isolation, which is the point of this section.

## 3. Diagnosing why AG Grid is still eager, one layer at a time

### 3.1 `manualChunks` alone: no effect

Locally commented out the `ui-kit` branch of `apps/chat/vite.config.mts`'s
`manualChunks` function (temporary; reverted, never committed) and rebuilt.

| Metric        |           Value | Δ vs §2 |
| ------------- | --------------: | ------: |
| JS gzip       | 1,009,601 bytes | +0 (~0) |
| CSS gzip      |    51,928 bytes |      +0 |
| Combined gzip | 1,061,529 bytes |      +0 |

The forced `ui-kit` chunk name disappeared (Rollup's default chunk-naming
took over, producing `dial-ui-kit-CbGeRa5i.js`), but its **size, content,
and eager `modulepreload` status were unchanged** — still 1,376,814 bytes
raw / ~394,310 bytes gzip (size drifted by <1% between rebuilds — normal
minifier/hashing variance, not a content difference), still containing AG
Grid. **Conclusion: `manualChunks` was never the primary cause.** Something
else keeps this shared chunk in the eager graph even under Rolldown's
default, override-free chunking.

### 3.2 Root cause #1 — a stale eager root import in `libs/catalog`

`libs/catalog/src/components/ListView/ListView.tsx:2` (as it exists on
`fix/failing-release` today):

```ts
import { Grid, mergeClasses } from '@epam/ai-dial-ui-kit';
```

This imports `Grid` from the **root** entry, not
`@epam/ai-dial-ui-kit/grid`. This directly contradicts
`ui-kit-cold-load-follow-up-prompt.md`'s claim that "the catalog list imports
`Grid` from `@epam/ai-dial-ui-kit/grid`" — that migration is not present on
this branch (or was reverted; not investigated further, out of scope here).

Temporarily changed the import to the subpath and rebuilt `libs/catalog`
directly (`npx vite build` in `libs/catalog` — Nx's task cache repeatedly
served a stale cached build across several cache-clearing attempts, so all
Section 7 rebuilds in `ai-dial-chat` were done with direct `vite build`
invocations, bypassing Nx, to guarantee fresh output). This alone was **not
sufficient** — see §3.3.

### 3.3 Root cause #2 — `libs/catalog`'s own build doesn't externalize ui-kit subpaths

`libs/catalog/vite.config.mts`:

```ts
rollupOptions: {
  external: [
    'react', 'react-dom', 'react/jsx-runtime',
    '@epam/ai-dial-ui-kit',
    '@tabler/icons-react',
  ],
},
```

Rollup's `external` array does **exact string matching**. Listing
`'@epam/ai-dial-ui-kit'` externalizes only the bare root specifier — it does
**not** cover `'@epam/ai-dial-ui-kit/grid'` (or `/file-manager`, `/editors`).
So even after §3.2's import fix, Rollup could not externalize the subpath
import and instead **inlined the entire `Grid` module — AG Grid included —
into `libs/catalog`'s own `dist/index.js`**: confirmed by content grep
(`ag-grid-community`/`ModuleRegistry` markers went from present to absent
only after this fix) and by `dist/index.js` shrinking from 2,508,700 bytes /
213 modules to 983,551 bytes / 128 modules once corrected.

The fix (temporary, mirroring the pattern `@epam/ai-dial-ui-kit`'s own
`vite.config.ts` already uses via its `isExternalDependency` helper):

```ts
external: (id) =>
  ['react', 'react-dom', 'react/jsx-runtime', '@tabler/icons-react'].includes(id) ||
  id === '@epam/ai-dial-ui-kit' ||
  id.startsWith('@epam/ai-dial-ui-kit/'),
```

With **both** §3.2 and §3.3 applied (plus `manualChunks` still disabled),
`libs/catalog`'s own dist no longer contains any AG Grid marker. Rebuilding
`apps/chat` from this state: **`dial-ui-kit-CbGeRa5i.js` was still exactly
1,376,814 bytes / 389,671 bytes gzip and still contained 7 AG Grid content-
grep hits.** Catalog was not the only path.

### 3.4 Root cause #3 — the same eager-barrel pattern, one level up, in `chat-shared`

`libs/chat-shared/src/index.ts:62` re-exports `export * from './file-manager'`
at the package's own root barrel. `libs/chat-shared/src/file-manager/index.ts`
re-exports `DialFileManagerShell`, and
`libs/chat-shared/src/file-manager/DialFileManagerShell/DialFileManagerShell.tsx`
imports:

```ts
import { DialFileManager /* … */ } from '@epam/ai-dial-ui-kit';
```

— again the **root** entry, not `@epam/ai-dial-ui-kit/file-manager`. Per
this change's own `design.md` Context notes, `DialFileManager` statically
imports the legacy `DialGrid`, so this one import is sufficient to pull AG
Grid into anything that reaches `DialFileManagerShell` — and because
`chat-shared`'s **own root barrel** re-exports it unconditionally, every one
of the many eager, everyday consumers of `@epam/ai-dial-chat-shared` across
the app (contexts, hooks, generic utilities) shares a build graph with it.
This is the exact "eager root barrel re-exporting an optional heavy feature"
pattern this change fixed inside `@epam/ai-dial-ui-kit` itself
(`proposal.md`'s "Why") — reproduced independently, one level up, inside
`ai-dial-chat`'s own `chat-shared` library.

This was **not patched or measured further** (no fourth temporary edit
applied): confirming and fixing it would mean restructuring
`chat-shared`'s own export surface (introducing a `file-manager` subpath
boundary analogous to `@epam/ai-dial-ui-kit/file-manager`, or making
`DialFileManagerShell` itself lazy-loaded at every eager call site), which is
a real design decision for that repository, not a build-config tweak — and
is squarely outside `ai-dial-ui-kit`'s `allowedEditRoots`. Whether §3.2+§3.3
plus this third fix together would fully close the gap is not verified;
`chat-shared` may have the same missing-subpath-externalization issue as
`libs/catalog` (§3.3) once a `/file-manager`-shaped boundary exists.

## 4. Combined measurement (§3.1 + §3.2 + §3.3 applied together)

| Metric        |           Value | vs §2 baseline |
| ------------- | --------------: | -------------: |
| JS raw        | 3,605,411 bytes |           +227 |
| JS gzip       | 1,002,941 bytes |         −6,660 |
| CSS raw       |   287,098 bytes |         −5,051 |
| CSS gzip      |    49,932 bytes |         −1,996 |
| Combined gzip | 1,052,873 bytes |         −8,656 |

`dial-ui-kit-CbGeRa5i.js`: 1,376,814 bytes raw / 389,671 bytes gzip, still
carrying 7 AG Grid content-grep hits, still `modulepreload`'d — essentially
unchanged from §2/§3.1 (the small CSS/JS deltas above are from `libs/catalog`
no longer inlining ui-kit's CSS-relevant code, not from AG Grid moving).
**§3.4's root cause was not addressed, so the initial graph still contains
AG Grid** and the measured improvement is marginal (~0.8% of combined gzip).

## 5. Cleanup confirmation

All three temporary edits were reverted with `git checkout --` immediately
after measurement (`apps/chat/vite.config.mts`,
`libs/catalog/vite.config.mts`,
`libs/catalog/src/components/ListView/ListView.tsx`), and the temporarily
swapped `node_modules/@epam/ai-dial-ui-kit` was restored from a pre-change
backup (version `0.14.0-dev.30`, matching what was installed before this
verification began). `git status --short` in `ai-dial-chat` after cleanup
shows only the same pre-existing, unrelated dirty files that were present
before this verification started (`.claude/settings.json`,
`.claude/skills/lean-verification/SKILL.md`, `.mcp.json`,
`ui-kit-cold-load-follow-up-prompt.md`) — nothing from this investigation
was left behind or committed.

## 6. What this means for the two proposals this brief anticipated

- **`@epam/ai-dial-ui-kit` (this change, this repository): done.** Sections
  1–6 give this package genuine, fixture-proven cold-load isolation for the
  mixed eager-root + lazy-`./grid` scenario, under the same Vite 8 /
  Rolldown toolchain `ai-dial-chat` actually uses, independent of any
  consumer-side chunking configuration. Section 2's diagnosis already
  established the package's root-barrel topology was never the blocker
  (`design.md`'s resolved Open Question) — this section's real-consumer
  measurement is additional, convergent evidence for that conclusion:
  every gap found here traces to `ai-dial-chat`'s own source, not to
  anything `@epam/ai-dial-ui-kit` emits.
- **`ai-dial-chat`: needs its own, separate change**, not created here
  (outside `allowedEditRoots`), to:
  1. Fix `libs/catalog/src/components/ListView/ListView.tsx`'s `Grid` import
     to use `@epam/ai-dial-ui-kit/grid` (§3.2).
  2. Fix `libs/catalog/vite.config.mts`'s `rollupOptions.external` to match
     `@epam/ai-dial-ui-kit` subpaths, not just the exact root specifier
     (§3.3) — and audit every other `libs/*`/`apps/*` Vite config with a
     similar `external: [...]` array for the same exact-string gap against
     any multi-subpath package, not only this one.
  3. Decide how to resolve `chat-shared`'s own eager-root-barrel re-export
     of `DialFileManagerShell` (§3.4) — likely a `file-manager` subpath
     boundary on `@epam/ai-dial-chat-shared` mirroring the one this change
     added to `@epam/ai-dial-ui-kit`, plus fixing
     `DialFileManagerShell.tsx`'s own `DialFileManager` import to use
     `@epam/ai-dial-ui-kit/file-manager` once that boundary exists.
  4. Re-run this same measurement once (1)–(3) land, to see whether
     `apps/chat/vite.config.mts`'s `manualChunks` rule is then provably
     redundant (§3.1 suggests it already is, independent of the above) and
     can be removed.
- **`ui-kit-cold-load-follow-up-prompt.md`'s "Evidence from `ai-dial-chat`"
  section is stale for the branch checked here** (`fix/failing-release`):
  its claims that the blanket `manualChunks` rule was removed and that the
  catalog list already imports from `@epam/ai-dial-ui-kit/grid` do not hold
  on this branch. Whoever picks up the `ai-dial-chat`-side follow-up should
  re-verify current state rather than relying on that document's snapshot.

## 7. `./core` fallback

Not needed. Section 2/3's diagnosis found no package-level defect to work
around; the fallback entry described in `proposal.md`'s Compatibility note
and `design.md` Decision 2 was never invoked.

## Consumer follow-up — 2026-09-08: retained root editor loader

The earlier statement that the package itself was fully proven correct was broader than the covered scenarios. A separate Vite 8.0.16 / Rolldown production fixture now reproduces a remaining package-entry interaction without chat code or manual chunking.

The fixture eagerly imports `Button` and `LazyMarkdownEditor` from the root, retains both (`Object.assign(window, { Button, LazyMarkdownEditor })`), renders a button, and dynamically imports a separate module that imports `Grid` from `@epam/ai-dial-ui-kit/grid`. It uses the locally built and packed 0.0.0 artifact, including guarded first-render AG Grid registration.

Result: initial JS is 1,457,238 raw / 417,119 gzip bytes, including bundled `ag-grid-community` and `ag-grid-react`. Moving only the editor loader to the public `./editors` entry in the equivalent root-Grid fixture yields 283,977 raw / 91,619 gzip bytes and no forbidden initial modules. The full chat with all three editor consumers migrated to `./editors` also passes: 616,041 gzip JS + 37,248 gzip CSS = 653,289 gzip bytes, and Grid remains in a reachable lazy file-manager chunk. The chat result confirms that the subpath workaround applies to its real `./grid` catalog consumer too.

The emitted root `dist/dial-ui-kit.js` defines the lazy loader functions inline, whereas `dist/editors.js` defines separate copies. Retaining a loader therefore retains runtime code in the root aggregator. The measured root-vs-subpath difference identifies this entry topology as the remaining issue; extracting shared loader leaf modules is the first proposed fix and still requires verification. Merely changing registration placement, deleting manual chunks, or checking root-only Button cannot detect or resolve this case.

Reproduction (ordinary Vite React production build, React 19, Vite 8.0.16):

```tsx
// main.tsx
import { Button, LazyMarkdownEditor } from '@epam/ai-dial-ui-kit';
import { createRoot } from 'react-dom/client';
Object.assign(window, { Button, LazyMarkdownEditor });
const root = createRoot(document.getElementById('root')!);
root.render(
  <Button
    label="Open Grid"
    onClick={async () => {
      const { GridFeature } = await import('./grid-feature');
      root.render(<GridFeature />);
    }}
  />,
);

// grid-feature.tsx
import { Grid } from '@epam/ai-dial-ui-kit/grid';
export const GridFeature = () => (
  <Grid columnDefs={[{ field: 'name' }]} rowData={[{ name: 'Smoke row' }]} />
);
```

For the passing variant import `LazyMarkdownEditor` from `@epam/ai-dial-ui-kit/editors`. The final regression fixture should expose an editor-opening action rather than only retaining the loader. Task section 9 tracks this missing coverage and package fix; none of those tasks is claimed complete here. The consumer can finish its scoped cold-load optimization using the existing public subpaths while this root compatibility hardening is implemented separately.

## Section 9 resolution — 2026-09-08

Fixed. `src/index.ts` and `src/subpaths/editors.ts` no longer each declare
their own inline copy of `LazyDialJsonEditor`/`LazyDialMarkdownEditor`/
`LazyMarkdownEditor` — both now re-export the same shared leaf modules
(`src/components/JsonEditor/lazy.ts`, `src/components/MarkdownEditor/lazy.ts`,
`src/components/New/MarkdownEditor/lazy.ts`), so a consumer's bundler sees
one physical chunk per loader shared across every entry instead of each
entry's own dynamic-import edge. `src/mcp/generate-manifest.ts` was updated
to follow that re-export back to the leaf module so its lazy-loading
metadata attachment keeps working unchanged.

Reproduced the exact failure first (`fixtures/consumer-mixed-grid-editor-loader`,
pinned to the reported Vite `8.0.16`): confirmed AG Grid in the static
chunk before the fix, confirmed it gone after. Re-verified against the real
`ai-dial-chat` app via its own `npm run verify:cold-load`: `"violations":
[]`, `652,115` total gzip bytes (matching this document's `653,289` byte
result above within normal build variance), AG Grid confirmed confined to
the lazy file-manager chunk. Full write-up, byte counts, and the Rolldown-
version-dependence finding are in `diagnosis-baseline.txt`'s "Section 9"
entry.

Not done: publishing a registry release containing this fix (a maintainer
action requiring publish credentials, outside this change's scope) — see
`diagnosis-baseline.txt` §7.
