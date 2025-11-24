import {
  type FC,
  type ReactNode,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import {
  collectAllDescendants,
  findFolderForPath,
  isHiddenDotFile,
  normalizeExtensionWithoutDot,
  normalizeToLowerCase,
} from './utils';
import { useShowHiddenFiles } from './hooks/use-show-hidden-files';
import { useCollapseTree } from './hooks/use-collapse-tree';
import { useFileClipboard } from './hooks/use-file-clipboard';
import { useCurrentPath } from './hooks/use-current-path';
import { useFileDelete } from './hooks/use-file-delete';
import { useFileDownload } from './hooks/use-file-download';
import { useFileUpload } from './hooks/use-file-upload';
import {
  FileManagerContext,
  type FileManagerContextValue,
  type FileManagerGridRow,
} from './FileManagerContext';
import type { DialFileManagerProps } from './FileManager';
import { useItemRenaming } from './hooks/use-item-renaming';

/**
 * Formats bytes into a short, human-readable string.
 */
const formatBytes = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return '-';
  const KB = 1024;
  const MB = KB * 1024;
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  if (bytes >= KB) return `${(bytes / KB).toFixed(0)} KB`;
  return `${bytes} bytes`;
};

export interface FileManagerProviderProps
  extends Omit<DialFileManagerProps, 'children'> {
  children: ReactNode;
}

/**
 * Provider that encapsulates all File Manager business logic:
 * - path & navigation
 * - search (controlled + uncontrolled)
 * - hidden files toggle
 * - tree collapsed state
 * - selection
 * - clipboard (copy / cut / paste)
 * - delete confirmation state
 * - computed grid rows
 *
 */
