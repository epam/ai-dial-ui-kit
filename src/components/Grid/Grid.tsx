import {
  type ColDef,
  colorSchemeDark,
  type GridApi,
  type GridOptions,
  type GridReadyEvent,
  type GridSizeChangedEvent,
  type ICellRendererParams,
  ModuleRegistry,
  themeBalham,
  type RowClassParams,
  AllCommunityModule,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import classNames from 'classnames';
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DropdownTrigger } from '@/types/dropdown';
import type { DropdownItem } from '@/models/dropdown';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import { DialCheckbox } from '@/components/Checkbox/Checkbox';

import { gridBaseClasses, GRID_THEME_COLORS, ROW_HEIGHT } from './constants';
import { baseColumnComparator } from './comparators/base-column-comparator';
import { useGridSelection } from './hooks/use-grid-selection';
import { DialNoDataContent } from '@/components/NoDataContent/NoDataContent';
import { IconZoomCancel } from '@tabler/icons-react';

export interface DialGridProps<T extends object = Record<string, unknown>> {
  columnDefs?: ColDef<T>[];
  rowData?: T[];
  additionalGridOptions?: GridOptions<T>;
  getContextMenuItems?: (row: T) => DropdownItem[];
  cssClass?: string;
  ariaLabel?: string;
  withSelectionColumn?: boolean;
  wrapCustomCellRenderers?: boolean | ((col: ColDef<T>) => boolean);
  selectedRowIds?: Set<string>;
  onSelectionChange?: (selectedRowIds: Set<string>, selectedRows: T[]) => void;
  getRowId?: (row: T) => string;
  alternateOddRowColors?: boolean;
  filterPlaceholder?: string;
  emptyStateIcon?: ReactNode;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * DialGrid — A feature-rich data grid wrapper built on ag-Grid with dark theme support.
 *
 * Provides a pre-configured grid with:
 * - Dark theme styling with CSS variable integration
 * - Optional row selection with checkboxes
 * - Context menu integration via DialDropdown
 * - Text overflow handling with tooltips via DialEllipsisTooltip
 * - Controlled or uncontrolled selection modes
 * - Automatic column sizing and responsive behavior
 * - Full accessibility support with ARIA attributes
 *
 * @example
 * ```tsx
 * // Basic usage with data
 * interface Product {
 *   id: string;
 *   name: string;
 *   price: number;
 * }
 *
 * const columns: ColDef<Product>[] = [
 *   { field: 'name', headerName: 'Product Name', flex: 1 },
 *   { field: 'price', headerName: 'Price', width: 120 },
 * ];
 *
 * <DialGrid<Product>
 *   columnDefs={columns}
 *   rowData={products}
 *   storageKey="products-grid"
 * />
 *
 * // With context menu
 * const getContextMenu = (row: Product): DropdownItem[] => [
 *   { key: 'edit', label: 'Edit' },
 *   { key: 'delete', label: 'Delete', danger: true },
 * ];
 *
 * <DialGrid<Product>
 *   columnDefs={columns}
 *   rowData={products}
 *   getContextMenuItems={getContextMenu}
 * />
 *
 * // Controlled selection
 * const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
 *
 * <DialGrid<Product>
 *   columnDefs={columns}
 *   rowData={products}
 *   selectedRowIds={selectedIds}
 *   onSelectionChange={(ids, rows) => {
 *     setSelectedIds(ids);
 *     console.log('Selected:', rows);
 *   }}
 * />
 * ```
 *
 * @param [columnDefs] - Array of column definitions (ag-Grid ColDef format)
 * @param [rowData] - Array of data objects to display in the grid
 * @param [additionalGridOptions] - Additional ag-Grid GridOptions to merge with defaults
 * @param [getContextMenuItems] - Function returning context menu items for a given row
 * @param [cssClass] - Additional CSS classes to apply to the grid container
 * @param [ariaLabel='Data grid'] - Accessible label for the grid region
 * @param [withSelectionColumn=true] - Whether to show the checkbox selection column
 * @param [wrapCustomCellRenderers=true] - Whether to wrap custom cell renderers with context menu support
 * @param [selectedRowIds] - Controlled selection: set of row IDs that should be selected
 * @param [onSelectionChange] - Callback invoked when selection changes (selectedIds, selectedRows)
 * @param [getRowId] - Function to extract unique ID from a row object (defaults to 'id' field)
 * @param [alternateOddRowColors=false] - Whether to alternate background colors for odd/even rows
 * @param [filterPlaceholder='Enter value'] - Placeholder text for column filter inputs
 * @param [emptyStateIcon] - Optional icon for empty state
 * @param [emptyStateTitle] - Optional title text displayed when the grid has no rows to show.
 * @param [emptyStateDescription] - Optional description text displayed below the empty state title,
 *   providing additional context or instructions (e.g., “No data found” or “Try adjusting your filters”).
 */
export const DialGrid = <T extends object>({
  columnDefs,
  rowData,
  additionalGridOptions,
  getContextMenuItems,
  cssClass,
  ariaLabel = 'Data grid',
  withSelectionColumn = true,
  wrapCustomCellRenderers = true,
  selectedRowIds,
  onSelectionChange,
  getRowId = (row: T) =>
    String((row as Record<string, unknown>).id || JSON.stringify(row)),
  alternateOddRowColors = false,
  filterPlaceholder = 'Enter value',
  emptyStateIcon,
  emptyStateTitle = 'No results found',
  emptyStateDescription = "Sorry, we couldn't find any results for your search.",
}: DialGridProps<T>) => {
  const [rowHeight, setRowHeight] = useState<number>(ROW_HEIGHT);
  const [gridApi, setGridApi] = useState<GridApi<T> | undefined>();

  const a11yId = useId();

  const {
    currentSelectedIds,
    handleSelectionToggle,
    headerCheckboxState,
    handleHeaderCheckboxChange,
  } = useGridSelection<T>({
    selectedRowIds,
    onSelectionChange,
    rowData,
    getRowId,
  });

  const themeColors = useMemo(
    () => ({
      ...GRID_THEME_COLORS,
      oddRowBackgroundColor: alternateOddRowColors
        ? GRID_THEME_COLORS.oddRowBackgroundColor
        : GRID_THEME_COLORS.backgroundColor,
    }),
    [alternateOddRowColors],
  );

  const onGridSizeChanged = useCallback((e: GridSizeChangedEvent) => {
    e.api.sizeColumnsToFit();
    setRowHeight(ROW_HEIGHT);
  }, []);

  const getRowClass = useCallback(
    (params: RowClassParams<T>) => {
      if (params.data) {
        const rowId = getRowId(params.data);
        return currentSelectedIds.has(rowId) ? 'ag-row-selected' : '';
      }
    },
    [currentSelectedIds, getRowId],
  );

  const renderHeaderSelectCell = useCallback(() => {
    const checked = headerCheckboxState === 'checked';
    const indeterminate = headerCheckboxState === 'indeterminate';
    const checkboxId = 'header-select-all';

    return (
      <div className="flex items-center justify-center h-full header-checkbox-container">
        <DialCheckbox
          id={checkboxId}
          ariaLabel="Select all rows"
          checked={checked}
          indeterminate={indeterminate}
          cssClass={`dial-header-select ${headerCheckboxState}`}
          onChange={handleHeaderCheckboxChange}
        />
      </div>
    );
  }, [headerCheckboxState, handleHeaderCheckboxChange]);

  const renderDataCell = useCallback(
    (p: ICellRendererParams<T, unknown>) => {
      if (p.data) {
        const items = getContextMenuItems?.(p.data) ?? [];
        const valueText = p.value == null ? '' : String(p.value);
        return (
          <DialDropdown
            trigger={[DropdownTrigger.ContextMenu]}
            menu={{ items }}
            anchorToMouse
            matchReferenceWidth
            cssClass="w-full"
          >
            <span className="block min-w-0 h-full max-w-full">
              <DialEllipsisTooltip
                text={valueText}
                cssClass="max-w-full h-full"
              />
            </span>
          </DialDropdown>
        );
      }
    },
    [getContextMenuItems],
  );

  const renderSelectCell = useCallback(
    (p: ICellRendererParams<T, unknown>) => {
      if (!p.data) return null;
      const rowId = getRowId(p.data);
      const checked = currentSelectedIds.has(rowId);
      const checkboxId = `row-select-${rowId}`;

      return (
        <div className="flex items-center justify-center h-full">
          <DialCheckbox
            key={`${rowId}-${checked}`}
            id={checkboxId}
            ariaLabel="Select row"
            checked={checked}
            cssClass="dial-row-select"
            onChange={(next) => {
              handleSelectionToggle(rowId, !!next);
            }}
          />
        </div>
      );
    },
    [currentSelectedIds, getRowId, handleSelectionToggle],
  );

  const wrapRendererIfNeeded = useCallback(
    (col: ColDef<T>): ColDef<T> => {
      const shouldWrap =
        typeof wrapCustomCellRenderers === 'function'
          ? wrapCustomCellRenderers(col)
          : !!wrapCustomCellRenderers;

      if (!col.cellRenderer) {
        return { ...col, cellRenderer: renderDataCell };
      }

      if (!shouldWrap) {
        return col;
      }

      const userRenderer = col.cellRenderer;

      const Wrapped: FC<ICellRendererParams<T, unknown>> = (p) => {
        const items = p.data ? (getContextMenuItems?.(p.data) ?? []) : [];
        let content: ReactNode = null;

        if (typeof userRenderer === 'function') {
          const Comp = userRenderer;
          content = <Comp {...p} />;
        } else {
          content = renderDataCell(p);
        }

        return (
          <DialDropdown
            trigger={[DropdownTrigger.ContextMenu]}
            menu={{ items }}
            anchorToMouse
            matchReferenceWidth
            cssClass="w-full h-full"
          >
            <span className="block min-w-0 max-w-full">{content}</span>
          </DialDropdown>
        );
      };

      return { ...col, cellRenderer: Wrapped };
    },
    [getContextMenuItems, renderDataCell, wrapCustomCellRenderers],
  );

  const selectCol: ColDef<T> = useMemo(
    () => ({
      colId: '__select',
      headerName: '',
      width: 40,
      minWidth: 40,
      suppressSizeToFit: true,
      lockPosition: true,
      sortable: false,
      resizable: false,
      filter: false,
      floatingFilter: false,
      suppressMenu: true,
      borderless: true,
      cellRenderer: renderSelectCell,
      headerComponent: renderHeaderSelectCell,
    }),
    [renderSelectCell, renderHeaderSelectCell],
  );

  const computedColumnDefs = useMemo<ColDef<T>[]>(() => {
    const user = (columnDefs ?? []).map(wrapRendererIfNeeded);
    return withSelectionColumn ? [selectCol, ...user] : user;
  }, [columnDefs, selectCol, withSelectionColumn, wrapRendererIfNeeded]);

  const defaultColDef: ColDef<T> = useMemo(
    () => ({
      minWidth: 150,
      resizable: true,
      sortable: true,
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        filterPlaceholder: filterPlaceholder,
        buttons: ['reset'],
      },
      comparator: baseColumnComparator.bind(this),
    }),
    [filterPlaceholder],
  );

