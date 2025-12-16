import { useState, useEffect, useCallback, useRef } from 'react';

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
  const isFirstRender = useRef(true);

  useEffect(() => {
    setCurrentPath(path);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

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
