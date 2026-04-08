# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@epam/ai-dial-ui-kit` is a React 19 + TypeScript component library for AI DIAL interfaces. It's published to npm and built as a tree-shakable library (ES + CJS). Node >= 22.2.0 required.

## Commands

```bash
npm run dev              # Vite dev server
npm run build            # Full production build (vite + CSS + manifest + MCP server)
npm run typecheck        # TypeScript type checking (tsc --noEmit)
npm run lint             # ESLint with auto-fix
npm run lint:check       # ESLint check only
npm run format-fix       # Prettier auto-fix
npm run test             # Vitest with coverage (watch mode)
npm run test:run         # Vitest single run (no watch)
npm run storybook        # Storybook on port 6006

# Run a single test file
npm run test:run -- --reporter=verbose src/components/Button/Button.spec.tsx

# Verification pipeline (typecheck + lint:check + test:run)
npm run verify:agent-hook
```

## Architecture

### Component Structure

Each component lives in `src/components/<PascalName>/` with three colocated files:

- `ComponentName.tsx` — implementation
- `ComponentName.spec.tsx` — Vitest + React Testing Library tests
- `ComponentName.stories.tsx` — Storybook 10 stories

### Public API

All public exports go through `src/index.ts` (barrel file). When adding or modifying public components, update this file. Use named exports only — no `*` re-exports.

### Naming Conventions

- **Components**: Use `Dial` prefix for all exported component names (e.g., `DialButton`, `DialInput`)
- **CSS classes**: Use `dial` prefix for custom CSS classes
- **Types**: Export as `export type { ...Props }` when needed

### Styling

- Tailwind CSS with custom design tokens defined as CSS variables in `tailwind.config.js`
- Use `mergeClasses` (from `src/utils/merge-classes`) for Tailwind class merging
- No inline styles or hardcoded values (hex colors, font sizes, etc.)
- SCSS mixins in `src/styles/` for reusable patterns

### Path Alias

`@/*` maps to `src/*` (configured in tsconfig.json)

### Key Directories

- `src/components/` — ~53 React components
- `src/hooks/` — reusable hooks (useEditableItem, useFlexibleActions, screen breakpoints)
- `src/models/` — TypeScript type definitions
- `src/types/` — enums and type exports
- `src/mcp/` — MCP server for AI agent component discovery
- `src/utils/` — utilities (mergeClasses, flat-to-hierarchy-convertor)

## Development Rules

- **No breaking changes** to existing UI components — follow Open-Closed principle
- **70% minimum** test coverage (branches, functions, lines, statements)
- **Always run `typecheck`** after changing `.ts`/`.tsx` files — ESLint doesn't catch all TS errors
- Tests: prefer roles over tags/text/testId; test layout/callbacks; move complex logic to utils and test separately
- Branching: `development` is the main branch; create feature branches from it
- Pre-commit hooks enforce lint + format + tests — do not skip them
