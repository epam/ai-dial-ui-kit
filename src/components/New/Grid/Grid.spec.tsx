import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ColDef, type GridApi } from 'ag-grid-community';
import { describe, expect, test, vi } from 'vitest';

import { GridSelectionMode } from '@/models/selection-mode';
import { Grid } from './Grid';

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
});
