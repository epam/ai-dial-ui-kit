import {
  createContext,
  type DragEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import type { DialFile, DialRootFolder } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import type {
  FileTreeOptions,
  NavigationPanelOptions,
  GridOptions,
  ToolbarOptions,
  BulkActionsToolbarOptions,
  DialFileManagerProps,
  DeleteConfirmationOptions,
  DialFileManagerDestinationFolderPopupOptions,
  DialFileManagerConflictResolutionPopupOptions,
  FileMetadataPopupOptions,
} from './FileManager';
import type { FileUploadValidationMessages } from './hooks/use-file-upload';
import type { DropdownItem } from '@/models/dropdown';
import type { FileConflictDecision } from './components/ConflictResolutionPopup/ConflictResolutionPopup';
import type {
  DestinationFolderMode,
  FileManagerColumnKey,
} from '@/types/file-manager';
import type {
  DialFileAcceptType,
  DialFileManagerActionsRef,
} from '@/models/file-manager';
import type { GridApi } from 'ag-grid-community';

export interface FileManagerGridRow {
  id: string;
  name: string;
  updatedAt?: string;
  size?: number;
  author?: string;
  path: string;
  parentPath?: string | null;
  nodeType: DialFileNodeType;
  extension?: string;
  isTemporary?: boolean;
  owner?: string;
  contentType?: string;
  contentLength?: number;
  folderId?: string;
}

export interface FileManagerContextValue {
  managerLabel?: ReactNode;
  className?: string;
  gridClassName?: string;
  items: DialFile[];
  rootItem?: DialRootFolder;
  allowedFileTypes?: DialFileAcceptType[];
  maxSelectableFileSize?: number;
  filesLoading?: boolean;
  treeOptions?: FileTreeOptions;
  showNavigationPanel?: boolean;
  navigationPanelOptions?: NavigationPanelOptions;
  gridOptions?: GridOptions;
  toolbarOptions?: ToolbarOptions;
  bulkActionsToolbarOptions?: BulkActionsToolbarOptions;
  deleteConfirmationOptions?: DeleteConfirmationOptions;
  destinationFolderPopupOptions?: DialFileManagerDestinationFolderPopupOptions & {
    sourceFolder?: string;
  };
  conflictResolutionPopupOptions?: DialFileManagerConflictResolutionPopupOptions;
  fileMetadataPopupOptions?: FileMetadataPopupOptions;

  compactViewWidthBreakpoint?: number;
  customBreakpointRef?: RefObject<HTMLElement | null>;

  currentPath?: string;
  setCurrentPath: (p?: string) => void;

  searchValue: string;
  effectiveSearchValue: string;
  setSearchValue: (v: string) => void;

  areHiddenFilesVisible: boolean;
  toggleHiddenFilesVisibility: () => void;

  isTreeCollapsed: boolean;
  toggleTreeCollapse: () => void;
  setIsTreeCollapsed: (value: boolean) => void;

  selectedPaths: Set<string>;
  selectedFiles: Map<string, DialFile>;
  setSelectedPaths: (paths: Set<string>) => void;
  clearSelection: () => void;

  currentFolder?: DialFile;
  gridRows: FileManagerGridRow[];

  handleCopyTo: (destinationFolder: string) => void;
  handleMoveTo: (destinationFolder: string, sourceFolder?: string) => void;
  handleDuplicate: (files: DialFile[]) => void;
  handleOpenDestinationFolderPopup: (mode: DestinationFolderMode) => void;
  handleCloseDestinationFolderPopup: () => void;
  openDestinationFolderPopup: boolean;
  destinationFolderMode: DestinationFolderMode;
  handleSetCopiedFiles: (files: DialFile[]) => void;
  handleSetMovedFiles: (files: DialFile[]) => void;
  handleGridAddSibling?: (files: DialFile[]) => void;
  handleGridAddChild?: (files: DialFile[]) => void;
  handleTreeAddSibling?: (files: DialFile[]) => void;
  handleTreeAddChild?: (files: DialFile[]) => void;

  renamedPath?: string;
  renamedItem?: DialFile;
  createdFolderPath?: string | null;
  onRename: (file: string) => void;
  onRenameSave: (value: string) => void;
  onRenameCancel: () => void;
  onRenameValidate: (value: string, item: DialFile) => string | null;
  getDisplayName: (item: DialFile) => string;
  forbiddenSymbolsRegExp?: RegExp;
  forbiddenSymbolsTooltip?: ReactNode;

  openDeleteConfirmation: (items: DialFile[], parentFolderPath: string) => void;
  closeDeleteConfirmation: () => void;
  confirmDelete: () => void;
  deleteConfirmationOpen: boolean;
  itemsToDelete: DialFile[];

  handlePathChange: (nextPath?: string) => void;
  handleTreeItemClick: (item: DialFile) => void;
  handleBreadcrumbItemClick: (href?: string) => void;
  handleSearchChange: (value?: string) => void;
  handleTableRowClick: (row: FileManagerGridRow) => void;
  handleSelectionClick?: (row: FileManagerGridRow[]) => void;

  onTableFileClick?: DialFileManagerProps['onTableFileClick'];
  handleDownloadFiles: (items: DialFile[]) => void;
  onGridApiChange?: (api: GridApi) => void;

  isDragging: boolean;
  isDraggingOverWindow: boolean;
  uploadError?: string;
  handleDragEnter: (e: DragEvent) => void;
  handleDragLeave: (e: DragEvent) => void;
  handleDragOver: (e: DragEvent) => void;
  handleDrop: (e: DragEvent) => void;
  clearUploadError: () => void;

  onUploadFiles?: DialFileManagerProps['onUploadFiles'];
  onValidateUpload?: DialFileManagerProps['onValidateUpload'];
  maxFileSize?: number;
  uploadValidationMessages?: FileUploadValidationMessages;

  newActions: DropdownItem[];
  isNewButtonVisible: boolean;
  isNewButtonDisabled: boolean;

  openFileDialog: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;

  isCreatingFolder: boolean;
  newFolderTempId: string | null;
  newFolderDefaultName: string;
  startFolderCreation: () => void;
  cancelFolderCreation: () => void;
  saveFolderCreation: (name: string) => Promise<void>;
  validateFolderName: (name: string) => string | null;

  conflictingFiles: DialFile[];
  conflictResolutionOpen: boolean;
  closeConflictResolution: () => void;
  handleConflictReplace: () => void;
  handleConflictCancel: () => void;
  handleConflictDuplicate: () => void;
  handleConflictDecideForEach: (decisions: FileConflictDecision[]) => void;

  uploadConflictingFiles: DialFile[];
  uploadConflictResolutionOpen: boolean;
  closeUploadConflictResolution: () => void;
  handleUploadConflictReplace: () => void;
  handleUploadConflictCancel: () => void;
  handleUploadConflictDuplicate: () => void;
  handleUploadConflictDecideForEach: (
    decisions: FileConflictDecision[],
  ) => void;

  isMetadataPopupOpen: boolean;
  selectedFileForMetadata?: DialFile;
  openMetadataPopup: (file: DialFile) => void;
  closeMetadataPopup: () => void;
  onGetInfo?: (file: DialFile) => void | Promise<void>;

  onUnshareFiles?: (file: DialFile[]) => void;
  onRemoveFilesAccess?: (file: DialFile[]) => void;

  actionsRef?: Ref<DialFileManagerActionsRef>;

  sharedByMePaths?: Set<string>;

  onSearchFiles?: (folder: string, query: string) => void;
  searchInProgress?: boolean;
  searchResults?: DialFile[];
  clearSearchResults?: () => void;
  isSearchMode: boolean;

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
  getDisabledTooltip?: (row: FileManagerGridRow) => string | undefined;
  fileTooLargeTooltip?: string;
  unsupportedFileTypeTooltip?: string;
  hideSearchPathItemName?: boolean;
  showHiddenFileSwitcherInDestinationPopup?: boolean;
  showCreateFolderButtonInDestinationPopup?: boolean;
}

export const FileManagerContext = createContext<
  FileManagerContextValue | undefined
>(undefined);
