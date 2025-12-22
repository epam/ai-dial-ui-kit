import { useState, useCallback, useMemo, useEffect } from 'react';

export interface UseExpandedPathsOptions {
  expandedPaths?: Set<string>;
  onExpandedPathsChange?: (expandedPaths: Set<string>) => void;
}

export const useExpandedPaths = (options?: UseExpandedPathsOptions) => {
  const [internalExpandedPaths, setInternalExpandedPaths] = useState<
    Set<string>
  >(options?.expandedPaths ?? new Set());

  const isControlled = useMemo(
    () => !!options?.onExpandedPathsChange,
    [options?.onExpandedPathsChange],
  );

  const expandedPaths = useMemo(
    () =>
      isControlled
        ? (options?.expandedPaths ?? new Set<string>())
        : internalExpandedPaths,
    [isControlled, options?.expandedPaths, internalExpandedPaths],
  );

  useEffect(() => {
    if (isControlled && options?.expandedPaths) {
      setInternalExpandedPaths(new Set(options.expandedPaths));
    }
  }, [isControlled, options?.expandedPaths]);

  const setExpandedPaths = useCallback(
    (newSet: Set<string>) => {
      if (isControlled) {
        options?.onExpandedPathsChange?.(newSet);
      } else {
        setInternalExpandedPaths(newSet);
      }
    },
    [isControlled, options],
  );

  const togglePath = useCallback(
    (path: string) => {
      const newSet = new Set<string>(expandedPaths);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      setExpandedPaths(newSet);
    },
    [expandedPaths, setExpandedPaths],
  );

  const collapseAll = useCallback(() => {
    setExpandedPaths(new Set<string>());
  }, [setExpandedPaths]);

  const expandPath = useCallback(
    (path: string) => {
      const newSet = new Set<string>(expandedPaths);
      newSet.add(path);
      setExpandedPaths(newSet);
    },
    [expandedPaths, setExpandedPaths],
  );

  const collapsePath = useCallback(
    (path: string) => {
      const newSet = new Set<string>(expandedPaths);
      newSet.delete(path);
      setExpandedPaths(newSet);
    },
    [expandedPaths, setExpandedPaths],
  );

  return {
    expandedPaths,
    setExpandedPaths,
    togglePath,
    collapseAll,
    expandPath,
    collapsePath,
    isControlled,
  };
};
