import type { DialFile } from '@/models/file';
import { useCallback, useState } from 'react';

export const useItemRenaming = ({
  onRename,
  onRenameSave,
  onRenameCancel,
  onRenameValidate,
}: {
  onRename?: (path: string) => void;
  onRenameSave?: (value: string) => void;
  onRenameCancel?: () => void;
  onRenameValidate?: (value: string, item: DialFile) => string | null;
}) => {
  const [renamedPath, setRenamedPath] = useState<string | undefined>();

  const renameHandler = useCallback(
    (path: string) => {
      onRename?.(path);
      setRenamedPath(path);
    },
    [onRename],
  );

  const renameCancelHandler = useCallback(() => {
    setRenamedPath(undefined);
    onRenameCancel?.();
  }, [onRenameCancel]);

  const renameSaveHandler = useCallback(
    (value: string) => {
      setRenamedPath(undefined);
      onRenameSave?.(value);
    },
    [onRenameSave],
  );

  const renameValidateHandler = useCallback(
    (value: string, item: DialFile) => {
      return onRenameValidate?.(value, item) ?? null;
    },
    [onRenameValidate],
  );

  return {
    renamedPath,
    renameHandler,
    renameSaveHandler,
    renameCancelHandler,
    renameValidateHandler,
  };
};
