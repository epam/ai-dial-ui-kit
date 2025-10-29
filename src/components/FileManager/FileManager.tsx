import { mergeClasses } from '@/utils/merge-classes';
import {
  type FC,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
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
  findFolderForPath,
  normalizeExtensionWithoutDot,
  normalizeToLowerCase,
  collectAllDescendants,
  isHiddenDotFile,
} from './utils';
import {
  DialFileManagerToolbar,
  type DialFileManagerToolbarProps,
} from './components/FileManagerToolbar/DialFileManagerToolbar';

import { useShowHiddenFiles } from './hooks/use-show-hidden-files';
import { useCollapseTree } from './hooks/use-collapse-tree';
import { useFileClipboard } from './hooks/use-file-clipboard';

import type { DropdownItem } from '@/models/dropdown';
import { DialFileManagerActions } from '@/types/file-manager';
import { IconClipboardCopy, IconCopy, IconCut } from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import {
  DialFileManagerBulkActionsToolbar,
  type DialFileManagerBulkActionsToolbarProps,
} from './components/FileManagerBulkActionsToolbar/FileManagerBulkActionsToolbar';

interface GridRow {
  id: string;
  name: string;
  updatedAt?: string;
  size?: string;
  author?: string;
  path: string;
  nodeType: DialFileNodeType;
  extension?: string;
}

export interface FileTreeOptions
  extends Omit<DialFoldersTreeProps, 'items' | 'selectedPath' | 'onItemClick'> {
  width?: number;
  title?: string;
  containerCssClass?: string;
  additionalButtons?: ReactNode;
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
}

const formatBytes = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return '-';
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  if (bytes >= megabyte) return `${(bytes / megabyte).toFixed(1)} MB`;
  if (bytes >= kilobyte) return `${(bytes / kilobyte).toFixed(0)} KB`;
  return `${bytes} B`;
};

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

  onCopyFiles?: (files: string[], destination: string) => void;
  onMoveToFiles?: (files: string[], destination: string) => void;
}

/**
 * File Manager layout with a collapsible folders tree, breadcrumb/search header, and a data grid.
 *
 * Features:
 * - Global `path` drives both the breadcrumb trail and the visible folder in the grid.
 * - The grid shows children of the current folder. When a search query is present, it scans all nested descendants.
 * - Pluggable tree, navigation panel, and grid behaviors via `treeOptions`, `navigationPanelOptions`, and `gridOptions`.
 * - Optional filters toggle via `gridOptions.filterable` (default `true`).
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
 * ```
 *
 * @param [path] - Absolute path of the current location (e.g., "/All files/Design/Icons")
 * @param [cssClass] - Additional classes for the root container
 * @param [items] - Full hierarchical list of files and folders used by both tree and grid
 *
 * @param [treeOptions] - Options that configure the collapsible sidebar and folders tree
 * @param [navigationPanelOptions] - Options for the breadcrumb and search panel (value/onSearchChange for controlled search)
 * @param [toolbarOptions] - Options for the file manager toolbar
 * @param [gridOptions] - Options forwarded to `DialGrid`; supports `columnDefs` override and `filterable` flag
 * @param [bulkActionsToolbarOptions] - Options for the bulk actions toolbar shown when items are selected
 *
 * @param [onPathChange] - Callback fired when user navigates via tree or breadcrumb
 * @param [onTableFileClick] - Callback fired when a file row is clicked in the grid
 *
 * @param [onCopyFiles] - Callback fired when files copy-paste
 * @param [onMoveToFiles] - Callback fired when files cut-paste or rename
 */
