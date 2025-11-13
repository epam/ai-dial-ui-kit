import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import type { DialCopiedItem } from '@/types/file-manager';
import { useCallback, useMemo, useState } from 'react';

export interface UseFileClipboardOptions {
  getDestination: () => string;
  getDestinationFiles: () => DialFile[];
  getSourceFiles: () => DialFile[];
  onCopyFiles?: (items: DialCopiedItem[], destinationFolder: string) => void;
  onMoveToFiles?: (
    items: DialCopiedItem[],
    sourceFolder: string,
    destinationFolder: string,
  ) => void;
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

const findFileByPath = (
  files: DialFile[],
  path: string,
): DialFile | undefined => {
  for (const file of files) {
    if (file.path === path) {
      return file;
    }
    if (file.items) {
      const found = findFileByPath(file.items, path);
      if (found) return found;
    }
  }
  return undefined;
};

const getCopiedItems = (
  destinationUrl: string,
  items: string[],
  destinationFiles: DialFile[],
  sourceFiles: DialFile[],
  overwrite = false,
): DialCopiedItem[] => {
  const existingNames = new Set(destinationFiles.map(getFileName));

  return items.map((path) => {
    const originalName = path.split('/').pop() ?? 'untitled';
    const sourceFile = findFileByPath(sourceFiles, path);

    const finalName = overwrite
      ? originalName
      : resolveNameConflict(originalName, existingNames);

    if (!overwrite) {
      existingNames.add(finalName);
    }

    return {
      sourceUrl: path,
      destinationUrl: `${destinationUrl}/${finalName}`,
      overwrite,
      nodeType: sourceFile?.nodeType ?? DialFileNodeType.ITEM,
    };
  });
};

const findParentFolder = (files: DialFile[], path: string): string => {
  const segments = path.split('/').filter(Boolean);
  if (segments.length <= 1) return '/';
  segments.pop();
  return '/' + segments.join('/');
};

export const useFileClipboard = ({
  getDestination,
  getDestinationFiles,
  getSourceFiles,
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

  const paste = useCallback(
    (overwrite = false) => {
      const destination = getDestination();
      const destinationFiles = getDestinationFiles();
      const sourceFiles = getSourceFiles();

      if (copied.size > 0) {
        const resolvedItems = getCopiedItems(
          destination,
          Array.from(copied),
          destinationFiles,
          sourceFiles,
          overwrite,
        );
        onCopyFiles?.(resolvedItems, destination);
        setCopied(new Set());
      } else if (cut.size > 0) {
        const resolvedItems = getCopiedItems(
          destination,
          Array.from(cut),
          destinationFiles,
          sourceFiles,
          overwrite,
        );

        const sourceFolders = new Set(
          Array.from(cut).map((path) => findParentFolder(sourceFiles, path)),
        );
        const sourceFolder =
          sourceFolders.size === 1 ? Array.from(sourceFolders)[0] : '';

        onMoveToFiles?.(resolvedItems, sourceFolder, destination);
        setCut(new Set());
      }
    },
    [
      copied,
      cut,
      getDestination,
      getDestinationFiles,
      getSourceFiles,
      onCopyFiles,
      onMoveToFiles,
    ],
  );

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
