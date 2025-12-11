import { DialPopup } from '@/components/Popup/Popup';
import { PopupSize } from '@/types/popup';
import { type FC } from 'react';
import type { DialFile } from '@/models/file';
import { DialFileName } from '@/components/FileName/FileName';
import { DialSkeleton } from '@/components/Skeleton/Skeleton';
import { DialSkeletonVariant } from '@/types/skeleton';
import { formatBytes, formatDate } from '@/components/FileManager/utils';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import {
  LABEL_COLUMN_WIDTH,
  SKELETON_HEIGHT,
  LABEL_CLASS,
  VALUE_CLASS,
  PATH_CLASS,
  SKELETON_CLASS,
} from './constants';

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
          style={{ gridTemplateColumns: `${LABEL_COLUMN_WIDTH}px 1fr` }}
        >
          {loading ? (
            <>
              <div className={LABEL_CLASS}>{nameLabel}</div>
              <DialSkeleton
                variant={DialSkeletonVariant.Text}
                width="100%"
                height={SKELETON_HEIGHT}
                className={SKELETON_CLASS}
              />

              <div className={LABEL_CLASS}>{modifiedDateLabel}</div>
              <DialSkeleton
                variant={DialSkeletonVariant.Text}
                width="90%"
                height={SKELETON_HEIGHT}
                className={SKELETON_CLASS}
              />

              <div className={LABEL_CLASS}>{sizeLabel}</div>
              <DialSkeleton
                variant={DialSkeletonVariant.Text}
                width="60%"
                height={SKELETON_HEIGHT}
                className={SKELETON_CLASS}
              />

              <div className={LABEL_CLASS}>{authorLabel}</div>
              <DialSkeleton
                variant={DialSkeletonVariant.Text}
                width="80%"
                height={SKELETON_HEIGHT}
                className={SKELETON_CLASS}
              />

              <div className={LABEL_CLASS}>{pathLabel}</div>
              <DialSkeleton
                variant={DialSkeletonVariant.Text}
                width="70%"
                height={SKELETON_HEIGHT}
                className={SKELETON_CLASS}
              />
            </>
          ) : fileMetadata ? (
            <>
              <div className={LABEL_CLASS}>{nameLabel}</div>
              <div className={VALUE_CLASS}>
                <DialEllipsisTooltip
                  text={<DialFileName name={fileMetadata.name} iconSize={16} />}
                />
              </div>

              <div className={LABEL_CLASS}>{modifiedDateLabel}</div>
              <div className={VALUE_CLASS}>
                <DialEllipsisTooltip
                  text={formatDate(
                    fileMetadata.updatedAt,
                    dateLocale,
                    dateOptions,
                  )}
                />
              </div>

              <div className={LABEL_CLASS}>{sizeLabel}</div>
              <div className={VALUE_CLASS}>
                <DialEllipsisTooltip
                  text={formatBytes(fileMetadata.contentLength)}
                />
              </div>

              <div className={LABEL_CLASS}>{authorLabel}</div>
              <div className={VALUE_CLASS}>
                <DialEllipsisTooltip text={fileMetadata.author || '—'} />
              </div>

              <div className={LABEL_CLASS}>{pathLabel}</div>
              <div className={PATH_CLASS}>{fileMetadata.path}</div>
            </>
          ) : null}
        </div>
      </div>
    </DialPopup>
  );
};
