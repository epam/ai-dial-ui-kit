import type { DialFile } from '@/index';
import type { DialCopiedItem } from '@/types/file-manager';
import { useCallback, useMemo, useState } from 'react';

export interface UseFileClipboardOptions {
  getDestination: () => string;
  getDestinationFiles: () => DialFile[];
  onCopyFiles?: (items: DialCopiedItem[]) => void;
  onMoveToFiles?: (items: DialCopiedItem[]) => void;
}

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
  items: string[],
  destinationFiles: DialFile[],
): DialCopiedItem[] => {
  const existingNames = new Set(destinationFiles.map(getFileName));
  return items.map((path) => {
    const originalName = path.split('/').pop() ?? 'untitled';
    const resolvedName = resolveNameConflict(originalName, existingNames);
    existingNames.add(resolvedName);

    return {
      sourceUrl: path,
      destinationUrl: `${destinationUrl}/${resolvedName}`,
    };
  });
};

export const useFileClipboard = ({
  getDestination,
  getDestinationFiles,
  onCopyFiles,
  onMoveToFiles,
}: UseFileClipboardOptions) => {
  const [copied, setCopied] = useState<Set<string>>(new Set());
  const [cut, setCut] = useState<Set<string>>(new Set());

  const copy = useCallback((files: string[]) => {
    setCopied(new Set(files));
    setCut(new Set());
  }, []);

  const cutFiles = useCallback((files: string[]) => {
    setCut(new Set(files));
    setCopied(new Set());
  }, []);

  const clear = useCallback(() => {
    setCopied(new Set());
    setCut(new Set());
  }, []);

  const paste = useCallback(() => {
    const destination = getDestination();
    const destinationFiles = getDestinationFiles();

    if (copied.size > 0) {
      const resolvedItems = getCopiedItems(
        destination,
        Array.from(copied),
        destinationFiles,
      );
      onCopyFiles?.(resolvedItems);
      setCopied(new Set());
    } else if (cut.size > 0) {
      const resolvedItems = getCopiedItems(
        destination,
        Array.from(cut),
        destinationFiles,
      );

      onMoveToFiles?.(resolvedItems);
      setCut(new Set());
    }
  }, [
    copied,
    cut,
    getDestination,
    getDestinationFiles,
    onCopyFiles,
    onMoveToFiles,
  ]);

  const state = useMemo(
    () => ({
      copied,
      cut,
      hasItems: copied.size > 0 || cut.size > 0,
    }),
    [copied, cut],
  );

  return { state, copy, cut: cutFiles, paste, clear };
};
