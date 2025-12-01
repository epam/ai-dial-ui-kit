import { mergeClasses } from '@/utils/merge-classes';
import {
  type FC,
  type ReactNode,
  useMemo,
  useCallback,
  useState,
  useRef,
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
  BASE_FILE_MANAGER_ICON_SIZE,
  FOLDERS_TREE_PANEL_MIN_WIDTH,
  FOLDERS_TREE_PANEL_MAX_WIDTH,
} from './constants';
import { findNodeByPath } from './utils';
import { DialCollapsibleSidebar } from '@/components/CollapsibleSidebar/CollapsibleSidebar';
import type { DialFile, DialRootFolder } from '@/models/file';
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
import {
  type DialCopiedItem,
  type DialDeletedItem,
  type DialUploadFileItem,
} from '@/models/file-manager';
import {
  IconCopy,
  IconDownload,
  IconPencilMinus,
  IconTrashX,
} from '@tabler/icons-react';
import CopyToIcon from '@/assets/icons/copy-to.svg?react';
import MoveToIcon from '@/assets/icons/move-to.svg?react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { FileManagerProvider } from './FileManagerProvider';
import { useFileManagerContext } from './hooks/use-file-manager-context';
import type { FileManagerGridRow } from './FileManagerContext';
import { DialDateCellRenderer } from '@/components/Grid/renderers/DateCellRenderer';
import { FileManagerDeleteConfirmationPopup } from './components/FileManagerDeleteConfirmationPopup/FileManagerDeleteConfirmationPopup';
import {
  DestinationFolderPopup,
  type DestinationFolderPopupProps,
} from './components/DestinationFolderPopup/DestinationFolderPopup';
import { useBulkActions } from './hooks/use-bulk-actions';
import { useGridContextMenu } from './hooks/use-grid-context-menu';
import type {
  FileUploadValidationResult,
  FileUploadValidationMessages,
} from '@/components/FileManager/hooks/use-file-upload';
import classNames from 'classnames';
import { DialFileManagerActions } from '@/types/file-manager';
import { DialFileManagerItemName } from '@/components/FileManager/components/FileManagerItemName/FileManagerItemName';
import { DialItemType } from '@/types/item';
import type { FolderCreationValidationMessages } from '@/components/FileManager/hooks/use-folder-creation';
import { DialConditionalResizableContainer } from '@/components/ResizableContainer/ConditionalResizableContainer';

type GridRow = FileManagerGridRow;

export type DialFileManagerDestinationFolderPopupOptions = Pick<
  DestinationFolderPopupProps,
  | 'setDestinationFolderPath'
  | 'destinationFolderPath'
  | 'addFolderLabel'
  | 'copyLabel'
  | 'moveLabel'
  | 'hiddenFilesSwitcherLabel'
>;

export interface FileTreeOptions
  extends Omit<DialFoldersTreeProps, 'items' | 'selectedPath' | 'onItemClick'> {
  width?: number;
  title?: string;
  containerCssClass?: string;
  additionalButtons?: ReactNode;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  expandedPaths?: Set<string>;
  onExpandedPathsChange?: (expandedPaths: Set<string>) => void;
  actionLabels?: {
    [DialFileManagerActions.Duplicate]?: string;
    [DialFileManagerActions.Copy]?: string;
    [DialFileManagerActions.Rename]?: string;
    [DialFileManagerActions.Download]?: string;
    [DialFileManagerActions.Delete]?: string;
    [DialFileManagerActions.Move]?: string;
  };
}

export interface DeleteConfirmationOptions {
  cancelLabel?: string;
  titleRenderer?: (fileNames: string[]) => ReactNode | string;
  confirmLabel?: string;
  contentRenderer?: (fileNames: string[]) => ReactNode;
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
  actionLabels?: {
    [DialFileManagerActions.Duplicate]?: string;
    [DialFileManagerActions.Copy]?: string;
    [DialFileManagerActions.Rename]?: string;
    [DialFileManagerActions.Download]?: string;
    [DialFileManagerActions.Delete]?: string;
    [DialFileManagerActions.Move]?: string;
  };
}

export type ToolbarOptions = Omit<
  DialFileManagerToolbarProps,
  'areHiddenFilesVisible' | 'onToggleHiddenFiles'
> & {
  newActionLabels?: {
    uploadFiles?: string;
    newFolder?: string;
    uploadArchive?: string;
  };
};

