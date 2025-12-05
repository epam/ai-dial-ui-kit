import {
  type FC,
  type ReactNode,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type DragEvent,
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
import { useExpandedPaths } from './components/FoldersTree/hooks/use-expanded-paths';
import { useNewActions } from './hooks/use-new-actions';
import { useFolderCreation } from './hooks/use-folder-creation';
import { useTreeAdditionalButtons } from '@/components/FileManager/hooks/use-tree-additional-buttons';

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
 * - new actions
 *
 */
export const FileManagerProvider: FC<FileManagerProviderProps> = ({
  children,
  className,
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
  conflictResolutionPopupOptions,
  onPathChange,
  onTableFileClick,
  onCopyFiles,
  onMoveToFiles,
  onDeleteFiles,
  onDownloadFiles,
  onRenameValidate,
  renameValidationMessages,
  onUploadFiles,
  onValidateUpload,
  maxFileSize,
  onUploadArchive,
  onCreateFolder,
  onCreateFolderValidate,
  folderCreationValidationMessages,
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
    renamedItem,
    renameHandler,
    renameSaveHandler,
    renameCancelHandler,
    renameValidateHandler,
  } = useItemRenaming({
    items,
    onRenameValidate,
    validationMessages: renameValidationMessages,
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
    destinationFolderTitle,
    conflictingFiles,
    conflictResolutionOpen,
    closeConflictResolution,
    handleConflictReplace,
    handleConflictDuplicate,
    handleConflictDecideForEach,
  } = useFileClipboard({
    getDestinationFiles: (path: string) => {
      const folder = findFolderForPath(items, path);
      return folder?.items ?? [];
    },
    getSourceFiles: () => items,
    onCopyFiles,
    onMoveToFiles,
    onCopySuccess: clearSelection,
    onMoveSuccess: clearSelection,
    onDuplicateSuccess: clearSelection,
    getCopyHeader: destinationFolderPopupOptions?.getCopyHeader,
    getMoveHeader: destinationFolderPopupOptions?.getMoveHeader,
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
    onDeleteSuccess: clearSelection,
  });

  const { handleDownloadFiles } = useFileDownload({
    onDownloadFiles,
    onDownloadSuccess: clearSelection,
  });

  const {
    isDragging,
    isDraggingOverWindow,
    uploadError,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop: handleFileDropBase,
    clearError: clearUploadError,
    openFileDialog: openFileDialogBase,
    fileInputRef,
    openArchiveDialog,
  } = useFileUpload({
    onUploadFiles,
    onValidateUpload,
    maxFileSize,
    onUploadArchive,
  });

  const handleDrop = useCallback(
    (e: DragEvent) => {
      const destinationFolder = currentPath ?? '';
      const existingFiles = currentFolder?.items ?? [];
      handleFileDropBase(e, destinationFolder, existingFiles);
    },
    [currentPath, currentFolder, handleFileDropBase],
  );

  const openFileDialog = useCallback(() => {
    const destinationFolder = currentPath ?? '';
    const existingFiles = currentFolder?.items ?? [];
    openFileDialogBase(destinationFolder, existingFiles);
  }, [currentPath, currentFolder, openFileDialogBase]);

  const openArchiveUpload = useCallback(() => {
    const destinationFolder = currentPath ?? '';
    const existingFiles = currentFolder?.items ?? [];
    openArchiveDialog(destinationFolder, existingFiles);
  }, [currentPath, currentFolder, openArchiveDialog]);
  const {
    isCreatingFolder,
    newFolderTempId,
    startFolderCreation,
    cancelFolderCreation,
    saveFolderCreation,
    validateFolderName,
  } = useFolderCreation({
    currentFolder,
    onCreateFolder,
    onValidateFolderName: onCreateFolderValidate,
    validationMessages: folderCreationValidationMessages,
  });

  const { newActions, isNewButtonVisible } = useNewActions({
    newActionLabels: toolbarOptions?.newActionLabels,
    onUploadFiles: openFileDialog,
    onUploadArchive: openArchiveUpload,
    onCreateFolder: startFolderCreation,
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
      isTemporary: false,
    }));

    if (isCreatingFolder && newFolderTempId && !query) {
      mapped.unshift({
        id: newFolderTempId,
        name: '',
        updatedAt: undefined,
        size: '-',
        author: undefined,
        path: newFolderTempId,
        nodeType: DialFileNodeType.FOLDER,
        extension: undefined,
        isTemporary: true,
      });
    }

    if (!query) return mapped;

    const tokens = query.split(/\s+/).filter(Boolean);
    return mapped.filter((row) => {
      if (row.isTemporary) return true;

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
  }, [
    currentFolder,
    effectiveSearchValue,
    areHiddenFilesVisible,
    isCreatingFolder,
    newFolderTempId,
  ]);

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

  const { expandedPaths, setExpandedPaths, collapseAll } = useExpandedPaths({
    expandedPaths: treeOptions?.expandedPaths,
    onExpandedPathsChange: treeOptions?.onExpandedPathsChange,
  });

  const { additionalButtons } = useTreeAdditionalButtons({
    collapseAll,
    expandedPathsLength: expandedPaths.size,
    additionalButtons: treeOptions?.additionalButtons,
  });

  const value: FileManagerContextValue = {
    className,
    items,
    rootItem,
    filesLoading,
    treeOptions: {
      ...treeOptions,
      expandedPaths,
      onExpandedPathsChange: setExpandedPaths,
      additionalButtons,
    },
    navigationPanelOptions,
    gridOptions,
    toolbarOptions,
    bulkActionsToolbarOptions,
    deleteConfirmationOptions,
    destinationFolderPopupOptions: {
      ...destinationFolderPopupOptions,
      destinationFolderPath,
      setDestinationFolderPath,
      title: destinationFolderTitle,
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
    renamedItem,
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
    openFileDialog,
    fileInputRef,

    newActions,
    isNewButtonVisible,

    isCreatingFolder,
    newFolderTempId,
    startFolderCreation,
    cancelFolderCreation,
    saveFolderCreation,
    validateFolderName,

    conflictResolutionPopupOptions,
    conflictingFiles,
    conflictResolutionOpen,
    closeConflictResolution,
    handleConflictReplace,
    handleConflictDuplicate,
    handleConflictDecideForEach,
  };

  return (
    <FileManagerContext.Provider value={value}>
      {children}
    </FileManagerContext.Provider>
  );
};
