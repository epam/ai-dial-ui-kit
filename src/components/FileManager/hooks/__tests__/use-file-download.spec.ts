import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileDownload } from '@/components/FileManager/hooks/use-file-download';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';

describe('Dial UI Kit :: FileManager :: useFileDownload', () => {
  const mockFile1: DialFile = {
    id: '1',
    name: 'document.pdf',
    path: '/documents/document.pdf',
    parentPath: '/documents',
    folderId: '/documents',
    nodeType: DialFileNodeType.ITEM,
  };

  const mockFile2: DialFile = {
    id: '2',
    name: 'image.png',
    path: '/images/image.png',
    folderId: '/images',
    parentPath: '/images',
    nodeType: DialFileNodeType.ITEM,
  };

  const mockFolder: DialFile = {
    id: '3',
    name: 'projects',
    path: '/work/projects',
    parentPath: '/work',
    folderId: '/work/projects',
    nodeType: DialFileNodeType.FOLDER,
  };

  it('returns handleDownloadFiles function', () => {
    const { result } = renderHook(() => useFileDownload({}));

    expect(result.current.handleDownloadFiles).toBeDefined();
    expect(typeof result.current.handleDownloadFiles).toBe('function');
  });

  it('calls onDownloadFiles and onDownloadSuccess with provided items', () => {
    const onDownloadFiles = vi.fn();
    const onDownloadSuccess = vi.fn();
    const { result } = renderHook(() =>
      useFileDownload({ onDownloadFiles, onDownloadSuccess }),
    );

    const files = [mockFile1, mockFile2];

    act(() => {
      result.current.handleDownloadFiles(files);
    });

    expect(onDownloadFiles).toHaveBeenCalledTimes(1);
    expect(onDownloadFiles).toHaveBeenCalledWith(files);
    expect(onDownloadSuccess).toHaveBeenCalledTimes(1);
  });

  it('does not call onDownloadFiles or onDownloadSuccess when items array is empty', () => {
    const onDownloadFiles = vi.fn();
    const onDownloadSuccess = vi.fn();
    const { result } = renderHook(() =>
      useFileDownload({ onDownloadFiles, onDownloadSuccess }),
    );

    act(() => {
      result.current.handleDownloadFiles([]);
    });

    expect(onDownloadFiles).not.toHaveBeenCalled();
    expect(onDownloadSuccess).not.toHaveBeenCalled();
  });

  it('does not throw when onDownloadFiles is not provided', () => {
    const { result } = renderHook(() => useFileDownload({}));

    expect(() => {
      act(() => {
        result.current.handleDownloadFiles([mockFile1]);
      });
    }).not.toThrow();
  });

  it('handles downloading a single file and calls onDownloadSuccess', () => {
    const onDownloadFiles = vi.fn();
    const onDownloadSuccess = vi.fn();
    const { result } = renderHook(() =>
      useFileDownload({ onDownloadFiles, onDownloadSuccess }),
    );

    act(() => {
      result.current.handleDownloadFiles([mockFile1]);
    });

    expect(onDownloadFiles).toHaveBeenCalledTimes(1);
    expect(onDownloadFiles).toHaveBeenCalledWith([mockFile1]);
    expect(onDownloadSuccess).toHaveBeenCalledTimes(1);
  });

  it('handles downloading multiple files and calls onDownloadSuccess', () => {
    const onDownloadFiles = vi.fn();
    const onDownloadSuccess = vi.fn();
    const { result } = renderHook(() =>
      useFileDownload({ onDownloadFiles, onDownloadSuccess }),
    );

    const files = [mockFile1, mockFile2];

    act(() => {
      result.current.handleDownloadFiles(files);
    });

    expect(onDownloadFiles).toHaveBeenCalledTimes(1);
    expect(onDownloadFiles).toHaveBeenCalledWith(files);
    expect(onDownloadSuccess).toHaveBeenCalledTimes(1);
  });

  it('handles downloading a folder and calls onDownloadSuccess', () => {
    const onDownloadFiles = vi.fn();
    const onDownloadSuccess = vi.fn();
    const { result } = renderHook(() =>
      useFileDownload({ onDownloadFiles, onDownloadSuccess }),
    );

    act(() => {
      result.current.handleDownloadFiles([mockFolder]);
    });

    expect(onDownloadFiles).toHaveBeenCalledTimes(1);
    expect(onDownloadFiles).toHaveBeenCalledWith([mockFolder]);
    expect(onDownloadSuccess).toHaveBeenCalledTimes(1);
  });

  it('handles downloading mixed files and folders and calls onDownloadSuccess', () => {
    const onDownloadFiles = vi.fn();
    const onDownloadSuccess = vi.fn();
    const { result } = renderHook(() =>
      useFileDownload({ onDownloadFiles, onDownloadSuccess }),
    );

    const items = [mockFile1, mockFolder, mockFile2];

    act(() => {
      result.current.handleDownloadFiles(items);
    });

    expect(onDownloadFiles).toHaveBeenCalledTimes(1);
    expect(onDownloadFiles).toHaveBeenCalledWith(items);
    expect(onDownloadSuccess).toHaveBeenCalledTimes(1);
  });

  it('updates callback when onDownloadFiles changes', () => {
    const onDownloadFiles1 = vi.fn();
    const onDownloadFiles2 = vi.fn();
    const onDownloadSuccess = vi.fn();

    const { result, rerender } = renderHook(
      ({ callback }) =>
        useFileDownload({ onDownloadFiles: callback, onDownloadSuccess }),
      { initialProps: { callback: onDownloadFiles1 } },
    );

    act(() => {
      result.current.handleDownloadFiles([mockFile1]);
    });

    expect(onDownloadFiles1).toHaveBeenCalledTimes(1);
    expect(onDownloadFiles2).not.toHaveBeenCalled();
    expect(onDownloadSuccess).toHaveBeenCalledTimes(1);

    rerender({ callback: onDownloadFiles2 });

    act(() => {
      result.current.handleDownloadFiles([mockFile1]);
    });

    expect(onDownloadFiles1).toHaveBeenCalledTimes(1);
    expect(onDownloadFiles2).toHaveBeenCalledTimes(1);
    expect(onDownloadSuccess).toHaveBeenCalledTimes(2);
  });

  it('sequential downloads call callback and onDownloadSuccess each time', () => {
    const onDownloadFiles = vi.fn();
    const onDownloadSuccess = vi.fn();
    const { result } = renderHook(() =>
      useFileDownload({ onDownloadFiles, onDownloadSuccess }),
    );

    act(() => {
      result.current.handleDownloadFiles([mockFile1]);
    });

    expect(onDownloadFiles).toHaveBeenCalledTimes(1);
    expect(onDownloadSuccess).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.handleDownloadFiles([mockFile2]);
    });

    expect(onDownloadFiles).toHaveBeenCalledTimes(2);
    expect(onDownloadSuccess).toHaveBeenCalledTimes(2);
    expect(onDownloadFiles).toHaveBeenNthCalledWith(1, [mockFile1]);
    expect(onDownloadFiles).toHaveBeenNthCalledWith(2, [mockFile2]);
  });
});
