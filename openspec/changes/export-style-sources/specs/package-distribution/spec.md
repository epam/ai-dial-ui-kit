## ADDED Requirements

### Requirement: Theme, mixins and typography styles are published as CSS through explicit exports

The package SHALL ship `theme.css`, `mixins.css` and `typography.css` under `dist/styles/` and SHALL expose exactly `./styles/theme.css`, `./styles/mixins.css` and `./styles/typography.css` in `package.json#exports`, each with `style` and `default` conditions pointing at the same file; they SHALL be plain `.css` because they contain Tailwind v4 syntax that Sass cannot parse. No other file under `src/styles/` (including `tailwind-entry.scss` and the component partials) SHALL be exported. The existing `.`, `./grid`, `./editors` and `./styles.css` entries and the contents of `dist/index.css` SHALL be unchanged.

#### Scenario: Declared exports exist in the pack

- **WHEN** `npm pack --dry-run --json` is run on the built package
- **THEN** `dist/styles/theme.css`, `dist/styles/mixins.css` and `dist/styles/typography.css` are in the file list
- **AND** `node tools/verify-pack-contents.mjs` exits zero

#### Scenario: Surface is exactly three style exports

- **WHEN** `package.json#exports` is read
- **THEN** its `./styles/*` keys are exactly `./styles/theme.css`, `./styles/mixins.css` and `./styles/typography.css`, and no wildcard export exists

#### Scenario: Existing exports are untouched

- **WHEN** the built `dist/index.css` and the root export surface are compared with the pre-change baseline (`tools/baselines/root-exports.json`, `node tools/compare-css-rules.mjs`)
- **THEN** no difference is reported

### Requirement: Exported style sources are self-contained

Each exported file (built from `src/styles/{theme,mixins,typography}.scss`) SHALL be usable from its published location: it SHALL contain no `@import` or `@use` of another file, so that copying it out of `src/styles/` cannot break it. The copy step SHALL fail the build if an exported file contains one.

#### Scenario: Build fails on a relative import

- **WHEN** an exported source file gains an `@import './x.scss'` line and `npm run build` runs
- **THEN** the style-copy step exits non-zero naming the file

### Requirement: Exported style sources compile in a Tailwind v4 host from the packed tarball

A host stylesheet that imports the three exports, in the order `theme.css`, `mixins.css`, `typography.css`, after Tailwind v4's own imports, SHALL compile with `@tailwindcss/cli` against the packed tarball (not a source alias) without error or warning, and the output SHALL contain the type-scale classes and the theme-derived utilities the host wrote.

#### Scenario: Host utilities are generated from kit tokens

- **WHEN** the `consumer-styles` fixture's markup uses `bg-layer-base` and `text-secondary` and its stylesheet imports the three exports
- **THEN** the compiled CSS contains rules for both utilities whose values are the kit's `var(--bg-layer-base, …)` and `var(--text-secondary, …)` forms
- **AND** no `:root` declaration of a Tailwind theme variable (`--font-sans`, `--spacing`, `--color-*`) is emitted

#### Scenario: Typography classes compile

- **WHEN** the same fixture is compiled
- **THEN** the output contains `.dial-small-text`, `.dial-body-text` and the global `h1` rule with the kit's font size and line height

#### Scenario: Host can override a kit typography class

- **WHEN** the fixture adds, after the kit import, a rule redefining `.dial-small-text` with a different `line-height`
- **THEN** in the compiled CSS the host's rule follows the kit's rule in source order, so the host's value wins

#### Scenario: Missing mixins fail loudly

- **WHEN** the fixture imports `typography.css` without `mixins.css`
- **THEN** compilation fails with an `@apply` error naming a `dial-mixin-*` utility

### Requirement: Style exports resolve for CSS import resolvers and survive a Sass pass

`@epam/ai-dial-ui-kit/styles/<name>.css` SHALL resolve to the same file whether the resolver asks for the `style` or the default condition, and a Sass entry that `@import`s the three specifiers SHALL emit those imports unchanged so Tailwind can resolve them afterwards.

#### Scenario: Conditions agree

- **WHEN** a Node script resolves each of the three specifiers from the installed tarball under the `style` condition and under none
- **THEN** all six resolutions succeed and, per specifier, point at one identical file

#### Scenario: Sass-first host

- **WHEN** the fixture's `host.scss` (Tailwind's own imports spelled with `.css` paths, the three kit imports, and a Sass variable used in a rule) is compiled by the Sass JS API and the result is then compiled by `@tailwindcss/cli`
- **THEN** both steps succeed and the output contains `bg-layer-base`, `text-secondary`, `.dial-small-text`, `.dial-body-text` and the rule that used the Sass variable
