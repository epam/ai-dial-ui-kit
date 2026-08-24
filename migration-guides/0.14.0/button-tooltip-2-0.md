# Migrating `Button` / `IconButton` tooltips — v`0.13.0` → v`0.14.0`

## Why this changed

`Button` and `IconButton` are generation 2.0 components, but their `tooltipProps` reached back
into the 1.0 `DialTooltip`, so a 2.0 button revealed its tooltip in the 1.0 bubble — no arrow,
the light surface instead of `bg-control-inverted`, and an element portaled and hidden with a
class even when there was nothing to show.

Both now wrap the 2.0 `Tooltip`, and they wrap it with `asChild`, so the tooltip's
`aria-describedby` lands on the button itself instead of on a wrapper `<span>` that assistive
technology never reaches.

## What changed

| Before                                                       | After                                                    |
| ------------------------------------------------------------ | -------------------------------------------------------- |
| `tooltipProps: Omit<DialTooltipProps, 'children'>`           | `tooltipProps: Omit<TooltipProps, 'children'>`           |
| `placement` takes the full floating-ui `Placement`           | `placement` takes the four-sided `TooltipPlacement` enum |
| The button is wrapped in a trigger `<span class="truncate">` | The button _is_ the trigger — no wrapper element         |
| `aria-describedby` sits on the wrapper `<span>`              | `aria-describedby` sits on the button                    |
| An empty or hidden tooltip still renders a hidden element    | Nothing is rendered when there is no tooltip to show     |

`tooltipProps` keeps every other key it had — `tooltip`, `hideTooltip`, `triggerClassName`,
`contentClassName`, `initialOpen`, `open`, `onOpenChange`, `isTriggerClickable`.

## Step-by-step migration

### 1. Find all usages

```bash
grep -rn "tooltipProps" src/
```

### 2. Replace an aligned placement with the enum

Only the four sides survive: `'top-start'`, `'bottom-end'` and the other aligned values have no
`TooltipPlacement` member. Pick the side they were aligned on.

**Before:**

```tsx
<Button
  label="Save"
  tooltipProps={{ tooltip: 'Save draft', placement: 'top-start' }}
/>
```

**After:**

```tsx
import { TooltipPlacement } from '@epam/ai-dial-ui-kit';

<Button
  label="Save"
  tooltipProps={{ tooltip: 'Save draft', placement: TooltipPlacement.Top }}
/>;
```

### 3. Drop layout classes that only existed for the wrapper

`triggerClassName` now lands on the button, not on a `<span>` around it. Classes that were
compensating for that wrapper — centring the content, `flex-1`, `truncate` — are usually
redundant or actively wrong on the control, and layout that relied on the extra inline element
between the button and its flex parent has to move to the button's own `className`.

**Before:**

```tsx
<IconButton
  icon={<IconInfoCircle />}
  tooltipProps={{
    tooltip: caption,
    triggerClassName: 'flex justify-center items-center',
  }}
/>
```

**After:**

```tsx
<IconButton icon={<IconInfoCircle />} tooltipProps={{ tooltip: caption }} />
```

### 4. Point tests at the button, not the wrapper

A test that queried the trigger `<span>`, or asserted `aria-describedby` on it, now finds the
attribute on the button:

```tsx
await user.hover(screen.getByRole('button', { name: 'Save' }));
const tooltip = await screen.findByRole('tooltip');
expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute(
  'aria-describedby',
  tooltip.id,
);
```

### 5. Verify

```bash
npm run typecheck
npm run test
```

## Notes

- The 1.0 `DialButton` and `DialIconButton` are untouched and keep the 1.0 tooltip.
- As in 1.0, the 2.0 tooltip renders nothing on mobile screens, so a tooltip still cannot be a
  control's only accessible name. Both buttons continue to fall back to a string
  `tooltipProps.tooltip` as their `aria-label` when nothing else names them.
