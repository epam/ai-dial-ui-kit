const root = require('@epam/ai-dial-ui-kit');
const grid = require('@epam/ai-dial-ui-kit/grid');
const editors = require('@epam/ai-dial-ui-kit/editors');

const assertExports = (label, module, names) => {
  for (const name of names) {
    if (!(name in module)) {
      throw new Error(`${label} CJS export is missing: ${name}`);
    }
  }
};

assertExports('root', root, ['Button', 'Grid']);
assertExports('grid', grid, ['Grid', 'GridSelectionMode']);
assertExports('editors', editors, ['LazyMarkdownEditor', 'EditorThemes']);

console.log('PASS: root and feature subpaths resolve under Node CJS.');
