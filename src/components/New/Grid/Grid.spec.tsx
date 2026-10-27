import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  AllCommunityModule,
  type ColDef,
  type GridApi,
  ModuleRegistry,
} from 'ag-grid-community';
import { describe, expect, test, vi } from 'vitest';

import { GridSelectionMode } from '@/models/selection-mode';
import { GridAppearance, GridColorScheme } from '@/types/grid';
import { GRID_THEME_PARAMS } from './constants';
import { Grid } from './Grid';
import { DateCellRenderer } from './renderers/DateCellRenderer';

interface TestRow {
  id: string;
  name: string;
  age: number;
}

const testRows: TestRow[] = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
  { id: '3', name: 'Charlie', age: 35 },
];

const testColumns: ColDef<TestRow>[] = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'age', headerName: 'Age', width: 100 },
];

const mixedCaseRows: TestRow[] = [
  { id: '1', name: 'appdata', age: 1 },
  { id: '2', name: 'Banana', age: 2 },
  { id: '3', name: 'code app', age: 3 },
  { id: '4', name: 'Zebra', age: 4 },
];

const getSortedNames = (api: GridApi<TestRow>): string[] => {
  const names: string[] = [];
  api.forEachNodeAfterFilterAndSort((node) => {
    if (node.data) {
      names.push(node.data.name);
    }
  });
  return names;
};

