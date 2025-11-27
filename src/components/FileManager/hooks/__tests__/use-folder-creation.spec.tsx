import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { useFolderCreation } from '@/components/FileManager/hooks/use-folder-creation';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import { FOLDER_PLACEHOLDER_FILE_NAME } from '@/components/FileManager/constants';

const mockCurrentFolder: DialFile = {
  id: '/test-folder',
  name: 'Test Folder',
  path: '/test-folder',
  parentPath: '/',
  nodeType: DialFileNodeType.FOLDER,
  folderId: '/test-folder',
  items: [
    {
      id: '/test-folder/existing-folder',
      name: 'Existing Folder',
      path: '/test-folder/existing-folder',
      parentPath: '/test-folder',
      nodeType: DialFileNodeType.FOLDER,
      folderId: '/test-folder/existing-folder',
    },
  ],
};

describe('Dial UI Kit :: useFolderCreation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('startFolderCreation', () => {
    test('sets isCreatingFolder to true and generates tempId', () => {
      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
        }),
      );

      expect(result.current.isCreatingFolder).toBe(false);
      expect(result.current.newFolderTempId).toBeNull();

      act(() => {
        result.current.startFolderCreation();
      });

      expect(result.current.isCreatingFolder).toBe(true);
      expect(result.current.newFolderTempId).toMatch(/^__new_folder_\d+$/);
    });
  });

  describe('cancelFolderCreation', () => {
    test('resets creation state', () => {
      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
        }),
      );

      act(() => {
        result.current.startFolderCreation();
      });

      expect(result.current.isCreatingFolder).toBe(true);
      expect(result.current.newFolderTempId).not.toBeNull();

      act(() => {
        result.current.cancelFolderCreation();
      });

      expect(result.current.isCreatingFolder).toBe(false);
      expect(result.current.newFolderTempId).toBeNull();
    });
  });

  describe('validateFolderName', () => {
    test('returns error for empty name', () => {
      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
        }),
      );

      const error = result.current.validateFolderName('');
      expect(error).toBe('Folder name cannot be empty');
    });

    test('returns error for whitespace-only name', () => {
      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
        }),
      );

      const error = result.current.validateFolderName('   ');
      expect(error).toBe('Folder name cannot be empty');
    });

    test('returns error for duplicate name (case-insensitive)', () => {
      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
        }),
      );

      const error = result.current.validateFolderName('EXISTING FOLDER');
      expect(error).toBe('A folder with this name already exists');
    });

    test('returns null for valid unique name', () => {
      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
        }),
      );

      const error = result.current.validateFolderName('New Folder');
      expect(error).toBeNull();
    });

    test('uses custom validation messages', () => {
      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
          validationMessages: {
            emptyName: 'Custom empty message',
            duplicateName: 'Custom duplicate message',
          },
        }),
      );

      expect(result.current.validateFolderName('')).toBe(
        'Custom empty message',
      );
      expect(result.current.validateFolderName('Existing Folder')).toBe(
        'Custom duplicate message',
      );
    });

    test('calls custom validator and returns its error', () => {
      const onValidateFolderName = vi.fn((name: string) => {
        if (name.includes('invalid')) {
          return 'Custom validation error';
        }
        return null;
      });

      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
          onValidateFolderName,
        }),
      );

      const error = result.current.validateFolderName('invalid name');
      expect(error).toBe('Custom validation error');
      expect(onValidateFolderName).toHaveBeenCalledWith(
        'invalid name',
        mockCurrentFolder,
      );
    });

    test('prioritizes built-in validation over custom', () => {
      const onValidateFolderName = vi.fn(() => 'Custom error');

      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
          onValidateFolderName,
        }),
      );

      const error = result.current.validateFolderName('');
      expect(error).toBe('Folder name cannot be empty');
      expect(onValidateFolderName).not.toHaveBeenCalled();
    });

    test('validates without currentFolder', () => {
      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: undefined,
        }),
      );

      expect(result.current.validateFolderName('')).toBe(
        'Folder name cannot be empty',
      );
      expect(result.current.validateFolderName('Valid Name')).toBeNull();
    });
  });

  describe('saveFolderCreation', () => {
    test('creates folder with correct parameters', async () => {
      const onCreateFolder = vi.fn();

      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
          onCreateFolder,
        }),
      );

      await act(async () => {
        await result.current.saveFolderCreation('New Folder');
      });

      expect(onCreateFolder).toHaveBeenCalledTimes(1);

      const [file, folderPath, fileId] = onCreateFolder.mock.calls[0];

      expect(file.name).toBe(FOLDER_PLACEHOLDER_FILE_NAME);
      expect(file.fileContent).toBeInstanceOf(File);
      expect(file.fileContent.name).toBe(FOLDER_PLACEHOLDER_FILE_NAME);
      expect(folderPath).toBe('/test-folder/New Folder');
      expect(fileId).toBe(
        `/test-folder/New Folder/${FOLDER_PLACEHOLDER_FILE_NAME}`,
      );
    });

    test('trims folder name before creating', async () => {
      const onCreateFolder = vi.fn();

      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
          onCreateFolder,
        }),
      );

      await act(async () => {
        await result.current.saveFolderCreation('  Trimmed Folder  ');
      });

      const [, folderPath] = onCreateFolder.mock.calls[0];
      expect(folderPath).toBe('/test-folder/Trimmed Folder');
    });

    test('does not create folder with empty name', async () => {
      const onCreateFolder = vi.fn();

      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
          onCreateFolder,
        }),
      );

      await act(async () => {
        await result.current.saveFolderCreation('   ');
      });

      expect(onCreateFolder).not.toHaveBeenCalled();
    });

    test('resets creation state after successful save', async () => {
      const onCreateFolder = vi.fn();

      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
          onCreateFolder,
        }),
      );

      act(() => {
        result.current.startFolderCreation();
      });

      expect(result.current.isCreatingFolder).toBe(true);

      await act(async () => {
        await result.current.saveFolderCreation('New Folder');
      });

      await waitFor(() => {
        expect(result.current.isCreatingFolder).toBe(false);
        expect(result.current.newFolderTempId).toBeNull();
      });
    });

    test('does not call onCreateFolder when callback is undefined', async () => {
      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
        }),
      );

      await act(async () => {
        await result.current.saveFolderCreation('New Folder');
      });

      expect(result.current.isCreatingFolder).toBe(false);
    });
  });

  describe('path change behavior', () => {
    test('resets creation state when currentFolder path changes', () => {
      const { result, rerender } = renderHook(
        ({ folder }) =>
          useFolderCreation({
            currentFolder: folder,
          }),
        {
          initialProps: {
            folder: mockCurrentFolder,
          },
        },
      );

      act(() => {
        result.current.startFolderCreation();
      });

      expect(result.current.isCreatingFolder).toBe(true);

      const newFolder: DialFile = {
        ...mockCurrentFolder,
        path: '/different-path',
      };

      rerender({ folder: newFolder });

      expect(result.current.isCreatingFolder).toBe(false);
      expect(result.current.newFolderTempId).toBeNull();
    });

    test('does not reset creation state when path remains the same', () => {
      const { result, rerender } = renderHook(
        ({ folder }) =>
          useFolderCreation({
            currentFolder: folder,
          }),
        {
          initialProps: {
            folder: mockCurrentFolder,
          },
        },
      );

      act(() => {
        result.current.startFolderCreation();
      });

      const tempId = result.current.newFolderTempId;

      rerender({ folder: mockCurrentFolder });

      expect(result.current.isCreatingFolder).toBe(true);
      expect(result.current.newFolderTempId).toBe(tempId);
    });

    test('does not reset when isCreatingFolder is false', () => {
      const { result, rerender } = renderHook(
        ({ folder }) =>
          useFolderCreation({
            currentFolder: folder,
          }),
        {
          initialProps: {
            folder: mockCurrentFolder,
          },
        },
      );

      expect(result.current.isCreatingFolder).toBe(false);

      const newFolder: DialFile = {
        ...mockCurrentFolder,
        path: '/different-path',
      };

      rerender({ folder: newFolder });

      expect(result.current.isCreatingFolder).toBe(false);
      expect(result.current.newFolderTempId).toBeNull();
    });
  });

  describe('memoization', () => {
    test('memoizes validation messages correctly', () => {
      const validationMessages = {
        emptyName: 'Custom empty',
        duplicateName: 'Custom duplicate',
      };

      const { result, rerender } = renderHook(
        ({ messages }) =>
          useFolderCreation({
            currentFolder: mockCurrentFolder,
            validationMessages: messages,
          }),
        {
          initialProps: { messages: validationMessages },
        },
      );

      const firstValidate = result.current.validateFolderName;

      rerender({ messages: validationMessages });

      expect(result.current.validateFolderName).toBe(firstValidate);
    });

    test('updates when validationMessages change', () => {
      const { result, rerender } = renderHook(
        ({ messages }) =>
          useFolderCreation({
            currentFolder: mockCurrentFolder,
            validationMessages: messages,
          }),
        {
          initialProps: { messages: { emptyName: 'First' } },
        },
      );

      expect(result.current.validateFolderName('')).toBe('First');

      rerender({ messages: { emptyName: 'Second' } });

      expect(result.current.validateFolderName('')).toBe('Second');
    });
  });
});
