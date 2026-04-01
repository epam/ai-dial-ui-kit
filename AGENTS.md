# AI agents — AI DIAL UI Kit

This file is read by Cursor, Codex, and other agent harnesses alongside project context. It defines how AI assistants should work in this repository.

## Product

- **What**: `@epam/ai-dial-ui-kit` — React 19 + TypeScript component library for AI DIAL interfaces.
- **Build**: Vite library mode, Tailwind + SCSS, public API via `src/index.ts`.
- **Docs & dev**: Storybook (`npm run storybook`), tests with Vitest + Testing Library (`npm run test`).

## Agent principles

1. **Read before edit** — Open related files (component, stories, spec, types, `src/index.ts`) before changing behavior or API.
2. **Minimal diffs** — Solve the task only; no unrelated refactors or reformatting of untouched code.
3. **Verify** — After substantive changes: `npm run typecheck` (full TypeScript check; separate from ESLint), `npm run lint`, `npm run test` (and Storybook if UI/stories changed).
4. **Security** — Do not commit secrets; do not paste real tokens into chat; treat `.env` and keys as sensitive.
5. **Delegation mindset** — For large features, split: plan → implement component → stories → tests → export; ask the user if scope is unclear.

## Component work checklist

- **Naming**: Exported components use the `Dial*` prefix (e.g. `DialButton`, `DialInput`).
- **Files**: Prefer colocating `Component.tsx`, `Component.stories.tsx`, `Component.spec.tsx` under `src/components/<Name>/`.
- **API**: Extend native HTML/React props where appropriate; export prop types when consumers need them.
- **Styles**: Tailwind + existing tokens/utilities; keep a11y (labels, roles, keyboard) in mind.
- **Barrel**: Add public exports to `src/index.ts` (and `export type` for types).

## When to add or update

| Change                      | Also do                                            |
| --------------------------- | -------------------------------------------------- |
| New public component        | Storybook story, spec, entry in `src/index.ts`     |
| Visual / interaction change | Update stories; adjust or add tests                |
| Peer dependency surface     | Document in README or story descriptions if needed |

## Commands reference

| Script              | Use                                                                   |
| ------------------- | --------------------------------------------------------------------- |
| `npm run typecheck` | Full `tsc` typecheck via `tsconfig.json`; **does not** replace ESLint |
| `npm run lint`      | ESLint (must pass; pre-commit hooks may run it)                       |
| `npm run test`      | Vitest with coverage                                                  |
| `npm run build`     | Library + CSS build                                                   |
| `npm run storybook` | Local docs and visual QA                                              |

## Cursor-specific assets

- **`.cursor/rules/`** — Always-on and file-scoped rules (this file + `.cursor/rules/*.mdc`).
- **`.cursor/commands/`** — Slash-style prompts, including a **plan → implement → review → fix** pipeline:

| Command               | Role                                             |
| --------------------- | ------------------------------------------------ |
| `plan-component`      | Plan only; no code until approved                |
| `implement-from-plan` | Code only; follow the agreed plan                |
| `review-changes`      | Review only; no edits                            |
| `apply-review`        | Fixes only; address listed feedback              |
| `feature-pipeline`    | Run all four phases in order in one thread       |
| `story-and-test`      | Align Storybook + Vitest for components in scope |
