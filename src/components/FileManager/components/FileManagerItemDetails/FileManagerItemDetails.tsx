import type { FC } from 'react';
import { DialFileManagerItemName } from '@/components/FileManager/components/FileManagerItemName/FileManagerItemName';
import { BASE_FILE_MANAGER_ICON_SIZE } from '@/components/FileManager/constants';
import { DialFileNodeType } from '@/models/file';
import { DialItemType } from '@/types/item';
import { DialDateCellRenderer } from '@/components/Grid/renderers/DateCellRenderer';

interface DialFileManagerItemDetailsProps {
  id: string;
  name: string;
  nodeType: DialFileNodeType;
  size?: string;
  updatedAt?: string;
  dateLocale?: Intl.LocalesArgument;
  dateOptions?: Intl.DateTimeFormatOptions;
}

/**
 * Renders file or folder details inside the File Manager list/grid item.
 *
 * Displays the item name with an icon (via `DialFileManagerItemName`),
 * followed by a small details row:
 *
 * - File size (e.g., `"15 KB"`)
 * - A separator dot
 * - Formatted update date (via `DialDateCellRenderer`)
 *
 * The component automatically determines whether to show a **file** or **folder**
 * icon based on `nodeType`.
 *
 * ### Example
 * ```tsx
 * <DialFileManagerItemDetails
 *   id="42"
 *   name="Report.pdf"
 *   nodeType={DialFileNodeType.FILE}
 *   size="220 KB"
 *   updatedAt="2025-07-20T00:00:00Z"
 *   dateLocale="en-US"
 *   dateOptions={{ timeZone: 'UTC' }}
 * />
 *
 * <DialFileManagerItemDetails
 *   id="folder-1"
 *   name="Projects"
 *   nodeType={DialFileNodeType.FOLDER}
 *   size="—"
 *   updatedAt={undefined}
 * />
 * ```
 *
 * @param id - Unique identifier passed to `DialFileManagerItemName` as `elementId`.
 * @param name - File or folder display name.
 * @param nodeType - Determines whether the item renders as a **File** or **Folder**.
 * @param size - Human-readable file size (e.g., `"15 KB"`). May be `"—"` or omitted.
 * @param updatedAt - Date or timestamp passed to `DialDateCellRenderer`. If invalid or missing, renders `"—"`.
 * @param dateLocale - Optional locale override for date formatting (e.g., `"fr-FR"`).
 * @param dateOptions - Optional `Intl.DateTimeFormat` configuration (e.g., `{ timeZone: 'UTC' }`).
 */
export const DialFileManagerItemDetails: FC<
  DialFileManagerItemDetailsProps
> = ({ id, name, nodeType, size, updatedAt, dateLocale, dateOptions }) => {
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
