import { mergeClasses } from '@/utils/merge-classes';
import {
  type FC,
  type ReactNode,
  useMemo,
  useCallback,
  useState,
  useRef,
  type Ref,
  useImperativeHandle,
  type RefObject,
  useEffect,
} from 'react';
import type { CellClickedEvent, ColDef, GridApi } from 'ag-grid-community';
import {
  containerBaseClassName,
  mainGridClassName,
  toolbarBaseClassName,
  treeBaseClassName,
  contentGridClassName,
  sidebarWidth,
  sidebarTitleDefault,
  gridBaseClassName,
  FOLDERS_TREE_PANEL_MIN_WIDTH,
  FOLDERS_TREE_PANEL_MAX_WIDTH,
  COMPACT_VIEW_HEADER_HEIGHT,
  COMPACT_VIEW_FILE_ROW_HEIGHT,
  DEFAULT_COMPACT_VIEW_WIDTH_BREAKPOINT,
  actionsColumnButtonClassName,
  DEFAULT_VISIBLE_COLUMN,
} from './constants';
import { findNodeByPath, isFileAccepted, formatBytes } from './utils';
import { DialCollapsibleSidebar } from '@/components/CollapsibleSidebar/CollapsibleSidebar';
import type { DialFile, DialRootFolder } from '@/models/file';
import { DialFileNodeType, DialFilePermission } from '@/models/file';
import {
  DialFoldersTree,
  type DialFoldersTreeProps,
} from './components/FoldersTree/FoldersTree';
import {
  DialFileManagerNavigationPanel,
  type DialFileManagerNavigationPanelProps,
} from './components/FileManagerNavigationPanel/FileManagerNavigationPanel';
import { DialGrid, type DialGridProps } from '@/components/Grid/Grid';
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
  type DialFileManagerActionsRef,
  type DialFileAcceptType,
} from '@/models/file-manager';
import {
  IconCopy,
  IconDownload,
  IconExternalLink,
  IconFileDescription,
  IconPencilMinus,
  IconTrashX,
  IconUserX,
} from '@tabler/icons-react';
import CopyToIcon from '@/assets/icons/copy-to.svg?react';
import MoveToIcon from '@/assets/icons/move-to.svg?react';
import AddChild from '@/assets/icons/add-child.svg?react';
import AddSibling from '@/assets/icons/add-sibling.svg?react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { FileManagerProvider } from './FileManagerProvider';
import { useFileManagerContext } from './hooks/use-file-manager-context';
import type { FileManagerGridRow } from './FileManagerContext';
import { FileManagerDeleteConfirmationPopup } from './components/FileManagerDeleteConfirmationPopup/FileManagerDeleteConfirmationPopup';
import {
  DialDestinationFolderPopup,
  type DestinationFolderPopupProps,
} from './components/DestinationFolderPopup/DestinationFolderPopup';
import { useBulkActions } from './hooks/use-bulk-actions';
import { useGridContextMenu } from './hooks/use-grid-context-menu';
import type {
  FileUploadValidationResult,
  FileUploadValidationMessages,
} from '@/components/FileManager/hooks/use-file-upload';
import classNames from 'classnames';
import {
  DestinationFolderMode,
  DialFileManagerActions,
  FileManagerRenameTriggerView,
} from '@/types/file-manager';
import {
  ConflictResolutionPopup,
  type ConflictResolutionPopupProps,
} from '@/components/FileManager/components/ConflictResolutionPopup/ConflictResolutionPopup';
import { DialConditionalResizableContainer } from '@/components/ResizableContainer/ConditionalResizableContainer';
import type { RenameValidationMessages } from '@/components/FileManager/hooks/use-item-renaming';
import { useWidthBreakpoint } from '@/hooks/use-width-breakpoint';
import { useGridActionsColumn } from '@/components/FileManager/hooks/use-grid-actions-column';
import { FileManagerColumnKey } from '@/types/file-manager';
import { useTriggerViewRename } from '@/components/FileManager/hooks/use-trigger-view-rename';
import { FileMetadataPopup } from './components/FileMetadataPopup/FileMetadataPopup';
import IconUnshare from '@/assets/icons/unshare.svg?react';
import { DialNoDataContent } from '../NoDataContent/NoDataContent';
import { DropdownItemType } from '@/types/dropdown';
import {
  useFileManagerColumns,
  type FileManagerGridContext,
} from './hooks/use-file-manager-columns';
import { GridSelectionMode } from '@/models/selection-mode.ts';
import { DialTooltipContainer } from '@/components/Tooltip/TooltipContainer';
import { DialTooltipTrigger } from '@/components/Tooltip/TooltipTrigger';
import { DialTooltipContent } from '@/components/Tooltip/TooltipContent';

type GridRow = FileManagerGridRow;

export type DialFileManagerConflictResolutionPopupOptions = Omit<
  ConflictResolutionPopupProps,
  'open' | 'onClose' | 'onReplace' | 'onDuplicate' | 'conflictingFiles'
>;

export type DialFileManagerDestinationFolderPopupOptions = Pick<
  DestinationFolderPopupProps,
  | 'setDestinationFolderPath'
  | 'destinationFolderPath'
  | 'addFolderLabel'
  | 'copyLabel'
  | 'moveLabel'
  | 'hiddenFilesSwitcherLabel'
  | 'header'
  | 'onCreateFolder'
  | 'onCreateFolderValidate'
  | 'folderCreationValidationMessages'
  | 'disabledPathTooltip'
> & {
  getCopyHeader?: (itemsCount: number, itemName?: string) => string;
  getMoveHeader?: (itemsCount: number, itemName?: string) => string;
};

export interface FileMetadataPopupOptions {
  fileMetadata?: DialFile;
  loading?: boolean;
  clearMetadata?: () => void;
  header?: ReactNode;
  nameLabel?: string;
  pathLabel?: string;
  modifiedDateLabel?: string;
  sizeLabel?: string;
  authorLabel?: string;
}

