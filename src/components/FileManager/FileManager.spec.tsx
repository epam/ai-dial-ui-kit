import React, { type ReactElement } from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { DialFileManager } from './FileManager';
import { itemsMock } from './__mocks__/files';
import type { DialFileManagerActionsRef } from '@/models/file-manager';

interface GridRowLike {
  name?: string;
  path?: string;
}

interface MockColumnDef {
  filter?: boolean;
  floatingFilter?: boolean;
}

interface MockCellClickedEvent<Row extends GridRowLike> {
  colDef: { colId: string };
  data: Row;
}

interface MockAdditionalGridOptions<Row extends GridRowLike> {
  onCellClicked?: (event: MockCellClickedEvent<Row>) => void;
}

interface MockDialGridProps<Row extends GridRowLike> {
  rowData?: Row[];
  getRowId?: (row: Row, index: number) => string;
  columnDefs?: MockColumnDef[];
  className?: string;
  additionalGridOptions?: MockAdditionalGridOptions<Row>;
}

vi.mock('@/components/Grid/Grid', () => {
  function DialGrid<Row extends GridRowLike>(props: MockDialGridProps<Row>) {
    const { rowData, getRowId, columnDefs, className, additionalGridOptions } =
      props;

    const rowsArray: Row[] = rowData ?? [];
    const getId =
      getRowId ?? ((_: Row, index: number): string => String(index));

    const filtersDisabled =
      Array.isArray(columnDefs) &&
      columnDefs.length > 0 &&
      columnDefs.every(
        (col) => col.filter === false && col.floatingFilter === false,
      );

    const handleRowClick = (row: Row): void => {
      const handler = additionalGridOptions?.onCellClicked;
      if (!handler) return;
      handler({ colDef: { colId: 'name' }, data: row });
    };

    const rows = rowsArray.map((row, index) => {
      const key = getId(row, index);
      const label = row.name ?? row.path ?? String(index);
      return (
        <tr key={key} className="ag-row" onClick={() => handleRowClick(row)}>
          <td>{label}</td>
        </tr>
      );
    });

    return (
      <div
        className={className}
        role={'grid'}
        aria-label="File Manager Grid View"
      >
        <table role="table">
          {!filtersDisabled && (
            <thead>
              <tr>
                <th>
                  <input aria-label="column filter" />
                </th>
              </tr>
            </thead>
          )}
          <tbody className="ag-center-cols-container">{rows}</tbody>
        </table>
      </div>
    );
  }

  return { DialGrid };
});

const renderWithinSizedShell = (ui: ReactElement) =>
  render(<div style={{ height: 640, width: 1100 }}>{ui}</div>);

const getGridRegion = () =>
  screen.getByRole('region', { name: 'File Manager Grid View' });

const waitForGridTable = async (): Promise<HTMLElement> => {
  const grid = getGridRegion();
  await within(grid).findByRole('table', undefined, { timeout: 5000 });
  return grid;
};

const findInGridByRowText = async (text: string | RegExp): Promise<Element> => {
  const grid = await waitForGridTable();
  const matcher =
    typeof text === 'string'
      ? (value: string): boolean => value.includes(text)
      : (value: string): boolean => text.test(value);

  let found: Element | null = null;

  await waitFor(
    () => {
      const rows = grid.querySelectorAll('.ag-center-cols-container .ag-row');
      found =
        Array.from(rows).find((row) =>
          matcher((row.textContent ?? '').trim()),
        ) ?? null;
      if (found === null) {
        throw new Error('Row not rendered yet');
      }
    },
    { timeout: 5000 },
  );

  if (found === null) {
    throw new Error('Row not found');
  }

  return found;
};

const queryAllInGridByRowText = async (
  text: string | RegExp,
): Promise<Element[]> => {
  const grid = await waitForGridTable();
  const matcher =
    typeof text === 'string'
      ? (value: string): boolean => value.includes(text)
      : (value: string): boolean => text.test(value);
  const rows = grid.querySelectorAll('.ag-center-cols-container .ag-row');
  return Array.from(rows).filter((row) =>
    matcher((row.textContent ?? '').trim()),
  );
};

