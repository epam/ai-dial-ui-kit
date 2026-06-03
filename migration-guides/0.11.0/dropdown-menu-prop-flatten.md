# Migrating `DialDropdown` and `DialDropdownIcon` `menu` prop — v0.11.0

## Why this changed

The nested `menu` object was an unnecessary indirection. Passing `items` directly as a top-level prop is simpler, more consistent with other components in the library, and friendlier to TypeScript autocomplete.

## What changed

| Before                              | After                             |
| ----------------------------------- | --------------------------------- |
| `menu={{ items }}`                  | `items={items}`                   |
| `menu={{ items, onClick: fn }}`     | `items={items} onItemClick={fn}`  |
| `menu={{ items, header: node }}`    | `items={items} menuHeader={node}` |
| `menu={{ items, footer: node }}`    | `items={items} menuFooter={node}` |
| `DropdownMenuProps` (exported type) | Removed — no replacement needed   |

Both `DialDropdown` and `DialDropdownIcon` are affected.

## Step-by-step migration

### 1. Find all usages

```bash
grep -r "menu={{" src/
grep -r "DropdownMenuProps" src/
```

### 2. Replace with the new API

**Before:**

```tsx
<DialDropdown menu={{ items, onClick: handleClick, header: <h4>Title</h4>, footer: <Footer /> }}>
  <button type="button">Open</button>
</DialDropdown>

<DialDropdownIcon
  ariaLabel="Select model"
  icon={<IconBrandOpenai />}
  menu={{ items, onClick: handleClick }}
/>
```

**After:**

```tsx
<DialDropdown
  items={items}
  onItemClick={handleClick}
  menuHeader={<h4>Title</h4>}
  menuFooter={<Footer />}
>
  <button type="button">Open</button>
</DialDropdown>

<DialDropdownIcon
  ariaLabel="Select model"
  icon={<IconBrandOpenai />}
  items={items}
  onItemClick={handleClick}
/>
```

### 3. Remove `DropdownMenuProps` imports

```tsx
// Remove this line
import type { DropdownMenuProps } from '@epam/ai-dial-ui-kit';
```

### 4. Verify

Run the commands specific to your project, e.g.

```bash
npm run typecheck
npm run test
```