export interface FileTreeOptions
  extends Omit<DialFoldersTreeProps, 'items' | 'selectedPath' | 'onItemClick'> {
  width?: number;
  header?: ReactNode;
  containerClassName?: string;
  additionalButtons?: ReactNode;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  expandedPaths?: Set<string>;
  loadedPaths?: Set<string>;
  onExpandedPathsChange?: (expandedPaths: Set<string>) => void;
  actionLabels?: {
    [DialFileManagerActions.AddSibling]?: string;
    [DialFileManagerActions.AddChild]?: string;
    [DialFileManagerActions.Duplicate]?: string;
    [DialFileManagerActions.Copy]?: string;
    [DialFileManagerActions.Rename]?: string;
    [DialFileManagerActions.Download]?: string;
    [DialFileManagerActions.Delete]?: string;
    [DialFileManagerActions.Move]?: string;
    [DialFileManagerActions.Unshare]?: string;
    [DialFileManagerActions.ManagePermissions]?: string;
    [DialFileManagerActions.RemoveAccess]?: string;
  };
}

export interface DeleteConfirmationOptions {
  cancelLabel?: string;
  titleRenderer?: (fileNames: string[]) => ReactNode;
  confirmLabel?: string;
  contentRenderer?: (fileNames: string[]) => ReactNode;
}

export type NavigationPanelOptions = Omit<
  DialFileManagerNavigationPanelProps,
  'path' | 'makeHref' | 'onItemClick'
>;

export interface GridOptions
  extends Omit<DialGridProps<GridRow>, 'rowData' | 'columnDefs'> {
  columnDefs?: (
    | ColDef<GridRow>
    | ((
        dateLocale: Intl.LocalesArgument,
        dateOptions: Intl.DateTimeFormatOptions | undefined,
        isCompactView: boolean,
      ) => ColDef<GridRow, unknown>)
  )[];
  filterable?: boolean;
  dateLocale?: Intl.LocalesArgument;
  dateOptions?: Intl.DateTimeFormatOptions;
  showFiles?: boolean;
  showFolders?: boolean;
  visibleColumns?: FileManagerColumnKey[];
  selectionMode?: GridSelectionMode;
  wrapCustomCellRenderers?: boolean;
  allowDisabledContextMenu?: boolean;
  actionLabels?: {
    [DialFileManagerActions.AddSibling]?: string;
    [DialFileManagerActions.AddChild]?: string;
    [DialFileManagerActions.Duplicate]?: string;
    [DialFileManagerActions.Copy]?: string;
    [DialFileManagerActions.Rename]?: string;
    [DialFileManagerActions.Download]?: string;
    [DialFileManagerActions.Delete]?: string;
    [DialFileManagerActions.Move]?: string;
    [DialFileManagerActions.Info]?: string;
    [DialFileManagerActions.Unshare]?: string;
    [DialFileManagerActions.ManagePermissions]?: string;
    [DialFileManagerActions.Preview]?: string;
    [DialFileManagerActions.RemoveAccess]?: string;
  };
}

export type NewAction = Pick<DropdownItem, 'label' | 'icon'>;

export type ToolbarOptions = Omit<
  DialFileManagerToolbarProps,
  'areHiddenFilesVisible' | 'onToggleHiddenFiles'
> & {
  newActions?: {
    uploadFiles?: NewAction;
    newFolder?: NewAction;
    uploadArchive?: NewAction;
  };
  showHiddenFilesToggle?: boolean;
};

export type BulkActionsToolbarOptions = Omit<
  DialFileManagerBulkActionsToolbarProps,
  'onClearSelection' | 'actions' | 'selectedCount'
> & {
  actionLabels?: {
    [DialFileManagerActions.Duplicate]?: string;
    [DialFileManagerActions.Copy]?: string;
    [DialFileManagerActions.Download]?: string;
    [DialFileManagerActions.Delete]?: string;
    [DialFileManagerActions.Move]?: string;
    [DialFileManagerActions.Unshare]?: string;
    [DialFileManagerActions.RemoveAccess]?: string;
  };
};

export interface CreateFolderValidationMessages {
  emptyName?: string;
  duplicateName?: string;
  forbiddenChars?: string;
}

export interface DialFileManagerProps {
  path?: string;
  defaultPath?: string;
  className?: string;
  managerLabel?: ReactNode;
  gridClassName?: string;

  allowedFileTypes?: DialFileAcceptType[];
  items?: DialFile[];
  rootItem?: DialRootFolder;
  filesLoading?: boolean;
  sharedByMePaths?: Set<string>;
  maxSelectableFileSize?: number;

  selectedPaths?: Set<string>;
  defaultSelectedPaths?: Set<string>;
  onSelectedPathsChange?: (paths: Set<string>) => void;

  showHiddenFiles?: boolean;
  onShowHiddenFilesChange?: (value: boolean) => void;

  treeOptions?: FileTreeOptions;
  toolbarOptions?: ToolbarOptions;

  showNavigationPanel?: boolean;
  navigationPanelOptions?: NavigationPanelOptions;

  gridOptions?: GridOptions;
  bulkActionsToolbarOptions?: BulkActionsToolbarOptions;
  deleteConfirmationOptions?: DeleteConfirmationOptions;
  destinationFolderPopupOptions?: DialFileManagerDestinationFolderPopupOptions;
  conflictResolutionPopupOptions?: DialFileManagerConflictResolutionPopupOptions;

  compactViewWidthBreakpoint?: number;
  customBreakpointRef?: RefObject<HTMLElement | null>;

  onPathChange?: (nextPath?: string) => void;
  onTableFileClick?: (file: GridRow) => void;
  handleSelectionClick?: (file: GridRow[]) => void;
  onGridApiChange?: (api: GridApi) => void;

  onCopyFiles?: (items: DialCopiedItem[], destinationFolder: string) => void;
  onMoveToFiles?: (
    items: DialCopiedItem[],
    sourceFolder: string,
    destinationFolder: string,
  ) => void;
  onDeleteFiles?: (items: DialDeletedItem[], sourceFolder: string) => void;
  onDownloadFiles?: (items: DialFile[]) => void;
  onAddSibling?: (items: DialFile[]) => void;
  onAddChild?: (items: DialFile[]) => void;

