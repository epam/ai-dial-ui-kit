/**
 * Shared leaf module for the 2.0 Markdown editor's lazy loader. Both
 * `src/index.ts` (root) and `src/subpaths/editors.ts` (`./editors`)
 * re-export this same binding instead of each declaring their own copy of
 * the loader function. The duplication it replaced was an emitted-topology
 * defect, not just source-level duplication: a loader function's body
 * containing its own `import()` call, when duplicated verbatim into more than
 * one entry's own emitted chunk, can pull an unrelated dynamically-imported
 * feature into the initial graph in some Vite/Rolldown versions - see
 * `openspec/changes/isolate-heavy-feature-modules` Section 9's
 * `diagnosis-baseline.txt` for the measured reproduction.
 */
export const LazyMarkdownEditor = () => import('./MarkdownEditor');
