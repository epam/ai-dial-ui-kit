import {
  useCallback,
  useState,
  useEffect,
  type DragEvent,
  useRef,
} from 'react';
import type { DialFile } from '@/models/file';
import type { DialUploadFileItem } from '@/models/file-manager';
import { FILES_DATA_TRANSFER_TYPE } from '../constants';

export interface FileUploadValidationResult {
  valid: boolean;
  message?: string;
}

export interface FileUploadValidationMessages {
  duplicateFiles?: string;
  oversizedFiles?: string;
  validationFailed?: string;
  validationError?: string;
}

export interface UseFileUploadOptions {
  onUploadFiles?: (
    files: DialUploadFileItem[],
    destinationFolder: string,
  ) => void;
  onValidateUpload?: (
    files: DialUploadFileItem[],
    existingFiles: DialFile[],
    destinationFolder: string,
  ) => FileUploadValidationResult | Promise<FileUploadValidationResult>;
  maxFileSize?: number;
  validationMessages?: FileUploadValidationMessages;
}

const isDragEventWithFiles = (
  e: Event,
): e is Event & { dataTransfer: DataTransfer } => {
  return 'dataTransfer' in e && e.dataTransfer !== null;
};

export const useFileUpload = ({
  onUploadFiles,
  onValidateUpload,
  maxFileSize,
  validationMessages = {},
}: UseFileUploadOptions = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingOverWindow, setIsDraggingOverWindow] = useState(false);
  const [uploadError, setUploadError] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const destinationFolderRef = useRef<string>('');
  const existingFilesRef = useRef<DialFile[]>([]);

  useEffect(() => {
    let dragCounter = 0;

    const handleWindowDragEnter = (e: Event) => {
      if (
        isDragEventWithFiles(e) &&
        e.dataTransfer.types.includes(FILES_DATA_TRANSFER_TYPE)
      ) {
        dragCounter++;
        setIsDraggingOverWindow(true);
      }
    };

    const handleWindowDragLeave = () => {
      dragCounter--;
      if (dragCounter === 0) {
        setIsDraggingOverWindow(false);
      }
    };

    const handleWindowDrop = () => {
      dragCounter = 0;
      setIsDraggingOverWindow(false);
    };

    const handleWindowDragOver = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);
    window.addEventListener('dragover', handleWindowDragOver);

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
      window.removeEventListener('dragover', handleWindowDragOver);
    };
  }, []);

  const checkForDuplicates = useCallback(
    (files: DialUploadFileItem[], existingFiles: DialFile[]): string[] => {
      const existingNames = new Set(
        existingFiles.map((f) => f.name.toLowerCase()),
      );
      return files
        .filter((file) => existingNames.has(file.name.toLowerCase()))
        .map((file) => file.name);
    },
    [],
  );

  const checkFileSize = useCallback(
    (files: DialUploadFileItem[]): string[] => {
      if (!maxFileSize) return [];
      return files
        .filter((file) => file.fileContent.size > maxFileSize)
        .map((file) => file.name);
    },
    [maxFileSize],
  );

  const handleUpload = useCallback(
    async (
      files: DialUploadFileItem[],
      destinationFolder: string,
      existingFiles: DialFile[],
    ) => {
      setUploadError(undefined);

      const duplicates = checkForDuplicates(files, existingFiles);
      if (duplicates.length > 0) {
        const message =
          validationMessages.duplicateFiles ||
          `Files with the same name already exist: ${duplicates.join(', ')}`;
        setUploadError(message);
        return false;
      }

      const oversizedFiles = checkFileSize(files);
      if (oversizedFiles.length > 0) {
        const sizeMB = maxFileSize
          ? (maxFileSize / (1024 * 1024)).toFixed(2)
          : 0;
        const message =
          validationMessages.oversizedFiles ||
          `Files exceed maximum size (${sizeMB}MB): ${oversizedFiles.join(', ')}`;
        setUploadError(message);
        return false;
      }

      if (onValidateUpload) {
        try {
          const validationResult = await onValidateUpload(
            files,
            existingFiles,
            destinationFolder,
          );
          if (!validationResult.valid) {
            setUploadError(
              validationResult.message ||
                validationMessages.validationFailed ||
                'Validation failed',
            );
            return false;
          }
        } catch {
          setUploadError(
            validationMessages.validationError || 'Validation error occurred',
          );
          return false;
        }
      }

      if (onUploadFiles) {
        onUploadFiles(files, destinationFolder);
      }
      return true;
    },
    [
      onUploadFiles,
      onValidateUpload,
      checkForDuplicates,
      checkFileSize,
      maxFileSize,
      validationMessages,
    ],
  );

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.types.includes('Files')) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }, []);

  const handleDrop = useCallback(
    async (
      e: DragEvent,
      destinationFolder: string,
      existingFiles: DialFile[],
    ) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (!e.dataTransfer.types.includes('Files')) {
        return;
      }

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const uploadItems: DialUploadFileItem[] = files.map((file) => ({
          fileContent: file,
          name: file.name,
        }));
        await handleUpload(uploadItems, destinationFolder, existingFiles);
      }
    },
    [handleUpload],
  );

  useEffect(() => {
    let input = fileInputRef.current;

    if (!input) {
      input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.style.display = 'none';
      document.body.appendChild(input);
      fileInputRef.current = input;
    }

    const handleChange = async () => {
      if (!input?.files?.length) return;

      const files = Array.from(input.files);
      const uploadItems: DialUploadFileItem[] = files.map((file) => ({
        fileContent: file,
        name: file.name,
      }));

      await handleUpload(
        uploadItems,
        destinationFolderRef.current,
        existingFilesRef.current,
      );

      input.value = '';
    };

    input.addEventListener('change', handleChange);

    return () => {
      if (!input) return;

      input.removeEventListener('change', handleChange);

      if (fileInputRef.current === input) {
        document.body.removeChild(input);
        fileInputRef.current = null;
      }
    };
  }, [handleUpload]);

  const openFileDialog = useCallback(
    (destinationFolder: string, existingFiles: DialFile[]) => {
      destinationFolderRef.current = destinationFolder;
      existingFilesRef.current = existingFiles;

      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setUploadError(undefined);
  }, []);

  return {
    isDragging,
    isDraggingOverWindow,
    uploadError,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    clearError,
    handleUpload,
    openFileDialog,
    fileInputRef,
  };
};
