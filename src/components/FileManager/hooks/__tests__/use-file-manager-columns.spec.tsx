import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { ColDef, SuppressKeyboardEventParams } from 'ag-grid-community';

import { useFileManagerColumns } from '@/components/FileManager/hooks/use-file-manager-columns';
import type { UseFileManagerColumnsArgs } from '@/components/FileManager/hooks/use-file-manager-columns';
import type { FileManagerGridRow } from '@/components/FileManager/FileManagerContext';
import { FileManagerColumnKey } from '@/types/file-manager';

const makeArgs = (
  overrides: Partial<UseFileManagerColumnsArgs> = {},
): UseFileManagerColumnsArgs => {
  const actionsColumnDef: ColDef<FileManagerGridRow> = {
    colId: FileManagerColumnKey.Actions,
    headerName: 'Actions',
  };

  return {
    userColumnDefs: undefined,
    filterable: true,
    dateLocale: 'en-US' as Intl.LocalesArgument,
    dateOptions: { year: 'numeric' } as Intl.DateTimeFormatOptions,
    effectiveVisibleColumns: [
      FileManagerColumnKey.Name,
      FileManagerColumnKey.UpdatedAt,
      FileManagerColumnKey.Size,
      FileManagerColumnKey.Author,
      FileManagerColumnKey.Actions,
    ],
    isCompactView: false,
    hasActions: false,
    actionsColumnDef,
    ...overrides,
  };
};

