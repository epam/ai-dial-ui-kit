/**
 * `@epam/ai-dial-ui-kit/grid` - curated subpath for both Grid generations.
 *
 * Re-exports the Grid-related names from the root `src/index.ts` barrel.
 * This subpath is an ergonomic feature boundary, not a substitute for the
 * root entry's own tree-shaking (which
 * `preserveModules` already provides for a root `import { Button } from
 * '@epam/ai-dial-ui-kit'`). Importing from here pulls in ag-grid-community /
 * ag-grid-react, exactly as importing `Grid`/`DialGrid` from the root does.
 */

// Legacy Grid (design system 1.0)
export { DialGrid } from '../components/Grid/Grid';
export type { DialGridProps } from '../components/Grid/Grid';
export { DialDateCellRenderer } from '../components/Grid/renderers/DateCellRenderer';
export type {
  DateValue as DialGridDateValue,
  DialDateCellRendererProps,
} from '../components/Grid/renderers/DateCellRenderer';
export {
  DEFAULT_DATE_FORMAT_OPTIONS as DEFAULT_GRID_DATE_FORMAT_OPTIONS,
  DEFAULT_LOCALE as DEFAULT_GRID_DATE_LOCALE,
} from '../components/Grid/renderers/constants';
export { convertToDate as convertGridDateToDate } from '../components/Grid/renderers/utils';

// Grid (design system 2.0)
export { Grid, GRID_SELECTION_COLUMN_ID } from '../components/New/Grid/Grid';
export type { GridProps } from '../components/New/Grid/Grid';
export { DateCellRenderer } from '../components/New/Grid/renderers/DateCellRenderer';
export type {
  DateCellRendererProps,
  DateValue,
} from '../components/New/Grid/renderers/DateCellRenderer';
export {
  DEFAULT_DATE_FORMAT_OPTIONS,
  DEFAULT_LOCALE as DEFAULT_DATE_LOCALE,
} from '../components/New/Grid/renderers/constants';
export {
  GRID_ALIGN_RIGHT_CLASS,
  GRID_ROOT_CLASS,
  GRID_THEME_PARAMS,
  ROW_HEIGHT as GRID_ROW_HEIGHT,
} from '../components/New/Grid/constants';
export { convertToDate } from '../utils/grid-date';
export {
  baseColumnComparator,
  checkColDefsChanges,
} from '../utils/grid-comparators';

// Shared model used by both generations' row-selection behavior
export { GridSelectionMode } from '../models/selection-mode';
