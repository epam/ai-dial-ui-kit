import { useMemo } from 'react';
import { DialFilePermission, type DialFile } from '@/models/file';
import { DialFileManagerActions } from '@/types/file-manager';
import type { DropdownItem } from '@/models/dropdown';
import {
  IconCopy,
  IconDownload,
  IconPencilMinus,
  IconTrashX,
  IconInfoCircle,
} from '@tabler/icons-react';
import CopyToIcon from '@/assets/icons/copy-to.svg?react';
import MoveToIcon from '@/assets/icons/move-to.svg?react';
import IconUnshare from '@/assets/icons/unshare.svg?react';
import AddChild from '@/assets/icons/add-child.svg?react';
import AddSibling from '@/assets/icons/add-sibling.svg?react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { DialFileNodeType } from '@/models/file';
import { DropdownItemType } from '@/types/dropdown';

export interface UseGridContextMenuProps {
  actionLabels?: {
    [DialFileManagerActions.AddSibling]?: string;
    [DialFileManagerActions.AddChild]?: string;
    [DialFileManagerActions.Copy]?: string;
    [DialFileManagerActions.Duplicate]?: string;
    [DialFileManagerActions.Copy]?: string;
    [DialFileManagerActions.Rename]?: string;
    [DialFileManagerActions.Download]?: string;
    [DialFileManagerActions.Delete]?: string;
    [DialFileManagerActions.Move]?: string;
    [DialFileManagerActions.Info]?: string;
    [DialFileManagerActions.Unshare]?: string;
  };
  onDuplicate: (file: DialFile) => void;
  onCopy: (file: DialFile) => void;
  onMove: (file: DialFile) => void;
  onDownload: (file: DialFile) => void;
  onRename: (filePath: string) => void;
  onDelete: (file: DialFile, parentFolderPath: string) => void;
  onInfo: (file: DialFile) => void;
  onUnshare: (file: DialFile) => void;
  sharedWithMeIds?: string[];
  onAddSibling?: (file: DialFile) => void;
  onAddChild?: (file: DialFile) => void;
}

export const useGridContextMenu = ({
  actionLabels,
  onDuplicate,
  onCopy,
  onMove,
  onDownload,
  onRename,
  onDelete,
  onInfo,
  onUnshare,
  sharedWithMeIds,
  onAddSibling,
  onAddChild,
}: UseGridContextMenuProps) => {
  return useMemo(() => {
    return (file: DialFile): DropdownItem[] => {
      const items: DropdownItem[] = [];

      if (!actionLabels) {
        return items;
      }

      if (
        actionLabels[DialFileManagerActions.AddSibling] &&
        typeof onAddSibling === 'function'
      ) {
        items.push({
          key: 'addSibling',
          label: actionLabels[DialFileManagerActions.AddSibling],
          icon: (
            <AddSibling
              width={BASE_ICON_PROPS.size}
              height={BASE_ICON_PROPS.size}
              className="text-secondary"
            />
          ),
          onClick: () => onAddSibling(file),
        });
      }

      if (
        actionLabels[DialFileManagerActions.AddChild] &&
        typeof onAddChild === 'function'
      ) {
        items.push(
          {
            key: 'addChild',
            label: actionLabels[DialFileManagerActions.AddChild],
            icon: (
              <AddChild
                width={BASE_ICON_PROPS.size}
                height={BASE_ICON_PROPS.size}
                className="text-secondary"
              />
            ),
            onClick: () => onAddChild(file),
          },
          {
            key: 'divider',
            type: DropdownItemType.Divider,
          },
        );
      }

      if (actionLabels[DialFileManagerActions.Duplicate]) {
        items.push({
          key: DialFileManagerActions.Duplicate,
          label: actionLabels[DialFileManagerActions.Duplicate],
          icon: <IconCopy {...BASE_ICON_PROPS} className="text-secondary" />,
          onClick: () => onDuplicate(file),
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

      const emptyOrWritePermissions =
        !file.permissions ||
        file.permissions.includes(DialFilePermission.WRITE);

      if (
        actionLabels[DialFileManagerActions.Delete] &&
        emptyOrWritePermissions
      ) {
        items.push({
          key: DialFileManagerActions.Delete,
          label: actionLabels[DialFileManagerActions.Delete],
          icon: <IconTrashX {...BASE_ICON_PROPS} className="text-secondary" />,
          onClick: () => onDelete(file, file.parentPath ?? ''),
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

      if (
        actionLabels[DialFileManagerActions.Info] &&
        file.nodeType === DialFileNodeType.ITEM
      ) {
        items.push({
          key: DialFileManagerActions.Info,
          label: actionLabels[DialFileManagerActions.Info],
          icon: (
            <IconInfoCircle {...BASE_ICON_PROPS} className="text-secondary" />
          ),
          onClick: () => onInfo(file),
        });
      }

      if (
        actionLabels[DialFileManagerActions.Unshare] &&
        sharedWithMeIds?.includes(file.path)
      ) {
        items.push({
          key: DialFileManagerActions.Unshare,
          label: actionLabels[DialFileManagerActions.Unshare],
          icon: (
            <IconUnshare
              width={BASE_ICON_PROPS.size}
              height={BASE_ICON_PROPS.size}
              className="text-secondary"
            />
          ),
          onClick: () => onUnshare(file),
        });
      }

      return items;
    };
  }, [
    actionLabels,
    onAddSibling,
    onAddChild,
    onDuplicate,
    onCopy,
    onMove,
    onDownload,
    onDelete,
    onRename,
    onInfo,
    onUnshare,
    sharedWithMeIds,
  ]);
};
