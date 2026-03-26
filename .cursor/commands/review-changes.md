# Review recent changes

Act as a focused code reviewer for this UI kit:

1. **Correctness** — Props typing, edge cases, controlled vs uncontrolled patterns, React 19 idioms. Confirm changes would pass **`npm run typecheck`** (not only ESLint).
2. **API consistency** — Matches other `Dial*` components; naming and export from `src/index.ts`.
3. **A11y** — Labels, roles, focus, keyboard; Storybook a11y addon considerations.
4. **Tests** — Meaningful coverage for behavior, not only snapshots; missing cases.
5. **Styles** — Tailwind/class patterns aligned with the rest of the kit; no unnecessary specificity.
6. **Churn** — Call out unrelated edits or scope creep.

Output: prioritized list (must-fix vs nice-to-have) with file references.
