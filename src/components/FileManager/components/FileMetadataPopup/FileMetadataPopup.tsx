import { DialPopup } from '@/components/Popup/Popup';
import { PopupSize } from '@/types/popup';
import { type FC } from 'react';
import type { DialFile } from '@/models/file';
import { DialFileName } from '@/components/FileName/FileName';
import { DialSkeleton } from '@/components/Skeleton/Skeleton';
import { DialSkeletonVariant } from '@/types/skeleton';
import { formatBytes, formatDate } from '@/components/FileManager/utils';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';

export interface FileMetadataPopupProps {
  open: boolean;
  onClose: () => void;
  fileMetadata?: DialFile;
  loading?: boolean;
  title?: string;
  nameLabel?: string;
  pathLabel?: string;
  modifiedDateLabel?: string;
  sizeLabel?: string;
  authorLabel?: string;
  dateLocale?: Intl.LocalesArgument;
  dateOptions?: Intl.DateTimeFormatOptions;
}

/**
 * FileMetadataPopup
 *
 * A popup dialog for displaying file metadata information.
 * Shows file details like name, path, modified date, size, and author.
 * Displays a loading skeleton while metadata is being fetched.
 *
 * @example
 * ```tsx
 * <FileMetadataPopup
 *   open={isOpen}
 *   onClose={handleClose}
 *   fileMetadata={file}
 *   loading={isLoading}
 *   title="Information"
 *   dateLocale="en-US"
 *   dateOptions={{ year: 'numeric', month: 'short', day: '2-digit' }}
 * />
 * ```
 *
 * @param open - Whether the popup is visible
 * @param onClose - Callback fired when the popup is closed
 * @param [fileMetadata] - File metadata to display
 * @param [loading] - Whether metadata is being loaded
 * @param [title="Information"] - Title of the popup
 * @param [nameLabel="Name:"] - Label for the name field
 * @param [pathLabel="Path:"] - Label for the path field
 * @param [modifiedDateLabel="Modified Date:"] - Label for the modified date field
 * @param [sizeLabel="Size:"] - Label for the size field
 * @param [authorLabel="Author:"] - Label for the author field
 * @param [dateLocale="en-US"] - Locale for date formatting
 * @param [dateOptions] - Options for date formatting
 */
export const FileMetadataPopup: FC<FileMetadataPopupProps> = ({
  open,
  onClose,
  fileMetadata,
  loading = false,
  title = 'Information',
  nameLabel = 'Name:',
  pathLabel = 'Path:',
  modifiedDateLabel = 'Modified Date:',
  sizeLabel = 'Size:',
  authorLabel = 'Author:',
  dateLocale = 'en-US',
  dateOptions,
}) => {
  return (
    <DialPopup
      open={open}
      onClose={onClose}
      size={PopupSize.Sm}
      title={title}
      dividers={false}
    >
      <div className="px-6 py-4">
        <div
          className="grid gap-x-4 gap-y-4 items-center dial-small"
          style={{ gridTemplateColumns: '100px 1fr' }}
        >
          {loading ? (
            <>
              <div className="text-secondary">{nameLabel}</div>
              <DialSkeleton
                variant={DialSkeletonVariant.Text}
                width="100%"
                height={16}
                className="bg-layer-2"
              />

              <div className="text-secondary">{modifiedDateLabel}</div>
              <DialSkeleton
                variant={DialSkeletonVariant.Text}
                width="90%"
                height={16}
                className="bg-layer-2"
              />

              <div className="text-secondary">{sizeLabel}</div>
              <DialSkeleton
                variant={DialSkeletonVariant.Text}
                width="60%"
                height={16}
                className="bg-layer-2"
              />

              <div className="text-secondary">{authorLabel}</div>
              <DialSkeleton
                variant={DialSkeletonVariant.Text}
                width="80%"
                height={16}
                className="bg-layer-2"
              />

              <div className="text-secondary">{pathLabel}</div>
              <DialSkeleton
                variant={DialSkeletonVariant.Text}
                width="70%"
                height={16}
                className="bg-layer-2"
              />
            </>
          ) : fileMetadata ? (
            <>
              <div className="text-secondary">{nameLabel}</div>
              <div className="text-primary min-w-0">
                <DialEllipsisTooltip
                  text={<DialFileName name={fileMetadata.name} iconSize={16} />}
                />
              </div>

              <div className="text-secondary">{modifiedDateLabel}</div>
              <div className="text-primary min-w-0">
                <DialEllipsisTooltip
                  text={formatDate(
                    fileMetadata.updatedAt,
                    dateLocale,
                    dateOptions,
                  )}
                />
              </div>

              <div className="text-secondary">{sizeLabel}</div>
              <div className="text-primary min-w-0">
                <DialEllipsisTooltip
                  text={formatBytes(fileMetadata.contentLength)}
                />
              </div>

              <div className="text-secondary">{authorLabel}</div>
              <div className="text-primary min-w-0">
                <DialEllipsisTooltip text={fileMetadata.author || '—'} />
              </div>

              <div className="text-secondary">{pathLabel}</div>
              <div className="text-primary break-words min-w-0">
                {fileMetadata.path}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </DialPopup>
  );
};
