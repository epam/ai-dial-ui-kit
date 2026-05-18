import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import type { DialUploadFileItem } from '@/models/file-manager';
import { FOLDER_PLACEHOLDER_FILE_NAME } from '@/components/FileManager/constants';
import { DEFAULT_WARNINGS } from '@/components/FileManager/errors';
import { getNextFolderName } from '@/components/FileManager/utils';

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
  newFolderDefaultName: string;
  startFolderCreation: () => void;
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
  const [newFolderDefaultName, setNewFolderDefaultName] = useState('');
  const previousPathRef = useRef<string | undefined>(currentFolder?.path);

  const messages = useMemo(
    () => ({
      ...DEFAULT_VALIDATION_MESSAGES,
      ...validationMessages,
    }),
    [validationMessages],
  );

  useEffect(() => {
    const currentPath = currentFolder?.path;

    if (previousPathRef.current !== currentPath && isCreatingFolder) {
      setIsCreatingFolder(false);
      setNewFolderTempId(null);
      setNewFolderDefaultName('');
    }

    previousPathRef.current = currentPath;
  }, [currentFolder?.path, isCreatingFolder]);

  const startFolderCreation = useCallback(() => {
    if (isCreatingFolder) return;
    const tempId = `__new_folder_${Date.now()}`;
    const siblingFolders = (currentFolder?.items ?? []).filter(
      (item) => item.nodeType === DialFileNodeType.FOLDER,
    );
    const defaultName = getNextFolderName(siblingFolders);
    setNewFolderTempId(tempId);
    setNewFolderDefaultName(defaultName);
    setIsCreatingFolder(true);
  }, [isCreatingFolder, currentFolder]);

  const cancelFolderCreation = useCallback(() => {
    setIsCreatingFolder(false);
    setNewFolderTempId(null);
    setNewFolderDefaultName('');
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

      if (currentFolder) {
        const existingNames = new Set(
          (currentFolder.items ?? [])
            .filter((item) => item.nodeType === DialFileNodeType.FOLDER)
            .map((item) => item.name.toLowerCase()),
        );

        if (existingNames.has(trimmedName.toLowerCase())) {
          return messages.duplicateName;
        }
      }

      if (onValidateFolderName && currentFolder) {
        const customError = onValidateFolderName(trimmedName, currentFolder);
        if (customError) {
          return customError;
        }
      }

      return null;
    },
    [currentFolder, onValidateFolderName, messages],
  );

  const saveFolderCreation = useCallback(
    async (name: string) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return;
      }

      const parentPath = currentFolder?.path ?? '/';
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
    [currentFolder, onCreateFolder, cancelFolderCreation],
  );

  return {
    isCreatingFolder,
    newFolderTempId,
    newFolderDefaultName,
    startFolderCreation,
    cancelFolderCreation,
    saveFolderCreation,
    validateFolderName,
  };
};
