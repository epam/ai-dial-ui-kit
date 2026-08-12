# Migrating `dial-caption-semi-text` → `dial-caption-lead-semi-text` — v0.12.x → v0.13.0

## Why this changed

The design system has exactly one 10px semibold style, **Caption Lead (Semi Bold)**: 10px/12px, `+0.06em` tracking, uppercase. The kit shipped it as `dial-caption-semi-text` with the tracking but without the uppercase, and without "lead" in the name — so the class read like a plain semibold caption while already carrying the lead style's letter-spacing.

The class is now named for what it is, alongside `dial-tiny-lead-text` and the new `dial-tiny-lead-semi-text`. The rename is deliberate rather than a silent addition of `text-transform`: uppercasing under the old name would change how existing text renders with no signal in the code that anything moved.

## What changed

| Before                    | After                          |
| ------------------------- | ------------------------------ |
| `.dial-caption-semi-text` | `.dial-caption-lead-semi-text` |

| Property         | Before | After         |
| ---------------- | ------ | ------------- |
| `font-size`      | 10px   | 10px          |
| `line-height`    | 12px   | 12px          |
| `font-weight`    | 600    | 600           |
| `letter-spacing` | 0.06em | 0.06em        |
| `text-transform` | —      | **uppercase** |

There is no replacement for a 10px semibold style _without_ the lead treatment — the design scale does not define one. See the notes if that is what you were using it for.

## Step-by-step migration

### 1. Find all usages

```bash
grep -rn "dial-caption-semi-text" src/
```

### 2. Rename the class

**Before:**

```tsx
<span className="dial-caption-semi-text text-secondary">Beta</span>
```

**After:**

```tsx
<span className="dial-caption-lead-semi-text text-secondary">Beta</span>
```

The same applies inside SCSS `@apply` directives.

### 3. Remove any manual uppercasing

The class now uppercases the text itself, so drop a `uppercase` utility or a `.toUpperCase()` call at the same spot. Prefer the CSS transform over transforming the string: `text-transform` leaves the accessible name in sentence case, while `.toUpperCase()` makes screen readers announce some strings letter by letter.

**Before:**

```tsx
<span className="dial-caption-semi-text uppercase">{label.toUpperCase()}</span>
```

**After:**

```tsx
<span className="dial-caption-lead-semi-text">{label}</span>
```

### 4. Verify

```bash
npm run typecheck
npm run test
```

`typecheck` does not see Tailwind class strings, and a stale `dial-caption-semi-text` compiles to **nothing at all** — the text silently falls back to the inherited font size. Confirm against the compiled stylesheet:

```bash
npm run build:css
grep -c "dial-caption-lead-semi-text" dist/index.css
```

## Notes

- If you were using the class for a 10px semibold label that should _not_ be uppercase, the scale has no such step. Either move up to `dial-tiny-semi-text` (12px/16px) or, if 10px is essential, compose it locally — do not re-add a project-level `dial-caption-semi-text`, which would collide with the kit's naming.
- The uppercase is purely presentational. Do not pre-uppercase the string you pass in.
