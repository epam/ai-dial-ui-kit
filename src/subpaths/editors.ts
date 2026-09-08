/**
 * `@epam/ai-dial-ui-kit/editors` - curated subpath for the JSON/Markdown
 * editor lazy loaders.
 *
 * The three loaders below are re-exported from the same shared leaf modules
 * `src/index.ts` re-exports (`components/JsonEditor/lazy`,
 * `components/MarkdownEditor/lazy`, `components/New/MarkdownEditor/lazy`),
 * so this entry and the root reference one emitted chunk per loader instead
 * of each carrying its own duplicate copy of the loader's `import()` call -
 * see `components/JsonEditor/lazy.ts`'s comment for the emitted-topology
 * defect that duplication caused. `src/mcp/generate-manifest.ts` follows
 * this re-export back to the leaf module to keep attaching lazy-loading
 * metadata to `DialJsonEditor`/`DialMarkdownEditor`/`MarkdownEditor` (2.0)
 * in the published MCP component manifest.
 */

// JSON Editor - lazy loader to avoid loading in SSR
export { LazyDialJsonEditor } from '../components/JsonEditor/lazy';

// Markdown Editor - lazy loader to avoid loading in SSR
export { LazyDialMarkdownEditor } from '../components/MarkdownEditor/lazy';

// Markdown Editor (2.0) - lazy loader to avoid loading in SSR
export { LazyMarkdownEditor } from '../components/New/MarkdownEditor/lazy';

// Markdown/JSON container - kept behind a loader so importing this subpath
// does not eagerly pull either editor implementation into a consumer graph.
export const LazyDialMarkdownEditorContainer = () =>
  import('../components/MarkdownEditor/MarkdownEditorContainer');

export { EditorThemes } from '../types/editor';
export type { MarkdownEditorProps } from '../components/New/MarkdownEditor/MarkdownEditor';
export type { DialMarkdownEditorContainerProps } from '../components/MarkdownEditor/MarkdownEditorContainer';
