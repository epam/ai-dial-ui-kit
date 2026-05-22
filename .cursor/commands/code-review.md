# /code-review

Cross-harness slash command. Runs the **code-reviewer** agent for the
@epam/ai-dial-ui-kit.

**Source of truth:** `agents/code-reviewer.md` in the repo root. Read it now
and follow it verbatim. Do not invent additional rules — if something is not in
that file or in `AGENTS.md` / `.cursor/rules/`, do not enforce it.

## Steps in this turn

1. Read `agents/code-reviewer.md` (the rubric, output format, and "must not do"
   list are defined there).
2. Identify the review scope:
   - If the user mentioned specific files or a PR, use those.
   - Otherwise, use `git status --porcelain` + `git diff --stat
origin/development...HEAD` (fall back to `HEAD` when no remote tracking).
3. Read the changed files end-to-end before commenting.
4. Produce the three-section report (`### Summary` / `### Must-fix` /
   `### Nice-to-have`) exactly as specified in `agents/code-reviewer.md`.
5. End with the handoff hint: `/apply-review` for fixes.

This command is **review-only**. Do not edit files. If the user wants fixes,
they will call `/apply-review` next.
