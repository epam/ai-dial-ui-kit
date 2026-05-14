import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import type { DialUploadFileItem } from '@/models/file-manager';
import { FOLDER_PLACEHOLDER_FILE_NAME } from '@/components/FileManager/constants';
import { DEFAULT_WARNINGS } from '@/components/FileManager/errors';
import { FileManagerCreateFolderType } from '@/types/file-manager';

export interface FolderCreationValidationMessages {
  emptyName?: string;
  duplicateName?: string;
  hiddenItemWarning?: string;
}

export interface UseFolderCreationProps {
  currentFolder?: DialFile;
  onCreateFolder?: (
    file: DialUploadFileItem,
    folderPath: string,
    fileId: string,
  ) => void | Promise<void>;
  onValidateFolderName?: (
    name: string,
    parentFolder: DialFile,
  ) => string | null;
  validationMessages?: FolderCreationValidationMessages;
}

export interface UseFolderCreationResult {
  isCreatingFolder: boolean;
  newFolderTempId: string | null;
  createdFolderPath: string | null;
  startFolderCreation: () => void;
  startGridSiblingFolderCreation: (targetFile: DialFile) => void;
  startTreeSiblingFolderCreation: (targetFile: DialFile) => void;
  startGridChildFolderCreation: (targetFile: DialFile) => void;
  startTreeChildFolderCreation: (targetFile: DialFile) => void;
  cancelFolderCreation: () => void;
  saveFolderCreation: (name: string) => Promise<void>;
  validateFolderName: (name: string) => string | null;
}

const DEFAULT_VALIDATION_MESSAGES: Required<FolderCreationValidationMessages> =
  {
    emptyName: 'Folder name cannot be empty',
    duplicateName: 'A folder with this name already exists',
    hiddenItemWarning: DEFAULT_WARNINGS.hiddenItemWarning,
  };

