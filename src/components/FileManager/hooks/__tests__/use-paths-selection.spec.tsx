import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePathsSelection } from '@/components/FileManager/hooks/use-paths-selection';

describe('Dial UI Kit :: FileManager :: usePathsSelection', () => {
  it('initializes with empty selection when no props provided', () => {
    const { result } = renderHook(() => usePathsSelection({}));

    expect(result.current.selectedPaths.size).toBe(0);
    expect(result.current.isControlled).toBe(false);
  });

  it('initializes with defaultSelectedPaths in uncontrolled mode', () => {
    const defaultSelectedPaths = new Set(['/a', '/b']);

    const { result } = renderHook(() =>
      usePathsSelection({ defaultSelectedPaths }),
    );

    expect(result.current.selectedPaths).toEqual(defaultSelectedPaths);
    expect(result.current.isControlled).toBe(false);
  });

  it('updates selection in uncontrolled mode via setSelectedPaths', () => {
    const { result } = renderHook(() => usePathsSelection({}));

    act(() => {
      result.current.setSelectedPaths(new Set(['/file1']));
    });

    expect(result.current.selectedPaths.has('/file1')).toBe(true);
  });

  it('clears selection in uncontrolled mode', () => {
    const { result } = renderHook(() =>
      usePathsSelection({
        defaultSelectedPaths: new Set(['/a']),
      }),
    );

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedPaths.size).toBe(0);
  });

  it('calls onSelectedPathsChange in uncontrolled mode', () => {
    const onSelectedPathsChange = vi.fn();

    const { result } = renderHook(() =>
      usePathsSelection({ onSelectedPathsChange }),
    );

    act(() => {
      result.current.setSelectedPaths(new Set(['/x']));
    });

    expect(onSelectedPathsChange).toHaveBeenCalledTimes(1);
    expect(onSelectedPathsChange.mock.calls[0][0]).toEqual(new Set(['/x']));
  });

  it('does not mutate passed Set instances', () => {
    const { result } = renderHook(() => usePathsSelection({}));

    const paths = new Set(['/a']);

    act(() => {
      result.current.setSelectedPaths(paths);
    });

    paths.add('/b');

    expect(result.current.selectedPaths.has('/b')).toBe(false);
  });

  it('uses selectedPaths prop in controlled mode', () => {
    const controlledPaths = new Set(['/controlled']);

    const { result } = renderHook(() =>
      usePathsSelection({ selectedPaths: controlledPaths }),
    );

    expect(result.current.selectedPaths).toBe(controlledPaths);
    expect(result.current.isControlled).toBe(true);
  });

  it('updates selectedPaths when controlled prop changes', () => {
    const { result, rerender } = renderHook(
      ({ selectedPaths }) => usePathsSelection({ selectedPaths }),
      {
        initialProps: {
          selectedPaths: new Set(['/a']),
        },
      },
    );

    expect(result.current.selectedPaths.has('/a')).toBe(true);

    rerender({
      selectedPaths: new Set(['/b']),
    });

    expect(result.current.selectedPaths.has('/b')).toBe(true);
    expect(result.current.selectedPaths.has('/a')).toBe(false);
  });

  it('does not update internal state in controlled mode', () => {
    const onSelectedPathsChange = vi.fn();

    const controlledPaths = new Set(['/external']);

    const { result } = renderHook(() =>
      usePathsSelection({
        selectedPaths: controlledPaths,
        onSelectedPathsChange,
      }),
    );

    act(() => {
      result.current.setSelectedPaths(new Set(['/internal']));
    });

    expect(result.current.selectedPaths).toBe(controlledPaths);
    expect(onSelectedPathsChange).toHaveBeenCalledWith(new Set(['/internal']));
  });

  it('clearSelection calls onSelectedPathsChange in controlled mode', () => {
    const onSelectedPathsChange = vi.fn();

    const { result } = renderHook(() =>
      usePathsSelection({
        selectedPaths: new Set(['/a']),
        onSelectedPathsChange,
      }),
    );

    act(() => {
      result.current.clearSelection();
    });

    expect(onSelectedPathsChange).toHaveBeenCalledWith(new Set());
  });

  it('provides a stable API shape', () => {
    const { result } = renderHook(() => usePathsSelection({}));

    expect(result.current.selectedPaths).toBeInstanceOf(Set);
    expect(typeof result.current.setSelectedPaths).toBe('function');
    expect(typeof result.current.clearSelection).toBe('function');
    expect(typeof result.current.isControlled).toBe('boolean');
  });
});
