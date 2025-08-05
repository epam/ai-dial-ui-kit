import {
  configDefaults,
  defineConfig,
  coverageConfigDefaults,
} from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
      {
        find: 'monaco-editor',
        replacement: path.resolve(
          __dirname,
          './src/__mocks__/monaco-editor.ts',
        ),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    include: ['**/*.spec.tsx'],
    setupFiles: ['./setupTests.ts'],
    server: {
      deps: {
        inline: ['monaco-editor'],
      },
    },
    coverage: {
      reportsDirectory: './coverage/',
      reporter: ['text', 'json', 'html'],
      provider: 'v8',
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/*.stories.tsx',
        'storybook-static/**',
        '.storybook/**',
        '**/index.ts',
        '**/__mocks__/**',
        '*.config.[jt]s',
      ],
    },
    reporters: 'verbose',
    exclude: [...configDefaults.exclude],
  },
});
