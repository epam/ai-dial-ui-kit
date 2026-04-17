import {
  AllCommunityModule,
  type ColDef,
  colorSchemeDark,
  type GridApi,
  type GridOptions,
  type GridReadyEvent,
  type GridSizeChangedEvent,
  type ICellRendererParams,
  ModuleRegistry,
  type RowSelectionOptions,
  setupAgTestIds,
  themeBalham,
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
  useRef,
  useState,
} from 'react';

import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DropdownTrigger } from '@/types/dropdown';
import type { DropdownItem } from '@/models/dropdown';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import {
  checkboxClass,
  GRID_THEME_COLORS,
  gridBaseClassName,
  ROW_HEIGHT,
  SelectionEventSourceType,
} from './constants';
import { baseColumnComparator } from './comparators/base-column-comparator';
import { DialNoDataContent } from '@/components/NoDataContent/NoDataContent';
import { IconZoomCancel } from '@tabler/icons-react';
import { GridSelectionMode } from '@/models/selection-mode';
import { DialRadioButton } from '@/components/RadioButton/RadioButton.tsx';
import {
  CHECKBOX_COL_DEF,
  RADIO_BUTTON_COL_DEF,
} from '@/components/Grid/renderers/constants.ts';
import type { SelectionChangedEvent } from 'ag-grid-community';
import { debounceFn } from '@/utils/debounce.ts';
import { ariaDescription } from '@/components/Checkbox/constants';

setupAgTestIds({ testIdAttribute: 'dataQA' });

export interface DialGridProps<T extends object = Record<string, unknown>> {
  columnDefs?: ColDef<T>[];
  rowData?: T[];
  additionalGridOptions?: GridOptions<T>;
  getContextMenuItems?: (row: T) => DropdownItem[];
  className?: string;
  ariaLabel?: string;
  wrapCustomCellRenderers?: boolean | ((col: ColDef<T>) => boolean);
  disabledRowIds?: Set<string>;
  selectedRowIds?: Set<string>;
  onGridApiChange?: (api: GridApi<T>) => void;
  onSelectionChange?: (selectedRowIds: Set<string>, selectedRows: T[]) => void;
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
  allowDisabledContextMenu?: boolean;
}

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * DialGrid — A feature-rich data grid wrapper built on ag-Grid with dark theme support.
 * aliases: DataTable|TableGrid
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
 * @param [wrapCustomCellRenderers=true] - Whether to wrap custom cell renderers with context menu support
 * @param [disabledRowIds] - Set of row IDs that should be disabled. Disabled rows are non-interactive and cannot be selected. IDs must match values from `getRowId`.
 * @param [selectedRowIds] - Controlled selection: set of row IDs that should be selected
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
 * @param [selectionMode] - Could be GridSelectionMode.MULTIPLE or GridSelectionMode.SINGLE to enable selection column
 * @param [allowDisabledContextMenu] - Enables context menu actions even if row itself is disabled for selection
 */
