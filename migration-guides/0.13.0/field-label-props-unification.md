# Migrating `label` → `labelProps` on `Calendar`, `Switch` and `ProgressBar` — v`0.12.x` → v`0.13.0`

## Why this changed

Generation 2.0 has one component for naming a field — [`Label`](../../src/components/New/Label/Label.tsx) — and it carries three things a field label needs: the text, the required marker (`*` plus a visually hidden `(required)`), and a `caption` info button.

`Input`, `Textarea`, `Select`, `NumberInput`, `PasswordInput` and `TagInput` all take it as a single `labelProps` object. `Calendar`, `Switch` and `ProgressBar` instead took a bare `label` string or node, rendered it themselves, and left no way to reach `required`, `caption` or `size`. Two spellings for the same idea meant a field could be marked required in one component and not in the next.

All three now take `labelProps`, so every 2.0 control names itself the same way.

## What changed

| Component     | Before                       | After                                            |
| ------------- | ---------------------------- | ------------------------------------------------ |
| `Calendar`    | `label?: string`             | `labelProps?: LabelProps`                        |
| `Switch`      | `label?: ReactNode`          | `labelProps?: LabelProps`                        |
| `ProgressBar` | `label?: ReactNode`          | `labelProps?: LabelProps`                        |
| `FileDropzone`| —                            | `labelProps?: LabelProps` (new, additive)        |

`LabelProps` is already exported from the package:

```ts
import type { LabelProps } from '@epam/ai-dial-ui-kit';
// { label?: ReactNode; required?: boolean; caption?: string; size?: ElementSize; … }
```

### Markup changes in `Switch`

The track and the label text used to sit inside one `<label>` wrapper. They are now two sibling `<label for>` elements, because a `caption` info button nested inside a `<label>` forwards its clicks to the labelled control. Clicking either the track or the text still toggles the switch.

Two consequences for consumers styling the switch:

- `className` now lands on the row that holds the track and the label, not on the `<label>` wrapper. In practice it is the same box; the `rounded-full` it used to carry moved to the track.
- The focus ring is drawn around the track rather than around the track plus the label text.

## Step-by-step migration

### 1. Find all usages

```bash
grep -rnE "<(Calendar|Switch|ProgressBar)[^>]*label=" src/
```

Watch for the props that are **not** renamed: `aria-label` on any of the three, `valueLabel` on `ProgressBar`, and the in-area `label` copy on `FileDropzone` all stay as they are.

### 2. Replace with the new API

**Before:**

```tsx
<Calendar mode={CalendarMode.Date} label="Start date" value={date} onChange={setDate} />
<Switch label="Active" isOn={isActive} onChange={setIsActive} />
<ProgressBar value={40} label="Uploading" />
```

**After:**

```tsx
<Calendar
  mode={CalendarMode.Date}
  labelProps={{ label: 'Start date' }}
  value={date}
  onChange={setDate}
/>
<Switch labelProps={{ label: 'Active' }} isOn={isActive} onChange={setIsActive} />
<ProgressBar value={40} labelProps={{ label: 'Uploading' }} />
```

### 3. Take the props you could not reach before

```tsx
<Calendar
  mode={CalendarMode.Date}
  labelProps={{
    label: 'Start date',
    required: true,
    caption: 'The report covers everything from this day on',
  }}
/>
```

### 4. Verify

```bash
npm run typecheck
npm run test
```

## Notes

- `Calendar` accepted only a `string`; `labelProps.label` is a `ReactNode`, so a node label is now possible. The popover dialog and the weekday listbox still need a plain string for their accessible names and fall back to the placeholder when the label is a node.
- `ProgressBar` keeps naming itself through `aria-labelledby`, and still falls back to `aria-label` and then to `"Progress"` when no label is given.
- `Switch` keeps its own `caption` prop, which renders a description below the control and is wired up with `aria-describedby`. That is a different thing from `labelProps.caption`, which is the info button beside the label.
- `FileDropzone` is additive: `labelProps` names the field above the area, while the existing `label` stays the copy inside it. Both point at the same input, so its accessible name reads as the field name followed by that copy.
