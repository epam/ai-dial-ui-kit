import { useCallback, useEffect, useMemo, useState } from 'react';

export interface UseGridSelectionProps<T extends object> {
  selectedRowIds?: Set<string>;
  selectedRows?: Map<string, T>;
  onSelectionChange?: (selectedRowIds: Set<string>, selectedRows: T[]) => void;
  onSelectionChangeWithMap?: (selectedRows: Map<string, T>) => void;
  rowData?: T[];
  getRowId: (row: T) => string;
  disabledRowIds?: Set<string>;
}

export const useGridSelection = <T extends object>({
  selectedRowIds,
  selectedRows,
  onSelectionChange,
  onSelectionChangeWithMap,
  rowData = [],
  getRowId,
  disabledRowIds,
}: UseGridSelectionProps<T>) => {
  const [internalSelectedRows, setInternalSelectedRows] = useState<
    Map<string, T>
  >(new Map());

  const currentSelectedRows = selectedRows ?? internalSelectedRows;
  const currentSelectedIds = useMemo(
    () => new Set(currentSelectedRows.keys()),
    [currentSelectedRows],
  );

  const isRowDisabled = useCallback(
    (row: T) => disabledRowIds?.has(getRowId(row)) ?? false,
    [disabledRowIds, getRowId],
  );

  const enabledRows = useMemo(
    () => rowData.filter((row) => !isRowDisabled(row)),
    [rowData, isRowDisabled],
  );

  const isControlled =
    selectedRowIds !== undefined || selectedRows !== undefined;

  useEffect(() => {
    if (selectedRowIds !== undefined && !selectedRows) {
      const newMap = new Map<string, T>();
      rowData.forEach((row) => {
        const id = getRowId(row);
        if (selectedRowIds.has(id) && !disabledRowIds?.has(id)) {
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
  }, [
    selectedRowIds,
    selectedRows,
    rowData,
    getRowId,
    disabledRowIds,
    internalSelectedRows,
  ]);

  const handleSelectionToggle = useCallback(
    (row: T, checked: boolean) => {
      const rowId = getRowId(row);

      if (disabledRowIds?.has(rowId)) {
        return;
      }

      const newMap = new Map(currentSelectedRows);

      if (checked) {
        newMap.set(rowId, row);
      } else {
        newMap.delete(rowId);
      }

      if (!isControlled) {
        setInternalSelectedRows(newMap);
      }

      onSelectionChangeWithMap?.(newMap);

      if (onSelectionChange) {
        onSelectionChange(new Set(newMap.keys()), Array.from(newMap.values()));
      }
    },
    [
      currentSelectedRows,
      getRowId,
      disabledRowIds,
      isControlled,
      onSelectionChange,
      onSelectionChangeWithMap,
    ],
  );

  const headerCheckboxState = useMemo(() => {
    if (!enabledRows.length) return 'unchecked';

    const enabledIds = enabledRows.map(getRowId);

    const selectedEnabledCount = enabledIds.filter((id) =>
      currentSelectedIds.has(id),
    ).length;

    if (selectedEnabledCount === 0) return 'unchecked';
    if (selectedEnabledCount === enabledIds.length) return 'checked';
    return 'indeterminate';
  }, [enabledRows, currentSelectedIds, getRowId]);

  const handleHeaderCheckboxChange = useCallback(
    (checked?: boolean) => {
      const newMap = new Map<string, T>();

      if (checked) {
        enabledRows.forEach((row) => {
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
      enabledRows,
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
