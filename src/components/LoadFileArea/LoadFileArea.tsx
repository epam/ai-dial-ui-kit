import {
  useCallback,
  useMemo,
  type FC,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {
  DialEmptyFileArea,
  type DialEmptyFileAreaProps,
} from './EmptyFileArea';
import { DialFilledInput } from './FilledInput';
import { DialRemoveButton } from '@/components/RemoveButton/RemoveButton';
import { DialErrorText } from '@/components/CaptionText/CaptionText';
import { FilledDropZone } from './FilledDropZone';

export interface DialLoadFileAreaProps extends DialEmptyFileAreaProps {
  files?: File[];
  dynamicIcon?: (name: string) => ReactNode;
  iconBeforeInput?: ReactNode;
  isInvalid?: (file: File) => boolean;
  errorText?: string;
  removeButtonAriaLabel?: string;
}

/**
 * A drag-and-drop file upload area component that allows users to upload files
 * aliases: FileDropZone|DragDropUpload
 * Design system 1.0
 *
 * either by dragging them into the area or by selecting them through the file picker.
 * Displays helpful text, button prompts, and validation errors for file format or count limits.
 *
 * @example
 * ```tsx
 * <DialEmptyFileArea
 *   onChange={(files) => console.log(files)}
 *   emptyTextFirstLine="Drag & drop your files here"
 *   emptyTextSecondLine="or click the button below to upload"
 *   emptyButtonLabel="Upload files"
 *   acceptTypes="application/pdf, application/txt, image/svg+xml"
 *   maxFilesCount={5}
 *   isMultiple
 *   fileFormatError="Unsupported file format"
 *   fileCountError="You can upload up to 5 files only"
 *   getIsFileFormatError={(files) => files.some(file => !file.name.endsWith('.jpg') && !file.name.endsWith('.png'))}
 * />
 * ```
 *
 * @param {DialEmptyFileAreaProps} props - The properties for the empty file area component.
 * @param {(files: File[]) => void} props.onChange - Callback fired when valid files are selected or dropped.
 * @param {string} [props.emptyTextFirstLine] - Optional text displayed as the first line in the empty area.
 * @param {string} [props.emptyTextSecondLine] - Optional text displayed as the second line in the empty area.
 * @param {string} [props.emptyButtonLabel] - Label text for the upload button.
 * @param {string} [props.acceptTypes] - Comma-separated list of accepted file MIME types (e.g., "application/pdf").
 * @param {number} [props.maxFilesCount] - Maximum allowed number of files to upload at once.
 * @param {boolean} [props.multiple=false] - Whether multiple file uploads are allowed.
 * @param {string} [props.fileFormatError] - Error message displayed when an invalid file format is detected.
 * @param {string} [props.fileCountError] - Error message displayed when the file count exceeds the limit.
 * @param {(files: File[]) => boolean} [props.getIsFileFormatError] - Optional validation callback that checks whether selected files have valid formats.
 *
 * @returns {JSX.Element} The rendered drag-and-drop file upload area with optional validation feedback.
 */
export const DialLoadFileArea: FC<DialLoadFileAreaProps> = (props) => {
  const {
    files,
    iconBeforeInput,
    dynamicIcon,
    onChange: onChangeFile,
    isInvalid,
    errorText,
    removeButtonAriaLabel,
    getIsMultiFilesSizeError,
    multiFilesSizeError,
    getIsFileFormatError,
    getIsFileSizeError,
    maxFilesCount,
  } = props;

  const removeClick = useCallback(
    (e: MouseEvent, fileUrl: string) => {
      e.stopPropagation();
      onChangeFile(files?.filter((f) => f.name !== fileUrl) || []);
    },
    [onChangeFile, files],
  );

  const removeFile = useCallback(
    (fileUrl: string) => (
      <DialRemoveButton
        aria-label={removeButtonAriaLabel}
        onClick={(e) => removeClick(e, fileUrl)}
      />
    ),
    [removeButtonAriaLabel, removeClick],
  );

  const fileList = useMemo(() => {
    return (
      <div className="flex flex-col gap-y-1">
        {files?.map((file, index) => (
          <DialFilledInput
            key={file.name + index}
            id={file.name}
            value={file.name}
            iconAfter={removeFile(file.name)}
            iconBefore={iconBeforeInput || dynamicIcon?.(file.name)}
            invalid={isInvalid?.(file)}
            error={isInvalid?.(file) ? errorText : ''}
          />
        ))}
      </div>
    );
  }, [files, iconBeforeInput, dynamicIcon, isInvalid, errorText, removeFile]);

  return (
    <DndProvider backend={HTML5Backend}>
      {!files || files.length === 0 ? (
        <DialEmptyFileArea {...props} onChange={onChangeFile} />
      ) : (
        <>
          <FilledDropZone
            existingFiles={files}
            onDrop={onChangeFile}
            getIsFileFormatError={getIsFileFormatError}
            getIsFileSizeError={getIsFileSizeError}
            maxFilesCount={maxFilesCount}
            fileFormatError={props.fileFormatError}
            fileSizeError={props.fileSizeError}
            fileCountError={props.fileCountError}
          >
            {fileList}
          </FilledDropZone>
          {getIsMultiFilesSizeError?.(files) && (
            <DialErrorText text={multiFilesSizeError} />
          )}
        </>
      )}
    </DndProvider>
  );
};
