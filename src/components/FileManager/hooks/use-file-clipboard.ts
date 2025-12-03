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
}

export const useFileClipboard = ({
  getDestinationFiles,
  onCopyFiles,
  onMoveToFiles,
  onCopySuccess,
  onMoveSuccess,
  onDuplicateSuccess,
}: UseFileClipboardOptions) => {
  const [openDestinationFolderPopup, setOpenDestinationFolderPopup] =
    useState<boolean>(false);
  const [copiedFiles, setCopiedFiles] = useState<DialFile[]>([]);
  const [movedFiles, setMovedFiles] = useState<DialFile[]>([]);
  const [destinationFolderMode, setDestinationFolderMode] =
    useState<DestinationFolderMode>(DestinationFolderMode.Copy);

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
    handleDecideForEach: baseHandleDecideForEach,
  } = useConflictResolution({
    getDestinationFiles,
    onResolve: (items, destinationFolder) => {
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
    (destinationFolder: string, sourceFolder: string) => {
      const result = startConflictResolution(destinationFolder, movedFiles, {
        type: DestinationFolderMode.Move,
        sourceFolder,
      });

      setOperationMetadata({ type: DestinationFolderMode.Move, sourceFolder });

      if (!result.hasConflicts) {
        const resolvedItems = resolveConflictsWithStrategy(
          destinationFolder,
          movedFiles,
          true,
        );
        onMoveToFiles?.(resolvedItems, sourceFolder, destinationFolder);
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

  const handleSetCopiedFiles = useCallback((files: DialFile[]) => {
    setCopiedFiles(files);
  }, []);

  const handleSetMovedFiles = useCallback((files: DialFile[]) => {
    setMovedFiles(files);
  }, []);

  return {
    handleDuplicate,
    handleCloseDestinationFolderPopup,
    handleOpenDestinationFolderPopup,
    handleCopyTo,
    handleMoveTo,
    openDestinationFolderPopup,
    destinationFolderMode,
    handleSetCopiedFiles,
    handleSetMovedFiles,
    clearState,
    conflictingFiles,
    conflictResolutionOpen,
    openConflictResolution,
    closeConflictResolution,
    handleConflictReplace,
    handleConflictDuplicate,
    handleConflictDecideForEach,
  };
};
