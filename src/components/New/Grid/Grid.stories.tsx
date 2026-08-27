import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColDef } from 'ag-grid-community';
import { IconInbox } from '@tabler/icons-react';
import { useState, type FC } from 'react';

import { GridSelectionMode } from '@/models/selection-mode';
import { Grid, type GridProps } from './Grid';
import { DateCellRenderer } from './renderers/DateCellRenderer';

interface Product extends Record<string, unknown> {
  id: string;
  name: string;
  owner: string;
  price: number;
  updatedAt: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Analytics workspace',
    owner: 'Ada Lovelace',
    price: 1200,
    updatedAt: '2026-07-20T09:30:00Z',
  },
  {
    id: '2',
    name: 'Billing add-on',
    owner: 'Grace Hopper',
    price: 340,
    updatedAt: '2026-07-18T14:05:00Z',
  },
  {
    id: '3',
    name: 'Content pipeline',
    owner: 'Alan Turing',
    price: 780,
    updatedAt: '2026-06-30T08:00:00Z',
  },
  {
    id: '4',
    name: 'Data catalogue',
    owner: 'Katherine Johnson',
    price: 2100,
    updatedAt: '2026-05-11T17:45:00Z',
  },
];

const columns: ColDef<Product>[] = [
  { field: 'name', headerName: 'Name', flex: 2 },
  { field: 'owner', headerName: 'Owner', flex: 1 },
  { field: 'price', headerName: 'Price', width: 120 },
  {
    field: 'updatedAt',
    headerName: 'Updated',
    width: 200,
    cellRenderer: DateCellRenderer,
    cellRendererParams: { options: { dateStyle: 'medium', timeZone: 'UTC' } },
  },
];

const Layout = (args: GridProps<Product>) => (
  <div className="h-[420px] bg-layer-base p-4">
    <Grid<Product> {...args} />
  </div>
);

const meta = {
  title: 'Components_2_0/Grid',
  component: Grid as FC<GridProps<Product>>,
  tags: ['grid', 'table', 'data'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A data grid built on ag-Grid, wired to the 2.0 tokens and controls. The selection column renders the 2.0 Checkbox and Radio instead of ag-Grid inputs, and stays faded out until the row is hovered, something is selected, or the keyboard reaches it.',
      },
    },
  },
  argTypes: {
    columnDefs: { control: false, description: 'ag-Grid column definitions' },
    rowData: { control: false, description: 'Rows to display' },
    selectionMode: {
      control: { type: 'select' },
      options: [undefined, ...Object.values(GridSelectionMode)],
      description: 'Renders a selection column of checkboxes or radios',
    },
    loading: { control: { type: 'boolean' } },
    alternateOddRowColors: { control: { type: 'boolean' } },
    wrapperBorder: { control: { type: 'boolean' } },
    withoutHeaderBorders: { control: { type: 'boolean' } },
    getContextMenuItems: { control: false },
    onSelectionChange: { control: false },
    onGridApiChange: { control: false },
    getRowId: { control: false },
    selectRowLabel: { control: false },
  },
  args: {
    columnDefs: columns,
    rowData: products,
  },
  render: Layout,
} satisfies Meta<GridProps<Product>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MultipleSelection: Story = {
  args: {
    selectionMode: GridSelectionMode.MULTIPLE,
    selectRowLabel: (row) => `Select ${row.name}`,
  },
};

export const SingleSelection: Story = {
  args: {
    selectionMode: GridSelectionMode.SINGLE,
    selectRowLabel: (row) => `Select ${row.name}`,
  },
};

export const DisabledRows: Story = {
  args: {
    selectionMode: GridSelectionMode.MULTIPLE,
    selectRowLabel: (row) => `Select ${row.name}`,
    disabledRowIds: new Set(['2', '4']),
  },
};

export const WithContextMenu: Story = {
  args: {
    getContextMenuItems: (row) => [
      { key: 'edit', label: `Edit ${row.name}` },
      { key: 'duplicate', label: 'Duplicate' },
      { key: 'delete', label: 'Delete', danger: true },
    ],
  },
};

export const AlternatingRows: Story = {
  args: {
    alternateOddRowColors: true,
  },
};

export const WithoutHeaderBorders: Story = {
  args: {
    withoutHeaderBorders: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    rowData: [],
    emptyStateTitle: 'No products yet',
    emptyStateDescription: 'Create one to see it listed here.',
    emptyStateIcon: <IconInbox size={100} stroke={0.5} aria-hidden="true" />,
  },
};

const ControlledStory = (args: GridProps<Product>) => {
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(
    new Set(['1']),
  );

  return (
    <div className="flex h-[420px] flex-col gap-2 bg-layer-base p-4">
      <p className="dial-small-text text-secondary">
        Selected:{' '}
        {selectedRowIds.size ? [...selectedRowIds].join(', ') : 'none'}
      </p>
      <div className="min-h-0 flex-1">
        <Grid<Product>
          {...args}
          selectedRowIds={selectedRowIds}
          onSelectionChange={(ids) => setSelectedRowIds(ids)}
        />
      </div>
    </div>
  );
};

export const ControlledSelection: Story = {
  args: {
    selectionMode: GridSelectionMode.MULTIPLE,
    selectRowLabel: (row) => `Select ${row.name}`,
  },
  render: ControlledStory,
};
