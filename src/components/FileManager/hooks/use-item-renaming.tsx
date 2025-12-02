import type { DialFile } from '@/models/file';
import type { DialCopiedItem } from '@/models/file-manager';
import { useCallback, useState, useMemo } from 'react';
import { findNodeByPath } from '@/components/FileManager/utils';

export interface RenameValidationMessages {
  emptyName?: string;
  duplicateName?: string;
}

const DEFAULT_VALIDATION_MESSAGES: Required<RenameValidationMessages> = {
  emptyName: 'Name cannot be empty',
  duplicateName: 'An item with this name already exists',
};

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
  onRenameValidate,
  validationMessages,
  onMoveToFiles,
}: {
  items?: DialFile[];
  onRenameValidate?: (value: string, item: DialFile) => string | null;
  validationMessages?: RenameValidationMessages;
  onMoveToFiles?: (
    items: DialCopiedItem[],
    sourceFolder: string,
    destinationFolder: string,
  ) => void;
}) => {
  const [renamedPath, setRenamedPath] = useState<string | undefined>();

  const messages = useMemo(
    () => ({
      ...DEFAULT_VALIDATION_MESSAGES,
      ...validationMessages,
    }),
    [validationMessages],
  );

  const renameHandler = useCallback((path: string) => {
    setRenamedPath(path);
  }, []);

  const renameCancelHandler = useCallback(() => {
    setRenamedPath(undefined);
  }, []);

  const renameSaveHandler = useCallback(
    (value: string) => {
      if (renamedPath) {
        const destinationPath = changeLastPathSegment(renamedPath, value);
        const targetNode = findNodeByPath(items, renamedPath);

        if (targetNode && onMoveToFiles) {
          const affected = collectCopiedItems(
            targetNode,
            renamedPath,
            destinationPath,
          );
          onMoveToFiles(affected, renamedPath, destinationPath);
        }
      }

      setRenamedPath(undefined);
    },
    [renamedPath, onMoveToFiles, items],
  );

  const renameValidateHandler = useCallback(
    (value: string, item: DialFile): string | null => {
      const trimmedName = value.trim();

      if (!trimmedName) {
        return messages.emptyName;
      }

      const parentPath = item.parentPath;
      if (parentPath) {
        const parentFolder = findNodeByPath(items, parentPath);
        if (parentFolder) {
          const existingNames = new Set(
            (parentFolder.items ?? [])
              .filter((sibling) => sibling.path !== item.path)
              .map((sibling) => sibling.name.toLowerCase()),
          );

          if (existingNames.has(trimmedName.toLowerCase())) {
            return messages.duplicateName;
          }
        }
      }

      if (onRenameValidate) {
        const customError = onRenameValidate(trimmedName, item);
        if (customError) {
          return customError;
        }
      }

      return null;
    },
    [onRenameValidate, messages, items],
  );

  return {
    renamedPath,
    renameHandler,
    renameSaveHandler,
    renameCancelHandler,
    renameValidateHandler,
  };
};
