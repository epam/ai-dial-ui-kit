import { mergeClasses } from '@/utils/merge-classes';
import { type FC, useMemo } from 'react';
import type { ColDef } from 'ag-grid-community';
import {
  containerBaseClasses,
  mainGridClasses,
  toolbarBaseClasses,
  treeBaseClasses,
  contentGridClasses,
  sidebarWidth,
  sidebarTitleDefault,
  gridBaseClasses,
} from './constants';
import { DialCollapsibleSidebar } from '@/components/CollapsibleSidebar/CollapsibleSidebar';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import {
  DialFoldersTree,
  type DialFoldersTreeProps,
} from './components/FoldersTree/FoldersTree';
import {
  DialFileManagerNavigationPanel,
  type DialFileManagerNavigationPanelProps,
} from './components/FileManagerNavigationPanel/FileManagerNavigationPanel';
import { DialGrid, type DialGridProps } from '@/components/Grid/Grid';
import { DialFileName } from '@/components/FileName/FileName';
import { DialFolderName } from '@/components/FolderName/FolderName';
import {
  DialFileManagerToolbar,
  type DialFileManagerToolbarProps,
} from './components/FileManagerToolbar/DialFileManagerToolbar';
import {
  DialFileManagerBulkActionsToolbar,
  type DialFileManagerBulkActionsToolbarProps,
} from './components/FileManagerBulkActionsToolbar/FileManagerBulkActionsToolbar';
import type { DropdownItem } from '@/models/dropdown';
import { DialFileManagerActions, type CopiedItem } from '@/types/file-manager';
import { IconClipboardCopy, IconCopy, IconCut } from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { FileManagerProvider } from './FileManagerProvider';
import { useFileManagerContext } from './hooks/use-file-manager-context';
import type { FileManagerGridRow } from './FileManagerContext';
import { DialDateCellRenderer } from '../Grid/renderers/DateCellRenderer';

type GridRow = FileManagerGridRow;

export interface FileTreeOptions
  extends Omit<DialFoldersTreeProps, 'items' | 'selectedPath' | 'onItemClick'> {
  width?: number;
  title?: string;
  containerCssClass?: string;
  additionalButtons?: React.ReactNode;
  collapsed?: boolean;
  actionLabels?: {
    [DialFileManagerActions.Copy]?: string;
    [DialFileManagerActions.Cut]?: string;
    [DialFileManagerActions.Paste]?: string;
    [DialFileManagerActions.Rename]?: string;
  };
}

export type NavigationPanelOptions = Omit<
  DialFileManagerNavigationPanelProps,
  'path' | 'makeHref' | 'onItemClick'
>;

export interface GridOptions
  extends Omit<DialGridProps<GridRow>, 'rowData' | 'columnDefs'> {
  columnDefs?: ColDef<GridRow>[];
  filterable?: boolean;
  dateLocale?: Intl.LocalesArgument;
  dateOptions?: Intl.DateTimeFormatOptions;
}

export type ToolbarOptions = Omit<
  DialFileManagerToolbarProps,
  'areHiddenFilesVisible' | 'onToggleHiddenFiles'
>;

export type BulkActionsToolbarOptions = Omit<
  DialFileManagerBulkActionsToolbarProps,
  'onClearSelection'
>;

export interface DialFileManagerProps {
  path?: string;
  cssClass?: string;

  items?: DialFile[];

  treeOptions?: FileTreeOptions;
  toolbarOptions?: ToolbarOptions;
  navigationPanelOptions?: NavigationPanelOptions;
  gridOptions?: GridOptions;
  bulkActionsToolbarOptions?: BulkActionsToolbarOptions;

  onPathChange?: (nextPath?: string) => void;
  onTableFileClick?: (file: GridRow) => void;

  onCopyFiles?: (items: CopiedItem[]) => void;
  onMoveToFiles?: (items: CopiedItem[]) => void;
}

