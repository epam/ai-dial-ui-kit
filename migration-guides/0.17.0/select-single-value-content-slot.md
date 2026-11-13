# Migrating the single-select field value — v0.16.x → v0.17.0

## Why this changed

A single `Select` wrote its selected label into the `<input>`'s value. A focused
native input ignores `text-overflow: ellipsis` and scrolls to the caret, which
is at the end of the string. In a narrow field a long label therefore showed its
tail (`ase name`) as soon as the field received focus, for example when a popover
focused it.

The selected text is now drawn in the field's content slot through
`EllipsisTooltip`, which clips at the end and keeps the full text in a tooltip.
The `<input>` holds no selected text, so focus cannot scroll it. Options with a
`labelNode` or a `description` already worked this way; every single-select
display string now does.

## What changed

| Before                                                      | After                                                                                       |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Selected label (with `prefix`) is the input's `value`       | Selected label (with `prefix`) is rendered in the content slot; the input's `value` is `''` |
| `customSelectedValue` is the input's `value`                | `customSelectedValue` is rendered in the content slot; the input's `value` is `''`          |
| Combobox accessible name is the field name, e.g. `Operator` | Combobox accessible name includes the selected text, e.g. `Operator, Option 1`              |
| Plain labels never show a tooltip                           | A truncated plain label shows its full text in a tooltip                                    |
| `expect(field).toHaveValue('Option 1')`                     | `expect(field).toHaveValue('')` and `toHaveAccessibleName('Operator, Option 1')`            |

Props are unchanged. The placeholder still shows when nothing is selected, and
multi-select tags, `labelNode`, option descriptions and the overlay search field
behave as before.

## Step-by-step migration

### 1. Find all usages

```bash
# Assertions on a Select's input value
grep -rn "toHaveValue(" src/ | grep -i "combobox\|select"

# Queries that find a Select by its exact name, which now includes the selected text
grep -rn "getByRole('combobox', { name: '" src/
```

Only hits that target a single-select `Select` need changing. Text inputs,
`Search`, `TagInput`, `AutocompleteTagInput` and multi-select fields are not
affected.

### 2. Assert the displayed text, not the input value

**Before:**

```tsx
expect(screen.getByRole('combobox', { name: 'Operator' })).toHaveValue(
  'Option 1',
);
```

**After:**

```tsx
const field = screen.getByRole('combobox', { name: 'Operator, Option 1' });
expect(field).toHaveValue('');
expect(screen.getByText('Option 1')).toBeInTheDocument();
```

### 3. Match the name with the selected text

A combobox with a selection is named `<field name>, <selected label>`. An exact
query for the field name no longer matches once a value is selected. Use the
full name, or a pattern that is not anchored at the end:

**Before:**

```tsx
screen.getByRole('combobox', { name: 'Mode' });
```

**After:**

```tsx
screen.getByRole('combobox', { name: 'Mode, fast' });
// or, when the selection does not matter
screen.getByRole('combobox', { name: /^Mode/ });
```

### 4. Verify

```bash
npm run typecheck && npm run test
```

## Notes

- A single `Select` that has no selection still has its placeholder on the
  input, so `getByRole('combobox', { name: 'Mode' })` keeps matching then.
- Styling that targeted the input's text no longer applies to the selected label,
  which now sits in a `<span>` inside the field wrapper.
- The `<input>` is collapsed to zero width whenever the content slot is shown. It
  still takes focus and keyboard input, and the focus ring stays on the field.
