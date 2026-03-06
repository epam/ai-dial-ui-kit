import { useCallback, useRef, useState } from 'react';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import type { DialCopiedItem } from '@/models/file-manager';
import type { FileConflictDecision } from '@/components/FileManager/components/ConflictResolutionPopup/ConflictResolutionPopup';
import { DialFileManagerConflictActions } from '@/types/file-manager';

export interface UseConflictResolutionOptions {
  getDestinationFiles: (path: string) => DialFile[];
  onResolve?: (items: DialCopiedItem[], destinationFolder: string) => void;
}

export interface ConflictResolutionResult {
  hasConflicts: boolean;
  conflicts: DialFile[];
}

const resolveNameConflict = (
  originalName: string,
  existingNames: Set<string>,
  type: DialFileNodeType,
): string => {
  if (!existingNames.has(originalName)) {
    return originalName;
  }

  const makeCandidate =
    type === DialFileNodeType.FOLDER
      ? (name: string, n: number) => `${name} (${n})`
      : (name: string, n: number) => {
          const lastDotIndex = name.lastIndexOf('.');
          const hasExtension = lastDotIndex > 0;
          const base = hasExtension ? name.slice(0, lastDotIndex) : name;
          const extension = hasExtension ? name.slice(lastDotIndex) : '';
          return `${base} (${n})${extension}`;
        };

  for (let n = 1; ; n++) {
    const candidate = makeCandidate(originalName, n);
    if (!existingNames.has(candidate)) return candidate;
  }
};

const getFileName = (file: DialFile): string => {
  return file.name;
};

