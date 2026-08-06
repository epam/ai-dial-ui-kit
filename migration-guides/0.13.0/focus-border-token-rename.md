# Migrating the `focus` border token → `focus-black` — v0.12.x → v0.13.0

## Why this changed

The border token was named `focus` — after the *state* it is used in rather than the *value* it holds. That naming left nowhere to put a second focus colour, so when the blue focus ring arrived it had to be `focus-blue`, an odd sibling to a token whose name implied it covered all focus styling.

Both tokens are now named for their colour: `focus-black` and `focus-blue`. The rendered colour of `focus-black` is identical to the old `focus` (`#161B2D`, grey-1000) — this is a naming change, not a visual one.

## What changed

| Before                       | After                              |
| ---------------------------- | ---------------------------------- |
| CSS variable `--stroke-focus` | `--stroke-focus-black`             |
| `border-focus`               | `border-focus-black`               |
| `outline-focus`              | `outline-focus-black`              |
| `divide-focus`               | `divide-focus-black`               |
| `stroke-focus` (SVG)         | `stroke-focus-black`               |

The token feeds Tailwind's `borderColor`, `outlineColor`, `divideColor`, and `stroke` scales, so every utility built on it moves together.

**Not affected:**

- `controls-focus` / `--controls-stroke-focus` — a separate token, unchanged.
- `focus-blue` / `--stroke-focus-blue` — unchanged.
- Tailwind's `focus:` and `focus-visible:` **variants** — unrelated to the token. `focus-visible:outline-focus` becomes `focus-visible:outline-focus-black`; the `focus-visible:` prefix stays exactly as it is.

## Step-by-step migration

### 1. Find all usages

```bash
grep -rEn "(border|outline|divide|stroke)-focus\b|--stroke-focus\b" src/
```

The `\b` matters: without it the search also flags `focus-blue` and `--stroke-focus-blue`, which do not change.

### 2. Rename the utilities

**Before:**

```tsx
<button className="focus-visible:outline focus-visible:outline-focus" />
```

**After:**

```tsx
<button className="focus-visible:outline focus-visible:outline-focus-black" />
```

The same applies inside SCSS `@apply` directives:

```scss
/* Before */
.my-input:focus-visible {
  @apply border-focus;
}

/* After */
.my-input:focus-visible {
  @apply border-focus-black;
}
```

### 3. Rename the CSS variable override

Only relevant if you theme the token. Update the custom property name wherever you set it:

**Before:**

```css
:root {
  --stroke-focus: #1a1a2e;
}
```

**After:**

```css
:root {
  --stroke-focus-black: #1a1a2e;
}
```

An override left on `--stroke-focus` is **silently ignored** — the utility falls back to the built-in `#161B2D` with no error. This is the one failure mode that neither `typecheck` nor the compiler will catch, so grep for it explicitly.

### 4. Verify

```bash
npm run typecheck
npm run test
```

`typecheck` does not see Tailwind class strings, so also confirm the utilities resolve in the compiled output:

```bash
npm run build:css
grep -c "stroke-focus-black" dist/index.css
```

A stale `border-focus` compiles to nothing at all — the element simply loses its focus border, which is easy to miss without a visual pass. Check focus states in Storybook by tabbing through affected controls.

## Notes

- `ringColor` is **not** wired to this token scale, so `ring-focus-black` does not resolve — just as `ring-focus` did not before. Use `outline-focus-black` for focus rings.
- The colour value is unchanged, so a correctly-migrated codebase should be pixel-identical to 0.12.x.
