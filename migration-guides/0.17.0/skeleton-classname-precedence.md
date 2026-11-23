# Migrating `Skeleton` variant `className` precedence — v0.16 → v0.17

## Why this changed

A `Skeleton` with `variant` `Circular`, `Text` or `Rectangular` merged the caller's `className` **before** its own `rounded-full` / `rounded` / `relative` classes. When two Tailwind utilities for the same property meet, the later one wins, so a `rounded-xl` or `absolute` passed by the caller was always overridden and had no effect. The design needs 12 px bars (`rounded-xl`), and there was no way to get them. The caller's `className` is now merged last, so it can override the variant's defaults like it does on every other kit component.

## What changed

| Before                                                                                          | After                                                     |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `className="rounded-xl"` on a `Text` / `Rectangular` skeleton was ignored (stays `4px`)         | `rounded-xl` applies (12 px)                              |
| `className="rounded-lg"` on a `Circular` skeleton was ignored (stays round)                     | `rounded-lg` applies, the circle becomes a rounded square |
| `className="absolute"` / `static` together with `overlay` was ignored (stays `relative`)        | The caller's position applies                             |
| `className="bg-layer-sunken"` lost to `bg-layer-raised`; `animate-none` lost to `animate-pulse` | The caller's background and animation apply               |
| `Default` variant (avatar / title / paragraph shortcuts)                                        | Unchanged                                                 |

## Step-by-step migration

### 1. Find all usages

```bash
# Skeletons that pass a className together with a variant
grep -rn "<Skeleton" src/ | grep "variant="
grep -rn "SkeletonVariant\." src/
```

### 2. Check conflicting classes

Look at each match for a `className` that sets a radius (`rounded*`), a position (`relative`, `absolute`, `static`), a background (`bg-*`) or an animation (`animate-*`). Those classes were dropped before and now apply.

**Before** — `rounded-xl` was silently ignored, the bar rendered with the 4 px variant radius:

```tsx
<Skeleton
  variant={SkeletonVariant.Text}
  className="rounded-xl"
  width="70%"
  height={20}
/>
```

**After, to keep the old look** — remove the class that never applied:

```tsx
<Skeleton variant={SkeletonVariant.Text} width="70%" height={20} />
```

**After, to get what the class says** — leave it; the bar is now 12 px rounded.

### 3. Verify

```bash
npm run typecheck
npm run test
```

## Notes

- Nothing changes for a skeleton that passes no `className`, or only classes that do not conflict with the variant (`shrink-0`, `mt-2`, sizing).
- A visual snapshot of a skeleton that previously passed a conflicting radius will change.
