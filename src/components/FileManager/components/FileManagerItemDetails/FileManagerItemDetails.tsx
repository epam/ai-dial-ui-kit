import type { FC } from 'react';
import { DialFileManagerItemName } from '../FileManagerItemName/FileManagerItemName';
import { BASE_FILE_MANAGER_ICON_SIZE } from '../../constants';
import type { FileManagerGridRow } from '../../FileManagerContext';
import { DialFileNodeType } from '@/models/file';
import { DialItemType } from '@/types/item';
import { DialDateCellRenderer } from '@/components/Grid/renderers/DateCellRenderer';

interface DialFileManagerItemDetailsProps {
  row: FileManagerGridRow;
  dateLocale?: Intl.LocalesArgument;
  dateOptions?: Intl.DateTimeFormatOptions;
}

export const DialFileManagerItemDetails: FC<
  DialFileManagerItemDetailsProps
> = ({ row, dateLocale, dateOptions }) => {
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
              <div className="flex self-center w-0.5 h-0.5 bg-controls-disable rounded-full" />
              <span>
                <DialDateCellRenderer
                  value={updatedAt}
                  locale={dateLocale?.toString()}
                  options={dateOptions}
                  className="dial-tiny text-secondary"
                />
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
};
