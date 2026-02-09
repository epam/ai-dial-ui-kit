import {
  type DialFile,
  DialFileNodeType,
  DialFileResourceType,
} from '@/models/file.ts';

interface FlatFileItem {
  name: string;
  parentPath?: string | null;
  bucket?: string;
  url?: string;
  path?: string;
  nodeType: string;
  resourceType?: string;
  updatedAt?: number;
  items?: unknown;
  contentLength?: number;
  contentType?: string;
}

export const DEFAULT_CONTENT_TYPE = 'application/octet-stream';

/**
 * Converts a flat list of file items into a hierarchical DialFile structure.
 * Handles both `url` and `path` fields, properly decodes URL-encoded paths.
 *
 * @example
 * ```ts
 * const flat = [
 *   { name: 'public', path: 'prompts/public/', nodeType: 'FOLDER', parentPath: '' },
 *   { name: 'AI-Assisted Engineering', url: 'prompts/public/AI-Assisted%20Engineering/', nodeType: 'FOLDER', parentPath: null }
 * ];
 * const hierarchical = convertFlatToHierarchical(flat);
 * ```
 */
export function convertFlatToHierarchical(
  flatItems: FlatFileItem[],
  rootFolderId: string,
): DialFile[] {
  if (!flatItems || flatItems.length === 0) {
    return [];
  }

  const rootFolder = flatItems.find(
    (item) => item.parentPath === '' && item.nodeType === 'FOLDER',
  );

  if (!rootFolder) {
    return [];
  }

  const rootPath = rootFolder.path || rootFolder.url || '';
  const normalizedRootPath = normalizePath(rootPath, true);

  const normalized = flatItems
    .filter((item) => item !== rootFolder)
    .map((item) => {
      const rawPath = item.path || item.url || '';
      const nodeType = normalizeNodeType(item.nodeType);
      const isFolder = nodeType === DialFileNodeType.FOLDER;
      const normalizedPath = normalizePath(rawPath, isFolder);

      let parentPath: string;
      if (item.parentPath === null || item.parentPath === undefined) {
        parentPath = normalizedRootPath;
      } else if (item.parentPath === '') {
        parentPath = '';
      } else {
        parentPath = normalizePath(item.parentPath, true);
      }

      return {
        ...item,
        originalPath: rawPath,
        path: normalizedPath,
        parentPath,
        nodeType,
      };
    });

  const itemMap = new Map<string, DialFile>();

  normalized.forEach((item) => {
    const dialFile: DialFile = {
      ...item,
      id: item.originalPath,
      name: item.name,
      path: item.path,
      parentPath: item.parentPath,
      nodeType: item.nodeType as DialFileNodeType,
      resourceType: normalizeResourceType(item.resourceType),
      folderId: rootFolderId,
      updatedAt: item.updatedAt
        ? new Date(item.updatedAt).toISOString()
        : new Date().toISOString(),
      items: item.nodeType === DialFileNodeType.FOLDER ? [] : undefined,
    };

    if (item.nodeType === DialFileNodeType.ITEM) {
      dialFile.extension = extractExtension(item.name);
      dialFile.contentType = item.contentType || DEFAULT_CONTENT_TYPE;
      dialFile.contentLength = item.contentLength || 0;
    }

    itemMap.set(item.path, dialFile);
  });

  const rootChildren: DialFile[] = [];

  itemMap.forEach((dialFile) => {
    if (dialFile.parentPath === normalizedRootPath) {
      rootChildren.push(dialFile);
    } else {
      const index = dialFile.path.lastIndexOf(dialFile.name || '');
      const path = dialFile.path.slice(0, index);
      const parent = itemMap.get(path);

      if (parent && parent.nodeType === DialFileNodeType.FOLDER) {
        parent.items = parent.items || [];
        parent.items.push(dialFile);
      } else {
        rootChildren.push(dialFile);
      }
    }
  });

  return rootChildren;
}

/**
 * Normalizes path: decodes URL encoding and ensures trailing slash only for folders
 */
function normalizePath(path: string, isFolder: boolean): string {
  try {
    // Decode URL-encoded path (e.g., %20 -> space)
    let normalized = decodeURIComponent(path);

    // Ensure trailing slash only for folders
    if (isFolder) {
      if (!normalized.endsWith('/')) {
        normalized += '/';
      }
    } else {
      // Remove trailing slash for files
      if (normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1);
      }
    }

    return normalized;
  } catch {
    if (isFolder && !path.endsWith('/')) {
      return path + '/';
    }
    if (!isFolder && path.endsWith('/')) {
      return path.slice(0, -1);
    }
    return path;
  }
}

/**
 * Normalizes node type strings to DialFileNodeType enum values
 */
function normalizeNodeType(nodeType: string): DialFileNodeType {
  const upperType = nodeType.toUpperCase();
  if (upperType === 'FOLDER') {
    return DialFileNodeType.FOLDER;
  }
  return DialFileNodeType.ITEM;
}

/**
 * Normalizes resource type strings to DialFileResourceType enum values
 */
function normalizeResourceType(
  resourceType?: string,
): DialFileResourceType | undefined {
  if (!resourceType) {
    return undefined;
  }

  const upperType = resourceType.toUpperCase();
  const validTypes = Object.values(DialFileResourceType);

  return validTypes.find((type) => type.toUpperCase() === upperType);
}

/**
 * Extracts file extension from filename
 */
function extractExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  return '';
}

/**
 * Helper to create a root folder wrapping flat items.
 * Useful when you want the entire tree to be nested under a single root.
 *
 * @example
 * ```ts
 * const wrapped = wrapInRootFolder(
 *   prompts,
 *   'Prompts',
 *   'prompts/public/',
 *   'prompts-root'
 * );
 * ```
 */
export function wrapInRootFolder(
  flatItems: FlatFileItem[],
  rootName = 'Prompts',
  rootPath = 'prompts/public/',
  rootFolderId = 'root',
): DialFile[] {
  const children = convertFlatToHierarchical(flatItems, rootFolderId);

  return [
    {
      id: rootFolderId,
      name: rootName,
      path: rootPath,
      parentPath: '',
      nodeType: DialFileNodeType.FOLDER,
      folderId: rootFolderId,
      items: children,
    },
  ];
}