describe('Dial UI Kit :: Grid', () => {
  /**
   * ag-Grid takes borders as CSS shorthand, so the width is only visible in the
   * theme parameters — asserting them is what keeps the three dividers on the
   * thin stroke the design system reserves for tables, one step below the 1px
   * the rest of the library uses. The wrapper frame is deliberately absent: it
   * is driven by the `wrapperBorder` prop and stays on the main stroke. The
   * header row border is off, so there is no line between the title and filter
   * rows; the line under the header is drawn in `styles/grid.scss`.
   */
  test('draws the table dividers on the thin stroke', () => {
    expect(GRID_THEME_PARAMS.rowBorder).toMatch(/^0\.5px solid /);
    expect(GRID_THEME_PARAMS.headerRowBorder).toBe(false);
    expect(GRID_THEME_PARAMS.headerColumnBorder).toMatch(/^0\.5px solid /);
    expect(GRID_THEME_PARAMS).not.toHaveProperty('wrapperBorder');
  });

  test('tints hovered and selected rows per the cell design', () => {
    expect(GRID_THEME_PARAMS.rowHoverColor).toBe(
      'var(--bg-control-accent-alpha-hover-subtle, #2764D90A)',
    );
    expect(GRID_THEME_PARAMS.selectedRowBackgroundColor).toBe(
      'var(--bg-control-accent-alpha-active-subtle, #2764D914)',
    );
  });

  test('rounds the search fields to 8px', () => {
    expect(GRID_THEME_PARAMS.inputBorderRadius).toBe(8);
  });

  /* Must run before any other test in this file renders a Grid: the spy
   * below can only observe a genuine "not called yet" state on the very
   * first render this test file performs (registerAgGridModulesOnce's
   * internal guard stays flipped for the rest of the module's lifetime,
   * matching real usage - it should run once, not once per Grid render).
   * The preceding "draws the table dividers" test above never renders a
   * Grid, so it is safe to run first. */
  test('registers AG Grid modules when rendered, not merely when imported', async () => {
    const registerModulesSpy = vi.spyOn(ModuleRegistry, 'registerModules');
    expect(registerModulesSpy).not.toHaveBeenCalled();

    render(<Grid<TestRow> columnDefs={testColumns} rowData={testRows} />);

    await screen.findByText('Alice');

    expect(registerModulesSpy).toHaveBeenCalledWith([AllCommunityModule]);
  });

  test('renders the rows', async () => {
    render(<Grid<TestRow> columnDefs={testColumns} rowData={testRows} />);

    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  test('names the grid region', async () => {
    render(
      <Grid<TestRow>
        columnDefs={testColumns}
        rowData={testRows}
        ariaLabel="Products"
      />,
    );

    await screen.findByText('Alice');

    expect(
      screen.getByRole('region', { name: 'Products' }),
    ).toBeInTheDocument();
  });

  test('applies a custom class to the grid container', async () => {
    render(
      <Grid<TestRow>
        columnDefs={testColumns}
        rowData={testRows}
        className="my-custom-grid-class"
      />,
    );

    await screen.findByText('Alice');

    expect(screen.getByRole('region')).toHaveClass('my-custom-grid-class');
  });

  test('sorts names case-insensitively', async () => {
    let api: GridApi<TestRow> | undefined;

    render(
      <Grid<TestRow>
        columnDefs={testColumns}
        rowData={mixedCaseRows}
        onGridApiChange={(gridApi) => {
          api = gridApi;
        }}
      />,
    );

    await screen.findByText('appdata');

    api!.applyColumnState({ state: [{ colId: 'name', sort: 'asc' }] });

    expect(getSortedNames(api!)).toEqual([
      'appdata',
      'Banana',
      'code app',
      'Zebra',
    ]);
  });

  test('keeps case-insensitive sorting when a defaultColDef is supplied', async () => {
    let api: GridApi<TestRow> | undefined;

    render(
      <Grid<TestRow>
        columnDefs={testColumns}
        rowData={mixedCaseRows}
        additionalGridOptions={{ defaultColDef: { floatingFilter: false } }}
        onGridApiChange={(gridApi) => {
          api = gridApi;
        }}
      />,
    );

    await screen.findByText('appdata');

    api!.applyColumnState({ state: [{ colId: 'name', sort: 'asc' }] });

    expect(getSortedNames(api!)).toEqual([
      'appdata',
      'Banana',
      'code app',
      'Zebra',
    ]);
  });

  test('honours a sort declared on a column, which 1.0 stripped', async () => {
    let api: GridApi<TestRow> | undefined;

    render(
      <Grid<TestRow>
        columnDefs={[{ ...testColumns[0], sort: 'desc' }, testColumns[1]]}
        rowData={mixedCaseRows}
        onGridApiChange={(gridApi) => {
          api = gridApi;
        }}
      />,
    );

    await screen.findByText('appdata');

    expect(getSortedNames(api!)).toEqual([
      'Zebra',
      'code app',
      'Banana',
      'appdata',
    ]);
  });

  test('calls onGridReady from additionalGridOptions', async () => {
    const onGridReady = vi.fn();

    render(
      <Grid<TestRow>
        columnDefs={testColumns}
        rowData={testRows}
        additionalGridOptions={{ onGridReady }}
      />,
    );

    await screen.findByText('Alice');

    expect(onGridReady).toHaveBeenCalledTimes(1);
    expect(onGridReady.mock.calls[0][0]).toBeDefined();
  });

  test('announces the empty state when there are no rows', async () => {
    render(
      <Grid<TestRow>
        columnDefs={testColumns}
        rowData={[]}
        emptyStateTitle="No results found"
        emptyStateDescription="Try another search."
      />,
    );

    const emptyState = await screen.findByRole('status');

    expect(emptyState).toHaveTextContent('No results found');
    expect(emptyState).toHaveTextContent('Try another search.');
  });

  describe('cell alignment', () => {
    const dateColumns: ColDef<TestRow>[] = [
      testColumns[0],
      {
        field: 'age',
        headerName: 'Updated',
        cellRenderer: DateCellRenderer,
        valueGetter: () => '2026-07-20T00:00:00Z',
        cellRendererParams: {
          options: { dateStyle: 'medium', timeZone: 'UTC' },
        },
      },
    ];

    test('gives a default cell and a custom renderer the same text box', async () => {
      render(<Grid<TestRow> columnDefs={dateColumns} rowData={testRows} />);

      const plainCell = await screen.findByText('Alice');
      const customCell = screen.getAllByText('Jul 20, 2026')[0].closest('span');

      // jsdom performs no layout, so the assertion is on what decides the
      // alignment: a text box stretched to the row height puts its line at the
      // top, while one of its natural height is centred by the cell.
      expect(plainCell).not.toHaveClass('h-full');
      expect(customCell).not.toHaveClass('h-full');
      expect(plainCell).toHaveClass('dial-small-text');
      expect(customCell).toHaveClass('dial-small-text');
    });

    test('right-aligns the text of a rightAligned column', async () => {
      render(
        <Grid<TestRow>
          columnDefs={[
            testColumns[0],
            { ...testColumns[1], type: 'rightAligned' },
          ]}
          rowData={testRows}
        />,
      );

      const ageCell = (await screen.findByText('30')).closest('.ag-cell');
      const nameText = await screen.findByText('Alice');

      expect(ageCell).toHaveClass('ag-right-aligned-cell');
      expect(screen.getByText('30')).toHaveClass('text-end');
      expect(screen.getByText('30')).not.toHaveClass('text-start');
      expect(nameText).toHaveClass('text-start');
      expect(nameText.closest('.ag-cell')).not.toHaveClass(
        'ag-right-aligned-cell',
      );
    });

    test('centres the content of a cell wrapped in a context menu', async () => {
      render(
        <Grid<TestRow>
          columnDefs={testColumns}
          rowData={testRows}
          getContextMenuItems={() => [{ key: 'edit', label: 'Edit' }]}
        />,
      );

      const trigger = (await screen.findByText('Alice')).closest(
        '[aria-haspopup="menu"]',
      );

      expect(trigger).toHaveClass('items-center');
    });
  });

  describe('selection', () => {
    test('renders no selection control without a selectionMode', async () => {
      render(<Grid<TestRow> columnDefs={testColumns} rowData={testRows} />);

      await screen.findByText('Alice');

      expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
      expect(screen.queryAllByRole('radio')).toHaveLength(0);
    });

    test('renders one 2.0 checkbox per row plus the select-all, and no ag-Grid input', async () => {
      render(
        <Grid<TestRow>
          columnDefs={testColumns}
          rowData={testRows}
          selectionMode={GridSelectionMode.MULTIPLE}
        />,
      );

      await screen.findByText('Alice');

      await waitFor(() =>
        expect(screen.getAllByRole('checkbox')).toHaveLength(
          testRows.length + 1,
        ),
      );
      expect(
        screen.getByRole('checkbox', { name: 'Select all rows' }),
      ).toBeInTheDocument();
      // ag-Grid's own inputs are switched off, so nothing renders them.
      expect(document.querySelector('.ag-checkbox-input')).toBeNull();
    });

    test('names each row control through selectRowLabel', async () => {
      render(
        <Grid<TestRow>
          columnDefs={testColumns}
          rowData={testRows}
          selectionMode={GridSelectionMode.MULTIPLE}
          selectRowLabel={(row) => `Select ${row.name}`}
        />,
      );

      expect(
        await screen.findByRole('checkbox', { name: 'Select Alice' }),
      ).toBeInTheDocument();
    });

    test('reports the row selected by its checkbox', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();

      render(
        <Grid<TestRow>
          columnDefs={testColumns}
          rowData={testRows}
          selectionMode={GridSelectionMode.MULTIPLE}
          selectRowLabel={(row) => `Select ${row.name}`}
          onSelectionChange={onSelectionChange}
        />,
      );

      await user.click(
        await screen.findByRole('checkbox', { name: 'Select Bob' }),
      );

      await waitFor(() =>
        expect(onSelectionChange).toHaveBeenCalledWith(new Set(['2']), [
          testRows[1],
        ]),
      );
      expect(
        screen.getByRole('checkbox', { name: 'Select Bob' }),
      ).toBeChecked();
    });

    test('select-all takes every row, and goes mixed when one is dropped', async () => {
      const user = userEvent.setup();

      render(
        <Grid<TestRow>
          columnDefs={testColumns}
          rowData={testRows}
          selectionMode={GridSelectionMode.MULTIPLE}
          selectRowLabel={(row) => `Select ${row.name}`}
        />,
      );

      const selectAll = await screen.findByRole('checkbox', {
        name: 'Select all rows',
      });

      await user.click(selectAll);

      await waitFor(() =>
        expect(
          screen.getByRole('checkbox', { name: 'Select Alice' }),
        ).toBeChecked(),
      );
      expect(selectAll).toBeChecked();

      await user.click(screen.getByRole('checkbox', { name: 'Select Alice' }));

      await waitFor(() =>
        expect(selectAll).toHaveAttribute('aria-checked', 'mixed'),
      );
    });

    test('disables the control of a disabled row and leaves it out of select-all', async () => {
      const user = userEvent.setup();

      render(
        <Grid<TestRow>
          columnDefs={testColumns}
          rowData={testRows}
          selectionMode={GridSelectionMode.MULTIPLE}
          selectRowLabel={(row) => `Select ${row.name}`}
          disabledRowIds={new Set(['3'])}
        />,
      );

      const disabled = await screen.findByRole('checkbox', {
        name: 'Select Charlie',
      });
      expect(disabled).toBeDisabled();

      const selectAll = screen.getByRole('checkbox', {
        name: 'Select all rows',
      });
      await user.click(selectAll);

      await waitFor(() => expect(selectAll).toBeChecked());
      expect(disabled).not.toBeChecked();
    });

    test('a consumer rowSelection contributes its options without bringing back ag-Grid inputs', async () => {
      render(
        <Grid<TestRow>
          columnDefs={testColumns}
          rowData={testRows}
          selectionMode={GridSelectionMode.MULTIPLE}
          selectRowLabel={(row) => `Select ${row.name}`}
          additionalGridOptions={{
            rowSelection: {
              mode: 'multiRow',
              isRowSelectable: (node) => node.data?.id !== '3',
            },
          }}
        />,
      );

      await screen.findByText('Alice');

      /*
        The consumer's object is merged into the grid's own rather than
        replacing it, so ag-Grid's own inputs stay switched off and the
        selection column remains the only set of controls on the row.
      */
      await waitFor(() =>
        expect(screen.getAllByRole('checkbox')).toHaveLength(
          testRows.length + 1,
        ),
      );
      expect(document.querySelector('.ag-checkbox-input')).toBeNull();

      // The consumer's own `isRowSelectable` still reaches ag-Grid.
      const selectAll = screen.getByRole('checkbox', {
        name: 'Select all rows',
      });
      await userEvent.setup().click(selectAll);

      await waitFor(() =>
        expect(
          screen.getByRole('checkbox', { name: 'Select Alice' }),
        ).toBeChecked(),
      );
      expect(
        screen.getByRole('checkbox', { name: 'Select Charlie' }),
      ).not.toBeChecked();
    });

    test('single mode renders radios and keeps one selected at a time', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();

      render(
        <Grid<TestRow>
          columnDefs={testColumns}
          rowData={testRows}
          selectionMode={GridSelectionMode.SINGLE}
          selectRowLabel={(row) => `Select ${row.name}`}
          onSelectionChange={onSelectionChange}
        />,
      );

      const alice = await screen.findByRole('radio', { name: 'Select Alice' });
      await user.click(alice);
      await waitFor(() => expect(alice).toBeChecked());

      const bob = screen.getByRole('radio', { name: 'Select Bob' });
      await user.click(bob);

      await waitFor(() => expect(bob).toBeChecked());
      expect(alice).not.toBeChecked();
      // Single mode never has a select-all control.
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    test('controlled: reflects selectedRowIds', async () => {
      render(
        <Grid<TestRow>
          columnDefs={testColumns}
          rowData={testRows}
          selectionMode={GridSelectionMode.MULTIPLE}
          selectRowLabel={(row) => `Select ${row.name}`}
          selectedRowIds={new Set(['1', '2'])}
        />,
      );

      await waitFor(() =>
        expect(
          screen.getByRole('checkbox', { name: 'Select Alice' }),
        ).toBeChecked(),
      );
      expect(
        screen.getByRole('checkbox', { name: 'Select Bob' }),
      ).toBeChecked();
      expect(
        screen.getByRole('checkbox', { name: 'Select Charlie' }),
      ).not.toBeChecked();
    });
  });

  describe('color scheme', () => {
    const dateColumns: ColDef<TestRow>[] = [
      testColumns[0],
      {
        field: 'age',
        headerName: 'Updated',
        filter: 'agDateColumnFilter',
      },
    ];

    /**
     * jsdom has no `document.fonts`, so ag-Grid treats the environment as SSR
     * and never inserts its stylesheets. The variable native controls inherit
     * is still on the theme the grid passes in: `color-scheme` on
     * `.ag-root-wrapper` reads `--ag-browser-color-scheme`.
     */
    const themeCss = async (colorScheme?: GridColorScheme) => {
      let css = '';

      render(
        <Grid<TestRow>
          columnDefs={testColumns}
          rowData={testRows}
          colorScheme={colorScheme}
          onGridApiChange={(api) => {
            css = (
              api.getGridOption('theme') as unknown as {
                _getParamsCss: () => string;
              }
            )._getParamsCss();
          }}
        />,
      );

      await screen.findByText('Alice');

      return css;
    };

    const browserColorSchemeOf = (css: string) =>
      css.match(
        /--ag-browser-color-scheme:\s*var\(--ag-inherited-browser-color-scheme,\s*(\w+)\)/,
      )?.[1] ?? null;

    const themeParamsClass = (container: HTMLElement) => {
      const root = container.querySelector('.ag-root-wrapper');

      return [...(root?.parentElement?.classList ?? [])].find((cls) =>
        cls.startsWith('ag-theme-params-'),
      );
    };

    test('keeps the light browser color scheme by default', async () => {
      const css = await themeCss();

      expect(browserColorSchemeOf(css)).toBe('light');
      expect(css).toContain('var(--bg-layer-raised, #FCFCFC)');
    });

    test('asks the browser for dark native controls when the scheme is dark', async () => {
      const css = await themeCss(GridColorScheme.Dark);

      expect(browserColorSchemeOf(css)).toBe('dark');
      expect(css).toContain('var(--bg-layer-raised, #FCFCFC)');
    });

    test('puts the date filter input in the grid and swaps the theme class without a remount', async () => {
      const { container, rerender } = render(
        <Grid<TestRow>
          columnDefs={dateColumns}
          rowData={testRows}
          colorScheme={GridColorScheme.Light}
        />,
      );

      await screen.findByText('Alice');

      const lightClass = themeParamsClass(container);
      const dateInput = container.querySelector('input[type="date"]');

      expect(lightClass).toBeTruthy();
      expect(dateInput).not.toBeNull();
      expect(dateInput?.closest('.ag-root-wrapper')).not.toBeNull();

      rerender(
        <Grid<TestRow>
          columnDefs={dateColumns}
          rowData={testRows}
          colorScheme={GridColorScheme.Dark}
        />,
      );

      const darkClass = themeParamsClass(container);

      expect(darkClass).toBeTruthy();
      expect(darkClass).not.toBe(lightClass);
      expect(screen.getByText('Alice')).toBeInTheDocument();

      rerender(
        <Grid<TestRow>
          columnDefs={dateColumns}
          rowData={testRows}
          colorScheme={GridColorScheme.Light}
        />,
      );

      // Each theme instance gets its own class, so returning to light applies
      // a new light class rather than the one from the first render.
      expect(themeParamsClass(container)).not.toBe(darkClass);
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });

  describe('appearance', () => {
    const THIN_DIVIDER = '0.5px solid var(--stroke-tertiary, #E0E6F0)';

    /** Renders the grid and returns the CSS of the theme it hands ag-Grid. */
    const renderWith = async (appearance?: GridAppearance) => {
      let css = '';

      render(
        <Grid<TestRow>
          columnDefs={testColumns}
          rowData={testRows}
          ariaLabel="Usage"
          appearance={appearance}
          onGridApiChange={(api) => {
            css = (
              api.getGridOption('theme') as unknown as {
                _getParamsCss: () => string;
              }
            )._getParamsCss();
          }}
        />,
      );

      await screen.findByText('Alice');

      return css;
    };

    const rowBorderOf = (css: string) =>
      css.match(
        /--ag-row-border:\s*var\(--ag-inherited-row-border,\s*([^;]+)\);/,
      )?.[1] ?? null;

    const cellPaddingOf = (css: string) =>
      css.match(
        /--ag-cell-horizontal-padding:\s*var\(--ag-inherited-cell-horizontal-padding,\s*([^;]+)\);/,
      )?.[1] ?? null;

    test('draws the framed grid with full-width row dividers by default', async () => {
      const css = await renderWith();

      expect(screen.getByRole('region', { name: 'Usage' })).not.toHaveClass(
        'dial-kit-grid-chat',
      );
      expect(rowBorderOf(css)).toBe(THIN_DIVIDER);
      // Balham's own `spacing * 2`, untouched.
      expect(cellPaddingOf(css)).toMatch(/var\(--ag-spacing\)\s*\*\s*2/);
    });

    test('marks the Chat table and leaves its inset row dividers to the stylesheet', async () => {
      const css = await renderWith(GridAppearance.Chat);

      expect(screen.getByRole('region', { name: 'Usage' })).toHaveClass(
        'dial-kit-grid',
        'dial-kit-grid-chat',
      );
      expect(rowBorderOf(css)).toBe('none');
      expect(cellPaddingOf(css)).toBe('12px');
      expect(css).toMatch(
        /--ag-wrapper-border:\s*var\(--ag-inherited-wrapper-border,\s*none\);/,
      );
    });
  });
});
