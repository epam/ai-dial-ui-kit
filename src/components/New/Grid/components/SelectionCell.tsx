import type { ICellRendererParams, IRowNode } from 'ag-grid-community';
import { useEffect, useState } from 'react';

import { GridSelectionMode } from '@/models/selection-mode';
import { Checkbox } from '../../Checkbox/Checkbox';
import { Radio } from '../../Radio/Radio';
import { SelectionEventSourceType } from '../constants';

export interface SelectionCellProps<T> {
  params: ICellRendererParams<T>;
  mode: GridSelectionMode;
  /** Accessible name of the control; a row-specific name is far more useful. */
  label: string;
  /** Shared radio group name, so single mode behaves as one group. */
  radioName: string;
  rowId: string;
  disabled?: boolean;
}

/**
 * The 2.0 {@link Checkbox} or {@link Radio} rendered in the selection column,
 * in place of ag-Grid's own checkbox.
 *
 * The row node is the source of truth: the control subscribes to its
 * `rowSelected` event, so a selection made anywhere — another cell, the header,
 * or the `selectedRowIds` prop — is reflected here without refreshing the cell.
 */
export const SelectionCell = <T,>({
  params,
  mode,
  label,
  radioName,
  rowId,
  disabled,
}: SelectionCellProps<T>) => {
  const node = params.node as IRowNode<T>;
  const [isSelected, setIsSelected] = useState(() => !!node.isSelected());

  useEffect(() => {
    const sync = () => setIsSelected(!!node.isSelected());

    sync();
    node.addEventListener('rowSelected', sync);

    return () => node.removeEventListener('rowSelected', sync);
  }, [node]);

  const select = (next: boolean) => {
    if (disabled) return;

    node.setSelected(
      next,
      // Single mode clears the rest of the selection, as a radio group does.
      mode === GridSelectionMode.SINGLE,
      SelectionEventSourceType.CHECKBOX_SELECTED,
    );
  };

  if (mode === GridSelectionMode.SINGLE) {
    return (
      <Radio
        name={radioName}
        value={rowId}
        isSelected={isSelected}
        disabled={disabled}
        aria-label={label}
        onChange={() => select(true)}
      />
    );
  }

  return (
    <Checkbox
      isSelected={isSelected}
      disabled={disabled}
      aria-label={label}
      onChange={select}
    />
  );
};
