# Migrating the heading type scale — v0.12.x → v0.13.0

## Why this changed

The design system's type scale has three display sizes and three heading sizes. The kit only had two display classes, so the 22px step that design calls **Display 3** was shipping as `dial-h1-text`, and every heading class was one step larger than the design named it.

Adding `dial-display3-text` at 22px/32px puts the 22px step where it belongs and lets `dial-h1-text`, `dial-h2-text`, and `dial-h3-text` carry the sizes design assigns to Heading 1–3. The set of available sizes is unchanged — the same six steps exist before and after. What moved is which class name each one answers to.

## What changed

| Class                 | Before      | After             |
| --------------------- | ----------- | ----------------- |
| `.dial-display1-text` | 32px / 48px | 32px / 48px       |
| `.dial-display2-text` | 28px / 40px | 28px / 40px       |
| `.dial-display3-text` | —           | 22px / 32px (new) |
| `.dial-h1-text`       | 22px / 32px | **20px / 28px**   |
| `.dial-h2-text`       | 20px / 28px | **18px / 26px**   |
| `.dial-h3-text`       | 18px / 26px | **16px / 24px**   |

All six stay `font-weight: 600` with no letter-spacing.

The kit also styles bare `h1`, `h2`, and `h3` elements from these classes, so **unclassed headings shrink one step too** — an `<h1>` with no `className` renders at 20px/28px instead of 22px/32px.

## Step-by-step migration

### 1. Find all usages

```bash
grep -rEn "dial-h[123]-text" src/
```

Also find headings that rely on the element defaults rather than a class, since those change with no class name to grep for:

```bash
grep -rEn "<h[123](\s|>)" src/
```

### 2. Decide per usage: keep the size, or keep the semantic level

This is the whole migration, and it is a judgement call rather than a rename — a blind find-and-replace gets it wrong either way.

**To keep the rendered size identical**, shift the class name up one step:

| Before                | After                       |
| --------------------- | --------------------------- |
| `dial-h1-text` (22px) | `dial-display3-text` (22px) |
| `dial-h2-text` (20px) | `dial-h1-text` (20px)       |
| `dial-h3-text` (18px) | `dial-h2-text` (18px)       |

**To adopt the new scale**, leave the class name alone and accept the smaller size. This is right where the class was chosen to match the heading level (an `<h2>` styled `dial-h2-text`) rather than to hit a specific pixel size.

**Before** — a dialog title that should stay at 20px:

```tsx
<h2 className="dial-h2-text">Delete conversation</h2>
```

**After:**

```tsx
<h2 className="dial-h1-text">Delete conversation</h2>
```

An `<h3>` that was picked purely for its 18px size and does not head a section is usually better off as `dial-body-semi-text` (16px/24px, the same metrics as the new `dial-h3-text`) on a non-heading element.

### 3. Re-check unclassed headings

A bare `<h1>` in prose, markdown output, or a `prose` block picks up the new 20px/28px automatically. If a specific block must hold its old size, name the class explicitly:

```tsx
<h1 className="dial-display3-text">Reports</h1>
```

### 4. Verify

```bash
npm run typecheck
npm run test
```

Neither sees Tailwind class strings, so confirm the compiled values as well:

```bash
npm run build:css
grep -o "\.dial-h1-text{[^}]*}" dist/index.css
```

Then do a visual pass in Storybook — **DIAL/Typography** shows the full scale side by side, and a heading that shrank one step is the failure mode to look for.

## Notes

- Inside the kit, the 2.0 `Popup` title was re-pointed `dial-h2-text` → `dial-h1-text` and renders exactly as it did in 0.12.x. The 1.0 `DialPopup` title keeps `dial-h3-text` and therefore **adopts the new scale**: it drops from 18px/26px to 16px/24px. Nothing to change on your side — pass `titleClassName="dial-h2-text"` if a particular dialog must hold its old size.
- Nothing about this change is visible to TypeScript. A missed usage compiles, tests pass, and the heading simply renders one step small — so the grep in step 1 is the only reliable sweep.
