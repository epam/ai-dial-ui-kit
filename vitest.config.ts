import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['**/*.spec.tsx'],
    setupFiles: ['./setupTests.ts'],
    coverage: {
      reportsDirectory: './coverage/',
      reporter: ['text', 'json', 'html'],
      provider: 'v8',
      thresholds: {
        branches: 30,
        functions: 30,
        lines: 5,
        statements: 5,
      },
      exclude: [
        '**/*.stories.tsx',
        'storybook-static/**',
        '.storybook/**',
        '**/index.ts',
        'dist/**',
        'node_modules/**',
        '**/__mocks__/**',
      ],
    },
    reporters: 'verbose',
    exclude: [...configDefaults.exclude],
  },
});
