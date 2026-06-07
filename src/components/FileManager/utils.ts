import { DialFileNodeType, type DialFile } from '@/models/file';
import type { DialFileAcceptType } from '@/models/file-manager';
import { extensions } from 'mime-types';
import type { ReactNode } from 'react';
import { DEFAULT_FOLDER_BASE_NAME } from './constants';
import type { FileManagerGridRow } from './FileManagerContext';

export const findNodeByPath = (
  nodes: DialFile[] | undefined,
  path: string,
): DialFile | undefined => {
  if (!nodes || !nodes.length || !path) return undefined;
  for (const n of nodes) {
    if (n.path === path) return n;
    const found = findNodeByPath(n.items, path);
    if (found) return found;
  }
  return undefined;
};

export const findFolderForPath = (
  root: DialFile[] | undefined,
  path?: string,
): DialFile | undefined => {
  if (!root?.length) return undefined;
  if (!path) return root[0];
  const node = findNodeByPath(root, path);
  if (node && node.nodeType === DialFileNodeType.FOLDER) return node;

  const parts = path.split('/').filter(Boolean);
  if (parts.length <= 1) return root[0];
  const parentPath = '/' + parts.slice(0, parts.length - 1).join('/');
  return findNodeByPath(root, parentPath) ?? root[0];
};

export const normalizeToLowerCase = (input?: string): string =>
  (input ?? '').toLowerCase();

export const normalizeExtensionWithoutDot = (input?: string): string =>
  normalizeToLowerCase(input).replace(/^\./, '');

export const collectAllDescendants = (folder?: DialFile): DialFile[] => {
  if (!folder) return [];
  const result: DialFile[] = [];
  const walk = (node: DialFile) => {
    const children = node.items ?? [];
    for (const child of children) {
      result.push(child);
      if (child.nodeType === DialFileNodeType.FOLDER) {
        walk(child);
      }
    }
  };
  walk(folder);
  return result;
};

export const isHiddenDotFile = (node: DialFile) => {
  const name = node.name ?? node.path.split('/').pop() ?? '';
  return name.startsWith('.');
};

/**
 * Formats bytes into a short, human-readable string.
 *
 * @param bytes - Number of bytes to format
 * @returns Formatted string (e.g., "15.0 MB", "150 KB", "512 bytes")
 *
 * @example
 * ```ts
 * formatBytes(2150) // "2 KB"
 * formatBytes(15728640) // "15.0 MB"
 * formatBytes(512) // "512 bytes"
 * ```
 */
export const formatBytes = (bytes?: number): string => {
  if (!bytes) return '0 bytes';
  const KB = 1024;
  const MB = KB * 1024;
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  if (bytes >= KB) return `${(bytes / KB).toFixed(0)} KB`;
  return `${bytes} bytes`;
};

/**
 * Formats date string into a localized date string.
 *
 * @param date - ISO date string or any valid date string
 * @param locale - BCP 47 language tag (e.g., 'en-US', 'ru-RU')
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string or original string if formatting fails
 *
 * @example
 * ```ts
 * formatDate('2025-09-05T10:30:00Z', 'en-US', { year: 'numeric', month: 'short', day: '2-digit' })
 * // "Sep 05, 2025"
 *
 * formatDate('2025-09-05T10:30:00Z', 'ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })
 * // "5 сентября 2025 г."
 * ```
 */
export const formatDate = (
  date?: string,
  locale: Intl.LocalesArgument = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  },
): string => {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
  } catch {
    return date;
  }
};

export function isFileAccepted(
  allowedFileTypes: DialFileAcceptType[] | undefined,
  contentType: string,
  fileName?: string,
): boolean {
  if (!allowedFileTypes || allowedFileTypes.includes('*/*')) {
    return true;
  }

  const normalizedType = contentType.toLowerCase();

  const extension =
    fileName && fileName.includes('.')
      ? `.${fileName.split('.').at(-1)!.toLowerCase()}`
      : undefined;

  return allowedFileTypes.some((rule) => {
    const normalizedRule = rule.toLowerCase();

    if (normalizedRule.startsWith('.')) {
      return extension === normalizedRule;
    }

    if (normalizedRule.endsWith('/*')) {
      const baseType = normalizedRule.slice(0, -1);
      return normalizedType.startsWith(baseType);
    }

    return normalizedType === normalizedRule;
  });
}

export const formatAllowedFileTypesForTooltip = (
  allowedFileTypes: DialFileAcceptType[] | undefined,
): string => {
  return (
    allowedFileTypes
      ?.map((type) => {
        if (type.endsWith('/*')) {
          return type.replace('/*', 's');
        }

        return getExtensionsListForMimeType(type)
          .flat()
          .map((type) => `.${type}`);
      })
      .flat()
      .join(', ') || ''
  );
};

