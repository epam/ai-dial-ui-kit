/** @vitest-environment node */
// this file intends to check if there'll be any SSR-breaking errors on library import.
// important: this test file require dist build to be present, and to rerun after changes fresh build should be made as well.

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, test } from 'vitest';

interface PackageJson {
  exports: {
    '.': {
      import: string;
    };
  };
}

const packageJson = JSON.parse(
  readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'),
) as PackageJson;
const distEntry = path.resolve(process.cwd(), packageJson.exports['.'].import);
const distEntryUrl = pathToFileURL(distEntry).href;

// Browser-only side effects (window/document/self access, raw .css imports)
// that surface when a non-SSR-safe module like DialJsonEditor is exposed
// from the main entry and pulled in by a Node/Next.js server build.
const SSR_BROWSER_FAILURE =
  /window is not defined|document is not defined|self is not defined|ERR_UNKNOWN_FILE_EXTENSION|Unknown file extension "\.css"/i;

const runNodeScript = (script: string) => {
  return spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    cwd: process.cwd(),
    encoding: 'utf-8',
  });
};

describe.runIf(existsSync(distEntry))('Dial UI Kit :: SSR safety', () => {
  test('main entry imports cleanly in plain Node (SSR)', () => {
    const result = runNodeScript(`
      import(${JSON.stringify(distEntryUrl)})
        .then(() => process.exit(0))
        .catch((error) => {
          console.error(String(error?.stack ?? error?.message ?? error));
          process.exit(1);
        });
    `);

    expect(
      result.status,
      `stderr:\n${result.stderr}\nstdout:\n${result.stdout}`,
    ).toBe(0);
    expect(result.stderr).not.toMatch(SSR_BROWSER_FAILURE);
  });

  test('renderToString of DialButton works in plain Node (SSR)', () => {
    const script = `
      Promise.all([
        import(${JSON.stringify(distEntryUrl)}),
        import('react'),
        import('react-dom/server'),
      ])
        .then(([lib, React, server]) => {
          const html = server.renderToString(
            React.createElement(lib.DialButton, { label: 'SSR-safe button' }),
          );
          process.stdout.write(html);
          process.exit(0);
        })
        .catch((error) => {
          console.error(String(error?.stack ?? error?.message ?? error));
          process.exit(1);
        });
    `;

    const result = runNodeScript(script);

    expect(
      result.status,
      `stderr:\n${result.stderr}\nstdout:\n${result.stdout}`,
    ).toBe(0);
    expect(result.stderr).not.toMatch(SSR_BROWSER_FAILURE);
    expect(result.stdout).toContain('SSR-safe button');
  });
});
