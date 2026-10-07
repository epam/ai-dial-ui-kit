# Migrating the redesigned `Slider` — v0.14.x → v0.15.0

## Why this changed

The 2.0 design system redrew the slider. Its thumb is now a solid accent disc
rather than a white disc with a border, its unfilled track is an accent tint
rather than grey, and hover, focus and drag grow a soft halo around the thumb.
The props API is unchanged, so typecheck stays green — but every `Slider` in an
app renders differently, and any host CSS written against the old thumb has to
be checked.

## What changed

| Part                         | Before (0.14.x)                                         | After (0.15.0)                                            |
| ---------------------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| Thumb size                   | 16px                                                    | 12px                                                      |
| Thumb fill / border          | `bg-control-neutral`, 1px `border-default`, soft shadow | `bg-control-accent`, no border, no shadow                 |
| Thumb hover / focus / active | `border-accent` plus `shadow-md` / `shadow-xs`          | 4px halo in `--stroke-accent-alpha`                       |
| Thumb keyboard focus         | `outline-focus`, offset 2px                             | `outline-focus`, offset 4px (outside the halo)            |
| Thumb disabled               | `bg-control-disable-secondary`, grey border             | `bg-control-disable-secondary`, no border                 |
| Unfilled track               | `bg-control-neutral-active`                             | `bg-control-accent-alpha-hover`                           |
| Fill end at `min` / `max`    | 8px in from the track ends                              | 6px in (half the new thumb)                               |
| New, opt-in                  | —                                                       | `showTooltip`, `showTicks`, `leftContent`, `rightContent` |

The pointer target is unchanged: the full-width, 24px-tall row. The
`dial-kit-slider` class keeps its name and stays on the range input.

## Step-by-step migration

### 1. Find all usages

```bash
# Every 2.0 Slider in the app
grep -rn "<Slider" src/
# Host CSS that restyles the thumb or the track
grep -rn "dial-kit-slider\|slider-thumb\|range-thumb" src/
```

### 2. Review host overrides of the thumb

A rule that recoloured the old white thumb, or relied on its border, now sits
on a borderless accent disc. Re-check it against the new look, or remove it if
it only existed to approximate this design.

**Before:**

```css
.my-panel .dial-kit-slider::-webkit-slider-thumb {
  border-color: var(--stroke-accent);
}
```

**After:** usually nothing — the thumb is accent-coloured by default. To change
its colour, set the theme variable instead of overriding the pseudo-element:

```css
.my-panel {
  --bg-control-accent: #0f766e;
}
```

### 3. Re-check `trackClassName`

The unfilled track default moved from `bg-control-neutral-active` to
`bg-control-accent-alpha-hover`. A caller that passed `trackClassName` keeps
its own colour; a caller that matched the old grey on purpose can pass
`trackClassName="bg-control-neutral-active"` to keep it.

### 4. Opt into the new parts of the design

```tsx
<Slider
  id="volume"
  labelProps={{ label: 'Volume' }}
  value={volume}
  min={0}
  max={100}
  step={1}
  showTooltip
  formatValue={(v) => `${v}%`}
  leftContent={<IconMicrophone aria-hidden="true" />}
  rightContent={
    <NumberInput
      aria-label="Volume value"
      value={volume}
      onChange={(v) => setVolume(Number(v))}
    />
  }
  onChange={setVolume}
/>
```

`showTooltip` reserves 28px above the track for the bubble, so turning it on
makes the field taller. `rightContent` is not synced by the kit: pass the field
the same `value` and setter as the slider.

### 5. Verify

```bash
npm run typecheck
npm run test
```

Then check the sliders visually — none of the change is visible to typecheck.

## Notes

The thumb is a pseudo-element styled in unlayered CSS, so a Tailwind class
passed through `className` still cannot reach it; theme variables are the
supported way to recolour it.
