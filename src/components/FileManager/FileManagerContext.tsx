import { createContext } from 'react';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import type {
  FileTreeOptions,
  NavigationPanelOptions,
  GridOptions,
  ToolbarOptions,
  BulkActionsToolbarOptions,
  DialFileManagerProps,
} from './FileManager';

export interface FileManagerGridRow {
  id: string;
  name: string;
  updatedAt?: string;
  size?: string;
  author?: string;
  path: string;
  nodeType: DialFileNodeType;
  extension?: string;
}

export interface FileManagerContextValue {
  cssClass?: string;
  items: DialFile[];
  treeOptions?: FileTreeOptions;
  navigationPanelOptions?: NavigationPanelOptions;
  gridOptions?: GridOptions;
  toolbarOptions?: ToolbarOptions;
  bulkActionsToolbarOptions?: BulkActionsToolbarOptions;

  currentPath?: string;
  setCurrentPath: (p?: string) => void;

  searchValue: string;
  effectiveSearchValue: string;
  setSearchValue: (v: string) => void;

  areHiddenFilesVisible: boolean;
  toggleHiddenFilesVisibility: () => void;

  isTreeCollapsed: boolean;
  toggleTreeCollapse: () => void;
  setIsTreeCollapsed: (value: boolean) => void;

  selectedIds: Set<string>;
  setSelectedIds: (next: Set<string>) => void;
  clearSelection: () => void;

  currentFolder?: DialFile;
  gridRows: FileManagerGridRow[];

  clipboard: {
    copied: Set<string>;
    cut: Set<string>;
    hasItems: boolean;
  };
  onCopy: (files: string[]) => void;
  onCut: (files: string[]) => void;
  onPaste: (overwrite?: boolean) => void;

  renamedPath?: string;
  onRename: (file: string) => void;
  onRenameSave: (value: string) => void;
  onRenameCancel: () => void;
  onRenameValidate: (value: string, item: DialFile) => string | null;

  handlePathChange: (nextPath?: string) => void;
  handleTreeItemClick: (item: DialFile) => void;
  handleBreadcrumbItemClick: (href?: string) => void;
  handleSearchChange: (value?: string) => void;
  handleTableRowClick: (row: FileManagerGridRow) => void;

  onTableFileClick?: DialFileManagerProps['onTableFileClick'];
}

export const FileManagerContext = createContext<
  FileManagerContextValue | undefined
>(undefined);
