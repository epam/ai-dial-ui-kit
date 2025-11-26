import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useNewActions } from '@/components/FileManager/hooks/use-new-actions';
import type { MouseEvent } from 'react';

describe('Dial UI Kit :: FileManager :: useNewActions', () => {
  const mockMouseEvent = {} as MouseEvent<Element, globalThis.MouseEvent>;

  it('returns empty actions when no labels provided', () => {
    const { result } = renderHook(() => useNewActions({}));

    expect(result.current.newActions).toEqual([]);
    expect(result.current.isNewButtonVisible).toBe(false);
  });

  it('returns empty actions when labels object is undefined', () => {
    const { result } = renderHook(() =>
      useNewActions({ newActionLabels: undefined }),
    );

    expect(result.current.newActions).toEqual([]);
    expect(result.current.isNewButtonVisible).toBe(false);
  });

  it.each([
    {
      label: 'newFolder',
      actionKey: 'new-folder',
      actionLabel: 'New Folder',
      callbackName: 'onCreateFolder' as const,
    },
    {
      label: 'uploadFiles',
      actionKey: 'upload-file',
      actionLabel: 'Upload Files',
      callbackName: 'onUploadFiles' as const,
    },
    {
      label: 'uploadArchive',
      actionKey: 'upload-archive',
      actionLabel: 'Upload Archive',
      callbackName: 'onUploadArchive' as const,
    },
  ])(
    'creates $label action when label is provided',
    ({ actionKey, actionLabel, label }) => {
      const { result } = renderHook(() =>
        useNewActions({
          newActionLabels: { [label]: actionLabel },
        }),
      );

      expect(result.current.newActions).toHaveLength(1);
      expect(result.current.newActions[0]).toMatchObject({
        key: actionKey,
        label: actionLabel,
      });
      expect(result.current.isNewButtonVisible).toBe(true);
    },
  );

  it.each([
    {
      label: 'newFolder',
      actionKey: 'new-folder',
      actionLabel: 'New Folder',
      callbackName: 'onCreateFolder' as const,
    },
    {
      label: 'uploadFiles',
      actionKey: 'upload-file',
      actionLabel: 'Upload Files',
      callbackName: 'onUploadFiles' as const,
    },
    {
      label: 'uploadArchive',
      actionKey: 'upload-archive',
      actionLabel: 'Upload Archive',
      callbackName: 'onUploadArchive' as const,
    },
  ])(
    'calls $callbackName when $label action is clicked',
    ({ label, actionKey, actionLabel, callbackName }) => {
      const callback = vi.fn();
      const { result } = renderHook(() =>
        useNewActions({
          newActionLabels: { [label]: actionLabel },
          [callbackName]: callback,
        }),
      );

      result.current.newActions[0].onClick?.({
        key: actionKey,
        domEvent: mockMouseEvent,
      });

      expect(callback).toHaveBeenCalledTimes(1);
    },
  );

  it.each([
    { label: 'newFolder', actionKey: 'new-folder', actionLabel: 'New Folder' },
    {
      label: 'uploadFiles',
      actionKey: 'upload-file',
      actionLabel: 'Upload Files',
    },
    {
      label: 'uploadArchive',
      actionKey: 'upload-archive',
      actionLabel: 'Upload Archive',
    },
  ])(
    'does not throw when $label is clicked without callback',
    ({ label, actionKey, actionLabel }) => {
      const { result } = renderHook(() =>
        useNewActions({
          newActionLabels: { [label]: actionLabel },
        }),
      );

      expect(() => {
        result.current.newActions[0].onClick?.({
          key: actionKey,
          domEvent: mockMouseEvent,
        });
      }).not.toThrow();
    },
  );

  it('creates all actions when all labels are provided', () => {
    const { result } = renderHook(() =>
      useNewActions({
        newActionLabels: {
          newFolder: 'New Folder',
          uploadFiles: 'Upload Files',
          uploadArchive: 'Upload Archive',
        },
      }),
    );

    expect(result.current.newActions).toHaveLength(3);
    expect(result.current.isNewButtonVisible).toBe(true);
  });

  it('maintains correct order: newFolder, uploadFiles, uploadArchive', () => {
    const { result } = renderHook(() =>
      useNewActions({
        newActionLabels: {
          uploadArchive: 'Upload Archive',
          newFolder: 'New Folder',
          uploadFiles: 'Upload Files',
        },
      }),
    );

    expect(result.current.newActions[0].key).toBe('new-folder');
    expect(result.current.newActions[1].key).toBe('upload-file');
    expect(result.current.newActions[2].key).toBe('upload-archive');
  });

  it('calls correct callbacks when actions are clicked', () => {
    const onCreateFolder = vi.fn();
    const onUploadFiles = vi.fn();
    const onUploadArchive = vi.fn();

    const { result } = renderHook(() =>
      useNewActions({
        newActionLabels: {
          newFolder: 'New Folder',
          uploadFiles: 'Upload Files',
          uploadArchive: 'Upload Archive',
        },
        onCreateFolder,
        onUploadFiles,
        onUploadArchive,
      }),
    );

    result.current.newActions[0].onClick?.({
      key: 'new-folder',
      domEvent: mockMouseEvent,
    });
    result.current.newActions[1].onClick?.({
      key: 'upload-file',
      domEvent: mockMouseEvent,
    });
    result.current.newActions[2].onClick?.({
      key: 'upload-archive',
      domEvent: mockMouseEvent,
    });

    expect(onCreateFolder).toHaveBeenCalledTimes(1);
    expect(onUploadFiles).toHaveBeenCalledTimes(1);
    expect(onUploadArchive).toHaveBeenCalledTimes(1);
  });

  it.each([
    {
      description: 'newFolder and uploadFiles',
      labels: { newFolder: 'New Folder', uploadFiles: 'Upload Files' },
      expectedKeys: ['new-folder', 'upload-file'],
    },
    {
      description: 'uploadFiles and uploadArchive',
      labels: { uploadFiles: 'Upload Files', uploadArchive: 'Upload Archive' },
      expectedKeys: ['upload-file', 'upload-archive'],
    },
    {
      description: 'only newFolder',
      labels: { newFolder: 'New Folder' },
      expectedKeys: ['new-folder'],
    },
  ])('creates only $description actions', ({ labels, expectedKeys }) => {
    const { result } = renderHook(() =>
      useNewActions({
        newActionLabels: labels,
      }),
    );

    expect(result.current.newActions).toHaveLength(expectedKeys.length);
    expectedKeys.forEach((key, index) => {
      expect(result.current.newActions[index].key).toBe(key);
    });
    expect(result.current.isNewButtonVisible).toBe(true);
  });

  it.each([
    { label: 'newFolder', actionLabel: 'New Folder' },
    { label: 'uploadFiles', actionLabel: 'Upload Files' },
    { label: 'uploadArchive', actionLabel: 'Upload Archive' },
  ])('includes icon for $label action', ({ label, actionLabel }) => {
    const { result } = renderHook(() =>
      useNewActions({
        newActionLabels: { [label]: actionLabel },
      }),
    );

    expect(result.current.newActions[0].icon).toBeDefined();
  });

  it('memoizes newActions array when dependencies do not change', () => {
    const props = {
      newActionLabels: { newFolder: 'New Folder' },
      onCreateFolder: vi.fn(),
    };

    const { result, rerender } = renderHook(() => useNewActions(props));

    const firstActions = result.current.newActions;

    rerender();

    expect(result.current.newActions).toBe(firstActions);
  });

  it('returns new reference when labels change', () => {
    const { result, rerender } = renderHook((props) => useNewActions(props), {
      initialProps: {
        newActionLabels: { newFolder: 'New Folder' },
      },
    });

    const firstResult = result.current;

    rerender({
      newActionLabels: { newFolder: 'Create Folder' },
    });

    expect(result.current.newActions).not.toBe(firstResult.newActions);
    expect(result.current.newActions[0].label).toBe('Create Folder');
  });

  it('isNewButtonVisible is false when no actions', () => {
    const { result } = renderHook(() => useNewActions({}));

    expect(result.current.isNewButtonVisible).toBe(false);
  });

  it('isNewButtonVisible is true when at least one action exists', () => {
    const { result } = renderHook(() =>
      useNewActions({
        newActionLabels: { newFolder: 'New Folder' },
      }),
    );

    expect(result.current.isNewButtonVisible).toBe(true);
  });
});
