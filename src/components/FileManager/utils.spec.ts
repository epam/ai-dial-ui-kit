import { describe, it, expect } from 'vitest';
import type { DialFileAcceptType } from '@/models/file-manager';
import { DialFileNodeType, type DialFile } from '@/models/file';
import {
  excludePathsFromTree,
  formatAllowedFileTypesForTooltip,
  getFolderNestingDepth,
  isFileSelectable,
  splitPathAndName,
  getNextFolderName,
} from './utils';

describe('Dial UI Kit :: splitPathAndName', () => {
  it('splits a nested path into parent and name', () => {
    expect(splitPathAndName('All files/Design/Icons')).toEqual({
      parent: 'All files/Design',
      name: 'Icons',
    });
  });

  it('handles a top-level path with no slash', () => {
    expect(splitPathAndName('All files')).toEqual({
      parent: '',
      name: 'All files',
    });
  });

  it('handles a single-level folder directly under root slash', () => {
    expect(splitPathAndName('root/child')).toEqual({
      parent: 'root',
      name: 'child',
    });
  });
});

describe('Dial UI Kit :: isFileSelectable', () => {
  const baseFile = {
    name: 'photo.png',
    contentType: 'image/png',
    contentLength: 512,
  };

  it('returns true when no constraints are set', () => {
    expect(isFileSelectable(baseFile)).toBe(true);
  });

  it('returns true when file size is within the limit', () => {
    expect(isFileSelectable(baseFile, undefined, 1024)).toBe(true);
  });

  it('returns false when file size exceeds the limit', () => {
    expect(isFileSelectable(baseFile, undefined, 256)).toBe(false);
  });

  it('returns true when size equals the limit exactly', () => {
    expect(isFileSelectable(baseFile, undefined, 512)).toBe(true);
  });

  it('returns true when content type matches allowedFileTypes', () => {
    expect(isFileSelectable(baseFile, ['image/*'])).toBe(true);
  });

  it('returns false when content type does not match allowedFileTypes', () => {
    expect(isFileSelectable(baseFile, ['application/pdf'])).toBe(false);
  });

  it('returns false when both size and type fail', () => {
    expect(isFileSelectable(baseFile, ['application/pdf'], 256)).toBe(false);
  });

  it('returns true when contentLength is absent (no size to check)', () => {
    expect(
      isFileSelectable(
        { name: 'file.png', contentType: 'image/png' },
        undefined,
        1,
      ),
    ).toBe(true);
  });

  it('returns true when contentType is absent (no type to check)', () => {
    expect(
      isFileSelectable({ name: 'file', contentLength: 100 }, ['image/*']),
    ).toBe(true);
  });
});

describe('Dial UI Kit :: formatAllowedFileTypesForTooltip', () => {
  it('returns empty string for undefined', () => {
    expect(formatAllowedFileTypesForTooltip(undefined)).toBe('');
  });

  it('returns empty string for empty array', () => {
    expect(formatAllowedFileTypesForTooltip([])).toBe('');
  });

  it('converts application/ MIME types to dot-extension', () => {
    expect(formatAllowedFileTypesForTooltip(['application/pdf'])).toBe('.pdf');
    expect(formatAllowedFileTypesForTooltip(['application/json'])).toBe(
      '.json, .map',
    );
    expect(formatAllowedFileTypesForTooltip(['application/*'])).toBe(
      'applications',
    );
  });

  it('keeps text/ MIME types as-is', () => {
    expect(formatAllowedFileTypesForTooltip(['text/plain'])).toBe(
      '.txt, .text, .conf, .def, .list, .log, .in, .ini',
    );
    expect(formatAllowedFileTypesForTooltip(['text/csv'])).toBe('.csv');
    expect(formatAllowedFileTypesForTooltip(['text/*'])).toBe('texts');
  });

  it('converts other MIME types to dot-extension', () => {
    expect(formatAllowedFileTypesForTooltip(['image/png'])).toBe('.png');
    expect(formatAllowedFileTypesForTooltip(['image/*'])).toBe('images');
    expect(formatAllowedFileTypesForTooltip(['audio/mpeg'])).toBe(
      '.mpga, .mp2, .mp2a, .mp3, .m2a, .m3a',
    );
  });

  it('handles mixed types correctly', () => {
    expect(
      formatAllowedFileTypesForTooltip([
        '.svg',
        'svg' as DialFileAcceptType,
        'application/pdf',
        'text/plain',
        'image/png',
      ]),
    ).toBe('.pdf, .txt, .text, .conf, .def, .list, .log, .in, .ini, .png');
  });
});

