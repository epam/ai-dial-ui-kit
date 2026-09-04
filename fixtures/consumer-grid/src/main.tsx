import { createRoot } from 'react-dom/client';
import { Grid } from '@epam/ai-dial-ui-kit';

/**
 * Grid feature fixture (design.md Decision 6 / tasks.md 1.4, 4.2/4.3):
 * statically imports the 2.0 `Grid`. Its feature graph must include
 * ag-grid-community and ag-grid-react, but must still exclude every
 * editor-only dependency (Monaco, @uiw/*) - Grid must not drag editor code
 * in with it.
 *
 * `EXPECTED_CELL_TEXT` is read back by `smoke-test.mjs` (Task 4.3) as proof
 * that `ModuleRegistry.registerModules(...)` actually executed and AG Grid
 * rendered real row data, not just that the module graph shape looks right.
 */
export const EXPECTED_CELL_TEXT = 'Smoke-Test-Cell-Alpha';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <Grid
      columnDefs={[{ field: 'name', headerName: 'Name' }]}
      rowData={[{ id: '1', name: EXPECTED_CELL_TEXT }]}
    />,
  );
}
