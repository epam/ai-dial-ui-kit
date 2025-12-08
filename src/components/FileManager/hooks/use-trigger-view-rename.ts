import { useCallback, useState } from 'react';

type RenameView = 'tree' | 'grid';

interface UseTriggerViewRenameOptions {
  onRename: (path: string) => void;
}

/**
 * Manages which view ("tree" or "grid") triggered a rename action.
 *
 * Useful when both TreeView and GridView can initiate renaming,
 * and the parent needs to know which source triggered it
 * to apply view-specific logic or UI updates.
 *
 * Returns the last rename trigger source and two handlers
 * (`onGridRename`, `onTreeRename`) that wrap the provided `onRename` callback.
 */
export const useTriggerViewRename = ({
  onRename,
}: UseTriggerViewRenameOptions) => {
  const [renameTriggerView, setRenameTriggerView] =
    useState<RenameView>('grid');

  const onGridRename = useCallback(
    (path: string) => {
      onRename(path);
      setRenameTriggerView('grid');
    },
    [onRename],
  );

  const onTreeRename = useCallback(
    (path: string) => {
      onRename(path);
      setRenameTriggerView('tree');
    },
    [onRename],
  );

  return {
    renameTriggerView,
    onGridRename,
    onTreeRename,
  };
};
