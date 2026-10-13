import * as root from '@epam/ai-dial-ui-kit';
import * as grid from '@epam/ai-dial-ui-kit/grid';
import * as editors from '@epam/ai-dial-ui-kit/editors';

const assertExports = (label, module, names) => {
  for (const name of names) {
    if (!(name in module)) {
      throw new Error(`${label} ESM export is missing: ${name}`);
    }
  }
};

assertExports('root', root, ['Button', 'Grid']);
assertExports('grid', grid, ['Grid', 'DialGrid', 'GridSelectionMode']);
assertExports('editors', editors, [
  'LazyDialJsonEditor',
  'LazyDialMarkdownEditor',
  'LazyDialMarkdownEditorContainer',
  'LazyMarkdownEditor',
  'EditorThemes',
]);

console.log('PASS: root and feature subpaths resolve under Node ESM.');
