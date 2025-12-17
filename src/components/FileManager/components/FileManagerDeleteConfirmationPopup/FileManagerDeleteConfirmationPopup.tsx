import { type FC, type ReactNode } from 'react';
import { DialConfirmationPopup } from '@/components/ConfirmationPopup/ConfirmationPopup';
import { ConfirmationPopupVariant } from '@/types/confirmation-popup';
import type { DialFile } from '@/models/file';

export interface FileManagerDeleteConfirmationPopupProps {
  open: boolean;
  itemsToDelete: DialFile[];
  onClose: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  titleRenderer?: (fileNames: string[]) => ReactNode;
  contentRenderer?: (fileNames: string[]) => ReactNode;
}

/**
 * Confirmation popup for deleting files in FileManager.
 * Shows a list of files to be deleted with customizable title and content.
 *
 * @param open - Controls visibility of the popup
 * @param itemsToDelete - Array of files to be deleted
 * @param onClose - Callback when popup is closed
 * @param onConfirm - Callback when delete is confirmed
 * @param [cancelLabel='Cancel'] - Label for cancel button
 * @param [confirmLabel='Delete'] - Label for confirm button
 * @param [titleRenderer] - Custom title renderer function
 * @param [contentRenderer] - Custom content renderer function
 */
export const FileManagerDeleteConfirmationPopup: FC<
  FileManagerDeleteConfirmationPopupProps
> = ({
  open,
  itemsToDelete,
  onClose,
  onConfirm,
  cancelLabel = 'Cancel',
  confirmLabel = 'Delete',
  titleRenderer,
  contentRenderer,
}) => {
  const fileNames = itemsToDelete.map((item) => item.name);

  const defaultTitle = 'Confirm Deleting Items';
  const title = titleRenderer?.(fileNames) || defaultTitle;

  const defaultContent = (
    <div className="px-6 py-3 dial-small">
      <p className="text-secondary mb-3">
        {itemsToDelete.length === 1 ? (
          <>
            Do you want to delete file or folder{' '}
            <span className="text-primary break-all">
              "{itemsToDelete[0].name}"
            </span>
            ?
          </>
        ) : (
          <>
            Do you want to delete the following{' '}
            <span className="text-primary">{itemsToDelete.length}</span> items?
          </>
        )}
      </p>
      {itemsToDelete.length > 1 && (
        <>
          {itemsToDelete.length <= 10 ? (
            <ul className="space-y-1 text-primary list-none">
              {itemsToDelete.map((item) => (
                <li key={item.path} className="truncate">
                  {item.name}
                </li>
              ))}
            </ul>
          ) : (
            <>
              <ul className="space-y-1 text-primary list-none mb-2">
                {itemsToDelete.slice(0, 10).map((item) => (
                  <li key={item.path} className="truncate">
                    {item.name}
                  </li>
                ))}
              </ul>
              <p className="text-secondary italic">
                ... and {itemsToDelete.length - 10} more
              </p>
            </>
          )}
        </>
      )}
    </div>
  );

  const content = contentRenderer?.(fileNames) || defaultContent;

  return (
    <DialConfirmationPopup
      open={open}
      title={title}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      variant={ConfirmationPopupVariant.Danger}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      {content}
    </DialConfirmationPopup>
  );
};
