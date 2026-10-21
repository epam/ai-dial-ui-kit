## Why

A Tailwind v4 host cannot reuse the kit's design tokens. `@epam/ai-dial-ui-kit` ships only the compiled `dist/index.css` (`package.json:37-40` exposes `./styles.css`; `files` is `["dist"]`). The compiled sheet contains the utilities the kit's own components use, not the ones a host writes, so a host that wants `bg-layer-base` or `text-secondary` in its own markup has to copy the kit's color scales by hand. `ai-dial-admin-frontend` does exactly that today (`tailwind.config.js` mirrors `src/styles/theme.scss`; `fonts.scss` re-implements `typography.scss`), and the copies drift.

Since 0.16.0 (#937) the sources a v4 host needs already exist as clean CSS-first partials (`theme.scss`, `mixins.scss`, `typography.scss`). They are just not in the package.

## What Changes

- Add a build step that copies `src/styles/theme.scss`, `mixins.scss` and `typography.scss` into `dist/styles/` as plain `theme.css`, `mixins.css` and `typography.css`.
- Add three `package.json#exports` entries: `./styles/theme.css`, `./styles/mixins.css`, `./styles/typography.css`, each with `style` and `default` conditions. They are `.css` because they hold Tailwind v4 syntax (`@theme`, `@utility`, `--value()`) that Sass cannot parse; Sass passes a `.css` `@import` through, so a Sass-first host (Next.js with sass-loader) and a Tailwind-CLI host both work.
- Add a consumer fixture that compiles a host stylesheet importing the three exports from the **packed tarball** with `@tailwindcss/cli` — directly, and through a Sass entry compiled first — and asserts the output.
- Extend `verify-pack-contents` expectations so the three files are checked against `exports`.
- Document the host contract (what to import, in which order, what the host must provide) in the README and `CHANGELOG.md` under `### Added`.
- **Not breaking:** new `exports` entries only; `.`, `./grid`, `./editors`, `./styles.css` and the compiled CSS are byte-identical. No migration guide (AGENTS.md "Breaking changes" does not apply).

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `package-distribution`: the package additionally publishes the theme, mixins and typography SCSS sources through `exports`, with automated verification that they resolve and compile in a Tailwind v4 host.

## Impact

- `package.json` (`exports`, `scripts`), a new copy tool under `tools/`, `tools/verify-pack-contents.mjs` (covered automatically because it walks `dist/`), a new `fixtures/consumer-styles/`, `fixtures/run-all.mjs` (picks the fixture up by directory), `README.md`, `CHANGELOG.md`.
- `src/styles/*.scss` become a de-facto public surface: renaming a theme key, an `@utility dial-mixin-*` name or a `.dial-*-text` class becomes a consumer-visible change (CHANGELOG + migration guide per AGENTS.md). The three files get a header comment saying so.
- Package size: three small text files.
- First consumer: `ai-dial-admin-frontend` (change `tailwind-v4-migration`), which is blocked on a `0.16.0-dev.*` containing this.

## Non-goals

- Exporting `tailwind-entry.scss`. Its `@source '../**/*.{ts,tsx,scss}'` paths are relative to the kit's source tree and meaningless inside a package; a host composing its own entry is the supported path.
- Exporting component partials (`buttons`, `ag-grid`, `grid`, …). They style kit components already covered by `styles.css`; exporting them would let a host ship them twice.
- Changing the compiled `dist/index.css`, cascade layers, or any class name.
- Splitting the global `h1`–`h3` rules out of `typography.scss` (listed as an open question in the design).
- Making `tailwindcss` a peer dependency; the SCSS exports are only meaningful in a v4 host, which is documented rather than enforced.

## Rollback

Remove the three `exports` entries and the copy step. Nothing else depends on them; a consumer that adopted them falls back to `styles.css`.
