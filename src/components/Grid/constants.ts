export const gridBaseClassName = 'h-full w-full';
export const checkboxClass = '.ag-checkbox-input';

export const GRID_THEME_COLORS = {
  accentColor: 'var(--bg-control-accent, var(--bg-accent-primary, #5C8DEA))',
  backgroundColor: 'var(--bg-layer-3, var(--bg-layer-3, #FCFCFC))',
  oddRowBackgroundColor: 'var(--bg-layer-2, var(--bg-layer-2, #EEF1F7))',
  // The row tint has to stay translucent: the row it paints carries body text
  // and a checkbox filled with `accentColor`, so an opaque accent hides both.
  // `--bg-accent-primary-alpha` is the tint every other 1.0 control hovers
  // with; the controls' `*-alpha-active` token this used to read is the
  // pressed-state fill, which themes do define opaque.
  selectedRowBackgroundColor: 'var(--bg-accent-primary-alpha, #7DA4FF26)',
  borderColor: 'var(--bg-layer-4, #D1DBEA)',
  rowBorder: '1px solid var(--stroke-tertiary, var(--stroke-primary, #6B7280))',
  rowHoverColor: 'var(--bg-accent-primary-alpha, #7DA4FF26)',
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
