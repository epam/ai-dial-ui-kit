import { useCallback, useState } from 'react';
import type { DialFile } from '@/models/file';

export interface UseFileMetadataProps {
  onGetInfo?: (file: DialFile) => void | Promise<void>;
}

export const useFileMetadata = ({ onGetInfo }: UseFileMetadataProps) => {
  const [isMetadataPopupOpen, setIsMetadataPopupOpen] = useState(false);
  const [selectedFileForMetadata, setSelectedFileForMetadata] = useState<
    DialFile | undefined
  >(undefined);

  const openMetadataPopup = useCallback(
    async (file: DialFile) => {
      setSelectedFileForMetadata(file);
      setIsMetadataPopupOpen(true);
      if (onGetInfo) {
        await onGetInfo(file);
      }
    },
    [onGetInfo],
  );

  const closeMetadataPopup = useCallback(() => {
    setIsMetadataPopupOpen(false);
    setSelectedFileForMetadata(undefined);
  }, []);

  return {
    isMetadataPopupOpen,
    selectedFileForMetadata,
    openMetadataPopup,
    closeMetadataPopup,
  };
};
