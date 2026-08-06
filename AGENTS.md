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

| Change                      | Also do                                                                         |
| --------------------------- | ------------------------------------------------------------------------------- |
| New public component        | Storybook story, spec, entry in `src/index.ts`                                  |
| Visual / interaction change | Update stories; adjust or add tests                                             |
| New interactive control     | Accessible name + target size (see [Accessibility rules](#accessibility-rules)) |
| Peer dependency surface     | Document in README or story descriptions if needed                              |
| **Breaking change**         | CHANGELOG.md entry + migration guide (see below)                                |

## Breaking changes — documentation required

A **breaking change** is any modification that requires consumers to update their code: renamed/removed props, changed component behaviour, removed exports, altered CSS token names, etc.

### 1. Find the next version

```bash
git tag --sort=-v:refname | head -1
```

This gives you the **last released** version. Breaking changes go into the **next** release, so increment the minor version (the middle number) by 1 and reset the patch to 0.

Examples: `0.10.0` → `0.11.0`, `1.3.2` → `1.4.0`.

Use this next version for all entries below.

### 2. Add a CHANGELOG entry

Open `CHANGELOG.md` and add an entry under `## [<version>]` (create the section if it does not exist). Use this format inside a `### Breaking Changes` subsection:

```markdown
### Breaking Changes

- **`ComponentName` — `oldProp` → `newProp`** — Short explanation of what changed and why.
  See [migration guide](migration-guides/<version>/<migration-name>.md).
```

Rules:

- State **what changed**, **from → to**, and **why** (alignment, consistency, accessibility, etc.).
- Link to the migration guide you will create in step 3.
- Keep it to 1–3 sentences per item.

### 3. Create a migration guide

Create a new file at `migration-guides/<version>/<migration-name>.md`.  
Use `migration-guides/_template.md` as the base and fill in all sections:

- **Why this changed** — motivation.
- **What changed** — before/after table.
- **Step-by-step migration** — concrete instructions with code examples and a grep command to locate usages.
- **Verify** — `npm run typecheck && npm run test`.

`<migration-name>` should be kebab-case and describe the change, e.g. `button-variant-prop-rename`.

### 4. Update the migration-guides index

Add a row to the table in `migration-guides/README.md`:

```markdown
| <version> | [<migration-name>](<version>/<migration-name>.md) | One-line summary |
```

## Commands reference

| Script              | Use                                                                   |
| ------------------- | --------------------------------------------------------------------- |
| `npm run typecheck` | Full `tsc` typecheck via `tsconfig.json`; **does not** replace ESLint |
| `npm run lint`      | ESLint (must pass; pre-commit hooks may run it)                       |
| `npm run test`      | Vitest with coverage                                                  |
| `npm run build`     | Library + CSS build                                                   |
| `npm run storybook` | Local docs and visual QA                                              |

## Architecture details

### Path Alias

`@/*` maps to `src/*` (configured in tsconfig.json)

### Key Directories

- `src/components/` — ~53 React components
- `src/hooks/` — reusable hooks (useEditableItem, useFlexibleActions, screen breakpoints)
- `src/models/` — TypeScript type definitions
- `src/types/` — enums and type exports
- `src/mcp/` — MCP server for AI agent component discovery
- `src/utils/` — utilities (mergeClasses, flat-to-hierarchy-convertor)

### Styling details

- Tailwind CSS with custom design tokens defined as CSS variables in `tailwind.config.js`
- Use `mergeClasses` (from `src/utils/merge-classes`) for Tailwind class merging
- No inline styles or hardcoded values (hex colors, font sizes, etc.)
- SCSS mixins in `src/styles/` for reusable patterns

## Accessibility rules

Conformance target is **WCAG 2.2 Level AA**, plus **2.5.5 Target Size (Enhanced, AAA)** for interactive controls. See the [Accessibility section of the README](README.md#-accessibility) for the consumer-facing contract and the current exception list.

### Accessible names

- **Icon-only controls must be named.** Resolve the name with `resolveAccessibleName` (`src/utils/accessible-name`), passing candidates in priority order — it returns the first non-empty string. Do not hand-roll the fallback chain.
- **Never rely on a tooltip alone to name a control.** `DialTooltip` puts its `aria-describedby` on a wrapper `<span>` rather than on the control, and `DialTooltipContent` renders nothing on mobile — so tooltip text never reaches assistive tech. Pass the tooltip to `resolveAccessibleName` as the last candidate.
- **Only fall back to a tooltip when nothing else names the control.** As an `aria-label` it overrides the element's own content, so a component with a visible label must gate the fallback on that label being absent (see `New/Button`).
- **Never write `aria-label={props['aria-label']}` after spreading `{...props}`** — the spread already applied it, so the line is a no-op. It has been introduced by copy-paste in four button components; delete it rather than propagating it.
- **Decorative icons get `aria-hidden="true"`.** Tabler icons render a bare `<svg>` with no `role` and no title, so they need it explicitly.

### Target size

- Add `dial-kit-enhanced-target` to interactive controls that render at **40px or larger**. It grows the pointer target to 44×44 with a transparent pseudo-element and leaves the rendered size untouched, so it is never a visual or breaking change.
- **Never apply it to `ElementSize.Small` (24px) controls** — the 10px-per-side overhang overlaps adjacent controls in dense toolbars.
- **Never apply it to `ButtonAppearance.Link`** — exempt under 2.5.5's _Inline_ exception, and it would overlap surrounding copy.
- A control that cannot conform goes in the README exception table with the reason. Do not silently leave it undocumented.

### Testing a11y

- Assert the **name**, not just the role: `getByRole('button', { name })` or `toHaveAccessibleName(...)`. A bare `getByRole('button')` passes on a button with no accessible name at all, so it cannot catch the defect it looks like it is testing.
- A test whose assertion still passes with the feature prop removed is not testing that feature — e.g. asserting a button exists proves nothing about its tooltip. Drive the interaction (`user.hover`) and assert the result.
- jsdom performs no layout, so target-size tests can only assert that `dial-kit-enhanced-target` is applied (and _not_ applied to small/link variants). Verify the geometry by compiling CSS (`npm run build:css`) and reading `dist/index.css`.

## Development Rules

- **Arrow functions** — always use arrow function expressions (`export const fn = () => {}`) instead of function declarations (`function fn() {}`)
- **String enums for variants/sizes** — use `export enum` with PascalCase keys and lowercase string values (e.g. `enum FooSize { Small = 'sm', Medium = 'md' }`); never use plain string union types for public prop enumerations
- **No breaking changes** to existing UI components — follow Open-Closed principle
- **70% minimum** test coverage (branches, functions, lines, statements)
- **Always run `typecheck`** after changing `.ts`/`.tsx` files — ESLint doesn't catch all TS errors
- Tests: prefer roles over tags/text/testId; test layout/callbacks; move complex logic to utils and test separately
- Branching: `development` is the main branch; create feature branches from it
- Pre-commit hooks enforce lint + format + tests — do not skip them

## Cursor-specific assets

- **`.cursor/rules/`** — Always-on and file-scoped rules (this file + `.cursor/rules/*.mdc`).
- **`.cursor/commands/`** — Slash-style prompts, including a **plan → implement → review → fix** pipeline:

| Command               | Role                                             |
| --------------------- | ------------------------------------------------ |
| `plan-component`      | Plan only; no code until approved                |
| `implement-from-plan` | Code only; follow the agreed plan                |
| `review-changes`      | Review only; no edits (alias of `code-review`)   |
| `code-review`         | Review only; no edits (cross-harness command)    |
| `apply-review`        | Fixes only; address listed feedback              |
| `feature-pipeline`    | Run all four phases in order in one thread       |
| `story-and-test`      | Align Storybook + Vitest for components in scope |

## Cross-harness code-review agent

A single `code-reviewer` agent works the same in **Cursor**, **Claude Code**, and **Codex**. The rubric, output format, and constraints live in one file; each harness ships a thin wrapper.

| Surface     | Where to invoke                                                                     |
| ----------- | ----------------------------------------------------------------------------------- |
| Source      | `agents/code-reviewer.md` — single source of truth, read this first                 |
| Cursor      | `/code-review` (or alias `/review-changes`) — `.cursor/commands/code-review.md`     |
| Claude Code | `/code-review` slash command + `code-reviewer` subagent (`.claude/agents/`)         |
| Codex CLI   | `/code-review` prompt — copy `.codex/prompts/code-review.md` to `~/.codex/prompts/` |

The agent is **review-only**: it never edits files. To apply must-fix items, run `/apply-review` (Cursor) or re-prompt with "apply must-fix items".
