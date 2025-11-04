import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileClipboard } from './use-file-clipboard';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';

describe('Dial UI Kit :: FileManager :: useFileClipboard', () => {
  let destination = '/initial';
  let allFiles: DialFile[] = [];

  const getDestination = () => destination;
  const getAllFiles = () => allFiles;

  beforeEach(() => {
    destination = '/initial';
    allFiles = [];
  });

  it('initial state: empty clipboard and hasItems=false', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getAllFiles }),
    );

    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.cut.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('copy(files) fills copied, clears cut, sets hasItems=true', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getAllFiles }),
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
      useFileClipboard({ getDestination, getAllFiles }),
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
      useFileClipboard({ getDestination, getAllFiles }),
    );

    act(() => {
      result.current.copy(['/x']);
      result.current.clear();
    });

    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.cut.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('paste with copied files -> calls onCopyFiles with resolved items and clears copied', () => {
    const onCopyFiles = vi.fn();
    const onMoveToFiles = vi.fn();

    allFiles = [
      {
        id: 'dest-folder',
        name: 'target-folder',
        path: '/target-folder',
        nodeType: DialFileNodeType.FOLDER,
        items: [],
      } as DialFile,
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
        getDestination,
        getAllFiles,
        onCopyFiles,
        onMoveToFiles,
      }),
    );

    act(() => {
      result.current.copy(['/src/a.txt', '/src/b.txt']);
    });

    act(() => {
      destination = '/target-folder';
      result.current.paste();
    });

    expect(onCopyFiles).toHaveBeenCalledTimes(1);
    expect(onCopyFiles).toHaveBeenCalledWith([
      { sourceUrl: '/src/a.txt', destinationUrl: '/target-folder/a.txt' },
      { sourceUrl: '/src/b.txt', destinationUrl: '/target-folder/b.txt' },
    ]);
    expect(onMoveToFiles).not.toHaveBeenCalled();
    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('paste with cut files -> calls onMoveToFiles with resolved items and clears cut', () => {
    const onCopyFiles = vi.fn();
    const onMoveToFiles = vi.fn();

    allFiles = [
      {
        id: 'dest-folder',
        name: 'move-here',
        path: '/move-here',
        nodeType: DialFileNodeType.FOLDER,
        items: [],
      } as DialFile,
      {
        id: '1',
        name: 'm1.txt',
        path: '/src/m1.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '2',
        name: 'm2.txt',
        path: '/src/m2.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getAllFiles,
        onCopyFiles,
        onMoveToFiles,
      }),
    );

    act(() => {
      result.current.cut(['/src/m1.txt', '/src/m2.txt']);
    });

    act(() => {
      destination = '/move-here';
      result.current.paste();
    });

    expect(onMoveToFiles).toHaveBeenCalledTimes(1);
    expect(onMoveToFiles).toHaveBeenCalledWith([
      { sourceUrl: '/src/m1.txt', destinationUrl: '/move-here/m1.txt' },
      { sourceUrl: '/src/m2.txt', destinationUrl: '/move-here/m2.txt' },
    ]);
    expect(onCopyFiles).not.toHaveBeenCalled();
    expect(result.current.state.cut.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('paste with empty clipboard -> no-op (no callbacks)', () => {
    const onCopyFiles = vi.fn();
    const onMoveToFiles = vi.fn();

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getAllFiles,
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
      useFileClipboard({ getDestination, getAllFiles }),
    );

    act(() => {
      result.current.copy([]);
    });

    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('paste with name conflict -> adds (1) to filename', () => {
    const onCopyFiles = vi.fn();

    allFiles = [
      {
        id: 'dest-folder',
        name: 'dest',
        path: '/dest',
        nodeType: DialFileNodeType.FOLDER,
        items: [
          {
            id: '2',
            name: 'file.txt',
            path: '/dest/file.txt',
            nodeType: DialFileNodeType.ITEM,
          } as DialFile,
        ],
      } as DialFile,
      {
        id: '1',
        name: 'file.txt',
        path: '/src/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getAllFiles, onCopyFiles }),
    );

    act(() => {
      result.current.copy(['/src/file.txt']);
    });

    act(() => {
      destination = '/dest';
      result.current.paste();
    });

    expect(onCopyFiles).toHaveBeenCalledWith([
      { sourceUrl: '/src/file.txt', destinationUrl: '/dest/file (1).txt' },
    ]);
  });

  it('paste with multiple conflicts -> increments counter', () => {
    const onCopyFiles = vi.fn();

    allFiles = [
      {
        id: 'dest-folder',
        name: 'dest',
        path: '/dest',
        nodeType: DialFileNodeType.FOLDER,
        items: [
          {
            id: '2',
            name: 'doc.pdf',
            path: '/dest/doc.pdf',
            nodeType: DialFileNodeType.ITEM,
          } as DialFile,
          {
            id: '3',
            name: 'doc (1).pdf',
            path: '/dest/doc (1).pdf',
            nodeType: DialFileNodeType.ITEM,
          } as DialFile,
        ],
      } as DialFile,
      {
        id: '1',
        name: 'doc.pdf',
        path: '/src/doc.pdf',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getAllFiles, onCopyFiles }),
    );

    act(() => {
      result.current.copy(['/src/doc.pdf']);
    });

    act(() => {
      destination = '/dest';
      result.current.paste();
    });

    expect(onCopyFiles).toHaveBeenCalledWith([
      { sourceUrl: '/src/doc.pdf', destinationUrl: '/dest/doc (2).pdf' },
    ]);
  });

  it('paste multiple files with conflicts', () => {
    const onCopyFiles = vi.fn();

    allFiles = [
      {
        id: 'dest-folder',
        name: 'dest',
        path: '/dest',
        nodeType: DialFileNodeType.FOLDER,
        items: [
          {
            id: '4',
            name: 'a.txt',
            path: '/dest/a.txt',
            nodeType: DialFileNodeType.ITEM,
          } as DialFile,
          {
            id: '5',
            name: 'b.txt',
            path: '/dest/b.txt',
            nodeType: DialFileNodeType.ITEM,
          } as DialFile,
        ],
      } as DialFile,
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
      {
        id: '3',
        name: 'c.txt',
        path: '/src/c.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getAllFiles, onCopyFiles }),
    );

    act(() => {
      result.current.copy(['/src/a.txt', '/src/b.txt', '/src/c.txt']);
    });

    act(() => {
      destination = '/dest';
      result.current.paste();
    });

    expect(onCopyFiles).toHaveBeenCalledWith([
      { sourceUrl: '/src/a.txt', destinationUrl: '/dest/a (1).txt' },
      { sourceUrl: '/src/b.txt', destinationUrl: '/dest/b (1).txt' },
      { sourceUrl: '/src/c.txt', destinationUrl: '/dest/c.txt' },
    ]);
  });

  it('handles files without extension', () => {
    const onMoveToFiles = vi.fn();

    allFiles = [
      {
        id: 'dest-folder',
        name: 'dest',
        path: '/dest',
        nodeType: DialFileNodeType.FOLDER,
        items: [
          {
            id: '2',
            name: 'README',
            path: '/dest/README',
            nodeType: DialFileNodeType.ITEM,
          } as DialFile,
        ],
      } as DialFile,
      {
        id: '1',
        name: 'README',
        path: '/src/README',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getAllFiles,
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

    expect(onMoveToFiles).toHaveBeenCalledWith([
      { sourceUrl: '/src/README', destinationUrl: '/dest/README (1)' },
    ]);
  });

  it('paste folder -> expands to all files within folder', () => {
    const onCopyFiles = vi.fn();

    allFiles = [
      {
        id: 'dest-folder',
        name: 'dest',
        path: '/dest',
        nodeType: DialFileNodeType.FOLDER,
        items: [],
      } as DialFile,
      {
        id: '1',
        name: 'MyFolder',
        path: '/src/MyFolder',
        nodeType: DialFileNodeType.FOLDER,
        items: [
          {
            id: '2',
            name: 'file1.txt',
            path: '/src/MyFolder/file1.txt',
            nodeType: DialFileNodeType.ITEM,
          } as DialFile,
          {
            id: '3',
            name: 'SubFolder',
            path: '/src/MyFolder/SubFolder',
            nodeType: DialFileNodeType.FOLDER,
            items: [
              {
                id: '4',
                name: 'file2.txt',
                path: '/src/MyFolder/SubFolder/file2.txt',
                nodeType: DialFileNodeType.ITEM,
              } as DialFile,
            ],
          } as DialFile,
        ],
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getAllFiles,
        onCopyFiles,
      }),
    );

    act(() => {
      result.current.copy(['/src/MyFolder']);
    });

    act(() => {
      destination = '/dest';
      result.current.paste();
    });

    expect(onCopyFiles).toHaveBeenCalledWith([
      {
        sourceUrl: '/src/MyFolder/file1.txt',
        destinationUrl: '/dest/MyFolder/file1.txt',
      },
      {
        sourceUrl: '/src/MyFolder/SubFolder/file2.txt',
        destinationUrl: '/dest/MyFolder/SubFolder/file2.txt',
      },
    ]);
  });

  it('uses latest value from getDestination at paste time', () => {
    const onCopyFiles = vi.fn();

    allFiles = [
      {
        id: 'dest-folder',
        name: 'B',
        path: '/B',
        nodeType: DialFileNodeType.FOLDER,
        items: [],
      } as DialFile,
      {
        id: '1',
        name: 'late.txt',
        path: '/src/late.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getAllFiles, onCopyFiles }),
    );

    act(() => {
      result.current.copy(['/src/late.txt']);
    });

    act(() => {
      destination = '/A';
      destination = '/B';
      result.current.paste();
    });

    expect(onCopyFiles).toHaveBeenCalledTimes(1);
    expect(onCopyFiles).toHaveBeenCalledWith([
      { sourceUrl: '/src/late.txt', destinationUrl: '/B/late.txt' },
    ]);
  });

  it('sequential operations: cut after copy replaces clipboard correctly', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getAllFiles }),
    );

    act(() => {
      result.current.copy(['/a', '/b']);
      result.current.cut(['/c']);
    });

    expect(result.current.state.copied.size).toBe(0);
    expect([...result.current.state.cut]).toEqual(['/c']);
    expect(result.current.state.hasItems).toBe(true);
  });
});
