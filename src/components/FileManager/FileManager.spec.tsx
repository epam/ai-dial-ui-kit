import React, { createRef, type ReactElement } from 'react';
import {
  render,
  screen,
  within,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { DialFileManager } from './FileManager';
import { itemsMock } from './__mocks__/files';
import type { DialFileManagerActionsRef } from '@/models/file-manager';
import {
  DialFileNodeType,
  DialFileResourceType,
  DialFilePermission,
  type DialFile,
} from '@/models/file';

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
  getRowId?: (row: Row) => string;
  columnDefs?: MockColumnDef[];
  className?: string;
  additionalGridOptions?: MockAdditionalGridOptions<Row>;
  disabledRowIds?: Set<string>;
}

vi.mock('@/components/Grid/Grid', () => {
  function DialGrid<Row extends GridRowLike>(props: MockDialGridProps<Row>) {
    const {
      rowData,
      getRowId,
      columnDefs,
      className,
      additionalGridOptions,
      disabledRowIds,
    } = props;

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
      const isDisabled = disabledRowIds?.has(key) ?? false;

      return (
        <tr
          key={key}
          className="ag-row"
          data-disabled={isDisabled || undefined}
          ref={(el: HTMLTableRowElement | null) => {
            if (el) el.setAttribute('row-id', key);
          }}
          onClick={() => handleRowClick(row)}
        >
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

vi.mock('@/components/Tooltip/TooltipContainer', () => ({
  DialTooltipContainer: ({
    children,
  }: {
    children: React.ReactNode;
    open?: boolean;
    placement?: string;
  }) => <>{children}</>,
}));

vi.mock('@/components/Tooltip/TooltipTrigger', () => ({
  DialTooltipTrigger: ({
    children,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <>{children}</>,
}));

vi.mock('@/components/Tooltip/TooltipContent', () => ({
  DialTooltipContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      role="tooltip"
      data-testid="disabled-row-tooltip"
      className={className}
    >
      {children}
    </div>
  ),
}));

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

const disabledRowItems: DialFile[] = [
  {
    id: 'dr-root',
    name: 'Files',
    path: 'Files',
    parentPath: '',
    nodeType: DialFileNodeType.FOLDER,
    folderId: 'dr-root',
    updatedAt: '2025-01-01',
    items: [
      {
        id: 'dr-svg',
        name: 'icon.svg',
        path: 'Files/icon.svg',
        parentPath: 'Files',
        nodeType: DialFileNodeType.ITEM,
        resourceType: DialFileResourceType.FILE,
        extension: 'svg',
        contentType: 'image/svg+xml',
        folderId: 'dr-root',
        updatedAt: '2025-01-01',
        contentLength: 1024,
        permissions: [DialFilePermission.READ],
      },
      {
        id: 'dr-pdf',
        name: 'report.pdf',
        path: 'Files/report.pdf',
        parentPath: 'Files',
        nodeType: DialFileNodeType.ITEM,
        resourceType: DialFileResourceType.FILE,
        extension: 'pdf',
        contentType: 'application/pdf',
        folderId: 'dr-root',
        updatedAt: '2025-01-01',
        contentLength: 1024,
        permissions: [DialFilePermission.READ],
      },
      {
        id: 'dr-big',
        name: 'large.svg',
        path: 'Files/large.svg',
        parentPath: 'Files',
        nodeType: DialFileNodeType.ITEM,
        resourceType: DialFileResourceType.FILE,
        extension: 'svg',
        contentType: 'image/svg+xml',
        folderId: 'dr-root',
        updatedAt: '2025-01-01',
        contentLength: 10 * 1024 * 1024, // 10 MB
        permissions: [DialFilePermission.READ],
      },
    ],
  },
];

const hoverDisabledRow = async (rowText: string) => {
  const row = await findInGridByRowText(rowText);
  const cell = row.querySelector('td')!;
  fireEvent.mouseMove(cell);
};

const leaveGrid = () => {
  const gridSection = screen.getByRole('region', {
    name: 'File Manager Grid View',
  });
  fireEvent.mouseLeave(gridSection);
};

const expectNoDisabledTooltip = () => {
  expect(screen.queryByText(/Unsupported file type/)).not.toBeInTheDocument();
  expect(screen.queryByText(/File is too large/)).not.toBeInTheDocument();
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
    const actionsRef = createRef<DialFileManagerActionsRef>();

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

  test('shows My Files empty state when My Files tab active', async () => {
    renderWithinSizedShell(
      <DialFileManager
        items={[]}
        toolbarOptions={{
          tabs: [
            { id: 'my_files', label: 'My Files' },
            { id: 'shared', label: 'Shared with Me' },
            { id: 'organization', label: 'Organization' },
          ],
          activeTab: 'my_files',
        }}
      />,
    );

    expect(screen.getByText("You don't have any files")).toBeInTheDocument();
    expect(
      screen.getByText('Upload or drag and drop files'),
    ).toBeInTheDocument();
  });

  test('custom title + description override default empty state for active tab', async () => {
    renderWithinSizedShell(
      <DialFileManager
        items={[]}
        emptyStateTitle="Custom title goes here"
        emptyStateDescription="Custom description text"
        toolbarOptions={{
          tabs: [
            { id: 'my_files', label: 'My Files' },
            { id: 'shared', label: 'Shared with Me' },
            { id: 'organization', label: 'Organization' },
          ],
          activeTab: 'my_files',
        }}
      />,
    );

    expect(screen.getByText('Custom title goes here')).toBeInTheDocument();
    expect(screen.getByText('Custom description text')).toBeInTheDocument();

    expect(
      screen.queryByText("You don't have any files"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Upload or drag and drop files'),
    ).not.toBeInTheDocument();
  });

  describe('disabled-row tooltips', () => {
    test('unsupported file type shows tooltip on hover', async () => {
      renderWithinSizedShell(
        <DialFileManager
          items={disabledRowItems}
          path="Files"
          allowedFileTypes={['image/svg+xml']}
        />,
      );

      await hoverDisabledRow('report.pdf');

      await waitFor(() => {
        expect(
          screen.getByText(
            'Unsupported file type. Supported types: image/svg+xml.',
          ),
        ).toBeInTheDocument();
      });
    });

    test('file exceeding maxSelectableFileSize shows size tooltip', async () => {
      renderWithinSizedShell(
        <DialFileManager
          items={disabledRowItems}
          path="Files"
          maxSelectableFileSize={5 * 1024 * 1024}
        />,
      );

      await hoverDisabledRow('large.svg');

      await waitFor(() => {
        expect(
          screen.getByText(/File is too large\. Maximum size: .+/),
        ).toBeInTheDocument();
      });
    });

    test('accepted file does NOT show disabled tooltip', async () => {
      renderWithinSizedShell(
        <DialFileManager
          items={disabledRowItems}
          path="Files"
          allowedFileTypes={['image/svg+xml']}
          maxSelectableFileSize={5 * 1024 * 1024}
        />,
      );

      await hoverDisabledRow('icon.svg');

      await waitFor(() => {
        expectNoDisabledTooltip();
      });
    });

    test('custom getDisabledTooltip overrides default text', async () => {
      renderWithinSizedShell(
        <DialFileManager
          items={disabledRowItems}
          path="Files"
          allowedFileTypes={['image/svg+xml']}
          getDisabledTooltip={(file) =>
            file.contentType === 'application/pdf'
              ? 'PDF files are not allowed'
              : undefined
          }
        />,
      );

      await hoverDisabledRow('report.pdf');

      await waitFor(() => {
        expect(
          screen.getByText('PDF files are not allowed'),
        ).toBeInTheDocument();
      });
    });

    test('custom unsupportedFileTypeTooltip overrides default', async () => {
      renderWithinSizedShell(
        <DialFileManager
          items={disabledRowItems}
          path="Files"
          allowedFileTypes={['image/svg+xml']}
          unsupportedFileTypeTooltip="Wrong file type"
        />,
      );

      await hoverDisabledRow('report.pdf');

      await waitFor(() => {
        expect(screen.getByText('Wrong file type')).toBeInTheDocument();
      });

      expect(
        screen.queryByText(/Unsupported file type\. Supported types/),
      ).not.toBeInTheDocument();
    });

    test('custom fileTooLargeTooltip overrides default', async () => {
      renderWithinSizedShell(
        <DialFileManager
          items={disabledRowItems}
          path="Files"
          maxSelectableFileSize={5 * 1024 * 1024}
          fileTooLargeTooltip="File exceeds limit"
        />,
      );

      await hoverDisabledRow('large.svg');

      await waitFor(() => {
        expect(screen.getByText('File exceeds limit')).toBeInTheDocument();
      });

      expect(
        screen.queryByText(/File is too large\. Maximum size/),
      ).not.toBeInTheDocument();
    });

    test('tooltip disappears when mouse leaves grid', async () => {
      renderWithinSizedShell(
        <DialFileManager
          items={disabledRowItems}
          path="Files"
          allowedFileTypes={['image/svg+xml']}
        />,
      );

      await hoverDisabledRow('report.pdf');

      await waitFor(() => {
        expect(
          screen.getByText(
            'Unsupported file type. Supported types: image/svg+xml.',
          ),
        ).toBeInTheDocument();
      });

      leaveGrid();

      await waitFor(() => {
        expect(
          screen.queryByText(
            'Unsupported file type. Supported types: image/svg+xml.',
          ),
        ).not.toBeInTheDocument();
      });
    });

    test('tooltip disappears on scroll', async () => {
      renderWithinSizedShell(
        <DialFileManager
          items={disabledRowItems}
          path="Files"
          allowedFileTypes={['image/svg+xml']}
        />,
      );

      await hoverDisabledRow('report.pdf');

      await waitFor(() => {
        expect(
          screen.getByText(
            'Unsupported file type. Supported types: image/svg+xml.',
          ),
        ).toBeInTheDocument();
      });

      fireEvent.scroll(window);

      await waitFor(() => {
        expect(
          screen.queryByText(
            'Unsupported file type. Supported types: image/svg+xml.',
          ),
        ).not.toBeInTheDocument();
      });
    });

    test('switching from one disabled row to another updates tooltip', async () => {
      renderWithinSizedShell(
        <DialFileManager
          items={disabledRowItems}
          path="Files"
          allowedFileTypes={['image/svg+xml']}
          maxSelectableFileSize={5 * 1024 * 1024}
          unsupportedFileTypeTooltip="Wrong type"
          fileTooLargeTooltip="Too large"
        />,
      );

      await hoverDisabledRow('report.pdf');

      await waitFor(() => {
        expect(screen.getByText('Wrong type')).toBeInTheDocument();
      });

      await hoverDisabledRow('large.svg');

      await waitFor(() => {
        expect(screen.getByText('Too large')).toBeInTheDocument();
        expect(screen.queryByText('Wrong type')).not.toBeInTheDocument();
      });
    });
  });
});
