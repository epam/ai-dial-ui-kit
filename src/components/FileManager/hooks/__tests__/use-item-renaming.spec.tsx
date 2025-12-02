import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useItemRenaming } from '@/components/FileManager/hooks/use-item-renaming';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import type { DialCopiedItem } from '@/models/file-manager';

function buildTree(): DialFile[] {
  return [
    {
      id: 'f-root',
      name: 'root',
      path: '/root',
      nodeType: DialFileNodeType.FOLDER,
      items: [
        {
          id: 'f-a',
          name: 'A',
          path: '/root/A',
          nodeType: DialFileNodeType.FOLDER,
          parentPath: '/root',
          items: [
            {
              id: 'f-a-1',
              name: 'a1.txt',
              path: '/root/A/a1.txt',
              nodeType: DialFileNodeType.ITEM,
              parentPath: '/root/A',
            } as DialFile,
            {
              id: 'f-a-sub',
              name: 'sub',
              path: '/root/A/sub',
              nodeType: DialFileNodeType.FOLDER,
              parentPath: '/root/A',
              items: [
                {
                  id: 'f-a-sub-1',
                  name: 'deep.txt',
                  path: '/root/A/sub/deep.txt',
                  nodeType: DialFileNodeType.ITEM,
                  parentPath: '/root/A/sub',
                } as DialFile,
              ],
            } as DialFile,
          ],
        } as DialFile,
        {
          id: 'f-b',
          name: 'B',
          path: '/root/B',
          nodeType: DialFileNodeType.FOLDER,
          parentPath: '/root',
        } as DialFile,
      ],
    } as DialFile,
  ];
}

