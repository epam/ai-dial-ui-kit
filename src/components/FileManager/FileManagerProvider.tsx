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
  findNodeByPath,
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
import { useFileMetadata } from './hooks/use-file-metadata';
import { useFileSearch } from './hooks/use-file-search';
import { usePathsSelection } from './hooks/use-paths-selection';

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
  managerLabel,
  children,
  className,
  items = [],
  rootItem,
  path,
  defaultPath,
  filesLoading,
  selectedPaths,
  defaultSelectedPaths,
  onSelectedPathsChange,
  showHiddenFiles,
  onShowHiddenFilesChange,
  treeOptions,
  showNavigationPanel = true,
  navigationPanelOptions,
  deleteConfirmationOptions,
  gridOptions: rawGridOptions,
  toolbarOptions,
  bulkActionsToolbarOptions,
  destinationFolderPopupOptions,
  conflictResolutionPopupOptions,
  onPathChange,
  onTableFileClick,
  handleSelectionClick,
  onGridApiChange,
  onCopyFiles,
  onMoveToFiles,
  onDeleteFiles,
  onDownloadFiles,
  onRenameValidate,
  onAddSibling,
  onAddChild,
  renameValidationMessages,
  onUploadFiles,
  onValidateUpload,
  uploadEnabled,
  uploadValidationMessages,
  maxFileSize,
  onUploadArchive,
  onCreateFolder,
  onCreateFolderValidate,
  folderCreationValidationMessages,
  fileMetadataPopupOptions,
  onGetInfo,
  onUnshareFiles,
  actionsRef,
  sharedByMePaths,
  onSearchFiles,
  searchResults,
  searchInProgress,
  clearSearchResults,
  allowedFileTypes,
  maxSelectableFileSize,

  emptyStateIcon,
  emptyStateTitle,
  emptyStateDescription,

  sharedWithMeIds,
  onFolderPopupPathChange,
  onManagePermissions,
  onPreview,
  previewExtensions,
  isRenameFileAvailable,
  customUploadFileAction,
}) => {
  const {
    selectedPaths: effectiveSelectedPaths,
    clearSelection,
    setSelectedPaths,
  } = usePathsSelection({
    selectedPaths,
    defaultSelectedPaths,
    onSelectedPathsChange,
  });

  const selectedFiles = useMemo(() => {
    const map = new Map<string, DialFile>();

    effectiveSelectedPaths.forEach((path) => {
      const file = findNodeByPath(items, path);
      if (file) {
        map.set(path, file);
      }
    });

    return map;
  }, [effectiveSelectedPaths, items]);

  const { currentPath, setCurrentPath, handlePathChange } = useCurrentPath({
    path,
    defaultPath,
    onPathChange,
    onSelectionClear: clearSelection,
  });

  const memoizedGridOptions = useMemo(() => {
    const {
      showFiles = true,
      showFolders = true,
      ...gridOptions
    } = rawGridOptions || {};
    return { showFiles, showFolders, ...gridOptions };
  }, [rawGridOptions]);

  const showFiles = memoizedGridOptions.showFiles;
  const showFolders = memoizedGridOptions.showFolders;

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
    getDisplayName,
  } = useItemRenaming({
    items,
    onRenameValidate,
    validationMessages: renameValidationMessages,
    onMoveToFiles,
  });

  const {
    isSearchMode,
    searchValue,
    effectiveSearchValue,
    setSearchValue,
    handleSearchChange,
    searchResultsRows,
  } = useFileSearch({
    onSearchFiles,
    clearSearchResults,
    currentPath,
    searchResults,
    searchInProgress,
    navigationPanelValue: navigationPanelOptions?.value,
    onNavigationPanelSearchChange: navigationPanelOptions?.onSearchChange,
    allItems: items,
    activeTab: toolbarOptions?.activeTab,
  });

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
    sourceFolder,
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

    uploadConflictingFiles,
    uploadConflictResolutionOpen,
    closeUploadConflictResolution,
    handleUploadConflictReplace,
    handleUploadConflictDuplicate,
    handleUploadConflictDecideForEach,
  } = useFileUpload({
    onUploadFiles,
    onValidateUpload,
    maxFileSize,
    onUploadArchive,
    allowedFileTypes,
    validationMessages: uploadValidationMessages,
    uploadEnabled,
    currentFolder,
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

  const customUploadFile = useCallback(() => {
    customUploadFileAction?.(currentPath, currentFolder);
  }, [customUploadFileAction, currentPath, currentFolder]);

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

  const { newActions, isNewButtonVisible, isNewButtonDisabled } = useNewActions(
    {
      newActions: toolbarOptions?.newActions,
      currentFolder,
      onUploadFiles: customUploadFileAction ? customUploadFile : openFileDialog,
      onUploadArchive: openArchiveUpload,
      onCreateFolder: startFolderCreation,
      isNewButtonDisabled: toolbarOptions?.isNewButtonDisabled,
    },
  );

  const gridRows: FileManagerGridRow[] = useMemo(() => {
    if (isSearchMode) {
      let source = searchResultsRows;

      if (!showFiles) {
        source = source.filter(
          (node) => node.nodeType !== DialFileNodeType.ITEM,
        );
      }

      if (!showFolders) {
        source = source.filter(
          (node) => node.nodeType !== DialFileNodeType.FOLDER,
        );
      }

      if (!areHiddenFilesVisible) {
        source = source.filter((node) => !isHiddenDotFile(node));
      }

      return source.map((node) => ({
        ...node,
        id: node.id ?? node.path,
        name: node.name ?? node.path.split('/').pop() ?? '',
        updatedAt: node.updatedAt,
        size: node.contentLength,
        contentLength: node.contentLength,
        author: node.author,
        path: node.path,
        nodeType: node.nodeType,
        extension: node.extension,
        isTemporary: false,
        owner: node.owner,
      }));
    }

    const query = normalizeToLowerCase(effectiveSearchValue).trim();

    const directChildren = currentFolder?.items ?? [];
    let source: DialFile[] = query
      ? collectAllDescendants(currentFolder)
      : directChildren;

    if (!showFiles) {
      source = source.filter((node) => node.nodeType !== DialFileNodeType.ITEM);
    }

    if (!showFolders) {
      source = source.filter(
        (node) => node.nodeType !== DialFileNodeType.FOLDER,
      );
    }

    if (!areHiddenFilesVisible) {
      source = source.filter((node) => !isHiddenDotFile(node));
    }

    const mapped: FileManagerGridRow[] = source.map((node) => ({
      ...node,
      id: node.id ?? node.path,
      name: node.name ?? node.path.split('/').pop() ?? '',
      updatedAt: node.updatedAt,
      size: node.contentLength,
      author: node.author,
      path: node.path,
      nodeType: node.nodeType,
      extension: node.extension,
      isTemporary: false,
      owner: node.owner,
      contentType: node.contentType,
      contentLength: node.contentLength,
    }));

    if (isCreatingFolder && newFolderTempId && !query) {
      mapped.unshift({
        id: newFolderTempId,
        name: '',
        updatedAt: undefined,
        author: undefined,
        path: newFolderTempId,
        nodeType: DialFileNodeType.FOLDER,
        extension: undefined,
        isTemporary: true,
        owner: undefined,
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
    isSearchMode,
    searchResultsRows,
    currentFolder,
    effectiveSearchValue,
    areHiddenFilesVisible,
    isCreatingFolder,
    newFolderTempId,
    showFiles,
    showFolders,
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

  const {
    isMetadataPopupOpen,
    selectedFileForMetadata,
    openMetadataPopup,
    closeMetadataPopup,
  } = useFileMetadata({ onGetInfo });

  const handleCloseMetadataPopup = useCallback(() => {
    closeMetadataPopup();
    fileMetadataPopupOptions?.clearMetadata?.();
  }, [closeMetadataPopup, fileMetadataPopupOptions]);

  const value: FileManagerContextValue = {
    managerLabel,
    className,
    items,
    allowedFileTypes,
    maxSelectableFileSize,
    rootItem,
    filesLoading,
    treeOptions: {
      ...treeOptions,
      expandedPaths,
      onExpandedPathsChange: setExpandedPaths,
      additionalButtons,
    },
    showNavigationPanel,
    navigationPanelOptions,
    gridOptions: memoizedGridOptions,
    toolbarOptions,
    bulkActionsToolbarOptions,
    deleteConfirmationOptions,
    destinationFolderPopupOptions: {
      ...destinationFolderPopupOptions,
      destinationFolderPath,
      setDestinationFolderPath,
      header: destinationFolderTitle,
      onCreateFolder,
      onCreateFolderValidate,
      folderCreationValidationMessages,
      sourceFolder,
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

    selectedPaths: effectiveSelectedPaths,
    selectedFiles,
    setSelectedPaths,
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
    handleAddSibling: onAddSibling,
    handleAddChild: onAddChild,

    handleDownloadFiles,

    renamedPath,
    renamedItem,
    onRename: renameHandler,
    onRenameSave: renameSaveHandler,
    onRenameCancel: renameCancelHandler,
    onRenameValidate: renameValidateHandler,
    getDisplayName,

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
    handleSelectionClick,
    onGridApiChange,

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
    isNewButtonDisabled,

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

    uploadConflictingFiles,
    uploadConflictResolutionOpen,
    closeUploadConflictResolution,
    handleUploadConflictReplace,
    handleUploadConflictDuplicate,
    handleUploadConflictDecideForEach,

    fileMetadataPopupOptions,
    isMetadataPopupOpen,
    selectedFileForMetadata,
    openMetadataPopup,
    closeMetadataPopup: handleCloseMetadataPopup,
    onGetInfo,

    onUnshareFiles,

    actionsRef,
    sharedByMePaths,

    onSearchFiles,
    searchInProgress,
    searchResults,
    clearSearchResults,
    isSearchMode,

    emptyStateIcon,
    emptyStateTitle,
    emptyStateDescription,

    sharedWithMeIds,

    onFolderPopupPathChange,
    onManagePermissions,
    onPreview,
    previewExtensions,
    isRenameFileAvailable,
    customUploadFileAction,
  };

  return (
    <FileManagerContext.Provider value={value}>
      {children}
    </FileManagerContext.Provider>
  );
};
