# Implement from an approved plan

You are in **implementation-only** mode.

1. **Source of truth** — Use the **plan already agreed in this thread** (from `/plan-component` or the user). If no plan is visible, ask for a short bullet plan or a paste before coding.
2. **Scope** — Implement exactly what the plan lists (component API, files, exports). Do **not** add features, refactors, or files that the plan does not mention unless the user explicitly expands scope.
3. **Deliverables** — Match the plan: typically `src/components/<Name>/…`, `*.stories.tsx`, `*.spec.tsx`, and **`src/index.ts`** updates for public API.
4. **Conventions** — Follow `AGENTS.md`: `Dial*` naming, colocation, Tailwind + existing patterns, extend native props where appropriate.
5. **Verify** — After edits run **`npm run typecheck`**, **`npm run lint`**, **`npm run test`** (or rely on the Cursor **verify** hook if enabled). Fix all failures you introduce.

Do **not** start a new planning pass or a code review in this turn unless the user asks.
