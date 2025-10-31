import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileClipboard } from './use-file-clipboard';

describe('Dial UI Kit :: FileManager :: useFileClipboard', () => {
  let destination = '/initial';
  const getDestination = () => destination;

  beforeEach(() => {
    destination = '/initial';
  });

  it('initial state: empty clipboard and hasItems=false', () => {
    const { result } = renderHook(() => useFileClipboard({ getDestination }));

    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.cut.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('copy(files) fills copied, clears cut, sets hasItems=true', () => {
    const { result } = renderHook(() => useFileClipboard({ getDestination }));

    act(() => {
      result.current.copy(['/a.txt', '/b.png']);
    });

    expect([...result.current.state.copied]).toEqual(['/a.txt', '/b.png']);
    expect(result.current.state.cut.size).toBe(0);
    expect(result.current.state.hasItems).toBe(true);
  });

  it('cut(files) fills cut, clears copied, sets hasItems=true', () => {
    const { result } = renderHook(() => useFileClipboard({ getDestination }));

    act(() => {
      result.current.cut(['/draft.doc']);
    });

    expect([...result.current.state.cut]).toEqual(['/draft.doc']);
    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.hasItems).toBe(true);
  });

  it('clear() empties both sets and sets hasItems=false', () => {
    const { result } = renderHook(() => useFileClipboard({ getDestination }));

    act(() => {
      result.current.copy(['/x']);
      result.current.clear();
    });

    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.cut.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('paste with copied -> calls onCopyFiles(destination) and clears copied', () => {
    const onCopyFiles = vi.fn();
    const onMoveToFiles = vi.fn();

    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, onCopyFiles, onMoveToFiles }),
    );

    act(() => {
      result.current.copy(['/a', '/b']);
    });

    act(() => {
      destination = '/target-folder';
      result.current.paste();
    });

    expect(onCopyFiles).toHaveBeenCalledTimes(1);
    expect(onCopyFiles).toHaveBeenCalledWith(['/a', '/b'], '/target-folder');
    expect(onMoveToFiles).not.toHaveBeenCalled();
    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('paste with cut -> calls onMoveToFiles(destination) and clears cut', () => {
    const onCopyFiles = vi.fn();
    const onMoveToFiles = vi.fn();

    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, onCopyFiles, onMoveToFiles }),
    );

    act(() => {
      result.current.cut(['/m1', '/m2']);
    });

    act(() => {
      destination = '/move-here';
      result.current.paste();
    });

    expect(onMoveToFiles).toHaveBeenCalledTimes(1);
    expect(onMoveToFiles).toHaveBeenCalledWith(['/m1', '/m2'], '/move-here');
    expect(onCopyFiles).not.toHaveBeenCalled();
    expect(result.current.state.cut.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('paste with empty clipboard -> no-op (no callbacks)', () => {
    const onCopyFiles = vi.fn();
    const onMoveToFiles = vi.fn();

    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, onCopyFiles, onMoveToFiles }),
    );

    act(() => {
      result.current.paste();
    });

    expect(onCopyFiles).not.toHaveBeenCalled();
    expect(onMoveToFiles).not.toHaveBeenCalled();
    expect(result.current.state.hasItems).toBe(false);
  });

  it('copy([]) results in hasItems=false', () => {
    const { result } = renderHook(() => useFileClipboard({ getDestination }));

    act(() => {
      result.current.copy([]);
    });

    expect(result.current.state.copied.size).toBe(0);
    expect(result.current.state.hasItems).toBe(false);
  });

  it('uses latest value from getDestination at paste time', () => {
    const onCopyFiles = vi.fn();

    const { result } = renderHook(() =>
      useFileClipboard({ getDestination, onCopyFiles }),
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
    expect(onCopyFiles).toHaveBeenCalledWith(['/late.txt'], '/B');
  });

  it('sequential operations: cut after copy replaces clipboard correctly', () => {
    const { result } = renderHook(() => useFileClipboard({ getDestination }));

    act(() => {
      result.current.copy(['/a', '/b']);
      result.current.cut(['/c']);
    });

    expect(result.current.state.copied.size).toBe(0);
    expect([...result.current.state.cut]).toEqual(['/c']);
    expect(result.current.state.hasItems).toBe(true);
  });
});
