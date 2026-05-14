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

### Step 4 — Stories

Add or update `Component.stories.tsx`. Every new prop and every Figma variant must have its own named story.

Story checklist:
- One story per Figma variant (e.g. `Info`, `Success`, `Warning`, `Error`, `Loading`)
- One story per significant new prop (e.g. `WithTitle`, `Closable`)
- An `AllVariants` render story showing every variant side-by-side
- Add the new prop to `argTypes` with `control` and `description`
- Add the new variant to any `options` array in `argTypes`

Pattern:
```tsx
export const MyVariant: Story = {
  args: { variant: MyVariantEnum.Value, message: 'Example text' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      <DialComponent variant={MyVariantEnum.A} message="A" />
      <DialComponent variant={MyVariantEnum.B} message="B" />
    </div>
  ),
};
```

### Step 5 — Tests

Add or update `Component.spec.tsx`. Cover every new prop and new variant.

Test checklist:
- Query by role first (`getByRole`), fall back to text only when no role applies
- Test that new props render the expected output (e.g. title renders above message)
- Test that new variants render their distinguishing element (e.g. spinner for Loading)
- Test callback props are called with the correct event
- Aim for ≥ 95% branch coverage on the component file

Pattern:
```tsx
test('Should render title above message when title is provided', () => {
  render(<DialComponent title="Heading" message="Body" />);
  const title = screen.getByText('Heading');
  const message = screen.getByText('Body');
  expect(title).toHaveClass('font-semibold');
  expect(title.compareDocumentPosition(message)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
});

test('Should render spinner for Loading variant', () => {
  render(<DialComponent variant="loading" message="Wait…" />);
  expect(screen.getByRole('status')).toBeInTheDocument();
});
```

### Step 6 — Verify

1. Export new public component/types in `src/index.ts`
2. Run `npm run typecheck`
3. Run `npm run lint`
4. Run `npm run test`

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
