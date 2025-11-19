import type { DialFile } from '@/models/file';
import { useCallback } from 'react';

export interface UseFileDownloadOptions {
  onDownloadFiles?: (items: DialFile[]) => void;
}

export const useFileDownload = ({
  onDownloadFiles,
}: UseFileDownloadOptions) => {
  const handleDownloadFiles = useCallback(
    (items: DialFile[]) => {
      if (onDownloadFiles && items.length > 0) {
        onDownloadFiles(items);
      }
    },
    [onDownloadFiles],
  );

  return {
    handleDownloadFiles,
  };
};
