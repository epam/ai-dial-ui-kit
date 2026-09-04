/**
 * `@epam/ai-dial-ui-kit/editors` - curated subpath for the JSON/Markdown
 * editor lazy loaders.
 *
 * These loaders are intentionally re-declared here (not re-exported from a
 * shared helper module) rather than imported from `../index`: `src/index.ts`
 * exports them as top-level `export const LazyX = () => import('./path')`
 * declarations because `src/mcp/generate-manifest.ts` pattern-matches that
 * shape to discover and
 * attach lazy-loading metadata to `DialJsonEditor`/`DialMarkdownEditor`/
 * `MarkdownEditor` (2.0) in the published MCP component manifest. Each
 * dynamic `import()` below targets the same module as its `src/index.ts`
 * counterpart, so both entry points preserve the same lazy boundaries.
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
