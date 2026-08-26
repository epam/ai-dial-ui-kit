# Migrating the shadow variables to per-step names — v0.13.0 → v0.14.0

## Why this changed

The shadow scale was themed through three variables named after the **colours** in it, not after the steps that used them:

```js
// 0.13.0
DEFAULT: '0 0 4px 0 var(--shadow-default, rgba(0, 0, 0, 0.30))',
xs: '0 1px 4px 0 var(--shadow-grey-1000, …), 0 1px 2px 0 var(--shadow-blue-500, …)',
sm: '0 2px 12px 0 var(--shadow-grey-1000, …), 0 2px 6px 0 var(--shadow-blue-500, …)',
md: '0 6px 24px 0 var(--shadow-grey-1000, …), 0 6px 16px 0 var(--shadow-blue-500, …)',
lg: '0 10px 36px 0 var(--shadow-grey-1000, …), 0 10px 24px 0 var(--shadow-blue-500, …)',
```

One `--shadow-blue-500` carried the blue of all four steps, so a theme could not darken `lg` without darkening `xs` by the same amount — the ramp collapsed to a single value. `--shadow-grey-1000` had the same problem across the two steps that still use grey.

The design has since split the scale per step: `md` and `lg` are a **single** wide blue layer (the grey layer only muddies them at that size), and `xs` / `sm` keep two layers but with the blue as the wide one. Each step now reads its own variable, named after the step rather than the hue:

- `--shadow-xs-sm-1` / `--shadow-xs-sm-2` — the two layers `shadow-xs` and `shadow-sm` share, outer first.
- `--shadow-md`, `--shadow-lg` — the one layer each of those steps draws.

The Tailwind class names (`shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`) are **unchanged**. This is a theming change: only a host that sets the CSS variables has to do anything.

## What changed

### Variables

| 0.13.0 variable      | 0.14.0 variable                                                     | Light default                   |
| -------------------- | ------------------------------------------------------------------- | ------------------------------- |
| `--shadow-blue-500`  | `--shadow-xs-sm-1` (xs, sm)                                         | `#2764D933` (blue-500 alpha-20) |
| `--shadow-blue-500`  | `--shadow-md`                                                       | `#2764D90A` (blue-500 alpha-4)  |
| `--shadow-blue-500`  | `--shadow-lg`                                                       | `#2764D914` (blue-500 alpha-8)  |
| `--shadow-grey-1000` | `--shadow-xs-sm-2` (xs, sm only — `md` and `lg` have no grey layer) | `#161B2D08` (grey-1000 alpha-3) |
| `--shadow-default`   | _removed_ — `shadow` is no longer a DIAL shadow (see Notes)         | —                               |

The 0.13.0 names are **not** kept in the fallback chain: one old variable cannot map onto four new ones without re-flattening the ramp it was split to fix.

### Rendered shadows

| Step        | 0.13.0                                          | 0.14.0                                       |
| ----------- | ----------------------------------------------- | -------------------------------------------- |
| `shadow-xs` | `0 1px 4px` grey, `0 1px 2px` blue alpha-14     | `0 1px 4px` blue alpha-20, `0 1px 2px` grey  |
| `shadow-sm` | `0 2px 12px` grey, `0 2px 6px` blue alpha-14    | `0 2px 12px` blue alpha-20, `0 2px 6px` grey |
| `shadow-md` | `0 6px 24px` grey, `0 6px 16px` blue alpha-14   | `0 8px 24px` blue alpha-4                    |
| `shadow-lg` | `0 10px 36px` grey, `0 10px 24px` blue alpha-14 | `0 8px 44px` blue alpha-8                    |

In `xs` and `sm` the blue and grey layers have **swapped roles**: the blue is now the wide diffuse layer and the grey the tight one. `md` and `lg` sit lower and softer than before, so anything using them — `Card`, `Calendar`, `Input`, overlays, tooltips, the collapsible sidebar (`md`), `Notification` and card hover (`lg`) — reads differently.

## Step-by-step migration

### 1. Find the variables in your theme

```bash
grep -rEn -- "--shadow-(default|blue-500|grey-1000)" src/ themes/
```

Also check any theme JSON served by the DIAL themes service.

### 2. Rename them

**Before:**

```css
:root {
  --shadow-blue-500: #2764d924;
  --shadow-grey-1000: #161b2d08;
  --shadow-default: rgba(0, 0, 0, 0.3);
}
```

**After:**

```css
:root {
  --shadow-xs-sm-1: #2764d933; /* wide blue layer of xs and sm */
  --shadow-xs-sm-2: #161b2d08; /* tight grey layer of xs and sm */
  --shadow-md: #2764d90a;
  --shadow-lg: #2764d914;
}
```

Splitting one blue into three is the point of the change: pick a lighter value for `--shadow-md` and `--shadow-lg` than for `--shadow-xs-sm-1`, since those steps have no second layer to sit on. Setting all three to your old `--shadow-blue-500` value compiles, but reproduces the flat ramp.

### 3. Verify

```bash
npm run build:css
npm run typecheck && npm run test
```

Then confirm the variables reached the compiled shadows:

```bash
grep -o -- "--tw-shadow:0 [^;]*" dist/index.css | sort -u
```

Every DIAL step should reference a `--shadow-xs-sm-*` / `--shadow-md` / `--shadow-lg` variable.

## Notes

- **`shadow` (the `DEFAULT`) is no longer a DIAL shadow.** `boxShadow` is declared under `theme.extend`, so removing the `DEFAULT` entry does not remove the class — it falls back to Tailwind's own `shadow` (`0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`), which is a neutral black shadow and ignores `--shadow-default`. Replace a bare `shadow` with the step you mean, usually `shadow-sm`.
- A stale `--shadow-blue-500` in a theme is silent: nothing reads it, and every shadow quietly renders at its light default. Run the grep rather than trusting the page to look wrong.
- These names match `tailwind.config.js` in `ai-dial-chat`, so a variable set for the chat app resolves the same way in the kit.
