import { useState, useEffect, useCallback } from 'react';

export interface UseCurrentPathOptions {
  path?: string;
  onPathChange?: (nextPath?: string) => void;
  onSelectionClear?: () => void;
}

export const useCurrentPath = ({
  path,
  onPathChange,
  onSelectionClear,
}: UseCurrentPathOptions) => {
  const [currentPath, setCurrentPath] = useState<string | undefined>(path);

  useEffect(() => {
    setCurrentPath(path);
    onSelectionClear?.();
  }, [path, onSelectionClear]);

  const handlePathChange = useCallback(
    (nextPath?: string) => {
      setCurrentPath(nextPath);
      onPathChange?.(nextPath);
      onSelectionClear?.();
    },
    [onPathChange, onSelectionClear],
  );

  return {
    currentPath,
    setCurrentPath,
    handlePathChange,
  };
};
