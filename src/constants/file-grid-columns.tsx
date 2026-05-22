import { mergeClasses } from '@/utils/merge-classes';
import { DialFileNodeType } from '@/models/file';
import { DialFileName } from '@/components/FileName/FileName';
import { DialFolderName } from '@/components/FolderName/FolderName';
import {
  DialDateCellRenderer,
  type DialDateCellRendererProps,
} from '@/components/Grid/renderers/DateCellRenderer';
import {
  FileManagerRenameTriggerView,
  FileManagerColumnKey,
} from '@/types/file-manager';
import { DialFileManagerItemName } from '@/components/FileManager/components/FileManagerItemName/FileManagerItemName';
import { DialItemType } from '@/types/item';
import { DialFileManagerItemSummaryCell } from '@/components/FileManager/components/DialFileManagerItemSummaryCell/DialFileManagerItemSummaryCell';

import type { FileManagerGridRow } from '@/components/FileManager/FileManagerContext';
import { BASE_FILE_MANAGER_ICON_SIZE } from '@/components/FileManager/constants';
import type { FileManagerGridContext } from '@/components/FileManager/hooks/use-file-manager-columns';
import {
  formatBytes,
  getForbiddenSymbolsTooltip,
} from '@/components/FileManager/utils';
import type { ColDef } from 'ag-grid-community';
import { convertToDate } from '@/components/Grid/renderers/utils';
import {
  DEFAULT_DATE_FORMAT_OPTIONS,
  DEFAULT_LOCALE,
} from '@/components/Grid/renderers/constants';

type GridRow = FileManagerGridRow;

export const NAME_COLUMN =
  (headerName: string) =>
  (
    dateLocale: Intl.LocalesArgument,
    dateOptions: Intl.DateTimeFormatOptions | undefined,
    isCompactView: boolean,
  ): ColDef => {
    return {
      colId: FileManagerColumnKey.Name,
      field: 'name' as keyof FileManagerGridRow,
      headerName,
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
          disabledRowIds,
          filesLoading,
        } = params.context;

        const isSharedByMe = sharedByMePaths?.has(params.data.path);
        const isSelected = selectedPaths?.has(params.data.path);
        const isDisabled = disabledRowIds?.has(params.data.path) ?? false;

        const sharedIndicatorClassName = mergeClasses([
          'group-hover/grid-row:bg-accent-primary-alpha',
          isSelected && 'bg-accent-primary-alpha',
        ]);

        if (params.data?.isTemporary && params.data.id === newFolderTempId) {
          return (
            <DialFileManagerItemName
              name={params.data.name}
              type={DialItemType.Folder}
              elementId={`new-folder-${params.data.id}`}
              editing={true}
              creating={true}
              loading={filesLoading}
              shared={isSharedByMe}
              sharedIndicatorClassName={sharedIndicatorClassName}
              iconSize={BASE_FILE_MANAGER_ICON_SIZE}
              validate={validateFolderName}
              onSave={saveFolderCreation}
              onCancel={cancelFolderCreation}
              onCreateFolderSave={saveFolderCreation}
              onCreateFolderCancel={cancelFolderCreation}
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
              fileExtension={renamedItem.name.split('.').pop()}
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
              forbiddenSymbolsRegExp={params.context.forbiddenSymbolsRegExp}
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
              hideTooltip={isDisabled}
              forbiddenSymbolsRegExp={params.context.forbiddenSymbolsRegExp}
              forbiddenSymbolsTooltip={params.context.forbiddenSymbolsTooltip}
            />
          );
        }

        const tooltipContent = getForbiddenSymbolsTooltip(
          {
            name: params.data.name,
            isFolder: type === DialFileNodeType.FOLDER,
          },
          params.context.forbiddenSymbolsRegExp,
          params.context.forbiddenSymbolsTooltip,
        );

        return type === DialFileNodeType.FOLDER ? (
          <DialFolderName
            name={params.data.name}
            shared={isSharedByMe}
            sharedIndicatorClassName={sharedIndicatorClassName}
            iconSize={BASE_FILE_MANAGER_ICON_SIZE}
            hideTooltip={isDisabled}
            isInvalidName={!!tooltipContent}
            tooltipContent={tooltipContent}
          />
        ) : (
          <DialFileName
            name={params.data.name}
            shared={isSharedByMe}
            sharedIndicatorClassName={sharedIndicatorClassName}
            iconSize={BASE_FILE_MANAGER_ICON_SIZE}
            hideTooltip={isDisabled}
            isInvalidName={!!tooltipContent}
            tooltipContent={tooltipContent}
          />
        );
      },
    };
  };

export const UPDATED_AT_COLUMN =
  (headerName: string) =>
  (
    dateLocale: Intl.LocalesArgument,
    dateOptions: Intl.DateTimeFormatOptions | undefined,
  ): ColDef => ({
    colId: FileManagerColumnKey.UpdatedAt,
    field: 'updatedAt' as keyof FileManagerGridRow,
    headerName: headerName,
    width: 168,
    suppressSizeToFit: true,
    cellRenderer: (params: DialDateCellRendererProps) => {
      const isDisabled =
        params.context?.disabledRowIds?.has(params.data?.path) ?? false;
      return <DialDateCellRenderer {...params} hideTooltip={isDisabled} />;
    },
    cellRendererParams: {
      locale: dateLocale,
      options: dateOptions,
    },
    filterValueGetter: (params) => {
      const value = params.data[params.colDef.field || ''];
      const date = convertToDate(value);
      if (!date) return '';

      const formatted = new Intl.DateTimeFormat(
        dateLocale || DEFAULT_LOCALE,
        dateOptions || DEFAULT_DATE_FORMAT_OPTIONS,
      );

      return formatted.format(date);
    },
  });

export const SIZE_COLUMN = (headerName: string): ColDef => ({
  colId: FileManagerColumnKey.Size,
  field: 'size' as keyof FileManagerGridRow,
  headerName: headerName,
  width: 120,
  suppressSizeToFit: true,
  cellRenderer: (params: { data: GridRow }): string => {
    return params.data.nodeType === DialFileNodeType.ITEM
      ? formatBytes(params.data.contentLength)
      : '';
  },
  filterValueGetter: (params) => {
    return params.data.nodeType === DialFileNodeType.ITEM
      ? formatBytes(params.data.contentLength)
      : '';
  },
});
