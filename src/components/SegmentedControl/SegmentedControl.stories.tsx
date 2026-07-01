import { IconLayoutGrid, IconList, IconTable } from '@tabler/icons-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { BASE_ICON_SIZE } from '@/constants/icon';
import {
  DialSegmentedControl,
  type DialSegmentedControlProps,
} from './SegmentedControl';

const meta = {
  title: 'Form/SegmentedControl',
  component: DialSegmentedControl,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A single-select control for switching between a small set of mutually exclusive, equally-sized options (e.g. view switchers). Supports 2 or more segments, optional per-option icons, and keyboard navigation.',
      },
    },
  },
  argTypes: {
    options: {
      control: { type: 'object' },
      description:
        'Segments to render. Each option needs a unique value and may include a label, icon, and disabled flag.',
      table: { type: { summary: 'SegmentedControlOption<T>[]' } },
    },
    value: {
      control: { type: 'text' },
      description: 'The currently selected option value.',
      table: { type: { summary: 'T' } },
    },
    onChange: {
      description: 'Callback fired with the selected option value.',
      table: { type: { summary: '(value: T) => void' } },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables the entire control when set.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessible label for the control.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    className: {
      control: { type: 'text' },
      description: 'Additional classes applied to the container.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
} satisfies Meta<DialSegmentedControlProps<string>>;

export default meta;
type Story = StoryObj<DialSegmentedControlProps<string>>;

const InteractiveExample = (args: DialSegmentedControlProps<string>) => {
  const [value, setValue] = useState(args.value);

  return (
    <DialSegmentedControl
      {...args}
      value={value}
      onChange={(next) => {
        setValue(next);
        args.onChange?.(next);
      }}
    />
  );
};

export const Default: Story = {
  render: InteractiveExample,
  args: {
    ariaLabel: 'View',
    value: 'day',
    onChange: () => null,
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
    ],
  },
};

export const ThreeSegments: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A segmented control with three equally-sized segments.',
      },
    },
  },
  render: InteractiveExample,
  args: {
    ariaLabel: 'Period',
    value: 'month',
    onChange: () => null,
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ],
  },
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Segments can render an icon alongside (or instead of) a label.',
      },
    },
  },
  render: InteractiveExample,
  args: {
    ariaLabel: 'Layout',
    value: 'list',
    onChange: () => null,
    options: [
      {
        value: 'list',
        label: 'List',
        icon: <IconList size={BASE_ICON_SIZE} />,
      },
      {
        value: 'grid',
        label: 'Grid',
        icon: <IconLayoutGrid size={BASE_ICON_SIZE} />,
      },
      {
        value: 'table',
        label: 'Table',
        icon: <IconTable size={BASE_ICON_SIZE} />,
      },
    ],
  },
};

export const WithDisabledOption: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Individual segments can be disabled via the option `disabled` flag.',
      },
    },
  },
  render: InteractiveExample,
  args: {
    ariaLabel: 'Period',
    value: 'day',
    onChange: () => null,
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month', disabled: true },
    ],
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The whole control can be disabled via the `disabled` prop.',
      },
    },
  },
  args: {
    ariaLabel: 'View',
    disabled: true,
    value: 'day',
    onChange: () => null,
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
    ],
  },
};
