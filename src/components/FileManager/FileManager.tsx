import {
  IconCopy,
  IconDownload,
  IconExternalLink,
  IconFileDescription,
  IconPencilMinus,
  IconTrashX,
  IconUserX,
} from '@tabler/icons-react';
import type {
  GridOptions as AgGridOptions,
  CellClickedEvent,
  ColDef,
  GridApi,
} from 'ag-grid-community';
import classNames from 'classnames';
import {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';

import AddChild from '@/assets/icons/add-child.svg?react';
import AddSibling from '@/assets/icons/add-sibling.svg?react';
import CopyToIcon from '@/assets/icons/copy-to.svg?react';
import MoveToIcon from '@/assets/icons/move-to.svg?react';
import IconUnshare from '@/assets/icons/unshare.svg?react';
import { DialCollapsibleSidebar } from '@/components/CollapsibleSidebar/CollapsibleSidebar';
import {
  ConflictResolutionPopup,
  type ConflictResolutionPopupProps,
} from '@/components/FileManager/components/ConflictResolutionPopup/ConflictResolutionPopup';
import type {
  FileUploadValidationMessages,
  FileUploadValidationResult,
} from '@/components/FileManager/hooks/use-file-upload';
import { useGridActionsColumn } from '@/components/FileManager/hooks/use-grid-actions-column';
import type { RenameValidationMessages } from '@/components/FileManager/hooks/use-item-renaming';
import { useTriggerViewRename } from '@/components/FileManager/hooks/use-trigger-view-rename';
import { DialGrid, type DialGridProps } from '@/components/Grid/Grid';
import { DialConditionalResizableContainer } from '@/components/ResizableContainer/ConditionalResizableContainer';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { useWidthBreakpoint } from '@/hooks/use-width-breakpoint';
import type { DropdownItem } from '@/models/dropdown';
import type { DialFile, DialRootFolder } from '@/models/file';
import { DialFileNodeType, DialFilePermission } from '@/models/file';
import {
  type DialCopiedItem,
  type DialDeletedItem,
  type DialFileAcceptType,
  type DialFileManagerActionsRef,
  type DialUploadFileItem,
} from '@/models/file-manager';
import { GridSelectionMode } from '@/models/selection-mode.ts';
import { DropdownItemType } from '@/types/dropdown';
import {
  DestinationFolderMode,
  DialFileManagerActions,
  DialFileManagerTabs,
  FileManagerColumnKey,
  FileManagerRenameTriggerView,
  FileManagerCreateFolderTriggerView,
} from '@/types/file-manager';
import { mergeClasses } from '@/utils/merge-classes';
import { DialNoDataContent } from '../NoDataContent/NoDataContent';
import type { FileManagerGridRow } from './FileManagerContext';
import { FileManagerProvider } from './FileManagerProvider';
import { FileManagerTooltip } from './FileManagerTooltip';
import {
  DialDestinationFolderPopup,
  type DestinationFolderPopupProps,
} from './components/DestinationFolderPopup/DestinationFolderPopup';
import {
  DialFileManagerBulkActionsToolbar,
  type DialFileManagerBulkActionsToolbarProps,
} from './components/FileManagerBulkActionsToolbar/FileManagerBulkActionsToolbar';
import { FileManagerDeleteConfirmationPopup } from './components/FileManagerDeleteConfirmationPopup/FileManagerDeleteConfirmationPopup';
import {
  DialFileManagerNavigationPanel,
  type DialFileManagerNavigationPanelProps,
} from './components/FileManagerNavigationPanel/FileManagerNavigationPanel';
import {
  DialFileManagerToolbar,
  type DialFileManagerToolbarProps,
} from './components/FileManagerToolbar/DialFileManagerToolbar';
import { FileMetadataPopup } from './components/FileMetadataPopup/FileMetadataPopup';
import {
  DialFoldersTree,
  type DialFoldersTreeProps,
} from './components/FoldersTree/FoldersTree';
import {
  actionsColumnButtonClassName,
  COMPACT_VIEW_HEADER_HEIGHT,
  containerBaseClassName,
  contentGridClassName,
  DEFAULT_COMPACT_VIEW_WIDTH_BREAKPOINT,
  DEFAULT_VISIBLE_COLUMN,
  FOLDERS_TREE_PANEL_MAX_WIDTH,
  FOLDERS_TREE_PANEL_MIN_WIDTH,
  gridBaseClassName,
  mainGridClassName,
  sidebarTitleDefault,
  sidebarWidth,
  toolbarBaseClassName,
  treeBaseClassName,
} from './constants';
import { useBulkActions } from './hooks/use-bulk-actions';
import {
  useFileManagerColumns,
  type FileManagerGridContext,
} from './hooks/use-file-manager-columns';
import { useFileManagerContext } from './hooks/use-file-manager-context';
import { useGridContextMenu } from './hooks/use-grid-context-menu';
import { findNodeByPath, getRowTooltip } from './utils';
import { useTriggerViewCreateFolder } from './hooks/use-trigger-view-create-folder';

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
  | 'emptyStateTitle'
  | 'emptyStateDescription'
> & {
  getCopyHeader?: (itemsCount: number, itemName?: string) => string;
  getMoveHeader?: (itemsCount: number, itemName?: string) => string;
  processDestinationFolderPath?: (path: string) => string;
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

export interface FileTreeOptions extends Omit<
  DialFoldersTreeProps,
  'items' | 'selectedPath' | 'onItemClick'
> {
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

export interface GridOptions extends Omit<
  DialGridProps<GridRow>,
  'rowData' | 'columnDefs'
> {
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
    newItem?: NewAction;
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

  onRenameValidate?: (value: string, item: DialFile) => string | null;
  renameValidationMessages?: RenameValidationMessages;
  forbiddenSymbolsRegExp?: RegExp;
  forbiddenSymbolsTooltip?: ReactNode;

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
  getDisabledTooltip?: (row: FileManagerGridRow) => string | undefined;
  fileTooLargeTooltip?: string;
  unsupportedFileTypeTooltip?: string;

  onUploadFiles?: (
    files: DialUploadFileItem[],
    destinationFolder: string,
  ) => void;
  prepareUploadFileName?: (name: string) => string;
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
  onOpenInNewTab?: (file: DialFile) => void;
  previewExtensions?: string[];
  isRenameFileAvailable?: boolean;
  isDuplicateFolderAvailable?: boolean;
  customUploadFileAction?: (
    currentPath?: string,
    currentFolder?: DialFile,
  ) => void;
  customCreateNewItemAction?: (
    currentPath?: string,
    currentFolder?: DialFile,
  ) => void;
  customDuplicateAction?: (items?: DialFile[]) => void;
  customDeleteItemsAction?: (
    items: DialFile[],
    parentFolderPath: string,
  ) => void;
  customDownloadItemsAction?: (items?: DialFile[]) => void;
  nonClickableTableColumns?: FileManagerColumnKey[];
  hideSearchPathItemName?: boolean;
  showHiddenFileSwitcherInDestinationPopup?: boolean;
  showCreateFolderButtonInDestinationPopup?: boolean;
  autoSelectUploadedItems?: boolean;
  maxNewFolderDepth?: number;
  onNewFolderDepthExceeded?: () => void;
  initialUploadFilesOpen?: boolean;
}

/**
 * File Manager layout with a collapsible folders tree, breadcrumb/search header, and a data grid.
 * aliases: FileExplorer|FileBrowser
 * Design system 1.0
 *
 * @deprecated Import `DialFileManager` from `@epam/ai-dial-react-file-manager` instead.
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
 *
 * @param [onRenameValidate] - Optional callback to validate a file or folder name during renaming. Should return an error message string if the name is invalid, or null if it's valid.
 * @param [renameValidationMessages] - Optional custom validation messages for renaming files and folders. Note that you need to add `${NotificationVariant.Warning}__` prefix to the `hiddenItemWarning` message to display it as a warning with the warning icon.
 * @param [forbiddenSymbolsRegExp] - Optional RegExp will be used in the validation for the files and folders names. The "g" and "y" flags are not allowed in this RegExp and will be ignored.
 * @param [forbiddenSymbolsTooltip] - Optional tooltip displayed when a file or folder name contains forbidden characters
 *
 * @param [onDownloadFiles] - Callback fired when files are downloaded
 *
 * @param [onUploadArchive] - Callback fired when archive files are uploaded
 * @param [onUploadFiles] - Callback fired when files are uploaded
 * @param [prepareUploadFileName] - Optional mapper applied to each uploaded item's name before conflict resolution runs and before `onUploadFiles`/`onUploadArchive` are called. Use it to sanitize or normalize names (e.g. stripping forbidden symbols). Conflict detection is performed against the mapped names, so renames take place before the conflict check.
 * @param [onValidateUpload] - Callback to validate files before upload
 * @param [maxFileSize] - Maximum allowed file size for uploads in bytes
 * @param [uploadValidationMessages] - Custom validation messages for file uploads. Consumers can customize these strings for a11y and copy consistency.
 * @param [uploadEnabled=true] - Whether files uploads are enabled
 * @param [autoSelectUploadedItems=false] - When true, automatically selects newly uploaded or created items (files, archives, folders) after they appear in the current directory. Useful in attach flows where the user expects immediate selection feedback.
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
    handleGridAddSibling,
    handleGridAddChild,
    handleTreeAddSibling,
    handleTreeAddChild,

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
    createdFolderPath,
    forbiddenSymbolsRegExp,
    forbiddenSymbolsTooltip,
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
    onOpenInNewTab,
    previewExtensions,
    isRenameFileAvailable,
    isDuplicateFolderAvailable,
    getDisabledTooltip,
    fileTooLargeTooltip,
    unsupportedFileTypeTooltip,
    gridClassName,
    nonClickableTableColumns,
    hideSearchPathItemName,
    showHiddenFileSwitcherInDestinationPopup,
    showCreateFolderButtonInDestinationPopup,
    newFolderDefaultName,
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

  const {
    createFolderTriggerView,
    onGridCreateSiblingFolder,
    onTreeCreateSiblingFolder,
    onGridCreateChildFolder,
    onTreeCreateChildFolder,
  } = useTriggerViewCreateFolder({
    onGridAddSibling: handleGridAddSibling,
    onGridAddChild: handleGridAddChild,
    onTreeAddSibling: handleTreeAddSibling,
    onTreeAddChild: handleTreeAddChild,
  });

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
      file: FileManagerGridRow,
      allowedFileTypes?: DialFileAcceptType[],
      maxSelectableFileSize?: number,
    ) => {
      return getRowTooltip(
        file,
        allowedFileTypes,
        maxSelectableFileSize,
        unsupportedFileTypeTooltip,
        fileTooLargeTooltip,
      );
    },
    [fileTooLargeTooltip, unsupportedFileTypeTooltip],
  );

  const isRowDisabled = useCallback(
    (
      row: FileManagerGridRow,
      allowedFileTypes?: DialFileAcceptType[],
      maxSelectableFileSize?: number,
    ) => {
      return (
        !!getDisabledTooltip?.(row) ||
        !!getRowDisabledTooltip(row, allowedFileTypes, maxSelectableFileSize)
      );
    },
    [getRowDisabledTooltip, getDisabledTooltip],
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

  const getTreeContextMenuItems = useCallback(
    (file: DialFile): DropdownItem[] => {
      const items: DropdownItem[] = [];
      const elements: DropdownItem[] = [];
      const isRootNode = !file.parentPath;
      const hasRestrictedSymbolsInName = forbiddenSymbolsRegExp?.test(
        file.name,
      );
      if (treeOptions?.actionLabels) {
        if (
          treeOptions.actionLabels[DialFileManagerActions.AddSibling] &&
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
            onClick: () => onTreeCreateSiblingFolder([file]),
          });
        }

        if (
          treeOptions.actionLabels[DialFileManagerActions.AddChild] &&
          file.nodeType === DialFileNodeType.FOLDER &&
          !hasRestrictedSymbolsInName
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
            onClick: () => onTreeCreateChildFolder([file]),
          });
        }

        if (
          treeOptions.actionLabels[DialFileManagerActions.Duplicate] &&
          !isRootNode &&
          !hasRestrictedSymbolsInName
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
          !isRootNode &&
          !hasRestrictedSymbolsInName
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
          !isRootNode &&
          !hasRestrictedSymbolsInName
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
          !isRootNode &&
          !hasRestrictedSymbolsInName
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
      }
      if (!items.length) {
        return elements;
      }

      if (elements.length === 0) return items;
      if (items.length === 0) return elements;

      return [
        ...items,
        { key: 'divider', type: DropdownItemType.Divider },
        ...elements,
      ];
    },
    [
      treeOptions?.actionLabels,
      forbiddenSymbolsRegExp,
      onManagePermissions,
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
      onTreeCreateChildFolder,
      onTreeCreateSiblingFolder,
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
    forbiddenSymbolsRegExp,
  });

  const handleToolbarTabChange = useCallback(
    (id: DialFileManagerTabs) => {
      toolbarOptions?.onTabChange?.(id);
      cancelFolderCreation();
    },
    [toolbarOptions, cancelFolderCreation],
  );

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
            onTabChange={handleToolbarTabChange}
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
    handleToolbarTabChange,
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
              forbiddenSymbolsRegExp={forbiddenSymbolsRegExp}
              forbiddenSymbolsTooltip={forbiddenSymbolsTooltip}
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
              createdFolderPath={
                createFolderTriggerView ===
                FileManagerCreateFolderTriggerView.Tree
                  ? createdFolderPath
                  : null
              }
              onCreateFolderCancel={cancelFolderCreation}
              onCreateFolderSave={saveFolderCreation}
              newFolderDefaultName={newFolderDefaultName}
            />
          </DialCollapsibleSidebar>
        </DialConditionalResizableContainer>
      </aside>
    );
  }, [
    isCompactView,
    sidebarCurrentWidth,
    isTreeCollapsed,
    header,
    containerClassName,
    additionalButtons,
    toggleTreeCollapse,
    forwardedTreeProps,
    items,
    rootItem?.path,
    rootItem?.label,
    currentPath,
    sharedByMePaths,
    forbiddenSymbolsRegExp,
    forbiddenSymbolsTooltip,
    handleTreeItemClick,
    areHiddenFilesVisible,
    getTreeContextMenuItems,
    renameTriggerView,
    createFolderTriggerView,
    renamedPath,
    onRenameSave,
    onRenameCancel,
    onRenameValidate,
    createdFolderPath,
    cancelFolderCreation,
    saveFolderCreation,
    newFolderDefaultName,
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
    onManagePermissions: (path) => onManagePermissions?.(path),
    onPreview: (path) => onPreview?.(path),
    onOpenInNewTab: (file) => onOpenInNewTab?.(file),
    previewExtensions,
    isRenameFileAvailable,
    isDuplicateFolderAvailable,
    forbiddenSymbolsRegExp,
    onGridCreateSiblingFolder,
    onGridCreateChildFolder,
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
        event.data?.isTemporary ||
        (nonClickableTableColumns &&
          nonClickableTableColumns.includes(
            event.colDef.colId as FileManagerColumnKey,
          ))
      ) {
        return;
      }
      if (event.data) {
        handleTableRowClick(event.data);
      }
    },
    [renamedPath, handleTableRowClick, nonClickableTableColumns],
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

  const gridRowIdGetter = useMemo(() => {
    return (row: GridRow) => row.path;
  }, []);

  const dialGridClassName = useMemo(
    () =>
      classNames(
        'min-h-[248px] overflow-auto md:min-h-[266px]',
        isDragging ? 'border border-dashed border-accent-primary' : '',
        isDraggingOverWindow && !isDragging
          ? 'border border-dashed border-primary'
          : '',
      ),
    [isDragging, isDraggingOverWindow],
  );

  const gridAdditionalOptions = useMemo<AgGridOptions<GridRow>>(
    () => ({
      ...forwardedGridOptions.additionalGridOptions,
      onCellClicked: cellClickHandler,
      headerHeight: COMPACT_VIEW_HEADER_HEIGHT,
      rowHeight: COMPACT_VIEW_HEADER_HEIGHT,
      rowClass: 'group/grid-row',
      defaultColDef: {
        ...forwardedGridOptions.additionalGridOptions?.defaultColDef,
        floatingFilter: navigationPanelOptions?.searchable
          ? false
          : forwardedGridOptions.additionalGridOptions?.defaultColDef
              ?.floatingFilter,
      },
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
        createdFolderPath,
        newFolderTempId,
        sharedByMePaths,
        selectedPaths,
        disabledRowIds: disabledGridRowIds,
        forbiddenSymbolsRegExp,
        forbiddenSymbolsTooltip,
        hideSearchPathItemName,
        newFolderDefaultName,
        filesLoading,
      } as FileManagerGridContext,
    }),
    [
      forwardedGridOptions.additionalGridOptions,
      cellClickHandler,
      navigationPanelOptions?.searchable,
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
      createdFolderPath,
      newFolderTempId,
      sharedByMePaths,
      selectedPaths,
      disabledGridRowIds,
      forbiddenSymbolsRegExp,
      forbiddenSymbolsTooltip,
      hideSearchPathItemName,
      newFolderDefaultName,
      filesLoading,
    ],
  );

  // Memoize grid content to prevent re-renders when tooltip state changes
  const memoizedGridContent = useMemo(
    () =>
      gridRows.length === 0 && !isSearchMode && !filesLoading ? (
        emptyStateRenderer()
      ) : (
        <DialGrid<GridRow>
          columnDefs={columnDefs}
          rowData={gridRows}
          getRowId={gridRowIdGetter}
          loading={filesLoading || searchInProgress}
          getContextMenuItems={getGridContextMenuItems}
          withoutHeaderBorders={isCompactView}
          onGridApiChange={onGridApiChange}
          className={dialGridClassName}
          {...forwardedGridOptions}
          selectionMode={selectionMode}
          wrapCustomCellRenderers={wrapCustomCellRenderers}
          additionalGridOptions={gridAdditionalOptions}
          selectedRowIds={selectedGridRowsIds}
          onSelectionChange={handleSelectionChange}
          wrapperBorder={!isDragging && !isDraggingOverWindow}
          disabledRowIds={disabledGridRowIds}
          allowDisabledContextMenu={allowDisabledContextMenu}
        />
      ),
    [
      gridRows,
      isSearchMode,
      filesLoading,
      emptyStateRenderer,
      columnDefs,
      gridRowIdGetter,
      searchInProgress,
      getGridContextMenuItems,
      isCompactView,
      onGridApiChange,
      dialGridClassName,
      forwardedGridOptions,
      selectionMode,
      wrapCustomCellRenderers,
      gridAdditionalOptions,
      selectedGridRowsIds,
      handleSelectionChange,
      isDragging,
      isDraggingOverWindow,
      disabledGridRowIds,
      allowDisabledContextMenu,
    ],
  );

  return (
    <section ref={containerRef} className="size-full">
      <div
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
                labelClassName="dial-tiny-text"
              />
            )}

            <section
              role="region"
              aria-label="File Manager Grid View"
              className={mergeClasses(gridBaseClassName, 'relative')}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {memoizedGridContent}
              <FileManagerTooltip
                disabledGridRowIds={disabledGridRowIds}
                gridRows={gridRows}
                getDisabledTooltip={getDisabledTooltip}
                getRowDisabledTooltip={getRowDisabledTooltip}
                allowedFileTypes={allowedFileTypes}
                maxSelectableFileSize={maxSelectableFileSize}
              />
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
          showHiddenFileSwitcher={showHiddenFileSwitcherInDestinationPopup}
          showCreateFolderButton={showCreateFolderButtonInDestinationPopup}
          hideSearchPathItemName={hideSearchPathItemName}
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
      </div>
    </section>
  );
};
