import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DialIcon } from '@/components/Icon/Icon';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { IconDotsVertical } from '@tabler/icons-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useCallback, useMemo } from 'react';
import type { FileManagerGridRow } from '@/components/FileManager/FileManagerContext';
import type { DropdownItem } from '@/models/dropdown';
import type { DialFileAcceptType } from '@/models/file-manager';
import { mergeClasses } from '@/utils/merge-classes';

interface UseGridActionsColumnProps {
  getContextMenuItems: (row: FileManagerGridRow) => DropdownItem[];
  isRowDisabled: (
    row: FileManagerGridRow,
    allowedFileTypes?: DialFileAcceptType[],
    maxSelectableFileSize?: number,
  ) => boolean;
  allowedFileTypes?: DialFileAcceptType[];
  maxSelectableFileSize?: number;
  buttonClassName?: string;
}

export const useGridActionsColumn = ({
  getContextMenuItems,
  isRowDisabled,
  allowedFileTypes,
  maxSelectableFileSize,
  buttonClassName,
}: UseGridActionsColumnProps) => {
  const renderActionsCell = useCallback(
    (p: ICellRendererParams<FileManagerGridRow, unknown>) => {
      if (!p.data) return null;

      const disabled = isRowDisabled(
        p.data,
        allowedFileTypes,
        maxSelectableFileSize,
      );

      if (disabled) return null;

      const items = p.data ? (getContextMenuItems?.(p.data) ?? []) : [];

      if (!items.length) return null;

      return (
        <DialDropdown
          placement="bottom-start"
          allowedPlacements={['top-start', 'top-end', 'bottom-start']}
          menu={{ items }}
          className={mergeClasses('sticky right-0', buttonClassName)}
        >
          <DialIcon
            className="text-secondary mx-2 flex flex-row gap-2 hover:text-accent-primary"
            icon={<IconDotsVertical {...BASE_ICON_PROPS} />}
          />
        </DialDropdown>
      );
    },
    [
      allowedFileTypes,
      maxSelectableFileSize,
      buttonClassName,
      getContextMenuItems,
      isRowDisabled,
    ],
  );

  const actionsColumnDef: ColDef<FileManagerGridRow> = useMemo(
    () => ({
      colId: '__actions',
      headerName: '',
      width: 44,
      minWidth: 44,
      suppressSizeToFit: true,
      sortable: false,
      resizable: false,
      filter: false,
      floatingFilter: false,
      cellRenderer: renderActionsCell,
    }),
    [renderActionsCell],
  );

  return { actionsColumnDef };
};
