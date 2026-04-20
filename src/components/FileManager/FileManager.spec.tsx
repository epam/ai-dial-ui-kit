import React, { createRef, type ReactElement } from 'react';
import {
  render,
  screen,
  within,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { DialFileManager } from './FileManager';
import { itemsMock } from './__mocks__/files';
import type { DialFileManagerActionsRef } from '@/models/file-manager';
import {
  useFileManagerColumns,
  type FileManagerGridContext,
  type UseFileManagerColumnsArgs,
} from './hooks/use-file-manager-columns';
import type { FileManagerGridRow } from './FileManagerContext';
import { FileManagerColumnKey } from '@/types/file-manager';
import {
  DialFileNodeType,
  DialFileResourceType,
  DialFilePermission,
  type DialFile,
} from '@/models/file';
import type { DropdownItem } from '@/models/dropdown';

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

vi.mock('@/components/ButtonDropdown/ButtonDropdown', () => ({
  DialButtonDropdown: ({
    label,
    items,
    disabled,
  }: {
    label?: string;
    items: DropdownItem[];
    disabled?: boolean;
  }) => (
    <div data-testid="mock-button-dropdown">
      <button disabled={disabled}>{label}</button>
      {items.map((item) => (
        <button
          key={item.key}
          data-testid={`action-${item.key}`}
          onClick={() =>
            item.onClick?.({
              key: item.key,
              domEvent: {} as React.MouseEvent,
            })
          }
        >
          {item.label}
        </button>
      ))}
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

const hoverRowByRowText = async (rowText: string) => {
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
    test('file exceeding maxSelectableFileSize shows size tooltip', async () => {
      renderWithinSizedShell(
        <DialFileManager
          items={disabledRowItems}
          path="Files"
          maxSelectableFileSize={5 * 1024 * 1024}
        />,
      );

      await hoverRowByRowText('large.svg');

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

      await hoverRowByRowText('icon.svg');

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

      await hoverRowByRowText('report.pdf');

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

      await hoverRowByRowText('report.pdf');

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

      await hoverRowByRowText('large.svg');

      await waitFor(() => {
        expect(screen.getByText('File exceeds limit')).toBeInTheDocument();
      });

      expect(
        screen.queryByText(/File is too large\. Maximum size/),
      ).not.toBeInTheDocument();
    });

    test('tooltip disappears on scroll', async () => {
      renderWithinSizedShell(
        <DialFileManager
          items={disabledRowItems}
          path="Files"
          allowedFileTypes={['image/*']}
        />,
      );

      await hoverRowByRowText('report.pdf');

      await waitFor(() => {
        expect(
          screen.getByText('Unsupported file type. Supported types: images.'),
        ).toBeInTheDocument();
      });

      fireEvent.scroll(window);

      await waitFor(() => {
        expect(
          screen.queryByText('Unsupported file type. Supported types: images.'),
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

      await hoverRowByRowText('report.pdf');

      await waitFor(() => {
        expect(screen.getByText('Wrong type')).toBeInTheDocument();
      });

      await hoverRowByRowText('large.svg');

      await waitFor(() => {
        expect(screen.getByText('Too large')).toBeInTheDocument();
        expect(screen.queryByText('Wrong type')).not.toBeInTheDocument();
      });
    });
  });

  test('search does NOT show files from hidden folders when hidden files toggle is off', async () => {
    renderWithinSizedShell(
      <DialFileManager
        items={itemsMock}
        defaultPath="All files"
        showHiddenFiles={false}
        treeOptions={{
          expandedPaths: new Set([
            'All files',
            'All files/Design',
            'All files/Design/Icons',
            'All files/Design/Icons/SVG',
            'All files/Design/Icons/SVG/24px',
          ]),
        }}
        navigationPanelOptions={{ searchable: true }}
      />,
    );

    const searchRegion = screen.getByRole('search', { name: 'Search' });
    const searchInput = within(searchRegion).getByRole('textbox');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'inside-hidden');

    expect((await queryAllInGridByRowText('inside-hidden')).length).toBe(0);
  });

  test('search DOES show files from hidden folders when hidden files toggle is on', async () => {
    renderWithinSizedShell(
      <DialFileManager
        items={itemsMock}
        defaultPath="All files"
        showHiddenFiles={true}
        treeOptions={{
          expandedPaths: new Set([
            'All files',
            'All files/Design',
            'All files/Design/Icons',
            'All files/Design/Icons/SVG',
            'All files/Design/Icons/SVG/24px',
          ]),
        }}
        navigationPanelOptions={{ searchable: true }}
      />,
    );

    const searchRegion = screen.getByRole('search', { name: 'Search' });
    const searchInput = within(searchRegion).getByRole('textbox');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'inside-hidden');

    expect(await findInGridByRowText('inside-hidden')).toBeInTheDocument();
  });

  test('actionsRef.createFolder clears search and adds a new row', async () => {
    const actionsRef = createRef<DialFileManagerActionsRef>();

    renderWithinSizedShell(
      <DialFileManager
        items={itemsMock}
        path="/All files/Design/Icons"
        actionsRef={actionsRef}
        treeOptions={{
          expandedPaths: new Set([
            '/All files',
            '/All files/Design',
            '/All files/Design/Icons',
          ]),
          showFiles: true,
        }}
        navigationPanelOptions={{ searchable: true }}
      />,
    );

    const baselineRowCount = screen.getAllByRole('row').length;

    const searchRegion = screen.getByRole('search', { name: 'Search' });
    const searchInput = within(searchRegion).getByRole('textbox');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'svg');

    expect(await findInGridByRowText('alert.svg')).toBeInTheDocument();

    actionsRef.current?.createFolder();

    await waitFor(() => {
      expect(searchInput).toHaveValue('');
      const rowsAfter = screen.getAllByRole('row').length;
      expect(rowsAfter).toBe(baselineRowCount + 1);
    });
  });

  describe('search persistence across file operations', () => {
    const SEARCH_QUERY = 'svg';
    const CURRENT_PATH = '/All files/Design/Icons/SVG/24px';
    const EXPANDED_PATHS = new Set([
      '/All files',
      '/All files/Design',
      '/All files/Design/Icons',
      '/All files/Design/Icons/SVG',
      '/All files/Design/Icons/SVG/24px',
    ]);

    const deepCloneItems = (): DialFile[] =>
      JSON.parse(JSON.stringify(itemsMock)) as DialFile[];

    const find24pxFolder = (items: DialFile[]): DialFile => {
      const design = items[0].items!.find((i) => i.name === 'Design')!;
      const icons = design.items!.find((i) => i.name === 'Icons')!;
      const svg = icons.items!.find((i) => i.name === 'SVG')!;
      return svg.items!.find((i) => i.name === '24px')!;
    };

    const renderSearchableManager = (items: DialFile[]) =>
      renderWithinSizedShell(
        <DialFileManager
          items={items}
          path={CURRENT_PATH}
          treeOptions={{ expandedPaths: EXPANDED_PATHS, showFiles: true }}
          navigationPanelOptions={{ searchable: true }}
        />,
      );

    const rerenderManager = (
      rerender: ReturnType<typeof render>['rerender'],
      items: DialFile[],
    ) =>
      rerender(
        <div style={{ height: 640, width: 1100 }}>
          <DialFileManager
            items={items}
            path={CURRENT_PATH}
            treeOptions={{ expandedPaths: EXPANDED_PATHS, showFiles: true }}
            navigationPanelOptions={{ searchable: true }}
          />
        </div>,
      );

    const typeSearchQuery = async (query: string): Promise<HTMLElement> => {
      const searchRegion = screen.getByRole('search', { name: 'Search' });
      const searchInput = within(searchRegion).getByRole('textbox');
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, query);
      return searchInput;
    };

    const expectRowAbsent = async (text: string): Promise<void> => {
      const grid = await waitForGridTable();
      await waitFor(() => {
        const rows = grid.querySelectorAll('.ag-center-cols-container .ag-row');
        const cellTexts = Array.from(rows).map((r) =>
          (r.textContent ?? '').trim(),
        );
        expect(cellTexts).not.toContain(text);
      });
    };

    test('rename: search query persists and renamed file appears in results', async () => {
      const items = deepCloneItems();
      const { rerender } = renderSearchableManager(items);
      const searchInput = await typeSearchQuery(SEARCH_QUERY);

      expect(await findInGridByRowText('alert.svg')).toBeInTheDocument();
      expect(await findInGridByRowText('logo.svg')).toBeInTheDocument();

      const mutatedItems = deepCloneItems();
      const folder = find24pxFolder(mutatedItems);
      const target = folder.items!.find((i) => i.name === 'alert.svg')!;
      target.name = 'renamed_alert.svg';
      target.path = `${CURRENT_PATH}/renamed_alert.svg`;
      target.id = 'renamed-alert-id';

      rerenderManager(rerender, mutatedItems);

      expect(searchInput).toHaveValue(SEARCH_QUERY);
      expect(
        await findInGridByRowText('renamed_alert.svg'),
      ).toBeInTheDocument();
      expect(await findInGridByRowText('logo.svg')).toBeInTheDocument();
      await expectRowAbsent('alert.svg');
    });

    test('delete: search query persists and deleted file disappears from results', async () => {
      const items = deepCloneItems();
      const { rerender } = renderSearchableManager(items);
      const searchInput = await typeSearchQuery(SEARCH_QUERY);

      expect(await findInGridByRowText('logo.svg')).toBeInTheDocument();

      const mutatedItems = deepCloneItems();
      const folder = find24pxFolder(mutatedItems);
      folder.items = folder.items!.filter((i) => i.name !== 'logo.svg');

      rerenderManager(rerender, mutatedItems);

      expect(searchInput).toHaveValue(SEARCH_QUERY);
      await expectRowAbsent('logo.svg');
      expect(await findInGridByRowText('alert.svg')).toBeInTheDocument();
    });

    test('duplicate: search query persists and duplicated file appears in results', async () => {
      const items = deepCloneItems();
      const { rerender } = renderSearchableManager(items);
      const searchInput = await typeSearchQuery(SEARCH_QUERY);

      expect(await findInGridByRowText('alert.svg')).toBeInTheDocument();

      const mutatedItems = deepCloneItems();
      const folder = find24pxFolder(mutatedItems);
      folder.items!.push({
        id: 'dup-alert',
        name: 'alert copy.svg',
        path: `${CURRENT_PATH}/alert copy.svg`,
        parentPath: CURRENT_PATH,
        folderId: 'icons-svg-24',
        nodeType: DialFileNodeType.ITEM,
        resourceType: DialFileResourceType.FILE,
        extension: 'svg',
        contentLength: 1024,
      });

      rerenderManager(rerender, mutatedItems);

      expect(searchInput).toHaveValue(SEARCH_QUERY);
      expect(await findInGridByRowText('alert.svg')).toBeInTheDocument();
      expect(await findInGridByRowText('alert copy.svg')).toBeInTheDocument();
    });

    test('copy (new file added): search query persists and copied file appears in results', async () => {
      const items = deepCloneItems();
      const { rerender } = renderSearchableManager(items);
      const searchInput = await typeSearchQuery(SEARCH_QUERY);

      const mutatedItems = deepCloneItems();
      const folder = find24pxFolder(mutatedItems);
      folder.items!.push({
        id: 'copied-icon',
        name: 'copied-icon.svg',
        path: `${CURRENT_PATH}/copied-icon.svg`,
        parentPath: CURRENT_PATH,
        folderId: 'icons-svg-24',
        nodeType: DialFileNodeType.ITEM,
        resourceType: DialFileResourceType.FILE,
        extension: 'svg',
        contentLength: 2048,
      });

      rerenderManager(rerender, mutatedItems);

      expect(searchInput).toHaveValue(SEARCH_QUERY);
      expect(await findInGridByRowText('copied-icon.svg')).toBeInTheDocument();
      expect(await findInGridByRowText('alert.svg')).toBeInTheDocument();
    });

    test('move (path change): search query persists and moved file reflects new name/path', async () => {
      const items = deepCloneItems();
      const { rerender } = renderSearchableManager(items);
      const searchInput = await typeSearchQuery(SEARCH_QUERY);

      expect(await findInGridByRowText('alert.svg')).toBeInTheDocument();

      const mutatedItems = deepCloneItems();
      const folder = find24pxFolder(mutatedItems);
      const target = folder.items!.find((i) => i.name === 'alert.svg')!;
      target.name = 'alert-moved.svg';
      target.path = `${CURRENT_PATH}/alert-moved.svg`;

      rerenderManager(rerender, mutatedItems);

      expect(searchInput).toHaveValue(SEARCH_QUERY);
      expect(await findInGridByRowText('alert-moved.svg')).toBeInTheDocument();
      await expectRowAbsent('alert.svg');
    });
  });

  describe('New actions clear search', () => {
    const renderWithNewActions = () =>
      renderWithinSizedShell(
        <DialFileManager
          items={itemsMock}
          defaultPath="All files"
          navigationPanelOptions={{ searchable: true }}
          toolbarOptions={{
            newActions: {
              newFolder: { label: 'New Folder' },
              uploadFiles: { label: 'Upload Files' },
              uploadArchive: { label: 'Upload Archive' },
            },
          }}
          treeOptions={{
            expandedPaths: new Set([
              'All files',
              'All files/Design',
              'All files/Design/Icons',
              'All files/Design/Icons/SVG',
            ]),
            showFiles: true,
          }}
        />,
      );

    const typeSearchAndVerify = async () => {
      const searchRegion = screen.getByRole('search', { name: 'Search' });
      const searchInput = within(searchRegion).getByRole('textbox');
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'svg');

      expect(await findInGridByRowText('SVG')).toBeInTheDocument();
      expect(searchInput).toHaveValue('svg');
      return searchInput;
    };

    test('New Folder clears the search text and results', async () => {
      renderWithNewActions();
      const searchInput = await typeSearchAndVerify();

      await userEvent.click(screen.getByTestId('action-new-folder'));

      await waitFor(() => {
        expect(searchInput).toHaveValue('');
      });
      expect((await queryAllInGridByRowText('SVG')).length).toBe(0);
    });

    test('Upload Files clears the search text and results', async () => {
      renderWithNewActions();
      const searchInput = await typeSearchAndVerify();

      await userEvent.click(screen.getByTestId('action-upload-file'));

      await waitFor(() => {
        expect(searchInput).toHaveValue('');
      });
      expect((await queryAllInGridByRowText('SVG')).length).toBe(0);
    });

    test('Upload Archive clears the search text and results', async () => {
      renderWithNewActions();
      const searchInput = await typeSearchAndVerify();

      await userEvent.click(screen.getByTestId('action-upload-archive'));

      await waitFor(() => {
        expect(searchInput).toHaveValue('');
      });
      expect((await queryAllInGridByRowText('SVG')).length).toBe(0);
    });

    test('drag and drop clears the search text and results', async () => {
      renderWithNewActions();
      const searchInput = await typeSearchAndVerify();

      fireEvent.drop(getGridRegion(), {
        dataTransfer: {
          files: [new File([''], 'test.txt', { type: 'text/plain' })],
          types: ['Files'],
        },
      });

      await waitFor(() => {
        expect(searchInput).toHaveValue('');
      });
      expect((await queryAllInGridByRowText('SVG')).length).toBe(0);
    });
  });

  describe('hideSearchPathItemName: path column cell renderer', () => {
    let pathCellRenderer: (params: {
      data: Pick<FileManagerGridRow, 'path'>;
      context: Partial<FileManagerGridContext>;
    }) => React.ReactElement;

    beforeEach(() => {
      let capturedRenderer: typeof pathCellRenderer;
      function HookHarness() {
        const { columnDefs } = useFileManagerColumns({
          effectiveVisibleColumns: [FileManagerColumnKey.Path],
        } as UseFileManagerColumnsArgs);
        const pathCol = columnDefs.find(
          (c) => c.colId === FileManagerColumnKey.Path,
        )!;
        capturedRenderer = pathCol.cellRenderer as typeof pathCellRenderer;
        return null;
      }
      render(<HookHarness />);
      pathCellRenderer = capturedRenderer!;
    });

    test('renders the trimmed path (without file name) when enabled', () => {
      const result = pathCellRenderer({
        data: { path: 'All files/Design/Icons/SVG/24px/logo.svg' },
        context: { hideSearchPathItemName: true },
      }) as React.ReactElement<{ text: string }>;
      expect(result.props.text).toBe('All files/Design/Icons/SVG/24px');
    });

    test('renders the full path (including file name) when disabled', () => {
      const result = pathCellRenderer({
        data: { path: 'All files/Design/Icons/SVG/24px/logo.svg' },
        context: { hideSearchPathItemName: false },
      }) as React.ReactElement<{ text: string }>;
      expect(result.props.text).toBe(
        'All files/Design/Icons/SVG/24px/logo.svg',
      );
    });

    test('strips trailing-slash folder name correctly when enabled', () => {
      const result = pathCellRenderer({
        data: { path: 'All files/Design/Icons/SVG/' },
        context: { hideSearchPathItemName: true },
      }) as React.ReactElement<{ text: string }>;
      expect(result.props.text).toBe('All files/Design/Icons');
    });
  });

  describe('auto-select uploaded files', () => {
    const UPLOAD_PATH = 'All files/Design/Icons/SVG/24px';
    const EXPANDED_PATHS = new Set([
      'All files',
      'All files/Design',
      'All files/Design/Icons',
      'All files/Design/Icons/SVG',
      'All files/Design/Icons/SVG/24px',
    ]);

    const deepCloneItems = (): DialFile[] =>
      JSON.parse(JSON.stringify(itemsMock)) as DialFile[];

    const find24pxFolder = (items: DialFile[]): DialFile => {
      const design = items[0].items!.find((i) => i.name === 'Design')!;
      const icons = design.items!.find((i) => i.name === 'Icons')!;
      const svg = icons.items!.find((i) => i.name === 'SVG')!;
      return svg.items!.find((i) => i.name === '24px')!;
    };

    test('uploaded files via drag-and-drop are auto-selected after items update', async () => {
      const items = deepCloneItems();
      const onUploadFiles = vi.fn();
      const onSelectedPathsChange = vi.fn();

      const { rerender } = renderWithinSizedShell(
        <DialFileManager
          items={items}
          path={UPLOAD_PATH}
          treeOptions={{ expandedPaths: EXPANDED_PATHS, showFiles: true }}
          onUploadFiles={onUploadFiles}
          onSelectedPathsChange={onSelectedPathsChange}
          uploadEnabled
          autoSelectUploadedItems
        />,
      );

      fireEvent.drop(getGridRegion(), {
        dataTransfer: {
          files: [
            new File(['content1'], 'uploaded1.txt', { type: 'text/plain' }),
            new File(['content2'], 'uploaded2.txt', { type: 'text/plain' }),
          ],
          types: ['Files'],
        },
      });

      await waitFor(() => {
        expect(onUploadFiles).toHaveBeenCalledTimes(1);
      });

      const uploadedFileNames = onUploadFiles.mock.calls[0][0].map(
        (f: { name: string }) => f.name,
      );
      expect(uploadedFileNames).toEqual(
        expect.arrayContaining(['uploaded1.txt', 'uploaded2.txt']),
      );

      const updatedItems = deepCloneItems();
      const folder = find24pxFolder(updatedItems);
      folder.items!.push(
        {
          id: 'uploaded-1',
          name: 'uploaded1.txt',
          path: `${UPLOAD_PATH}/uploaded1.txt`,
          parentPath: UPLOAD_PATH,
          nodeType: DialFileNodeType.ITEM,
          resourceType: DialFileResourceType.FILE,
          extension: 'txt',
          contentType: 'text/plain',
          folderId: 'icons-svg-24',
          updatedAt: '2025-02-01',
          contentLength: 8,
          permissions: [DialFilePermission.READ],
        },
        {
          id: 'uploaded-2',
          name: 'uploaded2.txt',
          path: `${UPLOAD_PATH}/uploaded2.txt`,
          parentPath: UPLOAD_PATH,
          nodeType: DialFileNodeType.ITEM,
          resourceType: DialFileResourceType.FILE,
          extension: 'txt',
          contentType: 'text/plain',
          folderId: 'icons-svg-24',
          updatedAt: '2025-02-01',
          contentLength: 8,
          permissions: [DialFilePermission.READ],
        },
      );

      rerender(
        <div style={{ height: 640, width: 1100 }}>
          <DialFileManager
            items={updatedItems}
            path={UPLOAD_PATH}
            treeOptions={{ expandedPaths: EXPANDED_PATHS, showFiles: true }}
            onUploadFiles={onUploadFiles}
            onSelectedPathsChange={onSelectedPathsChange}
            uploadEnabled
            autoSelectUploadedItems
          />
        </div>,
      );

      await waitFor(() => {
        expect(onSelectedPathsChange).toHaveBeenCalled();
        const lastCall = onSelectedPathsChange.mock.calls[
          onSelectedPathsChange.mock.calls.length - 1
        ][0] as Set<string>;
        expect(lastCall.has(`${UPLOAD_PATH}/uploaded1.txt`)).toBe(true);
        expect(lastCall.has(`${UPLOAD_PATH}/uploaded2.txt`)).toBe(true);
      });
    });

    test('auto-selection does not fire when user navigates away before items update', async () => {
      const items = deepCloneItems();
      const onUploadFiles = vi.fn();
      const onSelectedPathsChange = vi.fn();

      const { rerender } = renderWithinSizedShell(
        <DialFileManager
          items={items}
          path={UPLOAD_PATH}
          treeOptions={{ expandedPaths: EXPANDED_PATHS, showFiles: true }}
          onUploadFiles={onUploadFiles}
          onSelectedPathsChange={onSelectedPathsChange}
          uploadEnabled
          autoSelectUploadedItems
        />,
      );

      fireEvent.drop(getGridRegion(), {
        dataTransfer: {
          files: [
            new File(['content'], 'navigated-away.txt', {
              type: 'text/plain',
            }),
          ],
          types: ['Files'],
        },
      });

      await waitFor(() => {
        expect(onUploadFiles).toHaveBeenCalledTimes(1);
      });

      onSelectedPathsChange.mockClear();

      const updatedItems = deepCloneItems();
      const folder = find24pxFolder(updatedItems);
      folder.items!.push({
        id: 'nav-away-file',
        name: 'navigated-away.txt',
        path: `${UPLOAD_PATH}/navigated-away.txt`,
        parentPath: UPLOAD_PATH,
        nodeType: DialFileNodeType.ITEM,
        resourceType: DialFileResourceType.FILE,
        extension: 'txt',
        contentType: 'text/plain',
        folderId: 'icons-svg-24',
        updatedAt: '2025-02-01',
        contentLength: 7,
        permissions: [DialFilePermission.READ],
      });

      rerender(
        <div style={{ height: 640, width: 1100 }}>
          <DialFileManager
            items={updatedItems}
            path="All files"
            treeOptions={{ expandedPaths: EXPANDED_PATHS, showFiles: true }}
            onUploadFiles={onUploadFiles}
            onSelectedPathsChange={onSelectedPathsChange}
            uploadEnabled
          />
        </div>,
      );

      await waitFor(() => {
        const selectionCalls = onSelectedPathsChange.mock.calls;
        const hasUploadedFile = selectionCalls.some((call) => {
          const paths = call[0] as Set<string>;
          return paths.has(`${UPLOAD_PATH}/navigated-away.txt`);
        });
        expect(hasUploadedFile).toBe(false);
      });
    });

    test('auto-selects uploaded archive', async () => {
      const items = deepCloneItems();
      const onUploadArchive = vi.fn();
      const onSelectedPathsChange = vi.fn();

      const { rerender } = renderWithinSizedShell(
        <DialFileManager
          items={items}
          path={UPLOAD_PATH}
          treeOptions={{ expandedPaths: EXPANDED_PATHS, showFiles: true }}
          onUploadArchive={onUploadArchive}
          onSelectedPathsChange={onSelectedPathsChange}
          uploadEnabled
          autoSelectUploadedItems
          toolbarOptions={{
            newActions: {
              uploadArchive: { label: 'Upload Archive' },
            },
          }}
        />,
      );

      await userEvent.click(screen.getByTestId('action-upload-archive'));

      const input = document.body.querySelector(
        'input[accept=".zip,application/zip"]',
      ) as HTMLInputElement;

      expect(input).not.toBeNull();

      const file = new File(['mock content'], 'archive.zip', {
        type: 'application/zip',
      });
      Object.defineProperty(input, 'files', { value: [file] });
      act(() => {
        input.dispatchEvent(new Event('change'));
      });

      await waitFor(() => {
        expect(onUploadArchive).toHaveBeenCalledTimes(1);
      });

      const updatedItems = deepCloneItems();
      const folder = find24pxFolder(updatedItems);
      folder.items!.push({
        id: 'archive-0',
        name: 'archive',
        path: `${UPLOAD_PATH}/archive`,
        parentPath: UPLOAD_PATH,
        nodeType: DialFileNodeType.FOLDER,
        folderId: 'icons-svg-24',
        updatedAt: '2025-02-01',
        items: [],
      });

      rerender(
        <div style={{ height: 640, width: 1100 }}>
          <DialFileManager
            items={updatedItems}
            path={UPLOAD_PATH}
            treeOptions={{ expandedPaths: EXPANDED_PATHS, showFiles: true }}
            onUploadArchive={onUploadArchive}
            onSelectedPathsChange={onSelectedPathsChange}
            uploadEnabled
            autoSelectUploadedItems
          />
        </div>,
      );

      await waitFor(() => {
        expect(onSelectedPathsChange).toHaveBeenCalled();
        const lastCall = onSelectedPathsChange.mock.calls[
          onSelectedPathsChange.mock.calls.length - 1
        ][0] as Set<string>;
        expect(lastCall.has(`${UPLOAD_PATH}/archive`)).toBe(true);
      });
    });
  });
});
