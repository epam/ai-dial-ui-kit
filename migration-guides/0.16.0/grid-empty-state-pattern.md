# Migrating the `Grid` empty state to the Patterns 2.0 empty-state behaviour — v0.15 → v0.16.0

## Why this changed

The Patterns 2.0 empty-state spec has two cases: a list with nothing in it
yet ("No [entities] yet", optionally with an action) and a list that a
search or filter emptied ("No [entities] found", announced). The `Grid` drew
neither correctly:

- it showed a 100px `IconZoomCancel` instead of the shared placeholder-list
  card every other empty list uses;
- its default copy ("No results found" / "Sorry, we couldn't find any results
  for your search.") talked about a search even when the grid simply had no
  rows;
- it announced the no-rows message as a `role="status"` region every time,
  including on first load;
- when the column filters left no rows, ag-Grid's own unstyled
  no-matching-rows overlay appeared, because only the no-rows overlay was
  replaced;
- there was no way to put an action under the message.

## What changed

| Before                                                           | After                                                                                              |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Default illustration `IconZoomCancel`                            | The shared `NoDataContent` card; `emptyStateIcon` still overrides it                               |
| `emptyStateTitle` default `'No results found'`                   | `'No items yet'`                                                                                   |
| `emptyStateDescription` default `"Sorry, we couldn't find any…"` | `'Items will appear here once they are added.'`                                                    |
| No-rows message always announced (`role="status"`)               | Announced only with `emptyStateLive`                                                               |
| Column filters leaving no rows show ag-Grid's default overlay    | `filteredEmptyStateTitle` (`'No items found'`) / `filteredEmptyStateDescription`, always announced |
| No action                                                        | `emptyStateAction`, shown when there are no rows                                                   |
| `noRowsOverlayComponent` set by the grid                         | `overlayComponentSelector` + `overlayComponentParams` set by the grid                              |

## Step-by-step migration

### 1. Find all usages

```bash
grep -rnE "<Grid\b" src/
grep -rnE "emptyState(Title|Description|Icon)" src/
```

### 2. Name your entities in the copy

The defaults are generic. Pass the entity in both cases:

```tsx
<Grid
  columnDefs={columns}
  rowData={files}
  emptyStateTitle="No files yet"
  emptyStateDescription="Files will appear here once you upload one."
  emptyStateAction={<OutlinedButton label="Upload" onClick={upload} />}
  filteredEmptyStateTitle="No files found"
/>
```

### 3. A host that filters `rowData` itself

If your search box lives outside the grid and you pass the filtered rows in,
the grid sees no rows at all, not a filter. Switch the copy on the query and
turn on the announcement:

**Before:**

```tsx
<Grid rowData={visibleFiles} emptyStateTitle="No files found" />
```

**After:**

```tsx
<Grid
  rowData={visibleFiles}
  emptyStateTitle={query ? 'No files found' : 'No files yet'}
  emptyStateDescription={
    query
      ? 'Try a different search term.'
      : 'Files will appear here once you upload one.'
  }
  emptyStateLive={!!query}
/>
```

### 4. Drop a custom illustration

Remove `emptyStateIcon` unless the grid is not a list of things the user owns
— every empty list should show the same card.

### 5. Tests

A test that found the empty grid with `getByRole('status')` now needs
`emptyStateLive`, a column filter that leaves no rows, or a text query.

### 6. Overriding the overlay yourself

If you passed `additionalGridOptions.noRowsOverlayComponent`, the grid's
`overlayComponentSelector` now takes precedence for the no-rows and
no-matching-rows overlays. Pass your own `overlayComponentSelector` in
`additionalGridOptions` instead.
