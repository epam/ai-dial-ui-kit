import { useCallback, useEffect, useMemo, useState } from 'react';

export interface UseGridSelectionProps<T extends object> {
  selectedRowIds?: Set<string>;
  selectedRows?: Map<string, T>;
  onSelectionChange?: (selectedRowIds: Set<string>, selectedRows: T[]) => void;
  onSelectionChangeWithMap?: (selectedRows: Map<string, T>) => void;
  rowData?: T[];
  getRowId: (row: T) => string;
}

export const useGridSelection = <T extends object>({
  selectedRowIds,
  selectedRows,
  onSelectionChange,
  onSelectionChangeWithMap,
  rowData = [],
  getRowId,
}: UseGridSelectionProps<T>) => {
  const [internalSelectedRows, setInternalSelectedRows] = useState<
    Map<string, T>
  >(new Map());

  const currentSelectedRows = selectedRows ?? internalSelectedRows;
  const currentSelectedIds = useMemo(
    () => new Set(currentSelectedRows.keys()),
    [currentSelectedRows],
  );

  const isControlled =
    selectedRowIds !== undefined || selectedRows !== undefined;

  useEffect(() => {
    if (selectedRowIds !== undefined && !selectedRows) {
      const newMap = new Map<string, T>();
      rowData.forEach((row) => {
        const id = getRowId(row);
        if (selectedRowIds.has(id)) {
          newMap.set(id, row);
        }
      });

      const hasChanges =
        newMap.size !== internalSelectedRows.size ||
        Array.from(newMap.keys()).some((key) => !internalSelectedRows.has(key));

      if (hasChanges) {
        setInternalSelectedRows(newMap);
      }
    }
  }, [selectedRowIds, selectedRows, rowData, getRowId, internalSelectedRows]);

  const handleSelectionToggle = useCallback(
    (row: T, checked: boolean) => {
      const rowId = getRowId(row);
      const newMap = new Map(currentSelectedRows);

      if (checked) {
        newMap.set(rowId, row);
      } else {
        newMap.delete(rowId);
      }

      if (!isControlled) {
        setInternalSelectedRows(newMap);
      }

      if (onSelectionChangeWithMap) {
        onSelectionChangeWithMap(newMap);
      }

      if (onSelectionChange) {
        const ids = new Set(newMap.keys());
        const rows = Array.from(newMap.values());
        onSelectionChange(ids, rows);
      }
    },
    [
      currentSelectedRows,
      getRowId,
      isControlled,
      onSelectionChange,
      onSelectionChangeWithMap,
    ],
  );

  const headerCheckboxState = useMemo(() => {
    if (!rowData.length) return 'unchecked';
    const allSelected = rowData.every((row) =>
      currentSelectedIds.has(getRowId(row)),
    );
    const someSelected = rowData.some((row) =>
      currentSelectedIds.has(getRowId(row)),
    );

    if (allSelected) return 'checked';
    if (someSelected) return 'indeterminate';
    return 'unchecked';
  }, [rowData, currentSelectedIds, getRowId]);

  const handleHeaderCheckboxChange = useCallback(
    (checked?: boolean) => {
      const newMap = new Map<string, T>();

      if (checked) {
        rowData.forEach((row) => {
          const id = getRowId(row);
          newMap.set(id, row);
        });
      }

      if (!isControlled) {
        setInternalSelectedRows(newMap);
      }

      if (onSelectionChangeWithMap) {
        onSelectionChangeWithMap(newMap);
      }

      if (onSelectionChange) {
        const ids = new Set(newMap.keys());
        const rows = Array.from(newMap.values());
        onSelectionChange(ids, rows);
      }
    },
    [
      rowData,
      getRowId,
      isControlled,
      onSelectionChange,
      onSelectionChangeWithMap,
    ],
  );

  return {
    currentSelectedIds,
    currentSelectedRows,
    handleSelectionToggle,
    headerCheckboxState,
    handleHeaderCheckboxChange,
  };
};
