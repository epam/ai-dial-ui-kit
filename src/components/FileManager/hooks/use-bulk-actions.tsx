import { useMemo } from 'react';
import { DialFilePermission, type DialFile } from '@/models/file';
import { DialFileManagerActions } from '@/types/file-manager';
import type { DialActionDropdownItem } from '@/components/FileManager/components/FileManagerBulkActionsToolbar/FileManagerBulkActionsToolbar';
import { IconCopy, IconDownload, IconTrashX } from '@tabler/icons-react';
import CopyToIcon from '@/assets/icons/copy-to.svg?react';
import MoveToIcon from '@/assets/icons/move-to.svg?react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import IconUnshare from '@/assets/icons/unshare.svg?react';

export interface UseBulkActionsProps {
  selectedFiles: Map<string, DialFile>;
  actionLabels?: {
    [DialFileManagerActions.Duplicate]?: string;
    [DialFileManagerActions.Copy]?: string;
    [DialFileManagerActions.Rename]?: string;
    [DialFileManagerActions.Download]?: string;
    [DialFileManagerActions.Unshare]?: string;
    [DialFileManagerActions.Delete]?: string;
    [DialFileManagerActions.Move]?: string;
  };
  onDuplicate: (files: DialFile[]) => void;
  onCopy: (files: DialFile[]) => void;
  onMove: (files: DialFile[]) => void;
  onDownload: (files: DialFile[]) => void;
  onUnshare?: (files: DialFile[]) => void;
  onRename: (filePath: string) => void;
  onDelete: (files: DialFile[], parentFolderPath: string) => void;
  getCurrentFolderPath: () => string;
  sharedWithMeIds?: string[];
}

export const useBulkActions = ({
  selectedFiles,
  actionLabels,
  onDuplicate,
  onCopy,
  onMove,
  onDownload,
  onUnshare,
  onDelete,
  getCurrentFolderPath,
  sharedWithMeIds,
}: UseBulkActionsProps): DialActionDropdownItem[] => {
  return useMemo(() => {
    const actions: DialActionDropdownItem[] = [];
    const selectedFilesArray = Array.from(selectedFiles.values());

    if (!selectedFilesArray.length || !actionLabels) {
      return actions;
    }

    if (actionLabels[DialFileManagerActions.Move]) {
      actions.push({
        key: DialFileManagerActions.Move,
        label: actionLabels[DialFileManagerActions.Move],
        title: actionLabels[DialFileManagerActions.Move],
        icon: (
          <MoveToIcon
            width={BASE_ICON_PROPS.size}
            height={BASE_ICON_PROPS.size}
            className="text-secondary"
          />
        ),
        onClick: () => onMove(selectedFilesArray),
      });
    }

    if (actionLabels[DialFileManagerActions.Copy]) {
      actions.push({
        key: DialFileManagerActions.Copy,
        label: actionLabels[DialFileManagerActions.Copy],
        title: actionLabels[DialFileManagerActions.Copy],
        icon: (
          <CopyToIcon
            width={BASE_ICON_PROPS.size}
            height={BASE_ICON_PROPS.size}
            className="text-secondary"
          />
        ),
        onClick: () => onCopy(selectedFilesArray),
      });
    }

    if (actionLabels[DialFileManagerActions.Duplicate]) {
      actions.push({
        key: DialFileManagerActions.Duplicate,
        label: actionLabels[DialFileManagerActions.Duplicate],
        title: actionLabels[DialFileManagerActions.Duplicate],
        icon: <IconCopy {...BASE_ICON_PROPS} className="text-secondary" />,
        onClick: () => onDuplicate(selectedFilesArray),
      });
    }

    if (actionLabels[DialFileManagerActions.Delete]) {
      const isDisabled = selectedFilesArray.some(
        (file) =>
          file.permissions &&
          !file.permissions.includes(DialFilePermission.WRITE),
      );

      actions.push({
        key: DialFileManagerActions.Delete,
        label: actionLabels[DialFileManagerActions.Delete],
        title: actionLabels[DialFileManagerActions.Delete],
        icon: <IconTrashX {...BASE_ICON_PROPS} className="text-secondary" />,
        disabled: isDisabled,
        onClick: () => {
          const currentFolderPath = getCurrentFolderPath();
          onDelete(selectedFilesArray, currentFolderPath);
        },
      });
    }

    if (actionLabels[DialFileManagerActions.Download]) {
      actions.push({
        key: DialFileManagerActions.Download,
        label: actionLabels[DialFileManagerActions.Download],
        title: actionLabels[DialFileManagerActions.Download],
        icon: <IconDownload {...BASE_ICON_PROPS} className="text-secondary" />,
        onClick: () => onDownload(selectedFilesArray),
      });
    }

    if (actionLabels[DialFileManagerActions.Unshare] && onUnshare) {
      const disabled = selectedFilesArray.some(
        (file) => !sharedWithMeIds?.includes(file.path),
      );

      actions.push({
        key: DialFileManagerActions.Unshare,
        label: actionLabels[DialFileManagerActions.Unshare],
        title: actionLabels[DialFileManagerActions.Unshare],
        disabled,
        icon: (
          <IconUnshare
            width={BASE_ICON_PROPS.size}
            height={BASE_ICON_PROPS.size}
            className="text-secondary"
          />
        ),
        onClick: () => onUnshare(selectedFilesArray),
      });
    }

    return actions;
  }, [
    selectedFiles,
    actionLabels,
    onMove,
    onCopy,
    onDuplicate,
    getCurrentFolderPath,
    onDelete,
    onDownload,
    onUnshare,
    sharedWithMeIds,
  ]);
};