describe('useItemRenaming hook', () => {
  let items: DialFile[];

  beforeEach(() => {
    items = buildTree();
  });

  it('initial state: renamedPath undefined and handlers exist', () => {
    const { result } = renderHook(() => useItemRenaming({ items }));

    expect(result.current.renamedPath).toBeUndefined();
    expect(typeof result.current.renameHandler).toBe('function');
    expect(typeof result.current.renameCancelHandler).toBe('function');
    expect(typeof result.current.renameSaveHandler).toBe('function');
    expect(typeof result.current.renameValidateHandler).toBe('function');
  });

  it('renameHandler sets renamedPath', () => {
    const { result } = renderHook(() => useItemRenaming({ items }));

    act(() => {
      result.current.renameHandler('/root/A');
    });

    expect(result.current.renamedPath).toBe('/root/A');
  });

  it('renameCancelHandler clears renamedPath', () => {
    const { result } = renderHook(() => useItemRenaming({ items }));

    act(() => {
      result.current.renameHandler('/root/A');
    });

    act(() => {
      result.current.renameCancelHandler();
    });

    expect(result.current.renamedPath).toBeUndefined();
  });

  it('renameSaveHandler calls onMoveToFiles for folder with nested children (recursive)', () => {
    const onMoveToFiles = vi.fn();

    const { result } = renderHook(() =>
      useItemRenaming({ items, onMoveToFiles }),
    );

    act(() => {
      result.current.renameHandler('/root/A');
    });

    act(() => {
      result.current.renameSaveHandler('Symbols');
    });

    const sourceFolder = '/root/A';
    const destinationFolder = '/root/Symbols';

    const expected: DialCopiedItem[] = [
      {
        sourceUrl: '/root/A',
        destinationUrl: '/root/Symbols',
        nodeType: DialFileNodeType.FOLDER,
      },
      {
        sourceUrl: '/root/A/a1.txt',
        destinationUrl: '/root/Symbols/a1.txt',
        nodeType: DialFileNodeType.ITEM,
      },
      {
        sourceUrl: '/root/A/sub',
        destinationUrl: '/root/Symbols/sub',
        nodeType: DialFileNodeType.FOLDER,
      },
      {
        sourceUrl: '/root/A/sub/deep.txt',
        destinationUrl: '/root/Symbols/sub/deep.txt',
        nodeType: DialFileNodeType.ITEM,
      },
    ];

    expect(onMoveToFiles).toHaveBeenCalledTimes(1);
    expect(onMoveToFiles).toHaveBeenCalledWith(
      expected,
      sourceFolder,
      destinationFolder,
    );

    expect(result.current.renamedPath).toBeUndefined();
  });

  it('renameSaveHandler does nothing for onMoveToFiles if target not found', () => {
    const onMoveToFiles = vi.fn();

    const { result } = renderHook(() =>
      useItemRenaming({ items, onMoveToFiles }),
    );

    act(() => {
      result.current.renameHandler('/not/exist');
    });

    act(() => {
      result.current.renameSaveHandler('Whatever');
    });

    expect(onMoveToFiles).not.toHaveBeenCalled();
    expect(result.current.renamedPath).toBeUndefined();
  });

  it('renameSaveHandler works when onMoveToFiles is not provided (no crash)', () => {
    const { result } = renderHook(() => useItemRenaming({ items }));

    act(() => {
      result.current.renameHandler('/root/B');
    });

    act(() => {
      result.current.renameSaveHandler('NewB');
    });

    expect(result.current.renamedPath).toBeUndefined();
  });

  it('replaces only the first occurrence of oldBase when building destinationUrl (prefix replacement behavior)', () => {
    const onMoveToFiles = vi.fn();

    const itemsCustom: DialFile[] = [
      {
        id: 'p1',
        name: 'B',
        path: '/A/B',
        nodeType: DialFileNodeType.FOLDER,
        items: [
          {
            id: 'p2',
            name: 'B2',
            path: '/A/B/B/file.txt',
            nodeType: DialFileNodeType.ITEM,
            parentPath: '/A/B/B',
          } as DialFile,
        ],
      } as DialFile,
    ];

    const { result } = renderHook(() =>
      useItemRenaming({ items: itemsCustom, onMoveToFiles }),
    );

    act(() => {
      result.current.renameHandler('/A/B');
    });

    act(() => {
      result.current.renameSaveHandler('C');
    });

    expect(onMoveToFiles).toHaveBeenCalledTimes(1);
    const [affected, source, dest] = onMoveToFiles.mock.calls[0];

    expect(source).toBe('/A/B');
    expect(dest).toBe('/A/C');

    expect(affected).toEqual([
      {
        sourceUrl: '/A/B',
        destinationUrl: '/A/C',
        nodeType: DialFileNodeType.FOLDER,
      },
      {
        sourceUrl: '/A/B/B/file.txt',
        destinationUrl: '/A/C/B/file.txt',
        nodeType: DialFileNodeType.ITEM,
      },
    ]);
  });

  describe('renameValidateHandler', () => {
    it('returns error for empty name', () => {
      const { result } = renderHook(() => useItemRenaming({ items }));

      const error = result.current.renameValidateHandler(
        '  ',
        items[0].items![0],
      );
      expect(error).toBe('Name cannot be empty');
    });

    it('returns error for duplicate name in the same folder', () => {
      const { result } = renderHook(() => useItemRenaming({ items }));

      const folderA = items[0].items![0]; // /root/A
      const error = result.current.renameValidateHandler('B', folderA);
      expect(error).toBe('An item with this name already exists');
    });

    it('returns null for valid unique name', () => {
      const { result } = renderHook(() => useItemRenaming({ items }));

      const folderA = items[0].items![0]; // /root/A
      const error = result.current.renameValidateHandler('C', folderA);
      expect(error).toBeNull();
    });

    it('allows renaming to the same name (case-insensitive check excludes self)', () => {
      const { result } = renderHook(() => useItemRenaming({ items }));

      const folderA = items[0].items![0]; // /root/A
      const error = result.current.renameValidateHandler('A', folderA);
      expect(error).toBeNull();
    });

    it('uses custom validation messages', () => {
      const { result } = renderHook(() =>
        useItemRenaming({
          items,
          validationMessages: {
            emptyName: 'Custom empty error',
            duplicateName: 'Custom duplicate error',
          },
        }),
      );

      const emptyError = result.current.renameValidateHandler(
        '  ',
        items[0].items![0],
      );
      expect(emptyError).toBe('Custom empty error');

      const folderA = items[0].items![0];
      const duplicateError = result.current.renameValidateHandler('B', folderA);
      expect(duplicateError).toBe('Custom duplicate error');
    });

    it('delegates to onRenameValidate and returns its result', () => {
      const validate = vi.fn((value: string) =>
        value === 'bad' ? 'Custom validation error' : null,
      );
      const { result } = renderHook(() =>
        useItemRenaming({ items, onRenameValidate: validate }),
      );

      const folderA = items[0].items![0];
      const ok = result.current.renameValidateHandler('good', folderA);
      const bad = result.current.renameValidateHandler('bad', folderA);

      expect(ok).toBeNull();
      expect(bad).toBe('Custom validation error');
      expect(validate).toHaveBeenCalledWith('good', folderA);
      expect(validate).toHaveBeenCalledWith('bad', folderA);
    });

    it('checks custom validation after built-in validation passes', () => {
      const validate = vi.fn(() => 'Always fails');
      const { result } = renderHook(() =>
        useItemRenaming({ items, onRenameValidate: validate }),
      );

      const folderA = items[0].items![0];
      const error = result.current.renameValidateHandler(
        'UniqueValid',
        folderA,
      );

      expect(error).toBe('Always fails');
      expect(validate).toHaveBeenCalledWith('UniqueValid', folderA);
    });
  });
});