  const onGridReady = (e: GridReadyEvent) => {
    const colsNoSort = computedColumnDefs.map((column) => ({
      ...column,
      sort: undefined,
    }));

    e.api.updateGridOptions({ columnDefs: colsNoSort, rowData });

    e.api.sizeColumnsToFit();

    setGridApi(e.api);
    additionalGridOptions?.onGridReady?.(e);
  };

  useEffect(() => {
    if (gridApi) {
      gridApi.redrawRows();
    }
  }, [gridApi, currentSelectedIds]);

  const emptyStateRenderer = useCallback(
    () => (
      <DialNoDataContent
        title={emptyStateTitle}
        description={emptyStateDescription}
        containerCssClass="gap-3"
        titleCssClass="mt-2 !text-lg"
        icon={
          emptyStateIcon || (
            <IconZoomCancel
              size={100}
              stroke={0.5}
              className="text-secondary"
            />
          )
        }
      />
    ),
    [emptyStateTitle, emptyStateDescription, emptyStateIcon],
  );

  return (
    <div
      className={classNames(
        gridBaseClasses,
        cssClass,
        withSelectionColumn && 'with-selection-column',
      )}
      aria-label={ariaLabel}
      role="region"
    >
      <div
        className="ag-theme-balham-dark h-full overflow-x-auto"
        role="table"
        aria-describedby={a11yId}
      >
        <AgGridReact<T>
          rowModelType="clientSide"
          headerHeight={ROW_HEIGHT}
          rowHeight={rowHeight}
          cellSelection={false}
          getRowClass={getRowClass}
          theme={themeBalham
            .withPart(colorSchemeDark)
            .withParams({ ...themeColors })}
          autoSizeStrategy={{ type: 'fitGridWidth' }}
          columnDefs={computedColumnDefs}
          defaultColDef={defaultColDef}
          onGridSizeChanged={onGridSizeChanged}
          onGridReady={onGridReady}
          suppressCellFocus={true}
          suppressDragLeaveHidesColumns={true}
          noRowsOverlayComponent={emptyStateRenderer}
          rowData={rowData}
          {...additionalGridOptions}
        />
      </div>
    </div>
  );
};
