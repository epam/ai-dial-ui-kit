import { useState } from 'react';

export const useCollapseTree = (initialState: boolean) => {
  const [isTreeCollapsed, setIsTreeCollapsed] = useState<boolean>(initialState);

  const toggleTreeCollapse = () => {
    setIsTreeCollapsed((prev) => !prev);
  };

  return {
    isTreeCollapsed,
    toggleTreeCollapse,
    setIsTreeCollapsed,
  };
};
