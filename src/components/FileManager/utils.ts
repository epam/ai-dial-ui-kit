import { DialFileNodeType, type DialFile } from '@/models/file';
import type { CopiedItem } from '@/types/file-manager';

const findNodeByPath = (
  nodes: DialFile[] | undefined,
  path?: string,
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

const findDestinationFolder = (
  allFiles: DialFile[],
  destinationPath: string,
): DialFile | undefined => {
  const findItemByPath = (
    items: DialFile[],
    targetPath: string,
  ): DialFile | undefined => {
    for (const item of items) {
      if (item.path === targetPath) {
        return item;
      }
      if (item.items) {
        const found = findItemByPath(item.items, targetPath);
        if (found) return found;
      }
    }
    return undefined;
  };

  return findItemByPath(allFiles, destinationPath);
};

/**
 * Recursively collects all files from folders with their relative paths
 */
const collectFilesFromPath = (
  path: string,
  allFiles: DialFile[],
): { file: DialFile; relativePath: string }[] => {
  const result: { file: DialFile; relativePath: string }[] = [];

  const findItemByPath = (
    items: DialFile[],
    targetPath: string,
  ): DialFile | undefined => {
    for (const item of items) {
      if (item.path === targetPath) {
        return item;
      }
      if (item.items) {
        const found = findItemByPath(item.items, targetPath);
        if (found) return found;
      }
    }
    return undefined;
  };

  const item = findItemByPath(allFiles, path);
  if (!item) return result;

  if (item.nodeType === DialFileNodeType.ITEM) {
    result.push({ file: item, relativePath: item.name });
  } else if (item.nodeType === DialFileNodeType.FOLDER && item.items) {
    const folderName = item.name;

    const collectFromFolder = (
      folder: DialFile,
      currentRelativePath: string,
    ): void => {
      if (folder.items) {
        for (const child of folder.items) {
          const childRelativePath = `${currentRelativePath}/${child.name}`;

          if (child.nodeType === DialFileNodeType.ITEM) {
            result.push({ file: child, relativePath: childRelativePath });
          } else if (child.nodeType === DialFileNodeType.FOLDER) {
            collectFromFolder(child, childRelativePath);
          }
        }
      }
    };

    collectFromFolder(item, folderName);
  }

  return result;
};

/**
 * Resolves filename conflicts by adding (1), (2), etc.
 */
const resolveNameConflict = (
  originalName: string,
  existingNames: Set<string>,
): string => {
  if (!existingNames.has(originalName)) {
    return originalName;
  }

  const lastDotIndex = originalName.lastIndexOf('.');
  const hasExtension = lastDotIndex > 0;

  const baseName = hasExtension
    ? originalName.substring(0, lastDotIndex)
    : originalName;
  const extension = hasExtension ? originalName.substring(lastDotIndex) : '';

  let counter = 1;
  let newName: string;

  do {
    newName = `${baseName} (${counter})${extension}`;
    counter++;
  } while (existingNames.has(newName));

  return newName;
};

/**
 * Recursively builds a set of all existing paths in destination
 */
const buildExistingPathsSet = (
  destinationFolder: DialFile | undefined,
  basePath = '',
): Set<string> => {
  const paths = new Set<string>();

  if (!destinationFolder?.items) return paths;

  for (const item of destinationFolder.items) {
    const itemPath = basePath ? `${basePath}/${item.name}` : item.name;
    paths.add(itemPath);

    if (item.nodeType === DialFileNodeType.FOLDER && item.items) {
      const subPaths = buildExistingPathsSet(item, itemPath);
      subPaths.forEach((path) => paths.add(path));
    }
  }

  return paths;
};

export const getCopiedItems = (
  destinationUrl: string,
  paths: string[],
  allFiles: DialFile[],
): CopiedItem[] => {
  const allFilesToCopy: { file: DialFile; relativePath: string }[] = [];

  for (const path of paths) {
    const filesFromPath = collectFilesFromPath(path, allFiles);
    allFilesToCopy.push(...filesFromPath);
  }

  const destinationFolder = findDestinationFolder(allFiles, destinationUrl);

  const existingPaths = buildExistingPathsSet(destinationFolder);

  const resolvedPaths = new Set<string>();

  return allFilesToCopy.map(({ file, relativePath }) => {
    const allConflictPaths = new Set([...existingPaths, ...resolvedPaths]);

    const resolvedRelativePath = resolveNameConflict(
      relativePath,
      allConflictPaths,
    );
    resolvedPaths.add(resolvedRelativePath);

    return {
      sourceUrl: file.path,
      destinationUrl: `${destinationUrl}/${resolvedRelativePath}`,
    };
  });
};
