import {
  useCallback,
  useState,
  useEffect,
  type DragEvent,
  useRef,
} from 'react';
import { DialFileNodeType, type DialFile } from '@/models/file';
import type { DialUploadFileItem } from '@/models/file-manager';
import { FILES_DATA_TRANSFER_TYPE } from '@/components/FileManager/constants';
import { useConflictResolution } from './use-conflict-resolution';
import type { FileConflictDecision } from '@/components/FileManager/components/ConflictResolutionPopup/ConflictResolutionPopup';

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
  onUploadArchive?: (
    file: File,
    name: string,
    destinationFolder: string,
  ) => void;
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
  onUploadArchive,
}: UseFileUploadOptions = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingOverWindow, setIsDraggingOverWindow] = useState(false);
  const [uploadError, setUploadError] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const destinationFolderRef = useRef<string>('');
  const existingFilesRef = useRef<DialFile[]>([]);

  const [pendingUploadFiles, setPendingUploadFiles] = useState<
    Map<string, DialUploadFileItem>
  >(new Map());

  const [uploadMetadata, setUploadMetadata] = useState<{
    destinationFolder: string;
  } | null>(null);

  const {
    conflictingFiles,
    conflictResolutionOpen,
    hasActiveConflictRef,
    startConflictResolution,
    closeConflictResolution,
    openConflictResolution,
    handleReplaceAll: baseHandleReplaceAll,
    handleDuplicateAll: baseHandleDuplicateAll,
    handleDecideForEach: baseHandleDecideForEach,
  } = useConflictResolution({
    getDestinationFiles: () => existingFilesRef.current,
    onResolve: (items, destinationFolder) => {
      if (!uploadMetadata) return;

      const uploadItems = items
        .map((item) => {
          const originalFile = pendingUploadFiles.get(item.sourceUrl);
          if (!originalFile) {
            return;
          }

          const finalName = item.destinationUrl.split('/').pop()!;

          return {
            fileContent: originalFile.fileContent,
            name: finalName,
          };
        })
        .filter(Boolean) as DialUploadFileItem[];

      if (uploadItems.length > 0) {
        onUploadFiles?.(uploadItems, destinationFolder);
      }
      clearUploadState();
    },
  });

  const clearUploadState = useCallback(() => {
    setPendingUploadFiles(new Map());
    setUploadMetadata(null);
  }, []);

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

  const checkFileSize = useCallback(
    (files: DialUploadFileItem[]): string[] => {
      if (!maxFileSize) return [];
      return files
        .filter((file) => file.fileContent.size > maxFileSize)
        .map((file) => file.name);
    },
    [maxFileSize],
  );

  const convertUploadItemsToDialFiles = useCallback(
    (files: DialUploadFileItem[], destinationFolder: string): DialFile[] => {
      return files.map((file) => ({
        id: file.name,
        name: file.name,
        folderId: destinationFolder,
        path: file.name,
        nodeType: DialFileNodeType.ITEM,
        parentPath: destinationFolder,
        contentLength: file.fileContent.size,
      }));
    },
    [],
  );

  const handleUpload = useCallback(
    async (
      files: DialUploadFileItem[],
      destinationFolder: string,
      existingFiles: DialFile[],
    ) => {
      setUploadError(undefined);
      existingFilesRef.current = existingFiles;

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

      const filesMap = new Map(files.map((f) => [f.name, f]));
      setPendingUploadFiles(filesMap);

      const dialFiles = convertUploadItemsToDialFiles(files, destinationFolder);

      setUploadMetadata({ destinationFolder });

      const result = startConflictResolution(destinationFolder, dialFiles, {
        destinationFolder,
      });

      if (result.hasConflicts) {
        return false;
      }

      onUploadFiles?.(files, destinationFolder);
      clearUploadState();
      return true;
    },
    [
      onUploadFiles,
      onValidateUpload,
      checkFileSize,
      maxFileSize,
      validationMessages,
      convertUploadItemsToDialFiles,
      startConflictResolution,
      clearUploadState,
    ],
  );

  const handleConflictReplace = useCallback(() => {
    baseHandleReplaceAll();
    clearUploadState();
  }, [baseHandleReplaceAll, clearUploadState]);

  const handleConflictDuplicate = useCallback(() => {
    baseHandleDuplicateAll();
    clearUploadState();
  }, [baseHandleDuplicateAll, clearUploadState]);

  const handleConflictDecideForEach = useCallback(
    (decisions: FileConflictDecision[]) => {
      baseHandleDecideForEach(decisions);
      clearUploadState();
    },
    [baseHandleDecideForEach, clearUploadState],
  );

  const handleCloseConflictResolution = useCallback(() => {
    closeConflictResolution();
    if (!hasActiveConflictRef.current) {
      clearUploadState();
    }
  }, [closeConflictResolution, hasActiveConflictRef, clearUploadState]);

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

  const openArchiveDialog = useCallback(
    (destinationFolder: string, existingFiles: DialFile[]) => {
      if (!onUploadArchive) return;

      // Only allow one .zip file
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.zip,application/zip';
      input.multiple = false;
      input.style.display = 'none';

      const handleChange = () => {
        const file = input.files?.[0];
        if (!file) {
          document.body.removeChild(input);
          return;
        }

        const archiveName = file.name.replace(/\.zip$/i, '');

        const conflict = existingFiles.some(
          (f) =>
            f.nodeType === DialFileNodeType.FOLDER &&
            f.name.toLowerCase() === archiveName.toLowerCase(),
        );

        if (conflict) {
          setUploadError(
            validationMessages.validationFailed ||
              `Folder with name "${archiveName}" already exists`,
          );
          document.body.removeChild(input);
          return;
        }

        try {
          onUploadArchive(file, archiveName, destinationFolder);
        } finally {
          document.body.removeChild(input);
        }
      };

      input.addEventListener('change', handleChange);
      document.body.appendChild(input);
      input.click();
    },
    [onUploadArchive, validationMessages],
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
    openArchiveDialog,
    fileInputRef,

    uploadConflictingFiles: conflictingFiles,
    uploadConflictResolutionOpen: conflictResolutionOpen,
    hasActiveUploadConflictRef: hasActiveConflictRef,
    openUploadConflictResolution: openConflictResolution,
    closeUploadConflictResolution: handleCloseConflictResolution,
    handleUploadConflictReplace: handleConflictReplace,
    handleUploadConflictDuplicate: handleConflictDuplicate,
    handleUploadConflictDecideForEach: handleConflictDecideForEach,
  };
};
