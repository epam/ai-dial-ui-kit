# Consumer fixtures

These fixtures are not published or included in the library build. Each
subdirectory is a standalone Vite app
that installs the **packed tarball** of `@epam/ai-dial-ui-kit` (never a source
alias) and exercises one import pattern real consumers use, so the assertions
below reflect what a real consumer's bundler would actually resolve.

## Fixtures

| Fixture | Imports | Asserts |
| --- | --- | --- |
| `consumer-esm` | `{ Button }` from root | static graph excludes AG Grid + all editor packages; built bundle mounts an accessible button |
| `consumer-grid` | `{ Grid }` (2.0) from root | static graph includes AG Grid, excludes editor packages |
| `consumer-file-manager` | `{ DialFileManager }` from root | static graph includes AG Grid, excludes editor packages |
| `consumer-json-editor` | `LazyDialJsonEditor()` | Monaco present only in a dynamic chunk; AG Grid/`@uiw/*` absent |
| `consumer-markdown-editor` | `LazyDialMarkdownEditor()` + `LazyMarkdownEditor()` | `@uiw/*` present only in a dynamic chunk; AG Grid/Monaco absent |

## Regenerating the tarball and rebuilding a fixture

```bash
# from the repo root, after any change to the published package:
npm pack --pack-destination fixtures/.tarballs

# then, per fixture that needs the refreshed tarball:
cd fixtures/<fixture-name>
rm -rf node_modules/@epam/ai-dial-ui-kit
npm install
npm run build
npm run assert
```

`npm run assert` runs `../shared/assert-static-graph.mjs` against that
fixture's own `dist/graph-report.json` (written by
`../shared/graph-report-plugin.mjs` during `vite build`). See that script's
header comment for how the static-vs-dynamic graph and the forbidden/required
package checks are computed. Installing the tarball and reading bundler
metadata makes the checks match what a real consumer resolves instead of
inspecting the library's local `dist/` output.

`node_modules/`, `dist/`, and `.tarballs/*.tgz` under this directory are
git-ignored - regenerate them locally as shown above.
