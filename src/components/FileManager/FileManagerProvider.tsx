import {
  type FC,
  type ReactNode,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  type DragEvent,
} from 'react';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import type { DialUploadFileItem } from '@/models/file-manager';
import {
  cleanForbiddenSymbolsRegExp,
  collectAllDescendants,
  findFolderForPath,
  findNodeByPath,
  getFolderNestingDepth,
  isFileSelectable,
  isHiddenDotFile,
  normalizeExtensionWithoutDot,
  normalizeToLowerCase,
  splitPathAndName,
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
import { NOT_ALLOWED_SYMBOLS_REGEXP } from '@/constants/validation';

export interface FileManagerProviderProps extends Omit<
  DialFileManagerProps,
  'children'
> {
  children: ReactNode;
  autoSelectUploadedItems?: boolean;
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
  renameValidationMessages,
  forbiddenSymbolsRegExp = NOT_ALLOWED_SYMBOLS_REGEXP,
  forbiddenSymbolsTooltip,
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
  onRemoveFilesAccess,
  actionsRef,
  sharedByMePaths,
  onSearchFiles,
  searchResults,
  searchInProgress,
  clearSearchResults,
  allowedFileTypes,
  maxSelectableFileSize,
  getDisabledTooltip,
  fileTooLargeTooltip,
  unsupportedFileTypeTooltip,

  emptyStateIcon,
  emptyStateTitle,
  emptyStateDescription,

  sharedWithMeIds,
  onFolderPopupPathChange,
  onManagePermissions,
  onPreview,
  onOpenInNewTab,
  previewExtensions,
  isRenameFileAvailable,
  isDuplicateFolderAvailable,
  customUploadFileAction,
  customCreateNewItemAction,
  customDuplicateAction,
  customDeleteItemsAction,
  customDownloadItemsAction,
  customBreakpointRef,
  gridClassName,
  nonClickableTableColumns,
  hideSearchPathItemName,
  showHiddenFileSwitcherInDestinationPopup,
  showCreateFolderButtonInDestinationPopup,
  autoSelectUploadedItems = false,
  maxNewFolderDepth,
  onNewFolderDepthExceeded,
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

  const pendingAutoSelectRef = useRef<{
    fileNames: Set<string>;
    destinationFolder: string;
  } | null>(null);

  const wrappedOnCreateFolder = useCallback(
    (file: DialUploadFileItem, folderPath: string, id: string) => {
      if (autoSelectUploadedItems) {
        const { parent, name } = splitPathAndName(folderPath);
        pendingAutoSelectRef.current = {
          fileNames: new Set([name]),
          destinationFolder: parent,
        };
      }
      onCreateFolder?.(file, folderPath, id);
    },
    [onCreateFolder, autoSelectUploadedItems],
  );

  const wrappedOnUploadFiles = useCallback(
    (files: DialUploadFileItem[], destinationFolder: string) => {
      if (autoSelectUploadedItems) {
        pendingAutoSelectRef.current = {
          fileNames: new Set(files.map((f) => f.name)),
          destinationFolder,
        };
      }
      onUploadFiles?.(files, destinationFolder);
    },
    [onUploadFiles, autoSelectUploadedItems],
  );

  const wrappedOnUploadArchive = useCallback(
    (file: File, name: string, destinationFolder: string) => {
      if (autoSelectUploadedItems) {
        pendingAutoSelectRef.current = {
          fileNames: new Set([name]),
          destinationFolder,
        };
      }
      onUploadArchive?.(file, name, destinationFolder);
    },
    [onUploadArchive, autoSelectUploadedItems],
  );

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

  useEffect(() => {
    if (effectiveSelectedPaths.size === 0) return;

    let hasMissingPaths = false;
    for (const path of effectiveSelectedPaths) {
      if (!findNodeByPath(items, path)) {
        hasMissingPaths = true;
        break;
      }
    }

    if (hasMissingPaths) {
      const nextPaths = new Set<string>();
      for (const path of effectiveSelectedPaths) {
        if (findNodeByPath(items, path)) {
          nextPaths.add(path);
        }
      }
      setSelectedPaths(nextPaths);
    }
  }, [items, effectiveSelectedPaths, setSelectedPaths]);

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
    handleSearchClear,
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

  const isMaxNestingDepthReached = useCallback(
    (folder: DialFile, maxDepth?: number) => {
      if (!maxDepth || !folder) return false;
      return getFolderNestingDepth(folder.path) > maxDepth;
    },
    [],
  );

  const showNewFolderNestingError = useCallback(() => {
    onNewFolderDepthExceeded?.();
  }, [onNewFolderDepthExceeded]);

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
    handleConflictCancel,
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
    customDownloadItemsAction,
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
    handleUploadConflictCancel,
    handleUploadConflictDecideForEach,
  } = useFileUpload({
    onUploadFiles: wrappedOnUploadFiles,
    onValidateUpload,
    maxFileSize,
    onUploadArchive: wrappedOnUploadArchive,
    allowedFileTypes,
    validationMessages: uploadValidationMessages,
    uploadEnabled,
    currentFolder,
  });

  const handleDrop = useCallback(
    (e: DragEvent) => {
      handleSearchClear();
      const destinationFolder = currentPath ?? '';
      const existingFiles = currentFolder?.items ?? [];
      handleFileDropBase(e, destinationFolder, existingFiles);
    },
    [currentPath, currentFolder, handleFileDropBase, handleSearchClear],
  );

  const openFileDialog = useCallback(() => {
    handleSearchClear();
    const destinationFolder = currentPath ?? '';
    const existingFiles = currentFolder?.items ?? [];
    openFileDialogBase(destinationFolder, existingFiles);
  }, [currentPath, currentFolder, openFileDialogBase, handleSearchClear]);

  const openArchiveUpload = useCallback(() => {
    handleSearchClear();
    const destinationFolder = currentPath ?? '';
    const existingFiles = currentFolder?.items ?? [];
    openArchiveDialog(destinationFolder, existingFiles);
  }, [currentPath, currentFolder, openArchiveDialog, handleSearchClear]);

  const customUploadFile = useCallback(() => {
    handleSearchClear();
    customUploadFileAction?.(currentPath, currentFolder);
  }, [customUploadFileAction, currentPath, currentFolder, handleSearchClear]);

  const customCreateNewItem = useCallback(() => {
    handleSearchClear();
    customCreateNewItemAction?.(currentPath, currentFolder);
  }, [
    customCreateNewItemAction,
    currentPath,
    currentFolder,
    handleSearchClear,
  ]);

  const customDuplicateHandle = useCallback(
    (items: DialFile[]) => {
      customDuplicateAction?.(items);
    },
    [customDuplicateAction],
  );

  const {
    isCreatingFolder,
    newFolderTempId,
    createdFolderPath,
    newFolderDefaultName,
    startFolderCreation: startFolderCreationBase,
    startGridSiblingFolderCreation,
    startTreeSiblingFolderCreation,
    startGridChildFolderCreation,
    startTreeChildFolderCreation,
    cancelFolderCreation,
    saveFolderCreation,
    validateFolderName,
  } = useFolderCreation({
    currentFolder,
    onCreateFolder: wrappedOnCreateFolder,
    onValidateFolderName: onCreateFolderValidate,
    validationMessages: folderCreationValidationMessages,
    items,
  });

  const startFolderCreation = useCallback(() => {
    if (
      maxNewFolderDepth &&
      isMaxNestingDepthReached(currentFolder, maxNewFolderDepth - 1)
    ) {
      showNewFolderNestingError();
      return;
    }
    handleSearchClear();
    startFolderCreationBase();
  }, [
    handleSearchClear,
    startFolderCreationBase,
    currentFolder,
    maxNewFolderDepth,
    isMaxNestingDepthReached,
    showNewFolderNestingError,
  ]);

  const { newActions, isNewButtonVisible, isNewButtonDisabled } = useNewActions(
    {
      newActions: toolbarOptions?.newActions,
      currentFolder,
      onUploadFiles: customUploadFileAction ? customUploadFile : openFileDialog,
      onUploadArchive: openArchiveUpload,
      onCreateFolder: startFolderCreation,
      onCreateNewItem: customCreateNewItem,
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
        source = source.filter((node) => {
          const segments = node.path.split('/').filter(Boolean);
          return !segments.some((segment) => segment.startsWith('.'));
        });
      }

      const searchMapped: FileManagerGridRow[] = source.map((node) => ({
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
        folderId: node.folderId,
      }));

      if (isCreatingFolder && newFolderTempId) {
        searchMapped.unshift({
          id: newFolderTempId,
          name: newFolderDefaultName,
          updatedAt: undefined,
          author: undefined,
          path: currentPath ?? '/',
          nodeType: DialFileNodeType.FOLDER,
          extension: undefined,
          isTemporary: true,
          owner: undefined,
        });
      }

      return searchMapped;
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
      source = source.filter((node) => {
        if (query) {
          const segments = node.path.split('/').filter(Boolean);
          return !segments.some((segment) => segment.startsWith('.'));
        }
        return !isHiddenDotFile(node);
      });
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
      folderId: node.folderId,
    }));

    if (isCreatingFolder && newFolderTempId && !query) {
      mapped.unshift({
        id: newFolderTempId,
        name: newFolderDefaultName,
        updatedAt: undefined,
        author: undefined,
        path: currentPath ?? '/',
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
    newFolderDefaultName,
    showFiles,
    showFolders,
    currentPath,
  ]);

  useEffect(() => {
    const pending = pendingAutoSelectRef.current;
    if (!pending) return;

    if ((currentPath ?? '') !== pending.destinationFolder) {
      pendingAutoSelectRef.current = null;
      return;
    }

    const folder = findFolderForPath(items, pending.destinationFolder);
    if (!folder?.items) return;

    const matchedPaths = new Set<string>();
    for (const item of folder.items) {
      if (!pending.fileNames.has(item.name)) continue;
      if (!isFileSelectable(item, allowedFileTypes, maxSelectableFileSize))
        continue;
      matchedPaths.add(item.path);
    }
    if (matchedPaths.size > 0) {
      setSelectedPaths(matchedPaths);
      pendingAutoSelectRef.current = null;
    }
  }, [
    items,
    currentPath,
    setSelectedPaths,
    allowedFileTypes,
    maxSelectableFileSize,
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

  const handleGridAddSibling = useCallback(
    (files: DialFile[]) => {
      if (files.length > 0) {
        if (
          maxNewFolderDepth &&
          isMaxNestingDepthReached(files[0], maxNewFolderDepth)
        ) {
          showNewFolderNestingError();
          return;
        }
        handleSearchClear();
        startGridSiblingFolderCreation(files[0]);
      }
    },
    [
      handleSearchClear,
      startGridSiblingFolderCreation,
      maxNewFolderDepth,
      isMaxNestingDepthReached,
      showNewFolderNestingError,
    ],
  );

  const handleGridAddChild = useCallback(
    (files: DialFile[]) => {
      if (files.length > 0) {
        if (
          maxNewFolderDepth &&
          isMaxNestingDepthReached(files[0], maxNewFolderDepth - 1)
        ) {
          showNewFolderNestingError();
          return;
        }
        handleSearchClear();
        setCurrentPath(files[0].path);
        setExpandedPaths(new Set(expandedPaths).add(files[0].path || '/'));
        startGridChildFolderCreation(files[0]);
      }
    },
    [
      handleSearchClear,
      startGridChildFolderCreation,
      expandedPaths,
      setExpandedPaths,
      setCurrentPath,
      showNewFolderNestingError,
      maxNewFolderDepth,
      isMaxNestingDepthReached,
    ],
  );

  const handleTreeAddSibling = useCallback(
    (files: DialFile[]) => {
      if (files.length > 0) {
        if (
          maxNewFolderDepth &&
          isMaxNestingDepthReached(files[0], maxNewFolderDepth)
        ) {
          showNewFolderNestingError();
          return;
        }
        handleSearchClear();
        startTreeSiblingFolderCreation(files[0]);
      }
    },
    [
      handleSearchClear,
      startTreeSiblingFolderCreation,
      maxNewFolderDepth,
      isMaxNestingDepthReached,
      showNewFolderNestingError,
    ],
  );

  const handleTreeAddChild = useCallback(
    (files: DialFile[]) => {
      if (files.length > 0) {
        if (
          maxNewFolderDepth &&
          isMaxNestingDepthReached(files[0], maxNewFolderDepth - 1)
        ) {
          showNewFolderNestingError();
          return;
        }
        handleSearchClear();
        setCurrentPath(files[0].path);
        setExpandedPaths(new Set(expandedPaths).add(files[0].path || '/'));
        startTreeChildFolderCreation(files[0]);
      }
    },
    [
      handleSearchClear,
      startTreeChildFolderCreation,
      setCurrentPath,
      expandedPaths,
      setExpandedPaths,
      maxNewFolderDepth,
      isMaxNestingDepthReached,
      showNewFolderNestingError,
    ],
  );

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

  const cleanedForbiddenSymbolsRegExp = useMemo(() => {
    if (!forbiddenSymbolsRegExp) return undefined;

    return cleanForbiddenSymbolsRegExp(forbiddenSymbolsRegExp);
  }, [forbiddenSymbolsRegExp]);

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
    handleDuplicate: customDuplicateAction
      ? customDuplicateHandle
      : handleDuplicate,
    handleSetCopiedFiles,
    handleSetMovedFiles,
    openDestinationFolderPopup,
    handleCloseDestinationFolderPopup,
    handleOpenDestinationFolderPopup,
    destinationFolderMode,
    handleGridAddSibling,
    handleGridAddChild,
    handleTreeAddSibling,
    handleTreeAddChild,

    handleDownloadFiles,

    renamedPath,
    renamedItem,
    forbiddenSymbolsRegExp: cleanedForbiddenSymbolsRegExp,
    forbiddenSymbolsTooltip,
    onRename: renameHandler,
    onRenameSave: renameSaveHandler,
    onRenameCancel: renameCancelHandler,
    onRenameValidate: renameValidateHandler,
    getDisplayName,

    openDeleteConfirmation: customDeleteItemsAction || openDeleteConfirmation,
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
    createdFolderPath,
    newFolderDefaultName,
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
    handleConflictCancel,
    handleConflictDecideForEach,

    uploadConflictingFiles,
    uploadConflictResolutionOpen,
    closeUploadConflictResolution,
    handleUploadConflictReplace,
    handleUploadConflictDuplicate,
    handleUploadConflictCancel,
    handleUploadConflictDecideForEach,

    fileMetadataPopupOptions,
    isMetadataPopupOpen,
    selectedFileForMetadata,
    openMetadataPopup,
    closeMetadataPopup: handleCloseMetadataPopup,
    onGetInfo,

    onUnshareFiles,
    onRemoveFilesAccess,

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
    gridClassName,

    sharedWithMeIds,

    onFolderPopupPathChange,
    onManagePermissions,
    onPreview,
    onOpenInNewTab,
    previewExtensions,
    isRenameFileAvailable,
    isDuplicateFolderAvailable,
    customUploadFileAction,
    customBreakpointRef,
    nonClickableTableColumns,
    hideSearchPathItemName,
    getDisabledTooltip,
    fileTooLargeTooltip,
    unsupportedFileTypeTooltip,
    showHiddenFileSwitcherInDestinationPopup,
    showCreateFolderButtonInDestinationPopup,
    maxNewFolderDepth,
    onNewFolderDepthExceeded,
  };

  return (
    <FileManagerContext.Provider value={value}>
      {children}
    </FileManagerContext.Provider>
  );
};
