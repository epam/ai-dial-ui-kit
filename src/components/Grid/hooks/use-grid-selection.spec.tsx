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

    expect(result.current.currentSelectedIds).toBe(selectedIds);
    expect(result.current.currentSelectedIds.size).toBe(2);
    expect(result.current.headerCheckboxState).toBe('indeterminate');
  });

  test('handleSelectionToggle adds/removes ids correctly', () => {
    const { result } = renderHook(() =>
      useGridSelection({
        rowData: testRows,
        getRowId,
      }),
    );

    act(() => {
      result.current.handleSelectionToggle('1', true);
    });

    expect(result.current.currentSelectedIds.has('1')).toBe(true);
    expect(result.current.currentSelectedIds.size).toBe(1);
    expect(result.current.headerCheckboxState).toBe('indeterminate');

    act(() => {
      result.current.handleSelectionToggle('1', false);
    });

    expect(result.current.currentSelectedIds.has('1')).toBe(false);
    expect(result.current.currentSelectedIds.size).toBe(0);
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
      result.current.handleHeaderCheckboxChange();
    });

    expect(result.current.currentSelectedIds.size).toBe(3);
    expect(result.current.currentSelectedIds.has('1')).toBe(true);
    expect(result.current.currentSelectedIds.has('2')).toBe(true);
    expect(result.current.currentSelectedIds.has('3')).toBe(true);
    expect(result.current.headerCheckboxState).toBe('checked');

    act(() => {
      result.current.handleHeaderCheckboxChange();
    });

    expect(result.current.currentSelectedIds.size).toBe(0);
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
      result.current.handleSelectionToggle('1', true);
    });

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    const newIds = onSelectionChange.mock.calls[0][0] as Set<string>;
    const selectedRows = onSelectionChange.mock.calls[0][1] as TestRow[];

    expect(newIds.size).toBe(1);
    expect(newIds.has('1')).toBe(true);
    expect(selectedRows.length).toBe(1);
    expect(selectedRows[0]).toEqual(testRows[0]);
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
      result.current.handleSelectionToggle('1', true);
    });

    expect(result.current.currentSelectedIds.has('1')).toBe(true);

    act(() => {
      result.current.handleHeaderCheckboxChange();
    });

    expect(result.current.currentSelectedIds.size).toBe(0);
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
        result.current.handleSelectionToggle('1', true);
      });
    }).not.toThrow();

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
      result.current.handleSelectionToggle('1', true);
    });

    expect(result.current.currentSelectedIds.has('1')).toBe(true);

    rerender();

    expect(result.current.currentSelectedIds.has('1')).toBe(true);
  });
});
