import { DialPopup } from '@/components/Popup/Popup';
import { PopupSize } from '@/types/popup';
import { type FC } from 'react';
import type { DialFile } from '@/models/file';
import { DialFileName } from '@/components/FileName/FileName';
import { BASE_FILE_MANAGER_ICON_SIZE } from '@/components/FileManager/constants';
import { DialSkeleton } from '@/components/Skeleton/Skeleton';
import { DialSkeletonVariant } from '@/types/skeleton';

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
}) => {
  const formatBytes = (bytes?: number): string => {
    if (!bytes || bytes <= 0) return '';
    const KB = 1024;
    const MB = KB * 1024;
    if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
    if (bytes >= KB) return `${(bytes / KB).toFixed(0)} KB`;
    return `${bytes} bytes`;
  };

  const formatDate = (date?: string): string => {
    if (!date) return '';
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }).format(new Date(date));
    } catch {
      return date;
    }
  };

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
          className="grid gap-4"
          style={{ gridTemplateColumns: '100px 1fr' }}
        >
          {loading ? (
            <>
              <div className="text-secondary text-sm">{nameLabel}</div>
              <DialSkeleton
                variant={DialSkeletonVariant.Text}
                width="100%"
                height={16}
                className="bg-layer-2"
              />

              <div className="text-secondary text-sm">{pathLabel}</div>
              <DialSkeleton
                variant={DialSkeletonVariant.Text}
                width="100%"
                height={16}
                className="bg-layer-2"
              />

              <div className="text-secondary text-sm">{modifiedDateLabel}</div>
              <DialSkeleton
                variant={DialSkeletonVariant.Text}
                width="128px"
                height={16}
                className="bg-layer-2"
              />

              <div className="text-secondary text-sm">{sizeLabel}</div>
              <DialSkeleton
                variant={DialSkeletonVariant.Text}
                width="96px"
                height={16}
                className="bg-layer-2"
              />

              <div className="text-secondary text-sm">{authorLabel}</div>
              <DialSkeleton
                variant={DialSkeletonVariant.Text}
                width="160px"
                height={16}
                className="bg-layer-2"
              />
            </>
          ) : fileMetadata ? (
            <>
              <div className="text-secondary text-sm">{nameLabel}</div>
              <div className="text-primary">
                <DialFileName
                  name={fileMetadata.name}
                  iconSize={BASE_FILE_MANAGER_ICON_SIZE}
                />
              </div>

              <div className="text-secondary text-sm">{pathLabel}</div>
              <div className="text-primary font-mono text-sm break-all">
                {fileMetadata.path}
              </div>

              <div className="text-secondary text-sm">{modifiedDateLabel}</div>
              <div className="text-primary">
                {formatDate(fileMetadata.updatedAt)}
              </div>

              <div className="text-secondary text-sm">{sizeLabel}</div>
              <div className="text-primary">
                {formatBytes(fileMetadata.contentLength)}
              </div>

              <div className="text-secondary text-sm">{authorLabel}</div>
              <div className="text-primary">{fileMetadata.author || '—'}</div>
            </>
          ) : null}
        </div>
      </div>
    </DialPopup>
  );
};
