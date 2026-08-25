# Migrating `Tag` — one size, no rim — v`0.13.x` → v`0.14.0`

## Why this changed

The 2.0 tag is one shape: a 32px pill. The old `size` prop offered two heights
(24px standard, 20px small) that the design system no longer draws, and a tag is
not a control a caller sizes — it labels content, so it takes the size the
design gives it. Dropping the prop also removes the branch that had to keep two
geometries, two pointer-target rules and two radii in step.

The rim went with it. No tag draws a border any more: the outlined chip is told
apart by its fill on the raised layer, and the accent tint carries hover and
selection. A 1px rim on a 32px pill was doing no work the fill was not already
doing, and it was the last thing keeping a border box on the borderless
selectable chip.

Alongside it, the selectable chip picks up the rest of its spec: a semibold
label once selected, and hover carried by the accent tint alone instead of also
darkening the label.

## What changed

| Before                                             | After                                               |
| -------------------------------------------------- | --------------------------------------------------- |
| `<Tag size={ElementSize.Standard} />`              | `<Tag />`                                           |
| `<Tag size={ElementSize.Small} />`                 | `<Tag />` — there is no 20px tag                    |
| `TagProps['size']`                                 | removed from the type                               |
| 24px tall, `rounded-lg`, 8px side padding          | 32px tall, `rounded-full`, 12px side padding        |
| 1px rim (`border-tertiary`, `border-accent-alpha`) | no border on any tag                                |
| Outlined hover: rim → `border-accent-alpha`        | Hover: `bg-control-accent-alpha-hover` on every tag |
| Selected selectable chip: regular label            | Selected selectable chip: semibold label            |
| Selectable chip hover: label → `text-primary`      | Label colour unchanged on hover                     |
| `disabled` dimmed the tag and sank its fill        | `disabled` only stops it responding                 |
| `transition-colors duration-200`                   | no transition — the design switches the fill at 0ms |
| `TagInput size="sm"` rendered 20px tags            | Renders the one 32px tag; the field grows to fit    |

`Tag` is the only component with a changed public API. `TagInput`, `Select` and
`MultiSelectTags` compose it and need no changes at the call site, but their
tags are visibly taller.

## Step-by-step migration

### 1. Find all usages

```bash
# Tags that pass a size
grep -rn "<Tag" -A 6 src/ | grep -n "size="

# Layouts that assumed the old 24px/20px tag height
grep -rn "h-\[24px\]\|h-\[20px\]" src/
```

### 2. Drop the prop

**Before:**

```tsx
<Tag label="TypeScript" size={ElementSize.Small} />
<Tag label="Drafts" size={ElementSize.Standard} selected onClick={toggle} />
```

**After:**

```tsx
<Tag label="TypeScript" />
<Tag label="Drafts" selected onClick={toggle} />
```

### 3. Re-check the containers around your tags

A tag is 8px taller than the 0.13.x standard one and 12px taller than the small
one, so any row with a fixed height needs another look:

```tsx
// Before: a row sized to the old tag
<div className="flex h-[24px] items-center gap-1">{tags}</div>

// After: let the row take the tag's height
<div className="flex items-center gap-1">{tags}</div>
```

The same applies to a small `TagInput`: its field is `min-h-[24px]` over
`h-auto`, so it grows around the tags rather than clipping them — but a wrapper
you gave a fixed height will clip.

### 4. Update tests that asserted the old geometry

```diff
-expect(tag).toHaveClass('h-[20px]');
+expect(tag).toHaveClass('h-[32px]');
```

### 5. Verify

```bash
npm run typecheck && npm run test
```

`typecheck` finds every remaining `size` on a `Tag` for you — the prop is gone
from `TagProps`, so each one is a type error rather than a silent no-op.

## Notes

- A disabled tag is no longer dimmed — the design defines no disabled tag, so
  `disabled` keeps the colours and only removes the click handling, the remove
  control and the pointer. If your UI relies on a disabled tag being visibly
  inert, say so with the surrounding copy or pass your own `className`.
- `TagAppearance.Outlined` keeps its name even though it no longer outlines
  anything — renaming it would be a second breaking change in the same release.
  Read it as "the default filled chip".
- The selected selectable chip is set in `dial-tiny-semi-text`, so selecting one
  changes its width by the difference between the regular and semibold label. In
  a wrapping filter row that is the intended behaviour; give the chip a width if
  a stable layout matters more.
- `dial-kit-minimum-target` is gone from the tag itself. At 32px the rendered
  size clears the WCAG 2.5.8 minimum of 24×24 on its own, so the pseudo-element
  is no longer needed — and with it goes the target that used to sit over a
  nested remove button. The remove button keeps its own.
- The class matrix now lives in `src/components/New/Tag/constants.ts`
  (`tagBaseClassName`, `tagStateClassNames`, `tagHoverClassName`). These are
  internal — they are not exported from the package.
