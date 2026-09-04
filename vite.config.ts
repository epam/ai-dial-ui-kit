import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';
import path from 'path';

import tailwindcss from 'tailwindcss';
import { peerDependencies } from './package.json';

const peerDependencyNames = Object.keys(peerDependencies);

const isExternalDependency = (id: string) =>
  peerDependencyNames.some(
    (dependency) => id === dependency || id.startsWith(`${dependency}/`),
  );

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    dts({ exclude: ['**/*.stories.tsx', '**/*.spec.tsx'] }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      // Multi-entry: 'dial-ui-kit' is the existing backward-compatible root
      // entry (kept as the input KEY so the CJS format's `[name]` naming
      // below still produces `dial-ui-kit.cjs`); grid/file-manager/editors
      // are the new curated subpaths added by
      // openspec/changes/modularize-package-exports Task 3.1. Each is a
      // thin re-export barrel under src/subpaths/ - see design.md Decision 1
      // for why the root entry alone (via `preserveModules` below) already
      // satisfies the tree-shaking requirement, and why these subpaths are
      // an additive ergonomic/feature-boundary convenience, not a
      // substitute for it.
      entry: {
        'dial-ui-kit': './src/index.ts',
        grid: './src/subpaths/grid.ts',
        'file-manager': './src/subpaths/file-manager.ts',
        editors: './src/subpaths/editors.ts',
      },
      name: 'dial-ui-kit',
      formats: ['es', 'cjs'],
      // `fileName` is intentionally omitted: naming for both formats is now
      // fully driven by the per-format `rollupOptions.output` entries below
      // (see openspec/changes/modularize-package-exports/design.md
      // Decision 1). The ES format uses `preserveModules` so that each
      // source module (Button, Grid, FileManager, ...) is emitted as its
      // own file - this is what lets a consumer's bundler tree-shake AG
      // Grid/Monaco/@uiw/* out of a static import that never reaches them.
      // The CJS format stays a single bundle per entry, matching the
      // pre-existing behavior: CJS `require()` output is a
      // compatibility/resolution guarantee only, never a tree-shaking one.
    },
    rollupOptions: {
      // `ag-grid-community`/`ag-grid-react` are deliberately NOT listed here
      // (unlike Monaco/`@uiw/*`, which are `peerDependencies` above and thus
      // always external): they stay bundled `dependencies` (package.json).
      // This is Decision 2 in
      // openspec/changes/modularize-package-exports/design.md - once
      // `preserveModules` (below) isolates both Grid generations and
      // FileManager into their own emitted modules, "bundled" and "peer"
      // are equivalent for tree-shaking (a consumer who never imports
      // Grid/FileManager never evaluates that module either way), so
      // promoting AG Grid to a peer would only be a breaking,
      // install-burden-shifting change for existing Grid/FileManager
      // consumers with no tree-shaking benefit - not a free optimization to
      // fold in here. Revisit only via a dedicated future proposal.
      // Match peer package subpaths too (most notably react/jsx-runtime).
      // Exact-name matching bundles an incomplete dist/node_modules/react
      // tree under preserveModules and makes plain Node ESM imports fail.
      external: isExternalDependency,
      output: [
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
          exports: 'named',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            classnames: 'classNames',
            '@tabler/icons-react': 'TablerIcons',
            'monaco-editor': 'monaco',
            '@monaco-editor/react': 'MonacoEditor',
            '@floating-ui/react': 'FloatingUIReact',
          },
        },
        {
          format: 'cjs',
          // `.cjs` (not `.cjs.js`): package.json has `"type": "module"`, so a
          // plain `.js` file here is loaded as an ES module by Node and a
          // real `require()` throws `exports is not defined in ES module
          // scope` (verified: this was already true for the pre-existing
          // single-entry `dial-ui-kit.cjs.js` before this change touched
          // anything). `.cjs` is unambiguous regardless of the "type" field
          // - matches the shared internal chunk files below, which already
          // used `.cjs` and resolved correctly.
          entryFileNames: '[name].cjs',
          exports: 'named',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            classnames: 'classNames',
            '@tabler/icons-react': 'TablerIcons',
            'monaco-editor': 'monaco',
            '@monaco-editor/react': 'MonacoEditor',
            '@floating-ui/react': 'FloatingUIReact',
          },
        },
      ],
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
