# Migrating the control colour tokens — v0.13.0 → v0.14.0

## Why this changed

The control tokens for disabled, neutral-hover and accent-hover states were named after their _opacity_ or their _literal hue_ rather than their role:

- `control-disable-alpha` and `control-disable-beta` read as two opacities of one colour. They are not — they are two different greys for two different jobs (the disabled foreground and the disabled surface), and "alpha"/"beta" gave no clue which was which.
- `text-control-blue-hover` named the hue, so the day the accent stops being blue the token name lies. Every other accent token in the kit is already called `accent`.
- `bg-control-disable` and `bg-control-neutral-hover` were single steps with no room for the second step the design has since added (`control-disable-secondary`, `control-neutral-hover-strong`).

The tokens are now named for the role they fill, with `primary`/`secondary` and `muted`/`strong` marking the steps within a pair. **No rendered colour changes** — this is a naming change.

## What changed

| Before                          | After                             | Scale             |
| ------------------------------- | --------------------------------- | ----------------- |
| `bg-control-disable`            | `bg-control-disable-primary`      | `backgroundColor` |
| `bg-control-neutral-hover`      | `bg-control-neutral-hover-muted`  | `backgroundColor` |
| `border-control-disable-alpha`  | `border-control-disable-primary`  | `borderColor`     |
| `divide-control-disable-alpha`  | `divide-control-disable-primary`  | `divideColor`     |
| `outline-control-disable-alpha` | `outline-control-disable-primary` | `outlineColor`    |
| `stroke-control-disable-alpha`  | `stroke-control-disable-primary`  | `stroke` (SVG)    |
| `text-control-disable-alpha`    | `text-control-disable-primary`    | `textColor`       |
| `text-control-disable-beta`     | `text-control-disable-secondary`  | `textColor`       |
| `text-control-blue-hover`       | `text-control-accent-hover`       | `textColor`       |
| `text-control-blue-active`      | `text-control-accent-active`      | `textColor`       |

One token is removed rather than renamed:

| Removed                                                      | Use instead           |
| ------------------------------------------------------------ | --------------------- |
| `border-hover-alpha` (also `divide-`, `outline-`, `stroke-`) | `border-accent-alpha` |

`hover-alpha` and `accent-alpha` were the same colour — `#2764D933`, blue-500 at 20% — reached through two variables, `--stroke-hover-alpha` and `--stroke-accent-alpha`. One accent tint does not need two names, and a theme that set only one of them got an inconsistent hover border. The three hover borders in the kit that used it (`Input`, `Tag`, `Calendar`) now use `accent-alpha`.

**If your theme sets `--stroke-hover-alpha`, move that value to `--stroke-accent-alpha`** — the removed variable is not in any fallback chain, so a hover border themed only through it drops to the light default.

New steps added alongside them — nothing to migrate, but they are what the rename made room for:

| Token                             | Value     | Role                                   |
| --------------------------------- | --------- | -------------------------------------- |
| `bg-control-disable-secondary`    | `#ACB3C3` | disabled surface on a disabled control |
| `bg-control-neutral-hover-strong` | `#848E9C` | hover on a filled neutral control      |
| `bg-control-neutral-default`      | `#ACB3C3` | resting fill of a neutral control      |
| `bg-control-inverted`             | `#57647A` | control on an inverted surface         |
| `text-control-inverted`           | `#FCFCFC` | label on an inverted control           |
| `border-default`, `border-accent` | —         | resting and accent borders             |

### CSS variables

The variable behind each renamed token also moves to the new name, **but the 0.13.0 name stays in the fallback chain**:

