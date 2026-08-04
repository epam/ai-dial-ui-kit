export const gridBaseClassName = 'h-full w-full';
export const checkboxClass = '.ag-checkbox-input';

export const GRID_THEME_COLORS = {
  accentColor: 'var(--bg-control-accent, #124ACE)',
  backgroundColor: 'var(--bg-layer-raised, #FCFCFC)',
  oddRowBackgroundColor: 'var(--bg-layer-sunken, #EEF1F7)',
  selectedRowBackgroundColor:
    'var(--controls-bg-accent-primary-alpha-active, #7DA4FF5C)',
  borderColor: 'var(--bg-layer-4, #D1DBEA)',
  rowBorder: '1px solid var(--stroke-tertiary, #E0E6F0)',
  rowHoverColor: 'var(--controls-bg-accent-primary-alpha-active, #7DA4FF5C)',
  borderRadius: 3,
  browserColorScheme: 'dark',
  chromeBackgroundColor: 'var(--bg-layer-1, #E0E6F0)',
  foregroundColor: 'var(--text-primary, #161B2D)',
  headerFontSize: 14,
  headerFontWeight: 600,
  headerTextColor: 'var(--text-secondary, #6B7280)',
  spacing: 4,
  wrapperBorderRadius: 3,
  fontSize: 14,
  fontFamily: 'var(--theme-font, var(--font-inter))',
};

export const ROW_HEIGHT = 40;

export enum SelectionEventSourceType {
  API = 'api',
  ROW_DATA_CHANGED = 'rowDataChanged',
  CHECKBOX_SELECTED = 'checkboxSelected',
}
