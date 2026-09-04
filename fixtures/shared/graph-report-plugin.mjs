/**
 * Shared Vite/Rollup plugin used by every consumer fixture under fixtures/.
 * Emits `graph-report.json` next to the fixture's build output, capturing
 * per-chunk bundler metadata (moduleIds, static imports, dynamic imports)
 * so `assert-static-graph.mjs` can compute the fixture's true static initial
 * graph vs. its dynamically-loaded chunks without guessing from filenames.
 *
 * This is the "bundler metadata" signal referenced by
 * openspec/changes/modularize-package-exports/design.md Decision 6.
 */
export const graphReportPlugin = ({ outFile = 'graph-report.json' } = {}) => {
  return {
    name: 'dial-ui-kit-fixture-graph-report',
    generateBundle(_options, bundle) {
      const chunks = {};
      for (const [fileName, item] of Object.entries(bundle)) {
        if (item.type !== 'chunk') continue;
        chunks[fileName] = {
          isEntry: Boolean(item.isEntry),
          isDynamicEntry: Boolean(item.isDynamicEntry),
          moduleIds: item.moduleIds ? [...item.moduleIds] : [],
          imports: item.imports ? [...item.imports] : [],
          dynamicImports: item.dynamicImports ? [...item.dynamicImports] : [],
        };
      }
      this.emitFile({
        type: 'asset',
        fileName: outFile,
        source: JSON.stringify(chunks, null, 2),
      });
    },
  };
};
