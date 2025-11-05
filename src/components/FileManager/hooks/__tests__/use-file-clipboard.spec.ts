import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileClipboard } from '@/components/FileManager/hooks/use-file-clipboard';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';

describe('Dial UI Kit :: FileManager :: useFileClipboard', () => {
  let destination = '/initial';
  let destinationFiles: DialFile[] = [];
  const getDestination = () => destination;
  const getDestinationFiles = () => destinationFiles;

  beforeEach(() => {
    destination = '/initial';
    destinationFiles = [];
  });

  it('initial state: empty clipboard and hasItems=false', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getDestinationFiles }),
    );

    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.cut.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('copy(files) fills copied, clears cut, sets hasItems=true', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getDestinationFiles }),
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
      useFileClipboard({ getDestination, getDestinationFiles }),
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
      useFileClipboard({ getDestination, getDestinationFiles }),
    );

    act(() => {
      result.current.copy(['/x']);
      result.current.clear();
    });

    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.cut.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('paste with copied -> calls onCopyFiles with resolved items and clears copied', () => {
    const onCopyFiles = vi.fn();
    const onMoveToFiles = vi.fn();
    destinationFiles = [];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getDestinationFiles,
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
    expect(onCopyFiles).toHaveBeenCalledWith([
      { sourceUrl: '/a', destinationUrl: '/target-folder/a' },
      { sourceUrl: '/b', destinationUrl: '/target-folder/b' },
    ]);
    expect(onMoveToFiles).not.toHaveBeenCalled();
    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('paste with cut -> calls onMoveToFiles with resolved items and clears cut', () => {
    const onCopyFiles = vi.fn();
    const onMoveToFiles = vi.fn();

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getDestinationFiles,
        onCopyFiles,
        onMoveToFiles,
      }),
    );

    act(() => {
      result.current.cut(['/m1', '/m2']);
    });

    act(() => {
      destination = '/move-here';
      result.current.paste();
    });

    expect(onMoveToFiles).toHaveBeenCalledTimes(1);
    expect(onMoveToFiles).toHaveBeenCalledWith([
      { sourceUrl: '/m1', destinationUrl: '/move-here/m1' },
      { sourceUrl: '/m2', destinationUrl: '/move-here/m2' },
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
        getDestinationFiles,
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
      useFileClipboard({ getDestination, getDestinationFiles }),
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

    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getDestinationFiles, onCopyFiles }),
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

    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getDestinationFiles, onCopyFiles }),
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

    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getDestinationFiles, onCopyFiles }),
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
    destinationFiles = [
      {
        id: '1',
        name: 'README',
        path: '/dest/README',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useFileClipboard({
        getDestination,
        getDestinationFiles,
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

  it('uses latest value from getDestination at paste time', () => {
    const onCopyFiles = vi.fn();

    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getDestinationFiles, onCopyFiles }),
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
    expect(onCopyFiles).toHaveBeenCalledWith([
      { sourceUrl: '/late.txt', destinationUrl: '/B/late.txt' },
    ]);
  });

  it('sequential operations: cut after copy replaces clipboard correctly', () => {
    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, getDestinationFiles }),
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
