import { useCallback, useMemo, useState } from 'react';

export interface UseFileClipboardOptions {
  getDestination: () => string;
  onCopyFiles?: (files: string[], destination: string) => void;
  onMoveToFiles?: (files: string[], destination: string) => void;
}

export const useFileClipboard = ({
  getDestination,
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
    if (copied.size > 0) {
      onCopyFiles?.(Array.from(copied), destination);
      setCopied(new Set());
    } else if (cut.size > 0) {
      onMoveToFiles?.(Array.from(cut), destination);
      setCut(new Set());
    }
  }, [copied, cut, getDestination, onCopyFiles, onMoveToFiles]);

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
