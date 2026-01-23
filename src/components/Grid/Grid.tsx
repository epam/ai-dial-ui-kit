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
import { DialRadioButton } from '@/components/RadioButton/RadioButton';

import { gridBaseClassName, GRID_THEME_COLORS, ROW_HEIGHT } from './constants';
import { baseColumnComparator } from './comparators/base-column-comparator';
import { useGridSelection } from './hooks/use-grid-selection';
import { DialNoDataContent } from '@/components/NoDataContent/NoDataContent';
import { IconZoomCancel } from '@tabler/icons-react';
import { GridSelectionMode } from '@/models/selection-mode';

export interface DialGridProps<T extends object = Record<string, unknown>> {
  columnDefs?: ColDef<T>[];
  rowData?: T[];
  additionalGridOptions?: GridOptions<T>;
  getContextMenuItems?: (row: T) => DropdownItem[];
  className?: string;
  ariaLabel?: string;
  withSelectionColumn?: boolean;
  wrapCustomCellRenderers?: boolean | ((col: ColDef<T>) => boolean);
  disabledRowIds?: Set<string>;
  selectedRowIds?: Set<string>;
  selectedRows?: Map<string, T>;
  selectionOnHover?: boolean;
  onGridApiChange?: (api: GridApi<T>) => void;
  onSelectionChange?: (selectedRowIds: Set<string>, selectedRows: T[]) => void;
  onSelectionChangeWithMap?: (selectedRows: Map<string, T>) => void;
  getRowId?: (row: T) => string;
  alternateOddRowColors?: boolean;
  filterPlaceholder?: string;
  emptyStateIcon?: ReactNode;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  loading?: boolean;
  wrapperBorder?: boolean;
  withoutHeaderBorders?: boolean;
  selectionMode?: GridSelectionMode;
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
 * - Loading state with native AG-Grid overlay
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
 * />
 *
 * // With loading state
 * <DialGrid<Product>
 *   columnDefs={columns}
 *   rowData={products}
 *   loading={true}
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
 * @param [className] - Additional CSS classes to apply to the grid container
 * @param [ariaLabel='Data grid'] - Accessible label for the grid region
 * @param [withSelectionColumn=true] - Whether to show the checkbox selection column
 * @param [wrapCustomCellRenderers=true] - Whether to wrap custom cell renderers with context menu support
 * @param [disabledRowIds] - Set of row IDs that should be disabled. Disabled rows are non-interactive and cannot be selected. IDs must match values from `getRowId`.
 * @param [selectedRowIds] - Controlled selection: set of row IDs that should be selected
 * @param [selectedRows] - Controlled selection: map of row IDs to row data for selected rows
 * @param [selectionOnHover=true] - Whether row selection highlights are shown on hover
 * @param [onSelectionChange] - Callback invoked when selection changes (selectedIds, selectedRows)
 * @param [onGridApiChange] - Callback invoked when the grid API becomes available
 * @param [getRowId] - Function to extract unique ID from a row object (defaults to 'id' field)
 * @param [alternateOddRowColors=false] - Whether to alternate background colors for odd/even rows
 * @param [filterPlaceholder='Enter value'] - Placeholder text for column filter inputs
 * @param [emptyStateIcon] - Optional icon for empty state
 * @param [emptyStateTitle] - Optional title text displayed when the grid has no rows to show.
 * @param [emptyStateDescription] - Optional description text displayed below the empty state title,
 *   providing additional context or instructions (e.g., "No data found" or "Try adjusting your filters").
 * @param [loading=false] - When true, shows AG-Grid's native loading overlay
 * @param [wrapperBorder=true] - Whether to apply a border around the grid container
 * @param [withoutHeaderBorders=false] - Whether to hide the header row borders
 */
export const DialGrid = <T extends object>({
  columnDefs,
  rowData,
  additionalGridOptions,
  getContextMenuItems,
  className,
  ariaLabel = 'Data grid',
  withSelectionColumn = true,
  wrapCustomCellRenderers = true,
  disabledRowIds,
  selectedRowIds,
  selectedRows,
  selectionOnHover = true,
  onSelectionChange,
  onSelectionChangeWithMap,
  onGridApiChange,
  getRowId = (row: T) =>
    String((row as Record<string, unknown>).id || JSON.stringify(row)),
  alternateOddRowColors = false,
  filterPlaceholder = 'Enter value',
  emptyStateIcon,
  emptyStateTitle = 'No results found',
  emptyStateDescription = "Sorry, we couldn't find any results for your search.",
  loading = false,
  wrapperBorder = true,
  withoutHeaderBorders = false,
  selectionMode = GridSelectionMode.CHECKBOX,
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
    selectedRows,
    onSelectionChange,
    onSelectionChangeWithMap,
    rowData,
    getRowId,
    disabledRowIds,
  });

  const themeParams = useMemo(
    () => ({
      ...GRID_THEME_COLORS,
      oddRowBackgroundColor: alternateOddRowColors
        ? GRID_THEME_COLORS.oddRowBackgroundColor
        : GRID_THEME_COLORS.backgroundColor,
      wrapperBorder: wrapperBorder,
    }),
    [alternateOddRowColors, wrapperBorder],
  );

  const onGridSizeChanged = useCallback((e: GridSizeChangedEvent) => {
    e.api.sizeColumnsToFit();
    setRowHeight(ROW_HEIGHT);
  }, []);

  const getRowClass = useCallback(
    (params: RowClassParams<T>) => {
      if (!params.data) return '';

      const rowId = getRowId(params.data);

      return classNames({
        'ag-row-selected': currentSelectedIds.has(rowId),
        'opacity-50': disabledRowIds?.has(rowId),
      });
    },
    [currentSelectedIds, disabledRowIds, getRowId],
  );

