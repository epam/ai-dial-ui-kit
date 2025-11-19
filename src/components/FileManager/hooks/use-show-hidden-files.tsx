import { useState, useCallback } from 'react';

export interface UseShowHiddenFilesOptions {
  showHiddenFiles?: boolean;
  onShowHiddenFilesChange?: (showHiddenFiles: boolean) => void;
}

export const useShowHiddenFiles = (options?: UseShowHiddenFilesOptions) => {
  const [internalShowHiddenFiles, setInternalShowHiddenFiles] =
    useState<boolean>(options?.showHiddenFiles ?? false);

  const isControlled = !!options?.onShowHiddenFilesChange;
  const areHiddenFilesVisible = isControlled
    ? (options.showHiddenFiles ?? false)
    : internalShowHiddenFiles;

  const setAreHiddenFilesVisible = useCallback(
    (value: boolean) => {
      if (isControlled) {
        options?.onShowHiddenFilesChange?.(value);
      } else {
        setInternalShowHiddenFiles(value);
      }
    },
    [isControlled, options],
  );

  const toggleHiddenFilesVisibility = useCallback(() => {
    const nextValue = !areHiddenFilesVisible;
    if (isControlled) {
      options?.onShowHiddenFilesChange?.(nextValue);
    } else {
      setInternalShowHiddenFiles(nextValue);
    }
  }, [areHiddenFilesVisible, isControlled, options]);

  return {
    areHiddenFilesVisible,
    toggleHiddenFilesVisibility,
    setAreHiddenFilesVisible,
  };
};
