# Migrating the shadow scale — v0.13.0 → v0.14.0

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

The design has since split the scale per step: `sm`, `md` and `lg` are a **single** wide blue layer (the grey layer only muddies them at that size), and `xs` keeps two layers but with the blue as the wide one. Each step now reads its own variable, named after the step rather than the hue:

- `--shadow-sm`, `--shadow-md`, `--shadow-lg` — the one layer each of those steps draws.
- `--shadow-xs-1` / `--shadow-xs-2` — the two layers `shadow-xs` draws, outer first.

`sm` also changed meaning. It used to be the resting shadow of a solid button; it is now the **side panel** shadow — `0 8px 10px` at blue-500 alpha-8, used by the side bar, the side panel and the right panel. The value it used to hold has not changed at all, but it no longer has a step in the design scale, so it is written out in `buttons.scss` as a class instead of taking a fifth `boxShadow` key:

| Role                                                      | 0.13.0      | 0.14.0                    |
| --------------------------------------------------------- | ----------- | ------------------------- |
| Side bar / side panel / right panel                       | —           | `shadow-sm`               |
| Resting shadow of a solid button, the FAB, a slider thumb | `shadow-sm` | `dial-kit-control-shadow` |

## What changed

### Variables

| 0.13.0 variable      | 0.14.0 variable                                                 | Light default                   |
| -------------------- | --------------------------------------------------------------- | ------------------------------- |
| `--shadow-blue-500`  | `--shadow-xs-1` (xs and `dial-kit-control-shadow`)              | `#2764D933` (blue-500 alpha-20) |
| `--shadow-blue-500`  | `--shadow-sm`                                                   | `#2764D914` (blue-500 alpha-8)  |
| `--shadow-blue-500`  | `--shadow-md`                                                   | `#2764D90F` (blue-500 alpha-6)  |
| `--shadow-blue-500`  | `--shadow-lg`                                                   | `#2764D914` (blue-500 alpha-8)  |
| `--shadow-grey-1000` | `--shadow-xs-2` (the same two — no other step has a grey layer) | `#161B2D08` (grey-1000 alpha-3) |
| `--shadow-default`   | _removed_ — `shadow` is no longer a DIAL shadow (see Notes)     | —                               |

The 0.13.0 names are **not** kept in the fallback chain: one old variable cannot map onto five new ones without re-flattening the ramp it was split to fix.

### Rendered shadows

| Step                      | 0.13.0                                          | 0.14.0                                       |
| ------------------------- | ----------------------------------------------- | -------------------------------------------- |
| `shadow-xs`               | `0 1px 4px` grey, `0 1px 2px` blue alpha-14     | `0 1px 4px` blue alpha-20, `0 1px 2px` grey  |
| `dial-kit-control-shadow` | _(new — held by `shadow-sm` in 0.13.0)_         | `0 2px 12px` blue alpha-20, `0 2px 6px` grey |
| `shadow-sm`               | `0 2px 12px` grey, `0 2px 6px` blue alpha-14    | `0 8px 10px` blue alpha-8                    |
| `shadow-md`               | `0 6px 24px` grey, `0 6px 16px` blue alpha-14   | `0 8px 24px` blue alpha-6                    |
| `shadow-lg`               | `0 10px 36px` grey, `0 10px 24px` blue alpha-14 | `0 8px 44px` blue alpha-8                    |

In `xs` the blue and grey layers have **swapped roles**: the blue is now the wide diffuse layer and the grey the tight one. `md` and `lg` sit lower and softer than before, so anything using them — `Card`, `Calendar`, `Input`, overlays, tooltips, the collapsible sidebar (`md`), `Notification` and card hover (`lg`) — reads differently. `dial-kit-control-shadow` renders exactly what `shadow-sm` rendered in 0.13.0, so a control that switches to it is unchanged.

## Step-by-step migration

### 1. Move the resting control shadow to `dial-kit-control-shadow`

`shadow-sm` on a button, a FAB or any other resting control is now the panel shadow — a wider, lower, much fainter blue that reads as a floating surface rather than a raised control. Find them:

```bash
grep -rn "shadow-sm" src/
```

**Before:**

```tsx
<button className="rounded-full bg-control-neutral shadow-sm">New chat</button>
```

**After:**

```tsx
<button className="rounded-full bg-control-neutral dial-kit-control-shadow">
  New chat
</button>
```

Keep `shadow-sm` where the element is a side bar, side panel or right panel — that is what the step now means.

`dial-kit-control-shadow` is a plain class in the kit's stylesheet, not a Tailwind utility, so it is **unlayered**: it beats any `shadow-*` utility on the same element regardless of order. Do not pair it with one — pick whichever of the two the element should draw.

### 2. Find the variables in your theme

```bash
grep -rEn -- "--shadow-(default|blue-500|grey-1000)" src/ themes/
```

Also check any theme JSON served by the DIAL themes service.

### 3. Rename them

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
  --shadow-xs-1: #2764d933; /* wide blue layer of xs and the control shadow */
  --shadow-xs-2: #161b2d08; /* tight grey layer of the same two */
  --shadow-sm: #2764d914;
  --shadow-md: #2764d90f;
  --shadow-lg: #2764d914;
}
```

Splitting one blue into four is the point of the change: pick a lighter value for `--shadow-sm`, `--shadow-md` and `--shadow-lg` than for `--shadow-xs-1`, since those steps have no second layer to sit on. Setting all four to your old `--shadow-blue-500` value compiles, but reproduces the flat ramp.

### 4. Verify

```bash
npm run build:css
npm run typecheck && npm run test
```

Then confirm the variables reached the compiled shadows:

```bash
grep -o -- "--tw-shadow:0 [^;]*" dist/index.css | sort -u
```

Every DIAL step should reference a `--shadow-xs-*` / `--shadow-sm` / `--shadow-md` / `--shadow-lg` variable.

## Notes

- **`shadow` (the `DEFAULT`) is no longer a DIAL shadow.** `boxShadow` is declared under `theme.extend`, so removing the `DEFAULT` entry does not remove the class — it falls back to Tailwind's own `shadow` (`0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`), which is a neutral black shadow and ignores `--shadow-default`. Replace a bare `shadow` with the step you mean — `dial-kit-control-shadow` for a control, `shadow-md` for a raised surface.
- **A `shadow-sm` left on a button still compiles.** Nothing typechecks a Tailwind class, so the only signal is the rendering: the control loses its tight halo and picks up a faint wide one. Run the grep in step 1 rather than waiting for an error.
- A stale `--shadow-blue-500` in a theme is silent: nothing reads it, and every shadow quietly renders at its light default. Run the grep rather than trusting the page to look wrong.
- These names match `tailwind.config.js` in `ai-dial-chat`, so a variable set for the chat app resolves the same way in the kit.
