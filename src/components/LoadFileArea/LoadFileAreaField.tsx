import { DialPrimaryButton } from '@/components/Button/ButtonWrappers';
import { DialLabel } from '@/components/Label/Label';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { ButtonAppearance } from '@/types/button';
import { IconPlus } from '@tabler/icons-react';
import { type ChangeEvent, type FC, useCallback, useRef } from 'react';
import { DialRemoveButton } from '../RemoveButton/RemoveButton';
import { DialLoadFileArea, type DialLoadFileAreaProps } from './LoadFileArea';

export interface DialLoadFileAreaFieldProps extends DialLoadFileAreaProps {
  fieldTitle: string; // TODO: rename to label and use DialLabel component
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
 *   fieldTitle="Attachments"
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
 *
 * @param {DialLoadFileAreaFieldProps} props - The properties for the file area field component.
 * @param {(files: File[]) => void} props.onChange - Callback fired when files are added or removed.
 * @param {string} props.fieldTitle - The label displayed above the file upload area.
 * @param {string} props.elementId - The unique `id` used for accessibility and input association.
 * @param {File[]} [props.files] - The list of currently selected or uploaded files.
 * @param {number} [props.maxFilesCount] - The maximum number of files allowed.
 * @param {number} [props.maxFileSize] - The maximum size of file allowed in MB.
 * @param {string} [props.fileFormatError] - Error message shown for invalid file formats.
 * @param {string} [props.fileCountError] - Error message shown when exceeding the file count limit.
 * @param {string} [props.fileSizeError] - Error message shown when exceeding the file size limit.
 * @param {boolean} [props.multiple=true] - Whether multiple file uploads are allowed.
 * @param {string} [props.acceptTypes] - Comma-separated list of allowed MIME types or file extensions.
 * @param {string} [props.deleteAllButtonLabel] - Label for the "Delete All" button shown when files exist.
 * @param {string} [props.addButtonLabel] - Label for the "Add" button used to select additional files.
 * @param {object} [props.props] - Additional props passed to the underlying `DialLoadFileArea`.
 *
 * @returns {JSX.Element} A file upload field with label, action buttons, and a drag-and-drop area.
 */
export const DialLoadFileAreaField: FC<DialLoadFileAreaFieldProps> = ({
  onChange,
  fieldTitle,
  elementId,
  files,
  maxFilesCount,
  maxFileSize,
  fileFormatError,
  fileCountError,
  fileSizeError,
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
          !(
            acceptTypes === '/' ||
            acceptTypes?.toLowerCase()?.includes(fileItem?.type?.toLowerCase())
          ),
      );
    },
    [acceptTypes],
  );

  const getIsFileSizeError = useCallback(
    (fileItems: File[] | DataTransferItem[]) => {
      if (!maxFileSize) {
        return false;
      }
      const maxSize = maxFileSize * (1024 * 1024);
      return fileItems?.some((fileItem) => {
        const size = (fileItem as File).size;
        return !!size && size > maxSize;
      });
    },
    [maxFileSize],
  );

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const filesList = e.target.files;
      if (filesList && filesList.length > 0) {
        const selectedFiles = Array.from(filesList);
        const isFileFormatError = getIsFileFormatError(selectedFiles);
        const isFileSizeError = getIsFileSizeError(selectedFiles);

        if (!isFileFormatError && !isFileSizeError) {
          onChange([...(files || []), ...selectedFiles]);
        }
      }
    },
    [getIsFileFormatError, getIsFileSizeError, onChange, files],
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center pb-1 min-h-[42px]">
        <DialLabel
          fieldLabel={`${fieldTitle}: ${multiple ? files?.length || 0 : ''}`}
          htmlFor={elementId}
        />
        {multiple && !!files?.length && (
          <div className="flex flex-row items-center gap-x-2">
            <DialRemoveButton
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
        fileSizeError={fileSizeError}
        getIsFileFormatError={getIsFileFormatError}
        getIsFileSizeError={getIsFileSizeError}
        {...props}
      />
    </div>
  );
};
