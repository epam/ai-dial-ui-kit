import type { DialFile } from '@/models/file';
import { useState, useCallback } from 'react';

export interface UseFileDeleteOptions {
  onDeleteFiles?: (items: DialFile[], sourceFolder: string) => void;
  getCurrentPath: () => string;
}

export const useFileDelete = ({
  onDeleteFiles,
  getCurrentPath,
}: UseFileDeleteOptions) => {
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<DialFile[]>([]);

  const openDeleteConfirmation = useCallback((items: DialFile[]) => {
    setItemsToDelete(items);
    setDeleteConfirmationOpen(true);
  }, []);

  const closeDeleteConfirmation = useCallback(() => {
    setDeleteConfirmationOpen(false);
    setItemsToDelete([]);
  }, []);

  const confirmDelete = useCallback(() => {
    const currentPath = getCurrentPath();
    if (onDeleteFiles && itemsToDelete.length > 0) {
      onDeleteFiles(itemsToDelete, currentPath);
    }
    closeDeleteConfirmation();
  }, [itemsToDelete, onDeleteFiles, getCurrentPath, closeDeleteConfirmation]);

  return {
    deleteConfirmationOpen,
    itemsToDelete,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDelete,
  };
};
