import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileClipboard } from '@/components/FileManager/hooks/use-file-clipboard';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';

describe('Dial UI Kit :: FileManager :: useFileClipboard', () => {
  let destination = '/initial';
  let destinationFiles: DialFile[] = [];
  let sourceFiles: DialFile[] = [];
  const getDestination = () => destination;
  const getDestinationFiles = () => destinationFiles;
  const getSourceFiles = () => sourceFiles;

  beforeEach(() => {
    destination = '/initial';
    destinationFiles = [];
    sourceFiles = [];
  });

  it('initial state: empty clipboard and hasItems=false', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getDestinationFiles, getSourceFiles }),
    );

    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.cut.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('copy(files) fills copied, clears cut, sets hasItems=true', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getDestinationFiles, getSourceFiles }),
    );

    act(() => {
      result.current.copy(['/a.txt', '/b.png']);
    });

    expect([...result.current.state.copied]).toEqual(['/a.txt', '/b.png']);
    expect(result.current.state.cut.size).toBe(0);
    expect(result.current.state.hasItems).toBe(true);
  });

  it('cut(files) fills cut, clears copied, sets hasItems=true', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getDestinationFiles, getSourceFiles }),
    );

    act(() => {
      result.current.cut(['/draft.doc']);
    });

    expect([...result.current.state.cut]).toEqual(['/draft.doc']);
    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.hasItems).toBe(true);
  });

  it('clear() empties both sets and sets hasItems=false', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getDestinationFiles, getSourceFiles }),
    );

    act(() => {
      result.current.copy(['/x']);
      result.current.clear();
    });

    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.cut.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('paste with copied -> calls onCopyFiles with destinationFolder', () => {
    const onCopyFiles = vi.fn();
    const onMoveToFiles = vi.fn();
    destinationFiles = [];
    sourceFiles = [
      {
        id: '1',
        name: 'a',
        path: '/a',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '2',
        name: 'b',
        path: '/b',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
        onMoveToFiles,
      }),
    );

    act(() => {
      result.current.copy(['/a', '/b']);
    });

    act(() => {
      destination = '/target-folder';
      result.current.paste();
    });

    expect(onCopyFiles).toHaveBeenCalledTimes(1);
    expect(onCopyFiles).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/a',
          destinationUrl: '/target-folder/a',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
        {
          sourceUrl: '/b',
          destinationUrl: '/target-folder/b',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/target-folder',
    );
    expect(onMoveToFiles).not.toHaveBeenCalled();
    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('paste with cut -> calls onMoveToFiles with sourceFolder and destinationFolder', () => {
    const onCopyFiles = vi.fn();
    const onMoveToFiles = vi.fn();
    sourceFiles = [
      {
        id: '1',
        name: 'm1',
        path: '/source/m1',
        nodeType: DialFileNodeType.FOLDER,
        parentPath: '/source',
      } as DialFile,
      {
        id: '2',
        name: 'm2',
        path: '/source/m2',
        nodeType: DialFileNodeType.ITEM,
        parentPath: '/source',
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
        onMoveToFiles,
      }),
    );

    act(() => {
      result.current.cut(['/source/m1', '/source/m2']);
    });

    act(() => {
      destination = '/move-here';
      result.current.paste();
    });

    expect(onMoveToFiles).toHaveBeenCalledTimes(1);
    expect(onMoveToFiles).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/source/m1',
          destinationUrl: '/move-here/m1',
          overwrite: false,
          nodeType: DialFileNodeType.FOLDER,
        },
        {
          sourceUrl: '/source/m2',
          destinationUrl: '/move-here/m2',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/source',
      '/move-here',
    );
    expect(onCopyFiles).not.toHaveBeenCalled();
    expect(result.current.state.cut.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('paste with cut from different folders -> calls onMoveToFiles with empty sourceFolder', () => {
    const onMoveToFiles = vi.fn();
    sourceFiles = [
      {
        id: '1',
        name: 'file1',
        path: '/folder1/file1',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '2',
        name: 'file2',
        path: '/folder2/file2',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getDestinationFiles,
        getSourceFiles,
        onMoveToFiles,
      }),
    );

    act(() => {
      result.current.cut(['/folder1/file1', '/folder2/file2']);
    });

    act(() => {
      destination = '/target';
      result.current.paste();
    });

    expect(onMoveToFiles).toHaveBeenCalledWith(
      expect.any(Array),
      '',
      '/target',
    );
  });

  it('paste with empty clipboard -> no-op (no callbacks)', () => {
    const onCopyFiles = vi.fn();
    const onMoveToFiles = vi.fn();

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
        onMoveToFiles,
      }),
    );

    act(() => {
      result.current.paste();
    });

    expect(onCopyFiles).not.toHaveBeenCalled();
    expect(onMoveToFiles).not.toHaveBeenCalled();
    expect(result.current.state.hasItems).toBe(false);
  });

  it('copy([]) results in hasItems=false', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getDestinationFiles, getSourceFiles }),
    );

    act(() => {
      result.current.copy([]);
    });

    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('paste with name conflict -> adds (1) to filename', () => {
    const onCopyFiles = vi.fn();
    destinationFiles = [
      {
        id: '1',
        name: 'file.txt',
        path: '/dest/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];
    sourceFiles = [
      {
        id: '2',
        name: 'file.txt',
        path: '/src/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
      }),
    );

    act(() => {
      result.current.copy(['/src/file.txt']);
    });

    act(() => {
      destination = '/dest';
      result.current.paste();
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

  it('paste with multiple conflicts -> increments counter', () => {
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
    sourceFiles = [
      {
        id: '3',
        name: 'doc.pdf',
        path: '/src/doc.pdf',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
      }),
    );

    act(() => {
      result.current.copy(['/src/doc.pdf']);
    });

    act(() => {
      destination = '/dest';
      result.current.paste();
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

  it('paste multiple files with conflicts', () => {
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
    sourceFiles = [
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
        getDestination,
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
      }),
    );

    act(() => {
      result.current.copy(['/src/a.txt', '/src/b.txt', '/src/c.txt']);
    });

    act(() => {
      destination = '/dest';
      result.current.paste();
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

  it('handles files without extension', () => {
    const onMoveToFiles = vi.fn();
    destinationFiles = [
      {
        id: '1',
        name: 'README',
        path: '/dest/README',
        nodeType: DialFileNodeType.ITEM,
        parentPath: '/dest',
      } as DialFile,
    ];
    sourceFiles = [
      {
        id: '2',
        name: 'README',
        path: '/src/README',
        parentPath: '/src',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getDestinationFiles,
        getSourceFiles,
        onMoveToFiles,
      }),
    );

    act(() => {
      result.current.cut(['/src/README']);
    });

    act(() => {
      destination = '/dest';
      result.current.paste();
    });

    expect(onMoveToFiles).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/src/README',
          destinationUrl: '/dest/README (1)',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/src',
      '/dest',
    );
  });

  it('uses latest value from getDestination at paste time', () => {
    const onCopyFiles = vi.fn();
    sourceFiles = [
      {
        id: '1',
        name: 'late.txt',
        path: '/late.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
      }),
    );

    act(() => {
      result.current.copy(['/late.txt']);
    });

    act(() => {
      destination = '/A';
      destination = '/B';
      result.current.paste();
    });

    expect(onCopyFiles).toHaveBeenCalledTimes(1);
    expect(onCopyFiles).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/late.txt',
          destinationUrl: '/B/late.txt',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/B',
    );
  });

  it('sequential operations: cut after copy replaces clipboard correctly', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getDestinationFiles, getSourceFiles }),
    );

    act(() => {
      result.current.copy(['/a', '/b']);
      result.current.cut(['/c']);
    });

    expect(result.current.state.copied.size).toBe(0);
    expect([...result.current.state.cut]).toEqual(['/c']);
    expect(result.current.state.hasItems).toBe(true);
  });

  it('paste with overwrite=true -> sets overwrite flag and keeps original names', () => {
    const onCopyFiles = vi.fn();
    destinationFiles = [
      {
        id: '1',
        name: 'file.txt',
        path: '/dest/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];
    sourceFiles = [
      {
        id: '2',
        name: 'file.txt',
        path: '/src/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
      }),
    );

    act(() => {
      result.current.copy(['/src/file.txt']);
    });

    act(() => {
      destination = '/dest';
      result.current.paste(true);
    });

    expect(onCopyFiles).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/src/file.txt',
          destinationUrl: '/dest/file.txt',
          overwrite: true,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/dest',
    );
  });

  it('paste with overwrite=false -> resolves name conflicts', () => {
    const onCopyFiles = vi.fn();
    destinationFiles = [
      {
        id: '1',
        name: 'file.txt',
        path: '/dest/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];
    sourceFiles = [
      {
        id: '2',
        name: 'file.txt',
        path: '/src/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
      }),
    );

    act(() => {
      result.current.copy(['/src/file.txt']);
    });

    act(() => {
      destination = '/dest';
      result.current.paste(false);
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

  it('handles missing source file -> defaults to ITEM nodeType', () => {
    const onCopyFiles = vi.fn();
    sourceFiles = [];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getDestinationFiles,
        getSourceFiles,
        onCopyFiles,
      }),
    );

    act(() => {
      result.current.copy(['/missing/file.txt']);
    });

    act(() => {
      destination = '/dest';
      result.current.paste();
    });

    expect(onCopyFiles).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/missing/file.txt',
          destinationUrl: '/dest/file.txt',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/dest',
    );
  });
});
