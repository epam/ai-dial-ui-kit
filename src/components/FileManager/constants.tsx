import { FileManagerColumnKey } from '@/types/file-manager.ts';

export const containerBaseClassName =
  'w-full h-full grid grid-rows-[auto_1fr] gap-5 p-6 overflow-hidden min-w-0 bg-layer-1';

export const toolbarBaseClassName =
  'w-full text-secondary flex items-center gap-2';

export const mainGridClassName =
  'flex min-h-0 min-w-0 h-full gap-4 overflow-hidden';

export const contentGridClassName =
  'flex flex-col flex-1 min-h-0 min-w-0 h-full gap-4';

export const contentHeaderClassName = 'items-center';

export const treeBaseClassName =
  'h-full rounded bg-layer-3 text-secondary min-w-0';

export const gridBaseClassName =
  'flex-1 w-full rounded text-secondary overflow-auto min-h-0 min-w-0';

export const actionsColumnButtonClassName =
  'opacity-0 pointer-events-none group-hover/grid-row:opacity-100 group-hover/grid-row:pointer-events-auto';

export const sidebarWidth = 280;
export const sidebarTitleDefault = 'Files';

export const BASE_FILE_MANAGER_ICON_SIZE = 20;

export const FILES_DATA_TRANSFER_TYPE = 'Files';

export const FOLDER_PLACEHOLDER_FILE_NAME = '.dial_folder';

export const DEFAULT_FOLDER_BASE_NAME = 'New folder';

export const FOLDERS_TREE_PANEL_MIN_WIDTH = 280;

export const FOLDERS_TREE_PANEL_MAX_WIDTH = 460;

export const COMPACT_VIEW_HEADER_HEIGHT = 44;

export const COMPACT_VIEW_FILE_ROW_HEIGHT = 56;

export const DEFAULT_COMPACT_VIEW_WIDTH_BREAKPOINT = 800;

export const DEFAULT_VISIBLE_COLUMN = [
  FileManagerColumnKey.Name,
  FileManagerColumnKey.UpdatedAt,
  FileManagerColumnKey.Size,
  FileManagerColumnKey.Author,
  FileManagerColumnKey.Actions,
];