  onRenameValidate?: (value: string, item: DialFile) => string | null;
  renameValidationMessages?: RenameValidationMessages;

  onCreateFolder?: (
    file: DialUploadFileItem,
    folderPath: string,
    fileId: string,
  ) => void | Promise<void>;
  onCreateFolderValidate?: (
    name: string,
    parentFolder: DialFile,
  ) => string | null;
  folderCreationValidationMessages?: CreateFolderValidationMessages;
  getDisabledTooltip?: (row: DialFile) => string | undefined;
  fileTooLargeTooltip?: string;
  unsupportedFileTypeTooltip?: string;

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
  uploadEnabled?: boolean;

  fileMetadataPopupOptions?: FileMetadataPopupOptions;
  onGetInfo?: (file: DialFile) => void | Promise<void>;

  onUnshareFiles?: (files: DialFile[]) => void | Promise<void>;
  onRemoveFilesAccess?: (files: DialFile[]) => void | Promise<void>;
  actionsRef?: Ref<DialFileManagerActionsRef>;

  onSearchFiles?: (folder: string, query: string) => void;
  searchInProgress?: boolean;
  searchResults?: DialFile[];
  clearSearchResults?: () => void;

  emptyStateIcon?: ReactNode;
  emptyStateTitle?: string;
  emptyStateDescription?: string;

  sharedWithMeIds?: string[];
  onFolderPopupPathChange?: (newPath?: string) => void;
  onManagePermissions?: (path?: string) => void;
  onPreview?: (path?: string) => void;
  previewExtensions?: string[];
  isRenameFileAvailable?: boolean;
  customUploadFileAction?: (
    currentPath?: string,
    currentFolder?: DialFile,
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
 * @param [defaultPath] - Initial path used in uncontrolled mode (applied only on first render)
 * @param [className] - Additional classes for the root container
 * @param [gridClassName] - Additional classes for the grid container
 * @param [items] - Full hierarchical list of files and folders used by both tree and grid
 * @param [rootItem] - Optional root folder item to represent the top-level container in the tree
 * @param [filesLoading=false] - When true, shows skeleton loading state in the grid
 * @param [selectedPaths] - Controlled set of selected item paths
 * @param [defaultSelectedPaths] - Initial selected paths used in uncontrolled mode
 *
 * @param [treeOptions] - Options that configure the collapsible sidebar and folders tree
 * @param [showNavigationPanel] - Determines whether to display the navigation panel.
 * @param [navigationPanelOptions] - Options for the breadcrumb and search panel (value/onSearchChange for controlled search)
 * @param [toolbarOptions] - Options for the file manager toolbar
 * @param [gridOptions] - Options forwarded to `DialGrid`; supports `columnDefs` override and `filterable` flag and date locale/options
 * @param [bulkActionsToolbarOptions] - Options for the bulk actions toolbar shown when items are selected
 * @param [deleteConfirmationOptions] - Options for the delete confirmation popup
 *
 * @param [compactViewWidthBreakpoint=DEFAULT_COMPACT_VIEW_WIDTH_BREAKPOINT] - Width (px) below which the component switches to compact view.
 *
 * @param [onPathChange] - Callback fired when user navigates via tree or breadcrumb
 * @param [onSelectedPathsChange] - Callback fired when the selected paths change
 * @param [onTableFileClick] - Callback fired when a file row is clicked in the grid
 *
 * @param [onCopyFiles] - Callback fired when files copy-paste
 * @param [onMoveToFiles] - Callback fired when files cut-paste or rename
 * @param [onDeleteFiles] - Callback fired when files are deleted
 * @param [onAddSibling] -  Callback fired when when a new folder is added as a sibling to the selected folder
 * @param [onAddChild] - Callback fired when when a new folder is added as a child to the selected folder
 *
 * @param [onDownloadFiles] - Callback fired when files are downloaded
 *
 * @param [onUploadArchive] - Callback fired when archive files are uploaded
 * @param [onUploadFiles] - Callback fired when files are uploaded
 * @param [onValidateUpload] - Callback to validate files before upload
 * @param [maxFileSize] - Maximum allowed file size for uploads in bytes
 * @param [uploadValidationMessages] - Custom validation messages for file uploads
 * @param [uploadEnabled=true] - Whether files uploads are enabled
 *
 * @param [sharedByMePaths] - Set of items paths that the user has shared with others. Enables UI indicators (icons/badges) in the tree and grid.
 *
 * @param [actionsRef] - Ref exposing a limited set of imperative File Manager actions (e.g., creating a folder). Allows parent components to trigger internal behaviors programmatically. This ref is not a DOM ref and should be used only for invoking the component’s public actions API.
 *
 * @param [allowedFileTypes] - Allowed file types (same format as the HTML `<input accept>` attribute). Controls upload filtering and which items are disabled in the File Manager UI. Supports MIME types, wildcards (e.g. `image/*`), and extensions (e.g. `.svg`).
 *
 * @param [maxSelectableFileSize] - Maximum allowed file size for selection in bytes
 *
 * @param [emptyStateIcon] - Optional icon for empty state
 * @param [emptyStateTitle] - Optional title text displayed when there are no files.
 * @param [emptyStateDescription] - Optional description text displayed below the empty state title.
 *
 * @param [sharedWithMeIds] - Optional list of file IDs that are shared with the current user.
 * @param [unsupportedFileTypeTooltip] - Optional tooltip text displayed when an unsupported file type is selected.
 * @param [fileTooLargeTooltip] - Optional tooltip text displayed when a file is too large.
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
    managerLabel,
    className,
    items,
    rootItem,
    filesLoading,
    treeOptions,

    showNavigationPanel,
    navigationPanelOptions,

    gridOptions,
    toolbarOptions,
    bulkActionsToolbarOptions,
    deleteConfirmationOptions,
    destinationFolderPopupOptions,
    conflictResolutionPopupOptions,
    compactViewWidthBreakpoint = DEFAULT_COMPACT_VIEW_WIDTH_BREAKPOINT,
    customBreakpointRef,
    sharedByMePaths,
    allowedFileTypes,
    maxSelectableFileSize,

    areHiddenFilesVisible,
    toggleHiddenFilesVisibility,

    isTreeCollapsed,
    toggleTreeCollapse,

    currentPath,
    gridRows,

    selectedPaths,
    selectedFiles,
    clearSelection,
    setSelectedPaths: selectedPathsChangeHandler,

    effectiveSearchValue,
    handleBreadcrumbItemClick,
    handleSearchChange,
    handleTreeItemClick,
    handleTableRowClick,
    handleSelectionClick,
    onGridApiChange,

    handleOpenDestinationFolderPopup,
    handleCloseDestinationFolderPopup,
    openDestinationFolderPopup,
    destinationFolderMode,
    handleSetCopiedFiles,
    handleSetMovedFiles,
    handleDuplicate,
    handleCopyTo,
    handleMoveTo,
    handleAddSibling,
    handleAddChild,

    handleDownloadFiles,

    openDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDelete,
    deleteConfirmationOpen,
    itemsToDelete,
    renamedPath,
    renamedItem,
    onRename,
    onRenameSave,
    onRenameCancel,
    onRenameValidate,
    getDisplayName,
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
    isNewButtonDisabled,
    newFolderTempId,
    cancelFolderCreation,
    saveFolderCreation,
    validateFolderName,
    startFolderCreation,

    conflictingFiles,
    conflictResolutionOpen,
    handleConflictReplace,
    handleConflictDuplicate,
    handleConflictCancel,
    handleConflictDecideForEach,

    uploadConflictingFiles,
    uploadConflictResolutionOpen,
    handleUploadConflictReplace,
    handleUploadConflictDuplicate,
    handleUploadConflictCancel,
    handleUploadConflictDecideForEach,

    openMetadataPopup,
    fileMetadataPopupOptions,
    isMetadataPopupOpen,
    selectedFileForMetadata,
    closeMetadataPopup,

    onUnshareFiles,
    onRemoveFilesAccess,

    actionsRef,
    searchInProgress,
    isSearchMode,

    emptyStateIcon,
    emptyStateTitle = "You don't have any files",
    emptyStateDescription = 'Upload or drag and drop files',

    sharedWithMeIds,

    onFolderPopupPathChange,
    onManagePermissions,
    onPreview,
    previewExtensions,
    isRenameFileAvailable,
    getDisabledTooltip,
    fileTooLargeTooltip,
    unsupportedFileTypeTooltip,
    gridClassName,
  } = useFileManagerContext();

