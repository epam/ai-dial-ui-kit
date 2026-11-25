import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ColDef, GridApi } from 'ag-grid-community';
import { describe, expect, test, vi } from 'vitest';

import { GridLoadingAppearance } from '@/types/grid';
import { Grid, type GridProps } from './Grid';

interface Row {
  id: string;
  name: string;
}

const columns: ColDef<Row>[] = [{ field: 'name', headerName: 'Name' }];
const rows: Row[] = [{ id: 'a', name: 'Alice' }];
const wait = { timeout: 3000 };
const bodySelectors = [
  '.ag-floating-top',
  '.ag-body-viewport',
  '.ag-sticky-top',
  '.ag-sticky-bottom',
  '.ag-floating-bottom',
];

describe('Grid skeleton body overlay', () => {
  test('leaves the header outside the non-exclusive overlay and usable while loading', async () => {
    const user = userEvent.setup();
    const onHeaderClick = vi.fn();
    const Header = () => <button onClick={onHeaderClick}>Header action</button>;
    const headerColumns: ColDef<Row>[] = [
      { field: 'name', headerComponent: Header },
    ];
    let api: GridApi<Row> | undefined;
    const { container } = render(
      <Grid<Row>
        columnDefs={headerColumns}
        rowData={rows}
        loading
        loadingAppearance={GridLoadingAppearance.Skeleton}
        loadingLabel="Loading people"
        onGridApiChange={(value) => {
          api = value;
        }}
      />,
    );

    await screen.findByText('Loading people', {}, wait);
    const root = container.querySelector('.ag-root');
    const overlay = container.querySelector('.dial-kit-grid-skeleton-overlay');
    const header = screen.getByRole('button', { name: 'Header action' });
    expect(root).toBeInTheDocument();
    expect(overlay).toBeInTheDocument();
    expect(overlay?.parentElement).toBe(root);
    expect(root).toContainElement(header);
    expect(overlay).not.toContainElement(header);
    expect(header.closest('[inert]')).not.toBeInTheDocument();
    expect(api?.getGridOption('loading')).toBe(false);
    expect(screen.getByRole('region', { name: 'Data grid' })).toHaveAttribute(
      'aria-busy',
      'true',
    );

    await user.click(header);
    expect(header).toHaveFocus();
    expect(onHeaderClick).toHaveBeenCalledTimes(1);
  });

  test('makes pinned, sticky and body row containers inert and restores their prior state', async () => {
    const props: GridProps<Row> = {
      columnDefs: columns,
      rowData: rows,
      loadingAppearance: GridLoadingAppearance.Skeleton,
      loadingLabel: 'Loading people',
      additionalGridOptions: {
        pinnedTopRowData: [{ id: 'top', name: 'Pinned top' }],
        pinnedBottomRowData: [{ id: 'bottom', name: 'Pinned bottom' }],
      },
    };
    const { container, rerender } = render(<Grid<Row> {...props} />);

    expect(await screen.findByText('Alice')).toBeInTheDocument();
    const bodyContainers = bodySelectors.map((selector) => {
      const element = container.querySelector<HTMLElement>(selector);
      expect(element, selector).toBeInTheDocument();
      expect(element, selector).not.toHaveAttribute('inert');
      return element!;
    });
    expect(
      within(bodyContainers[0]).getByText('Pinned top'),
    ).toBeInTheDocument();
    expect(
      within(bodyContainers[4]).getByText('Pinned bottom'),
    ).toBeInTheDocument();

    // Existing inert state belongs to the host and must survive the overlay.
    bodyContainers[2].setAttribute('inert', '');
    rerender(<Grid<Row> {...props} loading />);
    await screen.findByText('Loading people', {}, wait);
    await waitFor(() => {
      bodyContainers.forEach((element) =>
        expect(element).toHaveAttribute('inert'),
      );
    }, wait);

    rerender(<Grid<Row> {...props} />);
    await waitFor(() => {
      expect(screen.queryByText('Loading people')).not.toBeInTheDocument();
      expect(
        container.querySelector('.dial-kit-grid-skeleton-overlay'),
      ).not.toBeInTheDocument();
    }, wait);
    bodyContainers.forEach((element, index) => {
      if (index === 2) expect(element).toHaveAttribute('inert');
      else expect(element).not.toHaveAttribute('inert');
    });
    expect(screen.getByRole('region', { name: 'Data grid' })).toHaveAttribute(
      'aria-busy',
      'false',
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  test('reserves empty autoHeight space without inserting rows and restores the empty state', async () => {
    let api: GridApi<Row> | undefined;
    const props: GridProps<Row> = {
      columnDefs: columns,
      rowData: [],
      loadingAppearance: GridLoadingAppearance.Skeleton,
      loadingLabel: 'Loading people',
      additionalGridOptions: { domLayout: 'autoHeight', rowHeight: 68 },
      onGridApiChange: (value) => {
        api = value;
      },
    };
    const { container, rerender } = render(<Grid<Row> {...props} />);
    expect(
      await screen.findByText('No items yet', {}, wait),
    ).toBeInTheDocument();
    const grid = screen.getByRole('grid');
    const rowCount = grid.getAttribute('aria-rowcount');
    expect(api?.getDisplayedRowCount()).toBe(0);

    rerender(<Grid<Row> {...props} loading />);
    await screen.findByText('Loading people', {}, wait);
    const reservation = container.querySelector<HTMLElement>(
      '.dial-kit-grid-skeleton-empty-auto-height',
    );
    expect(reservation).toBeInTheDocument();
    expect(
      reservation?.style.getPropertyValue(
        '--dial-kit-grid-skeleton-min-height',
      ),
    ).toBe('204px');
    expect(api?.getGridOption('loading')).toBe(false);
    expect(api?.getDisplayedRowCount()).toBe(0);
    const dataRows: Row[] = [];
    api?.forEachNode((node) => {
      if (node.data) dataRows.push(node.data);
    });
    expect(dataRows).toEqual([]);
    expect(grid).toHaveAttribute('aria-rowcount', rowCount);
    expect(screen.queryByText('No items yet')).not.toBeInTheDocument();

    rerender(<Grid<Row> {...props} />);
    expect(
      await screen.findByText('No items yet', {}, wait),
    ).toBeInTheDocument();
    expect(
      container.querySelector('.dial-kit-grid-skeleton-empty-auto-height'),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('.dial-kit-grid-skeleton-overlay'),
    ).not.toBeInTheDocument();
    expect(api?.getDisplayedRowCount()).toBe(0);
    expect(grid).toHaveAttribute('aria-rowcount', rowCount);
    expect(screen.getByRole('region', { name: 'Data grid' })).toHaveAttribute(
      'aria-busy',
      'false',
    );
  });
});