export const DialFileManager: FC<DialFileManagerProps> = ({
  path,
  cssClass,
  items = [],
  treeOptions,
  navigationPanelOptions,
  gridOptions,
  toolbarOptions,
  bulkActionsToolbarOptions,
  onPathChange,
  onTableFileClick,
  onCopyFiles,
  onMoveToFiles,
}) => {
  const [currentPath, setCurrentPath] = useState<string | undefined>(path);
  const { areHiddenFilesVisible, toggleHiddenFilesVisibility } =
    useShowHiddenFiles();

  const { isTreeCollapsed, toggleTreeCollapse } = useCollapseTree(
    treeOptions?.collapsed ?? false,
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectionChange = (newSelectedIds: Set<string>) => {
    setSelectedIds(newSelectedIds);
  };

  useEffect(() => {
    setCurrentPath(path);
  }, [path]);

  const [searchValue, setSearchValue] = useState<string>('');
  useEffect(() => {
    const external = navigationPanelOptions?.value;
    if (external != null) {
      setSearchValue(String(external));
    }
  }, [navigationPanelOptions?.value]);

  const {
    width = sidebarWidth,
    title = sidebarTitleDefault,
    containerCssClass = treeBaseClasses,
    additionalButtons,
    ...forwardedTreeProps
  } = treeOptions ?? {};

  const effectiveSearchValue = String(
    navigationPanelOptions?.value ?? searchValue ?? '',
  ).trim();

  const currentFolder = useMemo(
    () => findFolderForPath(items, currentPath) ?? items[0],
    [items, currentPath],
  );

  const {
    state: clipboard,
    copy: onCopy,
    cut: onCut,
    paste: onPaste,
  } = useFileClipboard({
    getDestination: () => currentFolder?.path ?? '/',
    onCopyFiles,
    onMoveToFiles,
  });

  const gridRows: GridRow[] = useMemo(() => {
    const query = normalizeToLowerCase(effectiveSearchValue).trim();

    const directChildren = currentFolder?.items ?? [];
    let searchSourceNodes: DialFile[] = query
      ? collectAllDescendants(currentFolder)
      : directChildren;

    if (!areHiddenFilesVisible) {
      searchSourceNodes = searchSourceNodes.filter(
        (node) => !isHiddenDotFile(node),
      );
    }

    const mappedRows = searchSourceNodes.map((node) => ({
      id: node.id ?? node.path,
      name: node.name ?? node.path.split('/').pop() ?? '',
      updatedAt: node.updatedAt,
      size:
        node.nodeType === DialFileNodeType.ITEM
          ? formatBytes(node.contentLength)
          : '-',
      author: node.author,
      path: node.path,
      nodeType: node.nodeType,
      extension: node.extension,
    }));

    if (!query) return mappedRows;

    const queryTokens = query.split(/\s+/).filter(Boolean);

    return mappedRows.filter((row) => {
      const nameLower = normalizeToLowerCase(row.name);
      const authorLower = normalizeToLowerCase(row.author);
      const extensionLower = normalizeExtensionWithoutDot(row.extension);

      return queryTokens.every(
        (token) =>
          nameLower.includes(token) ||
          authorLower.includes(token) ||
          extensionLower.includes(token),
      );
    });
  }, [currentFolder, effectiveSearchValue, areHiddenFilesVisible]);

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
      },
      {
        field: 'size',
        headerName: 'Size',
        width: 120,
        suppressSizeToFit: true,
      },
    ];
  }, []);

  const {
    columnDefs: userColumnDefs,
    filterable = true,
    ...forwardedGridOptions
  } = gridOptions ?? {};

  const baseColumns = userColumnDefs ?? defaultColumns;

  const columnDefs = useMemo<ColDef<GridRow>[]>(() => {
    if (filterable) return baseColumns;
    return baseColumns.map((col) => ({
      ...col,
      filter: false,
      floatingFilter: false,
    }));
  }, [baseColumns, filterable]);

  const onClearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handlePathChange = useCallback(
    (nextPath?: string) => {
      setCurrentPath(nextPath);
      onPathChange?.(nextPath);
      onClearSelection();
    },
    [onPathChange, onClearSelection],
  );

  const handleTreeItemClick = useCallback(
    (item: DialFile) => {
      handlePathChange(item.path);
    },
    [handlePathChange],
  );

  const handleBreadcrumbItemClick = useCallback(
    (href?: string) => {
      handlePathChange(href);
    },
    [handlePathChange],
  );

  const handleSearchChange = useCallback(
    (value?: string) => {
      const next = String(value ?? '');
      setSearchValue(next);
      navigationPanelOptions?.onSearchChange?.(next);
    },
    [navigationPanelOptions],
  );

  const onTableRowClick = useCallback(
    (row: GridRow) => {
      if (row.nodeType === DialFileNodeType.FOLDER) {
        handlePathChange(row.path);
      } else {
        onTableFileClick?.(row);
      }
    },
    [handlePathChange, onTableFileClick],
  );

  const getTreeContextMenuItems = useCallback(
    (file: DialFile) => {
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
    },
    [onCopy, treeOptions?.actionLabels, onCut, onPaste, clipboard.hasItems],
  );

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
            onClearSelection={onClearSelection}
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
                    onTableRowClick(event.data);
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