describe('Dial UI Kit :: FileManager :: useFileManagerColumns', () => {
  it('returns default columns when userColumnDefs is undefined', () => {
    const { result } = renderHook(() => useFileManagerColumns(makeArgs()));

    const colIds = result.current.columnDefs.map((c) => c.colId);

    expect(colIds).toContain(FileManagerColumnKey.Name);
    expect(colIds).toContain(FileManagerColumnKey.UpdatedAt);
    expect(colIds).toContain(FileManagerColumnKey.Size);
    expect(colIds).toContain(FileManagerColumnKey.Author);
  });

  it('filters visible columns only when userColumnDefs is undefined', () => {
    const { result } = renderHook(() =>
      useFileManagerColumns(
        makeArgs({
          effectiveVisibleColumns: [FileManagerColumnKey.Name],
        }),
      ),
    );

    expect(result.current.columnDefs.map((c) => c.colId)).toEqual([
      FileManagerColumnKey.Name,
    ]);
  });

  it('does NOT filter userColumnDefs by effectiveVisibleColumns', () => {
    const userColumnDefs: ColDef<FileManagerGridRow>[] = [
      { colId: FileManagerColumnKey.Name, field: 'name' },
      { colId: FileManagerColumnKey.Owner, field: 'owner' },
    ];

    const { result } = renderHook(() =>
      useFileManagerColumns(
        makeArgs({
          userColumnDefs,
          effectiveVisibleColumns: [FileManagerColumnKey.Name],
        }),
      ),
    );

    expect(result.current.columnDefs.map((c) => c.colId)).toEqual([
      FileManagerColumnKey.Name,
      FileManagerColumnKey.Owner,
    ]);
  });

  it('appends actions column when hasActions=true (non-compact)', () => {
    const { result } = renderHook(() =>
      useFileManagerColumns(
        makeArgs({
          hasActions: true,
          isCompactView: false,
          effectiveVisibleColumns: [FileManagerColumnKey.Name],
        }),
      ),
    );

    expect(result.current.columnDefs.map((c) => c.colId)).toEqual([
      FileManagerColumnKey.Name,
      FileManagerColumnKey.Actions,
    ]);
  });

  it('in compact view, keeps only first column and appends actions', () => {
    const { result } = renderHook(() =>
      useFileManagerColumns(
        makeArgs({
          hasActions: true,
          isCompactView: true,
          effectiveVisibleColumns: [
            FileManagerColumnKey.Name,
            FileManagerColumnKey.UpdatedAt,
            FileManagerColumnKey.Size,
          ],
        }),
      ),
    );

    expect(result.current.columnDefs.map((c) => c.colId)).toEqual([
      FileManagerColumnKey.Name,
      FileManagerColumnKey.Actions,
    ]);
  });

  it('when filterable=false, forces filter and floatingFilter to false', () => {
    const userColumnDefs: ColDef<FileManagerGridRow>[] = [
      {
        colId: FileManagerColumnKey.Name,
        field: 'name',
        filter: 'agTextColumnFilter',
        floatingFilter: true,
      },
    ];

    const { result } = renderHook(() =>
      useFileManagerColumns(
        makeArgs({
          userColumnDefs,
          filterable: false,
        }),
      ),
    );

    expect(result.current.columnDefs[0].filter).toBe(false);
    expect(result.current.columnDefs[0].floatingFilter).toBe(false);
  });

  it('injects suppressKeyboardEvent only for Name column when missing', () => {
    const userColumnDefs: ColDef<FileManagerGridRow>[] = [
      { colId: FileManagerColumnKey.Name, field: 'name' },
      { colId: FileManagerColumnKey.Owner, field: 'owner' },
    ];

    const { result } = renderHook(() =>
      useFileManagerColumns(makeArgs({ userColumnDefs })),
    );

    const nameCol = result.current.columnDefs.find(
      (c) => c.colId === FileManagerColumnKey.Name,
    )!;
    const ownerCol = result.current.columnDefs.find(
      (c) => c.colId === FileManagerColumnKey.Owner,
    )!;

    expect(typeof nameCol.suppressKeyboardEvent).toBe('function');
    expect(ownerCol.suppressKeyboardEvent).toBeUndefined();
  });

  it('does NOT override existing suppressKeyboardEvent', () => {
    const existing = vi.fn().mockReturnValue(false);

    const userColumnDefs: ColDef<FileManagerGridRow>[] = [
      {
        colId: FileManagerColumnKey.Name,
        field: 'name',
        suppressKeyboardEvent: existing,
      },
    ];

    const { result } = renderHook(() =>
      useFileManagerColumns(makeArgs({ userColumnDefs })),
    );

    expect(result.current.columnDefs[0].suppressKeyboardEvent).toBe(existing);
  });

  it('injected suppressKeyboardEvent returns true for caret keys only when target is inside input', () => {
    const { result } = renderHook(() => useFileManagerColumns(makeArgs()));

    const nameCol = result.current.columnDefs.find(
      (c) => c.colId === FileManagerColumnKey.Name,
    )!;
    const suppress = nameCol.suppressKeyboardEvent!;
    expect(typeof suppress).toBe('function');

    const input = document.createElement('input');
    document.body.appendChild(input);

    const call = (key: string) =>
      suppress({
        event: { key, target: input } as unknown as KeyboardEvent,
      } as SuppressKeyboardEventParams<FileManagerGridRow>);

    expect(call('ArrowLeft')).toBe(true);
    expect(call('ArrowRight')).toBe(true);
    expect(call('Home')).toBe(true);
    expect(call('End')).toBe(true);

    expect(call('Enter')).toBe(false);
    expect(call('a')).toBe(false);
  });

  it('injected suppressKeyboardEvent returns false when target is not inside input', () => {
    const { result } = renderHook(() => useFileManagerColumns(makeArgs()));

    const nameCol = result.current.columnDefs.find(
      (c) => c.colId === FileManagerColumnKey.Name,
    )!;
    const suppress = nameCol.suppressKeyboardEvent!;

    const div = document.createElement('div');
    document.body.appendChild(div);

    const ok = suppress({
      event: { key: 'ArrowLeft', target: div } as unknown as KeyboardEvent,
    } as SuppressKeyboardEventParams<FileManagerGridRow>);

    expect(ok).toBe(false);
  });
});
