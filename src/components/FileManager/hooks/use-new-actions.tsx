import { useMemo } from 'react';
import { IconFile, IconFileZip, IconFolder } from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import type { DropdownItem } from '@/models/dropdown';

export interface UseNewActionsProps {
  newActionLabels?: {
    uploadFiles?: string;
    newFolder?: string;
    uploadArchive?: string;
  };
  onUploadFiles?: () => void;
  onCreateFolder?: () => void;
  onUploadArchive?: () => void;
}

export interface UseNewActionsResult {
  newActions: DropdownItem[];
  isNewButtonVisible: boolean;
}

export const useNewActions = ({
  newActionLabels,
  onUploadFiles,
  onCreateFolder,
  onUploadArchive,
}: UseNewActionsProps): UseNewActionsResult => {
  const newActions = useMemo(() => {
    const actions: DropdownItem[] = [];

    if (!newActionLabels) {
      return actions;
    }

    if (newActionLabels.newFolder) {
      actions.push({
        key: 'new-folder',
        label: newActionLabels.newFolder,
        icon: <IconFolder {...BASE_ICON_PROPS} className="text-secondary" />,
        onClick: () => {
          if (onCreateFolder) {
            onCreateFolder();
          }
        },
      });
    }

    if (newActionLabels.uploadFiles) {
      actions.push({
        key: 'upload-file',
        label: newActionLabels.uploadFiles,
        icon: <IconFile {...BASE_ICON_PROPS} className="text-secondary" />,
        onClick: () => {
          if (onUploadFiles) {
            onUploadFiles();
          }
        },
      });
    }

    if (newActionLabels.uploadArchive) {
      actions.push({
        key: 'upload-archive',
        label: newActionLabels.uploadArchive,
        icon: <IconFileZip {...BASE_ICON_PROPS} className="text-secondary" />,
        onClick: () => {
          if (onUploadArchive) {
            onUploadArchive();
          }
        },
      });
    }

    return actions;
  }, [newActionLabels, onUploadFiles, onCreateFolder, onUploadArchive]);

  const isNewButtonVisible = useMemo(() => newActions.length > 0, [newActions]);

  return { newActions, isNewButtonVisible };
};
