import { useMemo } from 'react';
import type { DialFile } from '@/models/file';
import { DialFileManagerActions } from '@/types/file-manager';
import type { DropdownItem } from '@/models/dropdown';
import {
  IconCopy,
  IconDownload,
  IconPencilMinus,
  IconTrashX,
} from '@tabler/icons-react';
import CopyToIcon from '@/assets/icons/copy-to.svg?react';
import MoveToIcon from '@/assets/icons/move-to.svg?react';
import { BASE_ICON_PROPS } from '@/constants/icon';

export interface UseGridContextMenuProps {
  actionLabels?: {
    [DialFileManagerActions.Duplicate]?: string;
    [DialFileManagerActions.Copy]?: string;
    [DialFileManagerActions.Rename]?: string;
    [DialFileManagerActions.Download]?: string;
    [DialFileManagerActions.Delete]?: string;
    [DialFileManagerActions.Move]?: string;
  };
  onDuplicate: (file: DialFile) => void;
  onCopy: (file: DialFile) => void;
  onMove: (file: DialFile) => void;
  onDownload: (file: DialFile) => void;
  onRename: (filePath: string) => void;
  onDelete: (file: DialFile, parentFolderPath: string) => void;
}

export const useGridContextMenu = ({
  actionLabels,
  onDuplicate,
  onCopy,
  onMove,
  onDownload,
  onRename,
  onDelete,
}: UseGridContextMenuProps) => {
  return useMemo(() => {
    return (file: DialFile): DropdownItem[] => {
      const items: DropdownItem[] = [];

      if (!actionLabels) {
        return items;
      }

      if (actionLabels[DialFileManagerActions.Move]) {
        items.push({
          key: DialFileManagerActions.Move,
          label: actionLabels[DialFileManagerActions.Move],
          icon: (
            <MoveToIcon
              width={BASE_ICON_PROPS.size}
              height={BASE_ICON_PROPS.size}
              className="text-secondary"
            />
          ),
          onClick: () => onMove(file),
        });
      }

      if (actionLabels[DialFileManagerActions.Copy]) {
        items.push({
          key: DialFileManagerActions.Copy,
          label: actionLabels[DialFileManagerActions.Copy],
          icon: (
            <CopyToIcon
              width={BASE_ICON_PROPS.size}
              height={BASE_ICON_PROPS.size}
              className="text-secondary"
            />
          ),
          onClick: () => onCopy(file),
        });
      }

      if (actionLabels[DialFileManagerActions.Duplicate]) {
        items.push({
          key: DialFileManagerActions.Duplicate,
          label: actionLabels[DialFileManagerActions.Duplicate],
          icon: <IconCopy {...BASE_ICON_PROPS} className="text-secondary" />,
          onClick: () => onDuplicate(file),
        });
      }

      if (actionLabels[DialFileManagerActions.Rename]) {
        items.push({
          key: DialFileManagerActions.Rename,
          label: actionLabels[DialFileManagerActions.Rename],
          icon: (
            <IconPencilMinus {...BASE_ICON_PROPS} className="text-secondary" />
          ),
          onClick: () => onRename(file.path),
        });
      }

      if (actionLabels[DialFileManagerActions.Download]) {
        items.push({
          key: DialFileManagerActions.Download,
          label: actionLabels[DialFileManagerActions.Download],
          icon: (
            <IconDownload {...BASE_ICON_PROPS} className="text-secondary" />
          ),
          onClick: () => onDownload(file),
        });
      }

      if (actionLabels[DialFileManagerActions.Delete]) {
        items.push({
          key: DialFileManagerActions.Delete,
          label: actionLabels[DialFileManagerActions.Delete],
          icon: <IconTrashX {...BASE_ICON_PROPS} className="text-secondary" />,
          onClick: () => onDelete(file, file.parentPath ?? ''),
        });
      }

      return items;
    };
  }, [
    actionLabels,
    onDuplicate,
    onCopy,
    onMove,
    onDownload,
    onRename,
    onDelete,
  ]);
};