export const FileManagerProvider: FC<FileManagerProviderProps> = ({
  children,
  cssClass,
  items = [],
  rootItem,
  path,
  filesLoading,
  showHiddenFiles,
  onShowHiddenFilesChange,
  treeOptions,
  navigationPanelOptions,
  deleteConfirmationOptions,
  gridOptions,
  toolbarOptions,
  bulkActionsToolbarOptions,
  destinationFolderPopupOptions,
  onPathChange,
  onTableFileClick,
  onCopyFiles,
  onMoveToFiles,
  onDeleteFiles,
  onDownloadFiles,
  onRename,
  onRenameSave,
  onRenameCancel,
  onRenameValidate,
  onUploadFiles,
  onValidateUpload,
  maxFileSize,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<Map<string, DialFile>>(
    new Map(),
  );

  const selectedIds = useMemo(
    () => new Set(selectedFiles.keys()),
    [selectedFiles],
  );
  const clearSelection = useCallback(() => setSelectedFiles(new Map()), []);

  const { currentPath, setCurrentPath, handlePathChange } = useCurrentPath({
    path,
    onPathChange,
    onSelectionClear: clearSelection,
  });

  const [internalDestinationPath, setInternalDestinationPath] =
    useState<string>();

  const destinationFolderPath =
    destinationFolderPopupOptions?.destinationFolderPath ??
    internalDestinationPath;

  const setDestinationFolderPath = useCallback(
    (path?: string) => {
      if (destinationFolderPopupOptions?.setDestinationFolderPath) {
        destinationFolderPopupOptions.setDestinationFolderPath(path);
      } else {
        setInternalDestinationPath(path);
      }
    },
    [destinationFolderPopupOptions],
  );

  const { areHiddenFilesVisible, toggleHiddenFilesVisibility } =
    useShowHiddenFiles({
      showHiddenFiles,
      onShowHiddenFilesChange,
    });

  const { isTreeCollapsed, toggleTreeCollapse, setIsTreeCollapsed } =
    useCollapseTree({
      collapsed: treeOptions?.collapsed,
      onCollapseChange: treeOptions?.onCollapseChange,
    });

  const {
    renamedPath,
    renameHandler,
    renameSaveHandler,
    renameCancelHandler,
    renameValidateHandler,
  } = useItemRenaming({
    items,
    onRename,
    onRenameSave,
    onRenameCancel,
    onRenameValidate,
    onMoveToFiles,
  });

  const [searchValue, setSearchValue] = useState<string>('');
  useEffect(() => {
    const external = navigationPanelOptions?.value;
    if (external != null) {
      setSearchValue(String(external));
    }
  }, [navigationPanelOptions?.value]);

  const effectiveSearchValue = String(
    navigationPanelOptions?.value ?? searchValue ?? '',
  ).trim();

  const currentFolder = useMemo(
    () => findFolderForPath(items, currentPath) ?? items[0],
    [items, currentPath],
  );

  const {
    handleCopyTo,
    handleMoveTo,
    handleDuplicate,
    handleOpenDestinationFolderPopup,
    handleCloseDestinationFolderPopup,
    openDestinationFolderPopup,
    handleSetCopiedFiles,
    handleSetMovedFiles,
    destinationFolderMode,
  } = useFileClipboard({
    getDestinationFiles: (path: string) => {
      const folder = findFolderForPath(items, path);
      return folder?.items ?? [];
    },
    getSourceFiles: () => items,
    onCopyFiles,
    onMoveToFiles,
  });

  useEffect(() => {
    if (openDestinationFolderPopup && !destinationFolderPath) {
      setDestinationFolderPath(currentPath ?? rootItem?.path ?? '/');
    }
  }, [
    openDestinationFolderPopup,
    destinationFolderPath,
    currentPath,
    rootItem?.path,
    setDestinationFolderPath,
  ]);

  useEffect(() => {
    if (!openDestinationFolderPopup) {
      setDestinationFolderPath(undefined);
    }
  }, [openDestinationFolderPopup, setDestinationFolderPath]);

  const {
    deleteConfirmationOpen,
    itemsToDelete,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDelete,
  } = useFileDelete({
    onDeleteFiles,
  });

  const { handleDownloadFiles } = useFileDownload({
    onDownloadFiles,
  });

  const gridRows: FileManagerGridRow[] = useMemo(() => {
    const query = normalizeToLowerCase(effectiveSearchValue).trim();

    const directChildren = currentFolder?.items ?? [];
    let source: DialFile[] = query
      ? collectAllDescendants(currentFolder)
      : directChildren;

    if (!areHiddenFilesVisible) {
      source = source.filter((node) => !isHiddenDotFile(node));
    }

    const mapped = source.map((node) => ({
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

    if (!query) return mapped;

    const tokens = query.split(/\s+/).filter(Boolean);
    return mapped.filter((row) => {
      const nameLower = normalizeToLowerCase(row.name);
      const authorLower = normalizeToLowerCase(row.author);
      const extLower = normalizeExtensionWithoutDot(row.extension);
      return tokens.every(
        (t) =>
          nameLower.includes(t) ||
          authorLower.includes(t) ||
          extLower.includes(t),
      );
    });
  }, [currentFolder, effectiveSearchValue, areHiddenFilesVisible]);

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

  const handleTableRowClick = useCallback(
    (row: FileManagerGridRow) => {
      if (row.nodeType === DialFileNodeType.FOLDER) {
        handlePathChange(row.path);
      } else {
        onTableFileClick?.(row);
      }
    },
    [handlePathChange, onTableFileClick],
  );

  const {
    isDragging,
    isDraggingOverWindow,
    uploadError,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop: handleFileDropBase,
    clearError: clearUploadError,
  } = useFileUpload({
    onUploadFiles,
    onValidateUpload,
    maxFileSize,
  });

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      const destinationFolder = currentPath ?? '';
      const existingFiles = currentFolder?.items ?? [];
      handleFileDropBase(e, destinationFolder, existingFiles);
    },
    [currentPath, currentFolder, handleFileDropBase],
  );

  const value: FileManagerContextValue = {
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
    destinationFolderPopupOptions: {
      destinationFolderPath,
      setDestinationFolderPath,
      addFolderLabel: destinationFolderPopupOptions?.addFolderLabel,
      copyLabel: destinationFolderPopupOptions?.copyLabel,
      moveLabel: destinationFolderPopupOptions?.moveLabel,
      hiddenFilesSwitcherLabel:
        destinationFolderPopupOptions?.hiddenFilesSwitcherLabel,
    },

    currentPath,
    setCurrentPath,

    searchValue,
    effectiveSearchValue,
    setSearchValue,

    areHiddenFilesVisible,
    toggleHiddenFilesVisibility,

    isTreeCollapsed,
    toggleTreeCollapse,
    setIsTreeCollapsed,

    selectedIds,
    selectedFiles,
    setSelectedFiles,
    clearSelection,

    currentFolder,
    gridRows,

    handleCopyTo,
    handleMoveTo,
    handleDuplicate,
    handleSetCopiedFiles,
    handleSetMovedFiles,
    openDestinationFolderPopup,
    handleCloseDestinationFolderPopup,
    handleOpenDestinationFolderPopup,
    destinationFolderMode,

    handleDownloadFiles,

    renamedPath,
    onRename: renameHandler,
    onRenameSave: renameSaveHandler,
    onRenameCancel: renameCancelHandler,
    onRenameValidate: renameValidateHandler,

    openDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDelete,
    deleteConfirmationOpen,
    itemsToDelete,

    handlePathChange,
    handleTreeItemClick,
    handleBreadcrumbItemClick,
    handleSearchChange,
    handleTableRowClick,
    onTableFileClick,

    isDragging,
    uploadError,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    clearUploadError,
    onUploadFiles,
    onValidateUpload,
    maxFileSize,
    isDraggingOverWindow,
  };

  return (
    <FileManagerContext.Provider value={value}>
      {children}
    </FileManagerContext.Provider>
  );
};
