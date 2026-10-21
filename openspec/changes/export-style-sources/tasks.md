## 1. Prove the riskiest assumption first

- [x] 1.1 Add `fixtures/consumer-styles/` (`package.json` depending on `file:../.tarballs/ai-dial-ui-kit.tgz` plus `tailwindcss` and `@tailwindcss/cli` v4 matching the root's `^4.3.3`; `src/host.css` with `@import 'tailwindcss/…'`, the three kit imports in order, and a host override of `.dial-small-text`; `src/index.html` using `bg-layer-base` and `text-secondary`). Scripts: `build` (`tailwindcss -i src/host.css -o dist/host.css`) and `assert`.
      **Verification:** `node fixtures/run-all.mjs` builds the fixture; it fails now (exports do not exist) — that failing run is the baseline.
- [x] 1.2 Write `fixtures/consumer-styles/assert.mjs` for the spec's scenarios: utilities from tokens present with `var(--bg-…, …)` values, no `:root` theme variables, `.dial-small-text`/`.dial-body-text`/`h1` present, host override after the kit's rule, and the missing-mixin case fails with a `dial-mixin-*` error.
      **Verification:** `cd fixtures/consumer-styles && npm run build && npm run assert` passes once task 2 lands.
- [x] 1.3 Add a resolution check `fixtures/consumer-styles/resolve.mjs`: resolve each of the three specifiers under the `style` condition and under none with `node --conditions`; assert one file per specifier. `build.mjs` also compiles `src/host.scss` with the Sass JS API and runs Tailwind over the result; `assert.mjs` checks the same classes plus the Sass-variable rule.
      **Verification:** `node fixtures/consumer-styles/resolve.mjs` exits zero after task 2.

## 2. Publish the sources

- [x] 2.1 Add `tools/copy-style-sources.mjs`: copy `src/styles/{theme,mixins,typography}.scss` to `dist/styles/` renamed to `.css`; exit non-zero naming the file if a copy contains `@import` or `@use`.
      **Verification:** `node tools/copy-style-sources.mjs` creates the three files; after appending `@import './x.scss'` to a temp copy of the source list, the script exits non-zero (covered by a vitest spec `tools/copy-style-sources.spec.ts`, run with `npx vitest run tools/copy-style-sources.spec.ts`).
- [x] 2.2 Wire the step into `package.json`: new `build:styles` script, appended to `build` after `build:css`; add the three `exports` entries with `style`/`default` conditions (`./styles/theme.css`, `./styles/mixins.css`, `./styles/typography.css`).
      **Verification:** `npm run build && npm run verify:distribution` — `verify-pack-contents` confirms the three files are in the pack and every export target exists; `node tools/compare-css-rules.mjs` reports no change to `dist/index.css`.
- [x] 2.3 Add a header comment to `src/styles/theme.scss`, `mixins.scss`, `typography.scss` stating they are a public contract (rename = breaking change per AGENTS.md) and that they must stay import-free.
      **Verification:** `npm run build:css` output is byte-identical to before (`node tools/compare-css-rules.mjs`); `npm run format` passes.

## 3. Documentation

- [x] 3.1 `README.md`: add a "Using the kit's tokens and type scale from your own Tailwind v4 stylesheet" section — the three imports in order, that Tailwind v4 must be in the host, that a missing mixin fails the build, how to override a `.dial-*-text` class (a later rule), and that `styles.css` still works unchanged.
      **Verification:** `npx prettier --check README.md`; the snippet in the README is the same text as `fixtures/consumer-styles/src/host.css` (assert in `assert.mjs` by string-comparing the three `@import` lines).
- [x] 3.2 `CHANGELOG.md`: under `## [0.16.0]` → `### Added`, an entry for the three style exports. No `### Breaking Changes` entry and no migration guide — additive.
      **Verification:** `npx prettier --check CHANGELOG.md`.

## 4. Quality checks

- [ ] 4.1 Run `npm run typecheck && npm run lint && npm run test:run && npm run build && npm run build:css && npm run verify:distribution` — all pass, including the new fixture.
