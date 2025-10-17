import { type ChangeEvent, type FC, useCallback, useRef } from 'react';
import { IconPlus, IconTrashX } from '@tabler/icons-react';
import { DialLoadFileArea, type DialLoadFileAreaProps } from './LoadFileArea';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { DialFieldLabel } from '@/components/Field/Field';
import { DialButton } from '@/components/Button/Button';
import { ButtonVariant } from '@/types/button';

export interface DialLoadFileAreaFieldProps extends DialLoadFileAreaProps {
  fieldTitle: string;
  elementId: string;
  deleteAllButtonLabel?: string;
  addButtonLabel?: string;
}

export const DialLoadFileAreaField: FC<DialLoadFileAreaFieldProps> = ({
  onChange,
  fieldTitle,
  elementId,
  files,
  maxFilesCount,
  fileFormatError,
  fileCountError,
  isMultiple = true,
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
          fieldTitle={`${fieldTitle}: ${isMultiple ? files?.length || 0 : ''}`}
          htmlFor={elementId}
        />
        {isMultiple && !!files?.length && (
          <div className="flex flex-row items-center gap-x-2">
            <DialButton
              variant={ButtonVariant.Tertiary}
              cssClass="!text-error"
              iconBefore={<IconTrashX {...BASE_ICON_PROPS} />}
              title={deleteAllButtonLabel}
              onClick={onRemoveFiles}
            />

            {(maxFilesCount ? maxFilesCount > files?.length : true) && (
              <DialButton
                variant={ButtonVariant.Tertiary}
                iconBefore={<IconPlus {...BASE_ICON_PROPS} />}
                title={addButtonLabel}
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
          multiple={isMultiple}
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
        isMultiple={isMultiple}
        fileFormatError={fileFormatError}
        fileCountError={fileCountError}
        getIsFileFormatError={getIsFileFormatError}
        {...props}
      />
    </div>
  );
};
