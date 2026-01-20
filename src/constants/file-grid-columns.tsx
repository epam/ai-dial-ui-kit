import { mergeClasses } from '@/utils/merge-classes';
import { DialFileNodeType } from '@/models/file';
import { DialFileName } from '@/components/FileName/FileName';
import { DialFolderName } from '@/components/FolderName/FolderName';
import { DialDateCellRenderer } from '@/components/Grid/renderers/DateCellRenderer';
import { FileManagerRenameTriggerView } from '@/types/file-manager';
import { DialFileManagerItemName } from '@/components/FileManager/components/FileManagerItemName/FileManagerItemName';
import { DialItemType } from '@/types/item';
import { DialFileManagerItemSummaryCell } from '@/components/FileManager/components/DialFileManagerItemSummaryCell/DialFileManagerItemSummaryCell';
import { FileManagerColumnKey } from '@/types/file-manager';
import type { FileManagerGridRow } from '@/components/FileManager/FileManagerContext';
import { BASE_FILE_MANAGER_ICON_SIZE } from '@/components/FileManager/constants';
import type { FileManagerGridContext } from '@/components/FileManager/hooks/use-file-manager-columns';

type GridRow = FileManagerGridRow;

export const NAME_COLUMN =
  (headerName: string) =>
  (
    dateLocale: Intl.LocalesArgument,
    dateOptions: Intl.DateTimeFormatOptions | undefined,
    isCompactView: boolean,
  ) => {
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
    };
  };

export const UPDATED_AT_COLUMN =
  (headerName: string) =>
  (
    dateLocale: Intl.LocalesArgument,
    dateOptions: Intl.DateTimeFormatOptions | undefined,
  ) => ({
    colId: FileManagerColumnKey.UpdatedAt,
    field: 'updatedAt' as keyof FileManagerGridRow,
    headerName: headerName,
    width: 168,
    suppressSizeToFit: true,
    cellRenderer: DialDateCellRenderer,
    cellRendererParams: {
      locale: dateLocale,
      options: dateOptions,
    },
  });

export const SIZE_COLUMN = (headerName: string) => ({
  colId: FileManagerColumnKey.Size,
  field: 'size' as keyof FileManagerGridRow,
  headerName: headerName,
  width: 120,
  suppressSizeToFit: true,
});
