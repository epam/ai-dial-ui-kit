import { useMemo } from 'react';
import type { DialFile } from '@/models/file';
import { DialFileManagerActions } from '@/types/file-manager';
import type { DialActionDropdownItem } from '../components/FileManagerBulkActionsToolbar/FileManagerBulkActionsToolbar';
import { IconCopy, IconDownload, IconTrashX } from '@tabler/icons-react';
import CopyToIcon from '@/assets/icons/copy-to.svg?react';
import MoveToIcon from '@/assets/icons/move-to.svg?react';
import { BASE_ICON_PROPS } from '@/constants/icon';

export interface UseBulkActionsProps {
  selectedFiles: Map<string, DialFile>;
  actionLabels?: {
    [DialFileManagerActions.Duplicate]?: string;
    [DialFileManagerActions.Copy]?: string;
    [DialFileManagerActions.Rename]?: string;
    [DialFileManagerActions.Download]?: string;
    [DialFileManagerActions.Delete]?: string;
    [DialFileManagerActions.Move]?: string;
  };
  onDuplicate: (files: DialFile[]) => void;
  onCopy: (files: DialFile[]) => void;
  onMove: (files: DialFile[]) => void;
  onDownload: (files: DialFile[]) => void;
  onRename: (filePath: string) => void;
  onDelete: (files: DialFile[], parentFolderPath: string) => void;
  getCurrentFolderPath: () => string;
}

export const useBulkActions = ({
  selectedFiles,
  actionLabels,
  onDuplicate,
  onCopy,
  onMove,
  onDownload,
  onDelete,
  getCurrentFolderPath,
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
      actions.push({
        key: DialFileManagerActions.Delete,
        label: actionLabels[DialFileManagerActions.Delete],
        title: actionLabels[DialFileManagerActions.Delete],
        icon: <IconTrashX {...BASE_ICON_PROPS} className="text-secondary" />,
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

    return actions;
  }, [
    selectedFiles,
    actionLabels,
    onDuplicate,
    onCopy,
    onMove,
    onDownload,
    onDelete,
    getCurrentFolderPath,
  ]);
};