  const renderHeaderSelectCell = useCallback(() => {
    if (selectionMode !== GridSelectionMode.CHECKBOX) return null;

    const checked = headerCheckboxState === 'checked';
    const indeterminate = headerCheckboxState === 'indeterminate';
    const checkboxId = 'header-select-all';

    const hasEnabledRows =
      rowData?.some((row) => !disabledRowIds?.has(getRowId(row))) ?? false;

    return (
      <div className="flex items-center justify-center h-full header-checkbox-container">
        <DialCheckbox
          id={checkboxId}
          ariaLabel="Select all rows"
          checked={checked}
          disabled={!hasEnabledRows}
          aria-disabled={!hasEnabledRows}
          indeterminate={indeterminate}
          className={classNames(
            `dial-header-select ${headerCheckboxState}`,
            !selectionOnHover && 'dial-header-select-visible',
          )}
          onChange={handleHeaderCheckboxChange}
        />
      </div>
    );
  }, [
    headerCheckboxState,
    rowData,
    selectionOnHover,
    handleHeaderCheckboxChange,
    disabledRowIds,
    getRowId,
    selectionMode,
  ]);

  const renderDataCell = useCallback(
    (p: ICellRendererParams<T, unknown>) => {
      if (p.data) {
        const rowId = getRowId(p.data);
        const disabled = disabledRowIds?.has(rowId);
        const valueText = p.value == null ? '' : String(p.value);
        const items = getContextMenuItems?.(p.data) ?? [];

        return (
          <DialDropdown
            trigger={[DropdownTrigger.ContextMenu]}
            menu={{ items }}
            anchorToMouse
            matchReferenceWidth
            className="w-full"
            disabled={disabled}
          >
            <span className="block min-w-0 h-full max-w-full">
              <DialEllipsisTooltip
                text={valueText}
                className="max-w-full h-full"
              />
            </span>
          </DialDropdown>
        );
      }
    },
    [getContextMenuItems, disabledRowIds, getRowId],
  );

  const renderSelectCell = useCallback(
    (p: ICellRendererParams<T, unknown>) => {
      if (!p.data) return null;

      const rowId = getRowId(p.data);
      const checked = currentSelectedIds.has(rowId);
      const disabled = disabledRowIds?.has(rowId);
      const inputId = `row-select-${rowId}`;

      if (selectionMode === GridSelectionMode.RADIO_BUTTON) {
        return (
          <div className="h-6 w-6 flex items-center justify-center">
            <DialRadioButton
              className="w-[18px] h-[18px]"
              inputId={inputId}
              checked={checked}
              disabled={disabled}
              name="gridradiobutton"
              value="selected"
              onChange={() => {
                if (disabled || !p.data) return;
                handleSelectionToggle(p.data, true, true);
              }}
            />
          </div>
        );
      }

      // Checkbox mode (default)
      return (
        <div className="flex items-center justify-center size-full">
          <DialCheckbox
            key={`${rowId}-${checked}`}
            id={inputId}
            ariaLabel="Select row"
            checked={checked}
            disabled={disabled}
            aria-disabled={disabled}
            className={classNames(
              'dial-row-select',
              !selectionOnHover && 'dial-row-select-visible',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
            onChange={(next) => {
              if (disabled || !p.data) return;
              handleSelectionToggle(p.data, !!next);
            }}
          />
        </div>
      );
    },
    [
      currentSelectedIds,
      disabledRowIds,
      getRowId,
      handleSelectionToggle,
      selectionOnHover,
      selectionMode,
    ],
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

        const rowId = p.data ? getRowId(p.data) : null;
        const disabled = rowId ? disabledRowIds?.has(rowId) : false;

        return (
          <DialDropdown
            trigger={[DropdownTrigger.ContextMenu]}
            menu={{ items }}
            anchorToMouse
            matchReferenceWidth
            className="w-full h-full"
            disabled={disabled}
          >
            <span className="block min-w-0 max-w-full flex-1">{content}</span>
          </DialDropdown>
        );
      };

      return { ...col, cellRenderer: Wrapped };
    },
    [
      disabledRowIds,
      getContextMenuItems,
      getRowId,
      renderDataCell,
      wrapCustomCellRenderers,
    ],
  );

  const selectCol: ColDef<T> = useMemo(
    () => ({
      colId: '__select',
      headerName: '',
      width: 44,
      minWidth: 44,
      suppressSizeToFit: true,
      lockPosition: true,
      sortable: false,
      resizable: false,
      filter: false,
      floatingFilter: false,
      cellRenderer: renderSelectCell,
      headerComponent:
        selectionMode === GridSelectionMode.CHECKBOX
          ? renderHeaderSelectCell
          : undefined,
    }),
    [renderSelectCell, renderHeaderSelectCell, selectionMode],
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
    onGridApiChange?.(e.api);
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
        containerClassName="gap-3"
        titleClassName="mt-2 !text-lg"
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
        gridBaseClassName,
        className,
        withSelectionColumn && 'with-selection-column',
        withoutHeaderBorders && 'dial-without-header-borders',
      )}
      aria-label={ariaLabel}
      role="region"
      aria-busy={loading}
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
            .withParams({ ...themeParams })}
          autoSizeStrategy={{ type: 'fitGridWidth' }}
          columnDefs={computedColumnDefs}
          defaultColDef={defaultColDef}
          onGridSizeChanged={onGridSizeChanged}
          onGridReady={onGridReady}
          loading={loading}
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
