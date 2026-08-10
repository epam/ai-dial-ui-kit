export const gridBaseClassName = 'h-full w-full';
export const checkboxClass = '.ag-checkbox-input';

export const GRID_THEME_COLORS = {
  accentColor: 'var(--bg-control-accent, var(--bg-accent-primary, #5C8DEA))',
  backgroundColor: 'var(--bg-layer-raised, var(--bg-layer-3, #FCFCFC))',
  oddRowBackgroundColor: 'var(--bg-layer-sunken, var(--bg-layer-2, #EEF1F7))',
  selectedRowBackgroundColor:
    'var(--controls-bg-accent-primary-alpha-active, var(--bg-accent-primary-alpha, #7DA4FF26))',
  borderColor: 'var(--bg-layer-4, #D1DBEA)',
  rowBorder: '1px solid var(--stroke-tertiary, var(--stroke-primary, #6B7280))',
  rowHoverColor:
    'var(--controls-bg-accent-primary-alpha-active, var(--bg-accent-primary-alpha, #7DA4FF26))',
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
