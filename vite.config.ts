import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

import tailwindcss from 'tailwindcss';
import { peerDependencies } from './package.json';

export default defineConfig({
  plugins: [react(), dts({ exclude: ['**/*.stories.tsx', '**/*.spec.tsx'] })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'dial-ui-kit',
      fileName: (format) => `dial-ui-kit.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        ...Object.keys(peerDependencies),
        'monaco-editor',
        '@monaco-editor/react',
      ],
      output: {
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
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
