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
  const [renamedItem, setRenamedItem] = useState<DialFile | undefined>();

  const messages = useMemo(
    () => ({
      ...DEFAULT_VALIDATION_MESSAGES,
      ...validationMessages,
    }),
    [validationMessages],
  );

  const renamedPath = useMemo(() => renamedItem?.path, [renamedItem]);

  const renameHandler = useCallback(
    (path: string) => {
      const item = findNodeByPath(items, path);
      if (item) {
        setRenamedItem(item);
      }
    },
    [items],
  );

  const renameCancelHandler = useCallback(() => {
    setRenamedItem(undefined);
  }, []);

  const renameSaveHandler = useCallback(
    (value: string) => {
      if (renamedItem && onMoveToFiles) {
        const destinationFolder = changeLastPathSegment(
          renamedItem.path,
          value,
        );

        const parentPath = renamedItem.parentPath;

        const copiedItem: DialCopiedItem = {
          sourceUrl: renamedItem.path,
          destinationUrl: destinationFolder,
          nodeType: renamedItem.nodeType,
        };

        if (!parentPath) return;

        onMoveToFiles([copiedItem], parentPath, parentPath);
      }

      setRenamedItem(undefined);
    },
    [renamedItem, onMoveToFiles],
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
    renamedItem,
    renameHandler,
    renameSaveHandler,
    renameCancelHandler,
    renameValidateHandler,
  };
};
