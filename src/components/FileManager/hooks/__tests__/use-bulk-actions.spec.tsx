import { renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { useBulkActions } from '@/components/FileManager/hooks/use-bulk-actions';
import { DialFileManagerActions } from '@/types/file-manager';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import type { MouseEvent } from 'react';
import { DialFilePermission } from '@/models/file';

const testFiles: DialFile[] = [
  {
    id: '1',
    folderId: 'folder1',
    path: '/test/file1.txt',
    name: 'file1.txt',
    nodeType: DialFileNodeType.ITEM,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    folderId: 'folder1',
    path: '/test/file2.txt',
    name: 'file2.txt',
    nodeType: DialFileNodeType.ITEM,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    folderId: 'folder1',
    path: '/test/file3.txt',
    name: 'file3.txt',
    nodeType: DialFileNodeType.ITEM,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const writableFile: DialFile = {
  ...testFiles[0],
  permissions: [DialFilePermission.WRITE],
};

const readOnlyFile: DialFile = {
  ...testFiles[1],
  permissions: [],
};

const noPermissionsFile: DialFile = {
  ...testFiles[2],
  permissions: undefined,
};

const defaultActionLabels = {
  [DialFileManagerActions.Duplicate]: 'Duplicate',
  [DialFileManagerActions.Copy]: 'Copy to',
  [DialFileManagerActions.Move]: 'Move to',
  [DialFileManagerActions.Download]: 'Download',
  [DialFileManagerActions.Delete]: 'Delete',
};

const mockMouseEvent = {} as MouseEvent<Element, globalThis.MouseEvent>;

describe('Dial UI Kit :: useBulkActions', () => {
  test('returns empty array when no files selected', () => {
    const selectedFiles = new Map<string, DialFile>();
    const { result } = renderHook(() =>
      useBulkActions({
        selectedFiles,
        actionLabels: defaultActionLabels,
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        getCurrentFolderPath: () => '/test',
        onClearSelection: vi.fn(),
      }),
    );

    expect(result.current).toEqual([]);
  });

  test('returns empty array when actionLabels is undefined', () => {
    const selectedFiles = new Map<string, DialFile>([
      [testFiles[0].path, testFiles[0]],
    ]);
    const { result } = renderHook(() =>
      useBulkActions({
        selectedFiles,
        actionLabels: undefined,
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        getCurrentFolderPath: () => '/test',
        onClearSelection: vi.fn(),
      }),
    );

    expect(result.current).toEqual([]);
  });

  test('returns all actions when all labels provided', () => {
    const selectedFiles = new Map<string, DialFile>([
      [testFiles[0].path, testFiles[0]],
      [testFiles[1].path, testFiles[1]],
    ]);

    const { result } = renderHook(() =>
      useBulkActions({
        selectedFiles,
        actionLabels: defaultActionLabels,
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        getCurrentFolderPath: () => '/test',
        onClearSelection: vi.fn(),
      }),
    );

    expect(result.current).toHaveLength(5);
    expect(result.current.map((a) => a.key)).toEqual([
      DialFileManagerActions.Move,
      DialFileManagerActions.Copy,
      DialFileManagerActions.Duplicate,
      DialFileManagerActions.Delete,
      DialFileManagerActions.Download,
    ]);
  });

  test('returns only actions with provided labels', () => {
    const selectedFiles = new Map<string, DialFile>([
      [testFiles[0].path, testFiles[0]],
    ]);

    const partialLabels = {
      [DialFileManagerActions.Copy]: 'Copy to',
      [DialFileManagerActions.Delete]: 'Delete',
    };

    const { result } = renderHook(() =>
      useBulkActions({
        selectedFiles,
        actionLabels: partialLabels,
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        getCurrentFolderPath: () => '/test',
        onClearSelection: vi.fn(),
      }),
    );

    expect(result.current).toHaveLength(2);
    expect(result.current.map((a) => a.key)).toEqual([
      DialFileManagerActions.Copy,
      DialFileManagerActions.Delete,
    ]);
  });

  test('duplicate action calls onDuplicate with selected files', () => {
    const onDuplicate = vi.fn();
    const selectedFiles = new Map<string, DialFile>([
      [testFiles[0].path, testFiles[0]],
      [testFiles[1].path, testFiles[1]],
    ]);

    const { result } = renderHook(() =>
      useBulkActions({
        selectedFiles,
        actionLabels: { [DialFileManagerActions.Duplicate]: 'Duplicate' },
        onDuplicate,
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),

        getCurrentFolderPath: () => '/test',
        onClearSelection: vi.fn(),
      }),
    );

    const duplicateAction = result.current[0];
    duplicateAction.onClick?.({
      key: duplicateAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onDuplicate).toHaveBeenCalledTimes(1);
    expect(onDuplicate).toHaveBeenCalledWith([testFiles[0], testFiles[1]]);
  });

  test('copy action calls onCopy with selected files', () => {
    const onCopy = vi.fn();
    const selectedFiles = new Map<string, DialFile>([
      [testFiles[0].path, testFiles[0]],
    ]);

    const { result } = renderHook(() =>
      useBulkActions({
        selectedFiles,
        actionLabels: { [DialFileManagerActions.Copy]: 'Copy to' },
        onDuplicate: vi.fn(),
        onCopy,
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        getCurrentFolderPath: () => '/test',
        onClearSelection: vi.fn(),
      }),
    );

    const copyAction = result.current[0];
    copyAction.onClick?.({ key: copyAction.key, domEvent: mockMouseEvent });

    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(onCopy).toHaveBeenCalledWith([testFiles[0]]);
  });

  test('move action calls onMove with selected files', () => {
    const onMove = vi.fn();
    const selectedFiles = new Map<string, DialFile>([
      [testFiles[0].path, testFiles[0]],
      [testFiles[1].path, testFiles[1]],
    ]);

    const { result } = renderHook(() =>
      useBulkActions({
        selectedFiles,
        actionLabels: { [DialFileManagerActions.Move]: 'Move to' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove,
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        getCurrentFolderPath: () => '/test',
        onClearSelection: vi.fn(),
      }),
    );

    const moveAction = result.current[0];
    moveAction.onClick?.({ key: moveAction.key, domEvent: mockMouseEvent });

    expect(onMove).toHaveBeenCalledTimes(1);
    expect(onMove).toHaveBeenCalledWith([testFiles[0], testFiles[1]]);
  });

  test('download action calls onDownload with selected files', () => {
    const onDownload = vi.fn();
    const selectedFiles = new Map<string, DialFile>([
      [testFiles[0].path, testFiles[0]],
    ]);

    const { result } = renderHook(() =>
      useBulkActions({
        selectedFiles,
        actionLabels: { [DialFileManagerActions.Download]: 'Download' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload,
        onRename: vi.fn(),
        onDelete: vi.fn(),
        getCurrentFolderPath: () => '/test',
        onClearSelection: vi.fn(),
      }),
    );

    const downloadAction = result.current[0];
    downloadAction.onClick?.({
      key: downloadAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onDownload).toHaveBeenCalledTimes(1);
    expect(onDownload).toHaveBeenCalledWith([testFiles[0]]);
  });

  test('delete action calls onDelete with selected files and current folder path', () => {
    const onDelete = vi.fn();
    const getCurrentFolderPath = vi.fn(() => '/test/folder');
    const selectedFiles = new Map<string, DialFile>([
      [testFiles[0].path, testFiles[0]],
      [testFiles[1].path, testFiles[1]],
    ]);

    const { result } = renderHook(() =>
      useBulkActions({
        selectedFiles,
        actionLabels: { [DialFileManagerActions.Delete]: 'Delete' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete,
        onClearSelection: vi.fn(),
        getCurrentFolderPath,
      }),
    );

    const deleteAction = result.current[0];
    deleteAction.onClick?.({ key: deleteAction.key, domEvent: mockMouseEvent });

    expect(getCurrentFolderPath).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(
      [testFiles[0], testFiles[1]],
      '/test/folder',
    );
  });

  test('actions have correct properties', () => {
    const selectedFiles = new Map<string, DialFile>([
      [testFiles[0].path, testFiles[0]],
    ]);

    const { result } = renderHook(() =>
      useBulkActions({
        selectedFiles,
        actionLabels: defaultActionLabels,
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        getCurrentFolderPath: () => '/test',
        onClearSelection: vi.fn(),
      }),
    );

    result.current.forEach((action) => {
      expect(action.key).toBeDefined();
      expect(action.label).toBeDefined();
      expect(action.title).toBeDefined();
      expect(action.icon).toBeDefined();
      expect(action.onClick).toBeInstanceOf(Function);
    });
  });

  test('memoizes actions correctly', () => {
    const selectedFiles = new Map<string, DialFile>([
      [testFiles[0].path, testFiles[0]],
    ]);

    const callbacks = {
      onDuplicate: vi.fn(),
      onCopy: vi.fn(),
      onMove: vi.fn(),
      onDownload: vi.fn(),
      onRename: vi.fn(),
      onDelete: vi.fn(),
      getCurrentFolderPath: () => '/test',
      onClearSelection: vi.fn(),
    };

    const { result, rerender } = renderHook(
      ({ selectedFiles }) =>
        useBulkActions({
          selectedFiles,
          actionLabels: defaultActionLabels,

          ...callbacks,
        }),
      { initialProps: { selectedFiles } },
    );

    const firstResult = result.current;

    rerender({ selectedFiles });

    expect(result.current).toBe(firstResult);
  });

  test('updates when selectedFiles change', () => {
    const selectedFiles1 = new Map<string, DialFile>([
      [testFiles[0].path, testFiles[0]],
    ]);
    const selectedFiles2 = new Map<string, DialFile>([
      [testFiles[0].path, testFiles[0]],
      [testFiles[1].path, testFiles[1]],
    ]);

    const onDuplicate = vi.fn();

    const { result, rerender } = renderHook(
      ({ selectedFiles }) =>
        useBulkActions({
          selectedFiles,
          actionLabels: { [DialFileManagerActions.Duplicate]: 'Duplicate' },
          onDuplicate,
          onCopy: vi.fn(),
          onMove: vi.fn(),
          onDownload: vi.fn(),
          onRename: vi.fn(),
          onUnshare: vi.fn(),
          onClearSelection: vi.fn(),
          onDelete: vi.fn(),
          getCurrentFolderPath: () => '/test',
        }),
      { initialProps: { selectedFiles: selectedFiles1 } },
    );

    result.current[0].onClick?.({
      key: result.current[0].key,
      domEvent: mockMouseEvent,
    });
    expect(onDuplicate).toHaveBeenCalledWith([testFiles[0]]);

    rerender({ selectedFiles: selectedFiles2 });

    result.current[0].onClick?.({
      key: result.current[0].key,
      domEvent: mockMouseEvent,
    });
    expect(onDuplicate).toHaveBeenLastCalledWith([testFiles[0], testFiles[1]]);
  });

  test('delete action is disabled when at least one file lacks WRITE permission', () => {
    const selectedFiles = new Map<string, DialFile>([
      [writableFile.path, writableFile],
      [readOnlyFile.path, readOnlyFile],
    ]);

    const { result } = renderHook(() =>
      useBulkActions({
        selectedFiles,
        actionLabels: { [DialFileManagerActions.Delete]: 'Delete' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        getCurrentFolderPath: () => '/test',
        onClearSelection: vi.fn(),
      }),
    );

    const deleteAction = result.current[0];

    expect(deleteAction.disabled).toBe(true);
  });

  test('delete action is enabled when all files have WRITE permission', () => {
    const selectedFiles = new Map<string, DialFile>([
      [writableFile.path, writableFile],
      [
        testFiles[1].path,
        { ...testFiles[1], permissions: [DialFilePermission.WRITE] },
      ],
    ]);

    const { result } = renderHook(() =>
      useBulkActions({
        selectedFiles,
        actionLabels: { [DialFileManagerActions.Delete]: 'Delete' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onUnshare: vi.fn(),
        onClearSelection: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        getCurrentFolderPath: () => '/test',
      }),
    );

    const deleteAction = result.current[0];

    expect(deleteAction.disabled).toBe(false);
  });

  test('delete action is enabled when files have no permissions defined', () => {
    const selectedFiles = new Map<string, DialFile>([
      [noPermissionsFile.path, noPermissionsFile],
    ]);

    const { result } = renderHook(() =>
      useBulkActions({
        selectedFiles,
        actionLabels: { [DialFileManagerActions.Delete]: 'Delete' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onClearSelection: vi.fn(),
        getCurrentFolderPath: () => '/test',
      }),
    );

    const deleteAction = result.current[0];

    expect(deleteAction.disabled).toBe(false);
  });

  test('unshare action calls onUnshare and onClearSelection with selected files', () => {
    const onUnshare = vi.fn();
    const onClearSelection = vi.fn();
    const selectedFiles = new Map<string, DialFile>([
      [testFiles[0].path, testFiles[0]],
    ]);

    const { result } = renderHook(() =>
      useBulkActions({
        selectedFiles,
        actionLabels: { [DialFileManagerActions.Unshare]: 'Unshare' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        getCurrentFolderPath: () => '/test',
        onUnshare,
        onClearSelection,
      }),
    );

    const unshareAction = result.current[0];
    unshareAction.onClick?.({
      key: unshareAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onUnshare).toHaveBeenCalledTimes(1);
    expect(onUnshare).toHaveBeenCalledWith([testFiles[0]]);
    expect(onClearSelection).toHaveBeenCalledTimes(1);
  });

  test('remove access action calls onRemoveAccess and onClearSelection with selected files', () => {
    const onRemoveAccess = vi.fn();
    const onClearSelection = vi.fn();
    const selectedFiles = new Map<string, DialFile>([
      [testFiles[0].path, testFiles[0]],
    ]);

    const { result } = renderHook(() =>
      useBulkActions({
        selectedFiles,
        actionLabels: {
          [DialFileManagerActions.RemoveAccess]: 'Remove access',
        },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onUnshare: vi.fn(),
        getCurrentFolderPath: () => '/test',
        onRemoveAccess,
        onClearSelection,
      }),
    );

    const removeAccessAction = result.current[0];
    removeAccessAction.onClick?.({
      key: removeAccessAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onRemoveAccess).toHaveBeenCalledTimes(1);
    expect(onRemoveAccess).toHaveBeenCalledWith([testFiles[0]]);
    expect(onClearSelection).toHaveBeenCalledTimes(1);
  });
});
