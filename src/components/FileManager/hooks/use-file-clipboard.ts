import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import type { DialCopiedItem } from '@/models/file-manager';
import { useCallback, useState } from 'react';

export interface UseFileClipboardOptions {
  getDestinationFiles: (path: string) => DialFile[];
  getSourceFiles: () => DialFile[];
  onCopyFiles?: (items: DialCopiedItem[], destinationFolder: string) => void;
  onMoveToFiles?: (
    items: DialCopiedItem[],
    sourceFolder: string,
    destinationFolder: string,
  ) => void;
}

export type DestinationFolderMode = 'copy' | 'move';

/**
 * Resolves filename conflicts by adding (1), (2), etc.
 * Example: "file.txt" -> "file (1).txt" -> "file (2).txt"
 */
const resolveNameConflict = (
  originalName: string,
  existingNames: Set<string>,
): string => {
  if (!existingNames.has(originalName)) {
    return originalName;
  }

  const lastDotIndex = originalName.lastIndexOf('.');
  const hasExtension = lastDotIndex > 0;

  const baseName = hasExtension
    ? originalName.substring(0, lastDotIndex)
    : originalName;
  const extension = hasExtension ? originalName.substring(lastDotIndex) : '';

  let counter = 1;
  let newName: string;

  do {
    newName = `${baseName} (${counter})${extension}`;
    counter++;
  } while (existingNames.has(newName));

  return newName;
};

const getFileName = (file: DialFile): string => {
  return file.name;
};

const getCopiedItems = (
  destinationUrl: string,
  items: DialFile[],
  destinationFiles: DialFile[],
  overwrite = false,
): DialCopiedItem[] => {
  const existingNames = new Set(destinationFiles.map(getFileName));

  return items.map((file) => {
    const originalName = file.name;

    const finalName = overwrite
      ? originalName
      : resolveNameConflict(originalName, existingNames);

    if (!overwrite) {
      existingNames.add(finalName);
    }

    return {
      sourceUrl: file.path,
      destinationUrl: `${destinationUrl}/${finalName}`,
      overwrite,
      nodeType: file.nodeType ?? DialFileNodeType.ITEM,
    };
  });
};

export const useFileClipboard = ({
  getDestinationFiles,
  onCopyFiles,
  onMoveToFiles,
}: UseFileClipboardOptions) => {
  const [openDestinationFolderPopup, setOpenDestinationFolderPopup] =
    useState<boolean>(false);
  const [copiedFiles, setCopiedFiles] = useState<DialFile[]>([]);
  const [movedFiles, setMovedFiles] = useState<DialFile[]>([]);
  const [destinationFolderMode, setDestinationFolderMode] =
    useState<DestinationFolderMode>('copy');

  const handleCopyTo = useCallback(
    (destinationFolder: string) => {
      const destinationFiles = getDestinationFiles(destinationFolder);
      const resolvedItems = getCopiedItems(
        destinationFolder,
        copiedFiles,
        destinationFiles,
        false,
      );
      onCopyFiles?.(resolvedItems, destinationFolder);
    },
    [getDestinationFiles, onCopyFiles, copiedFiles],
  );

  const handleMoveTo = useCallback(
    (destinationFolder: string, sourceFolder: string) => {
      const destinationFiles = getDestinationFiles(destinationFolder);
      const resolvedItems = getCopiedItems(
        destinationFolder,
        movedFiles,
        destinationFiles,
        true,
      );
      onMoveToFiles?.(resolvedItems, sourceFolder, destinationFolder);
    },
    [getDestinationFiles, onMoveToFiles, movedFiles],
  );

  const handleDuplicate = useCallback(
    (files: DialFile[]) => {
      const destinationUrl = files.at(0)?.parentPath ?? '/';
      const destinationFiles = getDestinationFiles(destinationUrl);
      const resolvedItems = getCopiedItems(
        destinationUrl,
        files,
        destinationFiles,
        false,
      );
      onCopyFiles?.(resolvedItems, destinationUrl);
    },
    [onCopyFiles, getDestinationFiles],
  );

  const handleOpenDestinationFolderPopup = useCallback(
    (mode: DestinationFolderMode) => {
      setDestinationFolderMode(mode);
      setOpenDestinationFolderPopup(true);
    },
    [],
  );

  const clearState = useCallback(() => {
    setCopiedFiles([]);
    setMovedFiles([]);
  }, []);

  const handleCloseDestinationFolderPopup = useCallback(() => {
    setOpenDestinationFolderPopup(false);
    clearState();
  }, [clearState]);

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
  };
};
