import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';
import path from 'path';

import tailwindcss from 'tailwindcss';
import { peerDependencies } from './package.json';

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
      entry: './src/index.ts',
      name: 'dial-ui-kit',
      fileName: (format) => `dial-ui-kit.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react/jsx-runtime',
        'monaco-editor',
        '@monaco-editor/react',
        ...Object.keys(peerDependencies),
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