describe('Dial UI Kit :: FileManager', () => {
  test('search scans descendants; "svg" lists SVG folder and *.svg files but NOT "24px" in the grid', async () => {
    renderWithinSizedShell(
      <DialFileManager
        items={itemsMock}
        path="/All files/Design/Icons"
        treeOptions={{
          expandedPaths: new Set([
            '/All files',
            '/All files/Design',
            '/All files/Design/Icons',
            '/All files/Design/Icons/SVG',
          ]),
          showFiles: true,
        }}
        navigationPanelOptions={{ searchable: true }}
      />,
    );

    const searchRegion = screen.getByRole('search', { name: 'Search' });
    const searchInput = within(searchRegion).getByRole('textbox');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'svg');

    expect(await findInGridByRowText('SVG')).toBeInTheDocument();
    expect(await findInGridByRowText('alert.svg')).toBeInTheDocument();
    expect(await findInGridByRowText('settings.svg')).toBeInTheDocument();

    expect((await queryAllInGridByRowText('24px')).length).toBe(0);
  });

  test('breadcrumb navigation updates grid to show parent folder children', async () => {
    renderWithinSizedShell(
      <DialFileManager
        items={itemsMock}
        defaultPath="/All files/Design/Icons/SVG/24px"
        treeOptions={{
          expandedPaths: new Set([
            'All files',
            'All files/Design',
            'All files/Design/Icons',
            'All files/Design/Icons/SVG',
            'All files/Design/Icons/SVG/24px',
          ]),
          showFiles: true,
        }}
        navigationPanelOptions={{ searchable: true }}
      />,
    );

    const iconsCrumb = screen.getByRole('link', { name: 'SVG' });
    await userEvent.click(iconsCrumb);

    expect(await findInGridByRowText('24px')).toBeInTheDocument();
    expect((await queryAllInGridByRowText('alert.svg')).length).toBe(0);
  });

  test('clicking a node in the tree updates the grid contents', async () => {
    renderWithinSizedShell(
      <DialFileManager
        items={itemsMock}
        defaultPath="All files"
        treeOptions={{
          expandedPaths: new Set(['All files', 'All files/Media']),
          showFiles: true,
        }}
      />,
    );

    const videoNode = await screen.findByText('Video', {}, { timeout: 5000 });
    await userEvent.click(videoNode);

    expect(await findInGridByRowText('promo.mp4')).toBeInTheDocument();
  });

  test('gridOptions.filterable=false disables floating filters in grid header', async () => {
    renderWithinSizedShell(
      <DialFileManager
        items={itemsMock}
        path="/All files/Design/Icons"
        treeOptions={{
          expandedPaths: new Set([
            '/All files',
            '/All files/Design',
            '/All files/Design/Icons',
          ]),
        }}
        gridOptions={{ filterable: false }}
        navigationPanelOptions={{ searchable: true }}
      />,
    );

    const grid = await waitForGridTable();
    const textboxesInsideGrid = within(grid).queryAllByRole('textbox');
    expect(textboxesInsideGrid.length).toBe(0);
  });

  test('actionsRef.createFolder adds a new row to the grid', async () => {
    const actionsRef = React.createRef<DialFileManagerActionsRef>();

    renderWithinSizedShell(
      <DialFileManager
        items={itemsMock}
        path="/All files"
        actionsRef={actionsRef}
        treeOptions={{
          expandedPaths: new Set(['/All files']),
          showFiles: true,
        }}
      />,
    );

    const rowsBefore = screen.getAllByRole('row').length;

    expect(actionsRef.current).not.toBeNull();
    expect(typeof actionsRef.current?.createFolder).toBe('function');
    actionsRef.current?.createFolder();

    await waitFor(() => {
      const rowsAfter = screen.getAllByRole('row').length;
      expect(rowsAfter).toBe(rowsBefore + 1);
    });
  });
});
