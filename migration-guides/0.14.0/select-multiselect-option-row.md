# Migrating the multi-select `Select` option row — v0.13.x → v0.14.0

## Why this changed

A multi-select option used to be a `role="option"` wrapper with a real
`<input type="checkbox">` inside it. That gave one choice two controls and two
states: the option announced `aria-selected` while the checkbox announced
`aria-checked`, and a screen reader had no way to tell which of the two it had
landed on. It also left most of the row inert — only the 20px box and the label
text selected the option, while the rest of the 40px rectangle did nothing, and
the overlay's arrow keys could not reach the row at all because the wrapper was
not focusable.

The row is now a single control, as the design has it and as the WAI-ARIA
listbox pattern prescribes: one `option` carrying `aria-selected`, with the
checkbox drawn as a decorative box. The whole row selects, Enter and Space
toggle it, and the arrow keys walk it like they already walked single-select
options.

Nothing in `SelectProps` changed. This only affects code — mostly tests — that
reached for the checkbox inside an option.

## What changed

| Before                                             | After                                         |
| -------------------------------------------------- | --------------------------------------------- |
| `role="option"` wrapper + nested `role="checkbox"` | one `role="option"` element                   |
| state on the checkbox's `aria-checked`             | state on the option's `aria-selected`         |
| clickable: the box and the label text              | clickable: the whole row                      |
| `<div>` wrapper, not focusable                     | `<button role="option">`, arrow-key reachable |
| Select All: `role="checkbox"`                      | Select All: `role="checkbox"` (**unchanged**) |

## Step-by-step migration

### 1. Find all usages

```bash
# Tests and helpers that address a multi-select option through its checkbox
grep -rn "getByRole('checkbox'\|getAllByRole('checkbox'\|role=\"checkbox\"" src/
```

Only the hits that target an **option of a multiple `Select`** need changing.
The Select All row above the list is still a real checkbox, as are `Checkbox`
and every other checkbox in your app.

### 2. Query the option instead of its checkbox

**Before:**

```tsx
fireEvent.click(screen.getByRole('checkbox', { name: 'Option 1' }));
expect(screen.getByRole('checkbox', { name: 'Option 1' })).toBeChecked();
```

**After:**

```tsx
fireEvent.click(screen.getByRole('option', { name: 'Option 1' }));
expect(screen.getByRole('option', { name: 'Option 1' })).toHaveAttribute(
  'aria-selected',
  'true',
);
```

`toBeChecked()` works on elements with `aria-checked` or a checkbox role, so it
does not apply to an `option`. Assert `aria-selected` instead.

### 3. Drop workarounds for the inert row

If you clicked the label text to work around the row not being clickable, or
focused the inner input to drive the keyboard, target the option directly:

**Before:**

```tsx
await user.click(screen.getByText('Option 1'));
```

**After:**

```tsx
await user.click(screen.getByRole('option', { name: 'Option 1' }));
```

### 4. Verify

```bash
npm run typecheck && npm run test
```

## Notes

- The option's accessible name now comes from its own content — the label, plus
  the option's `description` when it has one. The decorative box is
  `aria-hidden`, so it contributes nothing to the name.
- Custom styling that targeted the nested checkbox (for instance
  `[role="option"] input`) no longer matches anything. Style the row itself.
- If you render your own multiselect-looking row and want the same box, import
  `CheckboxBox` and leave `htmlFor` off — it renders the decorative variant.
