import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDialFileManagerTabs } from '@/components/FileManager/hooks/use-file-manager-tabs';
import { DialFileManagerTabs } from '@/types/file-manager';

describe('Dial UI Kit :: FileManager :: useDialFileManagerTabs', () => {
  it('initializes with MyFiles as active tab', () => {
    const { result } = renderHook(() => useDialFileManagerTabs());
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
    };

    const { result } = renderHook(() => useDialFileManagerTabs(tabLabels));

    expect(result.current.tabs).toHaveLength(3);
    expect(result.current.tabs).toEqual([
      { id: DialFileManagerTabs.MyFiles, name: 'My Files' },
      { id: DialFileManagerTabs.Shared, name: 'Shared With Me' },
      { id: DialFileManagerTabs.Organization, name: 'Public Files' },
    ]);
  });

  it('uses fallback name when label is missing', () => {
    const tabLabels = {
      [DialFileManagerTabs.MyFiles]: '',
      [DialFileManagerTabs.Shared]: '',
      [DialFileManagerTabs.Organization]: '',
    };

    const { result } = renderHook(() => useDialFileManagerTabs(tabLabels));

    expect(result.current.tabs).toEqual([
      { id: DialFileManagerTabs.MyFiles, name: 'my files' },
      { id: DialFileManagerTabs.Shared, name: 'shared' },
      { id: DialFileManagerTabs.Organization, name: 'organization' },
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
});