  const {
    width = sidebarWidth,
    header = sidebarTitleDefault,
    containerClassName = treeBaseClassName,
    additionalButtons,
    ...forwardedTreeProps
  } = treeOptions ?? {};

  const [sidebarCurrentWidth, setSidebarCurrentWidth] = useState(width);

  const { renameTriggerView, onGridRename, onTreeRename } =
    useTriggerViewRename({ onRename });

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
    selectionMode,
    wrapCustomCellRenderers,
    visibleColumns = DEFAULT_VISIBLE_COLUMN,
    allowDisabledContextMenu = false,
    ...forwardedGridOptions
  } = gridOptions ?? {};

  const { containerRef, isBelowBreakpoint: isCompactView } = useWidthBreakpoint(
    compactViewWidthBreakpoint,
    customBreakpointRef,
  );

  const effectiveVisibleColumns = useMemo(() => {
    return isSearchMode
      ? [
          FileManagerColumnKey.Name,
          FileManagerColumnKey.Path,
          FileManagerColumnKey.Actions,
        ]
      : visibleColumns;
  }, [isSearchMode, visibleColumns]);

  const getRowDisabledTooltip = useCallback(
    (
      row: FileManagerGridRow,
      allowedFileTypes?: DialFileAcceptType[],
      maxSelectableFileSize?: number,
    ) => {
      if (row.nodeType === DialFileNodeType.FOLDER) return undefined;

      const isFileSizeAccepted =
        !row.contentLength ||
        maxSelectableFileSize == null ||
        row.contentLength <= maxSelectableFileSize;
      const isFileTypeAccepted =
        !row.contentType ||
        isFileAccepted(allowedFileTypes, row.contentType, row.name);

      if (!isFileTypeAccepted) {
        const hasAllowedTypes =
          Array.isArray(allowedFileTypes) && allowedFileTypes.length > 0;
        const defaultUnsupportedMessage = hasAllowedTypes
          ? `Unsupported file type. Supported types: ${allowedFileTypes.join(', ')}.`
          : 'Unsupported file type.';
        return unsupportedFileTypeTooltip ?? defaultUnsupportedMessage;
      }
      if (!isFileSizeAccepted) {
        return (
          fileTooLargeTooltip ??
          `File is too large. Maximum size: ${formatBytes(maxSelectableFileSize!)}.`
        );
      }
      return undefined;
    },
    [fileTooLargeTooltip, unsupportedFileTypeTooltip],
  );

  const isRowDisabled = useCallback(
    (
      row: FileManagerGridRow,
      allowedFileTypes?: DialFileAcceptType[],
      maxSelectableFileSize?: number,
    ) => {
      return !!getRowDisabledTooltip(
        row,
        allowedFileTypes,
        maxSelectableFileSize,
      );
    },
    [getRowDisabledTooltip],
  );

  const disabledGridRowIds = useMemo(() => {
    const ids = new Set<string>();
    for (const row of gridRows) {
      if (isRowDisabled(row, allowedFileTypes, maxSelectableFileSize)) {
        ids.add(row.path);
      }
    }
    return ids;
  }, [allowedFileTypes, maxSelectableFileSize, gridRows, isRowDisabled]);

  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [hoveredRowRect, setHoveredRowRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setHoveredRowId(null);
      setHoveredRowRect(null);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const handleGridViewportMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rowTarget = (e.target as HTMLElement).closest(
        '.ag-row',
      ) as HTMLElement | null;
      if (!rowTarget) {
        if (hoveredRowId) setHoveredRowId(null);
        return;
      }
      const rowId = rowTarget.getAttribute('row-id');
      if (rowId && disabledGridRowIds.has(rowId)) {
        if (hoveredRowId !== rowId) {
          setHoveredRowId(rowId);
          setHoveredRowRect(rowTarget.getBoundingClientRect());
        }
      } else {
        if (hoveredRowId) setHoveredRowId(null);
      }
    },
    [hoveredRowId, disabledGridRowIds],
  );

  const handleGridViewportMouseLeave = useCallback(() => {
    setHoveredRowId(null);
    setHoveredRowRect(null);
  }, []);

  const hoveredRowFile = useMemo(() => {
    if (!hoveredRowId) return undefined;
    const file = gridRows.find((r) => r.path === hoveredRowId);
    return file ? (file as unknown as DialFile) : undefined;
  }, [hoveredRowId, gridRows]);

  const hoveredRowTooltipContent = useMemo(() => {
    if (!hoveredRowFile) return undefined;
    if (getDisabledTooltip) {
      return getDisabledTooltip(hoveredRowFile);
    }
    return getRowDisabledTooltip(
      hoveredRowFile as unknown as FileManagerGridRow,
      allowedFileTypes,
      maxSelectableFileSize,
    );
  }, [
    hoveredRowFile,
    getDisabledTooltip,
    getRowDisabledTooltip,
    allowedFileTypes,
    maxSelectableFileSize,
  ]);

  const getTreeContextMenuItems = useCallback(
    (file: DialFile): DropdownItem[] => {
      const items: DropdownItem[] = [];
      const elements: DropdownItem[] = [];
      const isRootNode = !file.parentPath;
      if (treeOptions?.actionLabels) {
        if (
          treeOptions.actionLabels[DialFileManagerActions.AddSibling] &&
          typeof handleAddSibling === 'function' &&
          file.nodeType === DialFileNodeType.FOLDER &&
          !isRootNode
        ) {
          items.push({
            key: 'addSibling',
            label: treeOptions.actionLabels[DialFileManagerActions.AddSibling],
            icon: (
              <AddSibling
                width={BASE_ICON_PROPS.size}
                height={BASE_ICON_PROPS.size}
                className="text-secondary"
              />
            ),
            onClick: () => handleAddSibling([file]),
          });
        }

        if (
          treeOptions.actionLabels[DialFileManagerActions.AddChild] &&
          typeof handleAddChild === 'function' &&
          file.nodeType === DialFileNodeType.FOLDER
        ) {
          items.push({
            key: 'addChild',
            label: treeOptions.actionLabels[DialFileManagerActions.AddChild],
            icon: (
              <AddChild
                width={BASE_ICON_PROPS.size}
                height={BASE_ICON_PROPS.size}
                className="text-secondary"
              />
            ),
            onClick: () => handleAddChild([file]),
          });
        }

        if (
          treeOptions.actionLabels[DialFileManagerActions.Duplicate] &&
          !isRootNode
        ) {
          elements.push({
            key: 'duplicate',
            label: treeOptions.actionLabels[DialFileManagerActions.Duplicate],
            icon: <IconCopy {...BASE_ICON_PROPS} className="text-secondary" />,
            onClick: () => handleDuplicate([file]),
          });
        }

        if (
          treeOptions.actionLabels[DialFileManagerActions.Copy] &&
          !isRootNode
        ) {
          elements.push({
            key: DestinationFolderMode.Copy,
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
              handleOpenDestinationFolderPopup(DestinationFolderMode.Copy);
            },
          });
        }
        if (
          treeOptions.actionLabels[DialFileManagerActions.Move] &&
          !isRootNode
        ) {
          elements.push({
            key: DestinationFolderMode.Move,
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
              handleOpenDestinationFolderPopup(DestinationFolderMode.Move);
            },
          });
        }
        if (
          treeOptions.actionLabels[DialFileManagerActions.Download] &&
          !isRootNode
        ) {
          elements.push({
            key: 'download',
            label: treeOptions.actionLabels[DialFileManagerActions.Download],
            icon: (
              <IconDownload {...BASE_ICON_PROPS} className="text-secondary" />
            ),
            onClick: () => handleDownloadFiles([file]),
          });
        }
        if (
          treeOptions.actionLabels[DialFileManagerActions.Rename] &&
          !isRootNode
        ) {
          elements.push({
            key: 'rename',
            label: treeOptions.actionLabels[DialFileManagerActions.Rename],
            icon: (
              <IconPencilMinus
                {...BASE_ICON_PROPS}
                className="text-secondary"
              />
            ),
            onClick: () => onTreeRename(file.path),
          });
        }
        if (
          treeOptions.actionLabels[DialFileManagerActions.Unshare] &&
          sharedWithMeIds?.includes(file.path) &&
          !isRootNode
        ) {
          elements.push({
            key: 'unshare',
            label: treeOptions.actionLabels[DialFileManagerActions.Unshare],
            icon: (
              <IconUnshare
                width={BASE_ICON_PROPS.size}
                height={BASE_ICON_PROPS.size}
                className="text-secondary"
              />
            ),
            onClick: () => onUnshareFiles?.([file]),
          });
        }
        if (
          treeOptions.actionLabels[DialFileManagerActions.RemoveAccess] &&
          sharedByMePaths?.has(file.path) &&
          !isRootNode
        ) {
          elements.push({
            key: DialFileManagerActions.RemoveAccess,
            label:
              treeOptions.actionLabels[DialFileManagerActions.RemoveAccess],
            icon: (
              <IconUserX
                size={BASE_ICON_PROPS.size}
                className="text-secondary"
              />
            ),
            onClick: () => onRemoveFilesAccess?.([file]),
          });
        }
        if (
          treeOptions.actionLabels[DialFileManagerActions.ManagePermissions] &&
          typeof onManagePermissions === 'function' &&
          file.nodeType === DialFileNodeType.FOLDER &&
          !isRootNode
        ) {
          elements.push({
            key: DialFileManagerActions.ManagePermissions,
            label:
              treeOptions.actionLabels[
                DialFileManagerActions.ManagePermissions
              ],
            icon: (
              <IconExternalLink
                {...BASE_ICON_PROPS}
                className="text-secondary"
              />
            ),
            onClick: () => onManagePermissions?.(file.path),
          });
        }
        if (
          treeOptions.actionLabels[DialFileManagerActions.Delete] &&
          file.permissions?.includes(DialFilePermission.WRITE) &&
          !isRootNode
        ) {
          elements.push({
            key: 'delete',
            label: treeOptions.actionLabels[DialFileManagerActions.Delete],
            icon: (
              <IconTrashX {...BASE_ICON_PROPS} className="text-secondary" />
            ),
            onClick: () =>
              openDeleteConfirmation([file], file.parentPath ?? ''),
          });
        }
      }
      if (!items.length) {
        return elements;
      }

      if (!elements.length) {
        return items;
      }

      return [
        ...items,
        {
          key: 'divider',
          type: DropdownItemType.Divider,
        },
        ...elements,
      ];
    },
    [
      treeOptions?.actionLabels,
      handleAddSibling,
      handleAddChild,
      handleDuplicate,
      handleSetCopiedFiles,
      handleOpenDestinationFolderPopup,
      handleSetMovedFiles,
      handleDownloadFiles,
      onTreeRename,
      onUnshareFiles,
      onRemoveFilesAccess,
      sharedWithMeIds,
      sharedByMePaths,
      openDeleteConfirmation,
      onManagePermissions,
    ],
  );

  const selectedGridRowsIds = useMemo(() => {
    const data = new Set<string>();
    selectedFiles.forEach((_file, id) => data.add(id));
    return data;
  }, [selectedFiles]);

  const handleSelectionChange = useCallback(
    (selectedRowsIds: Set<string>, selectedRows: GridRow[]) => {
      selectedPathsChangeHandler(selectedRowsIds);
      handleSelectionClick?.(selectedRows);
    },
    [handleSelectionClick, selectedPathsChangeHandler],
  );

  const bulkActions = useBulkActions({
    selectedFiles,
    actionLabels: bulkActionsToolbarOptions?.actionLabels,
    onDuplicate: handleDuplicate,
    onCopy: (files) => {
      handleSetCopiedFiles(files);
      handleOpenDestinationFolderPopup(DestinationFolderMode.Copy);
    },
    onMove: (files) => {
      handleSetMovedFiles(files);
      handleOpenDestinationFolderPopup(DestinationFolderMode.Move);
    },
    onDownload: handleDownloadFiles,
    onRename: onGridRename,
    onDelete: openDeleteConfirmation,
    onUnshare: onUnshareFiles,
    onRemoveAccess: onRemoveFilesAccess,
    getCurrentFolderPath: () => currentPath ?? '/',
    sharedWithMeIds,
    sharedByMePaths,
    onClearSelection: clearSelection,
  });

  const renderToolbar = useCallback(() => {
    if (toolbarOptions && selectedPaths.size === 0) {
      return (
        <div
          className={toolbarBaseClassName}
          role="toolbar"
          aria-label="File Manager Toolbar"
        >
          {managerLabel}
          <DialFileManagerToolbar
            {...toolbarOptions}
            areHiddenFilesVisible={areHiddenFilesVisible}
            onToggleHiddenFiles={toggleHiddenFilesVisibility}
            isNewButtonVisible={isNewButtonVisible}
            isNewButtonDisabled={isNewButtonDisabled}
            newButtonDropdownItems={newActions}
          />
        </div>
      );
    }

    if (selectedPaths.size > 0 && bulkActionsToolbarOptions) {
      return (
        <div
          className={toolbarBaseClassName}
          role="toolbar"
          aria-label="File Manager Toolbar"
        >
          <DialFileManagerBulkActionsToolbar
            {...bulkActionsToolbarOptions}
            selectedCount={selectedPaths.size}
            onClearSelection={clearSelection}
            actions={bulkActions}
          />
        </div>
      );
    }

    return null;
  }, [
    bulkActionsToolbarOptions,
    selectedPaths,
    clearSelection,
    bulkActions,
    areHiddenFilesVisible,
    toggleHiddenFilesVisibility,
    toolbarOptions,
    isNewButtonVisible,
    isNewButtonDisabled,
    newActions,
    managerLabel,
  ]);

  useImperativeHandle(
    actionsRef,
    () => ({
      createFolder: startFolderCreation,
    }),
    [startFolderCreation],
  );

  const renderFoldersTree = useCallback(() => {
    if (isCompactView) return null;

    return (
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
          enabled={!isTreeCollapsed}
        >
          <DialCollapsibleSidebar
            width={sidebarCurrentWidth}
            title={header}
            containerClassName={containerClassName}
            titleClassName="dial-body-text text-primary"
            additionalButtons={additionalButtons}
            isOpened={!isTreeCollapsed}
            onToggle={toggleTreeCollapse}
          >
            <DialFoldersTree
              {...forwardedTreeProps}
              items={items}
              rootItemPath={rootItem?.path}
              rootItemLabel={rootItem?.label}
              selectedPath={currentPath}
              sharedByMePaths={sharedByMePaths}
              onItemClick={handleTreeItemClick}
              areHiddenFilesVisible={areHiddenFilesVisible}
              getContextMenuItems={getTreeContextMenuItems}
              renamedPath={
                renameTriggerView === FileManagerRenameTriggerView.Tree
                  ? renamedPath
                  : undefined
              }
              onRenameSave={onRenameSave}
              onRenameCancel={onRenameCancel}
              onRenameValidate={onRenameValidate}
            />
          </DialCollapsibleSidebar>
        </DialConditionalResizableContainer>
      </aside>
    );
  }, [
    additionalButtons,
    areHiddenFilesVisible,
    containerClassName,
    currentPath,
    forwardedTreeProps,
    getTreeContextMenuItems,
    handleTreeItemClick,
    isCompactView,
    isTreeCollapsed,
    items,
    rootItem,
    onRenameCancel,
    onRenameSave,
    onRenameValidate,
    renameTriggerView,
    renamedPath,
    sidebarCurrentWidth,
    header,
    sharedByMePaths,
    toggleTreeCollapse,
  ]);

  const gridContextMenu = useGridContextMenu({
    actionLabels: gridOptions?.actionLabels,
    onDuplicate: (file) => handleDuplicate([file]),
    onCopy: (file) => {
      handleSetCopiedFiles([file]);
      handleOpenDestinationFolderPopup(DestinationFolderMode.Copy);
    },
    onMove: (file) => {
      handleSetMovedFiles([file]);
      handleOpenDestinationFolderPopup(DestinationFolderMode.Move);
    },
    onDownload: (file) => handleDownloadFiles([file]),
    onRename: onGridRename,
    onDelete: (file, parentFolderPath) =>
      openDeleteConfirmation([file], parentFolderPath),
    onInfo: (file) => openMetadataPopup(file),
    onUnshare: (file) => onUnshareFiles?.([file]),
    onRemoveAccess: (file) => onRemoveFilesAccess?.([file]),
    sharedWithMeIds,
    sharedByMePaths,
    onAddChild: (file) => handleAddChild?.([file]),
    onAddSibling: (file) => handleAddSibling?.([file]),
    onManagePermissions: (path) => onManagePermissions?.(path),
    onPreview: (path) => onPreview?.(path),
    previewExtensions,
    isRenameFileAvailable,
  });

  const getGridContextMenuItems = useCallback(
    (row: GridRow) => {
      const file = findNodeByPath(items, row.path);
      if (!file) return [];
      return gridContextMenu(file);
    },
    [items, gridContextMenu],
  );

  const isRowContextMenuDisabled = useCallback(
    (
      row: FileManagerGridRow,
      allowedFileTypes?: DialFileAcceptType[],
      maxSelectableFileSize?: number,
    ) => {
      return allowDisabledContextMenu
        ? false
        : isRowDisabled(row, allowedFileTypes, maxSelectableFileSize);
    },
    [allowDisabledContextMenu, isRowDisabled],
  );

  const { actionsColumnDef } = useGridActionsColumn({
    getContextMenuItems: getGridContextMenuItems,
    isRowDisabled: isRowContextMenuDisabled,
    allowedFileTypes: allowedFileTypes,
    buttonClassName: isCompactView ? '' : actionsColumnButtonClassName,
  });

  const { columnDefs } = useFileManagerColumns({
    userColumnDefs,
    filterable,
    dateLocale,
    dateOptions,
    effectiveVisibleColumns,
    isCompactView,
    hasActions: !!gridOptions?.actionLabels,
    actionsColumnDef,
    rootItemLabel: rootItem?.label,
    rootItemPath: rootItem?.path,
  });

  const cellClickHandler = useCallback(
    (event: CellClickedEvent<FileManagerGridRow>) => {
      if (
        event.colDef.colId === 'ag-Grid-SelectionColumn' ||
        event.colDef.colId === FileManagerColumnKey.Actions ||
        (renamedPath && event.data?.path === renamedPath) ||
        event.data?.isTemporary
      ) {
        return;
      }
      if (event.data) {
        handleTableRowClick(event.data);
      }
    },
    [renamedPath, handleTableRowClick],
  );

  const emptyStateRenderer = useCallback(
    () => (
      <DialNoDataContent
        title={emptyStateTitle}
        description={emptyStateDescription}
        descriptionClassName="text-sm"
        containerClassName="gap-3 size-full bg-layer-2 border rounded-[4px] border-primary"
        titleClassName="mt-2 !text-lg"
        icon={
          emptyStateIcon || (
            <IconFileDescription
              size={100}
              stroke={0.5}
              className="text-secondary"
            />
          )
        }
      />
    ),
    [emptyStateDescription, emptyStateIcon, emptyStateTitle],
  );

  return (
    <section
      ref={containerRef}
      className={mergeClasses(
        containerBaseClassName,
        {
          'gap-3 pt-4': bulkActionsToolbarOptions && selectedPaths.size > 0,
          'gap-4 p-3 pt-4': isCompactView,
          'gap-2 pt-2':
            isCompactView &&
            bulkActionsToolbarOptions &&
            selectedPaths.size > 0,
        },
        className,
      )}
    >
      {renderToolbar()}
      <div className={mergeClasses(mainGridClassName, gridClassName)}>
        {renderFoldersTree()}
        <div
          className={mergeClasses(contentGridClassName, {
            'gap-3': isCompactView,
          })}
        >
          {showNavigationPanel && (
            <DialFileManagerNavigationPanel
              {...(navigationPanelOptions ?? {})}
              makeHref={(segments) => segments.join('/')}
              path={currentPath}
              onItemClick={handleBreadcrumbItemClick}
              rootItemPath={rootItem?.path}
              rootItemLabel={rootItem?.label}
              value={effectiveSearchValue}
              onSearchChange={handleSearchChange}
              isCompactView={isCompactView}
              labelClassName="dial-tiny"
            />
          )}

          <section
            role="region"
            aria-label="File Manager Grid View"
            className={mergeClasses(gridBaseClassName)}
            onMouseMove={handleGridViewportMouseMove}
            onMouseLeave={handleGridViewportMouseLeave}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {gridRows.length === 0 && !isSearchMode && !filesLoading ? (
              emptyStateRenderer()
            ) : (
              <DialGrid<GridRow>
                columnDefs={columnDefs}
                rowData={gridRows}
                getRowId={(row) => row.path}
                loading={filesLoading || searchInProgress}
                getContextMenuItems={getGridContextMenuItems}
                withoutHeaderBorders={isCompactView}
                selectionOnHover={!isCompactView}
                onGridApiChange={onGridApiChange}
                className={classNames(
                  isDragging
                    ? 'border border-dashed border-accent-primary'
                    : '',
                  isDraggingOverWindow && !isDragging
                    ? 'border border-dashed border-primary'
                    : '',
                )}
                {...forwardedGridOptions}
                selectionMode={selectionMode}
                wrapCustomCellRenderers={wrapCustomCellRenderers}
                additionalGridOptions={{
                  ...forwardedGridOptions.additionalGridOptions,
                  defaultColDef: {
                    ...forwardedGridOptions.additionalGridOptions
                      ?.defaultColDef,
                  },
                  onCellClicked: cellClickHandler,
                  headerHeight: COMPACT_VIEW_HEADER_HEIGHT,
                  rowHeight: COMPACT_VIEW_HEADER_HEIGHT,
                  rowClass: 'group/grid-row',
                  ...(isCompactView
                    ? {
                        getRowHeight: (params) =>
                          params.data?.nodeType === DialFileNodeType.FOLDER
                            ? COMPACT_VIEW_HEADER_HEIGHT
                            : COMPACT_VIEW_FILE_ROW_HEIGHT,
                      }
                    : {}),
                  context: {
                    cancelFolderCreation,
                    saveFolderCreation,
                    getDisplayName,
                    onRenameCancel,
                    onRenameSave,
                    onRenameValidate,
                    renameTriggerView,
                    validateFolderName,
                    renamedItem,
                    renamedPath,
                    newFolderTempId,
                    sharedByMePaths,
                    selectedPaths,
                    disabledRowIds: disabledGridRowIds,
                  } as FileManagerGridContext,
                }}
                selectedRowIds={selectedGridRowsIds}
                onSelectionChange={handleSelectionChange}
                wrapperBorder={!isDragging && !isDraggingOverWindow}
                disabledRowIds={disabledGridRowIds}
                allowDisabledContextMenu={allowDisabledContextMenu}
              />
            )}
            {hoveredRowTooltipContent && hoveredRowRect && (
              <DialTooltipContainer open={true} placement="top">
                <DialTooltipTrigger asChild>
                  <div
                    className="fixed pointer-events-none z-[-1]"
                    style={{
                      top: hoveredRowRect.top,
                      left: hoveredRowRect.left,
                      width: hoveredRowRect.width,
                      height: hoveredRowRect.height,
                    }}
                  />
                </DialTooltipTrigger>
                <DialTooltipContent className="max-w-[300px] rounded border border-ui-outline-primary bg-ui-popover px-3 py-1.5 text-center text-primary shadow-md fill-ui-popover">
                  {hoveredRowTooltipContent}
                </DialTooltipContent>
              </DialTooltipContainer>
            )}
          </section>
        </div>
      </div>

      <FileManagerDeleteConfirmationPopup
        {...deleteConfirmationOptions}
        open={deleteConfirmationOpen}
        itemsToDelete={itemsToDelete}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDelete}
      />
      <DialDestinationFolderPopup
        {...destinationFolderPopupOptions}
        open={openDestinationFolderPopup}
        onClose={handleCloseDestinationFolderPopup}
        onConfirm={() => {
          const destinationPath =
            destinationFolderPopupOptions?.destinationFolderPath ?? '/';
          if (destinationFolderMode === DestinationFolderMode.Copy) {
            handleCopyTo(destinationPath);
          } else {
            handleMoveTo(destinationPath);
          }
          handleCloseDestinationFolderPopup();
        }}
        mode={destinationFolderMode}
        items={items}
        rootItem={rootItem}
        gridOptions={{
          columnDefs: columnDefs.filter(
            (col) => col.colId !== FileManagerColumnKey.Actions,
          ),
          loading: filesLoading,
        }}
        onUploadFiles={onUploadFiles}
        onValidateUpload={onValidateUpload}
        maxFileSize={maxFileSize}
        path={
          destinationFolderPopupOptions?.destinationFolderPath ??
          destinationFolderPopupOptions?.sourceFolder ??
          currentPath
        }
        onPathChange={(newPath) => {
          destinationFolderPopupOptions?.setDestinationFolderPath?.(newPath);
        }}
        sourceFolder={
          destinationFolderPopupOptions?.sourceFolder ?? currentPath
        }
        treeOptions={{ header: treeOptions?.header }}
        onFolderPopupPathChange={onFolderPopupPathChange}
      />
      <ConflictResolutionPopup
        {...conflictResolutionPopupOptions}
        open={conflictResolutionOpen}
        onClose={handleConflictCancel}
        onReplace={handleConflictReplace}
        onDuplicate={handleConflictDuplicate}
        onDecideForEach={handleConflictDecideForEach}
        conflictingFiles={conflictingFiles}
      />

      <ConflictResolutionPopup
        {...conflictResolutionPopupOptions}
        open={uploadConflictResolutionOpen}
        onClose={handleUploadConflictCancel}
        onReplace={handleUploadConflictReplace}
        onDuplicate={handleUploadConflictDuplicate}
        onDecideForEach={handleUploadConflictDecideForEach}
        conflictingFiles={uploadConflictingFiles}
      />

      <FileMetadataPopup
        open={isMetadataPopupOpen}
        onClose={closeMetadataPopup}
        fileMetadata={
          fileMetadataPopupOptions?.fileMetadata ?? selectedFileForMetadata
        }
        loading={fileMetadataPopupOptions?.loading}
        header={fileMetadataPopupOptions?.header}
        nameLabel={fileMetadataPopupOptions?.nameLabel}
        pathLabel={fileMetadataPopupOptions?.pathLabel}
        modifiedDateLabel={fileMetadataPopupOptions?.modifiedDateLabel}
        sizeLabel={fileMetadataPopupOptions?.sizeLabel}
        authorLabel={fileMetadataPopupOptions?.authorLabel}
        dateLocale={gridOptions?.dateLocale}
        dateOptions={gridOptions?.dateOptions}
      />
    </section>
  );
};
