import { renderHook, act } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { useGridSelection } from './use-grid-selection';

interface TestRow {
  id: string;
  name: string;
}

const testRows: TestRow[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

const getRowId = (row: TestRow) => row.id;

describe('Dial UI Kit :: useGridSelection', () => {
  test('returns current selection state', () => {
    const { result } = renderHook(() =>
      useGridSelection({
        rowData: testRows,
        getRowId,
      }),
    );

    expect(result.current.currentSelectedIds).toBeInstanceOf(Set);
    expect(result.current.currentSelectedIds.size).toBe(0);
    expect(result.current.currentSelectedRows).toBeInstanceOf(Map);
    expect(result.current.currentSelectedRows.size).toBe(0);
    expect(result.current.headerCheckboxState).toBe('unchecked');
  });

  test('uses provided selectedRowIds when in controlled mode', () => {
    const selectedIds = new Set(['1', '2']);
    const { result } = renderHook(() =>
      useGridSelection({
        selectedRowIds: selectedIds,
        rowData: testRows,
        getRowId,
      }),
    );

    expect(result.current.currentSelectedIds.size).toBe(2);
    expect(result.current.currentSelectedIds.has('1')).toBe(true);
    expect(result.current.currentSelectedIds.has('2')).toBe(true);
    expect(result.current.currentSelectedRows.size).toBe(2);
    expect(result.current.headerCheckboxState).toBe('indeterminate');
  });

  test('uses provided selectedRows when in controlled mode', () => {
    const selectedRowsMap = new Map<string, TestRow>([
      ['1', testRows[0]],
      ['2', testRows[1]],
    ]);
    const { result } = renderHook(() =>
      useGridSelection({
        selectedRows: selectedRowsMap,
        rowData: testRows,
        getRowId,
      }),
    );

    expect(result.current.currentSelectedRows).toBe(selectedRowsMap);
    expect(result.current.currentSelectedIds.size).toBe(2);
    expect(result.current.headerCheckboxState).toBe('indeterminate');
  });

  test('handleSelectionToggle adds/removes rows correctly', () => {
    const { result } = renderHook(() =>
      useGridSelection({
        rowData: testRows,
        getRowId,
      }),
    );

    act(() => {
      result.current.handleSelectionToggle(testRows[0], true);
    });

    expect(result.current.currentSelectedIds.has('1')).toBe(true);
    expect(result.current.currentSelectedIds.size).toBe(1);
    expect(result.current.currentSelectedRows.get('1')).toEqual(testRows[0]);
    expect(result.current.headerCheckboxState).toBe('indeterminate');

    act(() => {
      result.current.handleSelectionToggle(testRows[0], false);
    });

    expect(result.current.currentSelectedIds.has('1')).toBe(false);
    expect(result.current.currentSelectedIds.size).toBe(0);
    expect(result.current.currentSelectedRows.size).toBe(0);
    expect(result.current.headerCheckboxState).toBe('unchecked');
  });

  test('handleHeaderCheckboxChange selects/deselects all rows', () => {
    const { result } = renderHook(() =>
      useGridSelection({
        rowData: testRows,
        getRowId,
      }),
    );

    act(() => {
      result.current.handleHeaderCheckboxChange(true);
    });

    expect(result.current.currentSelectedIds.size).toBe(3);
    expect(result.current.currentSelectedIds.has('1')).toBe(true);
    expect(result.current.currentSelectedIds.has('2')).toBe(true);
    expect(result.current.currentSelectedIds.has('3')).toBe(true);
    expect(result.current.currentSelectedRows.size).toBe(3);
    expect(result.current.currentSelectedRows.get('1')).toEqual(testRows[0]);
    expect(result.current.currentSelectedRows.get('2')).toEqual(testRows[1]);
    expect(result.current.currentSelectedRows.get('3')).toEqual(testRows[2]);
    expect(result.current.headerCheckboxState).toBe('checked');

    act(() => {
      result.current.handleHeaderCheckboxChange(false);
    });

    expect(result.current.currentSelectedIds.size).toBe(0);
    expect(result.current.currentSelectedRows.size).toBe(0);
    expect(result.current.headerCheckboxState).toBe('unchecked');
  });

  test('calls onSelectionChange in controlled mode', () => {
    const onSelectionChange = vi.fn();
    const selectedIds = new Set<string>();

    const { result } = renderHook(() =>
      useGridSelection({
        selectedRowIds: selectedIds,
        onSelectionChange,
        rowData: testRows,
        getRowId,
      }),
    );

    act(() => {
      result.current.handleSelectionToggle(testRows[0], true);
    });

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    const newIds = onSelectionChange.mock.calls[0][0] as Set<string>;
    const selectedRows = onSelectionChange.mock.calls[0][1] as TestRow[];

    expect(newIds.size).toBe(1);
    expect(newIds.has('1')).toBe(true);
    expect(selectedRows.length).toBe(1);
    expect(selectedRows[0]).toEqual(testRows[0]);
  });

  test('calls onSelectionChangeWithMap in controlled mode', () => {
    const onSelectionChangeWithMap = vi.fn();
    const selectedRowsMap = new Map<string, TestRow>();

    const { result } = renderHook(() =>
      useGridSelection({
        selectedRows: selectedRowsMap,
        onSelectionChangeWithMap,
        rowData: testRows,
        getRowId,
      }),
    );

    act(() => {
      result.current.handleSelectionToggle(testRows[0], true);
    });

    expect(onSelectionChangeWithMap).toHaveBeenCalledTimes(1);
    const newMap = onSelectionChangeWithMap.mock.calls[0][0] as Map<
      string,
      TestRow
    >;

    expect(newMap.size).toBe(1);
    expect(newMap.get('1')).toEqual(testRows[0]);
  });

  test('handles empty rowData gracefully', () => {
    const { result } = renderHook(() =>
      useGridSelection({
        rowData: [],
        getRowId,
      }),
    );

    expect(result.current.headerCheckboxState).toBe('unchecked');

    act(() => {
      result.current.handleSelectionToggle(testRows[0], true);
    });

    expect(result.current.currentSelectedIds.has('1')).toBe(true);
    expect(result.current.currentSelectedRows.get('1')).toEqual(testRows[0]);

    act(() => {
      result.current.handleHeaderCheckboxChange(true);
    });

    expect(result.current.currentSelectedIds.size).toBe(0);
    expect(result.current.currentSelectedRows.size).toBe(0);
  });

  test('handles errors in onSelectionChange gracefully', () => {
    const onSelectionChange = vi.fn().mockImplementation(() => {
      throw new Error('Test error');
    });

    const selectedIds = new Set<string>();

    const { result } = renderHook(() =>
      useGridSelection({
        selectedRowIds: selectedIds,
        onSelectionChange,
        rowData: testRows,
        getRowId,
      }),
    );

    expect(() => {
      act(() => {
        result.current.handleSelectionToggle(testRows[0], true);
      });
    }).toThrow('Test error');

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
  });

  test('updates internal state correctly in uncontrolled mode', () => {
    const { result, rerender } = renderHook(() =>
      useGridSelection({
        rowData: testRows,
        getRowId,
      }),
    );

    act(() => {
      result.current.handleSelectionToggle(testRows[0], true);
    });

    expect(result.current.currentSelectedIds.has('1')).toBe(true);
    expect(result.current.currentSelectedRows.get('1')).toEqual(testRows[0]);

    rerender();

    expect(result.current.currentSelectedIds.has('1')).toBe(true);
    expect(result.current.currentSelectedRows.get('1')).toEqual(testRows[0]);
  });

  test('synchronizes selectedRowIds to selectedRows map', () => {
    const selectedIds = new Set(['1', '2']);
    const { result } = renderHook(
      ({ selectedRowIds }) =>
        useGridSelection({
          selectedRowIds,
          rowData: testRows,
          getRowId,
        }),
      {
        initialProps: { selectedRowIds: selectedIds },
      },
    );

    expect(result.current.currentSelectedRows.size).toBe(2);
    expect(result.current.currentSelectedRows.get('1')).toEqual(testRows[0]);
    expect(result.current.currentSelectedRows.get('2')).toEqual(testRows[1]);
  });

  test('handles both onSelectionChange and onSelectionChangeWithMap callbacks', () => {
    const onSelectionChange = vi.fn();
    const onSelectionChangeWithMap = vi.fn();

    const { result } = renderHook(() =>
      useGridSelection({
        onSelectionChange,
        onSelectionChangeWithMap,
        rowData: testRows,
        getRowId,
      }),
    );

    act(() => {
      result.current.handleSelectionToggle(testRows[0], true);
    });

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChangeWithMap).toHaveBeenCalledTimes(1);

    const idsFromOnSelectionChange = onSelectionChange.mock
      .calls[0][0] as Set<string>;
    const rowsFromOnSelectionChange = onSelectionChange.mock
      .calls[0][1] as TestRow[];
    const mapFromOnSelectionChangeWithMap = onSelectionChangeWithMap.mock
      .calls[0][0] as Map<string, TestRow>;

    expect(idsFromOnSelectionChange.size).toBe(1);
    expect(rowsFromOnSelectionChange.length).toBe(1);
    expect(mapFromOnSelectionChangeWithMap.size).toBe(1);
  });
});