export const useFolderCreation = ({
  currentFolder,
  onCreateFolder,
  onValidateFolderName,
  validationMessages,
}: UseFolderCreationProps): UseFolderCreationResult => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderTempId, setNewFolderTempId] = useState<string | null>(null);
  const [creationType, setCreationType] = useState<FileManagerCreateFolderType>(
    FileManagerCreateFolderType.Folder,
  );
  const [targetFile, setTargetFile] = useState<DialFile | null>(null);
  const [createdFolderPath, setCreatedFolderPath] = useState<string | null>(
    null,
  );
  const previousPathRef = useRef<string | undefined>(currentFolder?.path);

  const messages = useMemo(
    () => ({
      ...DEFAULT_VALIDATION_MESSAGES,
      ...validationMessages,
    }),
    [validationMessages],
  );

  const targetFolder = useMemo(() => {
    if (creationType === FileManagerCreateFolderType.Folder) {
      return currentFolder;
    }
    if (creationType === FileManagerCreateFolderType.Sibling && targetFile) {
      return {
        path: targetFile.parentPath,
        items: [],
        nodeType: DialFileNodeType.FOLDER,
        name: targetFile?.parentPath?.split('/')?.pop() || '',
        folderId: '',
      } as DialFile;
    }
    if (creationType === FileManagerCreateFolderType.Child) {
      return targetFile;
    }
    return currentFolder;
  }, [creationType, targetFile, currentFolder]);

  useEffect(() => {
    const currentPath = currentFolder?.path;

    if (previousPathRef.current !== currentPath && isCreatingFolder) {
      setIsCreatingFolder(false);
      setNewFolderTempId(null);
    }

    previousPathRef.current = currentPath;
  }, [currentFolder?.path, isCreatingFolder]);

  const startFolderCreation = useCallback(() => {
    if (isCreatingFolder) return;
    previousPathRef.current = currentFolder?.path || '/';
    const tempId = `__new_folder_${Date.now()}`;
    setNewFolderTempId(tempId);
    setIsCreatingFolder(true);
    setCreationType(FileManagerCreateFolderType.Folder);
    setTargetFile(currentFolder || null);
  }, [isCreatingFolder, currentFolder]);

  const startGridSiblingFolderCreation = useCallback(
    (target: DialFile) => {
      if (isCreatingFolder) return;
      previousPathRef.current = target?.parentPath || '/';
      const tempId = `__new_folder_${Date.now()}`;
      setNewFolderTempId(tempId);
      setIsCreatingFolder(true);
      setCreationType(FileManagerCreateFolderType.Sibling);
      setTargetFile(target);
      setCreatedFolderPath(target?.parentPath || '/');
    },
    [isCreatingFolder],
  );

  const startGridChildFolderCreation = useCallback(
    (target: DialFile) => {
      if (isCreatingFolder) return;
      previousPathRef.current = target.path;
      const tempId = `__new_folder_${Date.now()}`;
      setNewFolderTempId(tempId);
      setIsCreatingFolder(true);
      setCreationType(FileManagerCreateFolderType.Child);
      setTargetFile(target);
      setCreatedFolderPath(target?.path || '/');
    },
    [isCreatingFolder],
  );

  const startTreeSiblingFolderCreation = useCallback(
    (target: DialFile) => {
      if (isCreatingFolder) return;
      previousPathRef.current = target?.parentPath || '/';
      setCreationType(FileManagerCreateFolderType.Sibling);
      setTargetFile(target);
      setCreatedFolderPath(target?.parentPath || '/');
      setIsCreatingFolder(true);
    },
    [isCreatingFolder],
  );

  const startTreeChildFolderCreation = useCallback(
    (target: DialFile) => {
      if (isCreatingFolder) return;
      previousPathRef.current = target.path;
      setCreationType(FileManagerCreateFolderType.Child);
      setTargetFile(target);
      setCreatedFolderPath(target?.path || '/');
      setIsCreatingFolder(true);
    },
    [isCreatingFolder],
  );

  const cancelFolderCreation = useCallback(() => {
    setIsCreatingFolder(false);
    setNewFolderTempId(null);
    setCreationType(FileManagerCreateFolderType.Folder);
    setTargetFile(null);
    setCreatedFolderPath(null);
    previousPathRef.current = undefined;
  }, []);

  const validateFolderName = useCallback(
    (name: string): string | null => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return messages.emptyName;
      }

      if (trimmedName.startsWith('.') && trimmedName.length > 1) {
        return messages.hiddenItemWarning;
      }

      if (targetFolder && targetFolder.items) {
        const existingNames = new Set(
          (targetFolder.items ?? [])
            .filter((item) => item.nodeType === DialFileNodeType.FOLDER)
            .map((item) => item.name.toLowerCase()),
        );

        if (existingNames.has(trimmedName.toLowerCase())) {
          return messages.duplicateName;
        }
      }

      if (onValidateFolderName && targetFolder) {
        const customError = onValidateFolderName(trimmedName, targetFolder);
        if (customError) {
          return customError;
        }
      }

      return null;
    },
    [targetFolder, onValidateFolderName, messages],
  );

  const saveFolderCreation = useCallback(
    async (name: string) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return;
      }

      const parentPath = targetFolder?.path ?? '/';
      const folderPath = `${parentPath}/${trimmedName}`;
      const placeholderFilePath = `${folderPath}/${FOLDER_PLACEHOLDER_FILE_NAME}`;

      const emptyFile = new File([], FOLDER_PLACEHOLDER_FILE_NAME, {
        type: 'text/plain',
      });

      const uploadFileItem: DialUploadFileItem = {
        fileContent: emptyFile,
        name: FOLDER_PLACEHOLDER_FILE_NAME,
      };

      if (onCreateFolder) {
        await onCreateFolder(uploadFileItem, folderPath, placeholderFilePath);
      }

      cancelFolderCreation();
    },
    [targetFolder, onCreateFolder, cancelFolderCreation],
  );

  return {
    isCreatingFolder,
    newFolderTempId,
    createdFolderPath,
    startFolderCreation,
    startGridSiblingFolderCreation,
    startTreeSiblingFolderCreation,
    startGridChildFolderCreation,
    startTreeChildFolderCreation,
    cancelFolderCreation,
    saveFolderCreation,
    validateFolderName,
  };
};
