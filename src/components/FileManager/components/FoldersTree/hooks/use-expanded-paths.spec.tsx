import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExpandedPaths } from './use-expanded-paths';

describe('Dial UI Kit :: FileManager :: useExpandedPaths', () => {
  it('returns empty Set when uncontrolled without initial value', () => {
    const { result } = renderHook(() => useExpandedPaths());
    expect(result.current.expandedPaths.size).toBe(0);
    expect(result.current.isControlled).toBe(false);
  });

  it('returns initial expandedPaths when uncontrolled', () => {
    const initialPaths = new Set<string>(['/folder1', '/folder2']);
    const { result } = renderHook(() =>
      useExpandedPaths({ expandedPaths: initialPaths }),
    );
    expect(result.current.expandedPaths).toEqual(initialPaths);
    expect(result.current.isControlled).toBe(false);
  });

  it('toggles path when uncontrolled', () => {
    const { result } = renderHook(() => useExpandedPaths());

    act(() => {
      result.current.togglePath('/folder1');
    });
    expect(result.current.expandedPaths.has('/folder1')).toBe(true);

    act(() => {
      result.current.togglePath('/folder1');
    });
    expect(result.current.expandedPaths.has('/folder1')).toBe(false);
  });

  it('expands path when uncontrolled', () => {
    const { result } = renderHook(() => useExpandedPaths());

    act(() => {
      result.current.expandPath('/folder1');
    });
    expect(result.current.expandedPaths.has('/folder1')).toBe(true);

    act(() => {
      result.current.expandPath('/folder2');
    });
    expect(result.current.expandedPaths.has('/folder1')).toBe(true);
    expect(result.current.expandedPaths.has('/folder2')).toBe(true);
  });

  it('collapses path when uncontrolled', () => {
    const initialPaths = new Set<string>(['/folder1', '/folder2']);
    const { result } = renderHook(() =>
      useExpandedPaths({ expandedPaths: initialPaths }),
    );

    act(() => {
      result.current.collapsePath('/folder1');
    });
    expect(result.current.expandedPaths.has('/folder1')).toBe(false);
    expect(result.current.expandedPaths.has('/folder2')).toBe(true);
  });

  it('collapses all paths when uncontrolled', () => {
    const initialPaths = new Set<string>(['/folder1', '/folder2', '/folder3']);
    const { result } = renderHook(() =>
      useExpandedPaths({ expandedPaths: initialPaths }),
    );

    act(() => {
      result.current.collapseAll();
    });
    expect(result.current.expandedPaths.size).toBe(0);
  });

  it('sets expanded paths directly when uncontrolled', () => {
    const { result } = renderHook(() => useExpandedPaths());

    const newPaths = new Set<string>(['/folder1', '/folder2']);
    act(() => {
      result.current.setExpandedPaths(newPaths);
    });
    expect(result.current.expandedPaths).toEqual(newPaths);
  });

  it('works in controlled mode with onExpandedPathsChange callback', () => {
    const onExpandedPathsChange = vi.fn();
    const initialPaths = new Set<string>(['/folder1']);
    const { result, rerender } = renderHook(
      ({ expandedPaths }) =>
        useExpandedPaths({ expandedPaths, onExpandedPathsChange }),
      { initialProps: { expandedPaths: initialPaths } },
    );

    expect(result.current.isControlled).toBe(true);
    expect(result.current.expandedPaths).toEqual(initialPaths);

    act(() => {
      result.current.togglePath('/folder2');
    });

    expect(onExpandedPathsChange).toHaveBeenCalledWith(
      new Set<string>(['/folder1', '/folder2']),
    );
    expect(result.current.expandedPaths).toEqual(initialPaths);

    const newPaths = new Set<string>(['/folder1', '/folder2']);
    rerender({ expandedPaths: newPaths });
    expect(result.current.expandedPaths).toEqual(newPaths);
  });

  it('calls onExpandedPathsChange when togglePath is called in controlled mode', () => {
    const onExpandedPathsChange = vi.fn();
    const initialPaths = new Set<string>(['/folder1']);
    const { result } = renderHook(() =>
      useExpandedPaths({
        expandedPaths: initialPaths,
        onExpandedPathsChange,
      }),
    );

    act(() => {
      result.current.togglePath('/folder1');
    });

    expect(onExpandedPathsChange).toHaveBeenCalledWith(new Set<string>());
  });

  it('calls onExpandedPathsChange when expandPath is called in controlled mode', () => {
    const onExpandedPathsChange = vi.fn();
    const initialPaths = new Set<string>(['/folder1']);
    const { result } = renderHook(() =>
      useExpandedPaths({
        expandedPaths: initialPaths,
        onExpandedPathsChange,
      }),
    );

    act(() => {
      result.current.expandPath('/folder2');
    });

    expect(onExpandedPathsChange).toHaveBeenCalledWith(
      new Set<string>(['/folder1', '/folder2']),
    );
  });

  it('calls onExpandedPathsChange when collapsePath is called in controlled mode', () => {
    const onExpandedPathsChange = vi.fn();
    const initialPaths = new Set<string>(['/folder1', '/folder2']);
    const { result } = renderHook(() =>
      useExpandedPaths({
        expandedPaths: initialPaths,
        onExpandedPathsChange,
      }),
    );

    act(() => {
      result.current.collapsePath('/folder1');
    });

    expect(onExpandedPathsChange).toHaveBeenCalledWith(
      new Set<string>(['/folder2']),
    );
  });

  it('calls onExpandedPathsChange when collapseAll is called in controlled mode', () => {
    const onExpandedPathsChange = vi.fn();
    const initialPaths = new Set<string>(['/folder1', '/folder2']);
    const { result } = renderHook(() =>
      useExpandedPaths({
        expandedPaths: initialPaths,
        onExpandedPathsChange,
      }),
    );

    act(() => {
      result.current.collapseAll();
    });

    expect(onExpandedPathsChange).toHaveBeenCalledWith(new Set<string>());
  });

  it('calls onExpandedPathsChange when setExpandedPaths is called in controlled mode', () => {
    const onExpandedPathsChange = vi.fn();
    const initialPaths = new Set<string>(['/folder1']);
    const { result } = renderHook(() =>
      useExpandedPaths({
        expandedPaths: initialPaths,
        onExpandedPathsChange,
      }),
    );

    const newPaths = new Set<string>(['/folder2', '/folder3']);
    act(() => {
      result.current.setExpandedPaths(newPaths);
    });

    expect(onExpandedPathsChange).toHaveBeenCalledWith(newPaths);
  });

  it('provides a stable API shape', () => {
    const { result } = renderHook(() => useExpandedPaths());

    expect(result.current.expandedPaths).toBeInstanceOf(Set);
    expect(typeof result.current.setExpandedPaths).toBe('function');
    expect(typeof result.current.togglePath).toBe('function');
    expect(typeof result.current.collapseAll).toBe('function');
    expect(typeof result.current.expandPath).toBe('function');
    expect(typeof result.current.collapsePath).toBe('function');
    expect(typeof result.current.isControlled).toBe('boolean');
  });

  it('handles multiple toggles correctly when uncontrolled', () => {
    const { result } = renderHook(() => useExpandedPaths());

    act(() => {
      result.current.togglePath('/folder1');
    });
    act(() => {
      result.current.togglePath('/folder2');
    });
    act(() => {
      result.current.togglePath('/folder3');
    });
    expect(result.current.expandedPaths.size).toBe(3);

    act(() => {
      result.current.togglePath('/folder2');
    });
    expect(result.current.expandedPaths.size).toBe(2);
    expect(result.current.expandedPaths.has('/folder1')).toBe(true);
    expect(result.current.expandedPaths.has('/folder2')).toBe(false);
    expect(result.current.expandedPaths.has('/folder3')).toBe(true);
  });

  it('does not mutate original Set in controlled mode', () => {
    const onExpandedPathsChange = vi.fn();
    const initialPaths = new Set<string>(['/folder1']);
    const { result } = renderHook(() =>
      useExpandedPaths({
        expandedPaths: initialPaths,
        onExpandedPathsChange,
      }),
    );

    act(() => {
      result.current.togglePath('/folder2');
    });

    expect(initialPaths.size).toBe(1);
    expect(initialPaths.has('/folder2')).toBe(false);
  });

  it('syncs internal expandedPaths when external expandedPaths changes in controlled mode', () => {
    const onExpandedPathsChange = vi.fn();
    const initialPaths = new Set<string>(['/folder1']);

    const { result, rerender } = renderHook(
      ({ paths }) =>
        useExpandedPaths({
          expandedPaths: paths,
          onExpandedPathsChange,
        }),
      { initialProps: { paths: initialPaths } },
    );

    expect(result.current.expandedPaths).toEqual(initialPaths);

    const updatedPaths = new Set<string>(['/folder1', '/folder2']);

    rerender({ paths: updatedPaths });

    expect(result.current.expandedPaths).toEqual(updatedPaths);

    act(() => {
      result.current.togglePath('/folder3');
    });

    expect(onExpandedPathsChange).toHaveBeenCalledWith(
      new Set<string>(['/folder1', '/folder2', '/folder3']),
    );
  });
});
