# Migration guide template

Use this file as a template when adding a new migration guide.
Copy it to `migration-guides/<version>/<migration-name>.md` and fill in the sections.

---

# Migrating `<what changed>` — v`<from>` → v`<to>`

## Why this changed

_Explain the motivation: API consistency, accessibility improvement, removed ambiguity, etc._

## What changed

| Before     | After      |
| ---------- | ---------- |
| `oldThing` | `newThing` |

## Step-by-step migration

### 1. Find all usages

```bash
# Example: search for the old prop name across your project
grep -r "oldPropName" src/
```

### 2. Replace with the new API

**Before:**

```tsx
<DialComponent oldPropName="value" />
```

**After:**

```tsx
<DialComponent newPropName="value" />
```

### 3. Verify

Run the commands specific to your project, e.g.

```bash
npm run typecheck
npm run test
```

## Notes

_Any edge cases, optional codemods, or further reading._
