/**
 * Shared leaf module for the 2.0 Markdown editor's lazy loader. Both
 * `src/index.ts` (root) and `src/subpaths/editors.ts` (`./editors`)
 * re-export this same binding instead of each declaring their own copy -
 * see `src/components/JsonEditor/lazy.ts`'s comment for why.
 */
export const LazyMarkdownEditor = () => import('./MarkdownEditor');
