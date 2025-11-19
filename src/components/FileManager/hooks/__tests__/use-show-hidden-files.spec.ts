import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useShowHiddenFiles } from '@/components/FileManager/hooks/use-show-hidden-files';

describe('Dial UI Kit :: FileManager :: useShowHiddenFiles', () => {
  it('returns false by default', () => {
    const { result } = renderHook(() => useShowHiddenFiles());
    expect(result.current.areHiddenFilesVisible).toBe(false);
  });

  it('respects provided initialState (true)', () => {
    const { result } = renderHook(() =>
      useShowHiddenFiles({ showHiddenFiles: true }),
    );
    expect(result.current.areHiddenFilesVisible).toBe(true);
  });

  it('respects provided initialState (false)', () => {
    const { result } = renderHook(() =>
      useShowHiddenFiles({ showHiddenFiles: false }),
    );
    expect(result.current.areHiddenFilesVisible).toBe(false);
  });

  it('toggles visibility on toggleHiddenFilesVisibility()', () => {
    const { result } = renderHook(() => useShowHiddenFiles());

    act(() => {
      result.current.toggleHiddenFilesVisibility();
    });
    expect(result.current.areHiddenFilesVisible).toBe(true);

    act(() => {
      result.current.toggleHiddenFilesVisibility();
    });
    expect(result.current.areHiddenFilesVisible).toBe(false);
  });

  it('toggles correctly when starting from true', () => {
    const { result } = renderHook(() =>
      useShowHiddenFiles({ showHiddenFiles: true }),
    );

    act(() => {
      result.current.toggleHiddenFilesVisibility();
    });
    expect(result.current.areHiddenFilesVisible).toBe(false);
  });

  it('sets visibility explicitly with setAreHiddenFilesVisible()', () => {
    const { result } = renderHook(() => useShowHiddenFiles());

    act(() => {
      result.current.setAreHiddenFilesVisible(true);
    });
    expect(result.current.areHiddenFilesVisible).toBe(true);

    act(() => {
      result.current.setAreHiddenFilesVisible(false);
    });
    expect(result.current.areHiddenFilesVisible).toBe(false);
  });

  it('supports multiple sequential state changes', () => {
    const { result } = renderHook(() => useShowHiddenFiles());

    act(() => {
      result.current.toggleHiddenFilesVisibility();
      result.current.setAreHiddenFilesVisible(false);
      result.current.toggleHiddenFilesVisibility();
    });

    expect(result.current.areHiddenFilesVisible).toBe(true);
  });
});
