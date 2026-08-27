import {
  AllCommunityModule,
  type ColDef,
  colorSchemeLight,
  type GridApi,
  type GridOptions,
  type GridReadyEvent,
  type GridSizeChangedEvent,
  type ICellRendererParams,
  ModuleRegistry,
  type SelectionChangedEvent,
  setupAgTestIds,
  themeBalham,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { IconZoomCancel } from '@tabler/icons-react';
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

import { useIsMobileScreen } from '@/hooks/use-is-mobile-screen';
import { useIsTabletScreen } from '@/hooks/use-is-tablet-screen';
import type { DropdownItem } from '@/models/dropdown';
import { GridSelectionMode } from '@/models/selection-mode';
import { DropdownTrigger } from '@/types/dropdown';
import { debounceFn } from '@/utils/debounce';
import { baseColumnComparator, omitUndefined } from '@/utils/grid-comparators';
import { mergeClasses } from '@/utils/merge-classes';

import { Dropdown } from '../Dropdown/Dropdown';
import { EllipsisTooltip } from '../EllipsisTooltip/EllipsisTooltip';
import { NoDataContent } from '../NoDataContent/NoDataContent';
import { SelectionCell } from './components/SelectionCell';
import { SelectionHeader } from './components/SelectionHeader';
import {
  GRID_HEADER_SELECT_CLASS,
  GRID_ROOT_CLASS,
  GRID_ROW_SELECT_CLASS,
  GRID_SELECTION_VISIBLE_CLASS,
  GRID_THEME_PARAMS,
  GRID_WITH_SELECTION_CLASS,
  GRID_WITHOUT_HEADER_BORDERS_CLASS,
  ROW_HEIGHT,
  SelectionEventSourceType,
} from './constants';
import { SELECTION_COL_DEF } from './renderers/constants';

setupAgTestIds({ testIdAttribute: 'dataQA' });
ModuleRegistry.registerModules([AllCommunityModule]);

/** Column id of the selection column this component prepends itself. */
export const GRID_SELECTION_COLUMN_ID = 'dial-kit-grid-selection';

/** Narrowest a data column may become while the grid distributes width. */
const DEFAULT_MIN_COLUMN_WIDTH = 150;

/** Selection changes are coalesced: ag-Grid fires one event per row. */
const SELECTION_DEBOUNCE_MS = 100;

export interface GridProps<T extends object = Record<string, unknown>> {
  /** Column definitions, in ag-Grid `ColDef` format. */
  columnDefs?: ColDef<T>[];
  /** Rows to display. */
  rowData?: T[];
  /** Extra ag-Grid options, merged over the defaults. */
  additionalGridOptions?: GridOptions<T>;
  /** Items of the row context menu. Omit it to render no context menu at all. */
  getContextMenuItems?: (row: T) => DropdownItem[];
  /** Additional CSS classes for the grid container. */
  className?: string;
  /** Accessible name of the grid region. Defaults to `'Data grid'`. */
  ariaLabel?: string;
  /** Whether custom cell renderers are wrapped with context-menu support. */
  wrapCustomCellRenderers?: boolean | ((col: ColDef<T>) => boolean);
  /** Rows that cannot be selected. Ids must match what `getRowId` returns. */
  disabledRowIds?: Set<string>;
  /** Controlled selection: ids of the selected rows. */
  selectedRowIds?: Set<string>;
  /** Fired when the grid API becomes available. */
  onGridApiChange?: (api: GridApi<T>) => void;
  /** Fired when the selection changes, with the selected ids and rows. */
  onSelectionChange?: (selectedRowIds: Set<string>, selectedRows: T[]) => void;
  /** Extracts the unique id of a row. Defaults to its `id` field. */
  getRowId?: (row: T) => string;
  /** Tints odd rows. Defaults to `false`. */
  alternateOddRowColors?: boolean;
  /** Placeholder of the column filter inputs. */
  filterPlaceholder?: string;
  /** Illustration of the empty state. */
  emptyStateIcon?: ReactNode;
  /** Headline of the empty state. */
  emptyStateTitle?: string;
  /** Secondary line of the empty state. */
  emptyStateDescription?: string;
  /** Shows the loading overlay. Defaults to `false`. */
  loading?: boolean;
  /** Draws a border around the grid. Defaults to `true`. */
  wrapperBorder?: boolean;
  /** Hides the vertical borders between header cells. Defaults to `false`. */
  withoutHeaderBorders?: boolean;
  /** Renders a selection column of checkboxes or radios. */
  selectionMode?: GridSelectionMode;
  /** Keeps the context menu on a row that cannot be selected. */
  allowDisabledContextMenu?: boolean;
  /** Accessible name of a row's selection control. Defaults to `'Select row'`. */
  selectRowLabel?: (row: T) => string;
  /** Accessible name of the select-all control. Defaults to `'Select all rows'`. */
  selectAllLabel?: string;
}

/**
 * A data grid built on ag-Grid, wired to the 2.0 tokens and controls.
 * aliases: DataTable|TableGrid|DataGrid
 * Design system 2.0
 *
 * Comes preconfigured with case-insensitive sorting, floating column filters,
 * columns sized to the available width, a row context menu, truncation
 * tooltips, and an empty state.
 *
 * The selection column renders the 2.0 `Checkbox` and `Radio` instead of
 * ag-Grid's own inputs, so selection looks and behaves like every other control
 * in the kit and the select-all reaches the `mixed` state when the selection is
 * partial. The column stays faded out until the row is hovered, something is
 * selected, or the keyboard reaches it.
 *
 * Selection works controlled or uncontrolled: pass `selectedRowIds` to own it,
 * or read `onSelectionChange` and let the grid keep its own. A `sort` declared
 * on a column is honoured — 1.0 stripped it on startup.
 *
 * @example
 * ```tsx
 * interface Product { id: string; name: string; price: number }
 *
 * const columns: ColDef<Product>[] = [
 *   { field: 'name', headerName: 'Product', flex: 1 },
 *   { field: 'price', headerName: 'Price', width: 120 },
 * ];
 *
 * <Grid<Product> columnDefs={columns} rowData={products} />
 *
 * // With selection and a context menu
 * <Grid<Product>
 *   columnDefs={columns}
 *   rowData={products}
 *   selectionMode={GridSelectionMode.MULTIPLE}
 *   selectedRowIds={selectedIds}
 *   onSelectionChange={(ids) => setSelectedIds(ids)}
 *   selectRowLabel={(row) => `Select ${row.name}`}
 *   getContextMenuItems={(row) => [{ key: 'edit', label: 'Edit' }]}
 * />
 * ```
 *
 * @param [columnDefs] - Column definitions, in ag-Grid `ColDef` format.
 * @param [rowData] - Rows to display.
 * @param [additionalGridOptions] - Extra ag-Grid options, merged over the defaults.
 * @param [getContextMenuItems] - Items of the row context menu. Omit for no menu.
 * @param [className] - Additional CSS classes for the grid container.
 * @param [ariaLabel='Data grid'] - Accessible name of the grid region.
 * @param [wrapCustomCellRenderers=true] - Whether custom renderers get context-menu support.
 * @param [disabledRowIds] - Rows that cannot be selected.
 * @param [selectedRowIds] - Controlled selection: ids of the selected rows.
 * @param [onGridApiChange] - Fired when the grid API becomes available.
 * @param [onSelectionChange] - Fired when the selection changes.
 * @param [getRowId] - Extracts the unique id of a row. Defaults to its `id` field.
 * @param [alternateOddRowColors=false] - Tints odd rows.
 * @param [filterPlaceholder='Enter value'] - Placeholder of the column filter inputs.
 * @param [emptyStateIcon] - Illustration of the empty state.
 * @param [emptyStateTitle='No results found'] - Headline of the empty state.
 * @param [emptyStateDescription] - Secondary line of the empty state.
 * @param [loading=false] - Shows the loading overlay.
 * @param [wrapperBorder=true] - Draws a border around the grid.
 * @param [withoutHeaderBorders=false] - Hides the vertical borders between header cells.
 * @param [selectionMode] - Renders a selection column of checkboxes or radios.
 * @param [allowDisabledContextMenu=false] - Keeps the context menu on a non-selectable row.
 * @param [selectRowLabel] - Accessible name of a row's selection control.
 * @param [selectAllLabel='Select all rows'] - Accessible name of the select-all control.
 */
export const Grid = <T extends object>({
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
  getRowId,
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
  selectRowLabel,
  selectAllLabel = 'Select all rows',
}: GridProps<T>) => {
  const [gridApi, setGridApi] = useState<GridApi<T> | undefined>();
  const isMobileScreen = useIsMobileScreen();
  const isTabletScreen = useIsTabletScreen();
  const selectedNodesRef = useRef<Set<string>>(new Set());
  const lastSelectionSourceRef = useRef<SelectionEventSourceType | undefined>(
    undefined,
  );
  // One radio group per grid instance: two single-select grids on a page would
  // otherwise share a group and steal each other's selection.
  const radioGroupName = `dial-kit-grid-selection-${useId()}`;

  /**
   * The callback props are read through a box rather than closed over, so the
   * column definitions keep their identity across renders. ag-Grid rebuilds
   * every cell when a definition changes, and a rebuild mid-interaction
   * detaches the very input the user is clicking — which is what made the 1.0
   * grid drop clicks whenever an inline `getRowId` was passed.
   */
  const callbacksRef = useRef({
    getRowId,
    getContextMenuItems,
    onSelectionChange,
    selectRowLabel,
    wrapCustomCellRenderers,
  });
  callbacksRef.current = {
    getRowId,
    getContextMenuItems,
    onSelectionChange,
    selectRowLabel,
    wrapCustomCellRenderers,
  };

  const resolveRowId = useCallback((row: T) => {
    const custom = callbacksRef.current.getRowId;

    if (custom) return custom(row);

    return String((row as Record<string, unknown>).id ?? JSON.stringify(row));
  }, []);

  const hasContextMenu = !!getContextMenuItems;
  const wrapsRenderers = !!wrapCustomCellRenderers;

  const theme = useMemo(
    () =>
      themeBalham.withPart(colorSchemeLight).withParams({
        ...GRID_THEME_PARAMS,
        oddRowBackgroundColor: alternateOddRowColors
          ? GRID_THEME_PARAMS.oddRowBackgroundColor
          : GRID_THEME_PARAMS.backgroundColor,
        wrapperBorder,
      }),
    [alternateOddRowColors, wrapperBorder],
  );

  const onGridSizeChanged = useCallback((e: GridSizeChangedEvent) => {
    e.api.sizeColumnsToFit();
  }, []);

  /**
   * There is no hover state to reveal the selection column on a touch screen,
   * and hiding it once rows are selected would take the user's own selection
   * off screen — so it stays pinned in both cases.
   */
  const isSelectionPinnedVisible =
    isMobileScreen || isTabletScreen || (selectedRowIds?.size ?? 0) > 0;

  const isRowDisabled = useCallback(
    (row: T | undefined | null) =>
      !!row && !!disabledRowIds?.has(resolveRowId(row)),
    [disabledRowIds, resolveRowId],
  );

  const withContextMenu = useCallback(
    (
      p: ICellRendererParams<T, unknown>,
      content: ReactNode,
      disabled: boolean,
    ) => {
      if (!hasContextMenu) {
        return content;
      }

      return (
        <Dropdown
          trigger={[DropdownTrigger.ContextMenu]}
          items={
            p.data
              ? (callbacksRef.current.getContextMenuItems?.(p.data) ?? [])
              : []
          }
          anchorToMouse
          matchReferenceWidth
          className={mergeClasses(
            'size-full',
            disabled && 'cursor-not-allowed opacity-75',
          )}
          disabled={disabled && !allowDisabledContextMenu}
        >
          <span className="block min-w-0 max-w-full flex-1">{content}</span>
        </Dropdown>
      );
    },
    [hasContextMenu, allowDisabledContextMenu],
  );

  const renderDataCell = useCallback(
    (p: ICellRendererParams<T, unknown>) => {
      if (!p.data) return null;

      const disabled = isRowDisabled(p.data);

      return withContextMenu(
        p,
        <EllipsisTooltip
          text={p.value == null ? '' : String(p.value)}
          // No `h-full`: a full-height text box puts its line at the top of the
          // row, while a cell renderer of its own natural height is centred by
          // `.ag-cell`. Mixing the two left the columns visibly out of line.
          className="max-w-full dial-small-text text-primary"
          hideTooltip={disabled}
        />,
        disabled,
      );
    },
    [isRowDisabled, withContextMenu],
  );

  const isUserSelectionEvent = useCallback(
    (source?: SelectionEventSourceType) =>
      source === SelectionEventSourceType.API ||
      source === SelectionEventSourceType.ROW_DATA_CHANGED,
    [],
  );

  /**
   * Stable on purpose: ag-Grid keeps the handler it was given at start-up, so a
   * handler rebuilt on every render would leave it holding a stale closure —
   * in 1.0 that closure captured `gridApi` before it existed and returned early
   * forever, which swallowed every selection change.
   */
  const onSelectionChanged = useMemo(
    () =>
      debounceFn((event: SelectionChangedEvent) => {
        const selectedNodes = event.selectedNodes ?? [];
        const selectedRows = selectedNodes.map((node) => node.data as T);
        const selectedIds = new Set(selectedRows.map(resolveRowId));

        selectedNodesRef.current = selectedIds;
        lastSelectionSourceRef.current =
          event.source as SelectionEventSourceType;

        if (isUserSelectionEvent(event.source as SelectionEventSourceType)) {
          return;
        }

        callbacksRef.current.onSelectionChange?.(selectedIds, selectedRows);
      }, SELECTION_DEBOUNCE_MS),
    [isUserSelectionEvent, resolveRowId],
  );

  const selectionColumn = useMemo<ColDef<T> | undefined>(() => {
    if (!selectionMode) return undefined;

    return {
      ...SELECTION_COL_DEF,
      colId: GRID_SELECTION_COLUMN_ID,
      headerName: '',
      headerClass: GRID_HEADER_SELECT_CLASS,
      cellClass: GRID_ROW_SELECT_CLASS,
      headerComponent:
        selectionMode === GridSelectionMode.MULTIPLE
          ? SelectionHeader
          : undefined,
      headerComponentParams: { label: selectAllLabel },
      cellRenderer: (p: ICellRendererParams<T, unknown>) => {
        if (!p.data) return null;

        const rowId = resolveRowId(p.data);

        return (
          <SelectionCell
            params={p}
            mode={selectionMode}
            rowId={rowId}
            radioName={radioGroupName}
            label={
              callbacksRef.current.selectRowLabel?.(p.data) ?? 'Select row'
            }
            disabled={disabledRowIds?.has(rowId)}
          />
        );
      },
    } as ColDef<T>;
  }, [
    selectionMode,
    selectAllLabel,
    resolveRowId,
    disabledRowIds,
    radioGroupName,
  ]);

  const wrapRendererIfNeeded = useCallback(
    (col: ColDef<T>): ColDef<T> => {
      if (!col.cellRenderer) {
        return { ...col, cellRenderer: renderDataCell };
      }

      const wrapSetting = callbacksRef.current.wrapCustomCellRenderers;
      const shouldWrap =
        typeof wrapSetting === 'function' ? wrapSetting(col) : !!wrapSetting;

      if (!shouldWrap) {
        return col;
      }

      const userRenderer = col.cellRenderer;

      const Wrapped: FC<ICellRendererParams<T, unknown>> = (p) => {
        const disabled = isRowDisabled(p.data);
        const Renderer =
          typeof userRenderer === 'function' ? userRenderer : undefined;
        const content = Renderer ? <Renderer {...p} /> : renderDataCell(p);

        return withContextMenu(p, content, disabled);
      };

      return { ...col, cellRenderer: Wrapped };
    },
    [isRowDisabled, renderDataCell, withContextMenu],
  );

  const computedColumnDefs = useMemo<ColDef<T>[]>(() => {
    const columns = wrapsRenderers
      ? (columnDefs ?? []).map(wrapRendererIfNeeded)
      : (columnDefs ?? []);

    return selectionColumn ? [selectionColumn, ...columns] : columns;
  }, [columnDefs, wrapsRenderers, wrapRendererIfNeeded, selectionColumn]);

  const {
    defaultColDef: consumerDefaultColDef,
    rowSelection: consumerRowSelection,
    ...restAdditionalGridOptions
  } = additionalGridOptions ?? {};

  const defaultColDef: ColDef<T> = useMemo(
    () => ({
      minWidth: DEFAULT_MIN_COLUMN_WIDTH,
      resizable: true,
      sortable: true,
      floatingFilter: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        filterPlaceholder,
        buttons: ['reset'],
      },
      comparator: baseColumnComparator,
      ...omitUndefined(consumerDefaultColDef),
    }),
    [filterPlaceholder, consumerDefaultColDef],
  );

  const onGridReady = (e: GridReadyEvent) => {
    e.api.sizeColumnsToFit();

    setGridApi(e.api as GridApi<T>);
    additionalGridOptions?.onGridReady?.(e);
    onGridApiChange?.(e.api as GridApi<T>);
  };

  useEffect(() => {
    if (gridApi && rowData) {
      gridApi.setGridOption('rowData', rowData);
    }
  }, [gridApi, rowData]);

  const emptyStateRenderer = useCallback(
    () => (
      <NoDataContent
        live
        title={emptyStateTitle}
        description={emptyStateDescription}
        icon={
          emptyStateIcon ?? (
            <IconZoomCancel size={100} stroke={0.5} aria-hidden="true" />
          )
        }
      />
    ),
    [emptyStateTitle, emptyStateDescription, emptyStateIcon],
  );

  /*
    ag-Grid still accepts the legacy `'single'` / `'multiple'` strings for
    `rowSelection`; only the options object can be merged into the selection
    this component computes for itself.
  */
  const consumerRowSelectionOptions =
    typeof consumerRowSelection === 'object' ? consumerRowSelection : undefined;

  const rowSelection = useMemo<GridOptions<T>['rowSelection']>(() => {
    /*
      Without a selection mode there is no selection column, so a consumer
      configuring ag-Grid's own selection keeps it exactly as written.
    */
    if (!selectionMode) return consumerRowSelection;

    return {
      isRowSelectable: (node) => !isRowDisabled(node.data as T | undefined),
      /*
        Merged, not replaced, the way `defaultColDef` is: a consumer reaching
        for `isRowSelectable` alone would otherwise hand ag-Grid a whole new
        object and lose the three settings below with it.
      */
      ...consumerRowSelectionOptions,
      /*
        `selectionMode` owns the mode, because it also decides whether the
        selection column draws checkboxes or radios.
      */
      mode:
        selectionMode === GridSelectionMode.SINGLE ? 'singleRow' : 'multiRow',
      // The controls live in this component's own selection column, so
      // ag-Grid's inputs are switched off and only its behaviour is used.
      checkboxes: false,
      headerCheckbox: false,
    };
  }, [
    consumerRowSelection,
    consumerRowSelectionOptions,
    isRowDisabled,
    selectionMode,
  ]);

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
    (params: { data?: T }) => (params.data ? resolveRowId(params.data) : ''),
    [resolveRowId],
  );

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
      className={mergeClasses(
        GRID_ROOT_CLASS,
        'size-full',
        selectionMode && GRID_WITH_SELECTION_CLASS,
        selectionMode &&
          isSelectionPinnedVisible &&
          GRID_SELECTION_VISIBLE_CLASS,
        withoutHeaderBorders && GRID_WITHOUT_HEADER_BORDERS_CLASS,
        className,
      )}
      role="region"
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {/* ag-Grid renders its own `role="grid"` inside, so this wrapper stays a
          plain scroll container rather than claiming a table role of its own. */}
      <div className="h-full overflow-x-auto">
        <AgGridReact<T>
          rowModelType="clientSide"
          headerHeight={ROW_HEIGHT}
          rowHeight={ROW_HEIGHT}
          cellSelection={false}
          theme={theme}
          autoSizeStrategy={{ type: 'fitGridWidth' }}
          columnDefs={computedColumnDefs}
          defaultColDef={defaultColDef}
          onGridSizeChanged={onGridSizeChanged}
          onGridReady={onGridReady}
          loading={loading}
          suppressCellFocus
          suppressDragLeaveHidesColumns
          noRowsOverlayComponent={emptyStateRenderer}
          rowData={rowData}
          rowSelection={rowSelection}
          onSelectionChanged={onSelectionChanged}
          getRowId={agGridGetRowId}
          {...restAdditionalGridOptions}
        />
      </div>
    </div>
  );
};
