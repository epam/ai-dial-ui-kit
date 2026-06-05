import {
  useState,
  useRef,
  useCallback,
  type DragEvent,
  type FC,
  type ReactNode,
} from 'react';
import { useDrop, type DropTargetMonitor } from 'react-dnd';
import classNames from 'classnames';
import { NativeTypes } from 'react-dnd-html5-backend';
import { DialErrorText } from '@/components/CaptionText/CaptionText';

interface FilledDropZoneProps {
  children: ReactNode;
  existingFiles: File[];
  onDrop: (files: File[]) => void;
  getIsFileFormatError?: (fileItems: File[] | DataTransferItem[]) => boolean;
  getIsFileSizeError?: (fileItems: File[] | DataTransferItem[]) => boolean;
  maxFilesCount?: number;
  fileFormatError?: string;
  fileSizeError?: string;
  fileCountError?: string;
}

export const FilledDropZone: FC<FilledDropZoneProps> = ({
  children,
  existingFiles,
  onDrop,
  getIsFileFormatError,
  getIsFileSizeError,
  maxFilesCount,
  fileFormatError,
  fileSizeError,
  fileCountError,
}) => {
  const dropRef = useRef<HTMLDivElement>(null);
  const [isErrorFileFormat, setIsErrorFileFormat] = useState(false);
  const [isErrorFileSize, setIsErrorFileSize] = useState(false);
  const [draggedCount, setDraggedCount] = useState(0);

  const clearErrorState = useCallback(() => {
    setIsErrorFileFormat(false);
    setIsErrorFileSize(false);
    setDraggedCount(0);
  }, []);

  const getIsFileCountError = useCallback(
    (files: File[] | DataTransferItem[]) =>
      !!(maxFilesCount && existingFiles.length + files.length > maxFilesCount),
    [maxFilesCount, existingFiles.length],
  );

  const isError = isErrorFileFormat || isErrorFileSize;

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(selectedFiles: { files: File[] }) {
        const dropped = selectedFiles.files;
        const merged = [...existingFiles, ...dropped];

        const hasFormatError = getIsFileFormatError?.(dropped) ?? false;
        const hasSizeError = getIsFileSizeError?.(dropped) ?? false;
        const hasCountError = getIsFileCountError?.(dropped) ?? false;

        setIsErrorFileFormat(hasFormatError);
        setIsErrorFileSize(hasSizeError);

        if (hasFormatError || hasSizeError || hasCountError) {
          setDraggedCount(dropped.length);
          return;
        }

        onDrop(merged);
        clearErrorState();
      },
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [
      existingFiles,
      onDrop,
      getIsFileFormatError,
      getIsFileSizeError,
      getIsFileCountError,
      clearErrorState,
    ],
  );

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();

    const fileItems = Array.from(event.dataTransfer?.items ?? []);

    setIsErrorFileFormat(!!getIsFileFormatError?.(fileItems));
    setIsErrorFileSize(false);
    setDraggedCount(fileItems.length);
  };

  const handleDragLeave = (event: DragEvent) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    clearErrorState();
  };

  drop(dropRef);

  const isCountError = getIsFileCountError(
    Array.from({ length: draggedCount }) as DataTransferItem[],
  );

  return (
    <div className="h-full flex flex-col">
      <div
        ref={dropRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={classNames(
          'flex-1 min-h-0 border border-solid rounded p-2 overflow-y-auto',
          !isError &&
            !isCountError &&
            (canDrop && isOver ? 'border-accent-primary' : 'border-primary'),
          (isError || isCountError) && 'border-error',
        )}
      >
        {children}
      </div>
      {isErrorFileFormat && <DialErrorText text={fileFormatError} />}
      {isErrorFileSize && <DialErrorText text={fileSizeError} />}
      {!isErrorFileFormat && !isErrorFileSize && isCountError && (
        <DialErrorText text={fileCountError} />
      )}
    </div>
  );
};
