import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['**/*.spec.tsx'],
    setupFiles: ['./setupTests.ts'],
  },
});
