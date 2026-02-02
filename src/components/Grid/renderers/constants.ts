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

export const dateCellBaseClassName = 'text-primary';

const COLUMN_WIDTH = 40;

export const SELECTION_COL_DEF: ColDef = {
  minWidth: COLUMN_WIDTH,
  width: COLUMN_WIDTH,
  maxWidth: COLUMN_WIDTH,
};

export const RADIO_BUTTON_COL_DEF: ColDef = {
  cellClass: 'ag-grid-no-checkbox',
  ...SELECTION_COL_DEF,
};

export const CHECKBOX_COL_DEF: ColDef = {
  ...SELECTION_COL_DEF,
};
