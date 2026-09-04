const root = require('@epam/ai-dial-ui-kit');
const grid = require('@epam/ai-dial-ui-kit/grid');
const fileManager = require('@epam/ai-dial-ui-kit/file-manager');
const editors = require('@epam/ai-dial-ui-kit/editors');

const assertExports = (label, module, names) => {
  for (const name of names) {
    if (!(name in module)) {
      throw new Error(`${label} CJS export is missing: ${name}`);
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

console.log('PASS: root and feature subpaths resolve under Node CJS.');
