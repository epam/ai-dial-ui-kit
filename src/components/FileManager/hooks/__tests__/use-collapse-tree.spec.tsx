import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCollapseTree } from '@/components/FileManager/hooks/use-collapse-tree';

describe('Dial UI Kit :: FileManager :: useCollapseTree', () => {
  it('returns initial state (true) when uncontrolled', () => {
    const { result } = renderHook(() => useCollapseTree({ collapsed: true }));
    expect(result.current.isTreeCollapsed).toBe(true);
  });

  it('returns initial state (false) when uncontrolled', () => {
    const { result } = renderHook(() => useCollapseTree({ collapsed: false }));
    expect(result.current.isTreeCollapsed).toBe(false);
  });

  it('toggles state with toggleTreeCollapse when uncontrolled', () => {
    const { result } = renderHook(() => useCollapseTree({ collapsed: true }));

    act(() => {
      result.current.toggleTreeCollapse();
    });
    expect(result.current.isTreeCollapsed).toBe(false);

    act(() => {
      result.current.toggleTreeCollapse();
    });
    expect(result.current.isTreeCollapsed).toBe(true);
  });

  it('sets state directly with setIsTreeCollapsed when uncontrolled', () => {
    const { result } = renderHook(() => useCollapseTree({ collapsed: true }));

    act(() => {
      result.current.setIsTreeCollapsed(false);
    });
    expect(result.current.isTreeCollapsed).toBe(false);

    act(() => {
      result.current.setIsTreeCollapsed(true);
    });
    expect(result.current.isTreeCollapsed).toBe(true);
  });

  it('works in controlled mode with onCollapseChange callback', () => {
    const onCollapseChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ collapsed }) => useCollapseTree({ collapsed, onCollapseChange }),
      { initialProps: { collapsed: true } },
    );

    expect(result.current.isTreeCollapsed).toBe(true);

    act(() => {
      result.current.toggleTreeCollapse();
    });

    expect(onCollapseChange).toHaveBeenCalledWith(false);
    expect(result.current.isTreeCollapsed).toBe(true);

    rerender({ collapsed: false });
    expect(result.current.isTreeCollapsed).toBe(false);
  });

  it('calls onCollapseChange when setIsTreeCollapsed is called in controlled mode', () => {
    const onCollapseChange = vi.fn();
    const { result } = renderHook(() =>
      useCollapseTree({ collapsed: true, onCollapseChange }),
    );

    act(() => {
      result.current.setIsTreeCollapsed(false);
    });

    expect(onCollapseChange).toHaveBeenCalledWith(false);
  });

  it('provides a stable API shape', () => {
    const { result } = renderHook(() => useCollapseTree({ collapsed: true }));

    expect(typeof result.current.isTreeCollapsed).toBe('boolean');
    expect(typeof result.current.toggleTreeCollapse).toBe('function');
    expect(typeof result.current.setIsTreeCollapsed).toBe('function');
  });

  it('works without options', () => {
    const { result } = renderHook(() => useCollapseTree());

    expect(result.current.isTreeCollapsed).toBe(false);

    act(() => {
      result.current.toggleTreeCollapse();
    });

    expect(result.current.isTreeCollapsed).toBe(true);
  });
});
