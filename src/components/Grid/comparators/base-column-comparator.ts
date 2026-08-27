// The comparators moved to `@/utils/grid-comparators` so the 2.0 Grid can use
// them without importing out of the 1.0 component folder. Re-exported here so
// existing 1.0 imports keep working.
export {
  baseColumnComparator,
  checkColDefsChanges,
  omitUndefined,
} from '@/utils/grid-comparators';
