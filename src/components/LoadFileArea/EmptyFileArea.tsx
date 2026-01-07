import { DialErrorText } from '@/components/ErrorText/ErrorText';
import { ButtonAppearance } from '@/types/button';
import classNames from 'classnames';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FC,
  type KeyboardEvent,
} from 'react';
import type { DropTargetMonitor } from 'react-dnd';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { DialPrimaryButton } from '@/components/Button/ButtonWrappers';

export interface DialEmptyFileAreaProps {
  emptyTextFirstLine?: string;
  emptyTextSecondLine?: string;
  emptyButtonLabel?: string;
  acceptTypes: string;
  maxFilesCount?: number;
  multiple?: boolean;
  fileFormatError?: string;
  fileCountError?: string;
  getIsFileFormatError?: (fileItems: File[] | DataTransferItem[]) => boolean;
  onChange: (files: File[]) => void;
}

/**
 * A drag-and-drop file upload area component that allows users to upload files
 * either by dragging them into the drop zone or selecting them via the file picker.
 * Displays customizable helper text, an upload button, and validation messages for file format
 * or maximum file count errors. Integrates with `react-dnd` for drag-and-drop behavior.
 *
 * @example
 * ```tsx
 * <DialEmptyFileArea
 *   onChange={(files) => console.log('Selected files:', files)}
 *   emptyTextFirstLine="Drag & drop files here"
 *   emptyTextSecondLine="or click below to select files"
 *   emptyButtonLabel="Choose files"
 *   acceptTypes="application/pdf, application/txt, image/svg+xml"
 *   maxFilesCount={3}
 *   multiple
 *   fileFormatError="Only PNG and JPG files are allowed"
 *   fileCountError="You can upload up to 3 files"
 *   getIsFileFormatError={(files) =>
 *     files.some(file => !file.name.endsWith('.png') && !file.name.endsWith('.jpg'))
 *   }
 * />
 * ```
 *
 * @param {DialEmptyFileAreaProps} props - The properties for the empty file area component.
 * @param {(files: File[]) => void} props.onChange - Callback fired when valid files are selected or dropped.
 * @param {string} [props.emptyTextFirstLine] - Text displayed as the first line inside the drop area.
 * @param {string} [props.emptyTextSecondLine] - Text displayed as the second line inside the drop area.
 * @param {string} [props.emptyButtonLabel] - Label for the upload button shown below the text.
 * @param {string} [props.acceptTypes] - Comma-separated list of accepted file MIME types (e.g., "application/pdf").
 * @param {number} [props.maxFilesCount] - Maximum allowed number of files that can be uploaded at once.
 * @param {boolean} [props.multiple=false] - Whether multiple file uploads are allowed.
 * @param {string} [props.fileFormatError] - Error message shown when an invalid file format is detected.
 * @param {string} [props.fileCountError] - Error message shown when the selected files exceed the limit.
 * @param {(files: File[] | DataTransferItem[]) => boolean} [props.getIsFileFormatError] - Optional validation function that returns `true` if selected files have invalid formats.
 *
 * @returns {JSX.Element} The rendered drag-and-drop upload area with file validation feedback.
 */
export const DialEmptyFileArea: FC<DialEmptyFileAreaProps> = ({
  onChange,
  emptyTextFirstLine,
  emptyTextSecondLine,
  emptyButtonLabel,
  acceptTypes,
  maxFilesCount,
  multiple,
  fileFormatError,
  fileCountError,
  getIsFileFormatError,
}) => {
  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[] | DataTransferItem[]>([]);
  const [isErrorFileFormat, setIsErrorFileFormat] = useState<boolean>(false);

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const filesList = e.target.files;
      if (filesList && filesList.length > 0) {
        const selectedFiles = Array.from(filesList);
        const isFormatError = getIsFileFormatError?.(selectedFiles);

        if (!isFormatError) {
          onChange(selectedFiles);
        } else {
          setIsErrorFileFormat(true);
        }
      }
    },
    [getIsFileFormatError, onChange],
  );

  const getIsFileCountError = useCallback(
    (fileItems: File[] | DataTransferItem[]) => {
      return maxFilesCount && fileItems?.length > maxFilesCount;
    },
    [maxFilesCount],
  );

  const isFileValidationError = useMemo(() => {
    return isErrorFileFormat || getIsFileCountError(files);
  }, [isErrorFileFormat, files, getIsFileCountError]);

  const clearErrorState = () => {
    setFiles([]);
    setIsErrorFileFormat(false);
  };

  useEffect(() => {
    clearErrorState();
  }, [acceptTypes]);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(selectedFiles: { files: File[] }) {
        const files = selectedFiles.files;
        if (!getIsFileFormatError?.(files) && !getIsFileCountError(files)) {
          onChange(files);
        }
        clearErrorState();
      },
      collect: (monitor: DropTargetMonitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    [onFileChange],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLLabelElement>) => {
    if (event.key === 'Enter' || event.key === 'Space') {
      event.preventDefault(); // Prevent scrolling on space press
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (event: DragEvent) => {
    event?.preventDefault();

    const fileItems = Array.from(event.dataTransfer?.items ?? []);

    setIsErrorFileFormat(!!getIsFileFormatError?.(fileItems));
    setFiles(fileItems);
  };

  const handleDragLeave = (event: DragEvent) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    clearErrorState();
  };

  const containerClassName = classNames(
    'border border-dashed rounded w-full cursor-pointer relative h-full hover:border-hover',
    !canDrop && !isFileValidationError && 'border-primary',
    canDrop && (!isOver ? 'border-hover' : 'border-accent-primary'),
    isFileValidationError && 'border-error',
  );

  drop(dropRef);

  return (
    <>
      <div
        className={containerClassName}
        ref={dropRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label
          htmlFor="file"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="flex flex-col items-center cursor-pointer h-full w-full text-secondary dial-tiny justify-center"
        >
          {emptyTextFirstLine && <p className="mb-1">{emptyTextFirstLine}</p>}
          {emptyTextSecondLine && (
            <p className="mb-0.5">{emptyTextSecondLine}</p>
          )}
          {emptyButtonLabel && (
            <DialPrimaryButton
              appearance={ButtonAppearance.Ghost}
              label={emptyButtonLabel}
              onClick={() => fileInputRef.current?.click()}
            />
          )}
        </label>
        <input
          multiple={multiple}
          id="file"
          type="file"
          ref={fileInputRef}
          hidden
          accept={acceptTypes}
          onChange={onFileChange}
        />
      </div>
      <>
        {isErrorFileFormat ? (
          <DialErrorText errorText={fileFormatError} />
        ) : (
          getIsFileCountError(files) && (
            <DialErrorText errorText={fileCountError} />
          )
        )}
      </>
    </>
  );
};
