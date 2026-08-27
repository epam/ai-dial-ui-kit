import type { ColDef, IRowNode } from 'ag-grid-community';

const collator = new Intl.Collator(undefined, {
  sensitivity: 'base',
  numeric: true,
});

export const baseColumnComparator = (
  a: string | number | undefined,
  b: string | number | undefined,
  _nodeA?: IRowNode,
  _nodeB?: IRowNode,
  isInverted?: boolean,
): number => {
  if (typeof a === 'string' && typeof b === 'string' && a && b) {
    const result = collator.compare(a, b);

    return result === 0 ? 0 : result > 0 ? 1 : -1;
  }

  if (a === b) {
    return 0;
  }

  if (!a) {
    return !isInverted ? 1 : -1;
  }

  if (!b) {
    return !isInverted ? -1 : 1;
  }

  return a > b ? 1 : -1;
};

export const omitUndefined = <T extends object>(value: T | undefined): T => {
  if (!value) {
    return {} as T;
  }

  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as T;
};

export const checkColDefsChanges = (cols: ColDef[], initialCols: ColDef[]) => {
  return cols.some((col, index) => {
    if (col.field !== initialCols[index].field) {
      return true;
    }
    return col.hide !== initialCols[index].hide;
  });
};
