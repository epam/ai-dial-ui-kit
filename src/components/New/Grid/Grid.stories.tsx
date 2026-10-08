import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { IconDotsVertical, IconInbox } from '@tabler/icons-react';
import { useState, type FC } from 'react';

import { Avatar } from '@/components/New/Avatar/Avatar';
import { Badge } from '@/components/New/Badge/Badge';
import { Dropdown } from '@/components/New/Dropdown/Dropdown';
import { IconButton } from '@/components/New/IconButton/IconButton';
import { Input } from '@/components/New/Input/Input';
import { GridSelectionMode } from '@/models/selection-mode';
import { AvatarShape } from '@/types/avatar';
import { BadgeVariant } from '@/types/badge';
import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';
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

enum UsageState {
  Normal = 'normal',
  Warning = 'warning',
  Limit = 'limit',
}

interface UsagePeriod {
  used: string;
  limit?: string;
  /** Share of the limit already used, 0–100. A period without it follows the cost limit. */
  percent?: number;
  state?: UsageState;
  spent: string;
}

interface ModelUsage extends Record<string, unknown> {
  id: string;
  name: string;
  version: string;
  initials: string;
  day: UsagePeriod;
  week: UsagePeriod;
  month: UsagePeriod;
  status: UsageState;
}

const modelUsage: ModelUsage[] = [
  {
    id: '1',
    name: 'Claude Opus',
    version: '4.8',
    initials: 'CO',
    day: {
      used: '1.0M',
      limit: '1.0M',
      percent: 100,
      state: UsageState.Limit,
      spent: '$20.00',
    },
    week: { used: '1.0M', limit: '2.0M', percent: 50, spent: '$20.00' },
    month: { used: '2.9M', limit: '8.0M', percent: 36, spent: '$42.00' },
    status: UsageState.Limit,
  },
  {
    id: '2',
    name: 'ali.deepseek-v4-flash',
    version: '1.4.6',
    initials: 'AD',
    day: { used: '210k', spent: '$5.50' },
    week: { used: '320k', limit: '500k', percent: 64, spent: '$8.60' },
    month: { used: '4.2M', limit: '10.0M', percent: 42, spent: '$28.19' },
    status: UsageState.Normal,
  },
  {
    id: '3',
    name: 'GLM-5.2',
    version: '3.0.0',
    initials: 'G5',
    day: { used: '320k', limit: '500k', percent: 64, spent: '$8.60' },
    week: { used: '730k', spent: '$12.34' },
    month: { used: '1.9M', spent: '$19.20' },
    status: UsageState.Normal,
  },
  {
    id: '4',
    name: 'GPT-4o',
    version: '1.0.0',
    initials: 'G4',
    day: {
      used: '1.3M',
      limit: '1.5M',
      percent: 87,
      state: UsageState.Warning,
      spent: '$28.19',
    },
    week: {
      used: '2.1M',
      limit: '8.1M',
      percent: 26,
      state: UsageState.Warning,
      spent: '$28.19',
    },
    month: { used: '3.0M', limit: '20.0M', percent: 15, spent: '$62.60' },
    status: UsageState.Warning,
  },
  {
    id: '5',
    name: 'ali.deepseek-v4-pro',
    version: '2.4.0',
    initials: 'AD',
    day: { used: '0k', limit: '500k', percent: 0, spent: '$0.00' },
    week: { used: '102k', spent: '$9.21' },
    month: { used: '207k', spent: '$13.29' },
    status: UsageState.Normal,
  },
];

const USAGE_BAR_CLASS: Record<UsageState, string> = {
  [UsageState.Normal]: 'bg-control-accent-hover',
  [UsageState.Warning]: 'bg-[var(--text-warning-icon,#EEC840)]',
  [UsageState.Limit]: 'bg-control-error-active',
};

const STATUS_BADGE: Record<UsageState, { label: string; className: string }> = {
  [UsageState.Normal]: {
    label: 'Within limits',
    className: 'bg-info text-info',
  },
  [UsageState.Warning]: {
    label: 'Running low',
    className: 'bg-warning text-warning',
  },
  [UsageState.Limit]: {
    label: 'Limit reached',
    className: 'bg-error text-error',
  },
};

