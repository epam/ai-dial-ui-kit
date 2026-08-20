# Migrating the focus border tokens back to role names — v0.13.0 → v0.14.0

## Why this changed

0.13.0 renamed the `focus` border token to `focus-black`, on the reasoning that a token should be named for its value so that `focus-black` and `focus-blue` read as siblings. See the [0.13.0 guide](../0.13.0/focus-border-token-rename.md) for that step.

That naming does not survive contact with the rest of the border scale, which is named by **role** throughout: `primary`, `secondary`, `accent`, `accent-alpha`, `error-alpha`. Under a dark theme `focus-black` is not black, so the value it was named after is wrong exactly when it matters most. The two tokens are now:

- `focus` — the default focus ring (grey-1000 in the light palette).
- `accent-focus` — the accent focus ring (blue-200), used where the ring sits on an accent-filled control.

`border-focus` / `outline-focus` / `divide-focus` / `stroke-focus` are therefore back to the names they had in 0.12.x. **The colours are unchanged**, and so are the CSS variables.

## What changed

| Before (0.13.0)       | After (0.14.0)         |
| --------------------- | ---------------------- |
| `border-focus-black`  | `border-focus`         |
| `outline-focus-black` | `outline-focus`        |
| `divide-focus-black`  | `divide-focus`         |
| `stroke-focus-black`  | `stroke-focus`         |
| `border-focus-blue`   | `border-accent-focus`  |
| `outline-focus-blue`  | `outline-accent-focus` |
| `divide-focus-blue`   | `divide-accent-focus`  |
| `stroke-focus-blue`   | `stroke-accent-focus`  |

**Not affected:**

- The CSS variables. `focus` still resolves `var(--stroke-focus-black, var(--stroke-focus, #161B2D))` and `accent-focus` still resolves `var(--stroke-focus-blue, #6785FB)`. A theme set up for 0.13.0 — or for 0.12.x, which used `--stroke-focus` — needs no change.
- Tailwind's `focus:` and `focus-visible:` **variants**, which have nothing to do with the token. `focus-visible:outline-focus-black` becomes `focus-visible:outline-focus`; the `focus-visible:` prefix is untouched.
- `controls-focus` / `--controls-stroke-focus` — a separate legacy token.

## Step-by-step migration

### If you are coming from 0.12.x

Nothing to do for `focus` — the name you have is the name that ships. Only `focus-blue` → `accent-focus` applies.

### If you are coming from 0.13.0

#### 1. Find all usages

```bash
grep -rEn "(border|outline|divide|stroke)-focus-(black|blue)" src/
```

#### 2. Rename the utilities

**Before:**

```tsx
<button className="focus-visible:outline focus-visible:outline-focus-black" />
<div className="focus-within:border-focus-blue" />
```

**After:**

```tsx
<button className="focus-visible:outline focus-visible:outline-focus" />
<div className="focus-within:border-accent-focus" />
```

In SCSS:

```scss
.my-control:focus-visible {
  @apply outline outline-offset-2 outline-focus;
}
```

#### 3. Verify

```bash
npm run build:css   # a stale @apply is a hard error here
npm run typecheck && npm run test
```

Then confirm the ring is actually painted, not just present:

```bash
grep -c "outline-focus" dist/index.css
```

## Notes

- `ringColor` is not wired to this token scale, so `ring-focus` does not resolve — it did not in 0.12.x or 0.13.0 either. Use `outline-focus` for focus rings; the `outline` utility already emits a 1px solid ring.
- A stale `outline-focus-black` in JSX is silent: Tailwind emits nothing, the outline falls back to `currentColor`, and the ring looks _almost_ right. Run the grep.
