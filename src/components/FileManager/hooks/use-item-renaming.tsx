import type { DialFile } from '@/models/file';
import type { DialCopiedItem } from '@/models/file-manager';
import { useCallback, useState, useMemo } from 'react';
import { findNodeByPath } from '@/components/FileManager/utils';
import { DialFileNodeType } from '@/models/file';
import {
  DEFAULT_ERRORS,
  DEFAULT_WARNINGS,
} from '@/components/FileManager/errors';

export interface RenameValidationMessages {
  emptyName?: string;
  duplicateName?: string;
  hiddenItemWarning?: string;
  consecutiveDotsError?: string;
}

const DEFAULT_VALIDATION_MESSAGES: Required<RenameValidationMessages> = {
  emptyName: 'Name cannot be empty',
  duplicateName: 'An item with this name already exists',
  hiddenItemWarning: DEFAULT_WARNINGS.hiddenItemWarning,
  consecutiveDotsError: DEFAULT_ERRORS.consecutiveDotsError,
};

function trimTrailingSlashes(path: string): string {
  let i = path.length;
  while (i > 0 && path[i - 1] === '/') i--;
  return path.slice(0, i);
}

function changeLastPathSegment(path: string, newName: string): string {
  const trimmed = trimTrailingSlashes(path);
  const lastSlashIndex = trimmed.lastIndexOf('/');

  if (lastSlashIndex === -1) {
    return newName;
  }

  const base = trimmed.slice(0, lastSlashIndex + 1);
  return base + newName;
}

function getFileNameWithoutExtension(name: string): string {
  const lastDotIndex = name.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return name;
  }
  return name.substring(0, lastDotIndex);
}

function getFileExtension(name: string): string {
  const lastDotIndex = name.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return '';
  }
  return name.substring(lastDotIndex);
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
      if (!renamedItem || !onMoveToFiles) {
        setRenamedItem(undefined);
        return;
      }

      const isFile = renamedItem.nodeType === DialFileNodeType.ITEM;
      let fullName = value.trim();

      if (isFile) {
        const extension = getFileExtension(renamedItem.name);
        if (extension && !fullName.endsWith(extension)) {
          fullName = fullName + extension;
        }
      }

      if (fullName === renamedItem.name) {
        setRenamedItem(undefined);
        return;
      }

      const destinationFolder = changeLastPathSegment(
        renamedItem.path,
        fullName,
      );

      const parentPath = renamedItem.parentPath;
      if (!parentPath) {
        setRenamedItem(undefined);
        return;
      }

      const copiedItem: DialCopiedItem = {
        sourceUrl: renamedItem.path,
        destinationUrl: destinationFolder,
        nodeType: renamedItem.nodeType,
      };

      onMoveToFiles([copiedItem], parentPath, parentPath);
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

      if (trimmedName.includes('..')) {
        return messages.consecutiveDotsError;
      }

      if (trimmedName.startsWith('.')) {
        return messages.hiddenItemWarning;
      }

      const isFile = item.nodeType === DialFileNodeType.ITEM;
      let fullName = trimmedName;

      if (isFile) {
        const extension = getFileExtension(item.name);
        if (extension && !fullName.endsWith(extension)) {
          fullName = fullName + extension;
        }
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

          if (existingNames.has(fullName.toLowerCase())) {
            return messages.duplicateName;
          }
        }
      }

      if (onRenameValidate) {
        const customError = onRenameValidate(fullName, item);
        if (customError) {
          return customError;
        }
      }

      return null;
    },
    [onRenameValidate, messages, items],
  );

  const getDisplayName = useCallback((item: DialFile): string => {
    if (item.nodeType === DialFileNodeType.ITEM) {
      return getFileNameWithoutExtension(item.name);
    }
    return item.name;
  }, []);

  return {
    renamedPath,
    renamedItem,
    renameHandler,
    renameSaveHandler,
    renameCancelHandler,
    renameValidateHandler,
    getDisplayName,
  };
};
