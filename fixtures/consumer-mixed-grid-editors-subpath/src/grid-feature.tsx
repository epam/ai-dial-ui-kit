import { Grid } from '@epam/ai-dial-ui-kit/grid';

export const EXPECTED_GRID_CELL_TEXT = 'Smoke-Test-Cell-Mixed-Editor-Loader';

/**
 * Reached only via a dynamic `import('./grid-feature')` from `main.tsx` -
 * never a static import anywhere in this fixture's own source. Kept in its
 * own module (rather than inlined into `main.tsx`) to match the exact
 * reproduction shape reported against the archived
 * `isolate-heavy-feature-modules` change: `Grid` is imported by a *separate*
 * dynamically-loaded module, not inline in the eager entry.
 */
export const GridFeature = () => (
  <Grid
    columnDefs={[{ field: 'name', headerName: 'Name' }]}
    rowData={[{ id: '1', name: EXPECTED_GRID_CELL_TEXT }]}
  />
);
