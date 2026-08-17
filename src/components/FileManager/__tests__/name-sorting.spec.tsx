import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { type GridApi } from 'ag-grid-community';
import { DialGrid } from '@/components/Grid/Grid';
import { NAME_COLUMN } from '@/constants/file-grid-columns';
import { DialFileNodeType } from '@/models/file';

interface Row {
  id: string;
  name: string;
  path: string;
  nodeType: DialFileNodeType;
}

const makeRow = (name: string, nodeType: DialFileNodeType): Row => ({
  id: name,
  name,
  path: `/${name}`,
  nodeType,
});

// Names taken from the reported issue screenshot.
const reportedNames = [
  'New folder 1',
  'New folder 2',
  'New folder 10',
  'Uno-Rules-PDF-Official-Rules-unorules.org_ (1).pdf',
  'appdata',
  'code a[[ 11.08',
  'code app 07.08',
  'code app 1',
  'Zebra',
  'banana',
];

const rows: Row[] = reportedNames.map((name) =>
  makeRow(
    name,
    name.endsWith('.pdf') ? DialFileNodeType.ITEM : DialFileNodeType.FOLDER,
  ),
);

const getSortedNames = (api: GridApi<Row>): string[] => {
  const names: string[] = [];
  api.forEachNodeAfterFilterAndSort((node) => {
    if (node.data) {
      names.push(node.data.name);
    }
  });
  return names;
};

describe('Dial UI Kit :: FileManager name sorting', () => {
  const renderGrid = async () => {
    let api: GridApi<Row> | undefined;

    render(
      <DialGrid<Row>
        columnDefs={[NAME_COLUMN('Name')(undefined, undefined, false)]}
        rowData={rows}
        // FileManager always passes a partial defaultColDef through to DialGrid.
        additionalGridOptions={{
          defaultColDef: { floatingFilter: undefined },
          context: {},
        }}
        onGridApiChange={(gridApi) => {
          api = gridApi;
        }}
      />,
    );

    await screen.findByText('appdata');

    return api!;
  };

  test('sorts names alphabetically without regard to letter case', async () => {
    const api = await renderGrid();

    api.applyColumnState({ state: [{ colId: 'name', sort: 'asc' }] });

    const sorted = getSortedNames(api);

    expect(sorted).toEqual([
      'appdata',
      'banana',
      'code a[[ 11.08',
      'code app 1',
      'code app 07.08',
      'New folder 1',
      'New folder 2',
      'New folder 10',
      'Uno-Rules-PDF-Official-Rules-unorules.org_ (1).pdf',
      'Zebra',
    ]);
  });

  test('does not place all uppercase names before lowercase ones', async () => {
    const api = await renderGrid();

    api.applyColumnState({ state: [{ colId: 'name', sort: 'asc' }] });

    const sorted = getSortedNames(api);

    expect(sorted.indexOf('appdata')).toBeLessThan(sorted.indexOf('Zebra'));
    expect(sorted.indexOf('banana')).toBeLessThan(
      sorted.indexOf('New folder 1'),
    );
  });

  test('reverses the same case-insensitive order on descending sort', async () => {
    const api = await renderGrid();

    api.applyColumnState({ state: [{ colId: 'name', sort: 'desc' }] });

    const sorted = getSortedNames(api);

    expect(sorted[0]).toBe('Zebra');
    expect(sorted[sorted.length - 1]).toBe('appdata');
  });
});
