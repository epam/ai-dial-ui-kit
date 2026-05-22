# /review-changes

Alias for `/code-review` kept for backwards compatibility with the existing
`/feature-pipeline` workflow.

Run the **code-reviewer** agent as defined in `agents/code-reviewer.md` (root
of the repo). Read that file first and follow it verbatim — rubric, output
format, and the "must not do" list live there.

Scope: changes since divergence from `origin/development` (or files explicitly
named by the user). Output the standard three-section report
(`### Summary` / `### Must-fix` / `### Nice-to-have`) and finish with the
handoff hint to `/apply-review`.

This command is **review-only**. Do not edit files.
