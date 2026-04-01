import type { DialFile } from '@/models/file';
import { useCallback } from 'react';

export interface UseFileDownloadOptions {
  onDownloadFiles?: (items: DialFile[]) => void;
  customDownloadItemsAction?: (items: DialFile[]) => void;
  onDownloadSuccess?: () => void;
}

export const useFileDownload = ({
  onDownloadFiles,
  customDownloadItemsAction,
  onDownloadSuccess,
}: UseFileDownloadOptions) => {
  const handleDownloadFiles = useCallback(
    (items: DialFile[]) => {
      if (customDownloadItemsAction && items.length > 0) {
        customDownloadItemsAction(items);
      } else if (onDownloadFiles && items.length > 0) {
        onDownloadFiles(items);
        onDownloadSuccess?.();
      }
    },
    [onDownloadFiles, onDownloadSuccess, customDownloadItemsAction],
  );

  return {
    handleDownloadFiles,
  };
};
