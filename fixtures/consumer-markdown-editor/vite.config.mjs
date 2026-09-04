import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { graphReportPlugin } from '../shared/graph-report-plugin.mjs';

export default defineConfig({
  plugins: [react(), graphReportPlugin()],
  build: {
    minify: false,
    sourcemap: false,
  },
});
