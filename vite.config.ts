import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import tailwindcss from 'tailwindcss';
import { peerDependencies } from './package.json';

export default defineConfig({
  plugins: [react(), dts({ exclude: ['**/*.stories.tsx', '**/*.spec.tsx'] })],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'dial-ui-kit',
      fileName: (format) => `dial-ui-kit.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external: Object.keys(peerDependencies),
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
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
