import type { DialFile } from '@/models/file';
import type { DialDeletedItem } from '@/models/file-manager';
import { useState, useCallback } from 'react';

export interface UseFileDeleteOptions {
  onDeleteFiles?: (items: DialDeletedItem[], sourceFolder: string) => void;
  onDeleteSuccess?: () => void;
}

export const useFileDelete = ({
  onDeleteFiles,
  onDeleteSuccess,
}: UseFileDeleteOptions) => {
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<DialFile[]>([]);
  const [parentFolderPath, setParentFolderPath] = useState<string>('');

  const openDeleteConfirmation = useCallback(
    (items: DialFile[], parentFolderPath: string) => {
      setItemsToDelete(items);
      setParentFolderPath(parentFolderPath);
      setDeleteConfirmationOpen(true);
    },
    [],
  );

  const closeDeleteConfirmation = useCallback(() => {
    setDeleteConfirmationOpen(false);
    setItemsToDelete([]);
  }, []);

  const confirmDelete = useCallback(() => {
    if (onDeleteFiles && itemsToDelete.length > 0) {
      const deletedItems: DialDeletedItem[] = itemsToDelete.map((file) => ({
        sourceUrl: file.path,
        nodeType: file.nodeType,
      }));
      onDeleteFiles(deletedItems, parentFolderPath);
      onDeleteSuccess?.();
    }
    closeDeleteConfirmation();
  }, [
    itemsToDelete,
    onDeleteFiles,
    onDeleteSuccess,
    closeDeleteConfirmation,
    parentFolderPath,
  ]);

  return {
    deleteConfirmationOpen,
    itemsToDelete,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDelete,
  };
};
