import type { DialFile } from '@/index';
import type { CopiedItem } from '@/types/file-manager';
import { useCallback, useMemo, useState } from 'react';
import { getCopiedItems } from '../utils';

export interface UseFileClipboardOptions {
  getDestination: () => string;
  getAllFiles: () => DialFile[];
  onCopyFiles?: (items: CopiedItem[]) => void;
  onMoveToFiles?: (items: CopiedItem[]) => void;
}

/**
 * Finds the destination folder by path in the file tree
 */

export const useFileClipboard = ({
  getDestination,
  getAllFiles,
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
    const allFiles = getAllFiles();

    if (copied.size > 0) {
      const resolvedItems = getCopiedItems(
        destination,
        Array.from(copied),
        allFiles,
      );
      onCopyFiles?.(resolvedItems);
      setCopied(new Set());
    } else if (cut.size > 0) {
      const resolvedItems = getCopiedItems(
        destination,
        Array.from(cut),
        allFiles,
      );

      onMoveToFiles?.(resolvedItems);
      setCut(new Set());
    }
  }, [copied, cut, getDestination, getAllFiles, onCopyFiles, onMoveToFiles]);

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
