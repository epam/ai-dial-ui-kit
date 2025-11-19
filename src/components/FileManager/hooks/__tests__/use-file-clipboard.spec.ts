import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileClipboard } from '@/components/FileManager/hooks/use-file-clipboard';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';

describe('Dial UI Kit :: FileManager :: useFileClipboard', () => {
  let destinationFiles: DialFile[] = [];
  let sourceFiles: DialFile[] = [];
  const getDestinationFiles = (path: string) => destinationFiles;
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
    expect(result.current.destinationFolderMode).toBe('copy');
  });

  it('handleOpenDestinationFolderPopup with copy mode', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestinationFiles, getSourceFiles }),
    );

    act(() => {
      result.current.handleOpenDestinationFolderPopup('copy');
    });

    expect(result.current.openDestinationFolderPopup).toBe(true);
    expect(result.current.destinationFolderMode).toBe('copy');
  });

  it('handleOpenDestinationFolderPopup with move mode', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestinationFiles, getSourceFiles }),
    );

    act(() => {
      result.current.handleOpenDestinationFolderPopup('move');
    });

    expect(result.current.openDestinationFolderPopup).toBe(true);
    expect(result.current.destinationFolderMode).toBe('move');
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
      result.current.handleOpenDestinationFolderPopup('copy');
    });

    expect(result.current.openDestinationFolderPopup).toBe(true);

    act(() => {
      result.current.handleCloseDestinationFolderPopup();
    });

    expect(result.current.openDestinationFolderPopup).toBe(false);
  });

  it('handleCopyTo calls onCopyFiles with resolved items', () => {
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
  });

  it('handleMoveTo calls onMoveToFiles with resolved items', () => {
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
      {
        id: '2',
        name: 'm2.txt',
        path: '/source/m2.txt',
        nodeType: DialFileNodeType.ITEM,
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

    expect(onMoveToFiles).toHaveBeenCalledTimes(1);
    expect(onMoveToFiles).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/source/m1',
          destinationUrl: '/dest/m1',
          overwrite: true,
          nodeType: DialFileNodeType.FOLDER,
        },
        {
          sourceUrl: '/source/m2.txt',
          destinationUrl: '/dest/m2.txt',
          overwrite: true,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/source',
      '/dest',
    );
  });

  it('handleCopyTo with name conflict -> adds (1) to filename', () => {
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

    expect(onCopyFiles).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/src/file.txt',
          destinationUrl: '/dest/file (1).txt',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/dest',
    );
  });

  it('handleCopyTo with multiple conflicts -> increments counter', () => {
    const onCopyFiles = vi.fn();
    destinationFiles = [
      {
        id: '1',
        name: 'doc.pdf',
        path: '/dest/doc.pdf',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '2',
        name: 'doc (1).pdf',
        path: '/dest/doc (1).pdf',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];
    const copiedFiles: DialFile[] = [
      {
        id: '3',
        name: 'doc.pdf',
        path: '/src/doc.pdf',
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

    expect(onCopyFiles).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/src/doc.pdf',
          destinationUrl: '/dest/doc (2).pdf',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/dest',
    );
  });

  it('handleCopyTo with multiple files with conflicts', () => {
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
    ];
    const copiedFiles: DialFile[] = [
      {
        id: '3',
        name: 'a.txt',
        path: '/src/a.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '4',
        name: 'b.txt',
        path: '/src/b.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '5',
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

    expect(onCopyFiles).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/src/a.txt',
          destinationUrl: '/dest/a (1).txt',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
        {
          sourceUrl: '/src/b.txt',
          destinationUrl: '/dest/b (1).txt',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
        {
          sourceUrl: '/src/c.txt',
          destinationUrl: '/dest/c.txt',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/dest',
    );
  });

  it('handleMoveTo with files without extension', () => {
    const onMoveToFiles = vi.fn();
    destinationFiles = [
      {
        id: '1',
        name: 'README',
        path: '/dest/README',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];
    const movedFiles: DialFile[] = [
      {
        id: '2',
        name: 'README',
        path: '/src/README',
        nodeType: DialFileNodeType.ITEM,
        parentPath: '/src',
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
      result.current.handleMoveTo('/dest', '/src');
    });

    expect(onMoveToFiles).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/src/README',
          destinationUrl: '/dest/README',
          overwrite: true,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/src',
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

  it('handleSetCopiedFiles and handleSetMovedFiles store files', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestinationFiles, getSourceFiles }),
    );

    const copiedFiles: DialFile[] = [
      {
        id: '1',
        name: 'a.txt',
        path: '/a.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];
    const movedFiles: DialFile[] = [
      {
        id: '2',
        name: 'b.txt',
        path: '/b.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.handleSetCopiedFiles(copiedFiles);
      result.current.handleSetMovedFiles(movedFiles);
    });

    expect(result.current).toBeDefined();
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
      result.current.handleOpenDestinationFolderPopup('copy');
      result.current.handleCloseDestinationFolderPopup();
    });

    act(() => {
      result.current.handleCopyTo('/dest');
    });

    expect(onCopyFiles).toHaveBeenCalledWith([], '/dest');
  });
});