export type BulkActionsToolbarOptions = Omit<
  DialFileManagerBulkActionsToolbarProps,
  'onClearSelection' | 'actions'
> & {
  actionLabels?: {
    [DialFileManagerActions.Duplicate]?: string;
    [DialFileManagerActions.Copy]?: string;
    [DialFileManagerActions.Download]?: string;
    [DialFileManagerActions.Delete]?: string;
    [DialFileManagerActions.Move]?: string;
  };
};

export interface CreateFolderValidationMessages {
  emptyName?: string;
  duplicateName?: string;
  forbiddenChars?: string;
}

export interface DialFileManagerProps {
  path?: string;
  cssClass?: string;

  items?: DialFile[];
  rootItem?: DialRootFolder;
  filesLoading?: boolean;

  showHiddenFiles?: boolean;
  onShowHiddenFilesChange?: (value: boolean) => void;

  treeOptions?: FileTreeOptions;
  toolbarOptions?: ToolbarOptions;
  navigationPanelOptions?: NavigationPanelOptions;
  gridOptions?: GridOptions;
  bulkActionsToolbarOptions?: BulkActionsToolbarOptions;
  deleteConfirmationOptions?: DeleteConfirmationOptions;
  destinationFolderPopupOptions?: DialFileManagerDestinationFolderPopupOptions;

  onPathChange?: (nextPath?: string) => void;
  onTableFileClick?: (file: GridRow) => void;

  onCopyFiles?: (items: DialCopiedItem[], destinationFolder: string) => void;
  onMoveToFiles?: (
    items: DialCopiedItem[],
    sourceFolder: string,
    destinationFolder: string,
  ) => void;
  onDeleteFiles?: (items: DialDeletedItem[], sourceFolder: string) => void;
  onDownloadFiles?: (items: DialFile[]) => void;

  onRename?: (itemPath: string) => void;
  onRenameSave?: (value: string) => void;
  onRenameCancel?: () => void;
  onRenameValidate?: (value: string, item: DialFile) => string | null;

  onCreateFolder?: (
    file: DialUploadFileItem,
    folderPath: string,
    fileId: string,
  ) => void | Promise<void>;
  onCreateFolderValidate?: (
    name: string,
    parentFolder: DialFile,
  ) => string | null;
  folderCreationValidationMessages?: FolderCreationValidationMessages;

  onUploadFiles?: (
    files: DialUploadFileItem[],
    destinationFolder: string,
  ) => void;
  onValidateUpload?: (
    files: DialUploadFileItem[],
    existingFiles: DialFile[],
    destinationFolder: string,
  ) => FileUploadValidationResult | Promise<FileUploadValidationResult>;
  maxFileSize?: number;
  uploadValidationMessages?: FileUploadValidationMessages;
  onUploadArchive?: (
    file: File,
    name: string,
    destinationFolder: string,
  ) => void;
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
 * // With loading state
 * <DialFileManager items={files} path="/All files" filesLoading={true} />
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
 * @param [rootItem] - Optional root folder item to represent the top-level container in the tree
 * @param [filesLoading=false] - When true, shows skeleton loading state in the grid
 *
 * @param [treeOptions] - Options that configure the collapsible sidebar and folders tree
 * @param [navigationPanelOptions] - Options for the breadcrumb and search panel (value/onSearchChange for controlled search)
 * @param [toolbarOptions] - Options for the file manager toolbar
 * @param [gridOptions] - Options forwarded to `DialGrid`; supports `columnDefs` override and `filterable` flag and date locale/options
 * @param [bulkActionsToolbarOptions] - Options for the bulk actions toolbar shown when items are selected
 * @param [deleteConfirmationOptions] - Options for the delete confirmation popup
 *
 * @param [onPathChange] - Callback fired when user navigates via tree or breadcrumb
 * @param [onTableFileClick] - Callback fired when a file row is clicked in the grid
 *
 * @param [onCopyFiles] - Callback fired when files copy-paste
 * @param [onMoveToFiles] - Callback fired when files cut-paste or rename
 * @param [onDeleteFiles] - Callback fired when files are deleted
 *
 * @param [onDownloadFiles] - Callback fired when files are downloaded
 *
 * @param [onUploadArchive] - Callback fired when archive files are uploaded
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
    rootItem,
    filesLoading,
    treeOptions,
    navigationPanelOptions,
    gridOptions,
    toolbarOptions,
    bulkActionsToolbarOptions,
    deleteConfirmationOptions,
    destinationFolderPopupOptions,

