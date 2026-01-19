import { useMemo } from 'react';
import { IconFile, IconFileZip, IconFolder } from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import type { DropdownItem } from '@/models/dropdown';
import type { NewAction } from '../FileManager';

export interface UseNewActionsProps {
  newActions?: {
    uploadFiles?: NewAction;
    newFolder?: NewAction;
    uploadArchive?: NewAction;
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
  newActions,
  onUploadFiles,
  onCreateFolder,
  onUploadArchive,
}: UseNewActionsProps): UseNewActionsResult => {
  const newActionItems = useMemo(() => {
    const actions: DropdownItem[] = [];

    if (!newActions) {
      return actions;
    }

    if (newActions.newFolder) {
      actions.push({
        key: 'new-folder',
        label: newActions.newFolder.label,
        icon:
          newActions?.newFolder?.icon !== undefined ? (
            newActions?.newFolder?.icon
          ) : (
            <IconFolder {...BASE_ICON_PROPS} className="text-secondary" />
          ),
        onClick: () => {
          if (onCreateFolder) {
            onCreateFolder();
          }
        },
      });
    }

    if (newActions.uploadFiles) {
      actions.push({
        key: 'upload-file',
        label: newActions.uploadFiles.label,
        icon:
          newActions?.uploadFiles?.icon !== undefined ? (
            newActions?.uploadFiles?.icon
          ) : (
            <IconFile {...BASE_ICON_PROPS} className="text-secondary" />
          ),
        onClick: () => {
          if (onUploadFiles) {
            onUploadFiles();
          }
        },
      });
    }

    if (newActions.uploadArchive) {
      actions.push({
        key: 'upload-archive',
        label: newActions.uploadArchive.label,
        icon:
          newActions?.uploadArchive?.icon !== undefined ? (
            newActions?.uploadArchive?.icon
          ) : (
            <IconFileZip {...BASE_ICON_PROPS} className="text-secondary" />
          ),
        onClick: () => {
          if (onUploadArchive) {
            onUploadArchive();
          }
        },
      });
    }

    return actions;
  }, [newActions, onCreateFolder, onUploadFiles, onUploadArchive]);

  const isNewButtonVisible = useMemo(
    () => newActionItems?.length > 0,
    [newActionItems],
  );

  return { newActions: newActionItems, isNewButtonVisible };
};
