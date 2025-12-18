import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCurrentPath } from '@/components/FileManager/hooks/use-current-path';

describe('Dial UI Kit :: FileManager :: useCurrentPath', () => {
  it('initializes with provided path', () => {
    const { result } = renderHook(() =>
      useCurrentPath({ path: '/initial/path' }),
    );
    expect(result.current.currentPath).toBe('/initial/path');
  });

  it('initializes with undefined when no path provided', () => {
    const { result } = renderHook(() => useCurrentPath({}));
    expect(result.current.currentPath).toBeUndefined();
  });

  it('updates currentPath when path prop changes', () => {
    const { result, rerender } = renderHook(
      ({ path }) => useCurrentPath({ path }),
      {
        initialProps: { path: '/initial' as string | undefined },
      },
    );

    expect(result.current.currentPath).toBe('/initial');

    rerender({ path: '/updated' });
    expect(result.current.currentPath).toBe('/updated');
  });

  it('sets currentPath directly with setCurrentPath', () => {
    const { result } = renderHook(() =>
      useCurrentPath({ defaultPath: '/initial' }),
    );

    act(() => {
      result.current.setCurrentPath('/new/path');
    });
    expect(result.current.currentPath).toBe('/new/path');

    act(() => {
      result.current.setCurrentPath(undefined);
    });
    expect(result.current.currentPath).toBeUndefined();
  });

  it('calls onPathChange and onSelectionClear with handlePathChange', () => {
    const onPathChange = vi.fn();
    const onSelectionClear = vi.fn();

    const { result } = renderHook(() =>
      useCurrentPath({
        defaultPath: '/initial',
        onPathChange,
        onSelectionClear,
      }),
    );

    onSelectionClear.mockClear();

    act(() => {
      result.current.handlePathChange('/changed/path');
    });

    expect(result.current.currentPath).toBe('/changed/path');
    expect(onPathChange).toHaveBeenCalledWith('/changed/path');
    expect(onPathChange).toHaveBeenCalledTimes(1);
    expect(onSelectionClear).toHaveBeenCalledTimes(1);
  });

  it('handles undefined in handlePathChange', () => {
    const onPathChange = vi.fn();

    const { result } = renderHook(() =>
      useCurrentPath({ defaultPath: '/initial', onPathChange }),
    );

    act(() => {
      result.current.handlePathChange(undefined);
    });

    expect(result.current.currentPath).toBeUndefined();
    expect(onPathChange).toHaveBeenCalledWith(undefined);
  });

  it('works without optional callbacks', () => {
    const { result } = renderHook(() =>
      useCurrentPath({ defaultPath: '/initial' }),
    );

    act(() => {
      result.current.handlePathChange('/new');
    });

    expect(result.current.currentPath).toBe('/new');
  });

  it('provides a stable API shape', () => {
    const { result } = renderHook(() => useCurrentPath({ path: '/test' }));

    expect(typeof result.current.currentPath).toBe('string');
    expect(typeof result.current.setCurrentPath).toBe('function');
    expect(typeof result.current.handlePathChange).toBe('function');
  });

  it('does not update currentPath via setCurrentPath in controlled mode', () => {
    const onPathChange = vi.fn();

    const { result } = renderHook(() =>
      useCurrentPath({ path: '/initial', onPathChange }),
    );

    act(() => {
      result.current.setCurrentPath('/new');
    });

    expect(result.current.currentPath).toBe('/initial');
    expect(onPathChange).toHaveBeenCalledWith('/new');
  });

  it('updates currentPath only when controlled path prop changes', () => {
    const { result, rerender } = renderHook(
      ({ path }) => useCurrentPath({ path }),
      {
        initialProps: { path: '/initial' },
      },
    );

    rerender({ path: '/updated' });

    expect(result.current.currentPath).toBe('/updated');
  });

  it('does not call onSelectionClear when path prop changes', () => {
    const onSelectionClear = vi.fn();

    const { rerender } = renderHook(
      ({ path }) => useCurrentPath({ path, onSelectionClear }),
      {
        initialProps: { path: '/initial' as string | undefined },
      },
    );

    rerender({ path: '/updated' });

    expect(onSelectionClear).not.toHaveBeenCalled();
  });

  it('controlled mode works without onPathChange', () => {
    const { result } = renderHook(() => useCurrentPath({ path: '/initial' }));

    act(() => {
      result.current.handlePathChange('/new');
    });

    expect(result.current.currentPath).toBe('/initial');
  });
});
