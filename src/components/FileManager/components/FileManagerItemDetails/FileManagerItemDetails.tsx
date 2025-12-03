import type { FC } from 'react';
import { DialFileManagerItemName } from '../FileManagerItemName/FileManagerItemName';
import { BASE_FILE_MANAGER_ICON_SIZE } from '../../constants';
import type { FileManagerGridRow } from '../../FileManagerContext';
import { DialFileNodeType } from '@/models/file';
import { DialItemType } from '@/types/item';

interface DialFileManagerItemDetailsProps {
  row: FileManagerGridRow;
}

export const DialFileManagerItemDetails: FC<
  DialFileManagerItemDetailsProps
> = ({ row }) => {
  const { id, name, nodeType, size, updatedAt } = row;

  return (
    <div className="flex">
      <div className="flex flex-1 min-w-0">
        <DialFileManagerItemName
          type={
            nodeType === DialFileNodeType.FOLDER
              ? DialItemType.Folder
              : DialItemType.File
          }
          name={name}
          elementId={id}
          iconSize={BASE_FILE_MANAGER_ICON_SIZE}
          details={
            <div className="flex gap-1 dial-tiny text-secondary">
              <span>{size}</span>
              <span>{updatedAt}</span>
            </div>
          }
        />
      </div>
    </div>
  );
};
