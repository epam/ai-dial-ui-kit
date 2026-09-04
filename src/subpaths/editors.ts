/**
 * `@epam/ai-dial-ui-kit/editors` - curated subpath for the JSON/Markdown
 * editor lazy loaders.
 *
 * These loaders are intentionally re-declared here (not re-exported from a
 * shared helper module) rather than imported from `../index`: `src/index.ts`
 * exports them as top-level `export const LazyX = () => import('./path')`
 * declarations because `src/mcp/generate-manifest.ts` pattern-matches that
 * exact shape (see its "Lazy component loader" AST check) to discover and
 * attach lazy-loading metadata to `DialJsonEditor`/`DialMarkdownEditor`/
 * `MarkdownEditor` (2.0) in the published MCP component manifest - routing
 * these through an intermediate re-export broke that detection during this
 * change's own development (verified: manifest component/hook/util counts
 * regressed from 162/24/2 to 116/11/108 when the loaders were re-exported
 * from a shared file, and were restored by reverting `src/index.ts` to this
 * exact inline form). Each dynamic `import()` below targets the same module
 * as its `src/index.ts` counterpart, so both entry points produce the same
 * lazy chunk per module - see
 * openspec/changes/modularize-package-exports/design.md Decision 1 and the
 * "Existing JSON/Markdown editor lazy-loading boundaries are preserved
 * unchanged" requirement in specs/package-distribution/spec.md.
 */

// JSON Editor - lazy loader to avoid loading in SSR
export const LazyDialJsonEditor = () =>
  import('../components/JsonEditor/JsonEditor');

// Markdown Editor - lazy loader to avoid loading in SSR
export const LazyDialMarkdownEditor = () =>
  import('../components/MarkdownEditor/MarkdownEditor');

// Markdown Editor (2.0) - lazy loader to avoid loading in SSR
export const LazyMarkdownEditor = () =>
  import('../components/New/MarkdownEditor/MarkdownEditor');

// Markdown/JSON container - kept behind a loader so importing this subpath
// does not eagerly pull either editor implementation into a consumer graph.
export const LazyDialMarkdownEditorContainer = () =>
  import('../components/MarkdownEditor/MarkdownEditorContainer');

export { EditorThemes } from '../types/editor';
export type { MarkdownEditorProps } from '../components/New/MarkdownEditor/MarkdownEditor';
export type { DialMarkdownEditorContainerProps } from '../components/MarkdownEditor/MarkdownEditorContainer';
