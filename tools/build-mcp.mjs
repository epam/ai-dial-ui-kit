import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/mcp/server.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  external: ['@modelcontextprotocol/sdk'],
  outfile: 'dist/mcp-server.cjs',
  banner: { js: '#!/usr/bin/env node' },
});
