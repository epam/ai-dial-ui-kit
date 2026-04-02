import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDialFileManagerTabs } from '@/components/FileManager/hooks/use-file-manager-tabs';
import { DialFileManagerTabs } from '@/types/file-manager';

describe('Dial UI Kit :: FileManager :: useDialFileManagerTabs', () => {
  it('initializes with MyFiles as active tab by default', () => {
    const { result } = renderHook(() => useDialFileManagerTabs());
    expect(result.current.activeTab).toBe(DialFileManagerTabs.MyFiles);
  });

  it('initializes with custom initial tab', () => {
    const { result } = renderHook(() =>
      useDialFileManagerTabs(undefined, DialFileManagerTabs.Shared),
    );
    expect(result.current.activeTab).toBe(DialFileManagerTabs.Shared);
  });

  it('falls back to MyFiles when invalid initial tab is provided', () => {
    const { result } = renderHook(() =>
      useDialFileManagerTabs(undefined, 'invalid_tab' as DialFileManagerTabs),
    );
    expect(result.current.activeTab).toBe(DialFileManagerTabs.MyFiles);
  });

  it('returns undefined tabs when no labels provided', () => {
    const { result } = renderHook(() => useDialFileManagerTabs());
    expect(result.current.tabs).toBeUndefined();
  });

  it('generates tabs from provided labels', () => {
    const tabLabels = {
      [DialFileManagerTabs.MyFiles]: 'My Files',
      [DialFileManagerTabs.Shared]: 'Shared With Me',
      [DialFileManagerTabs.Organization]: 'Public Files',
      [DialFileManagerTabs.Review]: 'Review files',
    };

    const { result } = renderHook(() => useDialFileManagerTabs(tabLabels));

    expect(result.current.tabs).toHaveLength(4);
    expect(result.current.tabs).toEqual([
      { id: DialFileManagerTabs.MyFiles, label: 'My Files' },
      { id: DialFileManagerTabs.Shared, label: 'Shared With Me' },
      { id: DialFileManagerTabs.Organization, label: 'Public Files' },
      { id: DialFileManagerTabs.Review, label: 'Review files' },
    ]);
  });

  it('uses fallback name when label is missing', () => {
    const tabLabels = {
      [DialFileManagerTabs.MyFiles]: '',
      [DialFileManagerTabs.Shared]: '',
      [DialFileManagerTabs.Organization]: '',
      [DialFileManagerTabs.Review]: '',
    };

    const { result } = renderHook(() => useDialFileManagerTabs(tabLabels));

    expect(result.current.tabs).toEqual([
      { id: DialFileManagerTabs.MyFiles, label: 'my files' },
      { id: DialFileManagerTabs.Shared, label: 'shared' },
      { id: DialFileManagerTabs.Organization, label: 'organization' },
      { id: DialFileManagerTabs.Review, label: 'review' },
    ]);
  });

  it('changes active tab with handleTabChange', () => {
    const { result } = renderHook(() => useDialFileManagerTabs());

    expect(result.current.activeTab).toBe(DialFileManagerTabs.MyFiles);

    act(() => {
      result.current.handleTabChange(DialFileManagerTabs.Shared);
    });
    expect(result.current.activeTab).toBe(DialFileManagerTabs.Shared);

    act(() => {
      result.current.handleTabChange(DialFileManagerTabs.Organization);
    });
    expect(result.current.activeTab).toBe(DialFileManagerTabs.Organization);
  });

  it('memoizes tabs when labels do not change', () => {
    const tabLabels = {
      [DialFileManagerTabs.MyFiles]: 'My Files',
      [DialFileManagerTabs.Shared]: 'Shared With Me',
      [DialFileManagerTabs.Organization]: 'Public Files',
      [DialFileManagerTabs.Review]: 'Review files',
    };

    const { result, rerender } = renderHook(() =>
      useDialFileManagerTabs(tabLabels),
    );

    const firstTabs = result.current.tabs;
    rerender();

    expect(result.current.tabs).toBe(firstTabs);
  });

  it('provides a stable API shape', () => {
    const { result } = renderHook(() => useDialFileManagerTabs());

    expect(typeof result.current.activeTab).toBe('string');
    expect(typeof result.current.handleTabChange).toBe('function');
    expect(result.current.tabs).toBeUndefined();
  });

  it('respects initialTab with custom labels', () => {
    const tabLabels = {
      [DialFileManagerTabs.MyFiles]: 'My Files',
      [DialFileManagerTabs.Shared]: 'Shared With Me',
      [DialFileManagerTabs.Organization]: 'Public Files',
      [DialFileManagerTabs.Review]: 'Review files',
    };

    const { result } = renderHook(() =>
      useDialFileManagerTabs(tabLabels, DialFileManagerTabs.Organization),
    );

    expect(result.current.activeTab).toBe(DialFileManagerTabs.Organization);
  });
});
