import type { Meta, StoryObj } from '@storybook/react-vite';
import { type FC, useState, type PropsWithChildren } from 'react';
import { DialGrid, type DialGridProps } from './Grid';
import type { DropdownItem } from '@/models/dropdown';
import type { ColDef } from 'ag-grid-community';
import { DialFileName } from '@/components/FileName/FileName';
import { DialButton } from '@/components/Button/Button';
import { ButtonVariant } from '@/types/button';
import { DropdownItemType } from '@/types/dropdown';
import {
  IconClipboardCopy,
  IconCopy,
  IconCut,
  IconDownload,
  IconPencil,
  IconTrashX,
} from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { DialDateCellRenderer } from './renderers/DateCellRenderer';

interface Row {
  id: string;
  name: string;
  updateTime: string;
  size: string;
  author: string;
}

const rows: Row[] = [
  {
    id: '1',
    name: 'Very long file name to show ellipsis behavior on narrow cells.png',
    updateTime: '2024-05-23',
    size: '128 KB',
    author: 'alex',
  },
  {
    id: '2',
    name: 'Folder A',
    updateTime: '2024-05-20',
    size: '-',
    author: 'system',
  },
  {
    id: '3',
    name: 'Readme.md',
    updateTime: '2024-05-18',
    size: '4 KB',
    author: 'mary',
  },
  {
    id: '4',
    name: 'Folder B',
    updateTime: '',
    size: '-',
    author: 'system',
  },
];

const columns: ColDef<Row>[] = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    cellRenderer: (param: { data: Row }) => (
      <DialFileName name={param.data.name} cssClass="h-full" />
    ),
  },
  {
    field: 'updateTime',
    headerName: 'Modified',
    width: 180,
    cellRenderer: DialDateCellRenderer,
    cellRendererParams: {
      locale: 'en-US',
      timeZone: 'UTC',
      emptyPlaceholder: '—',
      cssClass: 'h-full',
    },
  },
  { field: 'size', headerName: 'Size', width: 120 },
  { field: 'author', headerName: 'Author', width: 160 },
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
    filter: null,
    cellRenderer: (param: { data: Row }) => (
      <i>
        id: {param.data.id} and some long text to demonstrate ellipsis behavior
      </i>
    ),
  },
];

const getMenu = (): DropdownItem[] => [
  {
    key: 'copy',
    label: 'Copy',
    icon: <IconCopy {...BASE_ICON_PROPS} className="text-secondary" />,
  },
  {
    key: 'cut',
    label: 'Cut',
    icon: <IconCut {...BASE_ICON_PROPS} className="text-secondary" />,
  },
  {
    key: 'paste',
    label: 'Paste',
    icon: <IconClipboardCopy {...BASE_ICON_PROPS} className="text-secondary" />,
  },
  {
    key: 'download',
    label: 'Download',
    icon: <IconDownload {...BASE_ICON_PROPS} className="text-secondary" />,
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: <IconTrashX {...BASE_ICON_PROPS} className="text-secondary" />,
  },
  {
    key: 'rename',
    label: 'Rename',
    icon: <IconPencil {...BASE_ICON_PROPS} className="text-secondary" />,
  },
  { key: 'divider', type: DropdownItemType.Divider },
];

const FixedHeight: FC<PropsWithChildren<{ h?: string | number }>> = ({
  h = '70vh',
  children,
}) => (
  <div style={{ height: h, minHeight: 500, padding: 12 }}>
    <div style={{ height: '100%' }}>{children}</div>
  </div>
);

const meta = {
  title: 'Grid/DialGrid',
  render: (args) => <DialGrid<Row> {...(args as DialGridProps<Row>)} />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, height: '520px' },
      iframeHeight: 520,
    },
  },
  decorators: [
    (Story) => (
      <FixedHeight>
        <Story />
      </FixedHeight>
    ),
  ],
  argTypes: {
    columnDefs: { control: false },
    rowData: { control: false },
    additionalGridOptions: { control: false },
    getContextMenuItems: { control: false },
    cssClass: { control: 'text' },
    ariaLabel: { control: 'text' },
    selectedRowIds: { control: false },
    onSelectionChange: { control: false },
  },
  args: { columnDefs: columns, rowData: rows, getContextMenuItems: getMenu },
} satisfies Meta<Parameters<FC<DialGridProps<Row>>>[0]>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    selectedRowIds: undefined,
    onSelectionChange: undefined,
  },
};

export const ManyRows: Story = {
  args: {
    selectedRowIds: undefined,
    onSelectionChange: undefined,
    rowData: Array.from({ length: 60 }).map((_, i) => ({
      id: String(i + 1),
      name: `File_${i + 1}.${i % 2 ? 'png' : 'unknown'}`,
      updateTime: '2024-05-01',
      size: `${(Math.random() * 200 + 10).toFixed(0)} KB`,
      author: i % 2 ? 'alex' : 'mary',
    })),
  },
  decorators: [
    (Story) => (
      <FixedHeight h="80vh">
        <Story />
      </FixedHeight>
    ),
  ],
};

export const WithoutContextMenu: Story = {
  args: {
    selectedRowIds: undefined,
    onSelectionChange: undefined,
    getContextMenuItems: undefined,
  },
};

export const NoFilters: Story = {
  args: {
    selectedRowIds: undefined,
    onSelectionChange: undefined,
    withSelectionColumn: false,
    columnDefs: columns.map((c) => ({
      ...c,
      filter: false,
      floatingFilter: false,
    })),
  },
};

const ControlledSelectionDemo: FC<DialGridProps<Row>> = (args) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(['1', '3']),
  );

  const handleSelectionChange = (newSelectedIds: Set<string>) => {
    setSelectedIds(newSelectedIds);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '12px',
          background: '#222',
          marginBottom: '12px',
          borderRadius: '4px',
          flexShrink: 0,
        }}
      >
        <p style={{ margin: '0 0 8px 0', color: '#fff' }}>
          Selected IDs: {Array.from(selectedIds).join(', ') || 'None'}
        </p>
        <div className="flex gap-2 mb-2">
          <DialButton
            variant={ButtonVariant.Tertiary}
            onClick={() => setSelectedIds(new Set(['2']))}
            title="Select row 2"
          />
          <DialButton
            variant={ButtonVariant.Secondary}
            onClick={() => setSelectedIds(new Set())}
            title="Clear selection"
          />
          <DialButton
            variant={ButtonVariant.Primary}
            onClick={() => setSelectedIds(new Set(['1', '2', '3']))}
            title="Select all"
          />
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 300 }}>
        <DialGrid<Row>
          {...(args as DialGridProps<Row>)}
          selectedRowIds={selectedIds}
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </div>
  );
};

export const ControlledSelection: Story = {
  parameters: {
    storySource: {
      source: 'Controlled selection with external state management',
    },
  },
  render: (args) => (
    <ControlledSelectionDemo
      {...(args as DialGridProps<Row>)}
      columnDefs={columns.map((c) => ({
        ...c,
        filter: false,
        floatingFilter: false,
      }))}
    />
  ),
  decorators: [
    (Story) => (
      <FixedHeight h="70vh">
        <Story />
      </FixedHeight>
    ),
  ],
};

export const AlternativeOddRowColors: Story = {
  args: {
    selectedRowIds: undefined,
    onSelectionChange: undefined,
    alternateOddRowColors: true,
  },
};

export const ClickableRows: Story = {
  args: {
    selectedRowIds: undefined,
    onSelectionChange: undefined,
    additionalGridOptions: {
      onRowClicked: (row) => alert(`Clicked on row with ID: ${row.data?.id}`),
    },
  },
};
