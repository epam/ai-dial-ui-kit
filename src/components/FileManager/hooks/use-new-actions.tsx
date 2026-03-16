import { useMemo } from 'react';
import {
  IconFile,
  IconFileZip,
  IconFolder,
  IconPlus,
} from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import type { DropdownItem } from '@/models/dropdown';
import type { NewAction } from '../FileManager';
import { DialFilePermission, type DialFile } from '@/models/file';

export interface UseNewActionsProps {
  newActions?: {
    uploadFiles?: NewAction;
    newFolder?: NewAction;
    uploadArchive?: NewAction;
    newItem?: NewAction;
  };
  currentFolder?: DialFile;
  onUploadFiles?: () => void;
  onCreateFolder?: () => void;
  onUploadArchive?: () => void;
  onCreateNewItem: () => void;
  isNewButtonDisabled?: boolean;
}

export interface UseNewActionsResult {
  newActions: DropdownItem[];
  isNewButtonVisible: boolean;
  isNewButtonDisabled: boolean;
}

export const useNewActions = ({
  newActions,
  currentFolder,
  onUploadFiles,
  onCreateFolder,
  onUploadArchive,
  onCreateNewItem,
  isNewButtonDisabled: isNewButtonDisabledExternal,
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

    if (newActions.newItem) {
      actions.push({
        key: 'new-item',
        label: newActions.newItem.label,
        icon:
          newActions?.newItem?.icon !== undefined ? (
            newActions?.newItem?.icon
          ) : (
            <IconPlus {...BASE_ICON_PROPS} className="text-secondary" />
          ),
        onClick: () => {
          if (onCreateNewItem) {
            onCreateNewItem();
          }
        },
      });
    }

    return actions;
  }, [
    newActions,
    onCreateFolder,
    onUploadFiles,
    onUploadArchive,
    onCreateNewItem,
  ]);

  const isNewButtonVisible = useMemo(
    () => newActionItems?.length > 0,
    [newActionItems],
  );

  const isNewButtonDisabled = useMemo(
    () =>
      !currentFolder?.permissions?.includes(DialFilePermission.WRITE) ||
      !!isNewButtonDisabledExternal,
    [currentFolder, isNewButtonDisabledExternal],
  );

  return {
    newActions: newActionItems,
    isNewButtonVisible,
    isNewButtonDisabled,
  };
};
