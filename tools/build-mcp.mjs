import * as esbuild from 'esbuild';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const dist = join(root, 'dist');

await esbuild.build({
  entryPoints: ['src/mcp/server.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  external: ['@modelcontextprotocol/sdk'],
  outfile: 'dist/mcp-server.cjs',
  banner: { js: '#!/usr/bin/env node' },
});

// Copy CHANGELOG.md into dist so the MCP server can serve it at runtime.
const changelogSrc = join(root, 'CHANGELOG.md');
if (existsSync(changelogSrc)) {
  mkdirSync(dist, { recursive: true });
  cpSync(changelogSrc, join(dist, 'CHANGELOG.md'));
}

// Copy migration-guides/ into dist (version sub-folders with *.md files).
const migrationSrc = join(root, 'migration-guides');
if (existsSync(migrationSrc)) {
  cpSync(migrationSrc, join(dist, 'migration-guides'), { recursive: true });
}
