---
name: figma
description: Design-to-code workflow for Figma designs. Use when the user shares a Figma URL or asks to implement a design into the codebase.
---

# Figma Design-to-Code

## Overview

Translate Figma designs into production-ready React components that match this repository's conventions: React 19, TypeScript, Tailwind CSS + SCSS, Storybook, and Vitest in `@epam/ai-dial-ui-kit`.

## When to Use

- User shares a `figma.com` URL
- User says "implement this design" or "build this screen"
- User asks to match a Figma component or layout

## Workflow

### Step 1 — Fetch the design

Call `get_design_context` with the `fileKey` and `nodeId` extracted from the URL.

URL parsing rules:

- `figma.com/design/:fileKey/...?node-id=:nodeId` → replace `-` with `:` in nodeId
- `figma.com/board/:fileKey/...` → FigJam file, use `get_figjam` instead

If the design context includes **Code Connect** snippets, prefer those — they map directly to codebase components.

### Step 2 — Map design to existing UI kit components first

Before writing any new code, check whether existing components already cover the design:

| Design need                            | Check first                                    |
| -------------------------------------- | ---------------------------------------------- |
| Buttons, inputs, popups, tabs, loaders | `src/components/`                              |
| Types and models                       | `src/types/` and `src/models/`                 |
| Reusable behavior                      | `src/hooks/` and `src/utils/`                  |
| Icons and icon wrappers                | `src/assets/icons/` and `src/components/Icon/` |

Search the codebase before building from scratch:

```
rg "Dial|ComponentName" src/components
```

### Step 3 — Implement

- Create or update files under `src/components/<ComponentName>/`
- Keep exported component names prefixed with `Dial` (for example, `DialButton`)
- Use TypeScript + TSX only
- Use Tailwind classes and existing tokens/utilities; avoid inline styles and hardcoded design values
- Use `mergeClasses` from `src/utils/merge-classes` when class composition is non-trivial
- Keep accessibility parity with the design (labels, roles, keyboard interactions, focus handling)
- Preserve existing visual language and patterns from nearby components

### Step 4 — Verify

After implementation:

1. Add or update stories in `Component.stories.tsx`
2. Add or update tests in `Component.spec.tsx` (prefer role-based queries)
3. Export new public component/types in `src/index.ts`
4. Run `npm run typecheck`
5. Run `npm run lint`
6. Run `npm run test`

## Constraints

- No breaking changes to existing component APIs unless explicitly requested
- Do not introduce new dependencies unless necessary and approved
- Do not copy raw Figma hex values; map to project tokens and existing theme primitives
- Prefer semantic HTML and robust keyboard navigation over pixel-perfect but inaccessible markup
- If Figma misses interaction states (hover, disabled, loading, error), implement sensible defaults and call out assumptions

## File Checklist For New Public Components

When adding a new public component from Figma, include all of the following:

- `src/components/<Name>/<Name>.tsx`
- `src/components/<Name>/<Name>.stories.tsx`
- `src/components/<Name>/<Name>.spec.tsx`
- `src/index.ts` export updates (`export` and `export type` as needed)
