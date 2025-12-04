import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DialIcon } from '@/components/Icon/Icon';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { IconDotsVertical } from '@tabler/icons-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useCallback, useMemo } from 'react';
import type { FileManagerGridRow } from '../FileManagerContext';
import type { DropdownItem } from '@/models/dropdown';

interface UseGridActionsColumnProps {
  getContextMenuItems: (row: FileManagerGridRow) => DropdownItem[];
}

export const useGridActionsColumn = ({
  getContextMenuItems,
}: UseGridActionsColumnProps) => {
  const renderActionsCell = useCallback(
    (p: ICellRendererParams<FileManagerGridRow, unknown>) => {
      if (!p.data) return null;

      const items = p.data ? (getContextMenuItems?.(p.data) ?? []) : [];

      if (!items.length) return null;

      return (
        <DialDropdown
          placement="bottom-start"
          allowedPlacements={['top-start', 'top-end', 'bottom-start']}
          menu={{ items }}
          className="sticky right-0"
        >
          <DialIcon
            className="text-secondary mx-2 flex flex-row gap-2 hover:text-accent-primary"
            icon={<IconDotsVertical {...BASE_ICON_PROPS} />}
          />
        </DialDropdown>
      );
    },
    [getContextMenuItems],
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
      suppressMenu: true,
      borderless: true,
      cellRenderer: renderActionsCell,
    }),
    [renderActionsCell],
  );

  return { actionsColumnDef };
};
