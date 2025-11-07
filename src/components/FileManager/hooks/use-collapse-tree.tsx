import { useState, useCallback } from 'react';

export interface UseCollapseTreeOptions {
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

export const useCollapseTree = (options?: UseCollapseTreeOptions) => {
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(
    options?.collapsed ?? false,
  );

  const isControlled = !!options?.onCollapseChange;
  const isTreeCollapsed = isControlled
    ? (options.collapsed ?? false)
    : internalCollapsed;

  const setIsTreeCollapsed = useCallback(
    (value: boolean) => {
      if (isControlled) {
        options?.onCollapseChange?.(value);
      } else {
        setInternalCollapsed(value);
      }
    },
    [isControlled, options],
  );

  const toggleTreeCollapse = useCallback(() => {
    const nextValue = !isTreeCollapsed;
    if (isControlled) {
      options?.onCollapseChange?.(nextValue);
    } else {
      setInternalCollapsed(nextValue);
    }
  }, [isTreeCollapsed, isControlled, options]);

  return {
    isTreeCollapsed,
    toggleTreeCollapse,
    setIsTreeCollapsed,
  };
};
