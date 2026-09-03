import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFileUpload } from '@/components/FileManager/hooks/use-file-upload';
import type { DialFileAcceptType } from '@/models/file-manager';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import { DialFilePermission } from '@/models/file';
import type { ChangeEvent, DragEvent } from 'react';

const writableFolder: DialFile = {
  id: 'folder',
  name: 'folder',
  path: '/folder',
  nodeType: DialFileNodeType.FOLDER,
  folderId: '',
  permissions: [DialFilePermission.WRITE],
};

const renderUseFileUpload = (
  options: Parameters<typeof useFileUpload>[0] = {},
) =>
  renderHook(() =>
    useFileUpload({ currentFolder: writableFolder, ...options }),
  );

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
    const { result } = renderUseFileUpload();

    expect(result.current.isDragging).toBe(false);
    expect(result.current.isDraggingOverWindow).toBe(false);
    expect(result.current.uploadError).toBeUndefined();
    expect(typeof result.current.handleDragEnter).toBe('function');
    expect(typeof result.current.handleDragLeave).toBe('function');
    expect(typeof result.current.handleDragOver).toBe('function');
    expect(typeof result.current.handleDrop).toBe('function');
    expect(typeof result.current.clearError).toBe('function');

    expect(result.current.uploadConflictingFiles).toEqual([]);
    expect(result.current.uploadConflictResolutionOpen).toBe(false);
    expect(typeof result.current.closeUploadConflictResolution).toBe(
      'function',
    );
    expect(typeof result.current.handleUploadConflictReplace).toBe('function');
    expect(typeof result.current.handleUploadConflictDuplicate).toBe(
      'function',
    );
    expect(typeof result.current.handleUploadConflictDecideForEach).toBe(
      'function',
    );
  });

  it('sets up window event listeners on mount', () => {
    renderUseFileUpload();

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
    const { unmount } = renderUseFileUpload();

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
      const { result } = renderUseFileUpload();

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
      const { result } = renderUseFileUpload();

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
      const { result } = renderUseFileUpload();

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
      const { result } = renderUseFileUpload();

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
      const { result } = renderUseFileUpload();

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
    it('calls onUploadFiles with valid files when no conflicts', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderUseFileUpload({ onUploadFiles });

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
      const { result } = renderUseFileUpload({ onUploadFiles });

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
      const { result } = renderUseFileUpload({ onUploadFiles });

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
    it('opens conflict resolution popup when uploading duplicate files', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderUseFileUpload({ onUploadFiles });

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

      await waitFor(() => {
        expect(result.current.uploadConflictResolutionOpen).toBe(true);
        expect(result.current.uploadConflictingFiles).toHaveLength(1);
        expect(result.current.uploadConflictingFiles[0]?.name).toBe(
          'existing.txt',
        );
        expect(onUploadFiles).not.toHaveBeenCalled();
      });
    });

    it('allows uploading files with different names', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderUseFileUpload({ onUploadFiles });

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
      expect(result.current.uploadConflictResolutionOpen).toBe(false);
      expect(onUploadFiles).toHaveBeenCalled();
    });

    it('handles conflict resolution - replace', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderUseFileUpload({ onUploadFiles });

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

      await waitFor(() => {
        expect(result.current.uploadConflictResolutionOpen).toBe(true);
      });

      act(() => {
        result.current.handleUploadConflictReplace();
      });

      await waitFor(() => {
        expect(onUploadFiles).toHaveBeenCalledWith(
          [{ fileContent: files[0], name: 'existing.txt' }],
          '/folder',
        );
        expect(result.current.uploadConflictResolutionOpen).toBe(false);
      });
    });

    it('handles conflict resolution - duplicate', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderUseFileUpload({ onUploadFiles });

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

      await waitFor(() => {
        expect(result.current.uploadConflictResolutionOpen).toBe(true);
      });

      act(() => {
        result.current.handleUploadConflictDuplicate();
      });

      await waitFor(() => {
        expect(onUploadFiles).toHaveBeenCalled();
        const callArgs = onUploadFiles.mock.calls[0];
        expect(callArgs[0][0].name).toMatch(/existing \(\d+\)\.txt/);
        expect(result.current.uploadConflictResolutionOpen).toBe(false);
      });
    });
  });

  describe('prepareUploadFileName', () => {
    it('applies the mapper to names passed to onUploadFiles when no conflict', async () => {
      const onUploadFiles = vi.fn();
      const prepareUploadFileName = vi.fn((name: string) =>
        name.replace(/:/g, ''),
      );
      const { result } = renderUseFileUpload({
        onUploadFiles,
        prepareUploadFileName,
      });

      const files = [createMockFile('inva:lid.txt', 1024)];

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

      expect(prepareUploadFileName).toHaveBeenCalledWith('inva:lid.txt');
      expect(onUploadFiles).toHaveBeenCalledWith(
        [{ fileContent: files[0], name: 'invalid.txt' }],
        '/folder',
      );
    });

    it('detects conflicts against the mapped name (rename before conflict check)', async () => {
      const onUploadFiles = vi.fn();
      // Maps "existing:.txt" -> "existing.txt" which collides with an existing file.
      const prepareUploadFileName = vi.fn((name: string) =>
        name.replace(/:/g, ''),
      );
      const { result } = renderUseFileUpload({
        onUploadFiles,
        prepareUploadFileName,
      });

      const files = [createMockFile('existing:.txt', 1024)];

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

      await waitFor(() => {
        expect(result.current.uploadConflictResolutionOpen).toBe(true);
        expect(result.current.uploadConflictingFiles[0]?.name).toBe(
          'existing.txt',
        );
        expect(onUploadFiles).not.toHaveBeenCalled();
      });
    });
  });

  describe('file size validation', () => {
    it('shows error when file exceeds max size', async () => {
      const onUploadFiles = vi.fn();
      const maxFileSize = 1024; // 1KB
      const { result } = renderUseFileUpload({
        onUploadFiles,
        maxFileSize,
      });

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
      const { result } = renderUseFileUpload({
        onUploadFiles,
        maxFileSize,
        validationMessages: {
          oversizedFiles: 'Custom: Files too large',
        },
      });

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
      const { result } = renderUseFileUpload({
        onUploadFiles,
        maxFileSize,
      });

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
      const { result } = renderUseFileUpload({ onUploadFiles });

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

      const { result } = renderUseFileUpload({
        onUploadFiles,
        onValidateUpload,
      });

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

      const { result } = renderUseFileUpload({
        onUploadFiles,
        onValidateUpload,
      });

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

      const { result } = renderUseFileUpload({
        onUploadFiles,
        onValidateUpload,
        validationMessages: {
          validationError: 'Custom: Validation error',
        },
      });

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

      const { result } = renderUseFileUpload({
        onUploadFiles,
        onValidateUpload,
      });

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
      const maxFileSize = 1024;
      const { result } = renderUseFileUpload({
        onUploadFiles,
        maxFileSize,
      });

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

      act(() => {
        result.current.clearError();
      });

      expect(result.current.uploadError).toBeUndefined();
    });
  });

  describe('validation order', () => {
    it('checks size before conflicts', async () => {
      const onUploadFiles = vi.fn();
      const maxFileSize = 1024;
      const { result } = renderUseFileUpload({
        onUploadFiles,
        maxFileSize,
      });

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

      expect(result.current.uploadError).toContain('exceed maximum size');
      expect(result.current.uploadConflictResolutionOpen).toBe(false);
      expect(onUploadFiles).not.toHaveBeenCalled();
    });

    it('checks size before custom validation', async () => {
      const onUploadFiles = vi.fn();
      const onValidateUpload = vi.fn().mockResolvedValue({
        valid: false,
        message: 'Custom error',
      });
      const maxFileSize = 1024;

      const { result } = renderUseFileUpload({
        onUploadFiles,
        onValidateUpload,
        maxFileSize,
      });

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
        expect(result.current.uploadError).toContain('exceed maximum size');
        expect(onValidateUpload).not.toHaveBeenCalled();
        expect(onUploadFiles).not.toHaveBeenCalled();
      });
    });
  });

  describe('multiple files handling', () => {
    it('opens conflict popup for multiple conflicting files', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderUseFileUpload({ onUploadFiles });

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

      await waitFor(() => {
        expect(result.current.uploadConflictResolutionOpen).toBe(true);
        expect(result.current.uploadConflictingFiles).toHaveLength(2);
        const conflictNames = result.current.uploadConflictingFiles.map(
          (f) => f.name,
        );
        expect(conflictNames).toContain('existing.txt');
        expect(conflictNames).toContain('document.pdf');
        expect(onUploadFiles).not.toHaveBeenCalled();
      });
    });

    it('validates all files and shows all oversized names', async () => {
      const onUploadFiles = vi.fn();
      const maxFileSize = 1024;
      const { result } = renderUseFileUpload({
        onUploadFiles,
        maxFileSize,
      });

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

  describe('openArchiveDialog', () => {
    it('calls onUploadArchive with selected archive when folder does not exist', () => {
      const onUploadArchive = vi.fn();

      const { result } = renderUseFileUpload({ onUploadArchive });

      act(() => {
        result.current.openArchiveDialog('/folder', mockExistingFiles);
      });

      const input = document.body.querySelector(
        'input[accept=".zip,application/zip"]',
      ) as HTMLInputElement | null;

      expect(input).not.toBeNull();
      if (!input) {
        return;
      }

      const file = createMockFile('archive.zip', 100);

      Object.defineProperty(input, 'files', {
        value: [file],
      });

      act(() => {
        input.dispatchEvent(new Event('change'));
      });

      expect(onUploadArchive).toHaveBeenCalledTimes(1);
      expect(onUploadArchive).toHaveBeenCalledWith(file, 'archive', '/folder');
      expect(document.body.contains(input)).toBe(false);
      expect(result.current.uploadError).toBeUndefined();
    });
  });

  describe('accept file types validation', () => {
    it('blocks upload when all files are not accepted', async () => {
      const onUploadFiles = vi.fn();

      const { result } = renderUseFileUpload({
        onUploadFiles,
        allowedFileTypes: ['application/pdf'],
      });

      const files = [new File([''], 'test.txt', { type: 'text/plain' })];

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

      expect(onUploadFiles).not.toHaveBeenCalled();
      expect(result.current.uploadError).toBe(
        'Selected files are not supported',
      );
    });

    it('uses custom unsupportedFiles validation message', async () => {
      const onUploadFiles = vi.fn();

      const { result } = renderUseFileUpload({
        onUploadFiles,
        allowedFileTypes: ['image/*'],
        validationMessages: {
          unsupportedFiles: 'Custom unsupported message',
        },
      });

      const files = [new File([''], 'doc.pdf', { type: 'application/pdf' })];

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

      expect(onUploadFiles).not.toHaveBeenCalled();
      expect(result.current.uploadError).toBe('Custom unsupported message');
    });

    it('allows upload when file matches accept MIME type', async () => {
      const onUploadFiles = vi.fn();

      const { result } = renderUseFileUpload({
        onUploadFiles,
        allowedFileTypes: ['text/plain'],
      });

      const file = new File([''], 'test.txt', { type: 'text/plain' });

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files: [file],
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      expect(result.current.uploadError).toBeUndefined();
      expect(onUploadFiles).toHaveBeenCalledWith(
        [{ fileContent: file, name: 'test.txt' }],
        '/folder',
      );
    });

    it('allows upload when file matches accept extension', async () => {
      const onUploadFiles = vi.fn();

      const { result } = renderUseFileUpload({
        onUploadFiles,
        allowedFileTypes: ['.pdf'],
      });

      const file = new File([''], 'doc.pdf', { type: '' });

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files: [file],
        },
      } as unknown as DragEvent;

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      expect(onUploadFiles).toHaveBeenCalled();
      expect(result.current.uploadError).toBeUndefined();
    });

    it('filters out unsupported files and uploads only accepted ones', async () => {
      const onUploadFiles = vi.fn();

      const { result } = renderUseFileUpload({
        onUploadFiles,
        allowedFileTypes: ['text/plain'],
      });

      const files = [
        new File([''], 'a.txt', { type: 'text/plain' }),
        new File([''], 'b.pdf', { type: 'application/pdf' }),
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

      expect(onUploadFiles).toHaveBeenCalledWith(
        [{ fileContent: files[0], name: 'a.txt' }],
        '/folder',
      );
      expect(result.current.uploadError).toBeUndefined();
    });

    it('does not filter files when accept contains */*', async () => {
      const onUploadFiles = vi.fn();

      const { result } = renderUseFileUpload({
        onUploadFiles,
        allowedFileTypes: ['*/*'],
      });

      const files = [
        new File([''], 'a.txt', { type: 'text/plain' }),
        new File([''], 'b.pdf', { type: 'application/pdf' }),
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

      expect(onUploadFiles).toHaveBeenCalledWith(
        [
          { fileContent: files[0], name: 'a.txt' },
          { fileContent: files[1], name: 'b.pdf' },
        ],
        '/folder',
      );
    });
  });

  describe('uploadEnabled', () => {
    beforeEach(() => {
      vi.mocked(window.addEventListener).mockClear?.();
      vi.mocked(window.removeEventListener).mockClear?.();
    });

    it('does not set up window event listeners when disabled', () => {
      renderUseFileUpload({ uploadEnabled: false });

      expect(window.addEventListener).not.toHaveBeenCalled();
    });

    it('does nothing in drag handlers when disabled', async () => {
      const onUploadFiles = vi.fn();
      const { result } = renderUseFileUpload({
        onUploadFiles,
        uploadEnabled: false,
      });

      const files = [createMockFile('file1.txt', 1024)];

      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          types: ['Files'],
          files,
          dropEffect: '',
        },
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
        result.current.handleDragEnter(mockEvent);
      });
      expect(result.current.isDragging).toBe(false);
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(mockEvent.stopPropagation).not.toHaveBeenCalled();

      act(() => {
        result.current.handleDragOver(mockEvent);
      });
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
      expect(mockEvent.dataTransfer.dropEffect).toBe('');

      act(() => {
        result.current.handleDragLeave(mockEvent);
      });
      expect(result.current.isDragging).toBe(false);

      await act(async () => {
        await result.current.handleDrop(mockEvent, '/folder', []);
      });

      expect(onUploadFiles).not.toHaveBeenCalled();
      expect(result.current.uploadError).toBeUndefined();
    });

    it('does not open file dialog when disabled', () => {
      const { result } = renderUseFileUpload({ uploadEnabled: false });

      const clickSpy = vi
        .spyOn(HTMLInputElement.prototype, 'click')
        .mockImplementation(() => undefined);

      act(() => {
        result.current.openFileDialog('/folder', mockExistingFiles);
      });

      expect(clickSpy).not.toHaveBeenCalled();
      clickSpy.mockRestore();
    });

    it('does not upload when handleUpload is called programmatically and disabled', async () => {
      const onUploadFiles = vi.fn();

      const { result } = renderUseFileUpload({
        onUploadFiles,
        uploadEnabled: false,
      });

      const files = [
        { fileContent: createMockFile('file1.txt', 10), name: 'file1.txt' },
      ];

      let ok = true;

      await act(async () => {
        ok = await result.current.handleUpload(files, '/folder', []);
      });

      expect(ok).toBe(false);
      expect(onUploadFiles).not.toHaveBeenCalled();
      expect(result.current.uploadError).toBeUndefined();
    });

    it('does not open archive dialog when disabled', () => {
      const onUploadArchive = vi.fn();
      const { result } = renderUseFileUpload({
        onUploadArchive,
        uploadEnabled: false,
      });

      act(() => {
        result.current.openArchiveDialog('/folder', mockExistingFiles);
      });

      const input = document.body.querySelector(
        'input[accept=".zip,application/zip"]',
      ) as HTMLInputElement | null;

      expect(input).toBeNull();
      expect(onUploadArchive).not.toHaveBeenCalled();
    });

    it('removes window listeners and resets states when toggled off', () => {
      const { result, rerender } = renderHook(
        ({ enabled }: { enabled: boolean }) =>
          useFileUpload({
            uploadEnabled: enabled,
            currentFolder: writableFolder,
          }),
        { initialProps: { enabled: true } },
      );

      const dragEnterEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { types: ['Files'] },
      } as unknown as DragEvent;

      act(() => {
        result.current.handleDragEnter(dragEnterEvent);
      });
      expect(result.current.isDragging).toBe(true);

      rerender({ enabled: false });

      expect(result.current.isDragging).toBe(false);
      expect(result.current.isDraggingOverWindow).toBe(false);
      expect(result.current.uploadError).toBeUndefined();

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
  });

  describe('file input wiring', () => {
    const getHiddenFileInputs = () =>
      Array.from(
        document.body.querySelectorAll<HTMLInputElement>('input[type="file"]'),
      ).filter((input) => input.accept !== '.zip,application/zip');

    const renderWithTypes = (types?: DialFileAcceptType[]) =>
      renderHook(
        ({ allowedFileTypes }: { allowedFileTypes?: DialFileAcceptType[] }) =>
          useFileUpload({ currentFolder: writableFolder, allowedFileTypes }),
        { initialProps: { allowedFileTypes: types } },
      );

    it('does not append any element to the document', () => {
      renderUseFileUpload();

      expect(getHiddenFileInputs()).toHaveLength(0);
    });

    it('derives the accept string from allowedFileTypes', () => {
      const { rerender, result } = renderWithTypes(['application/pdf']);

      expect(result.current.fileInputAccept).toBe('application/pdf');

      rerender({ allowedFileTypes: ['image/*', 'text/plain'] });
      expect(result.current.fileInputAccept).toBe('image/*,text/plain');
    });

    it('leaves accept undefined when there is no restriction', () => {
      const { rerender, result } = renderWithTypes([]);

      expect(result.current.fileInputAccept).toBeUndefined();

      rerender({ allowedFileTypes: undefined });
      expect(result.current.fileInputAccept).toBeUndefined();
    });

    it('surfaces an error and resets input value when the upload throws', async () => {
      const onUploadFiles = vi.fn(() => {
        throw new Error('boom');
      });
      const { result } = renderUseFileUpload({ onUploadFiles });

      const input = document.createElement('input');
      input.type = 'file';

      const file = createMockFile('file1.txt', 1024);
      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      await act(async () => {
        await result.current.handleFileInputChange({
          currentTarget: input,
        } as unknown as ChangeEvent<HTMLInputElement>);
      });

      await waitFor(() => {
        expect(onUploadFiles).toHaveBeenCalled();
        expect(result.current.uploadError).toBe('Upload failed');
      });
      expect(input.value).toBe('');
    });
  });
});
