import { FileManagerRenameTriggerView } from '@/types/file-manager';
import { useCallback, useState } from 'react';

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
    useState<FileManagerRenameTriggerView>(FileManagerRenameTriggerView.Grid);

  const onGridRename = useCallback(
    (path: string) => {
      onRename(path);
      setRenameTriggerView(FileManagerRenameTriggerView.Grid);
    },
    [onRename],
  );

  const onTreeRename = useCallback(
    (path: string) => {
      onRename(path);
      setRenameTriggerView(FileManagerRenameTriggerView.Tree);
    },
    [onRename],
  );

  return {
    renameTriggerView,
    onGridRename,
    onTreeRename,
  };
};
