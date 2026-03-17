import type { FC } from 'react';
import { DialFileManagerItemName } from '@/components/FileManager/components/FileManagerItemName/FileManagerItemName';
import { BASE_FILE_MANAGER_ICON_SIZE } from '@/components/FileManager/constants';
import { DialFileNodeType } from '@/models/file';
import { DialItemType } from '@/types/item';
import { DialDateCellRenderer } from '@/components/Grid/renderers/DateCellRenderer';
import { IconCircleFilled } from '@tabler/icons-react';
import { formatBytes } from '@/components/FileManager/utils';

interface DialFileManagerItemSummaryCellProps {
  id: string;
  name: string;
  nodeType: DialFileNodeType;
  size?: number;
  updatedAt?: string;
  shared?: boolean;
  dateLocale?: Intl.LocalesArgument;
  dateOptions?: Intl.DateTimeFormatOptions;
  sharedIndicatorClassName?: string;
  hideTooltip?: boolean;
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
 * <DialFileManagerItemSummaryCell
 *   id="42"
 *   name="Report.pdf"
 *   nodeType={DialFileNodeType.FILE}
 *   size="220 KB"
 *   updatedAt="2025-07-20T00:00:00Z"
 *   dateLocale="en-US"
 *   dateOptions={{ timeZone: 'UTC' }}
 * />
 *
 * <DialFileManagerItemSummaryCell
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
 * @params sharedIndicatorClassName - Optional CSS classes for the shared indicator.
 */
export const DialFileManagerItemSummaryCell: FC<
  DialFileManagerItemSummaryCellProps
> = ({
  id,
  name,
  nodeType,
  size,
  updatedAt,
  dateLocale,
  dateOptions,
  shared,
  sharedIndicatorClassName,
  hideTooltip = false,
}) => {
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
          shared={shared}
          iconSize={BASE_FILE_MANAGER_ICON_SIZE}
          sharedIndicatorClassName={sharedIndicatorClassName}
          hideTooltip={hideTooltip}
          details={
            <div className="flex items-center gap-1 dial-tiny text-secondary">
              <span>
                {nodeType === DialFileNodeType.ITEM ? formatBytes(size) : ''}
              </span>
              {updatedAt && size && (
                <IconCircleFilled size={2} className="text-secondary" />
              )}
              {updatedAt ? (
                <span>
                  <DialDateCellRenderer
                    value={updatedAt}
                    locale={dateLocale?.toString()}
                    options={dateOptions}
                    className="dial-tiny text-secondary"
                    hideTooltip={hideTooltip}
                  />
                </span>
              ) : null}
            </div>
          }
        />
      </div>
    </div>
  );
};