export const useConflictResolution = ({
  getDestinationFiles,
  onResolve,
}: UseConflictResolutionOptions) => {
  const [conflictingFiles, setConflictingFiles] = useState<DialFile[]>([]);
  const [conflictResolutionOpen, setConflictResolutionOpen] = useState(false);
  const [pendingOperation, setPendingOperation] = useState<{
    files: DialFile[];
    destinationFolder: string;
    metadata?: Record<string, unknown>;
  } | null>(null);

  const hasActiveConflictRef = useRef(false);

  const openConflictResolution = useCallback((files: DialFile[]) => {
    hasActiveConflictRef.current = true;
    setConflictingFiles(files);
    setConflictResolutionOpen(true);
  }, []);

  const closeConflictResolution = useCallback(() => {
    hasActiveConflictRef.current = false;
    setConflictResolutionOpen(false);
    setConflictingFiles([]);
    setPendingOperation(null);
  }, []);

  const checkForConflicts = useCallback(
    (
      destinationFolder: string,
      files: DialFile[],
    ): ConflictResolutionResult => {
      const destinationFiles = getDestinationFiles(destinationFolder);
      const existingNames = new Set(destinationFiles.map(getFileName));

      const conflicts = files.filter((file) => existingNames.has(file.name));

      return {
        hasConflicts: conflicts.length > 0,
        conflicts,
      };
    },
    [getDestinationFiles],
  );

  const resolveConflictsWithStrategy = useCallback(
    (
      destinationFolder: string,
      files: DialFile[],
      overwrite: boolean,
      metadata?: Record<string, unknown>,
    ): DialCopiedItem[] => {
      const destinationFiles = getDestinationFiles(destinationFolder);
      const existingNames = new Set(destinationFiles.map(getFileName));

      return files.map((file) => {
        const originalName = file.name;
        const hasConflict = existingNames.has(originalName);

        const finalName =
          overwrite && hasConflict
            ? originalName
            : resolveNameConflict(originalName, existingNames, file.nodeType);

        if (!overwrite || !hasConflict) {
          existingNames.add(finalName);
        }

        return {
          sourceUrl: file.path,
          destinationUrl: `${destinationFolder}/${finalName}`,
          overwrite: overwrite && hasConflict,
          nodeType: file.nodeType ?? DialFileNodeType.ITEM,
          ...(metadata ?? {}),
        };
      });
    },
    [getDestinationFiles],
  );

  const resolveConflictsWithDecisions = useCallback(
    (
      destinationFolder: string,
      files: DialFile[],
      decisions: Map<string, DialFileManagerConflictActions>,
      metadata?: Record<string, unknown>,
    ): DialCopiedItem[] => {
      const destinationFiles = getDestinationFiles(destinationFolder);
      const existingNames = new Set(destinationFiles.map(getFileName));

      const filesToProcess = files.filter((file) => {
        const decision = decisions.get(file.path);
        return decision !== DialFileManagerConflictActions.Cancel;
      });

      return filesToProcess.map((file) => {
        const decision = decisions.get(file.path);
        const hasConflict = existingNames.has(file.name);
        const shouldOverwrite =
          decision === DialFileManagerConflictActions.Replace && hasConflict;

        const finalName = shouldOverwrite
          ? file.name
          : resolveNameConflict(file.name, existingNames, file.nodeType);

        if (!shouldOverwrite) {
          existingNames.add(finalName);
        }

        return {
          sourceUrl: file.path,
          destinationUrl: `${destinationFolder}/${finalName}`,
          overwrite: shouldOverwrite,
          nodeType: file.nodeType ?? DialFileNodeType.ITEM,
          ...(metadata ?? {}),
        };
      });
    },
    [getDestinationFiles],
  );

  const startConflictResolution = useCallback(
    (
      destinationFolder: string,
      files: DialFile[],
      metadata?: Record<string, unknown>,
    ): ConflictResolutionResult => {
      const result = checkForConflicts(destinationFolder, files);

      if (result.hasConflicts) {
        setPendingOperation({
          files,
          destinationFolder,
          metadata,
        });
        openConflictResolution(result.conflicts);
      }

      return result;
    },
    [checkForConflicts, openConflictResolution],
  );

  const handleReplaceAll = useCallback(() => {
    if (!pendingOperation) return;

    const { files, destinationFolder, metadata } = pendingOperation;
    const resolvedItems = resolveConflictsWithStrategy(
      destinationFolder,
      files,
      true,
      metadata,
    );

    onResolve?.(resolvedItems, destinationFolder);
    closeConflictResolution();
  }, [
    pendingOperation,
    resolveConflictsWithStrategy,
    onResolve,
    closeConflictResolution,
  ]);

  const handleDuplicateAll = useCallback(() => {
    if (!pendingOperation) return;

    const { files, destinationFolder, metadata } = pendingOperation;
    const resolvedItems = resolveConflictsWithStrategy(
      destinationFolder,
      files,
      false,
      metadata,
    );

    onResolve?.(resolvedItems, destinationFolder);
    closeConflictResolution();
  }, [
    pendingOperation,
    resolveConflictsWithStrategy,
    onResolve,
    closeConflictResolution,
  ]);

  const handleCancelAll = useCallback(() => {
    if (!pendingOperation) return;
    const { files, destinationFolder, metadata } = pendingOperation;

    const resolvedItems = resolveConflictsWithDecisions(
      destinationFolder,
      files,
      new Map(
        conflictingFiles.map((file) => [
          file.path,
          DialFileManagerConflictActions.Cancel,
        ]),
      ),
      metadata,
    );

    onResolve?.(resolvedItems, destinationFolder);
    closeConflictResolution();
  }, [
    closeConflictResolution,
    conflictingFiles,
    onResolve,
    pendingOperation,
    resolveConflictsWithDecisions,
  ]);

  const handleDecideForEach = useCallback(
    (decisions: FileConflictDecision[]) => {
      if (!pendingOperation) return;

      const { files, destinationFolder, metadata } = pendingOperation;
      const decisionsMap = new Map(
        decisions.map((d) => [d.file.path, d.action]),
      );

      const resolvedItems = resolveConflictsWithDecisions(
        destinationFolder,
        files,
        decisionsMap,
        metadata,
      );

      onResolve?.(resolvedItems, destinationFolder);
      closeConflictResolution();
    },
    [
      pendingOperation,
      resolveConflictsWithDecisions,
      onResolve,
      closeConflictResolution,
    ],
  );

  return {
    conflictingFiles,
    conflictResolutionOpen,
    hasActiveConflictRef,

    checkForConflicts,
    startConflictResolution,
    resolveConflictsWithStrategy,
    resolveConflictsWithDecisions,
    openConflictResolution,
    closeConflictResolution,

    handleReplaceAll,
    handleDuplicateAll,
    handleCancelAll,
    handleDecideForEach,
  };
};
