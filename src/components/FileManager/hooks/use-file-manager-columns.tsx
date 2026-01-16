import { mergeClasses } from '@/utils/merge-classes';
import { useMemo } from 'react';
import type { ColDef, SuppressKeyboardEventParams } from 'ag-grid-community';
import { DialFileNodeType, type DialFile } from '@/models/file';
import { DialFileName } from '@/components/FileName/FileName';
import { DialFolderName } from '@/components/FolderName/FolderName';
import { DialDateCellRenderer } from '@/components/Grid/renderers/DateCellRenderer';
import { FileManagerRenameTriggerView } from '@/types/file-manager';
import { DialFileManagerItemName } from '@/components/FileManager/components/FileManagerItemName/FileManagerItemName';
import { DialItemType } from '@/types/item';
import { DialFileManagerItemSummaryCell } from '@/components/FileManager/components/DialFileManagerItemSummaryCell/DialFileManagerItemSummaryCell';
import { FileManagerColumnKey } from '@/types/file-manager';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import type { FileManagerGridRow } from '@/components/FileManager/FileManagerContext';
import { BASE_FILE_MANAGER_ICON_SIZE } from '@/components/FileManager/constants';

type GridRow = FileManagerGridRow;

export interface FileManagerGridContext {
  newFolderTempId?: string;
  renamedPath?: string;
  renamedItem?: DialFile;
  renameTriggerView: FileManagerRenameTriggerView;
  sharedByMePaths?: Set<string>;
  selectedPaths?: Set<string>;

  cancelFolderCreation: () => void;
  saveFolderCreation: (name: string) => Promise<void>;
  validateFolderName: (name: string) => string | null;

  onRenameValidate: (value: string, item: DialFile) => string | null;
  onRenameSave: (value: string) => void;
  onRenameCancel: () => void;

  getDisplayName: (item: DialFile) => string;
}

export interface UseFileManagerColumnsArgs {
  userColumnDefs?: ColDef<GridRow>[];
  filterable: boolean;
  dateLocale?: Intl.LocalesArgument;
  dateOptions?: Intl.DateTimeFormatOptions;

  effectiveVisibleColumns: FileManagerColumnKey[];
  isCompactView: boolean;

  hasActions: boolean;
  actionsColumnDef: ColDef<GridRow>;
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
}: UseFileManagerColumnsArgs): UseFileManagerColumnsResult {
  const defaultColumns = useMemo<ColDef<GridRow>[]>(() => {
    return [
      {
        colId: FileManagerColumnKey.Name,
        field: 'name',
        headerName: 'Name',
        flex: 1,
        minWidth: 200,
        cellRenderer: (params: {
          data: GridRow;
          context: FileManagerGridContext;
        }) => {
          const type = params.data.nodeType;
          const {
            saveFolderCreation,
            validateFolderName,
            cancelFolderCreation,
            newFolderTempId,
            sharedByMePaths,
            selectedPaths,
          } = params.context;

          const isSharedByMe = sharedByMePaths?.has(params.data.path);
          const isSelected = selectedPaths?.has(params.data.path);

          const sharedIndicatorClassName = mergeClasses([
            'group-hover/grid-row:bg-accent-primary-alpha',
            isSelected && 'bg-accent-primary-alpha',
          ]);

          if (params.data?.isTemporary && params.data.id === newFolderTempId) {
            return (
              <DialFileManagerItemName
                name=""
                type={DialItemType.Folder}
                elementId={`new-folder-${params.data.id}`}
                editing={true}
                shared={isSharedByMe}
                sharedIndicatorClassName={sharedIndicatorClassName}
                iconSize={BASE_FILE_MANAGER_ICON_SIZE}
                validate={validateFolderName}
                onSave={saveFolderCreation}
                onCancel={cancelFolderCreation}
                inputContainerClassName={mergeClasses([
                  '!h-9',
                  isCompactView && type === DialFileNodeType.ITEM && '!h-10',
                ])}
              />
            );
          }

          const {
            renameTriggerView,
            renamedPath,
            renamedItem,
            getDisplayName,
            onRenameValidate,
            onRenameSave,
            onRenameCancel,
          } = params.context;

          const isBeingRenamed =
            renameTriggerView === FileManagerRenameTriggerView.Grid &&
            renamedPath === params.data?.path;

          if (isBeingRenamed && renamedItem && params.data) {
            const displayName = getDisplayName(renamedItem);
            return (
              <DialFileManagerItemName
                name={displayName}
                type={
                  type === DialFileNodeType.FOLDER
                    ? DialItemType.Folder
                    : DialItemType.File
                }
                elementId={`rename-${params.data.id}`}
                editing={true}
                shared={isSharedByMe}
                sharedIndicatorClassName={sharedIndicatorClassName}
                iconSize={BASE_FILE_MANAGER_ICON_SIZE}
                validate={(value) => onRenameValidate(value, renamedItem)}
                onSave={onRenameSave}
                onCancel={onRenameCancel}
                inputContainerClassName={mergeClasses([
                  '!h-9',
                  isCompactView && type === DialFileNodeType.ITEM && '!h-10',
                ])}
              />
            );
          }

          if (isCompactView) {
            return (
              <DialFileManagerItemSummaryCell
                id={params.data.id}
                name={params.data.name}
                nodeType={type}
                size={params.data.size}
                shared={isSharedByMe}
                sharedIndicatorClassName={sharedIndicatorClassName}
                updatedAt={params.data.updatedAt}
                dateLocale={dateLocale}
                dateOptions={dateOptions}
              />
            );
          }

          return type === DialFileNodeType.FOLDER ? (
            <DialFolderName
              name={params.data.name}
              shared={isSharedByMe}
              sharedIndicatorClassName={sharedIndicatorClassName}
              iconSize={BASE_FILE_MANAGER_ICON_SIZE}
            />
          ) : (
            <DialFileName
              name={params.data.name}
              shared={isSharedByMe}
              sharedIndicatorClassName={sharedIndicatorClassName}
              iconSize={BASE_FILE_MANAGER_ICON_SIZE}
            />
          );
        },
      },
      {
        colId: FileManagerColumnKey.Path,
        field: 'path',
        headerName: 'Path',
        flex: 1,
        minWidth: 200,
        cellRenderer: (params: { data: GridRow }) => {
          return <DialEllipsisTooltip text={params.data.path} />;
        },
      },
      {
        colId: FileManagerColumnKey.UpdatedAt,
        field: 'updatedAt',
        headerName: 'Modified Date',
        width: 168,
        suppressSizeToFit: true,
        cellRenderer: DialDateCellRenderer,
        cellRendererParams: {
          locale: dateLocale,
          options: dateOptions,
        },
      },
      {
        colId: FileManagerColumnKey.Size,
        field: 'size',
        headerName: 'Size',
        width: 120,
        suppressSizeToFit: true,
      },
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
  }, [dateLocale, dateOptions, isCompactView]);

  const columnDefs = useMemo<ColDef<GridRow>[]>(() => {
    let columns = userColumnDefs ?? defaultColumns;

    if (!userColumnDefs) {
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
    defaultColumns,
    effectiveVisibleColumns,
    filterable,
    hasActions,
    isCompactView,
    userColumnDefs,
  ]);

  return { columnDefs };
}
