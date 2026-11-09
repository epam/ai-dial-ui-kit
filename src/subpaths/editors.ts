/**
 * `@epam/ai-dial-ui-kit/editors` - curated subpath for the Markdown editor
 * lazy loader.
 *
 * The loader below is re-exported from the same shared leaf module
 * `src/index.ts` re-exports (`components/New/MarkdownEditor/lazy`), so this
 * entry and the root reference one emitted chunk instead of each carrying
 * its own duplicate copy of the loader's `import()` call - see that module's
 * comment for the emitted-topology defect that duplication caused.
 * `src/mcp/generate-manifest.ts` follows this re-export back to the leaf
 * module to keep attaching lazy-loading metadata to `MarkdownEditor` (2.0)
 * in the published MCP component manifest.
 */

// Markdown Editor (2.0) - lazy loader to avoid loading in SSR
export { LazyMarkdownEditor } from '../components/New/MarkdownEditor/lazy';

export { EditorThemes } from '../types/editor';
export type { MarkdownEditorProps } from '../components/New/MarkdownEditor/MarkdownEditor';