export const DialGrid = <T extends object>({
  columnDefs,
  rowData,
  additionalGridOptions,
  getContextMenuItems,
  className,
  ariaLabel = 'Data grid',
  wrapCustomCellRenderers = true,
  disabledRowIds,
  selectedRowIds,
  onSelectionChange,
  onGridApiChange,
  getRowId = (row: T) =>
    String((row as Record<string, unknown>).id ?? JSON.stringify(row)),
  alternateOddRowColors = false,
  filterPlaceholder = 'Enter value',
  emptyStateIcon,
  emptyStateTitle = 'No results found',
  emptyStateDescription = "Sorry, we couldn't find any results for your search.",
  loading = false,
  wrapperBorder = true,
  withoutHeaderBorders = false,
  allowDisabledContextMenu = false,
  selectionMode,
}: DialGridProps<T>) => {
  const [rowHeight, setRowHeight] = useState<number>(ROW_HEIGHT);
  const [gridApi, setGridApi] = useState<GridApi<T> | undefined>();
  const a11yId = useId();
  const selectedNodesRef = useRef<Set<string>>(new Set());
  const lastSelectionSourceRef = useRef<SelectionEventSourceType | undefined>(
    undefined,
  );

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

  const renderDataCell = useCallback(
    (p: ICellRendererParams<T, unknown>) => {
      if (p.data) {
        const rowId = getRowId(p.data);
        const isRowDisabled = disabledRowIds?.has(rowId) ?? false;
        const isContextMenuDisabled =
          isRowDisabled && !allowDisabledContextMenu;
        const valueText = p.value == null ? '' : String(p.value);
        const items = getContextMenuItems?.(p.data) ?? [];

        return (
          <DialDropdown
            trigger={[DropdownTrigger.ContextMenu]}
            menu={{ items }}
            anchorToMouse
            matchReferenceWidth
            className="w-full"
            disabled={isContextMenuDisabled}
          >
            <span className="block min-w-0 h-full max-w-full">
              <DialEllipsisTooltip
                text={valueText}
                className="max-w-full h-full"
                hideTooltip={isRowDisabled}
              />
            </span>
          </DialDropdown>
        );
      }
    },
    [getContextMenuItems, disabledRowIds, getRowId, allowDisabledContextMenu],
  );

  const isUserSelectionEvent = useCallback(
    (source?: SelectionEventSourceType) => {
      return (
        source === SelectionEventSourceType.API ||
        source === SelectionEventSourceType.ROW_DATA_CHANGED
      );
    },
    [],
  );

  const onSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      if (!gridApi) {
        return;
      }
      const selectedNodes = event.selectedNodes || [];
      const selectedRows = selectedNodes.map((node) => node.data as T);
      const selectedIds = new Set(selectedRows.map(getRowId));
      selectedNodesRef.current = selectedIds;
      lastSelectionSourceRef.current = event.source as SelectionEventSourceType;

      if (!isUserSelectionEvent(event.source as SelectionEventSourceType)) {
        onSelectionChange?.(selectedIds, selectedRows);
      }
    },
    [gridApi, getRowId, isUserSelectionEvent, onSelectionChange],
  );

  const debouncedOnSelectionChange = useMemo(() => {
    return debounceFn(
      (event: SelectionChangedEvent) => onSelectionChanged?.(event),
      100,
    );
  }, [onSelectionChanged]);

  const selectionCellRenderer = useCallback(
    (p: ICellRendererParams<T, unknown>) => {
      if (!p.data) return null;

      const rowId = getRowId(p.data);
      const checked = p.node.isSelected();
      const disabled = disabledRowIds?.has(rowId);
      const inputId = `row-select-${rowId}`;

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
              if (disabled) {
                return;
              }
              p.node.setSelected(
                true,
                true,
                SelectionEventSourceType.CHECKBOX_SELECTED,
              );
              p.api.refreshCells({ columns: [p.column?.getColId() as string] });
            }}
          />
        </div>
      );
    },
    [getRowId, disabledRowIds],
  );

  const getSelectionClasses = useCallback(() => {
    const baseClass = 'dial-row-select';
    const visibleClass = 'dial-row-select-visible';

    if (!selectedRowIds || selectedRowIds.size === 0) {
      return baseClass;
    }
    return `${baseClass} ${visibleClass}`;
  }, [selectedRowIds]);

  const getHeaderSelectionClasses = useCallback(() => {
    if (!selectedRowIds || selectedRowIds.size === 0) {
      return 'dial-row-not-select-header';
    }
    return getSelectionClasses();
  }, [getSelectionClasses, selectedRowIds]);

  const selectionColumnDef = useMemo(() => {
    if (selectionMode === GridSelectionMode.SINGLE) {
      return {
        ...RADIO_BUTTON_COL_DEF,
        cellRenderer: selectionCellRenderer,
      } as ColDef<T>;
    }
    if (selectionMode === GridSelectionMode.MULTIPLE) {
      return {
        ...CHECKBOX_COL_DEF,
        headerClass: () => getHeaderSelectionClasses(),
        cellClass: (p) => {
          const rowId = p.data ? getRowId(p.data) : null;
          let styles = getSelectionClasses();

          if (rowId && disabledRowIds?.has(rowId)) {
            styles += ' opacity-50 pointer-events-none';
          }
          return styles;
        },
      } as ColDef<T>;
    }
  }, [
    disabledRowIds,
    getRowId,
    selectionCellRenderer,
    selectionMode,
    getSelectionClasses,
  ]);

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
            className={classNames(
              'w-full h-full',
              disabled && '!cursor-not-allowed opacity-75',
            )}
            disabled={disabled && !allowDisabledContextMenu}
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
      allowDisabledContextMenu,
    ],
  );

  // TODO: temporary fix, until wrapRendererIfNeeded exists
  const computedColumnDefs = useMemo<ColDef<T>[]>(
    () => {
      return wrapCustomCellRenderers
        ? (columnDefs ?? []).map(wrapRendererIfNeeded)
        : (columnDefs ?? []);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      columnDefs,
      wrapCustomCellRenderers,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      wrapCustomCellRenderers ? wrapRendererIfNeeded : null,
    ],
  );

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
    const headerCheckbox = document.querySelector(checkboxClass);

    if (headerCheckbox) {
      headerCheckbox.setAttribute('aria-description', ariaDescription);
    }
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
    if (gridApi && rowData) {
      gridApi.setGridOption('rowData', rowData);
    }
  }, [gridApi, rowData]);

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

  const rowSelection = useMemo<
    'single' | 'multiple' | RowSelectionOptions | undefined
  >(() => {
    if (selectionMode) {
      return {
        mode:
          selectionMode === GridSelectionMode.SINGLE ? 'singleRow' : 'multiRow',
        isRowSelectable: (node) => {
          const rowId = node.data ? getRowId(node.data as T) : null;
          return rowId ? !disabledRowIds?.has(rowId) : true;
        },
      };
    }
    return undefined;
  }, [disabledRowIds, getRowId, selectionMode]);

  useEffect(() => {
    if (gridApi && rowData && selectedNodesRef.current.size) {
      selectedNodesRef.current.forEach((id) => {
        const node = gridApi.getRowNode(id);
        if (node && !node.isSelected()) {
          node.setSelected(true, false, SelectionEventSourceType.API);
        }
      });
    }
  }, [gridApi, rowData]);

  useEffect(() => {
    if (gridApi && selectedRowIds) {
      gridApi.deselectAll('all', SelectionEventSourceType.API);
      selectedRowIds.forEach((id) => {
        const node = gridApi.getRowNode(id);
        if (node && !node.isSelected()) {
          node.setSelected(true, false, SelectionEventSourceType.API);
        }
      });
    }
  }, [gridApi, selectedRowIds]);

  const agGridGetRowId = useCallback(
    (params: { data?: T }) => {
      if (!params.data) {
        return '';
      }
      return getRowId(params.data);
    },
    [getRowId],
  );

  const setAria = useCallback(() => {
    document.querySelectorAll(`.ag-row ${checkboxClass}`).forEach((el) => {
      el.setAttribute('aria-description', ariaDescription);
    });
  }, []);

  useEffect(() => {
    const isCustomSelection = isUserSelectionEvent(
      lastSelectionSourceRef.current,
    );

    if (gridApi && selectedRowIds?.size && isCustomSelection) {
      const firstSelectedId = Array.from(selectedRowIds)[0];
      if (firstSelectedId) {
        const node = gridApi.getRowNode(firstSelectedId);
        if (node) {
          gridApi.ensureNodeVisible(node);
        }
      }
    }
  }, [gridApi, isUserSelectionEvent, selectedRowIds]);

  return (
    <div
      className={classNames(
        gridBaseClassName,
        className,
        selectionMode && 'with-selection-column',
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
          theme={themeBalham
            .withPart(colorSchemeDark)
            .withParams({ ...themeParams })}
          autoSizeStrategy={{ type: 'fitGridWidth' }}
          columnDefs={computedColumnDefs}
          defaultColDef={defaultColDef}
          selectionColumnDef={selectionColumnDef}
          onGridSizeChanged={onGridSizeChanged}
          onGridReady={onGridReady}
          loading={loading}
          suppressCellFocus={true}
          suppressDragLeaveHidesColumns={true}
          noRowsOverlayComponent={emptyStateRenderer}
          rowData={rowData}
          rowSelection={rowSelection}
          onSelectionChanged={debouncedOnSelectionChange}
          getRowId={agGridGetRowId}
          onRowDataUpdated={setAria}
          onBodyScroll={setAria}
          onFirstDataRendered={setAria}
          {...additionalGridOptions}
        />
      </div>
    </div>
  );
};
