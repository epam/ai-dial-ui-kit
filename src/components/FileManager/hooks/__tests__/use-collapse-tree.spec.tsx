import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCollapseTree } from '@/components/FileManager/hooks/use-collapse-tree';

describe('Dial UI Kit :: FileManager :: useCollapseTree', () => {
  it('returns initial state (true)', () => {
    const { result } = renderHook(() => useCollapseTree(true));
    expect(result.current.isTreeCollapsed).toBe(true);
  });

  it('returns initial state (false)', () => {
    const { result } = renderHook(() => useCollapseTree(false));
    expect(result.current.isTreeCollapsed).toBe(false);
  });

  it('toggles state with toggleTreeCollapse', () => {
    const { result } = renderHook(() => useCollapseTree(true));

    act(() => {
      result.current.toggleTreeCollapse();
    });
    expect(result.current.isTreeCollapsed).toBe(false);

    act(() => {
      result.current.toggleTreeCollapse();
    });
    expect(result.current.isTreeCollapsed).toBe(true);
  });

  it('sets state directly with setIsTreeCollapsed', () => {
    const { result } = renderHook(() => useCollapseTree(true));

    act(() => {
      result.current.setIsTreeCollapsed(false);
    });
    expect(result.current.isTreeCollapsed).toBe(false);

    act(() => {
      result.current.setIsTreeCollapsed(true);
    });
    expect(result.current.isTreeCollapsed).toBe(true);
  });

  it('provides a stable API shape', () => {
    const { result } = renderHook(() => useCollapseTree(true));

    expect(typeof result.current.isTreeCollapsed).toBe('boolean');
    expect(typeof result.current.toggleTreeCollapse).toBe('function');
    expect(typeof result.current.setIsTreeCollapsed).toBe('function');
  });
});
