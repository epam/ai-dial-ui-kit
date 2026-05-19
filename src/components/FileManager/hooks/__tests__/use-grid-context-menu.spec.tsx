import { renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { useGridContextMenu } from '@/components/FileManager/hooks/use-grid-context-menu';
import { DialFileManagerActions } from '@/types/file-manager';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import type { MouseEvent } from 'react';
import { DialFilePermission } from '@/models/file';

const testFile: DialFile = {
  id: '1',
  folderId: 'folder1',
  path: '/test/file1.txt',
  name: 'file1.txt',
  parentPath: '/test',
  nodeType: DialFileNodeType.ITEM,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const testFolder: DialFile = {
  id: '2',
  folderId: 'folder2',
  path: '/test/folder',
  name: 'folder',
  parentPath: '/test',
  nodeType: DialFileNodeType.FOLDER,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const testFolderWithForbiddenSymbols: DialFile = {
  id: '3',
  folderId: 'folder3',
  path: '/test/folde),.?r',
  name: 'folde),.?r',
  parentPath: '/test',
  nodeType: DialFileNodeType.FOLDER,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const testFileWithForbiddenSymbols: DialFile = {
  id: '4',
  folderId: 'folder4',
  path: '/test/file$%<1.txt',
  name: 'file$%<1.txt',
  parentPath: '/test',
  nodeType: DialFileNodeType.ITEM,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const fileWithWritePermission: DialFile = {
  ...testFile,
  permissions: [DialFilePermission.WRITE],
};

const fileWithoutWritePermission: DialFile = {
  ...testFile,
  permissions: [],
};

const fileWithoutPermissions: DialFile = {
  ...testFile,
  permissions: undefined,
};

const defaultActionLabels = {
  [DialFileManagerActions.Duplicate]: 'Duplicate',
  [DialFileManagerActions.Copy]: 'Copy to',
  [DialFileManagerActions.Move]: 'Move to',
  [DialFileManagerActions.Rename]: 'Rename',
  [DialFileManagerActions.Download]: 'Download',
  [DialFileManagerActions.Delete]: 'Delete',
  [DialFileManagerActions.Info]: 'Info',
  [DialFileManagerActions.Unshare]: 'Unshare',
};

const mockMouseEvent = {} as MouseEvent<Element, globalThis.MouseEvent>;

describe('Dial UI Kit :: useGridContextMenu', () => {
  test('returns function that returns empty array when actionLabels is undefined', () => {
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: undefined,
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        sharedWithMeIds: [],
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFile);
    expect(menuItems).toEqual([]);
  });

  test('returns function that returns all actions when all labels provided for file', () => {
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: defaultActionLabels,
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        sharedWithMeIds: [testFile.path],
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFile);
    expect(menuItems).toHaveLength(8);
    expect(menuItems.map((item) => item.key)).toEqual([
      DialFileManagerActions.Duplicate,
      DialFileManagerActions.Copy,
      DialFileManagerActions.Move,
      DialFileManagerActions.Download,
      DialFileManagerActions.Delete,
      DialFileManagerActions.Rename,
      DialFileManagerActions.Info,
      DialFileManagerActions.Unshare,
    ]);
  });

  test('returns function that returns all actions except Info for folder', () => {
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: defaultActionLabels,
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        sharedWithMeIds: [testFolder.path],
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFolder);
    expect(menuItems).toHaveLength(7);
    expect(menuItems.map((item) => item.key)).toEqual([
      DialFileManagerActions.Duplicate,
      DialFileManagerActions.Copy,
      DialFileManagerActions.Move,
      DialFileManagerActions.Download,
      DialFileManagerActions.Delete,
      DialFileManagerActions.Rename,
      DialFileManagerActions.Unshare,
    ]);
  });

  test('returns function that returns only actions with provided labels', () => {
    const partialLabels = {
      [DialFileManagerActions.Copy]: 'Copy to',
      [DialFileManagerActions.Delete]: 'Delete',
      [DialFileManagerActions.Rename]: 'Rename',
    };

    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: partialLabels,
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        sharedWithMeIds: [],
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFile);
    expect(menuItems).toHaveLength(3);
    expect(menuItems.map((item) => item.key)).toEqual([
      DialFileManagerActions.Copy,
      DialFileManagerActions.Delete,
      DialFileManagerActions.Rename,
    ]);
  });

  test('duplicate action calls onDuplicate with file', () => {
    const onDuplicate = vi.fn();
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Duplicate]: 'Duplicate' },
        onDuplicate,
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFile);
    const duplicateAction = menuItems[0];
    duplicateAction.onClick?.({
      key: duplicateAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onDuplicate).toHaveBeenCalledTimes(1);
    expect(onDuplicate).toHaveBeenCalledWith(testFile);
  });

  test('copy action calls onCopy with file', () => {
    const onCopy = vi.fn();
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Copy]: 'Copy to' },
        onDuplicate: vi.fn(),
        onCopy,
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFile);
    const copyAction = menuItems[0];
    copyAction.onClick?.({
      key: copyAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(onCopy).toHaveBeenCalledWith(testFile);
  });

  test('move action calls onMove with file', () => {
    const onMove = vi.fn();
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Move]: 'Move to' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove,
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFile);
    const moveAction = menuItems[0];
    moveAction.onClick?.({
      key: moveAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onMove).toHaveBeenCalledTimes(1);
    expect(onMove).toHaveBeenCalledWith(testFile);
  });

  test('download action calls onDownload with file', () => {
    const onDownload = vi.fn();
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Download]: 'Download' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload,
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFile);
    const downloadAction = menuItems[0];
    downloadAction.onClick?.({
      key: downloadAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onDownload).toHaveBeenCalledTimes(1);
    expect(onDownload).toHaveBeenCalledWith(testFile);
  });

  test('rename action calls onRename with file path', () => {
    const onRename = vi.fn();
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Rename]: 'Rename' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename,
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFile);
    const renameAction = menuItems[0];
    renameAction.onClick?.({
      key: renameAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onRename).toHaveBeenCalledTimes(1);
    expect(onRename).toHaveBeenCalledWith(testFile.path);
  });

  test('delete action calls onDelete with file and parent path', () => {
    const onDelete = vi.fn();
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Delete]: 'Delete' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete,
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFile);
    const deleteAction = menuItems[0];
    deleteAction.onClick?.({
      key: deleteAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(testFile, '/test');
  });

  test('delete action uses empty string when parentPath is undefined', () => {
    const onDelete = vi.fn();
    const fileWithoutParent: DialFile = {
      ...testFile,
      parentPath: undefined,
    };

    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Delete]: 'Delete' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete,
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(fileWithoutParent);
    const deleteAction = menuItems[0];
    deleteAction.onClick?.({
      key: deleteAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onDelete).toHaveBeenCalledWith(fileWithoutParent, '');
  });

  test('info action calls onInfo with file', () => {
    const onInfo = vi.fn();
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Info]: 'Info' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo,
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFile);
    const infoAction = menuItems[0];
    infoAction.onClick?.({
      key: infoAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onInfo).toHaveBeenCalledTimes(1);
    expect(onInfo).toHaveBeenCalledWith(testFile);
  });

  test('info action is not shown for folders', () => {
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Info]: 'Info' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFolder);
    expect(menuItems).toHaveLength(0);
    expect(
      menuItems.find((item) => item.key === DialFileManagerActions.Info),
    ).toBeUndefined();
  });

  test('unshare action calls onUnshare with file', () => {
    const onUnshare = vi.fn();
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Unshare]: 'Unshare' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare,
        sharedWithMeIds: [testFile.path],
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFile);
    const unshareAction = menuItems[0];
    unshareAction.onClick?.({
      key: unshareAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onUnshare).toHaveBeenCalledTimes(1);
    expect(onUnshare).toHaveBeenCalledWith(testFile);
  });

  test('unshare action works with folders', () => {
    const onUnshare = vi.fn();
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Unshare]: 'Unshare' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare,
        sharedWithMeIds: [testFolder.path],
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFolder);
    const unshareAction = menuItems[0];
    unshareAction.onClick?.({
      key: unshareAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onUnshare).toHaveBeenCalledTimes(1);
    expect(onUnshare).toHaveBeenCalledWith(testFolder);
  });

  test('remove access action calls onRemoveAccess with file', () => {
    const onRemoveAccess = vi.fn();
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: {
          [DialFileManagerActions.RemoveAccess]: 'Remove access',
        },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onRemoveAccess,
        sharedByMePaths: new Set([testFile.path]),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFile);
    const removeAccessAction = menuItems[0];
    removeAccessAction.onClick?.({
      key: removeAccessAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onRemoveAccess).toHaveBeenCalledTimes(1);
    expect(onRemoveAccess).toHaveBeenCalledWith(testFile);
  });

  test('remove access action works with folders', () => {
    const onRemoveAccess = vi.fn();
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: {
          [DialFileManagerActions.RemoveAccess]: 'Remove access',
        },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onRemoveAccess,
        sharedByMePaths: new Set([testFolder.path]),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFolder);
    const removeAccessAction = menuItems[0];
    removeAccessAction.onClick?.({
      key: removeAccessAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onRemoveAccess).toHaveBeenCalledTimes(1);
    expect(onRemoveAccess).toHaveBeenCalledWith(testFolder);
  });

  test('menu items have correct properties', () => {
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: defaultActionLabels,
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        sharedWithMeIds: [testFile.path],
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFile);

    menuItems.forEach((item) => {
      expect(item.key).toBeDefined();
      expect(item.label).toBeDefined();
      expect(item.icon).toBeDefined();
      expect(item.onClick).toBeInstanceOf(Function);
    });
  });

  test('memoizes menu builder function correctly', () => {
    const callbacks = {
      onDuplicate: vi.fn(),
      onCopy: vi.fn(),
      onMove: vi.fn(),
      onDownload: vi.fn(),
      onRename: vi.fn(),
      onDelete: vi.fn(),
      onInfo: vi.fn(),
      onUnshare: vi.fn(),
      onGridCreateSiblingFolder: vi.fn(),
      onGridCreateChildFolder: vi.fn(),
    };

    const sharedWithMeIds: string[] = [];

    const { result, rerender } = renderHook(
      ({ actionLabels }) =>
        useGridContextMenu({
          actionLabels,
          ...callbacks,
          sharedWithMeIds,
        }),
      { initialProps: { actionLabels: defaultActionLabels } },
    );

    const firstResult = result.current;
    rerender({ actionLabels: defaultActionLabels });

    expect(result.current).toBe(firstResult);
  });

  test('works with folders', () => {
    const onMove = vi.fn();
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Move]: 'Move to' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove,
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFolder);
    const moveAction = menuItems[0];
    moveAction.onClick?.({
      key: moveAction.key,
      domEvent: mockMouseEvent,
    });

    expect(onMove).toHaveBeenCalledWith(testFolder);
  });

  test('returns different menu items for files and folders', () => {
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: defaultActionLabels,
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        sharedWithMeIds: [testFile.path, testFolder.path],
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const fileMenuItems = result.current(testFile);
    const folderMenuItems = result.current(testFolder);

    // File should have Info action
    expect(fileMenuItems).toHaveLength(8);
    expect(
      fileMenuItems.find((i) => i.key === DialFileManagerActions.Info),
    ).toBeDefined();

    // Folder should not have Info action
    expect(folderMenuItems).toHaveLength(7);
    expect(
      folderMenuItems.find((i) => i.key === DialFileManagerActions.Info),
    ).toBeUndefined();
  });

  test('updates when callbacks change', () => {
    const onDuplicate1 = vi.fn();
    const onDuplicate2 = vi.fn();

    const { result, rerender } = renderHook(
      ({ onDuplicate }) =>
        useGridContextMenu({
          actionLabels: { [DialFileManagerActions.Duplicate]: 'Duplicate' },
          onDuplicate,
          onCopy: vi.fn(),
          onMove: vi.fn(),
          onDownload: vi.fn(),
          onRename: vi.fn(),
          onDelete: vi.fn(),
          onInfo: vi.fn(),
          onUnshare: vi.fn(),
          onGridCreateSiblingFolder: vi.fn(),
          onGridCreateChildFolder: vi.fn(),
        }),
      { initialProps: { onDuplicate: onDuplicate1 } },
    );

    let menuItems = result.current(testFile);
    menuItems[0].onClick?.({
      key: menuItems[0].key,
      domEvent: mockMouseEvent,
    });
    expect(onDuplicate1).toHaveBeenCalledWith(testFile);

    rerender({ onDuplicate: onDuplicate2 });

    menuItems = result.current(testFile);
    menuItems[0].onClick?.({
      key: menuItems[0].key,
      domEvent: mockMouseEvent,
    });
    expect(onDuplicate2).toHaveBeenCalledWith(testFile);
  });

  test('returns stable function reference', () => {
    const callbacks = {
      onDuplicate: vi.fn(),
      onCopy: vi.fn(),
      onMove: vi.fn(),
      onDownload: vi.fn(),
      onRename: vi.fn(),
      onDelete: vi.fn(),
      onInfo: vi.fn(),
      onUnshare: vi.fn(),
      onGridCreateSiblingFolder: vi.fn(),
      onGridCreateChildFolder: vi.fn(),
    };

    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: defaultActionLabels,
        ...callbacks,
      }),
    );

    const menuBuilder = result.current;
    expect(typeof menuBuilder).toBe('function');

    const menuItems1 = menuBuilder(testFile);
    const menuItems2 = menuBuilder(testFile);

    expect(menuItems1).toHaveLength(menuItems2.length);
  });

  test('includes info and unshare in action labels list', () => {
    const partialLabels = {
      [DialFileManagerActions.Info]: 'Info',
      [DialFileManagerActions.Unshare]: 'Unshare',
    };

    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: partialLabels,
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        sharedWithMeIds: [testFile.path],
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(testFile);
    expect(menuItems).toHaveLength(2);
    expect(menuItems.map((item) => item.key)).toEqual([
      DialFileManagerActions.Info,
      DialFileManagerActions.Unshare,
    ]);
  });

  test('updates when onUnshare callback changes', () => {
    const onUnshare1 = vi.fn();
    const onUnshare2 = vi.fn();

    const { result, rerender } = renderHook(
      ({ onUnshare }) =>
        useGridContextMenu({
          actionLabels: { [DialFileManagerActions.Unshare]: 'Unshare' },
          onDuplicate: vi.fn(),
          onCopy: vi.fn(),
          onMove: vi.fn(),
          onDownload: vi.fn(),
          onRename: vi.fn(),
          onDelete: vi.fn(),
          onInfo: vi.fn(),
          onUnshare,
          sharedWithMeIds: [testFile.path],
          onGridCreateSiblingFolder: vi.fn(),
          onGridCreateChildFolder: vi.fn(),
        }),
      { initialProps: { onUnshare: onUnshare1 } },
    );

    let menuItems = result.current(testFile);
    menuItems[0].onClick?.({
      key: menuItems[0].key,
      domEvent: mockMouseEvent,
    });
    expect(onUnshare1).toHaveBeenCalledWith(testFile);

    rerender({ onUnshare: onUnshare2 });

    menuItems = result.current(testFile);
    menuItems[0].onClick?.({
      key: menuItems[0].key,
      domEvent: mockMouseEvent,
    });
    expect(onUnshare2).toHaveBeenCalledWith(testFile);
  });

  test('delete action is not shown when file lacks WRITE permission', () => {
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Delete]: 'Delete' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(fileWithoutWritePermission);

    expect(menuItems).toHaveLength(0);
    expect(
      menuItems.find((item) => item.key === DialFileManagerActions.Delete),
    ).toBeUndefined();
  });

  test('delete action is shown when file has WRITE permission', () => {
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Delete]: 'Delete' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(fileWithWritePermission);

    expect(menuItems).toHaveLength(1);
    expect(menuItems[0].key).toBe(DialFileManagerActions.Delete);
  });

  test('delete action is shown when file has no permissions defined', () => {
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Delete]: 'Delete' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(fileWithoutPermissions);

    expect(menuItems).toHaveLength(1);
    expect(menuItems[0].key).toBe(DialFileManagerActions.Delete);
  });

  test('rename action is not shown when file lacks WRITE permission', () => {
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Rename]: 'Rename' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(fileWithoutWritePermission);

    expect(menuItems).toHaveLength(0);
    expect(
      menuItems.find((item) => item.key === DialFileManagerActions.Rename),
    ).toBeUndefined();
  });

  test('rename action is shown when file has WRITE permission', () => {
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Rename]: 'Rename' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(fileWithWritePermission);

    expect(menuItems).toHaveLength(1);
    expect(menuItems[0].key).toBe(DialFileManagerActions.Rename);
  });

  test('rename action is shown when file has no permissions defined', () => {
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: { [DialFileManagerActions.Rename]: 'Rename' },
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const menuItems = result.current(fileWithoutPermissions);

    expect(menuItems).toHaveLength(1);
    expect(menuItems[0].key).toBe(DialFileManagerActions.Rename);
  });

  test('delete action is shown when file has no permissions defined', () => {
    const { result } = renderHook(() =>
      useGridContextMenu({
        actionLabels: defaultActionLabels,
        onDuplicate: vi.fn(),
        onCopy: vi.fn(),
        onMove: vi.fn(),
        onDownload: vi.fn(),
        onRename: vi.fn(),
        onDelete: vi.fn(),
        onInfo: vi.fn(),
        onUnshare: vi.fn(),
        forbiddenSymbolsRegExp: /[!@#%^&*(),.?":{}|<>]/gy,
        onGridCreateSiblingFolder: vi.fn(),
        onGridCreateChildFolder: vi.fn(),
      }),
    );

    const fileMenuItems = result.current(testFileWithForbiddenSymbols);

    expect(fileMenuItems).toHaveLength(2);
    expect(fileMenuItems.map((item) => item.key)).toEqual([
      DialFileManagerActions.Delete,
      DialFileManagerActions.Rename,
    ]);
    expect(fileMenuItems[0].key).toBe(DialFileManagerActions.Delete);
    expect(fileMenuItems[1].key).toBe(DialFileManagerActions.Rename);

    const folderMenuItems = result.current(testFolderWithForbiddenSymbols);

    expect(folderMenuItems).toHaveLength(2);
    expect(folderMenuItems[0].key).toBe(DialFileManagerActions.Delete);
    expect(folderMenuItems[1].key).toBe(DialFileManagerActions.Rename);
  });
});