export const getExtensionsListForMimeType = (mimeType: string) => {
  const [subset, name] = mimeType.split('/');

  if (subset === '*') {
    return ['all'];
  } else if (name === '*') {
    return Object.entries(extensions).reduce((acc, [key, value]) => {
      const [keySubset] = key.split('/');
      if (keySubset === subset) {
        acc.push(...value);
      }

      return acc;
    }, [] as string[]);
  } else {
    return extensions[mimeType] || [];
  }
};

export const cleanForbiddenSymbolsRegExp = (
  forbiddenSymbolsRegExp?: RegExp,
) => {
  if (!forbiddenSymbolsRegExp) return undefined;

  const flags = forbiddenSymbolsRegExp.flags.replace(/[gy]/g, '');
  return new RegExp(forbiddenSymbolsRegExp.source, flags);
};

export function getForbiddenSymbolsTooltip(
  item: { name: string; isFolder: boolean },
  forbiddenSymbolsRegExp?: RegExp,
  forbiddenSymbolsTooltip?: ReactNode,
): ReactNode | undefined {
  if (!forbiddenSymbolsRegExp) return undefined;

  if (cleanForbiddenSymbolsRegExp(forbiddenSymbolsRegExp)?.test(item.name)) {
    return (
      forbiddenSymbolsTooltip ??
      `This ${item.isFolder ? 'folder' : 'file'} contains forbidden characters in its name. Please rename it.`
    );
  }
  return undefined;
}

export const splitPathAndName = (
  fullPath: string,
): { parent: string; name: string } => {
  const lastSlash = fullPath.lastIndexOf('/');
  return lastSlash >= 0
    ? {
        parent: fullPath.slice(0, lastSlash),
        name: fullPath.slice(lastSlash + 1),
      }
    : { parent: '', name: fullPath };
};

export const isFileSelectable = (
  file: Pick<DialFile, 'contentLength' | 'contentType' | 'name'>,
  allowedFileTypes?: DialFileAcceptType[],
  maxSelectableFileSize?: number,
): boolean => {
  const isSizeOk =
    !file.contentLength ||
    maxSelectableFileSize == null ||
    file.contentLength <= maxSelectableFileSize;

  const isTypeOk =
    !file.contentType ||
    isFileAccepted(allowedFileTypes, file.contentType, file.name);

  return isSizeOk && isTypeOk;
};

export const getRowTooltip = (
  file: FileManagerGridRow,
  allowedFileTypes?: DialFileAcceptType[],
  maxSelectableFileSize?: number,
  unsupportedFileTypeTooltip?: string,
  fileTooLargeTooltip?: string,
): string | undefined => {
  if (file.nodeType === DialFileNodeType.FOLDER) return undefined;

  const isFileSizeAccepted =
    !file.contentLength ||
    maxSelectableFileSize == null ||
    file.contentLength <= maxSelectableFileSize;

  const isFileTypeAccepted =
    !file.contentType ||
    isFileAccepted(allowedFileTypes, file.contentType, file.name);

  if (!isFileTypeAccepted) {
    return (
      unsupportedFileTypeTooltip ??
      (allowedFileTypes?.length
        ? `Unsupported file type. Supported types: ${formatAllowedFileTypesForTooltip(allowedFileTypes)}.`
        : 'Unsupported file type.')
    );
  }
  if (!isFileSizeAccepted) {
    return (
      fileTooLargeTooltip ??
      `File is too large. Maximum size: ${formatBytes(maxSelectableFileSize!)}.`
    );
  }
  return undefined;
};

export const getFolderNestingDepth = (folderPath: string): number => {
  const segments = folderPath.replace(/\/+$/, '').split('/').filter(Boolean);
  return segments.length;
};

export const getNextFolderName = (existingFolders: DialFile[]): string => {
  const prefix = `${DEFAULT_FOLDER_BASE_NAME} `;
  const regex = new RegExp(`^${DEFAULT_FOLDER_BASE_NAME} (\\d+)$`);

  const existingNames = new Set(
    existingFolders.map((f) => f.name.toLowerCase()),
  );

  const maxNumber = existingFolders
    .map((f) => {
      const match = f.name.match(regex);
      return match ? parseInt(match[1], 10) : 0;
    })
    .reduce((max, n) => Math.max(max, n), 0);

  let candidate = `${prefix}${maxNumber + 1}`;
  let counter = maxNumber + 1;
  while (existingNames.has(candidate.toLowerCase())) {
    counter++;
    candidate = `${prefix}${counter}`;
  }

  return candidate;
};
