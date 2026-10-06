# Migrating legacy theme variables — v0.14.x → v0.15.0

## Why this changed

0.14.0 renamed several theme variables by role but kept the old names in each token's fallback chain (`var(--new, var(--old, #default))`), so a theme could set either name. Two names for one value meant a theme had to know which one won, and the chain never shrank. The kit now reads only the current name.

## What changed

| Old variable (no longer read)             | Current variable                            |
| ----------------------------------------- | ------------------------------------------- |
| `--bg-control-neutral-hover`              | `--bg-control-neutral-hover-muted`          |
| `--stroke-focus-black`                    | `--stroke-focus`                            |
| `--bg-control-accent-gradient-from`       | `--bg-gradient-1`, `--bg-gradient-1-active` |
| `--bg-control-accent-gradient-to`         | `--bg-gradient-2`, `--bg-gradient-2-hover`  |
| `--bg-control-accent-gradient-hover-from` | `--bg-gradient-1-hover`                     |
| `--bg-control-accent-gradient-active-to`  | `--bg-gradient-2-active`                    |

Tailwind class names (`bg-control-neutral-hover-muted`, `border-focus`, `bg-control-accent-gradient`, …) are unchanged. A theme that sets only an old variable now gets the kit's default colour instead of its own.

## Step-by-step migration

### 1. Find all usages

```bash
grep -rEn -- "--(bg-control-neutral-hover|stroke-focus-black|bg-control-accent-gradient-(from|to|hover-from|active-to))\b" src/
```

### 2. Rename the variables in your theme

**Before:**

```css
:root {
  --bg-control-neutral-hover: #e0e6f0;
  --stroke-focus-black: #161b2d;
  --bg-control-accent-gradient-from: #1d4ed8;
  --bg-control-accent-gradient-to: #885df2;
  --bg-control-accent-gradient-hover-from: #6785fb;
  --bg-control-accent-gradient-active-to: #7c3aed;
}
```

**After:**

```css
:root {
  --bg-control-neutral-hover-muted: #e0e6f0;
  --stroke-focus: #161b2d;
  --bg-gradient-1: #1d4ed8;
  --bg-gradient-1-active: #1d4ed8;
  --bg-gradient-2: #885df2;
  --bg-gradient-2-hover: #885df2;
  --bg-gradient-1-hover: #6785fb;
  --bg-gradient-2-active: #7c3aed;
}
```

`--bg-control-accent-gradient-from` and `-to` each fed two stops, so set both of their replacements to keep the same gradient in every state.

### 3. Verify

```bash
npm run typecheck
npm run test
```

## Notes

The font hooks (`--theme-font` → `--font-inter`, `--theme-font-mono` → `--font-fira-code`) are not legacy names and still chain.
