# package-distribution Specification

## Purpose

Governs how `@epam/ai-dial-ui-kit` is built and packaged so that consumers who
only need core components are not forced to load Grid (AG Grid) or editor
(Monaco / `@uiw/*`) dependencies, while consumers who do use Grid, FileManager,
or the JSON/Markdown editors keep full, unbroken functionality — all without
dropping or renaming any existing export, subpath, or stylesheet.

## Requirements

### Requirement: Root ESM entry is tree-shakeable for non-Grid, non-editor components

Importing a basic component from the backward-compatible root `@epam/ai-dial-ui-kit` ESM entry SHALL NOT include `ag-grid-community`, `ag-grid-react`, `@monaco-editor/react`, `monaco-editor`, `@uiw/react-md-editor`, or `@uiw/react-markdown-preview` code in that consumer's complete static initial module graph.

#### Scenario: Consumer imports Button from the root

- **WHEN** a consumer fixture statically imports `{ Button }` from
  `@epam/ai-dial-ui-kit` (the packed tarball, installed like a real
  dependency) and runs its own production bundler build
- **THEN** the bundler's build metadata/manifest shows the fixture's complete
  static initial graph contains no module from `ag-grid-community`,
  `ag-grid-react`, `@monaco-editor/react`, `monaco-editor`,
  `@uiw/react-md-editor`, or `@uiw/react-markdown-preview`

#### Scenario: Root import still resolves and renders

- **WHEN** the same fixture renders the imported `Button`
- **THEN** the component mounts and behaves exactly as it does today from the
  existing root import, with no prop, behavior, or accessible-name change

### Requirement: Optional `./core` subpath carries the same tree-shaking guarantee as root

If a curated `./core` (or equivalently named) export subpath is introduced, it SHALL satisfy the same static-graph exclusion as the root entry, in addition to — not instead of — the root guarantee.

#### Scenario: `./core` fixture matches root fixture's exclusions

- **WHEN** a consumer fixture imports the same basic component from
  `@epam/ai-dial-ui-kit/core` instead of the root
- **THEN** its complete static initial graph also excludes
  `ag-grid-community`, `ag-grid-react`, `@monaco-editor/react`,
  `monaco-editor`, `@uiw/react-md-editor`, and `@uiw/react-markdown-preview`

### Requirement: Grid and FileManager features are isolated but fully functional when imported

Both Grid generations (`DialGrid` and 2.0 `Grid`) and `DialFileManager` SHALL be excluded from the initial graph of consumers that do not import them, and SHALL perform their required AG Grid module registration exactly when a consumer's static graph actually reaches that feature.

#### Scenario: Grid fixture includes AG Grid but no editor dependencies

- **WHEN** a consumer fixture statically imports `Grid` (or `DialGrid`) from
  `@epam/ai-dial-ui-kit` and runs its production bundler build
- **THEN** the fixture's feature graph includes `ag-grid-community` and
  `ag-grid-react`, and its static initial graph excludes
  `@monaco-editor/react`, `monaco-editor`, `@uiw/react-md-editor`, and
  `@uiw/react-markdown-preview`

#### Scenario: FileManager fixture includes AG Grid but no editor dependencies

- **WHEN** a consumer fixture statically imports `DialFileManager` from
  `@epam/ai-dial-ui-kit` and runs its production bundler build
- **THEN** the fixture's feature graph includes `ag-grid-community` and
  `ag-grid-react`, and its static initial graph excludes
  `@monaco-editor/react`, `monaco-editor`, `@uiw/react-md-editor`, and
  `@uiw/react-markdown-preview`

#### Scenario: AG Grid module registration runs when Grid is reached

- **WHEN** the Grid fixture renders `Grid`/`DialGrid` with at least one row
- **THEN** `ModuleRegistry.registerModules([AllCommunityModule])` has executed
  and the grid renders that row's data, matching current pre-change behavior

### Requirement: Existing JSON/Markdown editor lazy-loading boundaries are preserved unchanged

`LazyDialJsonEditor`, `LazyDialMarkdownEditor`, `LazyMarkdownEditor` (2.0), and the nested Monaco load inside `MarkdownEditorContainer` / `SchemaAdditionalPropertiesEditor` SHALL remain dynamic-import boundaries in both the ESM and CJS builds, with Monaco kept separate from `@uiw/*` implementation code.

