import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTriggerViewRename } from '@/components/FileManager/hooks/use-trigger-view-rename';
import { FileManagerRenameTriggerView } from '@/types/file-manager';

describe('Dial UI Kit :: FileManager :: useTriggerViewRename', () => {
  it('initializes with Grid trigger view by default', () => {
    const onRename = vi.fn();

    const { result } = renderHook(() => useTriggerViewRename({ onRename }));

    expect(result.current.renameTriggerView).toBe(
      FileManagerRenameTriggerView.Grid,
    );
  });

  it('calls onRename when onGridRename is invoked', () => {
    const onRename = vi.fn();
    const testPath = '/test/path';

    const { result } = renderHook(() => useTriggerViewRename({ onRename }));

    act(() => {
      result.current.onGridRename(testPath);
    });

    expect(onRename).toHaveBeenCalledWith(testPath);
    expect(onRename).toHaveBeenCalledTimes(1);
  });

  it('sets renameTriggerView to Grid when onGridRename is called', () => {
    const onRename = vi.fn();

    const { result } = renderHook(() => useTriggerViewRename({ onRename }));

    act(() => {
      result.current.onGridRename('/test/path');
    });

    expect(result.current.renameTriggerView).toBe(
      FileManagerRenameTriggerView.Grid,
    );
  });

  it('calls onRename when onTreeRename is invoked', () => {
    const onRename = vi.fn();
    const testPath = '/tree/path';

    const { result } = renderHook(() => useTriggerViewRename({ onRename }));

    act(() => {
      result.current.onTreeRename(testPath);
    });

    expect(onRename).toHaveBeenCalledWith(testPath);
    expect(onRename).toHaveBeenCalledTimes(1);
  });

  it('sets renameTriggerView to Tree when onTreeRename is called', () => {
    const onRename = vi.fn();

    const { result } = renderHook(() => useTriggerViewRename({ onRename }));

    act(() => {
      result.current.onTreeRename('/tree/path');
    });

    expect(result.current.renameTriggerView).toBe(
      FileManagerRenameTriggerView.Tree,
    );
  });

  it('switches trigger view from Grid to Tree', () => {
    const onRename = vi.fn();

    const { result } = renderHook(() => useTriggerViewRename({ onRename }));

    expect(result.current.renameTriggerView).toBe(
      FileManagerRenameTriggerView.Grid,
    );

    act(() => {
      result.current.onTreeRename('/tree/path');
    });

    expect(result.current.renameTriggerView).toBe(
      FileManagerRenameTriggerView.Tree,
    );
  });

  it('switches trigger view from Tree to Grid', () => {
    const onRename = vi.fn();

    const { result } = renderHook(() => useTriggerViewRename({ onRename }));

    act(() => {
      result.current.onTreeRename('/tree/path');
    });

    expect(result.current.renameTriggerView).toBe(
      FileManagerRenameTriggerView.Tree,
    );

    act(() => {
      result.current.onGridRename('/grid/path');
    });

    expect(result.current.renameTriggerView).toBe(
      FileManagerRenameTriggerView.Grid,
    );
  });

  it('maintains stable callback references when onRename does not change', () => {
    const onRename = vi.fn();

    const { result, rerender } = renderHook(() =>
      useTriggerViewRename({ onRename }),
    );

    const firstOnGridRename = result.current.onGridRename;
    const firstOnTreeRename = result.current.onTreeRename;

    rerender();

    expect(result.current.onGridRename).toBe(firstOnGridRename);
    expect(result.current.onTreeRename).toBe(firstOnTreeRename);
  });

  it('updates callback references when onRename changes', () => {
    const onRenameFromGrid = vi.fn();
    const onRenameFromTree = vi.fn();

    const { result, rerender } = renderHook(
      ({ onRename }) => useTriggerViewRename({ onRename }),
      { initialProps: { onRename: onRenameFromGrid } },
    );

    const firstOnGridRename = result.current.onGridRename;

    rerender({ onRename: onRenameFromTree });

    expect(result.current.onGridRename).not.toBe(firstOnGridRename);

    act(() => {
      result.current.onGridRename('/path');
    });

    expect(onRenameFromGrid).not.toHaveBeenCalled();
    expect(onRenameFromTree).toHaveBeenCalledWith('/path');
  });

  it('handles multiple consecutive calls correctly', () => {
    const onRename = vi.fn();

    const { result } = renderHook(() => useTriggerViewRename({ onRename }));

    act(() => {
      result.current.onGridRename('/path1');
      result.current.onTreeRename('/path2');
      result.current.onGridRename('/path3');
    });

    expect(onRename).toHaveBeenCalledTimes(3);
    expect(onRename).toHaveBeenNthCalledWith(1, '/path1');
    expect(onRename).toHaveBeenNthCalledWith(2, '/path2');
    expect(onRename).toHaveBeenNthCalledWith(3, '/path3');
    expect(result.current.renameTriggerView).toBe(
      FileManagerRenameTriggerView.Grid,
    );
  });
});
