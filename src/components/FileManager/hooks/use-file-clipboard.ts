import type { DialFile } from '@/models/file';
import type { DialCopiedItem } from '@/models/file-manager';
import { useCallback, useState } from 'react';
import type { FileConflictDecision } from '@/components/FileManager/components/ConflictResolutionPopup/ConflictResolutionPopup';
import { useConflictResolution } from './use-conflict-resolution';
import { DestinationFolderMode } from '@/types/file-manager';

export interface UseFileClipboardOptions {
  getDestinationFiles: (path: string) => DialFile[];
  getSourceFiles: () => DialFile[];
  onCopyFiles?: (items: DialCopiedItem[], destinationFolder: string) => void;
  onMoveToFiles?: (
    items: DialCopiedItem[],
    sourceFolder: string,
    destinationFolder: string,
  ) => void;
  onCopySuccess?: () => void;
  onMoveSuccess?: () => void;
  onDuplicateSuccess?: () => void;
  getCopyHeader?: (itemsCount: number, itemName?: string) => string;
  getMoveHeader?: (itemsCount: number, itemName?: string) => string;
}

export const useFileClipboard = ({
  getDestinationFiles,
  onCopyFiles,
  onMoveToFiles,
  onCopySuccess,
  onMoveSuccess,
  onDuplicateSuccess,
  getCopyHeader,
  getMoveHeader,
}: UseFileClipboardOptions) => {
  const [openDestinationFolderPopup, setOpenDestinationFolderPopup] =
    useState<boolean>(false);
  const [copiedFiles, setCopiedFiles] = useState<DialFile[]>([]);
  const [movedFiles, setMovedFiles] = useState<DialFile[]>([]);
  const [destinationFolderMode, setDestinationFolderMode] =
    useState<DestinationFolderMode>(DestinationFolderMode.Copy);
  const [sourceFolder, setSourceFolder] = useState<string | undefined>();

  const [operationMetadata, setOperationMetadata] = useState<{
    type: DestinationFolderMode.Copy | DestinationFolderMode.Move;
    sourceFolder?: string;
  } | null>(null);

  const {
    conflictingFiles,
    conflictResolutionOpen,
    hasActiveConflictRef,
    startConflictResolution,
    resolveConflictsWithStrategy,
    closeConflictResolution,
    openConflictResolution,
    handleReplaceAll: baseHandleReplaceAll,
    handleDuplicateAll: baseHandleDuplicateAll,
    handleCancelAll: baseHandleCancelAll,
    handleDecideForEach: baseHandleDecideForEach,
  } = useConflictResolution({
    getDestinationFiles,
    onResolve: (items, destinationFolder) => {
      if (!items?.length) {
        return;
      }

      if (operationMetadata?.type === DestinationFolderMode.Copy) {
        onCopyFiles?.(items, destinationFolder);
        onCopySuccess?.();
      } else if (
        operationMetadata?.type === DestinationFolderMode.Move &&
        operationMetadata.sourceFolder
      ) {
        onMoveToFiles?.(
          items,
          operationMetadata.sourceFolder,
          destinationFolder,
        );
        onMoveSuccess?.();
      }
    },
  });

  const clearState = useCallback(() => {
    setCopiedFiles([]);
    setMovedFiles([]);
    setOperationMetadata(null);
    setSourceFolder(undefined);
  }, []);

  const handleCopyTo = useCallback(
    (destinationFolder: string) => {
      const result = startConflictResolution(destinationFolder, copiedFiles, {
        type: DestinationFolderMode.Copy,
      });

      setOperationMetadata({ type: DestinationFolderMode.Copy });

      if (!result.hasConflicts) {
        const resolvedItems = resolveConflictsWithStrategy(
          destinationFolder,
          copiedFiles,
          false,
        );
        onCopyFiles?.(resolvedItems, destinationFolder);
        onCopySuccess?.();
        clearState();
      }
    },
    [
      copiedFiles,
      startConflictResolution,
      resolveConflictsWithStrategy,
      onCopyFiles,
      onCopySuccess,
      clearState,
    ],
  );

  const handleMoveTo = useCallback(
    (destinationFolder: string, sourceFolder?: string) => {
      const sourceFolderPath =
        sourceFolder || (operationMetadata?.sourceFolder ?? '/');

      const result = startConflictResolution(destinationFolder, movedFiles, {
        type: DestinationFolderMode.Move,
        sourceFolderPath,
      });

      if (!result.hasConflicts) {
        const resolvedItems = resolveConflictsWithStrategy(
          destinationFolder,
          movedFiles,
          true,
        );
        onMoveToFiles?.(resolvedItems, sourceFolderPath, destinationFolder);
        onMoveSuccess?.();
        clearState();
      }
    },
    [
      movedFiles,
      startConflictResolution,
      resolveConflictsWithStrategy,
      onMoveToFiles,
      onMoveSuccess,
      clearState,
      operationMetadata,
    ],
  );

  const handleConflictReplace = useCallback(() => {
    baseHandleReplaceAll();
    clearState();
  }, [baseHandleReplaceAll, clearState]);

  const handleConflictDuplicate = useCallback(() => {
    baseHandleDuplicateAll();
    clearState();
  }, [baseHandleDuplicateAll, clearState]);

  const handleConflictCancel = useCallback(() => {
    baseHandleCancelAll();
    clearState();
  }, [baseHandleCancelAll, clearState]);

  const handleConflictDecideForEach = useCallback(
    (decisions: FileConflictDecision[]) => {
      baseHandleDecideForEach(decisions);
      clearState();
    },
    [baseHandleDecideForEach, clearState],
  );

  const handleDuplicate = useCallback(
    (files: DialFile[]) => {
      const destinationUrl = files.at(0)?.parentPath ?? '/';
      const resolvedItems = resolveConflictsWithStrategy(
        destinationUrl,
        files,
        false,
      );
      onCopyFiles?.(resolvedItems, destinationUrl);
      onDuplicateSuccess?.();
    },
    [onCopyFiles, onDuplicateSuccess, resolveConflictsWithStrategy],
  );

  const handleOpenDestinationFolderPopup = useCallback(
    (mode: DestinationFolderMode) => {
      setDestinationFolderMode(mode);
      setOpenDestinationFolderPopup(true);
    },
    [],
  );

  const handleCloseDestinationFolderPopup = useCallback(() => {
    setOpenDestinationFolderPopup(false);
    if (!hasActiveConflictRef.current) {
      clearState();
    }
  }, [clearState, hasActiveConflictRef]);

  const [destinationFolderTitle, setDestinationFolderTitle] =
    useState<string>();

  const handleSetCopiedFiles = useCallback(
    (files: DialFile[]) => {
      setCopiedFiles(files);
      const sourcePath = files[0]?.parentPath ?? files[0]?.folderId;
      setSourceFolder(sourcePath);

      if (getCopyHeader && files.length > 0) {
        setDestinationFolderTitle(getCopyHeader(files.length, files[0]?.name));
      } else {
        setDestinationFolderTitle(undefined);
      }
    },
    [getCopyHeader],
  );

  const handleSetMovedFiles = useCallback(
    (files: DialFile[]) => {
      setMovedFiles(files);
      const sourcePath = files[0]?.parentPath ?? files[0]?.folderId;
      setSourceFolder(sourcePath);

      setOperationMetadata({
        type: DestinationFolderMode.Move,
        sourceFolder: sourcePath,
      });

      if (getMoveHeader && files.length > 0) {
        setDestinationFolderTitle(getMoveHeader(files.length, files[0]?.name));
      } else {
        setDestinationFolderTitle(undefined);
      }
    },
    [getMoveHeader],
  );

  return {
    handleDuplicate,
    handleCloseDestinationFolderPopup,
    handleOpenDestinationFolderPopup,
    handleCopyTo,
    handleMoveTo,
    openDestinationFolderPopup,
    destinationFolderMode,
    destinationFolderTitle,
    handleSetCopiedFiles,
    handleSetMovedFiles,
    clearState,
    conflictingFiles,
    conflictResolutionOpen,
    openConflictResolution,
    closeConflictResolution,
    handleConflictReplace,
    handleConflictCancel,
    handleConflictDuplicate,
    handleConflictDecideForEach,
    sourceFolder,
  };
};
