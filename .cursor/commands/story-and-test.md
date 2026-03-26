# Add or align Storybook + tests

For the component(s) in scope:

1. **Storybook** — Default + variants (sizes, states, error). Use the same structure as sibling components in `src/components/`.
2. **Vitest** — User interactions (click, type, keyboard) via Testing Library; assert visible outcomes and callbacks.
3. **Coverage** — Aim to cover branches you added; follow existing `*.spec.tsx` style in this folder.
4. **Exports** — If the component is public, confirm `src/index.ts` exports match the story import path consumers would use.

After edits, **`npm run typecheck`**, **`npm run lint`**, **`npm run test`**, and Storybook if UI changed — run or explicitly ask the user to run them; stories and specs must typecheck too.
