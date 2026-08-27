/** Root class of the 2.0 grid; every rule in `styles/grid.scss` sits under it. */
export const GRID_ROOT_CLASS = 'dial-kit-grid';

/** Present only while a selection column is rendered. Drives its reveal. */
export const GRID_WITH_SELECTION_CLASS = 'dial-kit-grid-with-selection';

export const GRID_WITHOUT_HEADER_BORDERS_CLASS =
  'dial-kit-grid-without-header-borders';

/** Cell of the selection column: faded out until the row is hovered. */
export const GRID_ROW_SELECT_CLASS = 'dial-kit-grid-row-select';

/** Header of the selection column: faded out until the header is hovered. */
export const GRID_HEADER_SELECT_CLASS = 'dial-kit-grid-header-select';

/**
 * Pins the whole selection column visible — on touch, or once something is
 * selected. It sits on the container rather than on the column definition:
 * ag-Grid rebuilds every cell when a column definition changes, which would
 * pull the DOM out from under the click that caused the selection.
 */
export const GRID_SELECTION_VISIBLE_CLASS = 'dial-kit-grid-selection-visible';

/** Right-aligns a column. Applied by the consumer through `cellClass`. */
export const GRID_ALIGN_RIGHT_CLASS = 'dial-kit-grid-align-right';

/** Height of both a body row and the header row. */
export const ROW_HEIGHT = 40;

/**
 * ag-Grid theme parameters, resolved from the 2.0 colour tokens with the same
 * literal fallbacks the Tailwind config carries, so a consumer that defines no
 * CSS variables still gets the intended palette.
 *
 * Hover sits one step up the accent-alpha ramp from the selected tint, so a
 * hovered selected row still reads as hovered — the same relationship the 2.0
 * dropdown and select rows use.
 */
export const GRID_THEME_PARAMS = {
  accentColor: 'var(--bg-control-accent, #1D4ED8)',
  backgroundColor: 'var(--bg-layer-raised, #FCFCFC)',
  oddRowBackgroundColor: 'var(--bg-layer-sunken, #EEF1F7)',
  selectedRowBackgroundColor: 'var(--bg-control-accent-alpha, #2764D90F)',
  rowHoverColor: 'var(--bg-control-accent-alpha-hover, #2764D924)',
  borderColor: 'var(--stroke-tertiary, #E0E6F0)',
  rowBorder: '1px solid var(--stroke-tertiary, #E0E6F0)',
  chromeBackgroundColor: 'var(--bg-layer-base, #F5F7FA)',
  foregroundColor: 'var(--text-primary, #161B2D)',
  headerTextColor: 'var(--text-secondary, #57647A)',
  // 1.0 asked the browser for dark native widgets while painting a light
  // theme; the scheme now matches the palette it is used with.
  browserColorScheme: 'light',
  headerFontSize: 14,
  headerFontWeight: 600,
  fontSize: 14,
  fontFamily: 'var(--theme-font, var(--font-inter))',
  spacing: 4,
  borderRadius: 4,
  wrapperBorderRadius: 8,
};

/**
 * Sources reported with a selection change. `checkboxSelected` marks the ones
 * the user made in the selection column, the other two mark selections the
 * component applied itself while syncing to `selectedRowIds` or new row data.
 */
export enum SelectionEventSourceType {
  API = 'api',
  ROW_DATA_CHANGED = 'rowDataChanged',
  CHECKBOX_SELECTED = 'checkboxSelected',
}