const ModelCell = ({ data }: ICellRendererParams<ModelUsage>) =>
  data && (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar
        name={data.name}
        initials={data.initials}
        shape={AvatarShape.Square}
        size={40}
        className="rounded-xl"
        textClassName="dial-h3-text"
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="dial-caption-lead-semi-text text-blue">Model</span>
        <span className="flex min-w-0 items-center gap-1 dial-small-text">
          <span className="dial-small-semi-text truncate text-primary">
            {data.name}
          </span>
          <span className="text-secondary">{data.version}</span>
        </span>
      </div>
    </div>
  );

const usageCell =
  (period: keyof Pick<ModelUsage, 'day' | 'week' | 'month'>) =>
  ({ data }: ICellRendererParams<ModelUsage>) => {
    const usage = data?.[period];

    if (!usage) return null;

    return (
      <div className="flex w-full flex-col gap-2 py-3">
        <p className="dial-small-text text-primary">
          {usage.used}
          {usage.limit && (
            <span className="text-secondary">{` / ${usage.limit}`}</span>
          )}
        </p>
        {usage.percent === undefined ? (
          <p className="dial-tiny-text text-secondary">Follows cost limit</p>
        ) : (
          <div
            role="progressbar"
            aria-label={`${data.name}, ${period} usage`}
            aria-valuenow={usage.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1 w-full overflow-hidden rounded-full bg-layer-sunken"
          >
            <div
              // The width is the usage share, not a design token, so it cannot
              // be a utility class.
              style={{ width: `${usage.percent}%` }}
              className={mergeClasses(
                'h-full rounded-full',
                USAGE_BAR_CLASS[usage.state ?? UsageState.Normal],
              )}
            />
          </div>
        )}
        <p className="dial-tiny-text text-secondary">{usage.spent} spent</p>
      </div>
    );
  };

const StatusCell = ({ data }: ICellRendererParams<ModelUsage>) => {
  if (!data) return null;
  const { label, className } = STATUS_BADGE[data.status];

  return (
    <Badge
      label={label}
      variant={BadgeVariant.Filled}
      className={className}
      textClassName="dial-caption-lead-semi-text"
    />
  );
};

const usageColumn = (
  period: 'day' | 'week' | 'month',
  headerName: string,
): ColDef<ModelUsage> => ({
  colId: period,
  headerName,
  flex: 1,
  cellRenderer: usageCell(period),
});

const usageColumnDefs: ColDef<ModelUsage>[] = [
  { colId: 'item', headerName: 'Item', flex: 1, cellRenderer: ModelCell },
  usageColumn('day', 'Last 24 hours'),
  usageColumn('week', 'Last 7 days'),
  usageColumn('month', 'Last 30 days'),
  {
    colId: 'status',
    headerName: 'Status',
    width: 128,
    cellRenderer: StatusCell,
  },
];

const usageColumns = usageColumnDefs.map((column) => ({
  ...column,
  filter: false,
  floatingFilter: false,
  sortable: false,
}));

const ComplexRowsStory = (args: GridProps<ModelUsage>) => (
  <div className="bg-layer-base p-4">
    <div className="flex flex-col gap-3 rounded-xl bg-layer-base p-4">
      <h2 className="dial-small-semi-text text-primary">Model tokens limits</h2>
      <div className="overflow-hidden rounded-xl bg-layer-raised shadow-md">
        <Grid<ModelUsage> {...args} />
      </div>
    </div>
  </div>
);

/**
 * Rows that carry more than a text value: an avatar with a two-line title, a
 * usage readout with a progress bar and a spend line, and a status badge. The
 * grid keeps doing the layout, sorting and hover tint; every cell is a plain
 * ag-Grid `cellRenderer`, and the row height comes from `additionalGridOptions`.
 */
export const ComplexRows: StoryObj<GridProps<ModelUsage>> = {
  args: {
    columnDefs: usageColumns,
    rowData: modelUsage,
    wrapperBorder: false,
    additionalGridOptions: { rowHeight: 84, domLayout: 'autoHeight' },
  },
  render: ComplexRowsStory,
};

interface LimitRow extends Record<string, unknown> {
  id: string;
  type: string;
  expirationHours: string;
  maxUsers: string;
}

const limitRows: LimitRow[] = [
  { id: '1', type: 'Applications', expirationHours: '120', maxUsers: '50' },
  { id: '2', type: 'Toolsets', expirationHours: '72', maxUsers: 'No limits' },
  { id: '3', type: 'Prompts', expirationHours: '72', maxUsers: 'No limits' },
  { id: '4', type: 'Files', expirationHours: '72', maxUsers: 'No limits' },
  {
    id: '5',
    type: 'Conversations',
    expirationHours: '72',
    maxUsers: 'No limits',
  },
];

/**
 * An input in a cell. It keeps what is being typed in its own state and hands
 * the value to the grid once the user leaves the field or presses Enter, so a
 * keystroke does not rebuild the cell under the caret.
 */
const EditableInputCell = ({
  value,
  data,
  node,
  colDef,
}: ICellRendererParams<LimitRow>) => {
  const [draft, setDraft] = useState(value == null ? '' : String(value));
  const commit = () => node.setDataValue(colDef?.field ?? '', draft);

  if (!data) return null;

  return (
    <Input
      size={ElementSize.Small}
      value={draft}
      aria-label={`${colDef?.headerName} for ${data.type}`}
      onChange={(next) => setDraft(next ?? '')}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') commit();
      }}
    />
  );
};

