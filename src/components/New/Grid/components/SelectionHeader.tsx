import type { GridApi, IHeaderParams } from 'ag-grid-community';
import { useCallback, useEffect, useState } from 'react';

import { Checkbox } from '../../Checkbox/Checkbox';
import { SelectionEventSourceType } from '../constants';

/**
 * Counts the rows the header speaks for. Filtered-out rows are left out, so the
 * checkbox describes what is on screen — and `selectAll('filtered')` below
 * selects exactly the rows it was counting.
 */
const countSelection = (api: GridApi) => {
  let selected = 0;
  let selectable = 0;

  api.forEachNodeAfterFilter((node) => {
    if (node.selectable === false) return;

    selectable++;
    if (node.isSelected()) selected++;
  });

  return { selected, selectable };
};

export interface SelectionHeaderProps<T> extends IHeaderParams<T> {
  /** Accessible name of the select-all control. */
  label: string;
}

/**
 * Select-all {@link Checkbox} for the selection column, in place of ag-Grid's
 * own header checkbox.
 *
 * It derives its state from the grid rather than from a prop: partly selected
 * rows put it in the `mixed` state, and disabled rows are excluded from the
 * count so a grid whose selectable rows are all selected still reads as full.
 */
export const SelectionHeader = <T,>({
  api,
  label,
}: SelectionHeaderProps<T>) => {
  const [{ selected, selectable }, setCounts] = useState(() =>
    countSelection(api),
  );

  useEffect(() => {
    const sync = () => setCounts(countSelection(api));

    sync();
    api.addEventListener('selectionChanged', sync);
    // Rows arriving, leaving or being filtered all change what the header
    // speaks for, so the count is refreshed on model updates too.
    api.addEventListener('modelUpdated', sync);

    return () => {
      if (api.isDestroyed()) return;

      api.removeEventListener('selectionChanged', sync);
      api.removeEventListener('modelUpdated', sync);
    };
  }, [api]);

  const onChange = useCallback(
    (next: boolean) => {
      if (next) {
        api.selectAll('filtered', SelectionEventSourceType.CHECKBOX_SELECTED);
        return;
      }

      api.deselectAll('filtered', SelectionEventSourceType.CHECKBOX_SELECTED);
    },
    [api],
  );

  return (
    <Checkbox
      isSelected={selectable > 0 && selected === selectable}
      isIndeterminate={selected > 0 && selected < selectable}
      disabled={selectable === 0}
      aria-label={label}
      onChange={onChange}
    />
  );
};
