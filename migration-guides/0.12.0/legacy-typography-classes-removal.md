# Migrating legacy typography classes — v0.11.x → v0.12.0

## Why this changed

The library carried two parallel typography scales: the original `dial-h1`, `dial-body`, `dial-small*`, `dial-tiny*`, `dial-caption` classes, and the newer `dial-*-text` scale. This duplication made it unclear which classes were current and led to inconsistent type usage across consumers. The legacy scale has been removed so `dial-*-text` is the single source of truth for typography.

## What changed

| Before (removed)    | After (`dial-*-text` scale)                    | Notes                                                   |
| ------------------- | ---------------------------------------------- | ------------------------------------------------------- |
| `dial-h1`           | `dial-h1-text`                                 | size/line-height updated (20/24 → 22/32)                |
| `dial-h2`           | `dial-h2-text`                                 | now `font-semibold` (was `font-normal`)                 |
| `dial-h3`           | `dial-h3-text`                                 | size/line-height updated (16/18 → 18/26)                |
| `dial-body`         | `dial-body-text` or `dial-body-paragraph-text` | use `-paragraph-` variant for looser line-height (26px) |
| `dial-small`        | `dial-small-text`                              | line-height updated (16 → 20)                           |
| `dial-small-semi`   | `dial-small-semi-text`                         | line-height updated (16 → 20)                           |
| `dial-small-medium` | `dial-small-text`                              | consolidated — both were `font-normal` at 14px          |
| `dial-small-150`    | `dial-small-text`                              | consolidated                                            |
| `dial-tiny`         | `dial-tiny-text`                               | line-height updated (14 → 16)                           |
| `dial-tiny-150`     | `dial-tiny-text`                               | consolidated                                            |
| `dial-tiny-semi`    | `dial-tiny-semi-text`                          | line-height updated (14 → 16)                           |
| `dial-caption`      | `dial-caption-text`                            | no visual change                                        |

## Step-by-step migration

### 1. Find all usages

```bash
grep -rEn "dial-(h1|h2|h3|body|small|small-semi|small-medium|small-150|tiny|tiny-150|tiny-semi|caption)\b" src/
```

### 2. Replace with the matching `dial-*-text` class

**Before:**

```tsx
<p className="text-secondary dial-small-150">Description</p>
```

**After:**

```tsx
<p className="text-secondary dial-small-text">Description</p>
```

### 3. Verify

```bash
npm run typecheck
npm run test
```

Review affected UI visually (Storybook) — several replacements change line-height or font-weight slightly (see table above).

## Notes

Bare `h1`/`h2`/`h3` elements now resolve to `dial-h1-text`/`dial-h2-text`/`dial-h3-text` automatically via `src/styles/typography.scss`, so no change is needed for plain heading tags — only explicit legacy class usages require updating.