const RowActionsCell = ({ data }: ICellRendererParams<LimitRow>) => {
  if (!data) return null;

  return (
    <Dropdown
      items={[
        { key: 'reset', label: 'Reset to default' },
        { key: 'remove-limit', label: 'Remove limit', danger: true },
      ]}
    >
      <IconButton
        variant={ButtonVariant.Primary}
        appearance={ButtonAppearance.Ghost}
        size={ElementSize.Small}
        icon={<IconDotsVertical size={16} aria-hidden="true" />}
        aria-label={`Actions for ${data.type}`}
      />
    </Dropdown>
  );
};

// The design divides the cells of an editable table, not only its rows. The
// grid draws column dividers in the header alone, so the body cells carry
// theirs, on the same thin stroke the header and row dividers use. ag-Grid sets
// a transparent 1px border on every cell, hence the important modifiers.
const CELL_DIVIDER_CLASS = '!border-r-[0.5px] !border-r-tertiary';

const limitColumns: ColDef<LimitRow>[] = [
  {
    field: 'type',
    headerName: 'Type',
    width: 240,
    cellClass: CELL_DIVIDER_CLASS,
  },
  {
    field: 'expirationHours',
    headerName: 'Expiration time (hours)',
    flex: 1,
    cellRenderer: EditableInputCell,
    cellClass: CELL_DIVIDER_CLASS,
  },
  {
    field: 'maxUsers',
    headerName: 'Max users',
    flex: 1,
    cellRenderer: EditableInputCell,
    cellClass: CELL_DIVIDER_CLASS,
  },
  {
    colId: 'actions',
    headerName: '',
    width: 48,
    minWidth: 48,
    cellRenderer: RowActionsCell,
  },
].map((column) => ({
  ...column,
  filter: false,
  floatingFilter: false,
  sortable: false,
}));

const EditableCellsStory = (args: GridProps<LimitRow>) => {
  // The grid writes committed values into the row objects, so the story
  // owns copies and a remount starts from the original data.
  const [rows] = useState(() => limitRows.map((row) => ({ ...row })));

  return (
    <div className="bg-layer-base p-4">
      <Grid<LimitRow> {...args} rowData={rows} />
    </div>
  );
};

/**
 * Editing without a dedicated editor: each cell renders a 2.0 `Input` through
 * `cellRenderer` and commits the value with `node.setDataValue` when the field
 * loses focus or Enter is pressed, which fires ag-Grid's `onCellValueChanged`.
 * The recommended density for an editable table is compact (40px rows).
 */
export const EditableCells: StoryObj<GridProps<LimitRow>> = {
  args: {
    columnDefs: limitColumns,
    getRowId: (row) => row.id,
    additionalGridOptions: {
      domLayout: 'autoHeight',
      onCellValueChanged: (event) => {
        console.info('Cell value changed', event.colDef.field, event.newValue);
      },
    },
  },
  render: EditableCellsStory,
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
