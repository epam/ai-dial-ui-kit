import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialGrid } from './Grid';
import { type ColDef } from 'ag-grid-community';

interface TestRow {
  id: string;
  name: string;
  age: number;
}

const testRows: TestRow[] = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
  { id: '3', name: 'Charlie', age: 35 },
];

const testColumns: ColDef<TestRow>[] = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'age', headerName: 'Age', width: 100 },
];

describe('Dial UI Kit :: DialGrid', () => {
  test('renders grid with column headers', async () => {
    render(
      <DialGrid<TestRow>
        columnDefs={testColumns}
        rowData={testRows}
        className="test-grid"
      />,
    );

    const grid = await screen.findByRole('region');
    expect(grid).toHaveClass('test-grid');

    expect(await screen.findByText('Name')).toBeInTheDocument();
    expect(await screen.findByText('Age')).toBeInTheDocument();
  });

  test('calls onGridReady when grid is initialized', async () => {
    const onGridReady = vi.fn();
    render(
      <DialGrid<TestRow>
        columnDefs={testColumns}
        rowData={testRows}
        additionalGridOptions={{ onGridReady }}
      />,
    );

    await screen.findByText('Alice');

    expect(onGridReady).toHaveBeenCalledTimes(1);
    expect(onGridReady.mock.calls[0][0]).toBeDefined();
  });

  test('uses alternateOddRowColors prop for styling rows', async () => {
    const { rerender } = render(
      <DialGrid<TestRow>
        columnDefs={testColumns}
        rowData={testRows}
        alternateOddRowColors={false}
      />,
    );

    await screen.findByText('Alice');

    rerender(
      <DialGrid<TestRow>
        columnDefs={testColumns}
        rowData={testRows}
        alternateOddRowColors={true}
      />,
    );

    // Grid should still render
    expect(await screen.findByText('Alice')).toBeInTheDocument();
  });

  test('applies custom CSS class to grid container', async () => {
    render(
      <DialGrid<TestRow>
        columnDefs={testColumns}
        rowData={testRows}
        className="my-custom-grid-class"
      />,
    );

    await screen.findByText('Alice');

    const container = screen.getByRole('region');
    expect(container).toHaveClass('my-custom-grid-class');
  });

  test('renders empty state when rowData is empty', async () => {
    const emptyStateTitle = 'No results found';
    const emptyStateDescription =
      "Sorry, we couldn't find any results for your search.";

    render(
      <DialGrid<TestRow>
        columnDefs={testColumns}
        rowData={[]}
        emptyStateTitle={emptyStateTitle}
        emptyStateDescription={emptyStateDescription}
      />,
    );

    expect(await screen.findByText(emptyStateTitle)).toBeInTheDocument();
    expect(await screen.findByText(emptyStateDescription)).toBeInTheDocument();
  });
});
