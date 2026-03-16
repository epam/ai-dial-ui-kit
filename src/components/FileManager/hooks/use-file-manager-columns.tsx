import { useMemo } from 'react';
import type { ColDef, SuppressKeyboardEventParams } from 'ag-grid-community';
import { type DialFile } from '@/models/file';
import { FileManagerRenameTriggerView } from '@/types/file-manager';
import { FileManagerColumnKey } from '@/types/file-manager';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import type { FileManagerGridRow } from '@/components/FileManager/FileManagerContext';
import {
  NAME_COLUMN,
  UPDATED_AT_COLUMN,
  SIZE_COLUMN,
} from '@/constants/file-grid-columns';

type GridRow = FileManagerGridRow;

export interface FileManagerGridContext {
  newFolderTempId?: string;
  renamedPath?: string;
  renamedItem?: DialFile;
  renameTriggerView: FileManagerRenameTriggerView;
  sharedByMePaths?: Set<string>;
  selectedPaths?: Set<string>;
  nameValidationRegExp?: RegExp;

  cancelFolderCreation: () => void;
  saveFolderCreation: (name: string) => Promise<void>;
  validateFolderName: (name: string) => string | null;

  onRenameValidate: (value: string, item: DialFile) => string | null;
  onRenameSave: (value: string) => void;
  onRenameCancel: () => void;

  getDisplayName: (item: DialFile) => string;
}

export interface UseFileManagerColumnsArgs {
  userColumnDefs?: (
    | ColDef<GridRow>
    | ((
        dateLocale: Intl.LocalesArgument,
        dateOptions: Intl.DateTimeFormatOptions | undefined,
        isCompactView: boolean,
      ) => ColDef<GridRow, unknown>)
  )[];
  filterable: boolean;
  dateLocale?: Intl.LocalesArgument;
  dateOptions?: Intl.DateTimeFormatOptions;

  effectiveVisibleColumns: FileManagerColumnKey[];
  isCompactView: boolean;

  hasActions: boolean;
  actionsColumnDef: ColDef<GridRow>;

  rootItemPath?: string;
  rootItemLabel?: string;
}

export interface UseFileManagerColumnsResult {
  columnDefs: ColDef<GridRow>[];
}

const suppressKeyboardEventForInput = (
  params: SuppressKeyboardEventParams<GridRow>,
) => {
  const e = params.event as KeyboardEvent | undefined;
  const target = (e?.target ?? null) as HTMLElement | null;

  const input = target?.closest('input');
  if (!input || !e) return false;

  switch (e.key) {
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'ArrowUp':
    case 'ArrowDown':
    case 'Home':
    case 'End':
      return true;
    default:
      return false;
  }
};

export function useFileManagerColumns({
  userColumnDefs,
  filterable,
  dateLocale,
  dateOptions,
  effectiveVisibleColumns,
  isCompactView,
  hasActions,
  actionsColumnDef,
  rootItemLabel,
  rootItemPath,
}: UseFileManagerColumnsArgs): UseFileManagerColumnsResult {
  const defaultColumns = useMemo<ColDef<GridRow>[]>(() => {
    return [
      NAME_COLUMN('Name')(dateLocale, dateOptions, isCompactView),
      {
        colId: FileManagerColumnKey.Path,
        field: 'path',
        headerName: 'Path',
        flex: 1,
        minWidth: 200,
        cellRenderer: (params: { data: GridRow }) => {
          if (!rootItemPath || !rootItemLabel) {
            return <DialEllipsisTooltip text={params.data.path} />;
          }
          const path = params.data.path.replace(rootItemPath, rootItemLabel);
          return <DialEllipsisTooltip text={path} />;
        },
      },
      UPDATED_AT_COLUMN('Modified Date')(dateLocale, dateOptions),
      SIZE_COLUMN('Size'),
      {
        colId: FileManagerColumnKey.Author,
        field: 'author',
        headerName: 'Author',
        width: 200,
        suppressSizeToFit: true,
        cellRenderer: (params: { data: GridRow }) => {
          return params.data.author;
        },
      },
      {
        colId: FileManagerColumnKey.Owner,
        field: 'owner',
        headerName: 'Owner',
        width: 200,
        suppressSizeToFit: true,
        cellRenderer: (params: { data: GridRow }) => {
          return params.data.owner;
        },
      },
    ];
  }, [dateLocale, dateOptions, isCompactView, rootItemLabel, rootItemPath]);

  const columnDefs = useMemo<ColDef<GridRow>[]>(() => {
    const processedUserColumns = userColumnDefs?.map(
      (
        column:
          | ColDef<FileManagerGridRow, unknown>
          | ((
              dateLocale: Intl.LocalesArgument,
              dateOptions: Intl.DateTimeFormatOptions | undefined,
              isCompactView: boolean,
            ) => ColDef<FileManagerGridRow, unknown>),
      ) => {
        return typeof column === 'function'
          ? column(dateLocale, dateOptions, isCompactView)
          : column;
      },
    );

    let columns = processedUserColumns ?? defaultColumns;

    if (!processedUserColumns) {
      columns = columns.filter(
        (col) =>
          col.colId &&
          effectiveVisibleColumns.includes(col.colId as FileManagerColumnKey),
      );
    }

    if (hasActions) {
      if (isCompactView) {
        columns = columns.slice(0, 1);
        columns.push(actionsColumnDef);
      } else {
        columns.push(actionsColumnDef);
      }
    }

    const isNameCol = (col: ColDef<GridRow>) =>
      col.colId === FileManagerColumnKey.Name;

    return columns.map((col) => {
      const next: ColDef<GridRow> = {
        ...col,
        filter: filterable ? col.filter : false,
        floatingFilter: filterable ? col.floatingFilter : false,
      };

      if (isNameCol(col) && !col.suppressKeyboardEvent) {
        next.suppressKeyboardEvent = suppressKeyboardEventForInput;
      }

      return next;
    });
  }, [
    actionsColumnDef,
    dateLocale,
    dateOptions,
    defaultColumns,
    effectiveVisibleColumns,
    filterable,
    hasActions,
    isCompactView,
    userColumnDefs,
  ]);

  return { columnDefs };
}
