import { useState, useCallback } from 'react';

export interface UseCurrentPathOptions {
  path?: string;
  defaultPath?: string;
  onPathChange?: (nextPath?: string) => void;
  onSelectionClear?: () => void;
}

interface UseCurrentPathResult {
  currentPath?: string;
  setCurrentPath: (nextPath?: string) => void;
  handlePathChange: (nextPath?: string) => void;
}

export const useCurrentPath = ({
  path,
  defaultPath,
  onPathChange,
  onSelectionClear,
}: UseCurrentPathOptions): UseCurrentPathResult => {
  const isControlled = path !== undefined;

  const [internalPath, setInternalPath] = useState<string | undefined>(
    defaultPath,
  );

  const currentPath = isControlled ? path : internalPath;

  const setCurrentPath = useCallback(
    (nextPath?: string) => {
      if (!isControlled) {
        setInternalPath(nextPath);
      }
      onPathChange?.(nextPath);
    },
    [isControlled, onPathChange],
  );

  const handlePathChange = useCallback(
    (nextPath?: string) => {
      setCurrentPath(nextPath);
      onSelectionClear?.();
    },
    [setCurrentPath, onSelectionClear],
  );

  return {
    currentPath,
    setCurrentPath,
    handlePathChange,
  };
};
