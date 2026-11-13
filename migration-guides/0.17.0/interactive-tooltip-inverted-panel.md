# Migrating content on the inverted `InteractiveTooltip` panel — v0.16 → v0.17.0

## Why this changed

`InteractiveTooltip` drew a light floating card (`bg-layer-0`, `text-primary`),
while the plain `Tooltip` next to it is an inverted bubble. The design draws
both as inverted panels, so the two now match. The panel is
`bg-control-inverted` with `text-control-inverted` — dark in the light theme,
light in the dark theme.

Content that sets its own light-surface colours keeps them, so on the new
panel it loses contrast. The blue `ButtonVariant.Primary` link button that a
"View details" action usually is becomes hard to read, and so does text with
`text-primary` or `text-secondary`.

## What changed

| Before                                                         | After                                                         |
| -------------------------------------------------------------- | ------------------------------------------------------------- |
| Panel `bg-layer-0 text-primary`                                | Panel `bg-control-inverted text-control-inverted`             |
| Link button: `ButtonVariant.Primary` + `ButtonAppearance.Link` | `ButtonVariant.Inverted` + `ButtonAppearance.Link` (new)      |
| Text link: no component                                        | `Link` with `LinkVariant.Inverted` (new)                      |
| Text in `text-primary` / `text-secondary`                      | No colour class — inherit the panel's `text-control-inverted` |

This applies wherever the panel opens: a direct `InteractiveTooltip`, and the
`interactiveTooltip` of a `Dropdown` item or a `Select` option.

## Step-by-step migration

### 1. Find all usages

```bash
grep -rnE "InteractiveTooltip|interactiveTooltip" src/
```

For each hit, look at the `content` passed to the panel.

### 2. Switch link buttons to `ButtonVariant.Inverted`

**Before:**

```tsx
<InteractiveTooltip
  content={
    <>
      <p>Lets the model write and execute Python in an isolated sandbox.</p>
      <Button
        variant={ButtonVariant.Primary}
        appearance={ButtonAppearance.Link}
        label="View details"
      />
    </>
  }
>
  <MenuItem label="code-interpreter" />
</InteractiveTooltip>
```

**After:**

```tsx
<InteractiveTooltip
  content={
    <>
      <p>Lets the model write and execute Python in an isolated sandbox.</p>
      <Button
        variant={ButtonVariant.Inverted}
        appearance={ButtonAppearance.Link}
        label="View details"
      />
    </>
  }
>
  <MenuItem label="code-interpreter" />
</InteractiveTooltip>
```

`LinkButton` takes the same `variant`:
`<LinkButton variant={ButtonVariant.Inverted} label="View details" />`.

### 3. Use the inverted `Link` for links in text

```tsx
<p>
  See{' '}
  <Link href="/docs/sandbox" variant={LinkVariant.Inverted}>
    how the sandbox works
  </Link>
  .
</p>
```

### 4. Drop light-surface text colors

Remove `text-primary` / `text-secondary` from text inside the panel, so it
inherits `text-control-inverted`.

### 5. Or keep the old light panel

A panel that has to stay light — for example one that holds controls with no
inverted variant — can restore the previous look through `contentClassName`.
It is merged with `twMerge`, so it replaces the inverted colors:

```tsx
<InteractiveTooltip contentClassName="bg-layer-0 text-primary" content={…}>
```

The same `contentClassName` is available on a `Dropdown` item's or a `Select`
option's `interactiveTooltip`.

### 6. Verify

```bash
npm run typecheck
npm run test
```

Then open each panel and check its content is readable in both themes.

## Notes

- The panel's text color is inherited, so plain text needs no change.
- A test that asserted the panel's `bg-layer-0` class now sees
  `bg-control-inverted`.
- A `Select` multi-select with more tags than fit lists the hidden ones on this
  panel too (the `+N` counter), as `Tag` pills.
