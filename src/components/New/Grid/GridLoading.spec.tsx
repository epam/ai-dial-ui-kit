import { render, screen, waitFor, within } from '@testing-library/react';
import type { ColDef, GridApi, IOverlayParams } from 'ag-grid-community';
import { describe, expect, test, vi } from 'vitest';

import { GridSelectionMode } from '@/models/selection-mode';
import { GridLoadingAppearance } from '@/types/grid';
import { Grid, type GridProps } from './Grid';

interface Row {
  id: string;
  name: string;
}

const columns: ColDef<Row>[] = [{ field: 'name', width: 180 }];
const rows: Row[] = [{ id: 'a', name: 'Alice' }];
const wait = { timeout: 3000 };

describe('Grid skeleton loading', () => {
  test('preserves grid initialization when a consumer supplies onGridReady', async () => {
    const onGridReady = vi.fn();
    const onGridApiChange = vi.fn();
    const { container } = render(
      <Grid<Row>
        columnDefs={columns}
        rowData={rows}
        loading
        loadingAppearance={GridLoadingAppearance.Skeleton}
        loadingLabel="Loading people"
        selectionMode={GridSelectionMode.MULTIPLE}
        selectedRowIds={new Set(['a'])}
        onGridApiChange={onGridApiChange}
        additionalGridOptions={{ onGridReady }}
      />,
    );

    await waitFor(() => expect(onGridReady).toHaveBeenCalledTimes(1));
    expect(onGridApiChange).toHaveBeenCalledTimes(1);
    const api = onGridApiChange.mock.calls[0][0] as GridApi<Row>;
    expect(onGridReady.mock.calls[0][0].api).toBe(api);
    await waitFor(() => expect(api.getSelectedRows()).toEqual(rows));
    await screen.findByText('Loading people', {}, wait);
    await waitFor(() =>
      expect(container.querySelector('.ag-body-viewport')).toHaveAttribute(
        'inert',
      ),
    );
  });

  test('honours additionalGridOptions.loading in skeleton mode', async () => {
    const props: GridProps<Row> = {
      columnDefs: columns,
      rowData: rows,
      loadingAppearance: GridLoadingAppearance.Skeleton,
      loadingLabel: 'Loading people',
    };
    const { container, rerender } = render(
      <Grid<Row> {...props} additionalGridOptions={{ loading: true }} />,
    );

    expect(screen.getByRole('region', { name: 'Data grid' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    await screen.findByText('Loading people', {}, wait);
    expect(container.querySelector('.ag-body-viewport')).toHaveAttribute(
      'inert',
    );

    rerender(
      <Grid<Row> {...props} additionalGridOptions={{ loading: false }} />,
    );
    await waitFor(() => {
      expect(screen.queryByText('Loading people')).not.toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Data grid' })).toHaveAttribute(
        'aria-busy',
        'false',
      );
      expect(container.querySelector('.ag-body-viewport')).not.toHaveAttribute(
        'inert',
      );
    }, wait);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  test('honours additionalGridOptions.loading in spinner mode', async () => {
    const LoadingOverlay = () => <div>Consumer spinner</div>;
    const props: GridProps<Row> = { columnDefs: columns, rowData: rows };
    const { rerender } = render(
      <Grid<Row>
        {...props}
        additionalGridOptions={{
          loading: true,
          loadingOverlayComponent: LoadingOverlay,
        }}
      />,
    );

    expect(await screen.findByText('Consumer spinner')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Data grid' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    rerender(
      <Grid<Row>
        {...props}
        additionalGridOptions={{
          loading: false,
          loadingOverlayComponent: LoadingOverlay,
        }}
      />,
    );
    await waitFor(() => {
      expect(screen.queryByText('Consumer spinner')).not.toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Data grid' })).toHaveAttribute(
        'aria-busy',
        'false',
      );
    });
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  test('switches between spinner and skeleton while loading', async () => {
    const LoadingOverlay = () => <div>Consumer spinner</div>;
    const props: GridProps<Row> = {
      columnDefs: columns,
      rowData: rows,
      loading: true,
      loadingLabel: 'Loading people',
      renderLoadingCell: () => <span>Placeholder cell</span>,
      additionalGridOptions: { loadingOverlayComponent: LoadingOverlay },
    };
    const { rerender } = render(
      <Grid<Row>
        {...props}
        loadingAppearance={GridLoadingAppearance.Spinner}
      />,
    );

    expect(await screen.findByText('Consumer spinner')).toBeInTheDocument();
    rerender(
      <Grid<Row>
        {...props}
        loadingAppearance={GridLoadingAppearance.Skeleton}
      />,
    );
    await screen.findByText('Loading people', {}, wait);
    await waitFor(() => {
      const placeholder = screen.getAllByText('Placeholder cell')[0];
      expect(placeholder.closest('.invisible')).not.toBeInTheDocument();
      expect(placeholder.closest('[inert]')).toBeInTheDocument();
      expect(screen.queryByText('Consumer spinner')).not.toBeInTheDocument();
    }, wait);

    rerender(
      <Grid<Row>
        {...props}
        loadingAppearance={GridLoadingAppearance.Spinner}
      />,
    );
    expect(
      await screen.findByText('Consumer spinner', {}, wait),
    ).toBeInTheDocument();
    expect(screen.queryByText('Placeholder cell')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Data grid' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  test('shows the spinner when switching from a visible skeleton while loading', async () => {
    const LoadingOverlay = () => <div>Consumer spinner</div>;
    const props: GridProps<Row> = {
      columnDefs: columns,
      rowData: rows,
      loading: true,
      loadingLabel: 'Loading people',
      renderLoadingCell: () => <span>Placeholder cell</span>,
      additionalGridOptions: { loadingOverlayComponent: LoadingOverlay },
    };
    const { container, rerender } = render(
      <Grid<Row>
        {...props}
        loadingAppearance={GridLoadingAppearance.Skeleton}
      />,
    );

    await screen.findByText('Loading people', {}, wait);
    expect(
      screen.getAllByText('Placeholder cell')[0].closest('.invisible'),
    ).not.toBeInTheDocument();
    rerender(
      <Grid<Row>
        {...props}
        loadingAppearance={GridLoadingAppearance.Spinner}
      />,
    );
    expect(
      await screen.findByText('Consumer spinner', {}, wait),
    ).toBeInTheDocument();
    expect(screen.queryByText('Placeholder cell')).not.toBeInTheDocument();
    expect(container.querySelector('.ag-body-viewport')).not.toHaveAttribute(
      'inert',
    );
    expect(screen.getByRole('region', { name: 'Data grid' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  test.each([
    { overlayType: 'noRows', rowData: [], quickFilterText: undefined },
    {
      overlayType: 'noMatchingRows',
      rowData: rows,
      quickFilterText: 'missing',
    },
  ])(
    'preserves the consumer selector for $overlayType after skeleton loading',
    async ({ overlayType, rowData, quickFilterText }) => {
      const ConsumerOverlay = () => <div>Consumer empty overlay</div>;
      const selector = vi.fn(({ overlayType: type }: IOverlayParams<Row>) =>
        type === overlayType ? { component: ConsumerOverlay } : undefined,
      );
      const props: GridProps<Row> = {
        columnDefs: columns,
        rowData,
        loadingAppearance: GridLoadingAppearance.Skeleton,
        loadingLabel: 'Loading people',
        additionalGridOptions: {
          overlayComponentSelector: selector,
          quickFilterText,
        },
      };
      const { rerender } = render(<Grid<Row> {...props} loading />);

      await screen.findByText('Loading people', {}, wait);
      // jsdom loads no CSS: the hiding is the `visibility: hidden` rule that
      // `grid.scss` scopes to this class, so assert the hook it keys on.
      await waitFor(() => {
        expect(screen.getByText('Consumer empty overlay')).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Data grid' })).toHaveClass(
          'dial-kit-grid-skeleton-loading',
        );
      }, wait);
      rerender(<Grid<Row> {...props} />);
      await waitFor(
        () => expect(screen.getByText('Consumer empty overlay')).toBeVisible(),
        wait,
      );
      expect(selector).toHaveBeenCalledWith(
        expect.objectContaining({ overlayType }),
      );
    },
  );

  test('suppresses the empty state during the delay and announces a visible skeleton', async () => {
    const { container, rerender } = render(
      <Grid<Row>
        columnDefs={columns}
        rowData={[]}
        loading
        loadingAppearance={GridLoadingAppearance.Skeleton}
        loadingLabel="Loading people"
      />,
    );
    expect(screen.getByRole('region', { name: 'Data grid' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(screen.queryByText('No items yet')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading people')).not.toBeInTheDocument();

    await screen.findByText('Loading people', {}, wait);
    await waitFor(
      () =>
        expect(container.querySelector('.ag-body-viewport')).toHaveAttribute(
          'inert',
        ),
      wait,
    );
    await waitFor(
      () =>
        expect(
          container.querySelector('.dial-kit-grid-skeleton-overlay [inert]'),
        ).toBeInTheDocument(),
      wait,
    );
    expect(screen.queryByText('No items yet')).not.toBeInTheDocument();

    rerender(
      <Grid<Row>
        columnDefs={columns}
        rowData={[]}
        loadingAppearance={GridLoadingAppearance.Skeleton}
        loadingLabel="Loading people"
      />,
    );
    expect(screen.getByText('Loading people')).toBeInTheDocument();
    await waitFor(
      () =>
        expect(screen.queryByText('Loading people')).not.toBeInTheDocument(),
      wait,
    );
    expect(
      await screen.findByText('No items yet', {}, wait),
    ).toBeInTheDocument();
    expect(container.querySelector('.ag-body-viewport')).not.toHaveAttribute(
      'inert',
    );
  });

  test('keeps selected real rows and uses the configured row height and custom cells', async () => {
    let api: GridApi<Row> | undefined;
    const onSelectionChange = vi.fn();
    const renderLoadingCell = vi.fn(
      ({ columnId }: { columnId: string; rowIndex: number }) => (
        <span>Placeholder for {columnId}</span>
      ),
    );
    const props: GridProps<Row> = {
      columnDefs: columns,
      rowData: rows,
      selectionMode: GridSelectionMode.MULTIPLE,
      selectedRowIds: new Set(['a']),
      onSelectionChange,
      onGridApiChange: (value) => {
        api = value;
      },
      loadingAppearance: GridLoadingAppearance.Skeleton,
      loadingLabel: 'Loading people',
      renderLoadingCell,
      additionalGridOptions: { rowHeight: 68 },
    };
    const { rerender, container } = render(<Grid<Row> {...props} />);
    await waitFor(() => expect(api?.getSelectedRows()).toEqual(rows));
    rerender(<Grid<Row> {...props} loading />);
    await screen.findByText('Loading people', {}, wait);
    expect(api?.getSelectedRows()).toEqual(rows);
    expect(api?.getDisplayedRowCount()).toBe(1);
    const placeholder = screen.getAllByText('Placeholder for name')[0];
    expect(placeholder.closest('[inert]')).toBeInTheDocument();
    expect(placeholder.closest('.invisible')).not.toBeInTheDocument();
    expect(placeholder.closest('[style*="height: 68px"]')).toBeInTheDocument();
    expect(renderLoadingCell).not.toHaveBeenCalledWith(
      expect.objectContaining({ columnId: 'dial-kit-grid-selection' }),
    );
    expect(onSelectionChange).not.toHaveBeenCalled();
    rerender(<Grid<Row> {...props} />);
    await waitFor(
      () =>
        expect(screen.queryByText('Loading people')).not.toBeInTheDocument(),
      wait,
    );
    expect(api?.getSelectedRows()).toEqual(rows);
    expect(container.querySelector('.ag-body-viewport')).not.toHaveAttribute(
      'inert',
    );
  });

  test('keeps placeholder rows out of the grid accessibility tree and row count', async () => {
    const props: GridProps<Row> = {
      columnDefs: columns,
      rowData: rows,
      loadingAppearance: GridLoadingAppearance.Skeleton,
      loadingLabel: 'Loading people',
    };
    const { container, rerender } = render(<Grid<Row> {...props} />);
    await screen.findByText('Alice');
    const grid = screen.getByRole('grid');
    await waitFor(() => expect(grid).toHaveAttribute('aria-rowcount'));
    const rowCount = grid.getAttribute('aria-rowcount');
    const actualRows = within(grid).getAllByRole('row', {
      hidden: true,
    }).length;

    rerender(<Grid<Row> {...props} loading />);
    expect(screen.getByRole('region', { name: 'Data grid' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    await screen.findByText('Loading people', {}, wait);
    await waitFor(() => {
      const overlay = container.querySelector<HTMLElement>(
        '.dial-kit-grid-skeleton-overlay [aria-hidden="true"][inert]',
      );
      expect(overlay).toBeInTheDocument();
      expect(
        within(overlay!).queryAllByRole('row', { hidden: true }),
      ).toHaveLength(0);
      expect(
        within(overlay!).queryAllByRole('gridcell', { hidden: true }),
      ).toHaveLength(0);
    }, wait);
    expect(grid).toHaveAttribute('aria-rowcount', rowCount);
    expect(within(grid).getAllByRole('row', { hidden: true })).toHaveLength(
      actualRows,
    );
    expect(container.querySelector('.ag-body-viewport')).toHaveAttribute(
      'inert',
    );

    rerender(<Grid<Row> {...props} />);
    await waitFor(
      () =>
        expect(
          screen.getByRole('region', { name: 'Data grid' }),
        ).toHaveAttribute('aria-busy', 'false'),
      wait,
    );
    expect(grid).toHaveAttribute('aria-rowcount', rowCount);
    expect(container.querySelector('.ag-body-viewport')).not.toHaveAttribute(
      'inert',
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  test('does not announce or show a skeleton for a fast load', async () => {
    const { rerender } = render(
      <Grid<Row>
        columnDefs={columns}
        rowData={rows}
        loadingAppearance={GridLoadingAppearance.Skeleton}
      />,
    );
    await screen.findByText('Alice');
    rerender(
      <Grid<Row>
        columnDefs={columns}
        rowData={rows}
        loading
        loadingAppearance={GridLoadingAppearance.Skeleton}
        loadingLabel="Loading people"
      />,
    );
    rerender(
      <Grid<Row>
        columnDefs={columns}
        rowData={rows}
        loadingAppearance={GridLoadingAppearance.Skeleton}
        loadingLabel="Loading people"
      />,
    );
    expect(screen.queryByText('Loading people')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Data grid' })).toHaveAttribute(
      'aria-busy',
      'false',
    );
  });
});
