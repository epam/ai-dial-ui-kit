import { useCallback, useMemo, useState } from 'react';

export interface UseGridSelectionProps<T> {
  selectedRowIds?: Set<string>;
  onSelectionChange?: (selectedRowIds: Set<string>, selectedRows: T[]) => void;
  rowData?: T[];
  getRowId: (row: T) => string;
}

export const useGridSelection = <T extends object>({
  selectedRowIds,
  onSelectionChange,
  rowData,
  getRowId,
}: UseGridSelectionProps<T>) => {
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(
    new Set(),
  );

  const currentSelectedIds = selectedRowIds ?? internalSelectedIds;

  const handleSelectionChange = useCallback(
    (newIds: Set<string>) => {
      if (onSelectionChange && selectedRowIds !== undefined) {
        const selectedRows = (rowData || []).filter((row) =>
          newIds.has(getRowId(row)),
        );

        try {
          onSelectionChange(newIds, selectedRows);
        } catch {
          // Ignore errors
        }
      } else {
        setInternalSelectedIds(newIds);
      }
    },
    [onSelectionChange, selectedRowIds, rowData, getRowId],
  );

  const handleSelectionToggle = useCallback(
    (rowId: string, checked: boolean) => {
      const newSelectedIds = new Set(currentSelectedIds);
      if (checked) {
        newSelectedIds.add(rowId);
      } else {
        newSelectedIds.delete(rowId);
      }
      handleSelectionChange(newSelectedIds);
    },
    [currentSelectedIds, handleSelectionChange],
  );

  const totalRowCount = rowData?.length || 0;
  const selectedCount = currentSelectedIds.size;

  const headerCheckboxState = useMemo(() => {
    if (selectedCount === 0) return 'unchecked';
    if (selectedCount === totalRowCount) return 'checked';
    return 'indeterminate';
  }, [selectedCount, totalRowCount]);

  const handleHeaderCheckboxChange = useCallback(() => {
    if (headerCheckboxState === 'checked') {
      handleSelectionChange(new Set());
    } else {
      const allIds = new Set((rowData || []).map(getRowId));
      handleSelectionChange(allIds);
    }
  }, [headerCheckboxState, handleSelectionChange, rowData, getRowId]);

  return {
    currentSelectedIds,
    handleSelectionToggle,
    headerCheckboxState,
    handleHeaderCheckboxChange,
  };
};
