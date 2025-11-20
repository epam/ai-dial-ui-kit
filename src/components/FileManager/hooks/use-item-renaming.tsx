import type { DialFile } from '@/models/file';
import type { DialCopiedItem } from '@/types/file-manager';
import { useCallback, useState } from 'react';
import { findNodeByPath } from '@/components/FileManager/utils';

function collectCopiedItems(
  node: DialFile,
  oldBase: string,
  newBase: string,
): DialCopiedItem[] {
  const newPath = node.path.replace(oldBase, newBase);
  const selfItem: DialCopiedItem = {
    sourceUrl: node.path,
    destinationUrl: newPath,
    nodeType: node.nodeType,
  };

  if (!node.items || node.items.length === 0) {
    return [selfItem];
  }

  const childItems = node.items.flatMap((child) =>
    collectCopiedItems(child, oldBase, newBase),
  );

  return [selfItem, ...childItems];
}

function changeLastPathSegment(path: string, newName: string): string {
  const parts = path.replace(/\/+$/, '').split('/');
  parts[parts.length - 1] = newName;
  return parts.join('/');
}

export const useItemRenaming = ({
  items,
  onRename,
  onRenameSave,
  onRenameCancel,
  onRenameValidate,
  onMoveToFiles,
}: {
  items?: DialFile[];
  onRename?: (path: string) => void;
  onRenameSave?: (value: string) => void;
  onRenameCancel?: () => void;
  onRenameValidate?: (value: string, item: DialFile) => string | null;
  onMoveToFiles?: (
    items: DialCopiedItem[],
    sourceFolder: string,
    destinationFolder: string,
  ) => void;
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
      if (onMoveToFiles && renamedPath) {
        const destinationPath = changeLastPathSegment(renamedPath, value);
        const targetNode = findNodeByPath(items, renamedPath);

        if (targetNode) {
          const affected = collectCopiedItems(
            targetNode,
            renamedPath,
            destinationPath,
          );
          onMoveToFiles(affected, renamedPath, destinationPath);
        }
      }

      setRenamedPath(undefined);
      onRenameSave?.(value);
    },
    [onRenameSave, renamedPath, onMoveToFiles, items],
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
