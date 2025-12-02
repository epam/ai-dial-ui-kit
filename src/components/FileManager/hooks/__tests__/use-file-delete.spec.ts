import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileDelete } from '@/components/FileManager/hooks/use-file-delete';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';

describe('Dial UI Kit :: FileManager :: useFileDelete', () => {
  it('initial state: deleteConfirmationOpen=false and itemsToDelete=[]', () => {
    const { result } = renderHook(() => useFileDelete({}));

    expect(result.current.deleteConfirmationOpen).toBe(false);
    expect(result.current.itemsToDelete).toEqual([]);
  });

  it('openDeleteConfirmation sets items and opens dialog', () => {
    const { result } = renderHook(() => useFileDelete({}));

    const files: DialFile[] = [
      {
        id: '1',
        name: 'file1.txt',
        path: '/folder/file1.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '2',
        name: 'file2.pdf',
        path: '/folder/file2.pdf',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];
    const parentFolderPath = '/folder';

    act(() => {
      result.current.openDeleteConfirmation(files, parentFolderPath);
    });

    expect(result.current.deleteConfirmationOpen).toBe(true);
    expect(result.current.itemsToDelete).toEqual(files);
  });

  it('closeDeleteConfirmation clears items and closes dialog', () => {
    const { result } = renderHook(() => useFileDelete({}));

    const files: DialFile[] = [
      {
        id: '1',
        name: 'test.txt',
        path: '/test.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.openDeleteConfirmation(files, '/');
    });

    expect(result.current.deleteConfirmationOpen).toBe(true);

    act(() => {
      result.current.closeDeleteConfirmation();
    });

    expect(result.current.deleteConfirmationOpen).toBe(false);
    expect(result.current.itemsToDelete).toEqual([]);
  });

  it('confirmDelete calls onDeleteFiles with items and current path, then closes', () => {
    const onDeleteFiles = vi.fn();
    const { result } = renderHook(() => useFileDelete({ onDeleteFiles }));

    const files: DialFile[] = [
      {
        id: '1',
        name: 'delete-me.txt',
        path: '/folder/delete-me.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];
    const parentFolderPath = '/folder';

    act(() => {
      result.current.openDeleteConfirmation(files, parentFolderPath);
    });

    act(() => {
      result.current.confirmDelete();
    });

    const deletedItems = files.map((file) => ({
      sourceUrl: file.path,
      nodeType: file.nodeType,
    }));

    expect(onDeleteFiles).toHaveBeenCalledTimes(1);
    expect(onDeleteFiles).toHaveBeenCalledWith(deletedItems, '/folder');
    expect(result.current.deleteConfirmationOpen).toBe(false);
    expect(result.current.itemsToDelete).toEqual([]);
  });

  it('confirmDelete calls onDeleteSuccess after successful deletion', () => {
    const onDeleteFiles = vi.fn();
    const onDeleteSuccess = vi.fn();
    const { result } = renderHook(() =>
      useFileDelete({ onDeleteFiles, onDeleteSuccess }),
    );

    const files: DialFile[] = [
      {
        id: '1',
        name: 'file.txt',
        path: '/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.openDeleteConfirmation(files, '/');
    });

    act(() => {
      result.current.confirmDelete();
    });

    expect(onDeleteFiles).toHaveBeenCalledTimes(1);
    expect(onDeleteSuccess).toHaveBeenCalledTimes(1);
    expect(onDeleteSuccess).toHaveBeenCalledWith();
  });

  it('confirmDelete does not call onDeleteSuccess if no items to delete', () => {
    const onDeleteFiles = vi.fn();
    const onDeleteSuccess = vi.fn();
    const { result } = renderHook(() =>
      useFileDelete({ onDeleteFiles, onDeleteSuccess }),
    );

    act(() => {
      result.current.confirmDelete();
    });

    expect(onDeleteFiles).not.toHaveBeenCalled();
    expect(onDeleteSuccess).not.toHaveBeenCalled();
  });

  it('confirmDelete does not call onDeleteFiles if no items to delete', () => {
    const onDeleteFiles = vi.fn();
    const { result } = renderHook(() => useFileDelete({ onDeleteFiles }));

    act(() => {
      result.current.confirmDelete();
    });

    expect(onDeleteFiles).not.toHaveBeenCalled();
    expect(result.current.deleteConfirmationOpen).toBe(false);
  });

  it('confirmDelete works without onDeleteFiles callback', () => {
    const { result } = renderHook(() => useFileDelete({}));

    const files: DialFile[] = [
      {
        id: '1',
        name: 'file.txt',
        path: '/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.openDeleteConfirmation(files, '/');
    });

    expect(() => {
      act(() => {
        result.current.confirmDelete();
      });
    }).not.toThrow();

    expect(result.current.deleteConfirmationOpen).toBe(false);
    expect(result.current.itemsToDelete).toEqual([]);
  });

  it('confirmDelete works without onDeleteSuccess callback', () => {
    const onDeleteFiles = vi.fn();
    const { result } = renderHook(() => useFileDelete({ onDeleteFiles }));

    const files: DialFile[] = [
      {
        id: '1',
        name: 'file.txt',
        path: '/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.openDeleteConfirmation(files, '/');
    });

    expect(() => {
      act(() => {
        result.current.confirmDelete();
      });
    }).not.toThrow();

    expect(onDeleteFiles).toHaveBeenCalledTimes(1);
    expect(result.current.deleteConfirmationOpen).toBe(false);
  });

  it('onDeleteSuccess is called after onDeleteFiles', () => {
    const callOrder: string[] = [];
    const onDeleteFiles = vi.fn(() => callOrder.push('onDeleteFiles'));
    const onDeleteSuccess = vi.fn(() => callOrder.push('onDeleteSuccess'));

    const { result } = renderHook(() =>
      useFileDelete({ onDeleteFiles, onDeleteSuccess }),
    );

    const files: DialFile[] = [
      {
        id: '1',
        name: 'file.txt',
        path: '/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.openDeleteConfirmation(files, '/');
    });

    act(() => {
      result.current.confirmDelete();
    });

    expect(callOrder).toEqual(['onDeleteFiles', 'onDeleteSuccess']);
  });

  it('handles deletion of multiple files including folders', () => {
    const onDeleteFiles = vi.fn();
    const { result } = renderHook(() => useFileDelete({ onDeleteFiles }));

    const files: DialFile[] = [
      {
        id: '1',
        name: 'folder1',
        path: '/root/folder1',
        nodeType: DialFileNodeType.FOLDER,
      } as DialFile,
      {
        id: '2',
        name: 'file1.txt',
        path: '/root/file1.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '3',
        name: 'file2.pdf',
        path: '/root/file2.pdf',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const parentFolderPath = '/root';

    act(() => {
      result.current.openDeleteConfirmation(files, parentFolderPath);
    });

    act(() => {
      result.current.confirmDelete();
    });

    const deletedItems = files.map((file) => ({
      sourceUrl: file.path,
      nodeType: file.nodeType,
    }));

    expect(onDeleteFiles).toHaveBeenCalledWith(deletedItems, '/root');
    expect(result.current.deleteConfirmationOpen).toBe(false);
  });

  it('sequential operations: open -> close -> open again', () => {
    const { result } = renderHook(() => useFileDelete({}));

    const files1: DialFile[] = [
      {
        id: '1',
        name: 'first.txt',
        path: '/first.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const files2: DialFile[] = [
      {
        id: '2',
        name: 'second.txt',
        path: '/second.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.openDeleteConfirmation(files1, '/');
    });

    expect(result.current.itemsToDelete).toEqual(files1);

    act(() => {
      result.current.closeDeleteConfirmation();
    });

    expect(result.current.itemsToDelete).toEqual([]);

    act(() => {
      result.current.openDeleteConfirmation(files2, '/');
    });

    expect(result.current.itemsToDelete).toEqual(files2);
    expect(result.current.deleteConfirmationOpen).toBe(true);
  });

  it('openDeleteConfirmation replaces previous items', () => {
    const { result } = renderHook(() => useFileDelete({}));

    const files1: DialFile[] = [
      {
        id: '1',
        name: 'old.txt',
        path: '/old.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const files2: DialFile[] = [
      {
        id: '2',
        name: 'new.txt',
        path: '/new.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '3',
        name: 'new2.txt',
        path: '/new2.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.openDeleteConfirmation(files1, '/');
    });

    expect(result.current.itemsToDelete).toEqual(files1);

    act(() => {
      result.current.openDeleteConfirmation(files2, '/');
    });

    expect(result.current.itemsToDelete).toEqual(files2);
    expect(result.current.deleteConfirmationOpen).toBe(true);
  });

  it('openDeleteConfirmation with empty array', () => {
    const onDeleteFiles = vi.fn();
    const { result } = renderHook(() => useFileDelete({ onDeleteFiles }));

    act(() => {
      result.current.openDeleteConfirmation([], '');
    });

    expect(result.current.deleteConfirmationOpen).toBe(true);
    expect(result.current.itemsToDelete).toEqual([]);

    act(() => {
      result.current.confirmDelete();
    });

    expect(onDeleteFiles).not.toHaveBeenCalled();
    expect(result.current.deleteConfirmationOpen).toBe(false);
  });
});
