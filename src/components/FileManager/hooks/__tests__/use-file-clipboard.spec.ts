import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileClipboard } from '@/components/FileManager/hooks/use-file-clipboard';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import {
  DestinationFolderMode,
  DialFileManagerConflictActions,
} from '@/types/file-manager';

describe('Dial UI Kit :: FileManager :: useFileClipboard', () => {
  let destinationFiles: DialFile[] = [];
  let sourceFiles: DialFile[] = [];
  const getDestinationFiles = () => destinationFiles;
  const getSourceFiles = () => sourceFiles;

  beforeEach(() => {
    destinationFiles = [];
    sourceFiles = [];
  });

  it('initial state: popup closed, no mode set', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestinationFiles, getSourceFiles }),
    );

    expect(result.current.openDestinationFolderPopup).toBe(false);
    expect(result.current.destinationFolderMode).toBe(
      DestinationFolderMode.Copy,
    );
    expect(result.current.conflictResolutionOpen).toBe(false);
    expect(result.current.conflictingFiles).toEqual([]);
  });

  it('handleOpenDestinationFolderPopup with copy mode', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestinationFiles, getSourceFiles }),
    );

    act(() => {
      result.current.handleOpenDestinationFolderPopup(
        DestinationFolderMode.Copy,
      );
    });

    expect(result.current.openDestinationFolderPopup).toBe(true);
    expect(result.current.destinationFolderMode).toBe('copy');
  });

  it('handleOpenDestinationFolderPopup with move mode', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestinationFiles, getSourceFiles }),
    );

    act(() => {
      result.current.handleOpenDestinationFolderPopup(
        DestinationFolderMode.Move,
      );
    });

    expect(result.current.openDestinationFolderPopup).toBe(true);
    expect(result.current.destinationFolderMode).toBe(
      DestinationFolderMode.Move,
    );
  });

  it('handleCloseDestinationFolderPopup closes popup and clears state', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestinationFiles, getSourceFiles }),
    );

    act(() => {
      result.current.handleSetCopiedFiles([
        {
          id: '1',
          name: 'file.txt',
          path: '/file.txt',
          nodeType: DialFileNodeType.ITEM,
        } as DialFile,
      ]);
      result.current.handleOpenDestinationFolderPopup(
        DestinationFolderMode.Copy,
      );
    });

    expect(result.current.openDestinationFolderPopup).toBe(true);

    act(() => {
      result.current.handleCloseDestinationFolderPopup();
    });

    expect(result.current.openDestinationFolderPopup).toBe(false);
  });

  it('handleCopyTo without conflicts calls onCopyFiles directly', () => {
    const onCopyFiles = vi.fn();
    destinationFiles = [];
    const copiedFiles: DialFile[] = [
      {
        id: '1',
        name: 'a.txt',
        path: '/src/a.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '2',
        name: 'b.txt',
        path: '/src/b.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
      }),
    );

    act(() => {
      result.current.handleSetCopiedFiles(copiedFiles);
    });

    act(() => {
      result.current.handleCopyTo('/dest');
    });

    expect(onCopyFiles).toHaveBeenCalledTimes(1);
    expect(onCopyFiles).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/src/a.txt',
          destinationUrl: '/dest/a.txt',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
        {
          sourceUrl: '/src/b.txt',
          destinationUrl: '/dest/b.txt',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/dest',
    );
    expect(result.current.conflictResolutionOpen).toBe(false);
  });

  it('handleCopyTo with conflicts opens conflict resolution popup', () => {
    const onCopyFiles = vi.fn();
    destinationFiles = [
      {
        id: '1',
        name: 'a.txt',
        path: '/dest/a.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];
    const copiedFiles: DialFile[] = [
      {
        id: '2',
        name: 'a.txt',
        path: '/src/a.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '3',
        name: 'b.txt',
        path: '/src/b.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
      }),
    );

    act(() => {
      result.current.handleSetCopiedFiles(copiedFiles);
    });

    act(() => {
      result.current.handleCopyTo('/dest');
    });

    expect(result.current.conflictResolutionOpen).toBe(true);
    expect(result.current.conflictingFiles).toHaveLength(1);
    expect(result.current.conflictingFiles[0].name).toBe('a.txt');
    expect(onCopyFiles).not.toHaveBeenCalled();
  });

  it('handleConflictReplace resolves with overwrite=true', () => {
    const onCopyFiles = vi.fn();
    destinationFiles = [
      {
        id: '1',
        name: 'file.txt',
        path: '/dest/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];
    const copiedFiles: DialFile[] = [
      {
        id: '2',
        name: 'file.txt',
        path: '/src/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
      }),
    );

    act(() => {
      result.current.handleSetCopiedFiles(copiedFiles);
    });

    act(() => {
      result.current.handleCopyTo('/dest');
    });

    expect(result.current.conflictResolutionOpen).toBe(true);

    act(() => {
      result.current.handleConflictReplace();
    });

    expect(onCopyFiles).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          sourceUrl: '/src/file.txt',
          destinationUrl: '/dest/file.txt',
          overwrite: true,
          nodeType: DialFileNodeType.ITEM,
        }),
      ],
      '/dest',
    );
    expect(result.current.conflictResolutionOpen).toBe(false);
  });

  it('handleConflictDuplicate resolves with renamed files', () => {
    const onCopyFiles = vi.fn();
    destinationFiles = [
      {
        id: '1',
        name: 'file.txt',
        path: '/dest/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];
    const copiedFiles: DialFile[] = [
      {
        id: '2',
        name: 'file.txt',
        path: '/src/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
      }),
    );

    act(() => {
      result.current.handleSetCopiedFiles(copiedFiles);
    });

    act(() => {
      result.current.handleCopyTo('/dest');
    });

    expect(result.current.conflictResolutionOpen).toBe(true);

    act(() => {
      result.current.handleConflictDuplicate();
    });

    expect(onCopyFiles).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          sourceUrl: '/src/file.txt',
          destinationUrl: '/dest/file (1).txt',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        }),
      ],
      '/dest',
    );
    expect(result.current.conflictResolutionOpen).toBe(false);
  });

  it('handleConflictDecideForEach with mixed decisions', () => {
    const onCopyFiles = vi.fn();
    destinationFiles = [
      {
        id: '1',
        name: 'a.txt',
        path: '/dest/a.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '2',
        name: 'b.txt',
        path: '/dest/b.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '3',
        name: 'c.txt',
        path: '/dest/c.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];
    const copiedFiles: DialFile[] = [
      {
        id: '4',
        name: 'a.txt',
        path: '/src/a.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '5',
        name: 'b.txt',
        path: '/src/b.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '6',
        name: 'c.txt',
        path: '/src/c.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
      }),
    );

    act(() => {
      result.current.handleSetCopiedFiles(copiedFiles);
    });

    act(() => {
      result.current.handleCopyTo('/dest');
    });

    act(() => {
      result.current.handleConflictDecideForEach([
        {
          file: copiedFiles[0],
          action: DialFileManagerConflictActions.Replace,
        },
        {
          file: copiedFiles[1],
          action: DialFileManagerConflictActions.Duplicate,
        },
        { file: copiedFiles[2], action: DialFileManagerConflictActions.Cancel },
      ]);
    });

    expect(onCopyFiles).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          sourceUrl: '/src/a.txt',
          destinationUrl: '/dest/a.txt',
          overwrite: true,
          nodeType: DialFileNodeType.ITEM,
        }),
        expect.objectContaining({
          sourceUrl: '/src/b.txt',
          destinationUrl: '/dest/b (1).txt',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        }),
      ],
      '/dest',
    );
    expect(result.current.conflictResolutionOpen).toBe(false);
  });

  it('handleMoveTo without conflicts calls onMoveToFiles directly', () => {
    const onMoveToFiles = vi.fn();
    destinationFiles = [];
    const movedFiles: DialFile[] = [
      {
        id: '1',
        name: 'm1',
        path: '/source/m1',
        nodeType: DialFileNodeType.FOLDER,
        parentPath: '/source',
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        onMoveToFiles,
      }),
    );

    act(() => {
      result.current.handleSetMovedFiles(movedFiles);
    });

    act(() => {
      result.current.handleMoveTo('/dest', '/source');
    });

    expect(onMoveToFiles).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/source/m1',
          destinationUrl: '/dest/m1',
          overwrite: false,
          nodeType: DialFileNodeType.FOLDER,
        },
      ],
      '/source',
      '/dest',
    );
  });

  it('handleDuplicate duplicates files in the same folder', () => {
    const onCopyFiles = vi.fn();
    destinationFiles = [
      {
        id: '1',
        name: 'file.txt',
        path: '/folder/file.txt',
        nodeType: DialFileNodeType.ITEM,
        parentPath: '/folder',
      } as DialFile,
    ];
    const filesToDuplicate: DialFile[] = [
      {
        id: '1',
        name: 'file.txt',
        path: '/folder/file.txt',
        nodeType: DialFileNodeType.ITEM,
        parentPath: '/folder',
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
      }),
    );

    act(() => {
      result.current.handleDuplicate(filesToDuplicate);
    });

    expect(onCopyFiles).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/folder/file.txt',
          destinationUrl: '/folder/file (1).txt',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/folder',
    );
  });

  it('clearState is called after handleCloseDestinationFolderPopup', () => {
    const onCopyFiles = vi.fn();
    const { result } = renderHook(() =>
      useFileClipboard({ getDestinationFiles, getSourceFiles, onCopyFiles }),
    );

    act(() => {
      result.current.handleSetCopiedFiles([
        {
          id: '1',
          name: 'test.txt',
          path: '/test.txt',
          nodeType: DialFileNodeType.ITEM,
        } as DialFile,
      ]);
      result.current.handleOpenDestinationFolderPopup(
        DestinationFolderMode.Copy,
      );
      result.current.handleCloseDestinationFolderPopup();
    });

    act(() => {
      result.current.handleCopyTo('/dest');
    });

    expect(onCopyFiles).toHaveBeenCalledWith([], '/dest');
  });
});
