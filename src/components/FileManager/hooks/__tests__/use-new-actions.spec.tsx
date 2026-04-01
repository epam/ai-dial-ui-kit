import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useNewActions } from '@/components/FileManager/hooks/use-new-actions';
import type { MouseEvent } from 'react';
import { DialFilePermission, type DialFile } from '@/models/file';

describe('Dial UI Kit :: FileManager :: useNewActions', () => {
  const mockMouseEvent = {} as MouseEvent<Element, globalThis.MouseEvent>;
  const requiredCreate = { onCreateNewItem: vi.fn() };

  it('returns empty actions when no labels provided', () => {
    const { result } = renderHook(() =>
      useNewActions({
        ...requiredCreate,
      }),
    );

    expect(result.current.newActions).toEqual([]);
    expect(result.current.isNewButtonVisible).toBe(false);
  });

  it('returns empty actions when labels object is undefined', () => {
    const { result } = renderHook(() =>
      useNewActions({
        ...requiredCreate,
        newActions: undefined,
      }),
    );

    expect(result.current.newActions).toEqual([]);
    expect(result.current.isNewButtonVisible).toBe(false);
  });

  it.each([
    {
      label: 'newFolder',
      actionKey: 'new-folder',
      actionConfig: { label: 'New Folder' },
      callbackName: 'onCreateFolder' as const,
    },
    {
      label: 'uploadFiles',
      actionKey: 'upload-file',
      actionConfig: { label: 'Upload Files' },
      callbackName: 'onUploadFiles' as const,
    },
    {
      label: 'uploadArchive',
      actionKey: 'upload-archive',
      actionConfig: { label: 'Upload Archive' },
      callbackName: 'onUploadArchive' as const,
    },
  ])(
    'creates $label action when label is provided',
    ({ actionKey, actionConfig, label }) => {
      const { result } = renderHook(() =>
        useNewActions({
          ...requiredCreate,
          newActions: { [label]: actionConfig },
        }),
      );

      expect(result.current.newActions).toHaveLength(1);
      expect(result.current.newActions[0]).toMatchObject({
        key: actionKey,
        label: actionConfig.label,
      });
      expect(result.current.isNewButtonVisible).toBe(true);
    },
  );

  it.each([
    {
      label: 'newFolder',
      actionKey: 'new-folder',
      actionConfig: { label: 'New Folder' },
      callbackName: 'onCreateFolder' as const,
    },
    {
      label: 'uploadFiles',
      actionKey: 'upload-file',
      actionConfig: { label: 'Upload Files' },
      callbackName: 'onUploadFiles' as const,
    },
    {
      label: 'uploadArchive',
      actionKey: 'upload-archive',
      actionConfig: { label: 'Upload Archive' },
      callbackName: 'onUploadArchive' as const,
    },
  ])(
    'calls $callbackName when $label action is clicked',
    ({ label, actionKey, actionConfig, callbackName }) => {
      const callback = vi.fn();
      const { result } = renderHook(() =>
        useNewActions({
          ...requiredCreate,
          newActions: { [label]: actionConfig },
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
    {
      label: 'newFolder',
      actionKey: 'new-folder',
      actionConfig: { label: 'New Folder' },
    },
    {
      label: 'uploadFiles',
      actionKey: 'upload-file',
      actionConfig: { label: 'Upload Files' },
    },
    {
      label: 'uploadArchive',
      actionKey: 'upload-archive',
      actionConfig: { label: 'Upload Archive' },
    },
  ])(
    'does not throw when $label is clicked without callback',
    ({ label, actionKey, actionConfig }) => {
      const { result } = renderHook(() =>
        useNewActions({
          ...requiredCreate,
          newActions: { [label]: actionConfig },
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
        ...requiredCreate,
        newActions: {
          newFolder: { label: 'New Folder' },
          uploadFiles: { label: 'Upload Files' },
          uploadArchive: { label: 'Upload Archive' },
        },
      }),
    );

    expect(result.current.newActions).toHaveLength(3);
    expect(result.current.isNewButtonVisible).toBe(true);
  });

  it('maintains correct order: newFolder, uploadFiles, uploadArchive', () => {
    const { result } = renderHook(() =>
      useNewActions({
        ...requiredCreate,
        newActions: {
          uploadArchive: { label: 'Upload Archive' },
          newFolder: { label: 'New Folder' },
          uploadFiles: { label: 'Upload Files' },
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
        ...requiredCreate,
        newActions: {
          newFolder: { label: 'New Folder' },
          uploadFiles: { label: 'Upload Files' },
          uploadArchive: { label: 'Upload Archive' },
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
      actions: {
        newFolder: { label: 'New Folder' },
        uploadFiles: { label: 'Upload Files' },
      },
      expectedKeys: ['new-folder', 'upload-file'],
    },
    {
      description: 'uploadFiles and uploadArchive',
      actions: {
        uploadFiles: { label: 'Upload Files' },
        uploadArchive: { label: 'Upload Archive' },
      },
      expectedKeys: ['upload-file', 'upload-archive'],
    },
    {
      description: 'only newFolder',
      actions: { newFolder: { label: 'New Folder' } },
      expectedKeys: ['new-folder'],
    },
  ])('creates only $description actions', ({ actions, expectedKeys }) => {
    const { result } = renderHook(() =>
      useNewActions({
        ...requiredCreate,
        newActions: actions,
      }),
    );

    expect(result.current.newActions).toHaveLength(expectedKeys.length);
    expectedKeys.forEach((key, index) => {
      expect(result.current.newActions[index].key).toBe(key);
    });
    expect(result.current.isNewButtonVisible).toBe(true);
  });

  it.each([
    { label: 'newFolder', action: { label: 'New Folder' } },
    { label: 'uploadFiles', action: { label: 'Upload Files' } },
    { label: 'uploadArchive', action: { label: 'Upload Archive' } },
  ])('includes icon for $label action', ({ label, action }) => {
    const { result } = renderHook(() =>
      useNewActions({
        ...requiredCreate,
        newActions: { [label]: action },
      }),
    );

    expect(result.current.newActions[0].icon).toBeDefined();
  });

  it('returns new reference when labels change', () => {
    const { result, rerender } = renderHook((props) => useNewActions(props), {
      initialProps: {
        ...requiredCreate,
        newActions: { newFolder: { label: 'New Folder' } },
      },
    });

    const firstResult = result.current;

    rerender({
      ...requiredCreate,
      newActions: { newFolder: { label: 'New Folder' } },
    });

    expect(result.current.newActions).not.toBe(firstResult.newActions);
    expect(result.current.newActions[0].label).toBe('New Folder');
  });

  it('isNewButtonVisible is false when no actions', () => {
    const { result } = renderHook(() =>
      useNewActions({
        ...requiredCreate,
      }),
    );

    expect(result.current.isNewButtonVisible).toBe(false);
  });

  it('isNewButtonVisible is true when at least one action exists', () => {
    const { result } = renderHook(() =>
      useNewActions({
        ...requiredCreate,
        newActions: { newFolder: { label: 'New Folder' } },
      }),
    );

    expect(result.current.isNewButtonVisible).toBe(true);
  });

  it('isNewButtonDisabled is true when currentFolder is undefined', () => {
    const { result } = renderHook(() =>
      useNewActions({
        ...requiredCreate,
        newActions: { newFolder: { label: 'New Folder' } },
        currentFolder: undefined,
      }),
    );

    expect(result.current.isNewButtonDisabled).toBe(true);
  });

  it('isNewButtonDisabled is true when currentFolder.permissions is undefined', () => {
    const folder = { id: '1' } as DialFile;

    const { result } = renderHook(() =>
      useNewActions({
        ...requiredCreate,
        newActions: { newFolder: { label: 'New Folder' } },
        currentFolder: folder,
      }),
    );

    expect(result.current.isNewButtonDisabled).toBe(true);
  });

  it('isNewButtonDisabled is true when currentFolder does not include WRITE permission', () => {
    const folder = {
      id: '1',
      permissions: [DialFilePermission.READ],
    } as DialFile;

    const { result } = renderHook(() =>
      useNewActions({
        ...requiredCreate,
        newActions: { newFolder: { label: 'New Folder' } },
        currentFolder: folder,
      }),
    );

    expect(result.current.isNewButtonDisabled).toBe(true);
  });

  it('isNewButtonDisabled is false when currentFolder includes WRITE permission', () => {
    const folder = {
      id: '1',
      permissions: [DialFilePermission.READ, DialFilePermission.WRITE],
    } as DialFile;

    const { result } = renderHook(() =>
      useNewActions({
        ...requiredCreate,
        newActions: { newFolder: { label: 'New Folder' } },
        currentFolder: folder,
      }),
    );

    expect(result.current.isNewButtonDisabled).toBe(false);
  });

  it('isNewButtonDisabled respects external override when true', () => {
    const folder = {
      id: '1',
      permissions: [DialFilePermission.WRITE],
    } as DialFile;

    const { result } = renderHook(() =>
      useNewActions({
        ...requiredCreate,
        newActions: { newFolder: { label: 'New Folder' } },
        currentFolder: folder,
        isNewButtonDisabled: true,
      }),
    );

    expect(result.current.isNewButtonDisabled).toBe(true);
  });

  it('isNewButtonDisabled remains false when external override is false and permissions allow', () => {
    const folder = {
      id: '1',
      permissions: [DialFilePermission.WRITE],
    } as DialFile;

    const { result } = renderHook(() =>
      useNewActions({
        ...requiredCreate,
        newActions: { newFolder: { label: 'New Folder' } },
        currentFolder: folder,
        isNewButtonDisabled: false,
      }),
    );

    expect(result.current.isNewButtonDisabled).toBe(false);
  });

  it('isNewButtonDisabled does not depend on newActions (still true with WRITE missing, even if actions exist)', () => {
    const folder = {
      id: '1',
      permissions: [DialFilePermission.READ],
    } as DialFile;

    const { result } = renderHook(() =>
      useNewActions({
        ...requiredCreate,
        newActions: {
          newFolder: { label: 'New Folder' },
          uploadFiles: { label: 'Upload Files' },
          uploadArchive: { label: 'Upload Archive' },
        },
        currentFolder: folder,
      }),
    );

    expect(result.current.isNewButtonVisible).toBe(true);
    expect(result.current.isNewButtonDisabled).toBe(true);
  });

  it('isNewButtonDisabled is true even when there are no actions (disabled state is permission-based)', () => {
    const folder = {
      id: '1',
      permissions: [DialFilePermission.WRITE],
    } as DialFile;

    const { result } = renderHook(() =>
      useNewActions({
        ...requiredCreate,
        newActions: undefined,
        currentFolder: folder,
      }),
    );

    expect(result.current.isNewButtonVisible).toBe(false);
    expect(result.current.isNewButtonDisabled).toBe(false);
  });
});
