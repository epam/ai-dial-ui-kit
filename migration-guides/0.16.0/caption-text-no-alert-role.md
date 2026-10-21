# Migrating `CaptionText` / `ErrorText` without `role="alert"` — v0.15 → v0.16.0

## Why this changed

`CaptionText` and `ErrorText` rendered `role="alert"` on every caption. A plain
field description and every validation error became an assertive live region,
so a screen reader interrupted the user with helper text, and a host that
wrapped `ErrorText` in its own alert region announced the message twice.

A field's caption or error is a description of that field. Assistive
technology reads it when the field is focused, through `aria-describedby`, and
`aria-invalid` tells the user the value is wrong.

## What changed

| Before                                                    | After                                                                                     |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `CaptionText` / `ErrorText` render `role="alert"`         | No role; plain text with an optional `id`                                                 |
| `Input`, `Textarea`, `Select` error/caption not linked    | Linked through `aria-describedby`; `aria-invalid` is set when `error` or `invalid` is set |
| `SchemaRenderer` required error not linked to its control | Linked through `aria-describedby`                                                         |
| `Select` takes no external description                    | `ariaDescribedBy` adds ids of elements outside the field                                  |

`Input` and `Textarea` now give the control a generated `id` when none is
passed, so a `labelProps` label is associated with it. A caller's own
`aria-describedby` comes first, then the field's error or caption.

The legacy `DialCaptionText` / `DialErrorText` are unchanged.

## Step-by-step migration

### 1. Find all usages

```bash
grep -rnE "<(ErrorText|CaptionText)\b" src/
grep -rn "ByRole('alert')" src/
```

### 2. Link an `ErrorText` you render next to your own control

**Before:**

```tsx
<input aria-invalid={Boolean(error)} />
<ErrorText text={error} />
```

**After:**

```tsx
<input aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
<ErrorText id={errorId} text={error} />
```

Prefer the control's own `error` / `caption` props where the control has them:
the kit links them for you.

### 3. Keep an announcement where one is needed

A message that must interrupt the user — a failed submit, a load error with a
retry — belongs in an alert region of your own. It now announces once instead
of twice:

```tsx
<div role="alert">
  <ErrorText text={submitError} />
</div>
```

### 4. Update tests

A test that found a field error with `getByRole('alert')` now finds it by text,
or asserts the description on the control:

```tsx
expect(
  screen.getByRole('textbox', { name: 'Name' }),
).toHaveAccessibleDescription('Name is required');
```

### 5. Verify

```bash
npm run typecheck
npm run test
```

## Notes

Nothing visual changes: the classes, including `dial-kit-caption-text` and
`dial-kit-error-text`, are the same.
