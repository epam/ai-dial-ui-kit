import type { ColDef } from 'ag-grid-community';

export const DEFAULT_LOCALE = 'en-US';

export const DEFAULT_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

/** Just wide enough for a 20px control plus the grid's own cell padding. */
const SELECTION_COLUMN_WIDTH = 40;

/** Fixed, unsortable and unfilterable: the column holds a control, not data. */
export const SELECTION_COL_DEF: ColDef = {
  minWidth: SELECTION_COLUMN_WIDTH,
  width: SELECTION_COLUMN_WIDTH,
  maxWidth: SELECTION_COLUMN_WIDTH,
  resizable: false,
  sortable: false,
  filter: false,
  floatingFilter: false,
  suppressMovable: true,
  suppressHeaderMenuButton: true,
  suppressAutoSize: true,
  suppressSizeToFit: true,
};
