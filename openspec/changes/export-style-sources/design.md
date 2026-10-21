## Context

Measured facts:

- `package.json#exports` exposes `.`, `./grid`, `./editors`, `./styles.css`; `files` is `["dist"]`; `build:css` is `tailwindcss -m -i ./src/styles/tailwind-entry.scss -o ./dist/index.css`.
- `src/styles/` holds 19 files. `tailwind-entry.scss` `@import`s them, declares `@layer ui.theme, ui.base, ui.components, ui.utilities`, imports Tailwind's theme with `reference inline`, then `theme.scss`.
- `theme.scss` is a single `@theme inline reference { … }` block of `--background-color-*`, `--border-color-*`, `--text-color-*`, shadow, radius and font keys, each as `var(--bg-…, fallback)`. It has no relative imports.
- `mixins.scss` declares `@utility dial-mixin-*` sets. `typography.scss` defines `.dial-*-text` classes via `@apply`, some through those mixins, plus global `h1`/`h2`/`h3`. Neither has relative imports. Both are unlayered.
- The compiled `dist/index.css` already contains `.dial-*-text` and the `h1`–`h3` rules (checked in `0.16.0-dev.22`). It does not contain host-written utilities.
- Measured while implementing: Sass fails on `theme.scss` at `fill: --value(--background-color-*)` (`Expected expression`), and a bare `@import 'tailwindcss'` does not resolve in Sass, while a Sass `@import` of a `.css` path is emitted untouched (checked with `sass` 1.99 in `fixtures/consumer-styles`).
- `tools/verify-pack-contents.mjs` asserts every file under `dist/` is in the pack and every `exports` target exists in it. `fixtures/run-all.mjs` packs once and builds every `fixtures/*` against the tarball.

Assumption, still to re-prove in the admin app: a Next.js host (sass-loader → PostCSS/Tailwind) resolves the `.css` imports through the `style` export condition. The kit fixture proves it for the Tailwind CLI, with and without a Sass pass first.

## Goals / Non-Goals

**Goals:** a v4 host can import the kit's tokens, mixins and type scale from the package; resolution works for Sass and CSS import resolvers; nothing about the existing package changes.

**Non-Goals:** see the proposal.

## Decisions

### D1. Copy the three files into `dist/styles/`, don't publish `src/`

Options compared:

| Option                                                                 | Effect                                                                                                                                                                                                          | Verdict    |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| A. Add `src/styles` to `files`, export `./styles/*` → `./src/styles/*` | Publishes all 19 partials and invites imports of the entry and component partials. Puts source next to `dist/src` d.ts output. `verify-pack-contents` only checks `dist/`, so the guarantee would not cover it. | Rejected   |
| B. Copy three files to `dist/styles/`, explicit exports                | `files` stays `["dist"]`; the existing "whole `dist/` is packed and every export target exists" check covers it with no change; surface is exactly three files.                                                 | **Chosen** |
| C. Pre-compile them to plain CSS                                       | `theme.scss` is `@theme` and `mixins.scss` is `@utility`; both are Tailwind compile-time constructs with no plain-CSS form. Only typography could be compiled, and the compiled sheet already has it.           | Rejected   |
| D. Do nothing; host keeps copying                                      | The status quo this change exists to end.                                                                                                                                                                       | Rejected   |

Export entries are explicit (no wildcard) so a future partial is not exposed by accident.

### D2. Publish as `.css`, export with `style` and `default`

```
"./styles/theme.css": { "style": "./dist/styles/theme.css", "default": "./dist/styles/theme.css" }
```

The copy step renames `X.scss` to `X.css`. The files use Tailwind v4 syntax Sass cannot parse (`--value()`), so publishing them as `.scss` would make them unusable from a Sass-first host such as the admin app; as `.css` a Sass entry keeps the `@import` as written and Tailwind's PostCSS step resolves it. Tailwind v4's resolver asks for the `style` condition; `default` covers everything else. No `sass` condition: Sass never resolves a `.css` import itself. No `import`/`require`: these are not JS. A Sass host must also spell Tailwind's own imports with `.css` paths (`tailwindcss/theme.css`, …) because a bare `@import 'tailwindcss'` is looked up as a Sass file.

Alternatives: keep `.scss` names (Sass hosts cannot load them; the admin would need a plain-CSS entry and lose its single Sass compilation), or rewrite `--value()` with Sass interpolation (the Tailwind CLI would then read the raw `#{…}`; one file cannot serve both).

### D3. Keep the files import-free and self-contained

The three source files have no relative `@import`s today. The build step asserts that stays true (fails if a copied file contains `@import`/`@use`), because a relative import would break the moment the file leaves `src/styles/`.

### D4. Document an import order, enforce nothing

`typography.scss` needs `mixins.scss` visible in the same Tailwind compilation (`@apply dial-mixin-*`), and neither compiles without Tailwind v4 in the host. The README states the order (theme → mixins → typography, after `@import 'tailwindcss'`) and that a missing mixin fails the host's build loudly. Not a peer dependency (D-alternative in the proposal).

### D5. The three files become a public contract

Renaming a theme key, mixin or `.dial-*-text` class is then consumer-breaking, so each file gets a header comment stating that, and the existing breaking-change process covers it.

### D6. Style-layer effect (state per the config's design rules)

- ESM tree shaking, JS root/subpath imports, CJS `require()`, `.d.ts`: unaffected — no JS or type output changes.
- Existing lazy-load boundaries (JSON/Markdown editors): unaffected.
- CSS delivery: `dist/index.css` unchanged; the exported files are additive and optional.
- `npm pack`: three added files under `dist/styles/`; `verify-pack-contents` covers them through its existing `dist/` walk and `exports` check.
- `sideEffects`: `package.json` has no `sideEffects` change; `.scss` files are not reachable from JS entries.

## Risks / Trade-offs

- **Resolution differs per toolchain** (assumption above) → risk-first task proves it with a real Tailwind v4 CLI fixture, and the admin app change re-proves it under Next + sass-loader before relying on it.
- **Public-surface creep** → explicit exports, no entry or component partials, header comments (D5).
- **`@apply` needs host Tailwind v4** → documented (D4); fails at build, not at runtime.
- **Typography is already usable from the compiled `styles.css`** — a host that only wants the type scale does not need this change; it can use `dial-*-text` and override by cascade today. This change is justified by `theme.scss` (host-generated token utilities); typography and mixins ride along because the host asked to take the scale from source and be able to replace it wholesale by dropping the import. If that is not wanted, drop `typography.scss` and keep only theme (+ nothing else, since mixins exist only for typography).
- **Dev version churn** → consumers pin a `-dev` tag until 0.16.0 is released.

## Migration Plan

Additive. Release in 0.16.0 under `### Added`. Consumers opt in per import; none are required to change.

## Open Questions

- Should the global `h1`–`h3` rules move to their own file (e.g. `headings.scss`) so a host can take the `.dial-*-text` classes without restyling every heading? Splitting is itself a change to the file layout that the host's import would depend on, so it should be decided before the first release of these exports, not after.
- Do any `.dial-*-text` classes missing from `0.16.0-dev.22`'s compiled CSS (`.dial-small-semi-text`, `.dial-body-semi-text`, …) exist only on `development`? Expected yes (the file has grown since), but confirm when cutting the version the admin app pins.
