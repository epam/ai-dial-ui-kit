import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFileUpload } from '@/components/FileManager/hooks/use-file-upload';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import type { DragEvent } from 'react';

describe('Dial UI Kit :: FileManager :: useFileUpload', () => {
  // Create a mock File with the specified size without consuming memory
  const createMockFile = (name: string, size: number): File => {
    const file = new File([''], name, { type: 'text/plain' });

    Object.defineProperty(file, 'size', {
      value: size,
      writable: false,
      configurable: true,
    });

    return file;
  };

  const mockExistingFiles: DialFile[] = [
    {
      id: '1',
      name: 'existing.txt',
      path: '/folder/existing.txt',
      nodeType: DialFileNodeType.ITEM,
      folderId: 'folder',
    },
    {
      id: '2',
      name: 'document.pdf',
      path: '/folder/document.pdf',
      nodeType: DialFileNodeType.ITEM,
      folderId: 'folder',
    },
  ];

  beforeEach(() => {
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useFileUpload());

    expect(result.current.isDragging).toBe(false);
    expect(result.current.isDraggingOverWindow).toBe(false);
    expect(result.current.uploadError).toBeUndefined();
    expect(typeof result.current.handleDragEnter).toBe('function');
    expect(typeof result.current.handleDragLeave).toBe('function');
    expect(typeof result.current.handleDragOver).toBe('function');
    expect(typeof result.current.handleDrop).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });

  it('sets up window event listeners on mount', () => {
    renderHook(() => useFileUpload());

    expect(window.addEventListener).toHaveBeenCalledWith(
      'dragenter',
      expect.any(Function),
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      'dragleave',
      expect.any(Function),
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      'drop',
      expect.any(Function),
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      'dragover',
      expect.any(Function),
    );
  });

  it('removes window event listeners on unmount', () => {
    const { unmount } = renderHook(() => useFileUpload());

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'dragenter',
      expect.any(Function),
    );
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'dragleave',
      expect.any(Function),
    );
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'drop',
      expect.any(Function),
    );
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'dragover',
      expect.any(Function),
    );
  });

  describe('handleDragEnter', () => {
    it('sets isDragging to true when dragging files', () => {
      const { result } = renderHook(() => useFileUpload());

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
        },
      } as unknown as DragEvent;

      act(() => {
        result.current.handleDragEnter(mockEvent);
      });

      expect(result.current.isDragging).toBe(true);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('does not set isDragging when not dragging files', () => {
      const { result } = renderHook(() => useFileUpload());

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['text/plain'],
        },
      } as unknown as DragEvent;

      act(() => {
        result.current.handleDragEnter(mockEvent);
      });

      expect(result.current.isDragging).toBe(false);
    });
  });

  describe('handleDragLeave', () => {
    it('sets isDragging to false when leaving drop zone', () => {
      const { result } = renderHook(() => useFileUpload());

      const enterEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
        },
      } as unknown as DragEvent;

      act(() => {
        result.current.handleDragEnter(enterEvent);
      });

      expect(result.current.isDragging).toBe(true);

      const leaveEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        currentTarget: {
          getBoundingClientRect: () => ({
            left: 0,
            right: 100,
            top: 0,
            bottom: 100,
          }),
        },
        clientX: -10,
        clientY: 50,
      } as unknown as DragEvent;

      act(() => {
        result.current.handleDragLeave(leaveEvent);
      });

      expect(result.current.isDragging).toBe(false);
    });

    it('does not set isDragging to false when still inside drop zone', () => {
      const { result } = renderHook(() => useFileUpload());

      const enterEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
        },
      } as unknown as DragEvent;

      act(() => {
        result.current.handleDragEnter(enterEvent);
      });

      const leaveEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        currentTarget: {
          getBoundingClientRect: () => ({
            left: 0,
            right: 100,
            top: 0,
            bottom: 100,
          }),
        },
        clientX: 50,
        clientY: 50,
      } as unknown as DragEvent;

      act(() => {
        result.current.handleDragLeave(leaveEvent);
      });

      expect(result.current.isDragging).toBe(true);
    });
  });

  describe('handleDragOver', () => {
    it('prevents default and sets dropEffect to copy', () => {
      const { result } = renderHook(() => useFileUpload());

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          dropEffect: '',
        },
      } as unknown as DragEvent;

      act(() => {
        result.current.handleDragOver(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(mockEvent.dataTransfer.dropEffect).toBe('copy');
    });
  });

  describe('handleDrop', () => {
    it('calls onUploadFiles with valid files', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderHook(() => useFileUpload({ onUploadFiles }));

      const files = [
        createMockFile('file1.txt', 1024),
        createMockFile('file2.txt', 2048),
      ];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      expect(result.current.isDragging).toBe(false);
      expect(onUploadFiles).toHaveBeenCalledWith(
        [
          { fileContent: files[0], name: 'file1.txt' },
          { fileContent: files[1], name: 'file2.txt' },
        ],
        '/folder',
      );
    });

    it('does not call onUploadFiles when not dragging files', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderHook(() => useFileUpload({ onUploadFiles }));

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['text/plain'],
          files: [],
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      expect(onUploadFiles).not.toHaveBeenCalled();
    });

    it('does not call onUploadFiles when no files', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderHook(() => useFileUpload({ onUploadFiles }));

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files: [],
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      expect(onUploadFiles).not.toHaveBeenCalled();
    });
  });

  describe('duplicate file validation', () => {
    it('shows error when uploading duplicate files', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderHook(() => useFileUpload({ onUploadFiles }));

      const files = [createMockFile('existing.txt', 1024)];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(
          mockEvent,
          '/folder',
          mockExistingFiles,
        );
      });

      expect(result.current.uploadError).toBeDefined();
      expect(result.current.uploadError).toContain('already exist');
      expect(result.current.uploadError).toContain('existing.txt');
      expect(onUploadFiles).not.toHaveBeenCalled();
    });

    it('uses custom duplicate error message', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderHook(() =>
        useFileUpload({
          onUploadFiles,
          validationMessages: {
            duplicateFiles: 'Custom: Files already exist',
          },
        }),
      );

      const files = [createMockFile('existing.txt', 1024)];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(
          mockEvent,
          '/folder',
          mockExistingFiles,
        );
      });

      expect(result.current.uploadError).toBe('Custom: Files already exist');
    });

    it('allows uploading files with different names', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderHook(() => useFileUpload({ onUploadFiles }));

      const files = [createMockFile('newfile.txt', 1024)];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(
          mockEvent,
          '/folder',
          mockExistingFiles,
        );
      });

      expect(result.current.uploadError).toBeUndefined();
      expect(onUploadFiles).toHaveBeenCalled();
    });
  });

  describe('file size validation', () => {
    it('shows error when file exceeds max size', async () => {
      const onUploadFiles = vi.fn();
      const maxFileSize = 1024; // 1KB
      const { result } = renderHook(() =>
        useFileUpload({ onUploadFiles, maxFileSize }),
      );

      const files = [createMockFile('large.txt', 2048)];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      expect(result.current.uploadError).toBeDefined();
      expect(result.current.uploadError).toContain('exceed maximum size');
      expect(onUploadFiles).not.toHaveBeenCalled();
    });

    it('uses custom oversized error message', async () => {
      const onUploadFiles = vi.fn();
      const maxFileSize = 1024;
      const { result } = renderHook(() =>
        useFileUpload({
          onUploadFiles,
          maxFileSize,
          validationMessages: {
            oversizedFiles: 'Custom: Files too large',
          },
        }),
      );

      const files = [createMockFile('large.txt', 2048)];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      expect(result.current.uploadError).toBe('Custom: Files too large');
    });

    it('allows uploading files within size limit', async () => {
      const onUploadFiles = vi.fn();
      const maxFileSize = 2048;
      const { result } = renderHook(() =>
        useFileUpload({ onUploadFiles, maxFileSize }),
      );

      const files = [createMockFile('small.txt', 1024)];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      expect(result.current.uploadError).toBeUndefined();
      expect(onUploadFiles).toHaveBeenCalled();
    });

    it('skips size validation when maxFileSize is not set', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderHook(() => useFileUpload({ onUploadFiles }));

      const files = [createMockFile('large.txt', 999999)];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      expect(result.current.uploadError).toBeUndefined();
      expect(onUploadFiles).toHaveBeenCalled();
    });
  });

  describe('custom validation', () => {
    it('uses default validation failed message when custom message not provided', async () => {
      const onUploadFiles = vi.fn();
      const onValidateUpload = vi.fn().mockResolvedValue({
        valid: false,
      });

      const { result } = renderHook(() =>
        useFileUpload({ onUploadFiles, onValidateUpload }),
      );

      const files = [createMockFile('test.txt', 1024)];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      await waitFor(() => {
        expect(result.current.uploadError).toBe('Validation failed');
      });
    });

    it('handles validation errors', async () => {
      const onUploadFiles = vi.fn();
      const onValidateUpload = vi.fn().mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() =>
        useFileUpload({ onUploadFiles, onValidateUpload }),
      );

      const files = [createMockFile('test.txt', 1024)];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      await waitFor(() => {
        expect(result.current.uploadError).toBe('Validation error occurred');
        expect(onUploadFiles).not.toHaveBeenCalled();
      });
    });

    it('uses custom validation error message', async () => {
      const onUploadFiles = vi.fn();
      const onValidateUpload = vi.fn().mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() =>
        useFileUpload({
          onUploadFiles,
          onValidateUpload,
          validationMessages: {
            validationError: 'Custom: Validation error',
          },
        }),
      );

      const files = [createMockFile('test.txt', 1024)];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      await waitFor(() => {
        expect(result.current.uploadError).toBe('Custom: Validation error');
      });
    });

    it('proceeds with upload when validation passes', async () => {
      const onUploadFiles = vi.fn();
      const onValidateUpload = vi.fn().mockResolvedValue({
        valid: true,
      });

      const { result } = renderHook(() =>
        useFileUpload({ onUploadFiles, onValidateUpload }),
      );

      const files = [createMockFile('test.txt', 1024)];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      await waitFor(() => {
        expect(result.current.uploadError).toBeUndefined();
        expect(onUploadFiles).toHaveBeenCalled();
      });
    });
  });

  describe('clearError', () => {
    it('clears upload error', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderHook(() => useFileUpload({ onUploadFiles }));

      const files = [createMockFile('existing.txt', 1024)];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(
          mockEvent,
          '/folder',
          mockExistingFiles,
        );
      });

      expect(result.current.uploadError).toBeDefined();

      act(() => {
        result.current.clearError();
      });

      expect(result.current.uploadError).toBeUndefined();
    });
  });

  describe('validation order', () => {
    it('checks duplicates before size', async () => {
      const onUploadFiles = vi.fn();
      const maxFileSize = 1024;
      const { result } = renderHook(() =>
        useFileUpload({ onUploadFiles, maxFileSize }),
      );

      const files = [createMockFile('existing.txt', 2048)];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(
          mockEvent,
          '/folder',
          mockExistingFiles,
        );
      });

      expect(result.current.uploadError).toContain('already exist');
      expect(onUploadFiles).not.toHaveBeenCalled();
    });

    it('checks size before custom validation', async () => {
      const onUploadFiles = vi.fn();
      const onValidateUpload = vi.fn().mockResolvedValue({
        valid: false,
        message: 'Custom error',
      });
      const maxFileSize = 1024;

      const { result } = renderHook(() =>
        useFileUpload({ onUploadFiles, onValidateUpload, maxFileSize }),
      );

      const files = [createMockFile('large.txt', 2048)];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      await waitFor(() => {
        // Should show size error, not call custom validation
        expect(result.current.uploadError).toContain('exceed maximum size');
        expect(onValidateUpload).not.toHaveBeenCalled();
        expect(onUploadFiles).not.toHaveBeenCalled();
      });
    });
  });

  describe('multiple files handling', () => {
    it('validates all files and shows all duplicate names', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderHook(() => useFileUpload({ onUploadFiles }));

      const files = [
        createMockFile('existing.txt', 1024),
        createMockFile('document.pdf', 1024),
        createMockFile('newfile.txt', 1024),
      ];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(
          mockEvent,
          '/folder',
          mockExistingFiles,
        );
      });

      expect(result.current.uploadError).toContain('existing.txt');
      expect(result.current.uploadError).toContain('document.pdf');
      expect(onUploadFiles).not.toHaveBeenCalled();
    });

    it('validates all files and shows all oversized names', async () => {
      const onUploadFiles = vi.fn();
      const maxFileSize = 1024;
      const { result } = renderHook(() =>
        useFileUpload({ onUploadFiles, maxFileSize }),
      );

      const files = [
        createMockFile('large1.txt', 2048),
        createMockFile('large2.txt', 3072),
        createMockFile('small.txt', 512),
      ];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      await waitFor(() => {
        expect(result.current.uploadError).toBeDefined();
        expect(result.current.uploadError).toContain('large1.txt');
        expect(result.current.uploadError).toContain('large2.txt');
        expect(onUploadFiles).not.toHaveBeenCalled();
      });
    });
  });
});
