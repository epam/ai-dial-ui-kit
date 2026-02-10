export const gridBaseClassName = 'h-full w-full';
export const checkboxClass = '.ag-checkbox-input';

export const GRID_THEME_COLORS = {
  accentColor: 'var(--controls-bg-accent, #5C8DEA)',
  backgroundColor: 'var(--bg-layer-3, #222932)',
  oddRowBackgroundColor: 'var(--bg-layer-2, #141A23)',
  selectedRowBackgroundColor: 'var(--bg-accent-primary-alpha, #74A4FF26)',
  borderColor: 'var(--bg-layer-4, #333942)',
  rowBorder: '1px solid var(--stroke-tertiary, #090D13)',
  rowHoverColor: 'var(--bg-accent-primary-alpha, #74A4FF26)',
  borderRadius: 3,
  browserColorScheme: 'dark',
  chromeBackgroundColor: 'var(--bg-layer-1, #090D13)',
  foregroundColor: 'var(--text-primary, #F3F4F6)',
  headerFontSize: 14,
  headerFontWeight: 600,
  headerTextColor: 'var(--text-secondary, #7F8792)',
  spacing: 4,
  wrapperBorderRadius: 3,
  fontSize: 14,
  fontFamily: {
    googleFont: 'var(--theme-font, var(--font-inter))',
  },
};

export const ROW_HEIGHT = 40;

export enum SelectionEventSourceType {
  API = 'api',
  ROW_DATA_CHANGED = 'rowDataChanged',
  CHECKBOX_SELECTED = 'checkboxSelected',
}