/**
 * File Manager layout with a collapsible folders tree, breadcrumb/search header, and a data grid.
 *
 * Features:
 * - Global `path` drives both the breadcrumb trail and the visible folder in the grid.
 * - The grid shows children of the current folder. When a search query is present, it scans all nested descendants.
 * - Pluggable tree, navigation panel, and grid behaviors via `treeOptions`, `navigationPanelOptions`, and `gridOptions`.
 * - Optional filters toggle via `gridOptions.filterable` (default `true`).
 * - Supports bulk actions toolbar when items are selected.
 *
 * @example
 * ```tsx
 * // Minimal usage
 * <DialFileManager items={files} path="/All files" />
 *
 * // With controlled search and disabled grid filters
 * const [query, setQuery] = useState('');
 * <DialFileManager
 *   items={files}
 *   path="/All files/Design"
 *   navigationPanelOptions={{
 *     searchable: true,
 *     value: query,
 *     onSearchChange: setQuery,
 *   }}
 *   gridOptions={{ filterable: false }}
 * />
 *
 * // With custom tree width and title
 * <DialFileManager
 *   items={files}
 *   treeOptions={{ width: 300, title: 'Explorer', showFiles: true }}
 * />
 *
 * // With explicit provider (advanced apps)
 * <FileManagerProvider items={files} path="/All files">
 *   <MyCustomHeader />
 *   <DialFileManagerView />  // internal view
 *   <MyCustomFooter />
 * </FileManagerProvider>
 * ```
 *
 * @param [path] - Absolute path of the current location (e.g. "/All files/Design/Icons")
 * @param [cssClass] - Additional classes for the root container
 * @param [items] - Full hierarchical list of files and folders used by both tree and grid
 *
 * @param [treeOptions] - Options that configure the collapsible sidebar and folders tree
 * @param [navigationPanelOptions] - Options for the breadcrumb and search panel (value/onSearchChange for controlled search)
 * @param [toolbarOptions] - Options for the file manager toolbar
 * @param [gridOptions] - Options forwarded to `DialGrid`; supports `columnDefs` override and `filterable` flag and date locale/options
 * @param [bulkActionsToolbarOptions] - Options for the bulk actions toolbar shown when items are selected
 *
 * @param [onPathChange] - Callback fired when user navigates via tree or breadcrumb
 * @param [onTableFileClick] - Callback fired when a file row is clicked in the grid
 *
 * @param [onCopyFiles] - Callback fired when files copy-paste
 * @param [onMoveToFiles] - Callback fired when files cut-paste or rename
 */
export const DialFileManager: FC<DialFileManagerProps> = (props) => {
  return (
    <FileManagerProvider {...props}>
      <DialFileManagerView />
    </FileManagerProvider>
  );
};

/**
 * Internal view-only component.
 * Reads all data from FileManagerContext and renders the actual layout.
 * This is what apps can reuse if they want to control the provider manually.
 */
