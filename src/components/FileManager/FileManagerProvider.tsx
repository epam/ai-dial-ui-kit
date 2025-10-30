import {
  type FC,
  type ReactNode,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import {
  collectAllDescendants,
  findFolderForPath,
  isHiddenDotFile,
  normalizeExtensionWithoutDot,
  normalizeToLowerCase,
} from './utils';
import { useShowHiddenFiles } from './hooks/use-show-hidden-files';
import { useCollapseTree } from './hooks/use-collapse-tree';
import { useFileClipboard } from './hooks/use-file-clipboard';
import {
  FileManagerContext,
  type FileManagerContextValue,
  type FileManagerGridRow,
} from './FileManagerContext';
import type { DialFileManagerProps } from './FileManager';

/**
 * Formats bytes into a short, human-readable string.
 */
const formatBytes = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return '-';
  const KB = 1024;
  const MB = KB * 1024;
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  if (bytes >= KB) return `${(bytes / KB).toFixed(0)} KB`;
  return `${bytes} B`;
};

export interface FileManagerProviderProps
  extends Omit<DialFileManagerProps, 'children'> {
  children: ReactNode;
}

/**
 * Provider that encapsulates all File Manager business logic:
 * - path & navigation
 * - search (controlled + uncontrolled)
 * - hidden files toggle
 * - tree collapsed state
 * - selection
 * - clipboard (copy / cut / paste)
 * - computed grid rows
 *
 */
export const FileManagerProvider: FC<FileManagerProviderProps> = ({
  children,
  cssClass,
  items = [],
  path,
  treeOptions,
  navigationPanelOptions,
  gridOptions,
  toolbarOptions,
  bulkActionsToolbarOptions,
  onPathChange,
  onTableFileClick,
  onCopyFiles,
  onMoveToFiles,
}) => {
  const [currentPath, setCurrentPath] = useState<string | undefined>(path);
  useEffect(() => {
    setCurrentPath(path);
  }, [path]);

  const { areHiddenFilesVisible, toggleHiddenFilesVisibility } =
    useShowHiddenFiles();

  const { isTreeCollapsed, toggleTreeCollapse } = useCollapseTree(
    treeOptions?.collapsed ?? false,
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const [searchValue, setSearchValue] = useState<string>('');
  useEffect(() => {
    const external = navigationPanelOptions?.value;
    if (external != null) {
      setSearchValue(String(external));
    }
  }, [navigationPanelOptions?.value]);

  const effectiveSearchValue = String(
    navigationPanelOptions?.value ?? searchValue ?? '',
  ).trim();

  const currentFolder = useMemo(
    () => findFolderForPath(items, currentPath) ?? items[0],
    [items, currentPath],
  );

  const {
    state: clipboard,
    copy: onCopy,
    cut: onCut,
    paste: onPaste,
  } = useFileClipboard({
    getDestination: () => currentFolder?.path ?? '/',
    onCopyFiles,
    onMoveToFiles,
  });

  const gridRows: FileManagerGridRow[] = useMemo(() => {
    const query = normalizeToLowerCase(effectiveSearchValue).trim();

    const directChildren = currentFolder?.items ?? [];
    let source: DialFile[] = query
      ? collectAllDescendants(currentFolder)
      : directChildren;

    if (!areHiddenFilesVisible) {
      source = source.filter((node) => !isHiddenDotFile(node));
    }

    const mapped = source.map((node) => ({
      id: node.id ?? node.path,
      name: node.name ?? node.path.split('/').pop() ?? '',
      updatedAt: node.updatedAt,
      size:
        node.nodeType === DialFileNodeType.ITEM
          ? formatBytes(node.contentLength)
          : '-',
      author: node.author,
      path: node.path,
      nodeType: node.nodeType,
      extension: node.extension,
    }));

    if (!query) return mapped;

    const tokens = query.split(/\s+/).filter(Boolean);
    return mapped.filter((row) => {
      const nameLower = normalizeToLowerCase(row.name);
      const authorLower = normalizeToLowerCase(row.author);
      const extLower = normalizeExtensionWithoutDot(row.extension);
      return tokens.every(
        (t) =>
          nameLower.includes(t) ||
          authorLower.includes(t) ||
          extLower.includes(t),
      );
    });
  }, [currentFolder, effectiveSearchValue, areHiddenFilesVisible]);

  const handlePathChange = useCallback(
    (nextPath?: string) => {
      setCurrentPath(nextPath);
      onPathChange?.(nextPath);
      clearSelection();
    },
    [onPathChange, clearSelection],
  );

  const handleTreeItemClick = useCallback(
    (item: DialFile) => {
      handlePathChange(item.path);
    },
    [handlePathChange],
  );

  const handleBreadcrumbItemClick = useCallback(
    (href?: string) => {
      handlePathChange(href);
    },
    [handlePathChange],
  );

  const handleSearchChange = useCallback(
    (value?: string) => {
      const next = String(value ?? '');
      setSearchValue(next);
      navigationPanelOptions?.onSearchChange?.(next);
    },
    [navigationPanelOptions],
  );

  const handleTableRowClick = useCallback(
    (row: FileManagerGridRow) => {
      if (row.nodeType === DialFileNodeType.FOLDER) {
        handlePathChange(row.path);
      } else {
        onTableFileClick?.(row);
      }
    },
    [handlePathChange, onTableFileClick],
  );

  const value: FileManagerContextValue = {
    cssClass,
    items,
    treeOptions,
    navigationPanelOptions,
    gridOptions,
    toolbarOptions,
    bulkActionsToolbarOptions,

    currentPath,
    setCurrentPath,

    searchValue,
    effectiveSearchValue,
    setSearchValue,

    areHiddenFilesVisible,
    toggleHiddenFilesVisibility,

    isTreeCollapsed,
    toggleTreeCollapse,

    selectedIds,
    setSelectedIds,
    clearSelection,

    currentFolder,
    gridRows,

    clipboard,
    onCopy,
    onCut,
    onPaste,

    handlePathChange,
    handleTreeItemClick,
    handleBreadcrumbItemClick,
    handleSearchChange,
    handleTableRowClick,
    onTableFileClick,
  };

  return (
    <FileManagerContext.Provider value={value}>
      {children}
    </FileManagerContext.Provider>
  );
};
