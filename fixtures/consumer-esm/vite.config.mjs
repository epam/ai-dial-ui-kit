import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { graphReportPlugin } from '../shared/graph-report-plugin.mjs';

export default defineConfig({
  plugins: [react(), graphReportPlugin()],
  build: {
    // Minification is intentionally disabled: this fixture's build output is
    // inspected by assert-static-graph.mjs, which greps chunk contents for
    // stable package markers as a second signal alongside bundler metadata.
    minify: false,
    sourcemap: false,
  },
});