export const DialFileManagerView: FC = () => {
  const {
    cssClass,
    items,
    treeOptions,
    navigationPanelOptions,
    gridOptions,
    toolbarOptions,
    bulkActionsToolbarOptions,

    areHiddenFilesVisible,
    toggleHiddenFilesVisibility,

    isTreeCollapsed,
    toggleTreeCollapse,

    currentPath,
    gridRows,
    selectedIds,
    setSelectedIds,
    clearSelection,

    effectiveSearchValue,
    handleBreadcrumbItemClick,
    handleSearchChange,
    handleTreeItemClick,
    handleTableRowClick,

    onCopy,
    onCut,
    onPaste,
    clipboard,
  } = useFileManagerContext();

  const {
    width = sidebarWidth,
    title = sidebarTitleDefault,
    containerCssClass = treeBaseClasses,
    additionalButtons,
    ...forwardedTreeProps
  } = treeOptions ?? {};

  const {
    columnDefs: userColumnDefs,
    filterable = true,
    dateLocale,
    dateOptions,
    ...forwardedGridOptions
  } = gridOptions ?? {};

  const defaultColumns = useMemo<ColDef<GridRow>[]>(() => {
    return [
      {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        minWidth: 200,
        cellRenderer: (params: { data: GridRow }) =>
          params.data?.nodeType === DialFileNodeType.FOLDER ? (
            <DialFolderName name={params.data.name} />
          ) : (
            <DialFileName name={params.data.name} />
          ),
      },
      {
        field: 'updatedAt',
        headerName: 'Modified Date',
        width: 168,
        suppressSizeToFit: true,
        cellRenderer: DialDateCellRenderer,
        cellRendererParams: {
          locale: dateLocale,
          emptyPlaceholder: '—',
          options: dateOptions,
        },
      },
      {
        field: 'size',
        headerName: 'Size',
        width: 120,
        suppressSizeToFit: true,
      },
    ];
  }, [dateLocale, dateOptions]);

  const baseColumns = userColumnDefs ?? defaultColumns;
  const columnDefs = useMemo<ColDef<GridRow>[]>(() => {
    if (filterable) return baseColumns;
    return baseColumns.map((col) => ({
      ...col,
      filter: false,
      floatingFilter: false,
    }));
  }, [baseColumns, filterable]);

  const getTreeContextMenuItems = (file: DialFile): DropdownItem[] => {
    const items: DropdownItem[] = [];
    if (treeOptions?.actionLabels) {
      if (treeOptions.actionLabels[DialFileManagerActions.Copy]) {
        items.push({
          key: 'copy',
          label: treeOptions.actionLabels[DialFileManagerActions.Copy],
          icon: <IconCopy {...BASE_ICON_PROPS} className="text-secondary" />,
          onClick: () => onCopy([file.path]),
        });
      }
      if (treeOptions.actionLabels[DialFileManagerActions.Cut]) {
        items.push({
          key: 'cut',
          label: treeOptions.actionLabels[DialFileManagerActions.Cut],
          icon: <IconCut {...BASE_ICON_PROPS} className="text-secondary" />,
          onClick: () => onCut([file.path]),
        });
      }
      if (treeOptions.actionLabels[DialFileManagerActions.Paste]) {
        items.push({
          key: 'paste',
          label: treeOptions.actionLabels[DialFileManagerActions.Paste],
          disabled: !clipboard.hasItems,
          icon: (
            <IconClipboardCopy
              {...BASE_ICON_PROPS}
              className="text-secondary"
            />
          ),
          onClick: () => onPaste(),
        });
      }
    }
    return items;
  };

  const handleSelectionChange = (newSelectedIds: Set<string>) => {
    setSelectedIds(newSelectedIds);
  };

  return (
    <section
      className={mergeClasses(
        containerBaseClasses,
        {
          'gap-3 pt-4': bulkActionsToolbarOptions && selectedIds.size > 0,
        },
        cssClass,
      )}
    >
      {toolbarOptions && selectedIds.size === 0 && (
        <div
          className={toolbarBaseClasses}
          role="toolbar"
          aria-label="File Manager Toolbar"
        >
          <DialFileManagerToolbar
            {...toolbarOptions}
            areHiddenFilesVisible={areHiddenFilesVisible}
            onToggleHiddenFiles={toggleHiddenFilesVisibility}
          />
        </div>
      )}

      {selectedIds.size > 0 && bulkActionsToolbarOptions && (
        <div
          className={toolbarBaseClasses}
          role="toolbar"
          aria-label="File Manager Toolbar"
        >
          <DialFileManagerBulkActionsToolbar
            {...bulkActionsToolbarOptions}
            onClearSelection={clearSelection}
            selectionLabel={`${selectedIds.size} ${bulkActionsToolbarOptions.selectionLabel}`}
          />
        </div>
      )}

      <div className={mainGridClasses}>
        <aside
          role="region"
          aria-label="File Manager Tree Navigation"
          className="min-h-0 min-w-0 h-full flex-none"
        >
          <DialCollapsibleSidebar
            width={width}
            title={title}
            containerCssClass={containerCssClass}
            additionalButtons={additionalButtons}
            isOpened={isTreeCollapsed}
            onToggle={toggleTreeCollapse}
          >
            <DialFoldersTree
              {...forwardedTreeProps}
              items={items}
              selectedPath={currentPath}
              onItemClick={handleTreeItemClick}
              areHiddenFilesVisible={areHiddenFilesVisible}
              getContextMenuItems={getTreeContextMenuItems}
            />
          </DialCollapsibleSidebar>
        </aside>

        <div className={contentGridClasses}>
          <DialFileManagerNavigationPanel
            {...(navigationPanelOptions ?? {})}
            path={currentPath}
            onItemClick={handleBreadcrumbItemClick}
            makeHref={(segments) => '/' + segments.join('/')}
            value={effectiveSearchValue}
            onSearchChange={handleSearchChange}
          />

          <section
            role="region"
            aria-label="File Manager Grid View"
            className={gridBaseClasses}
          >
            <DialGrid<GridRow>
              columnDefs={columnDefs}
              rowData={gridRows}
              getRowId={(row) => row.path}
              {...forwardedGridOptions}
              additionalGridOptions={{
                ...forwardedGridOptions.additionalGridOptions,
                onCellClicked: (event) => {
                  if (event.colDef.colId === '__select') {
                    return;
                  }
                  if (event.data) {
                    handleTableRowClick(event.data);
                  }
                },
              }}
              selectedRowIds={selectedIds}
              onSelectionChange={handleSelectionChange}
            />
          </section>
        </div>
      </div>
    </section>
  );
};