| Preferred variable                   | Still honoured                                                         |
| ------------------------------------ | ---------------------------------------------------------------------- |
| `--bg-control-disable-primary`       | `--bg-control-disable`                                                 |
| `--bg-control-neutral-hover-muted`   | `--bg-control-neutral-hover`                                           |
| `--text-control-disable-primary`     | `--text-control-disable-alpha`                                         |
| `--text-control-disable-secondary`   | `--text-control-disable-beta`                                          |
| `--text-control-accent-hover`        | `--text-control-blue-hover`                                            |
| `--text-control-accent-active`       | `--text-control-blue-active`                                           |
| `--bg-gradient-1`, `--bg-gradient-2` | `--bg-control-accent-gradient-from`, `--bg-control-accent-gradient-to` |
| `--bg-gradient-1-hover`              | `--bg-control-accent-gradient-hover-from`                              |
| `--bg-gradient-2-active`             | `--bg-control-accent-gradient-active-to`                               |

**So for the control tokens above, a theme needs no change to keep its colours.** Only the Tailwind class names are breaking.

### The one variable rename with no fallback

The gradient under the selected tab is the exception. Its stops are `border-image` values in `src/styles/tabs.scss` rather than theme tokens, and they move without a fallback chain:

| Before (0.13.0)                                     | After (0.14.0)                                    |
| --------------------------------------------------- | ------------------------------------------------- |
| `--stroke-control-accent-gradient-from`/`-to`       | `--stroke-gradient-1` / `--stroke-gradient-2`     |
| `--stroke-control-accent-gradient-hover-from`/`-to` | `--bg-gradient-1-hover` / `--bg-gradient-2-hover` |

If your theme sets the 0.13.0 names, rename them — otherwise the underline drops to its light default (`#5976E9` → `#885DF2`). Note that the hover stops are read from the **`--bg-`** gradient tokens the buttons use, so a theme cannot give the tab underline a hover colour of its own; and the hover gradient's second stop is now `#885DF2` rather than `#956CFA`.

`border-control-disable-primary` deliberately resolves to the disabled _text_ colour (the flat underline under a disabled tab is the same grey as its label). It now leads with `--stroke-control-disable-primary` so a theme can override that border on its own, then falls through `--text-control-disable-primary` and `--text-control-disable-alpha`.

## Step-by-step migration

### 1. Find all usages

```bash
grep -rEn "(bg|text|border|divide|outline|stroke)-control-(disable-(alpha|beta)|blue-(hover|active))|bg-control-disable\b|bg-control-neutral-hover\b|-hover-alpha\b" src/
```

The `\b` on the last three matters: without it the search also flags the new `bg-control-disable-primary`, `bg-control-neutral-hover-muted` and `bg-control-error-alpha-hover`.

### 2. Rename the utilities

**Before:**

```tsx
<button
  className="bg-control-disable disabled:text-control-disable-alpha
             hover:text-control-blue-hover"
/>
```

**After:**

```tsx
<button
  className="bg-control-disable-primary disabled:text-control-disable-primary
             hover:text-control-accent-hover"
/>
```

In SCSS the `@apply` rules move the same way — and unlike a class in JSX, a stale `@apply` **fails the build**, so `npm run build:css` catches every one you missed:

```scss
.my-control:disabled {
  @apply text-control-disable-primary bg-control-disable-primary;
}
```

### 3. Only if you renamed your theme variables

If you drop the 0.13.0 variable names from your theme, set the new ones:

```css
:root {
  --text-control-disable-primary: #848e9c;
  --text-control-disable-secondary: #dce0e8;
  --bg-control-disable-primary: #dce0e8;
}
```

Keeping the old names works too — they are the next link in every chain.

### 4. Verify

```bash
npm run build:css   # a stale @apply is a hard error here
npm run typecheck && npm run test
```

## Notes

- `bg-control-disable-secondary` (`#ACB3C3`) is **not** the old `control-disable-beta`. The `-beta` text token became `text-control-disable-secondary` (`#DCE0E8`); the background `-secondary` step is new.
- A class name that no longer resolves is silent in JSX — Tailwind simply emits nothing and the element keeps whatever it inherited. Run the grep; do not rely on the page looking right.
- `ringColor` is not wired to these scales, so `ring-control-*` never resolved and still does not.
