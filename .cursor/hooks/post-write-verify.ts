/**
 * postToolUse: run repo checks after .ts/.tsx Write/Edit; print JSON on stdout for Cursor hooks.
 * @see https://cursor.com/docs/agent/hooks
 */
import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { readFileSync } from 'node:fs';
import process from 'node:process';

interface PostToolUseHookInput {
  cwd?: string;
}

function readStdin(): string {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function resolveProjectRoot(stdinText: string): string {
  try {
    const trimmed = stdinText.trim();
    if (!trimmed) {
      return process.cwd();
    }
    const j = JSON.parse(trimmed) as PostToolUseHookInput;
    if (typeof j.cwd === 'string' && j.cwd.length > 0) {
      return j.cwd;
    }
  } catch {
    // ignore invalid JSON
  }
  return process.cwd();
}

function formatFailure(log: string): string {
  const body = log.length > 14000 ? `…\n${log.slice(-14000)}` : log;
  const msg = `**Verify failed after .ts/.tsx change** (\`npm run verify:agent-hook\`: typecheck → lint:check → test:run).

\`\`\`
${body}
\`\`\`
`;
  return JSON.stringify({ additional_context: msg });
}

function main(): void {
  if (process.env.CURSOR_SKIP_AGENT_VERIFY === '1') {
    console.log('{}');
    return;
  }

  const projectRoot = resolveProjectRoot(readStdin());
  const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  const result: SpawnSyncReturns<string> = spawnSync(
    npmBin,
    ['run', 'verify:agent-hook'],
    {
      cwd: projectRoot,
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
      env: process.env,
    },
  );

  const log = `${result.stdout ?? ''}${result.stderr ?? ''}`;

  if (result.error) {
    console.log(
      formatFailure(
        `${result.error.message}\n${log}`.trim() || String(result.error),
      ),
    );
    return;
  }

  if (result.status === 0) {
    console.log('{}');
    return;
  }

  console.log(
    formatFailure(log.trim() || `(exit ${result.status ?? 'unknown'})`),
  );
}

main();
