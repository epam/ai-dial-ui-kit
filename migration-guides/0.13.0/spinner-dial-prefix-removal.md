# Migrating `DialSpinner` → `Spinner` — v0.12.x → v0.13.0

## Why this changed

The spinner is part of the 2.0 component set, which drops the `Dial*` prefix. Keeping `DialSpinner` alongside the unprefixed 2.0 components made the export list read as two conventions at once, with no signal about which era a component belongs to.

This is a **rename only**. The component's props, defaults, DOM, roles, and styling are untouched.

## What changed

| Before             | After          |
| ------------------ | -------------- |
| `DialSpinner`      | `Spinner`      |
| `DialSpinnerProps` | `SpinnerProps` |

Unchanged: `size` (default `40`), `className`, `fullWidth` (default `false`), `ariaLabel` (default `"Loading"`), the outer `role="status"` container, and the inner `role="img"` ring.

The Storybook entry also moved from `DIAL/Status/Spinner` to `Components_2_0/Spinner`. This affects story URLs only, not consumers of the package.

## Step-by-step migration

### 1. Find all usages

```bash
grep -rn "DialSpinner" src/
```

### 2. Rename the import and the JSX tag

**Before:**

```tsx
import { DialSpinner, type DialSpinnerProps } from '@epam/ai-dial-ui-kit';

const Busy: FC<DialSpinnerProps> = (props) => <DialSpinner {...props} />;

<DialSpinner size={24} fullWidth ariaLabel="Loading results" />;
```

**After:**

```tsx
import { Spinner, type SpinnerProps } from '@epam/ai-dial-ui-kit';

const Busy: FC<SpinnerProps> = (props) => <Spinner {...props} />;

<Spinner size={24} fullWidth ariaLabel="Loading results" />;
```

If `Spinner` collides with a local component of the same name, alias the import rather than renaming your own:

```tsx
import { Spinner as DialSpinner } from '@epam/ai-dial-ui-kit';
```

### 3. Verify

```bash
npm run typecheck
npm run test
```

`typecheck` catches every usage — there is no runtime-only path to miss, since the old name is removed from the barrel and the import fails to resolve.

## Notes

- Tests that render the spinner need no assertion changes: it still exposes `role="status"` on the container and `role="img"` with the `ariaLabel` name on the ring.
- `DialLoader` is a different component and is **not** renamed.
- `Notification`'s `loading` variant renders this spinner internally; no consumer change is needed there.
