import { createContext, type DragEvent, type RefObject } from 'react';
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
} from './FileManager';
import type { DestinationFolderMode } from './hooks/use-file-clipboard';
import type { FileUploadValidationMessages } from './hooks/use-file-upload';
import type { DropdownItem } from '@/models/dropdown';

export interface FileManagerGridRow {
  id: string;
  name: string;
  updatedAt?: string;
  size?: string;
  author?: string;
  path: string;
  nodeType: DialFileNodeType;
  extension?: string;
}

export interface FileManagerContextValue {
  cssClass?: string;
  items: DialFile[];
  rootItem?: DialRootFolder;
  filesLoading?: boolean;
  treeOptions?: FileTreeOptions;
  navigationPanelOptions?: NavigationPanelOptions;
  gridOptions?: GridOptions;
  toolbarOptions?: ToolbarOptions;
  bulkActionsToolbarOptions?: BulkActionsToolbarOptions;
  deleteConfirmationOptions?: DeleteConfirmationOptions;
  destinationFolderPopupOptions?: DialFileManagerDestinationFolderPopupOptions;

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

  selectedIds: Set<string>;
  selectedFiles: Map<string, DialFile>;
  setSelectedFiles: (next: Map<string, DialFile>) => void;
  clearSelection: () => void;

  currentFolder?: DialFile;
  gridRows: FileManagerGridRow[];

  handleCopyTo: (destinationFolder: string) => void;
  handleMoveTo: (destinationFolder: string, sourceFolder: string) => void;
  handleDuplicate: (files: DialFile[]) => void;
  handleOpenDestinationFolderPopup: (mode: DestinationFolderMode) => void;
  handleCloseDestinationFolderPopup: () => void;
  openDestinationFolderPopup: boolean;
  destinationFolderMode: DestinationFolderMode;
  handleSetCopiedFiles: (files: DialFile[]) => void;
  handleSetMovedFiles: (files: DialFile[]) => void;

  renamedPath?: string;
  onRename: (file: string) => void;
  onRenameSave: (value: string) => void;
  onRenameCancel: () => void;
  onRenameValidate: (value: string, item: DialFile) => string | null;

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

  onTableFileClick?: DialFileManagerProps['onTableFileClick'];
  handleDownloadFiles: (items: DialFile[]) => void;

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

  openFileDialog: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const FileManagerContext = createContext<
  FileManagerContextValue | undefined
>(undefined);
