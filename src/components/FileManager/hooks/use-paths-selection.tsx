import { useCallback, useMemo, useState } from 'react';

interface UsePathsSelectionParams {
  selectedPaths?: Set<string>;
  defaultSelectedPaths?: Set<string>;
  onSelectedPathsChange?: (paths: Set<string>) => void;
}

interface UsePathsSelectionResult {
  selectedPaths: Set<string>;
  setSelectedPaths: (paths: Set<string>) => void;
  clearSelection: () => void;
  isControlled: boolean;
}

export function usePathsSelection({
  selectedPaths,
  defaultSelectedPaths,
  onSelectedPathsChange,
}: UsePathsSelectionParams): UsePathsSelectionResult {
  const isControlled = selectedPaths !== undefined;

  const [internalSelectedPaths, setInternalSelectedPaths] = useState<
    Set<string>
  >(() => defaultSelectedPaths ?? new Set());

  const effectiveSelectedPaths = useMemo(
    () => (isControlled ? selectedPaths! : internalSelectedPaths),
    [isControlled, selectedPaths, internalSelectedPaths],
  );

  const setSelectedPaths = useCallback(
    (paths: Set<string>) => {
      const next = new Set(paths);
      onSelectedPathsChange?.(next);

      if (!isControlled) {
        setInternalSelectedPaths(next);
      }
    },
    [isControlled, onSelectedPathsChange],
  );

  const clearSelection = useCallback(() => {
    setSelectedPaths(new Set());
  }, [setSelectedPaths]);

  return {
    selectedPaths: effectiveSelectedPaths,
    setSelectedPaths,
    clearSelection,
    isControlled,
  };
}