    areHiddenFilesVisible,
    toggleHiddenFilesVisibility,

    isTreeCollapsed,
    toggleTreeCollapse,

    currentPath,
    gridRows,
    selectedIds,
    selectedFiles,
    setSelectedFiles,
    clearSelection,

    effectiveSearchValue,
    handleBreadcrumbItemClick,
    handleSearchChange,
    handleTreeItemClick,
    handleTableRowClick,

    handleOpenDestinationFolderPopup,
    handleCloseDestinationFolderPopup,
    openDestinationFolderPopup,
    destinationFolderMode,
    handleSetCopiedFiles,
    handleSetMovedFiles,
    handleDuplicate,
    handleCopyTo,
    handleMoveTo,

    handleDownloadFiles,

    openDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDelete,
    deleteConfirmationOpen,
    itemsToDelete,
    renamedPath,
    onRename,
    onRenameSave,
    onRenameCancel,
    onRenameValidate,
    isDragging,
    isDraggingOverWindow,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,

    onUploadFiles,
    onValidateUpload,
    maxFileSize,
    newActions,
    isNewButtonVisible,
    newFolderTempId,
    cancelFolderCreation,
    saveFolderCreation,
    validateFolderName,
  } = useFileManagerContext();

  const {
    width = sidebarWidth,
    title = sidebarTitleDefault,
    containerCssClass = treeBaseClasses,
    additionalButtons,
    ...forwardedTreeProps
  } = treeOptions ?? {};

  const [sidebarCurrentWidth, setSidebarCurrentWidth] = useState(width);

  const sidebarThrottledRef = useRef<number | null>(null);

  const sidebarResizingHandler = (width: number) => {
    if (sidebarThrottledRef.current === null) {
      sidebarThrottledRef.current = requestAnimationFrame(() => {
        setSidebarCurrentWidth(width);
        sidebarThrottledRef.current = null;
      });
    }
  };

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
        cellRenderer: (params: { data: GridRow }) => {
          if (params.data?.isTemporary && params.data.id === newFolderTempId) {
            return (
              <DialFileManagerItemName
                name=""
                type={DialItemType.Folder}
                elementId={`new-folder-${params.data.id}`}
                editing={true}
                iconSize={BASE_FILE_MANAGER_ICON_SIZE}
                validate={validateFolderName}
                onSave={saveFolderCreation}
                onCancel={cancelFolderCreation}
              />
            );
          }

          return params.data?.nodeType === DialFileNodeType.FOLDER ? (
            <DialFolderName
              name={params.data.name}
              iconSize={BASE_FILE_MANAGER_ICON_SIZE}
            />
          ) : (
            <DialFileName
              name={params.data.name}
              iconSize={BASE_FILE_MANAGER_ICON_SIZE}
            />
          );
        },
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
  }, [
    dateLocale,
    dateOptions,
    newFolderTempId,
    saveFolderCreation,
    cancelFolderCreation,
    validateFolderName,
  ]);

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
      if (treeOptions.actionLabels[DialFileManagerActions.Duplicate]) {
        items.push({
          key: 'duplicate',
          label: treeOptions.actionLabels[DialFileManagerActions.Duplicate],
          icon: <IconCopy {...BASE_ICON_PROPS} className="text-secondary" />,
          onClick: () => handleDuplicate([file]),
        });
      }
      if (treeOptions.actionLabels[DialFileManagerActions.Copy]) {
        items.push({
          key: 'copy',
          label: treeOptions.actionLabels[DialFileManagerActions.Copy],
          icon: (
            <CopyToIcon
              width={BASE_ICON_PROPS.size}
              height={BASE_ICON_PROPS.size}
              className="text-secondary"
            />
          ),
          onClick: () => {
            handleSetCopiedFiles([file]);
            handleOpenDestinationFolderPopup('copy');
          },
        });
      }
      if (treeOptions.actionLabels[DialFileManagerActions.Move]) {
        items.push({
          key: 'move',
          label: treeOptions.actionLabels[DialFileManagerActions.Move],
          icon: (
            <MoveToIcon
              width={BASE_ICON_PROPS.size}
              height={BASE_ICON_PROPS.size}
              className="text-secondary"
            />
          ),
          onClick: () => {
            handleSetMovedFiles([file]);
            handleOpenDestinationFolderPopup('move');
          },
        });
      }
      if (treeOptions.actionLabels[DialFileManagerActions.Download]) {
        items.push({
          key: 'download',
          label: treeOptions.actionLabels[DialFileManagerActions.Download],
          icon: (
            <IconDownload {...BASE_ICON_PROPS} className="text-secondary" />
          ),
          onClick: () => handleDownloadFiles([file]),
        });
      }
      if (treeOptions.actionLabels[DialFileManagerActions.Rename]) {
        items.push({
          key: 'rename',
          label: treeOptions.actionLabels[DialFileManagerActions.Rename],
          icon: (
            <IconPencilMinus {...BASE_ICON_PROPS} className="text-secondary" />
          ),
          onClick: () => onRename(file.path),
        });
      }
      if (treeOptions.actionLabels[DialFileManagerActions.Delete]) {
        items.push({
          key: 'delete',
          label: treeOptions.actionLabels[DialFileManagerActions.Delete],
          icon: <IconTrashX {...BASE_ICON_PROPS} className="text-secondary" />,
          onClick: () => openDeleteConfirmation([file], file.parentPath ?? ''),
        });
      }
    }
    return items;
  };

  const selectedGridRows = useMemo(() => {
    const map = new Map<string, GridRow>();
    selectedFiles.forEach((_file, id) => {
      const gridRow = gridRows.find((row) => row.path === id);
      if (gridRow) {
        map.set(id, gridRow);
      }
    });
    return map;
  }, [selectedFiles, gridRows]);

  const handleSelectionChange = useCallback(
    (newSelectedGridRows: Map<string, GridRow>) => {
      const newSelectedFiles = new Map<string, DialFile>();
      newSelectedGridRows.forEach((_gridRow, id) => {
        const file = findNodeByPath(items, id);
        if (file) {
          newSelectedFiles.set(id, file);
        }
      });
      setSelectedFiles(newSelectedFiles);
    },
    [items, setSelectedFiles],
  );

  const bulkActions = useBulkActions({
    selectedFiles,
    actionLabels: bulkActionsToolbarOptions?.actionLabels,
    onDuplicate: handleDuplicate,
    onCopy: (files) => {
      handleSetCopiedFiles(files);
      handleOpenDestinationFolderPopup('copy');
    },
    onMove: (files) => {
      handleSetMovedFiles(files);
      handleOpenDestinationFolderPopup('move');
    },
    onDownload: handleDownloadFiles,
    onRename,
    onDelete: openDeleteConfirmation,
    getCurrentFolderPath: () => currentPath ?? '/',
  });

  const renderToolbar = useCallback(() => {
    if (toolbarOptions && selectedIds.size === 0) {
      return (
        <div
          className={toolbarBaseClasses}
          role="toolbar"
          aria-label="File Manager Toolbar"
        >
          <DialFileManagerToolbar
            {...toolbarOptions}
            areHiddenFilesVisible={areHiddenFilesVisible}
            onToggleHiddenFiles={toggleHiddenFilesVisibility}
            isNewButtonVisible={isNewButtonVisible}
            newButtonDropdownItems={newActions}
          />
        </div>
      );
    }

    if (selectedIds.size > 0 && bulkActionsToolbarOptions) {
      return (
        <div
          className={toolbarBaseClasses}
          role="toolbar"
          aria-label="File Manager Toolbar"
        >
          <DialFileManagerBulkActionsToolbar
            selectionLabel={`${selectedIds.size} ${bulkActionsToolbarOptions.selectionLabel}`}
            onClearSelection={clearSelection}
            actions={bulkActions}
          />
        </div>
      );
    }
    // If no toolbar options are provided, render empty div to maintain layout consistency
    return <div></div>;
  }, [
    bulkActionsToolbarOptions,
    selectedIds,
    clearSelection,
    bulkActions,
    areHiddenFilesVisible,
    toggleHiddenFilesVisibility,
    toolbarOptions,
    isNewButtonVisible,
    newActions,
  ]);

  const gridContextMenu = useGridContextMenu({
    actionLabels: gridOptions?.actionLabels,
    onDuplicate: (file) => handleDuplicate([file]),
    onCopy: (file) => {
      handleSetCopiedFiles([file]);
      handleOpenDestinationFolderPopup('copy');
    },
    onMove: (file) => {
      handleSetMovedFiles([file]);
      handleOpenDestinationFolderPopup('move');
    },
    onDownload: (file) => handleDownloadFiles([file]),
    onRename,
    onDelete: (file, parentFolderPath) =>
      openDeleteConfirmation([file], parentFolderPath),
  });

  const getGridContextMenuItems = useCallback(
    (row: GridRow) => {
      const file = findNodeByPath(items, row.path);
      if (!file) return [];
      return gridContextMenu(file);
    },
    [items, gridContextMenu],
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
      {renderToolbar()}
      <div className={mainGridClasses}>
        <aside
          role="region"
          aria-label="File Manager Tree Navigation"
          className="min-h-0 min-w-0 h-full flex-none"
        >
          <DialConditionalResizableContainer
            defaultWidth={sidebarCurrentWidth}
            width={sidebarCurrentWidth}
            onResizeStop={setSidebarCurrentWidth}
            onResize={sidebarResizingHandler}
            minWidth={FOLDERS_TREE_PANEL_MIN_WIDTH}
            maxWidth={FOLDERS_TREE_PANEL_MAX_WIDTH}
            enabled={isTreeCollapsed}
          >
            <DialCollapsibleSidebar
              width={sidebarCurrentWidth}
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
                renamedPath={renamedPath}
                onRenameSave={onRenameSave}
                onRenameCancel={onRenameCancel}
                onRenameValidate={onRenameValidate}
              />
            </DialCollapsibleSidebar>
          </DialConditionalResizableContainer>
        </aside>

        <div className={contentGridClasses}>
          <DialFileManagerNavigationPanel
            {...(navigationPanelOptions ?? {})}
            path={currentPath}
            onItemClick={handleBreadcrumbItemClick}
            makeHref={(segments) => '/' + segments.join('/')}
            rootItemPath={rootItem?.path}
            rootItemLabel={rootItem?.breadcrumbLabel}
            value={effectiveSearchValue}
            onSearchChange={handleSearchChange}
          />

          <section
            role="region"
            aria-label="File Manager Grid View"
            className={mergeClasses(gridBaseClasses)}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <DialGrid<GridRow>
              columnDefs={columnDefs}
              rowData={gridRows}
              getRowId={(row) => row.path}
              loading={filesLoading}
              getContextMenuItems={getGridContextMenuItems}
              cssClass={classNames(
                isDragging ? 'border border-dashed border-accent-primary' : '',
                isDraggingOverWindow && !isDragging
                  ? 'border border-dashed border-primary'
                  : '',
              )}
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
              selectedRows={selectedGridRows}
              onSelectionChangeWithMap={handleSelectionChange}
              wrapperBorder={!isDragging && !isDraggingOverWindow}
            />
          </section>
        </div>
      </div>

      <FileManagerDeleteConfirmationPopup
        open={deleteConfirmationOpen}
        itemsToDelete={itemsToDelete}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDelete}
        cancelLabel={deleteConfirmationOptions?.cancelLabel}
        confirmLabel={deleteConfirmationOptions?.confirmLabel}
        titleRenderer={deleteConfirmationOptions?.titleRenderer}
        contentRenderer={deleteConfirmationOptions?.contentRenderer}
      />
      <DestinationFolderPopup
        open={openDestinationFolderPopup}
        onClose={handleCloseDestinationFolderPopup}
        onConfirm={() => {
          const destinationPath =
            destinationFolderPopupOptions?.destinationFolderPath ?? '/';
          if (destinationFolderMode === 'copy') {
            handleCopyTo(destinationPath);
          } else {
            const sourcePath = currentPath ?? '/';
            handleMoveTo(destinationPath, sourcePath);
          }
          handleCloseDestinationFolderPopup();
        }}
        mode={destinationFolderMode}
        items={items}
        rootItem={rootItem}
        onPathChange={destinationFolderPopupOptions?.setDestinationFolderPath}
        path={destinationFolderPopupOptions?.destinationFolderPath}
        addFolderLabel={destinationFolderPopupOptions?.addFolderLabel}
        copyLabel={destinationFolderPopupOptions?.copyLabel}
        moveLabel={destinationFolderPopupOptions?.moveLabel}
        hiddenFilesSwitcherLabel={
          destinationFolderPopupOptions?.hiddenFilesSwitcherLabel
        }
        gridOptions={{ columnDefs: columnDefs, loading: filesLoading }}
        onUploadFiles={onUploadFiles}
        onValidateUpload={onValidateUpload}
        maxFileSize={maxFileSize}
      />
    </section>
  );
};
