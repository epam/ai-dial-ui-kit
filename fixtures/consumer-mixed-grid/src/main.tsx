import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { Button } from '@epam/ai-dial-ui-kit';
import type { ComponentType } from 'react';

/**
 * Mixed eager-root + lazy-Grid fixture:
 * eagerly renders `Button`, imported statically from the backward-compatible
 * root `@epam/ai-dial-ui-kit` entry, and reaches `Grid` only through a
 * dynamic `import('@epam/ai-dial-ui-kit/grid')` triggered by a click - never
 * through a static import anywhere in this fixture's own source.
 *
 * This is the scenario `fixtures/consumer-esm` (root-only) and
 * `fixtures/consumer-grid` (Grid-only) cannot catch: it proves the fixture's
 * complete *static initial* graph excludes AG Grid even though the same
 * consumer eagerly needs something else from the root, and that the lazy
 * `./grid` graph still works once actually reached.
 *
 * `EXPECTED_CELL_TEXT` is read back by `smoke-test.mjs` once it programmatically
 * clicks the `#load-grid-trigger` button, as proof that the dynamically
 * imported Grid actually rendered real row data.
 */
export const EXPECTED_CELL_TEXT = 'Smoke-Test-Cell-Mixed';

type GridComponent = ComponentType<{
  columnDefs: Array<{ field: string; headerName: string }>;
  rowData: Array<{ id: string; name: string }>;
}>;

const MixedFixtureApp = () => {
  const [Grid, setGrid] = useState<GridComponent | null>(null);

  const loadGrid = async () => {
    const gridModule = await import('@epam/ai-dial-ui-kit/grid');
    setGrid(() => gridModule.Grid as GridComponent);
  };

  return (
    <>
      <Button label="Eager root button" />
      <button type="button" id="load-grid-trigger" onClick={loadGrid}>
        Load grid
      </button>
      {Grid ? (
        <Grid
          columnDefs={[{ field: 'name', headerName: 'Name' }]}
          rowData={[{ id: '1', name: EXPECTED_CELL_TEXT }]}
        />
      ) : null}
    </>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<MixedFixtureApp />);
}
