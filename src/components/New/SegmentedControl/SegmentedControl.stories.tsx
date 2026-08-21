import {
  IconBolt,
  IconLayoutGrid,
  IconLayoutList,
  IconTable,
} from '@tabler/icons-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment, useState } from 'react';
import {
  SegmentedControl,
  type SegmentedControlItem,
} from './SegmentedControl';

const ICON_ITEMS = [
  { value: 'first', icon: <IconBolt size={20} />, 'aria-label': 'First' },
  { value: 'second', icon: <IconBolt size={20} />, 'aria-label': 'Second' },
];

const VIEW_ITEMS = [
  { value: 'list', icon: <IconLayoutList size={20} />, label: 'List' },
  { value: 'grid', icon: <IconLayoutGrid size={20} />, label: 'Grid' },
  { value: 'table', icon: <IconTable size={20} />, label: 'Table' },
];

const meta = {
  title: 'Components_2_0/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A single-select switch between a few mutually exclusive, equally sized options. Rendered as a `radiogroup`: the group is one tab stop and the arrow keys, `Home` and `End` move the selection.',
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Segments to render; each needs a unique `value`',
    },
    value: {
      control: 'text',
      description: 'The currently selected `value`',
    },
    onChange: {
      action: 'changed',
      control: false,
      description: 'Callback fired with the newly selected `value`',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every segment',
    },
    className: {
      control: 'text',
      description: 'Additional classes for the track',
    },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

const Interactive = ({
  items,
  initialValue,
  disabled,
  ariaLabel = 'View',
}: {
  items: SegmentedControlItem[];
  initialValue: string;
  disabled?: boolean;
  ariaLabel?: string;
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <SegmentedControl
      aria-label={ariaLabel}
      items={items}
      value={value}
      onChange={setValue}
      disabled={disabled}
    />
  );
};

export const Default: Story = {
  args: { items: ICON_ITEMS, value: 'first', onChange: () => {} },
  render: () => (
    <Interactive items={ICON_ITEMS} initialValue="first" ariaLabel="Mode" />
  ),
};

export const WithLabels: Story = {
  args: { items: VIEW_ITEMS, value: 'list', onChange: () => {} },
  render: () => <Interactive items={VIEW_ITEMS} initialValue="list" />,
};

export const LabelsOnly: Story = {
  args: {
    items: VIEW_ITEMS.map(({ value, label }) => ({ value, label })),
    value: 'grid',
    onChange: () => {},
  },
  render: () => (
    <Interactive
      items={VIEW_ITEMS.map(({ value, label }) => ({ value, label }))}
      initialValue="grid"
    />
  ),
};

export const Disabled: Story = {
  args: {
    items: VIEW_ITEMS,
    value: 'list',
    onChange: () => {},
    disabled: true,
  },
  render: () => <Interactive items={VIEW_ITEMS} initialValue="list" disabled />,
};

/**
 * A single segment can be disabled on its own. It is skipped by the arrow keys,
 * and it never holds the group's tab stop.
 */
export const SingleSegmentDisabled: Story = {
  args: { items: VIEW_ITEMS, value: 'list', onChange: () => {} },
  render: () => {
    const items = VIEW_ITEMS.map((item) =>
      item.value === 'table' ? { ...item, disabled: true } : item,
    );

    return <Interactive items={items} initialValue="list" />;
  },
};

/**
 * The Selected / Unselected × Default / Disable matrix from the design spec.
 * Hover, active and focus are interaction states — hover, hold or tab to a
 * segment to see them.
 */
export const AllVariants: Story = {
  args: { items: ICON_ITEMS, value: 'first', onChange: () => {} },
  render: () => {
    const rows: { title: string; disabled?: boolean }[] = [
      { title: 'Default' },
      { title: 'Disable', disabled: true },
    ];

    return (
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-10 gap-y-6 p-8">
        {rows.map((row) => (
          <Fragment key={row.title}>
            <span className="text-secondary dial-small-text">{row.title}</span>
            <SegmentedControl
              aria-label={`Mode (${row.title})`}
              items={ICON_ITEMS}
              value="first"
              onChange={() => {}}
              disabled={row.disabled}
            />
          </Fragment>
        ))}
      </div>
    );
  },
};

/** Stretched to the width of its container instead of hugging its segments. */
export const FullWidth: Story = {
  args: { items: VIEW_ITEMS, value: 'list', onChange: () => {} },
  render: () => {
    const FullWidthExample = () => {
      const [value, setValue] = useState('list');

      return (
        <div className="w-[420px] p-8">
          <SegmentedControl
            aria-label="View"
            items={VIEW_ITEMS}
            value={value}
            onChange={setValue}
            className="flex w-full"
          />
        </div>
      );
    };

    return <FullWidthExample />;
  },
};