describe('Dial UI Kit :: getNextFolderName', () => {
  it('returns "New folder 1" if there are no existing sibling folders', () => {
    expect(getNextFolderName([])).toBe('New folder 1');
  });

  it('returns "New folder 2" if "New folder 1" already exists', () => {
    const existing: DialFile[] = [
      {
        name: 'New folder 1',
        nodeType: DialFileNodeType.FOLDER,
        id: '1',
        path: 'root/New folder 1',
      } as DialFile,
    ];
    expect(getNextFolderName(existing)).toBe('New folder 2');
  });

  it('increments max number even if there are gaps', () => {
    const existing: DialFile[] = [
      {
        name: 'New folder 1',
        nodeType: DialFileNodeType.FOLDER,
        id: '1',
        path: 'root/New folder 1',
      } as DialFile,
      {
        name: 'New folder 3',
        nodeType: DialFileNodeType.FOLDER,
        id: '3',
        path: 'root/New folder 3',
      } as DialFile,
    ];
    expect(getNextFolderName(existing)).toBe('New folder 4');
  });

  it('skips non-matching folder names', () => {
    const existing: DialFile[] = [
      {
        name: 'Other folder',
        nodeType: DialFileNodeType.FOLDER,
        id: '1',
        path: 'root/Other folder',
      } as DialFile,
    ];
    expect(getNextFolderName(existing)).toBe('New folder 1');
  });
});

describe('Dial UI Kit :: getFolderNestingDepth', () => {
  it('returns 1 for root folder', () => {
    expect(getFolderNestingDepth('public/')).toBe(1);
    expect(getFolderNestingDepth('public')).toBe(1);
  });

  it('returns 3 for third-level folder', () => {
    expect(getFolderNestingDepth('public/folder1/folder2')).toBe(3);
    expect(getFolderNestingDepth('public/folder1/folder2/')).toBe(3);
  });

  it('returns 5 for fifth-level folder', () => {
    expect(getFolderNestingDepth('public/a/b/c/d')).toBe(5);
    expect(getFolderNestingDepth('public/a/b/c/d/')).toBe(5);
  });
});

describe('Dial UI Kit :: excludePathsFromTree', () => {
  const tree: DialFile[] = [
    {
      id: 'documents',
      folderId: 'documents',
      name: 'Documents',
      path: '/Documents',
      nodeType: DialFileNodeType.FOLDER,
      parentPath: '/',
      items: [
        {
          id: 'report',
          folderId: 'documents',
          name: 'report.pdf',
          path: '/Documents/report.pdf',
          nodeType: DialFileNodeType.ITEM,
          parentPath: '/Documents',
        },
      ],
    },
    {
      id: 'photos',
      folderId: 'photos',
      name: 'Photos',
      path: '/Photos',
      nodeType: DialFileNodeType.FOLDER,
      parentPath: '/',
      items: [
        {
          id: 'vacation',
          folderId: 'vacation',
          name: 'Vacation',
          path: '/Photos/Vacation',
          nodeType: DialFileNodeType.FOLDER,
          parentPath: '/Photos',
        },
      ],
    },
  ];

  it('returns the same items when no excluded paths are provided', () => {
    expect(excludePathsFromTree(tree)).toBe(tree);
  });

  it('returns an empty array when nodes are undefined', () => {
    expect(excludePathsFromTree(undefined, ['/Photos'])).toEqual([]);
  });

  it('removes a top-level (root) folder by path', () => {
    const result = excludePathsFromTree(tree, ['/Photos']);

    expect(result.map((n) => n.path)).toEqual(['/Documents']);
  });

  it('removes the excluded folder along with its entire subtree', () => {
    const result = excludePathsFromTree(tree, ['/Photos']);

    expect(
      result.some((n) =>
        n.items?.some((child) => child.path === '/Photos/Vacation'),
      ),
    ).toBe(false);
  });

  it('removes a nested item without affecting its unrelated siblings', () => {
    const result = excludePathsFromTree(tree, ['/Photos/Vacation']);

    expect(result.map((n) => n.path)).toEqual(['/Documents', '/Photos']);
    expect(result.find((n) => n.path === '/Photos')?.items).toEqual([]);
  });

  it('supports excluding multiple paths at once', () => {
    const result = excludePathsFromTree(tree, [
      '/Documents',
      '/Photos/Vacation',
    ]);

    expect(result.map((n) => n.path)).toEqual(['/Photos']);
    expect(result[0].items).toEqual([]);
  });

  it('does not mutate the original tree', () => {
    excludePathsFromTree(tree, ['/Photos/Vacation']);

    expect(tree.find((n) => n.path === '/Photos')?.items).toHaveLength(1);
  });
});
