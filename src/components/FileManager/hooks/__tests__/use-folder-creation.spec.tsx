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
      expect(result.current.newFolderDefaultName).toBe('');

      act(() => {
        result.current.startFolderCreation();
      });

      expect(result.current.isCreatingFolder).toBe(true);
      expect(result.current.newFolderTempId).toMatch(/^__new_folder_\d+$/);
      expect(result.current.newFolderDefaultName).toBe('New folder 1');
    });

    test('generates "New folder 1" when no folders exist', () => {
      const emptyFolder: DialFile = { ...mockCurrentFolder, items: [] };
      const { result } = renderHook(() =>
        useFolderCreation({ currentFolder: emptyFolder }),
      );

      act(() => {
        result.current.startFolderCreation();
      });

      expect(result.current.newFolderDefaultName).toBe('New folder 1');
    });

    test('increments name when "New folder 1" already exists', () => {
      const folderWithNew1: DialFile = {
        ...mockCurrentFolder,
        items: [
          {
            id: '/test-folder/New folder 1',
            name: 'New folder 1',
            path: '/test-folder/New folder 1',
            parentPath: '/test-folder',
            nodeType: DialFileNodeType.FOLDER,
            folderId: '/test-folder/New folder 1',
          },
        ],
      };
      const { result } = renderHook(() =>
        useFolderCreation({ currentFolder: folderWithNew1 }),
      );

      act(() => {
        result.current.startFolderCreation();
      });

      expect(result.current.newFolderDefaultName).toBe('New folder 2');
    });

    test('skips over existing numbered folders', () => {
      const folderWithMultiple: DialFile = {
        ...mockCurrentFolder,
        items: [
          {
            id: '/f/New folder 1',
            name: 'New folder 1',
            path: '/f/New folder 1',
            parentPath: '/f',
            nodeType: DialFileNodeType.FOLDER,
            folderId: '/f',
          },
          {
            id: '/f/New folder 2',
            name: 'New folder 2',
            path: '/f/New folder 2',
            parentPath: '/f',
            nodeType: DialFileNodeType.FOLDER,
            folderId: '/f',
          },
          {
            id: '/f/New folder 3',
            name: 'New folder 3',
            path: '/f/New folder 3',
            parentPath: '/f',
            nodeType: DialFileNodeType.FOLDER,
            folderId: '/f',
          },
        ],
      };
      const { result } = renderHook(() =>
        useFolderCreation({ currentFolder: folderWithMultiple }),
      );

      act(() => {
        result.current.startFolderCreation();
      });

      expect(result.current.newFolderDefaultName).toBe('New folder 4');
    });
  });

  describe('cancelFolderCreation', () => {
    test('resets creation state including default name', () => {
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
      expect(result.current.newFolderDefaultName).toBe('New folder 1');

      act(() => {
        result.current.cancelFolderCreation();
      });

      expect(result.current.isCreatingFolder).toBe(false);
      expect(result.current.newFolderTempId).toBeNull();
      expect(result.current.newFolderDefaultName).toBe('');
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

    test('returns error for names with consecutive dots', () => {
      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
        }),
      );

      expect(result.current.validateFolderName('...')).toBe(
        'Name cannot contain consecutive dots',
      );
      expect(result.current.validateFolderName('a..b')).toBe(
        'Name cannot contain consecutive dots',
      );
      expect(result.current.validateFolderName('name..')).toBe(
        'Name cannot contain consecutive dots',
      );
    });

    test('consecutive dots error takes precedence over the leading-dot hidden warning', () => {
      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
        }),
      );

      const error = result.current.validateFolderName('..hidden');
      expect(error).toBe('Name cannot contain consecutive dots');
    });

    test('still allows a single leading dot without consecutive dots', () => {
      const { result } = renderHook(() =>
        useFolderCreation({
          currentFolder: mockCurrentFolder,
        }),
      );

      const error = result.current.validateFolderName('.hidden');
      expect(error).toBe(
        'warning__A dot at the start of the name will make the item hidden',
      );
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

    test('resets creation state before onCreateFolder resolves', async () => {
      let resolveCreate!: () => void;
      const onCreateFolder = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveCreate = resolve;
          }),
      );

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

      // Use async act so React flushes state updates from cancelFolderCreation,
      // even though onCreateFolder is still pending.
      let savePromise: Promise<void> | undefined;
      await act(async () => {
        savePromise = result.current.saveFolderCreation('New Folder');
        // Yield to microtasks so the synchronous part of saveFolderCreation
        // (including cancelFolderCreation's state updates) is flushed.
        await Promise.resolve();
      });

      // onCreateFolder was called but is still pending.
      expect(onCreateFolder).toHaveBeenCalledTimes(1);
      // State has been reset even though onCreateFolder hasn't resolved.
      expect(result.current.isCreatingFolder).toBe(false);
      expect(result.current.newFolderTempId).toBeNull();

      // Now resolve and let saveFolderCreation finish.
      await act(async () => {
        resolveCreate();
        await savePromise;
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
