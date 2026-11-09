# Migrating off the legacy analytics components and `DialSteps` — v0.15 → v0.16

## Why this changed

Every removed component already has a 2.0 version, so keeping both meant two copies that drifted apart.

## What changed

| Before                   | After                                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| `DialSteps`              | `Steps`                                                                                        |
| `DialAnalyticsCard`      | `AnalyticsCard`                                                                                |
| `DialAnalyticsBar`       | `AnalyticsBar`                                                                                 |
| `DialAnalyticsBarGroup`  | `AnalyticsBarGroup`                                                                            |
| `DialAnalyticsHistogram` | `AnalyticsHistogram`                                                                           |
| `DialAnalyticsErrorTag`  | `Badge` (red, filled)                                                                          |
| `DialAnalytics*Props`    | `AnalyticsCardProps`, `AnalyticsBarProps`, `AnalyticsBarGroupProps`, `AnalyticsHistogramProps` |

`Step` and `StepStatus` are unchanged.

## Step-by-step migration

### 1. Find all usages

```bash
grep -rE "DialSteps|DialAnalytics|AnalyticsCardVariant|AnalyticsBarColorStop|AnalyticsCardCompareItem|DEFAULT_ANALYTICS_BAR_COLOR_MAP" src/
```

### 2. Replace `DialSteps` with `Steps`

**Before:**

```tsx
import { DialSteps } from '@epam/ai-dial-ui-kit';
```

**After:**

```tsx
import { Steps } from '@epam/ai-dial-ui-kit';
```

Check `Steps`' props in Storybook; they take the same `Step[]` model.

### 3. Replace the analytics components

Rename `DialAnalyticsCard`, `DialAnalyticsBar`, `DialAnalyticsBarGroup` and `DialAnalyticsHistogram` to their 2.0 names and update the props types. Component logic is unchanged. The 2.0 `AnalyticsBarGroup` is built on the 2.0 `Accordion`, which keeps collapsed content mounted but `inert`. Use a red filled `Badge` where you rendered `DialAnalyticsErrorTag`.

### 4. Verify

```bash
npm run typecheck
npm run test
```
