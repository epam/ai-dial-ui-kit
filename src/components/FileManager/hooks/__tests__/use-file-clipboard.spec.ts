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
    expect(result.current.sourceFolder).toBeUndefined();
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
          path: '/folder/file.txt',
          parentPath: '/folder',
          nodeType: DialFileNodeType.ITEM,
        } as DialFile,
      ]);
      result.current.handleOpenDestinationFolderPopup(
        DestinationFolderMode.Copy,
      );
    });

    expect(result.current.openDestinationFolderPopup).toBe(true);
    expect(result.current.sourceFolder).toBe('/folder');

    act(() => {
      result.current.handleCloseDestinationFolderPopup();
    });

    expect(result.current.openDestinationFolderPopup).toBe(false);
    expect(result.current.sourceFolder).toBeUndefined();
  });

  it('handleSetCopiedFiles sets sourceFolder from parentPath', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestinationFiles, getSourceFiles }),
    );

    const copiedFiles: DialFile[] = [
      {
        id: '1',
        name: 'a.txt',
        path: '/source/folder/a.txt',
        parentPath: '/source/folder',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '2',
        name: 'b.txt',
        path: '/source/folder/b.txt',
        parentPath: '/source/folder',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.handleSetCopiedFiles(copiedFiles);
    });

    expect(result.current.sourceFolder).toBe('/source/folder');
  });

  it('handleSetCopiedFiles falls back to folderId if parentPath is missing', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestinationFiles, getSourceFiles }),
    );

    const copiedFiles: DialFile[] = [
      {
        id: '1',
        name: 'a.txt',
        path: '/a.txt',
        folderId: '/root',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.handleSetCopiedFiles(copiedFiles);
    });

    expect(result.current.sourceFolder).toBe('/root');
  });

  it('handleSetMovedFiles sets sourceFolder from parentPath', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestinationFiles, getSourceFiles }),
    );

    const movedFiles: DialFile[] = [
      {
        id: '1',
        name: 'm1',
        path: '/source/m1',
        parentPath: '/source',
        nodeType: DialFileNodeType.FOLDER,
      } as DialFile,
    ];

    act(() => {
      result.current.handleSetMovedFiles(movedFiles);
    });

    expect(result.current.sourceFolder).toBe('/source');
  });

  it('handleCopyTo without conflicts calls onCopyFiles and onCopySuccess', () => {
    const onCopyFiles = vi.fn();
    const onCopySuccess = vi.fn();
    destinationFiles = [];
    const copiedFiles: DialFile[] = [
      {
        id: '1',
        name: 'a.txt',
        path: '/src/a.txt',
        parentPath: '/src',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '2',
        name: 'b.txt',
        path: '/src/b.txt',
        parentPath: '/src',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
        onCopySuccess,
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
    expect(onCopySuccess).toHaveBeenCalledTimes(1);
    expect(result.current.conflictResolutionOpen).toBe(false);
  });

  it('handleCopyTo with conflicts opens conflict resolution popup', () => {
    const onCopyFiles = vi.fn();
    const onCopySuccess = vi.fn();
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
        parentPath: '/src',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '3',
        name: 'b.txt',
        path: '/src/b.txt',
        parentPath: '/src',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
        onCopySuccess,
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
    expect(onCopySuccess).not.toHaveBeenCalled();
  });

  it('handleConflictReplace resolves with overwrite=true and calls onCopySuccess', () => {
    const onCopyFiles = vi.fn();
    const onCopySuccess = vi.fn();
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
        parentPath: '/src',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
        onCopySuccess,
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
    expect(onCopySuccess).toHaveBeenCalledTimes(1);
    expect(result.current.conflictResolutionOpen).toBe(false);
  });

  it('handleConflictDuplicate resolves with renamed files and calls onCopySuccess', () => {
    const onCopyFiles = vi.fn();
    const onCopySuccess = vi.fn();
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
        parentPath: '/src',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
        onCopySuccess,
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
    expect(onCopySuccess).toHaveBeenCalledTimes(1);
    expect(result.current.conflictResolutionOpen).toBe(false);
  });

  it('handleConflictDecideForEach with mixed decisions calls onCopySuccess', () => {
    const onCopyFiles = vi.fn();
    const onCopySuccess = vi.fn();
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
        parentPath: '/src',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '5',
        name: 'b.txt',
        path: '/src/b.txt',
        parentPath: '/src',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '6',
        name: 'c.txt',
        path: '/src/c.txt',
        parentPath: '/src',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
        onCopySuccess,
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
    expect(onCopySuccess).toHaveBeenCalledTimes(1);
    expect(result.current.conflictResolutionOpen).toBe(false);
  });

  it('handleMoveTo without conflicts calls onMoveToFiles and onMoveSuccess', () => {
    const onMoveToFiles = vi.fn();
    const onMoveSuccess = vi.fn();
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
        onMoveSuccess,
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
    expect(onMoveSuccess).toHaveBeenCalledTimes(1);
  });

  it('handleDuplicate duplicates files in the same folder and calls onDuplicateSuccess', () => {
    const onCopyFiles = vi.fn();
    const onDuplicateSuccess = vi.fn();
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
        onDuplicateSuccess,
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
    expect(onDuplicateSuccess).toHaveBeenCalledTimes(1);
  });

  it('clearState resets sourceFolder', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestinationFiles, getSourceFiles }),
    );

    act(() => {
      result.current.handleSetCopiedFiles([
        {
          id: '1',
          name: 'test.txt',
          path: '/folder/test.txt',
          parentPath: '/folder',
          nodeType: DialFileNodeType.ITEM,
        } as DialFile,
      ]);
    });

    expect(result.current.sourceFolder).toBe('/folder');

    act(() => {
      result.current.clearState();
    });

    expect(result.current.sourceFolder).toBeUndefined();
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
          parentPath: '/',
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

  it('sets destinationFolderTitle using getCopyHeader when copying files', () => {
    const getCopyHeader = vi.fn(
      (count: number, name?: string) =>
        `Copying ${count} file(s)${name ? `: ${name}` : ''}`,
    );
    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        getCopyHeader,
      }),
    );

    const files: DialFile[] = [
      {
        id: '1',
        name: 'document.txt',
        path: '/src/document.txt',
        parentPath: '/src',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '2',
        name: 'image.png',
        path: '/src/image.png',
        parentPath: '/src',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.handleSetCopiedFiles(files);
    });

    expect(getCopyHeader).toHaveBeenCalledWith(2, 'document.txt');
    expect(result.current.destinationFolderTitle).toBe(
      'Copying 2 file(s): document.txt',
    );
  });

  it('sets destinationFolderTitle using getMoveHeader when moving files', () => {
    const getMoveHeader = vi.fn(
      (count: number, name?: string) =>
        `Moving ${count} file(s)${name ? `: ${name}` : ''}`,
    );
    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        getMoveHeader,
      }),
    );

    const files: DialFile[] = [
      {
        id: '1',
        name: 'folder',
        path: '/src/folder',
        parentPath: '/src',
        nodeType: DialFileNodeType.FOLDER,
      } as DialFile,
    ];

    act(() => {
      result.current.handleSetMovedFiles(files);
    });

    expect(getMoveHeader).toHaveBeenCalledWith(1, 'folder');
    expect(result.current.destinationFolderTitle).toBe(
      'Moving 1 file(s): folder',
    );
  });

  it('does not set destinationFolderTitle when getCopyHeader is not provided', () => {
    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
      }),
    );

    const files: DialFile[] = [
      {
        id: '1',
        name: 'file.txt',
        path: '/file.txt',
        parentPath: '/',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.handleSetCopiedFiles(files);
    });

    expect(result.current.destinationFolderTitle).toBeUndefined();
  });

  it('does not set destinationFolderTitle when getMoveHeader is not provided', () => {
    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
      }),
    );

    const files: DialFile[] = [
      {
        id: '1',
        name: 'folder',
        path: '/folder',
        parentPath: '/',
        nodeType: DialFileNodeType.FOLDER,
      } as DialFile,
    ];

    act(() => {
      result.current.handleSetMovedFiles(files);
    });

    expect(result.current.destinationFolderTitle).toBeUndefined();
  });

  it('does not set destinationFolderTitle when files array is empty', () => {
    const getCopyHeader = vi.fn(() => 'Copy files');
    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        getCopyHeader,
      }),
    );

    act(() => {
      result.current.handleSetCopiedFiles([]);
    });

    expect(getCopyHeader).not.toHaveBeenCalled();
    expect(result.current.destinationFolderTitle).toBeUndefined();
  });

  it('clears destinationFolderTitle after clearState', () => {
    const getCopyHeader = vi.fn(() => 'Copy 1 file');
    const { result } = renderHook(() =>
      useFileClipboard({
        getDestinationFiles,
        getSourceFiles,
        getCopyHeader,
      }),
    );

    act(() => {
      result.current.handleSetCopiedFiles([
        {
          id: '1',
          name: 'file.txt',
          path: '/folder/file.txt',
          parentPath: '/folder',
          nodeType: DialFileNodeType.ITEM,
        } as DialFile,
      ]);
    });

    expect(result.current.destinationFolderTitle).toBe('Copy 1 file');

    act(() => {
      result.current.clearState();
    });

    act(() => {
      result.current.handleSetCopiedFiles([]);
    });

    expect(result.current.destinationFolderTitle).toBeUndefined();
  });
});
