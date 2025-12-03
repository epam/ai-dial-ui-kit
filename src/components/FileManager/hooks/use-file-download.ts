import type { DialFile } from '@/models/file';
import { useCallback } from 'react';

export interface UseFileDownloadOptions {
  onDownloadFiles?: (items: DialFile[]) => void;
  onDownloadSuccess?: () => void;
}

export const useFileDownload = ({
  onDownloadFiles,
  onDownloadSuccess,
}: UseFileDownloadOptions) => {
  const handleDownloadFiles = useCallback(
    (items: DialFile[]) => {
      if (onDownloadFiles && items.length > 0) {
        onDownloadFiles(items);
        onDownloadSuccess?.();
      }
    },
    [onDownloadFiles, onDownloadSuccess],
  );

  return {
    handleDownloadFiles,
  };
};
