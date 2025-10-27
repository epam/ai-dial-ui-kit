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
  treePlaceholderClasses,
  contentGridClasses,
  sidebarWidth,
  sidebarTitleDefault,
  gridPlaceholderClasses,
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
  formatBytes,
  normalizeToLowerCase,
  collectAllDescendants,
} from './utils';

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

export interface DialFileManagerProps {
  path?: string;
  cssClass?: string;

  items?: DialFile[];

  treeOptions?: Omit<
    DialFoldersTreeProps,
    'items' | 'selectedPath' | 'onItemClick'
  > & {
    width?: number;
    title?: string;
    containerCssClass?: string;
    additionalButtons?: ReactNode;
  };

  navigationPanelOptions?: Omit<
    DialFileManagerNavigationPanelProps,
    'path' | 'makeHref'
  >;

  /** Grid options; rowData and columnDefs are prepared here */
  gridOptions?: Omit<DialGridProps<GridRow>, 'rowData' | 'columnDefs'> & {
    columnDefs?: ColDef<GridRow>[];
    filterable?: boolean;
  };

  onPathChange?: (nextPath?: string) => void;
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
 * @param [treeOptions] - Options that configure the collapsible sidebar and folders tree
 * @param [navigationPanelOptions] - Options for the breadcrumb and search panel (value/onSearchChange for controlled search)
 * @param [gridOptions] - Options forwarded to `DialGrid`; supports `columnDefs` override and `filterable` flag
 * @param [onPathChange] - Callback fired when user navigates via tree or breadcrumb
 */
export const DialFileManager: FC<DialFileManagerProps> = ({
  path,
  cssClass,
  items = [],
  treeOptions,
  navigationPanelOptions,
  gridOptions,
  onPathChange,
}) => {
  const [currentPath, setCurrentPath] = useState<string | undefined>(path);

  useEffect(() => {
    setCurrentPath(path);
  }, [path]);

  const [searchValue, setSearchValue] = useState<string>('');
  useEffect(() => {
    const external = navigationPanelOptions?.value;
    if (external !== undefined && external !== null) {
      setSearchValue(String(external));
    }
  }, [navigationPanelOptions?.value]);

  const {
    width = sidebarWidth,
    title = sidebarTitleDefault,
    containerCssClass = treePlaceholderClasses,
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

  const gridRows: GridRow[] = useMemo(() => {
    const query = normalizeToLowerCase(effectiveSearchValue).trim();

    const directChildren = currentFolder?.items ?? [];
    const searchSourceNodes: DialFile[] = query
      ? collectAllDescendants(currentFolder)
      : directChildren;

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
  }, [currentFolder, effectiveSearchValue]);

  const defaultColumns = useMemo<ColDef<GridRow>[]>(() => {
    return [
      {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        cellRenderer: (params: { data: GridRow }) =>
          params.data?.nodeType === DialFileNodeType.FOLDER ? (
            <DialFolderName name={params.data.name} />
          ) : (
            <DialFileName name={params.data.name} />
          ),
      },
      { field: 'updatedAt', headerName: 'Modified', width: 180 },
      { field: 'size', headerName: 'Size', width: 120 },
      { field: 'author', headerName: 'Author', width: 160 },
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

  const handleTreeItemClick = useCallback(
    (item: DialFile) => {
      setCurrentPath(item.path);
      onPathChange?.(item.path);
    },
    [onPathChange],
  );

  const handleBreadcrumbItemClick = useCallback(
    (href?: string) => {
      setCurrentPath(href);
      onPathChange?.(href);
    },
    [onPathChange],
  );

  const handleSearchChange = useCallback(
    (value?: string) => {
      const next = String(value ?? '');
      setSearchValue(next);
      navigationPanelOptions?.onSearchChange?.(next);
    },
    [navigationPanelOptions],
  );

  return (
    <section className={mergeClasses(containerBaseClasses, cssClass)}>
      <div
        className={toolbarBaseClasses}
        role="toolbar"
        aria-label="File Manager Toolbar"
      >
        Toolbar
      </div>

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
          >
            <DialFoldersTree
              {...forwardedTreeProps}
              items={items}
              selectedPath={currentPath}
              onItemClick={handleTreeItemClick}
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
            className={gridPlaceholderClasses}
          >
            <DialGrid<GridRow>
              columnDefs={columnDefs}
              rowData={gridRows}
              getRowId={(row) => row.path}
              {...forwardedGridOptions}
            />
          </section>
        </div>
      </div>
    </section>
  );
};
