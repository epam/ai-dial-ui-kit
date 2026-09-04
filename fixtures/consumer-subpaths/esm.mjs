import * as root from '@epam/ai-dial-ui-kit';
import * as grid from '@epam/ai-dial-ui-kit/grid';
import * as fileManager from '@epam/ai-dial-ui-kit/file-manager';
import * as editors from '@epam/ai-dial-ui-kit/editors';

const assertExports = (label, module, names) => {
  for (const name of names) {
    if (!(name in module)) {
      throw new Error(`${label} ESM export is missing: ${name}`);
    }
  }
};

assertExports('root', root, ['Button', 'Grid', 'DialFileManager']);
assertExports('grid', grid, ['Grid', 'DialGrid', 'GridSelectionMode']);
assertExports('file-manager', fileManager, [
  'DialFileManager',
  'FileManagerProvider',
  'useDialFileManagerTabs',
]);
assertExports('editors', editors, [
  'LazyDialJsonEditor',
  'LazyDialMarkdownEditor',
  'LazyDialMarkdownEditorContainer',
  'LazyMarkdownEditor',
  'EditorThemes',
]);

console.log('PASS: root and feature subpaths resolve under Node ESM.');
