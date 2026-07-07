import { useItemRenaming } from '@/components/FileManager/hooks/use-item-renaming';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import type { DialCopiedItem } from '@/models/file-manager';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
              id: 'f-a-2',
              name: 'document.pdf',
              path: '/root/A/document.pdf',
              nodeType: DialFileNodeType.ITEM,
              parentPath: '/root/A',
            } as DialFile,
            {
              id: 'f-a-2b',
              name: 'document.txt',
              path: '/root/A/document.txt',
              nodeType: DialFileNodeType.ITEM,
              parentPath: '/root/A',
            } as DialFile,
            {
              id: 'f-a-3',
              name: 'noext',
              path: '/root/A/noext',
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

  it('initial state: renamedPath and renamedItem undefined, handlers exist', () => {
    const { result } = renderHook(() => useItemRenaming({ items }));

    expect(result.current.renamedPath).toBeUndefined();
    expect(result.current.renamedItem).toBeUndefined();
    expect(typeof result.current.renameHandler).toBe('function');
    expect(typeof result.current.renameCancelHandler).toBe('function');
    expect(typeof result.current.renameSaveHandler).toBe('function');
    expect(typeof result.current.renameValidateHandler).toBe('function');
    expect(typeof result.current.getDisplayName).toBe('function');
  });

  it('renameHandler sets renamedPath and renamedItem', () => {
    const { result } = renderHook(() => useItemRenaming({ items }));

    act(() => {
      result.current.renameHandler('/root/A');
    });

    expect(result.current.renamedPath).toBe('/root/A');
    expect(result.current.renamedItem).toBeDefined();
    expect(result.current.renamedItem?.path).toBe('/root/A');
    expect(result.current.renamedItem?.name).toBe('A');
  });

  it('renameCancelHandler clears renamedPath and renamedItem', () => {
    const { result } = renderHook(() => useItemRenaming({ items }));

    act(() => {
      result.current.renameHandler('/root/A');
    });

    act(() => {
      result.current.renameCancelHandler();
    });

    expect(result.current.renamedPath).toBeUndefined();
    expect(result.current.renamedItem).toBeUndefined();
  });

  it('renameSaveHandler calls onMoveToFiles with only the renamed item', () => {
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

    const parentPath = '/root';

    const expected: DialCopiedItem[] = [
      {
        sourceUrl: '/root/A',
        destinationUrl: '/root/Symbols',
        nodeType: DialFileNodeType.FOLDER,
      },
    ];

    expect(onMoveToFiles).toHaveBeenCalledTimes(1);
    expect(onMoveToFiles).toHaveBeenCalledWith(
      expected,
      parentPath,
      parentPath,
    );

    expect(result.current.renamedPath).toBeUndefined();
    expect(result.current.renamedItem).toBeUndefined();
  });

  it('renameSaveHandler does nothing if item not found', () => {
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
    expect(result.current.renamedItem).toBeUndefined();
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
    expect(result.current.renamedItem).toBeUndefined();
  });

  it('handles renaming a file (not a folder)', () => {
    const onMoveToFiles = vi.fn();

    const { result } = renderHook(() =>
      useItemRenaming({ items, onMoveToFiles }),
    );

    act(() => {
      result.current.renameHandler('/root/A/a1.txt');
    });

    act(() => {
      result.current.renameSaveHandler('renamed.txt');
    });

    const expected: DialCopiedItem[] = [
      {
        sourceUrl: '/root/A/a1.txt',
        destinationUrl: '/root/A/renamed.txt',
        nodeType: DialFileNodeType.ITEM,
      },
    ];

    expect(onMoveToFiles).toHaveBeenCalledWith(expected, '/root/A', '/root/A');
  });

  describe('File extension handling', () => {
    it('automatically adds extension back when renaming a file', () => {
      const onMoveToFiles = vi.fn();
      const { result } = renderHook(() =>
        useItemRenaming({ items, onMoveToFiles }),
      );

      act(() => {
        result.current.renameHandler('/root/A/a1.txt');
      });

      act(() => {
        result.current.renameSaveHandler('renamed');
      });

      const expected: DialCopiedItem[] = [
        {
          sourceUrl: '/root/A/a1.txt',
          destinationUrl: '/root/A/renamed.txt',
          nodeType: DialFileNodeType.ITEM,
        },
      ];

      expect(onMoveToFiles).toHaveBeenCalledWith(
        expected,
        '/root/A',
        '/root/A',
      );
    });

    it('handles files with multiple dots in name', () => {
      const onMoveToFiles = vi.fn();
      const { result } = renderHook(() =>
        useItemRenaming({ items, onMoveToFiles }),
      );

      const fileWithDots: DialFile = {
        id: 'f-dots',
        name: 'my.file.backup.txt',
        path: '/root/A/my.file.backup.txt',
        nodeType: DialFileNodeType.ITEM,
        parentPath: '/root/A',
      } as DialFile;

      items[0].items![0].items!.push(fileWithDots);

      act(() => {
        result.current.renameHandler('/root/A/my.file.backup.txt');
      });

      act(() => {
        result.current.renameSaveHandler('newname');
      });

      const expected: DialCopiedItem[] = [
        {
          sourceUrl: '/root/A/my.file.backup.txt',
          destinationUrl: '/root/A/newname.txt',
          nodeType: DialFileNodeType.ITEM,
        },
      ];

      expect(onMoveToFiles).toHaveBeenCalledWith(
        expected,
        '/root/A',
        '/root/A',
      );
    });

    it('handles files without extension', () => {
      const onMoveToFiles = vi.fn();
      const { result } = renderHook(() =>
        useItemRenaming({ items, onMoveToFiles }),
      );

      act(() => {
        result.current.renameHandler('/root/A/noext');
      });

      act(() => {
        result.current.renameSaveHandler('renamed');
      });

      const expected: DialCopiedItem[] = [
        {
          sourceUrl: '/root/A/noext',
          destinationUrl: '/root/A/renamed',
          nodeType: DialFileNodeType.ITEM,
        },
      ];

      expect(onMoveToFiles).toHaveBeenCalledWith(
        expected,
        '/root/A',
        '/root/A',
      );
    });

    it('handles files starting with dot (hidden files)', () => {
      const onMoveToFiles = vi.fn();

      const hiddenFile: DialFile = {
        id: 'f-hidden',
        name: '.gitignore',
        path: '/root/A/.gitignore',
        nodeType: DialFileNodeType.ITEM,
        parentPath: '/root/A',
      } as DialFile;

      items[0].items![0].items!.push(hiddenFile);

      const { result } = renderHook(() =>
        useItemRenaming({ items, onMoveToFiles }),
      );

      act(() => {
        result.current.renameHandler('/root/A/.gitignore');
      });

      act(() => {
        result.current.renameSaveHandler('renamed');
      });

      const expected: DialCopiedItem[] = [
        {
          sourceUrl: '/root/A/.gitignore',
          destinationUrl: '/root/A/renamed',
          nodeType: DialFileNodeType.ITEM,
        },
      ];

      expect(onMoveToFiles).toHaveBeenCalledWith(
        expected,
        '/root/A',
        '/root/A',
      );
    });

    it('does not add extension to folders', () => {
      const onMoveToFiles = vi.fn();
      const { result } = renderHook(() =>
        useItemRenaming({ items, onMoveToFiles }),
      );

      act(() => {
        result.current.renameHandler('/root/A/sub');
      });

      act(() => {
        result.current.renameSaveHandler('newsub');
      });

      const expected: DialCopiedItem[] = [
        {
          sourceUrl: '/root/A/sub',
          destinationUrl: '/root/A/newsub',
          nodeType: DialFileNodeType.FOLDER,
        },
      ];

      expect(onMoveToFiles).toHaveBeenCalledWith(
        expected,
        '/root/A',
        '/root/A',
      );
    });
  });

  describe('No-change detection', () => {
    it('does not call onMoveToFiles if name is unchanged for folder', () => {
      const onMoveToFiles = vi.fn();
      const { result } = renderHook(() =>
        useItemRenaming({ items, onMoveToFiles }),
      );

      act(() => {
        result.current.renameHandler('/root/A');
      });

      act(() => {
        result.current.renameSaveHandler('A');
      });

      expect(onMoveToFiles).not.toHaveBeenCalled();
      expect(result.current.renamedPath).toBeUndefined();
      expect(result.current.renamedItem).toBeUndefined();
    });

    it('does not call onMoveToFiles if name is unchanged for file (with extension)', () => {
      const onMoveToFiles = vi.fn();
      const { result } = renderHook(() =>
        useItemRenaming({ items, onMoveToFiles }),
      );

      act(() => {
        result.current.renameHandler('/root/A/a1.txt');
      });

      act(() => {
        result.current.renameSaveHandler('a1');
      });

      expect(onMoveToFiles).not.toHaveBeenCalled();
      expect(result.current.renamedPath).toBeUndefined();
    });

    it('does not call onMoveToFiles if only whitespace changes', () => {
      const onMoveToFiles = vi.fn();
      const { result } = renderHook(() =>
        useItemRenaming({ items, onMoveToFiles }),
      );

      act(() => {
        result.current.renameHandler('/root/A');
      });

      act(() => {
        result.current.renameSaveHandler('  A  ');
      });

      expect(onMoveToFiles).not.toHaveBeenCalled();
    });
  });

  describe('getDisplayName', () => {
    it('returns name without extension for files', () => {
      const { result } = renderHook(() => useItemRenaming({ items }));

      const file = items[0].items![0].items![0]; // a1.txt
      const displayName = result.current.getDisplayName(file);

      expect(displayName).toBe('a1');
    });

    it('returns full name for files without extension', () => {
      const { result } = renderHook(() => useItemRenaming({ items }));

      const file = items[0].items![0].items![3];
      const displayName = result.current.getDisplayName(file);

      expect(displayName).toBe('noext');
    });

    it('returns full name for folders', () => {
      const { result } = renderHook(() => useItemRenaming({ items }));

      const folder = items[0].items![0];
      const displayName = result.current.getDisplayName(folder);

      expect(displayName).toBe('A');
    });

    it('handles files with multiple dots correctly', () => {
      const fileWithDots: DialFile = {
        id: 'f-dots',
        name: 'my.file.backup.txt',
        path: '/root/A/my.file.backup.txt',
        nodeType: DialFileNodeType.ITEM,
        parentPath: '/root/A',
      } as DialFile;

      const { result } = renderHook(() => useItemRenaming({ items }));

      const displayName = result.current.getDisplayName(fileWithDots);
      expect(displayName).toBe('my.file.backup');
    });

    it('handles hidden files starting with dot', () => {
      const hiddenFile: DialFile = {
        id: 'f-hidden',
        name: '.gitignore',
        path: '/root/A/.gitignore',
        nodeType: DialFileNodeType.ITEM,
        parentPath: '/root/A',
      } as DialFile;

      const { result } = renderHook(() => useItemRenaming({ items }));

      const displayName = result.current.getDisplayName(hiddenFile);
      expect(displayName).toBe('.gitignore');
    });
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

    it('validates file names with automatic extension appending', () => {
      const { result } = renderHook(() => useItemRenaming({ items }));

      const file = items[0].items![0].items![0]; // a1.txt

      // Try to rename to existing file name (without extension in input)
      const error = result.current.renameValidateHandler('document', file);
      expect(error).toBe('An item with this name already exists');
    });

    it('validates file names case-insensitively with extension', () => {
      const { result } = renderHook(() => useItemRenaming({ items }));

      const file = items[0].items![0].items![0]; // a1.txt

      const error = result.current.renameValidateHandler('DOCUMENT', file);
      expect(error).toBe('An item with this name already exists');
    });

    it('uses custom validation messages', () => {
      const { result } = renderHook(() =>
        useItemRenaming({
          items,
          validationMessages: {
            emptyName: 'Custom empty error',
            duplicateName: 'Custom duplicate error',
            hiddenItemWarning: 'Custom hidden item warning',
            consecutiveDotsError: 'Custom consecutive dots error',
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

      const hiddenError = result.current.renameValidateHandler(
        '.hidden',
        items[0].items![0],
      );
      expect(hiddenError).toBe('Custom hidden item warning');

      const consecutiveDotsError = result.current.renameValidateHandler(
        '...',
        items[0].items![0],
      );
      expect(consecutiveDotsError).toBe('Custom consecutive dots error');
    });

    it('returns error for names with consecutive dots', () => {
      const { result } = renderHook(() => useItemRenaming({ items }));

      const folderA = items[0].items![0];

      expect(result.current.renameValidateHandler('...', folderA)).toBe(
        'Name cannot contain consecutive dots',
      );
      expect(result.current.renameValidateHandler('a..b', folderA)).toBe(
        'Name cannot contain consecutive dots',
      );
      expect(result.current.renameValidateHandler('name..', folderA)).toBe(
        'Name cannot contain consecutive dots',
      );
    });

    it('takes precedence over the leading-dot hidden warning', () => {
      const { result } = renderHook(() => useItemRenaming({ items }));

      const folderA = items[0].items![0];
      const error = result.current.renameValidateHandler('..hidden', folderA);
      expect(error).toBe('Name cannot contain consecutive dots');
    });

    it('still allows a single leading dot without consecutive dots', () => {
      const { result } = renderHook(() => useItemRenaming({ items }));

      const folderA = items[0].items![0];
      const error = result.current.renameValidateHandler('.hidden', folderA);
      expect(error).toBe(
        'warning__A dot at the start of the name will make the item hidden',
      );
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

    it('custom validation receives full file name with extension', () => {
      const validate = vi.fn(() => null);
      const { result } = renderHook(() =>
        useItemRenaming({ items, onRenameValidate: validate }),
      );

      const file = items[0].items![0].items![0]; // a1.txt
      result.current.renameValidateHandler('newname', file);

      expect(validate).toHaveBeenCalledWith('newname.txt', file);
    });
  });
});
