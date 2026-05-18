---
description: Run the code-reviewer subagent on the current diff against origin/development (review-only, no edits).
argument-hint: '[optional: file path or PR number]'
allowed-tools: Read, Grep, Glob, Bash, Task
---

Delegate this turn to the **`code-reviewer`** subagent (defined in
`.claude/agents/code-reviewer.md`, which in turn defers to
`agents/code-reviewer.md` — the cross-harness source of truth).

Scope:

- If `$ARGUMENTS` is non-empty, treat it as the review target (file path or PR
  reference). Otherwise, review the diff between the current branch and
  `origin/development` (fall back to `HEAD` if no remote tracking is set).

Steps:

1. Invoke the `code-reviewer` subagent via the `Task` tool.
2. Pass along `$ARGUMENTS` verbatim as additional context.
3. Surface its three-section report (`### Summary` / `### Must-fix` /
   `### Nice-to-have`) unchanged.
4. Do **not** edit any files in this turn. If the user asks for fixes after
   reading the report, that is a separate run (a follow-up `apply-review`
   message or manual edits).
