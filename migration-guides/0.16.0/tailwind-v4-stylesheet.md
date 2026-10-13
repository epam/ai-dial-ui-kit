# Migrating to the Tailwind CSS v4 stylesheet — v0.15.x → v0.16.0

## Why this changed

The kit's `styles.css` is now built with Tailwind CSS v4 instead of v3. `tailwind-merge`, which the components use to merge class names, already targets v4 class names, so the kit had been merging against one Tailwind version while building with another.

Class names, props and theme variables are unchanged. What changed is how the shipped stylesheet takes part in your page's cascade and what its preflight resets. Typecheck cannot detect either change, so they show up only when the page is rendered.

## What changed

| Area                                                                                                       | v0.15.x (Tailwind v3)                              | v0.16.0 (Tailwind v4)                       |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------- |
| Variant utilities (`hover:`, `focus-visible:`, `disabled:`, `placeholder:`, `before:`, `mobile:`, `md:` …) | Unlayered, after `@layer ui`                       | Inside `@layer ui`                          |
| Base utilities (`flex`, `bg-*`, `text-*` …)                                                                | `@layer ui`                                        | `@layer ui` (now `ui.utilities`)            |
| Kit classes (`dial-*`, `dial-kit-*`)                                                                       | Unlayered                                          | Unlayered                                   |
| `hover:` utilities                                                                                         | Applied on every device                            | Applied only where `(hover: hover)` matches |
| `input`, `select`, `textarea`                                                                              | Browser default background and radius              | Transparent background, no radius           |
| `margin` / `padding` reset                                                                                 | Listed elements (`h1`–`h6`, `p`, `ul`, `button` …) | Every element                               |
| `[hidden]`                                                                                                 | `display: none`                                    | `display: none !important`                  |
| Placeholder colour, pointer cursor on buttons, centred `<dialog>`                                          | v3 values                                          | Unchanged: the kit keeps the v3 values      |
| Tailwind theme variables on `:root`                                                                        | None                                               | None: values are written into the utilities |
| Browser baseline                                                                                           | Native CSS nesting (Safari 16.5+, Chrome 112+)     | Safari 16.4+, Chrome 111+, Firefox 128+     |

### Variant utilities and your own CSS

The kit puts Tailwind in a cascade layer named `ui` so that unlayered CSS (your app's styles and the kit's own `dial-*` classes) always beats a plain utility. Tailwind v3 placed variant utilities outside that layer. They competed with your unlayered CSS on specificity and source order, and often won, because `.hover\:bg-x:hover` is more specific than a single class.

In v4 they are inside `@layer ui`, so any unlayered rule in your app that sets the same property now wins. For example, take a kit element with a `hover:` background. If your stylesheet also sets that element's `background-color`, the hover state disappears.

## Step-by-step migration

### 1. Find CSS that targets kit elements

Look for unlayered rules in your app that style elements the kit renders, especially rules that set colour, background, border or outline:

```bash
grep -rnE "\.dial-|\[class\*=\"dial-|\.ag-" src/ --include=*.css --include=*.scss
```

Where such a rule should give way to the kit's interactive states, put it in a layer that comes before `ui`, or scope it to the resting state:

**Before:**

```css
.my-toolbar .dial-kit-primary-ghost-button {
  background-color: var(--my-toolbar-bg);
}
```

**After:**

```css
@layer app {
  .my-toolbar .dial-kit-primary-ghost-button {
    background-color: var(--my-toolbar-bg);
  }
}
```

Declare the order once, before the kit's stylesheet is loaded: `@layer app, ui;`.

### 2. Restore form-control defaults if your page relied on them

The kit's preflight reaches every element on the page, not only the kit's own. If your own `input`, `select` or `textarea` elements carry no background or radius class and should keep the browser's look, restore it in your stylesheet:

```css
input,
select,
textarea {
  background-color: Field;
  border-radius: revert;
}
```

The same applies to elements that relied on the browser's default `margin` or `padding` (`td`, `option`): set them explicitly.

### 3. Check `hidden` elements

An element with the `hidden` attribute is now hidden even when it also has a display utility such as `flex`. If you toggle visibility with both, drop the attribute or the utility.

### 4. Check touch devices

`hover:` utilities no longer apply on devices without a hovering pointer, so a state that a tap used to trigger as a "sticky hover" no longer shows. Use `active:` or `focus-visible:` where a touch state is intended.

### 5. Verify

```bash
npm run typecheck
npm run test
```

Then open the screens that use the kit in a desktop browser and on a touch device, and check hover, focus and disabled states, form fields and popups.

## Notes

- Hosts that build with Tailwind v4 themselves keep their own theme. The kit writes theme values directly into its utilities and declares no `--font-sans`, `--spacing`, `--radius-*` or `--color-*` on `:root`, so it cannot override yours.
- The kit's stylesheet registers Tailwind v4's `--tw-*` custom properties (`@property`) and declares a top-level `@layer properties`. A host on Tailwind v4 declares the same names with the same definitions.
- `@apply dial-…` against the kit's classes was not supported before and is still not supported. Tailwind v4's `@apply` accepts only utilities.