#### Scenario: JSON editor fixture keeps Monaco out of the static graph

- **WHEN** a consumer fixture calls `LazyDialJsonEditor()` (or renders
  `DialSchemaRenderer`/`DialMarkdownEditorContainer` without switching to JSON
  mode) and runs its production bundler build
- **THEN** `@monaco-editor/react` and `monaco-editor` are absent from the
  fixture's static initial graph and appear only in a chunk loaded by the
  existing dynamic `import()`

#### Scenario: Markdown editor fixture keeps `@uiw/*` behind its loader

- **WHEN** a consumer fixture calls `LazyDialMarkdownEditor()` or
  `LazyMarkdownEditor()` without triggering JSON mode
- **THEN** `@uiw/react-md-editor` and `@uiw/react-markdown-preview` are absent
  from the fixture's static initial graph and appear only in a
  dynamically-loaded chunk

#### Scenario: Nested JSON-editor load inside Markdown container stays lazy

- **WHEN** the Markdown editor fixture switches `DialMarkdownEditorContainer`
  into JSON mode at runtime
- **THEN** the nested `import('@/components/JsonEditor/JsonEditor')` resolves
  at that point, matching current pre-change behavior, and Monaco was not part
  of any static or eagerly-loaded chunk before the switch

### Requirement: Root and every declared subpath resolve identically under ESM, CJS, and TypeScript

Every export the package declares today, plus any new subpath added by this change, SHALL resolve correctly under Node ESM `import`, Node CJS `require()`, and TypeScript's module resolution, with no dropped or renamed symbol.

#### Scenario: Full root export surface still compiles

- **WHEN** a TypeScript fixture imports every currently-exported value and
  type name from the captured baseline export list (recorded before the
  module-layout change) from the root `@epam/ai-dial-ui-kit` entry
- **THEN** the fixture type-checks with no missing-export or type errors

#### Scenario: CJS `require()` resolves the root entry

- **WHEN** a CJS fixture calls `require('@epam/ai-dial-ui-kit')`
- **THEN** the same set of value exports is present on the returned module
  object, and this is treated as a resolution/compatibility guarantee only —
  not a claim that `require()` output is tree-shaken

#### Scenario: New subpaths resolve under ESM, CJS, and TypeScript

- **WHEN** a fixture imports from each newly declared subpath (e.g.
  `./grid`, `./file-manager`, `./editors`) via `import`, `require`, and a
  TypeScript type-only import
- **THEN** each resolves without error and exposes the symbols documented for
  that subpath

### Requirement: `./styles.css` remains a complete, backward-compatible aggregate stylesheet

The existing `./styles.css` export SHALL continue to include every rule it includes today (including Grid and Markdown editor styles), so no existing consumer's stylesheet import needs to change.

#### Scenario: Aggregate stylesheet still contains feature CSS

- **WHEN** `dist/index.css` is rebuilt after this change
- **THEN** it still contains the Grid (`ag-grid.scss`, `grid.scss`) and
  Markdown editor (`markdown-editor.scss`) rules present in the pre-change
  build, and no acceptance criterion claims those rules were removed from it

#### Scenario: Optional per-feature stylesheet is additive only

- **WHEN** an optional `./core.css`, `./grid.css`, or `./editors.css` entry is
  introduced
- **THEN** it exists in addition to, and does not replace or require migrating
  away from, `./styles.css`

### Requirement: Packed tarball contains every declared export and its transitive chunks

An `npm pack` of the package SHALL include every file referenced by `package.json#exports` (JS/CJS/types/styles) for the root and every declared subpath, plus every chunk reachable from them, whether statically or via a lazy `import()`.

#### Scenario: Dry-run pack matches declared exports

- **WHEN** `npm pack --dry-run` (or inspection of an actual `npm pack`
  tarball) is run against the built package
- **THEN** every file path referenced by `package.json#exports` for `.` and
  every declared subpath is present in the tarball, and every JS chunk that a
  consumer-fixture build's manifest marks as reachable (statically or lazily)
  from a declared entry is also present

#### Scenario: Existing root export surface still compiles from the packed tarball

- **WHEN** the TypeScript fixture from the resolution requirement above is run
  against the packed tarball (not source aliases)
- **THEN** it type-checks with the same result as building against source
