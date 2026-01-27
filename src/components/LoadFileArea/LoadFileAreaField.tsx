import { DialPrimaryButton } from '@/components/Button/ButtonWrappers';
import { DialFieldLabel } from '@/components/Field/Field';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { ButtonAppearance } from '@/types/button';
import { IconPlus, IconTrashX } from '@tabler/icons-react';
import { type ChangeEvent, type FC, useCallback, useRef } from 'react';
import { DialLoadFileArea, type DialLoadFileAreaProps } from './LoadFileArea';

export interface DialLoadFileAreaFieldProps extends DialLoadFileAreaProps {
  fieldLabel: string;
  elementId: string;
  deleteAllButtonLabel?: string;
  addButtonLabel?: string;
}

/**
 * A composite file upload field that combines a label, file list management,
 * and a drag-and-drop upload area. Allows users to add, remove, and validate files
 * with customizable restrictions on file types and count.
 *
 * The component displays a header showing the field title and file count,
 * along with "Add" and "Delete All" buttons (when multiple uploads are enabled).
 * It integrates with `DialLoadFileArea` for drag-and-drop functionality and
 * provides file validation for both format and maximum file count.
 *
 * @example
 * ```tsx
 * <DialLoadFileAreaField
 *   fieldLabel="Attachments"
 *   elementId="attachments"
 *   files={uploadedFiles}
 *   onChange={setUploadedFiles}
 *   maxFilesCount={5}
 *   acceptTypes="image/png,image/jpeg"
 *   fileFormatError="Only PNG and JPEG images are allowed"
 *   fileCountError="You can upload up to 5 files"
 *   deleteAllButtonLabel="Remove all"
 *   addButtonLabel="Add more"
 * />
 * ```
 * @params - Component properties extending:
 * - {@link DialLoadFileAreaProps}
 * @param fieldLabel - The label displayed above the file upload area.
 * @param elementId - The unique `id` used for accessibility and input association.
 * @param [deleteAllButtonLabel] - Label for the "Delete All" button shown when files exist.
 * @param [addButtonLabel] - Label for the "Add" button used to select additional files.
 *
 * @returns {JSX.Element} A file upload field with label, action buttons, and a drag-and-drop area.
 */
export const DialLoadFileAreaField: FC<DialLoadFileAreaFieldProps> = ({
  onChange,
  fieldLabel,
  elementId,
  files,
  maxFilesCount,
  fileFormatError,
  fileCountError,
  multiple = true,
  acceptTypes,
  deleteAllButtonLabel,
  addButtonLabel,
  ...props
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onAddFiles = () => fileInputRef.current?.click();

  const onRemoveFiles = () => {
    onChange([]);
  };

  const getIsFileFormatError = useCallback(
    (fileItems: File[] | DataTransferItem[]) => {
      return fileItems?.some(
        (fileItem) =>
          fileItem.type === '' ||
          !(
            acceptTypes === '/' ||
            acceptTypes?.toLowerCase()?.includes(fileItem?.type?.toLowerCase())
          ),
      );
    },
    [acceptTypes],
  );

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const filesList = e.target.files;
      if (filesList && filesList.length > 0) {
        const selectedFiles = Array.from(filesList);
        const isFileFormatError = getIsFileFormatError(selectedFiles);

        if (!isFileFormatError) {
          onChange([...(files || []), ...selectedFiles]);
        }
      }
    },
    [onChange, files, getIsFileFormatError],
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center pb-1 min-h-[42px]">
        <DialFieldLabel
          fieldLabel={`${fieldLabel}: ${multiple ? files?.length || 0 : ''}`}
          htmlFor={elementId}
        />
        {multiple && !!files?.length && (
          <div className="flex flex-row items-center gap-x-2">
            <DialPrimaryButton
              appearance={ButtonAppearance.Ghost}
              className="!text-error"
              iconBefore={<IconTrashX {...BASE_ICON_PROPS} />}
              label={deleteAllButtonLabel}
              onClick={onRemoveFiles}
            />

            {(maxFilesCount ? maxFilesCount > files?.length : true) && (
              <DialPrimaryButton
                appearance={ButtonAppearance.Ghost}
                iconBefore={<IconPlus {...BASE_ICON_PROPS} />}
                label={addButtonLabel}
                onClick={onAddFiles}
              />
            )}
          </div>
        )}
      </div>
      {files && files.length > 0 && (
        <input
          id="file"
          type="file"
          multiple={multiple}
          ref={fileInputRef}
          hidden
          accept={acceptTypes}
          onChange={onFileChange}
        />
      )}
      <DialLoadFileArea
        files={files}
        onChange={onChange}
        acceptTypes={acceptTypes}
        maxFilesCount={maxFilesCount}
        multiple={multiple}
        fileFormatError={fileFormatError}
        fileCountError={fileCountError}
        getIsFileFormatError={getIsFileFormatError}
        {...props}
      />
    </div>
  );
};
