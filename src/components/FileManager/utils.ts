import { DialFileNodeType, type DialFile } from '@/models/file';

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

export const formatBytes = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return '-';
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  if (bytes >= megabyte) return `${(bytes / megabyte).toFixed(1)} MB`;
  if (bytes >= kilobyte) return `${(bytes / kilobyte).toFixed(0)} KB`;
  return `${bytes} B`;
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
