import { renderHook, act } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { useTriggerViewCreateFolder } from '@/components/FileManager/hooks/use-trigger-view-create-folder';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import { FileManagerCreateFolderTriggerView } from '@/types/file-manager';

const mockFile: DialFile = {
  id: '/test-file',
  name: 'Test File',
  path: '/test-file',
  parentPath: '/',
  nodeType: DialFileNodeType.FOLDER,
  folderId: '/test-file',
};

const mockFiles = [mockFile];

describe('Dial UI Kit :: useTriggerViewCreateFolder', () => {
  let onGridAddSibling: ReturnType<typeof vi.fn>;
  let onGridAddChild: ReturnType<typeof vi.fn>;
  let onTreeAddSibling: ReturnType<typeof vi.fn>;
  let onTreeAddChild: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onGridAddSibling = vi.fn();
    onGridAddChild = vi.fn();
    onTreeAddSibling = vi.fn();
    onTreeAddChild = vi.fn();
  });

  describe('initial state', () => {
    test('returns default trigger view as Grid', () => {
      const { result } = renderHook(() =>
        useTriggerViewCreateFolder({
          onGridAddSibling,
          onGridAddChild,
          onTreeAddSibling,
          onTreeAddChild,
        }),
      );

      expect(result.current.createFolderTriggerView).toBe(
        FileManagerCreateFolderTriggerView.Grid,
      );
    });
  });

  describe('onGridCreateSiblingFolder', () => {
    test('calls onGridAddSibling with provided files', () => {
      const { result } = renderHook(() =>
        useTriggerViewCreateFolder({
          onGridAddSibling,
          onGridAddChild,
          onTreeAddSibling,
          onTreeAddChild,
        }),
      );

      act(() => {
        result.current.onGridCreateSiblingFolder(mockFiles);
      });

      expect(onGridAddSibling).toHaveBeenCalledWith(mockFiles);
      expect(onGridAddSibling).toHaveBeenCalledTimes(1);
    });

    test('sets createFolderTriggerView to Grid', () => {
      const { result } = renderHook(() =>
        useTriggerViewCreateFolder({
          onGridAddSibling,
          onGridAddChild,
          onTreeAddSibling,
          onTreeAddChild,
        }),
      );

      act(() => {
        result.current.onGridCreateSiblingFolder(mockFiles);
      });

      expect(result.current.createFolderTriggerView).toBe(
        FileManagerCreateFolderTriggerView.Grid,
      );
    });

    test('does not call other callbacks', () => {
      const { result } = renderHook(() =>
        useTriggerViewCreateFolder({
          onGridAddSibling,
          onGridAddChild,
          onTreeAddSibling,
          onTreeAddChild,
        }),
      );

      act(() => {
        result.current.onGridCreateSiblingFolder(mockFiles);
      });

      expect(onGridAddChild).not.toHaveBeenCalled();
      expect(onTreeAddSibling).not.toHaveBeenCalled();
      expect(onTreeAddChild).not.toHaveBeenCalled();
    });
  });

  describe('onTreeCreateSiblingFolder', () => {
    test('calls onTreeAddSibling with provided files', () => {
      const { result } = renderHook(() =>
        useTriggerViewCreateFolder({
          onGridAddSibling,
          onGridAddChild,
          onTreeAddSibling,
          onTreeAddChild,
        }),
      );

      act(() => {
        result.current.onTreeCreateSiblingFolder(mockFiles);
      });

      expect(onTreeAddSibling).toHaveBeenCalledWith(mockFiles);
      expect(onTreeAddSibling).toHaveBeenCalledTimes(1);
    });

    test('sets createFolderTriggerView to Tree', () => {
      const { result } = renderHook(() =>
        useTriggerViewCreateFolder({
          onGridAddSibling,
          onGridAddChild,
          onTreeAddSibling,
          onTreeAddChild,
        }),
      );

      act(() => {
        result.current.onTreeCreateSiblingFolder(mockFiles);
      });

      expect(result.current.createFolderTriggerView).toBe(
        FileManagerCreateFolderTriggerView.Tree,
      );
    });

    test('does not call other callbacks', () => {
      const { result } = renderHook(() =>
        useTriggerViewCreateFolder({
          onGridAddSibling,
          onGridAddChild,
          onTreeAddSibling,
          onTreeAddChild,
        }),
      );

      act(() => {
        result.current.onTreeCreateSiblingFolder(mockFiles);
      });

      expect(onGridAddSibling).not.toHaveBeenCalled();
      expect(onGridAddChild).not.toHaveBeenCalled();
      expect(onTreeAddChild).not.toHaveBeenCalled();
    });
  });

  describe('onGridCreateChildFolder', () => {
    test('calls onGridAddChild with provided files', () => {
      const { result } = renderHook(() =>
        useTriggerViewCreateFolder({
          onGridAddSibling,
          onGridAddChild,
          onTreeAddSibling,
          onTreeAddChild,
        }),
      );

      act(() => {
        result.current.onGridCreateChildFolder(mockFiles);
      });

      expect(onGridAddChild).toHaveBeenCalledWith(mockFiles);
      expect(onGridAddChild).toHaveBeenCalledTimes(1);
    });

    test('sets createFolderTriggerView to Grid', () => {
      const { result } = renderHook(() =>
        useTriggerViewCreateFolder({
          onGridAddSibling,
          onGridAddChild,
          onTreeAddSibling,
          onTreeAddChild,
        }),
      );

      act(() => {
        result.current.onGridCreateChildFolder(mockFiles);
      });

      expect(result.current.createFolderTriggerView).toBe(
        FileManagerCreateFolderTriggerView.Grid,
      );
    });

    test('does not call other callbacks', () => {
      const { result } = renderHook(() =>
        useTriggerViewCreateFolder({
          onGridAddSibling,
          onGridAddChild,
          onTreeAddSibling,
          onTreeAddChild,
        }),
      );

      act(() => {
        result.current.onGridCreateChildFolder(mockFiles);
      });

      expect(onGridAddSibling).not.toHaveBeenCalled();
      expect(onTreeAddSibling).not.toHaveBeenCalled();
      expect(onTreeAddChild).not.toHaveBeenCalled();
    });
  });

  describe('onTreeCreateChildFolder', () => {
    test('calls onTreeAddChild with provided files', () => {
      const { result } = renderHook(() =>
        useTriggerViewCreateFolder({
          onGridAddSibling,
          onGridAddChild,
          onTreeAddSibling,
          onTreeAddChild,
        }),
      );

      act(() => {
        result.current.onTreeCreateChildFolder(mockFiles);
      });

      expect(onTreeAddChild).toHaveBeenCalledWith(mockFiles);
      expect(onTreeAddChild).toHaveBeenCalledTimes(1);
    });

    test('sets createFolderTriggerView to Tree', () => {
      const { result } = renderHook(() =>
        useTriggerViewCreateFolder({
          onGridAddSibling,
          onGridAddChild,
          onTreeAddSibling,
          onTreeAddChild,
        }),
      );

      act(() => {
        result.current.onTreeCreateChildFolder(mockFiles);
      });

      expect(result.current.createFolderTriggerView).toBe(
        FileManagerCreateFolderTriggerView.Tree,
      );
    });

    test('does not call other callbacks', () => {
      const { result } = renderHook(() =>
        useTriggerViewCreateFolder({
          onGridAddSibling,
          onGridAddChild,
          onTreeAddSibling,
          onTreeAddChild,
        }),
      );

      act(() => {
        result.current.onTreeCreateChildFolder(mockFiles);
      });

      expect(onGridAddSibling).not.toHaveBeenCalled();
      expect(onGridAddChild).not.toHaveBeenCalled();
      expect(onTreeAddSibling).not.toHaveBeenCalled();
    });
  });

  describe('state persistence', () => {
    test('maintains trigger view state across multiple calls', () => {
      const { result } = renderHook(() =>
        useTriggerViewCreateFolder({
          onGridAddSibling,
          onGridAddChild,
          onTreeAddSibling,
          onTreeAddChild,
        }),
      );

      // Initial state
      expect(result.current.createFolderTriggerView).toBe(
        FileManagerCreateFolderTriggerView.Grid,
      );

      // Call tree function
      act(() => {
        result.current.onTreeCreateSiblingFolder(mockFiles);
      });

      expect(result.current.createFolderTriggerView).toBe(
        FileManagerCreateFolderTriggerView.Tree,
      );

      // Call grid function
      act(() => {
        result.current.onGridCreateChildFolder(mockFiles);
      });

      expect(result.current.createFolderTriggerView).toBe(
        FileManagerCreateFolderTriggerView.Grid,
      );
    });
  });

  describe('callback handling', () => {
    test('handles undefined callbacks gracefully', () => {
      const { result } = renderHook(() => useTriggerViewCreateFolder({}));

      expect(() => {
        act(() => {
          result.current.onGridCreateSiblingFolder(mockFiles);
        });
      }).not.toThrow();

      expect(() => {
        act(() => {
          result.current.onTreeCreateSiblingFolder(mockFiles);
        });
      }).not.toThrow();

      expect(() => {
        act(() => {
          result.current.onGridCreateChildFolder(mockFiles);
        });
      }).not.toThrow();

      expect(() => {
        act(() => {
          result.current.onTreeCreateChildFolder(mockFiles);
        });
      }).not.toThrow();
    });
  });
});
