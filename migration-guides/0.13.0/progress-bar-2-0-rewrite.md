# Migrating `DialProgressBar` → `ProgressBar` — v0.12.x → v0.13.0

## Why this changed

`DialProgressBar` was built on 1.0 design tokens (`bg-layer-4`, `bg-controls-accent-primary`) that are on the removal list, so it could not be used in a 2.0 screen without dragging the legacy palette in with it. Rebuilding it on the 2.0 set also let it pick up the conventions the rest of the 2.0 components already follow: no `Dial*` prefix, the shared `ElementSize` enum instead of a bespoke one, and native props passed through.

Unlike the [`Spinner` rename](spinner-dial-prefix-removal.md), this is **not** a rename only — the size enum, the label prop, and the rendered colors all changed.

## What changed

| Before                                | After                                        |
| ------------------------------------- | -------------------------------------------- |
| `DialProgressBar`                     | `ProgressBar`                                |
| `DialProgressBarProps`                | `ProgressBarProps`                           |
| `DialProgressBarSize.Small` (`'sm'`)  | `ElementSize.Small` (`'small'`)              |
| `DialProgressBarSize.Medium` (`'md'`) | `ElementSize.Standard` (`'standard'`)        |
| `ariaLabel="…"`                       | `aria-label="…"`                             |
| _no visible label_                    | `label` — renders above the bar and names it |

Unchanged: `value`, `max` (default `100`), `className` (still lands on the track element), the `role="progressbar"` element with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`, the clamping of `value` into `0…max`, and the 4px / 8px heights.

Also changed, but requiring no code edit:

- **Colors** — track `bg-layer-4` → `bg-control-disable`, fill `bg-controls-accent-primary` → `bg-control-accent`. Both now match the 2.0 `Switch`.
- **Native props** — `ProgressBarProps` extends `HTMLAttributes<HTMLDivElement>`, so `aria-valuetext`, `data-*`, `onClick`, and the rest reach the element. `aria-valuetext` is the one to reach for when a percentage is not the useful announcement.
- **Reduced motion** — the width transition is now suppressed under `prefers-reduced-motion`.
- **Degenerate input** — a non-positive `max` or a non-finite `value` renders an empty bar instead of `width: NaN%`.
- The Storybook entry moved from `DIAL/Status/ProgressBar` to `Components_2_0/ProgressBar`. Story URLs only.

## Step-by-step migration

### 1. Find all usages

```bash
grep -rn "DialProgressBar" src/
```

### 2. Rename the import, the tag, and the size enum

**Before:**

```tsx
import {
  DialProgressBar,
  DialProgressBarSize,
  type DialProgressBarProps,
} from '@epam/ai-dial-ui-kit';

<DialProgressBar value={40} ariaLabel="Upload progress" />;
<DialProgressBar value={40} size={DialProgressBarSize.Small} />;
<DialProgressBar value={40} size={DialProgressBarSize.Medium} />;
```

**After:**

```tsx
import {
  ProgressBar,
  ElementSize,
  type ProgressBarProps,
} from '@epam/ai-dial-ui-kit';

<ProgressBar value={40} aria-label="Upload progress" />;
<ProgressBar value={40} size={ElementSize.Small} />;
<ProgressBar value={40} size={ElementSize.Standard} />;
```

`ElementSize.Standard` is the default, so `size={DialProgressBarSize.Medium}` can simply be dropped.

### 3. Replace the generic label with a real one

`ariaLabel` defaulted to `"Progress"`, so a screen has as many bars called "Progress" as it has bars. Where the bar has visible surrounding text, promote it into `label` — it renders above the bar and names it through `aria-labelledby`:

**Before:**

```tsx
<span className="dial-small-text">Uploading</span>
<DialProgressBar value={progress} />
```

**After:**

```tsx
<ProgressBar value={progress} label="Uploading" />
```

Where the bar has no visible label, keep naming it explicitly with `aria-label`. The `"Progress"` fallback still applies if you pass neither, so no bar ends up anonymous.

### 4. Verify

```bash
npm run typecheck
npm run test
```

`typecheck` catches every usage: the old names are gone from the barrel, so the imports fail to resolve, and `ariaLabel` is no longer an accepted prop.

## Notes

- `ariaLabel` does **not** silently keep working — it is not part of `HTMLAttributes`, so TypeScript rejects it rather than passing it through as an unknown DOM attribute.
- Tests asserting `getByRole('progressbar')` keep passing. Prefer tightening them to `getByRole('progressbar', { name })` now that the name is meaningful.
- If you relied on the exact track color, note that `bg-control-disable` (`#DCE0E8`) is lighter than the old `bg-layer-4` (`#D1DBEA`).
- `DialLoader` and `Skeleton` are different components and are not affected.
