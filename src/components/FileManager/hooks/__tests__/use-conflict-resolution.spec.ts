import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConflictResolution } from '@/components/FileManager/hooks/use-conflict-resolution';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import { DialFileManagerConflictActions } from '@/types/file-manager';

describe('Dial UI Kit :: FileManager :: useConflictResolution', () => {
  let destinationFiles: DialFile[] = [];
  const getDestinationFiles = () => destinationFiles;

  beforeEach(() => {
    destinationFiles = [];
  });

  it('initial state: no conflicts, popup closed', () => {
    const { result } = renderHook(() =>
      useConflictResolution({ getDestinationFiles }),
    );

    expect(result.current.conflictResolutionOpen).toBe(false);
    expect(result.current.conflictingFiles).toEqual([]);
  });

  it('checkForConflicts returns no conflicts when files are unique', () => {
    destinationFiles = [
      {
        id: '1',
        name: 'existing.txt',
        path: '/dest/existing.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useConflictResolution({ getDestinationFiles }),
    );

    const files: DialFile[] = [
      {
        id: '2',
        name: 'new.txt',
        path: '/src/new.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const conflictResult = result.current.checkForConflicts('/dest', files);

    expect(conflictResult.hasConflicts).toBe(false);
    expect(conflictResult.conflicts).toEqual([]);
  });

  it('checkForConflicts returns conflicts when file names match', () => {
    destinationFiles = [
      {
        id: '1',
        name: 'file.txt',
        path: '/dest/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '2',
        name: 'doc.pdf',
        path: '/dest/doc.pdf',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useConflictResolution({ getDestinationFiles }),
    );

    const files: DialFile[] = [
      {
        id: '3',
        name: 'file.txt',
        path: '/src/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '4',
        name: 'other.txt',
        path: '/src/other.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const conflictResult = result.current.checkForConflicts('/dest', files);

    expect(conflictResult.hasConflicts).toBe(true);
    expect(conflictResult.conflicts).toHaveLength(1);
    expect(conflictResult.conflicts[0].name).toBe('file.txt');
  });

  it('resolveConflictsWithStrategy with overwrite=true', () => {
    destinationFiles = [
      {
        id: '1',
        name: 'test.txt',
        path: '/dest/test.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useConflictResolution({ getDestinationFiles }),
    );

    const files: DialFile[] = [
      {
        id: '2',
        name: 'test.txt',
        path: '/src/test.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const resolved = result.current.resolveConflictsWithStrategy(
      '/dest',
      files,
      true,
    );

    expect(resolved).toHaveLength(1);
    expect(resolved[0]).toEqual({
      sourceUrl: '/src/test.txt',
      destinationUrl: '/dest/test.txt',
      overwrite: true,
      nodeType: DialFileNodeType.ITEM,
    });
  });

  it('resolveConflictsWithStrategy with overwrite=false renames files', () => {
    destinationFiles = [
      {
        id: '1',
        name: 'doc.pdf',
        path: '/dest/doc.pdf',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useConflictResolution({ getDestinationFiles }),
    );

    const files: DialFile[] = [
      {
        id: '2',
        name: 'doc.pdf',
        path: '/src/doc.pdf',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const resolved = result.current.resolveConflictsWithStrategy(
      '/dest',
      files,
      false,
    );

    expect(resolved).toHaveLength(1);
    expect(resolved[0]).toEqual({
      sourceUrl: '/src/doc.pdf',
      destinationUrl: '/dest/doc (1).pdf',
      overwrite: false,
      nodeType: DialFileNodeType.ITEM,
    });
  });

  it('resolveConflictsWithDecisions filters out cancelled files', () => {
    destinationFiles = [
      {
        id: '1',
        name: 'a.txt',
        path: '/dest/a.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '2',
        name: 'b.txt',
        path: '/dest/b.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useConflictResolution({ getDestinationFiles }),
    );

    const files: DialFile[] = [
      {
        id: '3',
        name: 'a.txt',
        path: '/src/a.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '4',
        name: 'b.txt',
        path: '/src/b.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const decisions = new Map([
      ['/src/a.txt', DialFileManagerConflictActions.Replace],
      ['/src/b.txt', DialFileManagerConflictActions.Cancel],
    ]);

    const resolved = result.current.resolveConflictsWithDecisions(
      '/dest',
      files,
      decisions,
    );

    expect(resolved).toHaveLength(1);
    expect(resolved[0].sourceUrl).toBe('/src/a.txt');
  });

  it('resolveConflictsWithDecisions handles mixed decisions', () => {
    destinationFiles = [
      {
        id: '1',
        name: 'x.txt',
        path: '/dest/x.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '2',
        name: 'y.txt',
        path: '/dest/y.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useConflictResolution({ getDestinationFiles }),
    );

    const files: DialFile[] = [
      {
        id: '3',
        name: 'x.txt',
        path: '/src/x.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '4',
        name: 'y.txt',
        path: '/src/y.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const decisions = new Map([
      ['/src/x.txt', DialFileManagerConflictActions.Replace],
      ['/src/y.txt', DialFileManagerConflictActions.Duplicate],
    ]);

    const resolved = result.current.resolveConflictsWithDecisions(
      '/dest',
      files,
      decisions,
    );

    expect(resolved).toHaveLength(2);
    expect(resolved[0]).toEqual({
      sourceUrl: '/src/x.txt',
      destinationUrl: '/dest/x.txt',
      overwrite: true,
      nodeType: DialFileNodeType.ITEM,
    });
    expect(resolved[1]).toEqual({
      sourceUrl: '/src/y.txt',
      destinationUrl: '/dest/y (1).txt',
      overwrite: false,
      nodeType: DialFileNodeType.ITEM,
    });
  });

  it('startConflictResolution opens popup when conflicts exist', () => {
    destinationFiles = [
      {
        id: '1',
        name: 'file.txt',
        path: '/dest/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useConflictResolution({ getDestinationFiles }),
    );

    const files: DialFile[] = [
      {
        id: '2',
        name: 'file.txt',
        path: '/src/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.startConflictResolution('/dest', files);
    });

    expect(result.current.conflictResolutionOpen).toBe(true);
    expect(result.current.conflictingFiles).toHaveLength(1);
  });

  it('handleReplaceAll calls onResolve with overwrite=true', () => {
    const onResolve = vi.fn();
    destinationFiles = [
      {
        id: '1',
        name: 'doc.txt',
        path: '/dest/doc.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useConflictResolution({ getDestinationFiles, onResolve }),
    );

    const files: DialFile[] = [
      {
        id: '2',
        name: 'doc.txt',
        path: '/src/doc.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.startConflictResolution('/dest', files);
    });

    act(() => {
      result.current.handleReplaceAll();
    });

    expect(onResolve).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/src/doc.txt',
          destinationUrl: '/dest/doc.txt',
          overwrite: true,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/dest',
    );
    expect(result.current.conflictResolutionOpen).toBe(false);
  });

  it('handleDuplicateAll calls onResolve with renamed files', () => {
    const onResolve = vi.fn();
    destinationFiles = [
      {
        id: '1',
        name: 'image.png',
        path: '/dest/image.png',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useConflictResolution({ getDestinationFiles, onResolve }),
    );

    const files: DialFile[] = [
      {
        id: '2',
        name: 'image.png',
        path: '/src/image.png',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.startConflictResolution('/dest', files);
    });

    act(() => {
      result.current.handleDuplicateAll();
    });

    expect(onResolve).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/src/image.png',
          destinationUrl: '/dest/image (1).png',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/dest',
    );
    expect(result.current.conflictResolutionOpen).toBe(false);
  });

  it('handleDecideForEach calls onResolve with individual decisions', () => {
    const onResolve = vi.fn();
    destinationFiles = [
      {
        id: '1',
        name: 'a.txt',
        path: '/dest/a.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '2',
        name: 'b.txt',
        path: '/dest/b.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useConflictResolution({ getDestinationFiles, onResolve }),
    );

    const files: DialFile[] = [
      {
        id: '3',
        name: 'a.txt',
        path: '/src/a.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
      {
        id: '4',
        name: 'b.txt',
        path: '/src/b.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.startConflictResolution('/dest', files);
    });

    act(() => {
      result.current.handleDecideForEach([
        { file: files[0], action: DialFileManagerConflictActions.Replace },
        { file: files[1], action: DialFileManagerConflictActions.Duplicate },
      ]);
    });

    expect(onResolve).toHaveBeenCalledWith(
      [
        {
          sourceUrl: '/src/a.txt',
          destinationUrl: '/dest/a.txt',
          overwrite: true,
          nodeType: DialFileNodeType.ITEM,
        },
        {
          sourceUrl: '/src/b.txt',
          destinationUrl: '/dest/b (1).txt',
          overwrite: false,
          nodeType: DialFileNodeType.ITEM,
        },
      ],
      '/dest',
    );
    expect(result.current.conflictResolutionOpen).toBe(false);
  });

  it('closeConflictResolution clears state', () => {
    destinationFiles = [
      {
        id: '1',
        name: 'file.txt',
        path: '/dest/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useConflictResolution({ getDestinationFiles }),
    );

    const files: DialFile[] = [
      {
        id: '2',
        name: 'file.txt',
        path: '/src/file.txt',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    act(() => {
      result.current.startConflictResolution('/dest', files);
    });

    expect(result.current.conflictResolutionOpen).toBe(true);

    act(() => {
      result.current.closeConflictResolution();
    });

    expect(result.current.conflictResolutionOpen).toBe(false);
    expect(result.current.conflictingFiles).toEqual([]);
  });

  it('resolveConflictsWithStrategy: FOLDER with dot in name is duplicated as "name (n)"', () => {
    destinationFiles = [
      {
        id: '1',
        name: 'foo.bar',
        path: '/dest/foo.bar',
        nodeType: DialFileNodeType.FOLDER,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useConflictResolution({ getDestinationFiles }),
    );

    const files: DialFile[] = [
      {
        id: '2',
        name: 'foo.bar',
        path: '/src/foo.bar',
        nodeType: DialFileNodeType.FOLDER,
      } as DialFile,
    ];

    const resolved = result.current.resolveConflictsWithStrategy(
      '/dest',
      files,
      false,
    );

    expect(resolved).toHaveLength(1);
    expect(resolved[0]).toEqual({
      sourceUrl: '/src/foo.bar',
      destinationUrl: '/dest/foo.bar (1)',
      overwrite: false,
      nodeType: DialFileNodeType.FOLDER,
    });
  });

  it('resolveConflictsWithStrategy: ITEM multi-dot filename keeps last extension', () => {
    destinationFiles = [
      {
        id: '1',
        name: 'archive.tar.gz',
        path: '/dest/archive.tar.gz',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useConflictResolution({ getDestinationFiles }),
    );

    const files: DialFile[] = [
      {
        id: '2',
        name: 'archive.tar.gz',
        path: '/src/archive.tar.gz',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ];

    const resolved = result.current.resolveConflictsWithStrategy(
      '/dest',
      files,
      false,
    );

    expect(resolved).toHaveLength(1);
    expect(resolved[0]).toEqual({
      sourceUrl: '/src/archive.tar.gz',
      destinationUrl: '/dest/archive.tar (1).gz',
      overwrite: false,
      nodeType: DialFileNodeType.ITEM,
    });
  });
});
