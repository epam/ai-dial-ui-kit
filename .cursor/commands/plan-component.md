# Plan a new component

Before writing code, produce a short plan for the requested UI kit component:

1. **Name** — `Dial*` export name and folder under `src/components/`.
2. **Props** — Extend native element props where appropriate; list required vs optional and defaults.
3. **States** — Loading, error, disabled, empty; keyboard and screen-reader notes.
4. **Dependencies** — Peer deps vs internal components (`DialIcon`, `DialTooltip`, etc.).
5. **Deliverables** — Files to add: `Component.tsx`, `*.stories.tsx`, `*.spec.tsx`, updates to `src/index.ts`; verification must include **`npm run typecheck`** (plus lint/test).
6. **Risks** — SSR, bundle size, or breaking changes for consumers.

Do not implement until the user confirms the plan (unless they asked for plan + implementation in one go).
