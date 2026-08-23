import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Input } from '@/components/New/Input/Input';
import { RadioGroupOrientation } from '@/types/radio-group';
import { RadioGroup, type RadioGroupProps } from './RadioGroup';

const deliveryItems = [
  { value: 'pickup', label: 'Pickup', caption: 'Free, ready today' },
  { value: 'courier', label: 'Courier', caption: 'Arrives tomorrow' },
  { value: 'post', label: 'Post', caption: 'Three to five days' },
];

const InteractiveRadioGroup = (args: RadioGroupProps) => {
  const [value, setValue] = useState(args.value);

  return <RadioGroup {...args} value={value} onChange={setValue} />;
};

const meta = {
  title: 'Components_2_0/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A set of mutually exclusive `Radio` options under one group label. The options are native radios sharing a `name`, so the group is a single tab stop and the arrow keys move the selection. An option can reveal its own content while selected.',
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Options to render, each with a unique `value`',
    },
    value: {
      control: 'text',
      description: 'The `value` of the selected option',
    },
    onChange: {
      action: 'changed',
      control: false,
      description: 'Callback fired with the newly selected `value`',
    },
    orientation: {
      control: 'inline-radio',
      options: Object.values(RadioGroupOrientation),
      description: 'Whether the options stack or sit in a row',
    },
    labelProps: {
      control: 'object',
      description: 'Props of the `Label` rendered above the options',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every option',
    },
    error: {
      control: 'text',
      description: 'Error message rendered below the options',
    },
    caption: {
      control: 'text',
      description: 'Helper text rendered below the options',
    },
    ariaLabel: {
      control: 'text',
      description: 'Names the group when there is no string label',
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveRadioGroup,
  args: {
    labelProps: { label: 'Delivery' },
    items: deliveryItems,
    value: 'courier',
    onChange: () => undefined,
  },
};

export const Row: Story = {
  render: InteractiveRadioGroup,
  args: {
    labelProps: { label: 'Delivery' },
    items: deliveryItems.map(({ value, label }) => ({ value, label })),
    value: 'pickup',
    orientation: RadioGroupOrientation.Row,
    onChange: () => undefined,
  },
};

/** `caption` on the group is helper text; `caption` on an item describes that option. */
export const WithCaption: Story = {
  render: InteractiveRadioGroup,
  args: {
    labelProps: { label: 'Delivery', caption: 'Applies to this order only' },
    items: deliveryItems,
    value: 'post',
    caption: 'Delivery times exclude weekends',
    onChange: () => undefined,
  },
};

export const WithError: Story = {
  render: InteractiveRadioGroup,
  args: {
    labelProps: { label: 'Delivery', required: true },
    items: deliveryItems.map(({ value, label }) => ({ value, label })),
    error: 'Choose a delivery option',
    onChange: () => undefined,
  },
};

/** An option's `content` is mounted only while that option is selected. */
export const WithContent: Story = {
  render: InteractiveRadioGroup,
  args: {
    labelProps: { label: 'Delivery' },
    value: 'courier',
    items: [
      { value: 'pickup', label: 'Pickup', caption: 'Free, ready today' },
      {
        value: 'courier',
        label: 'Courier',
        content: (
          <Input
            labelProps={{ label: 'Address' }}
            placeholder="Street, city"
            containerClassName="w-[260px]"
          />
        ),
      },
    ],
    onChange: () => undefined,
  },
};

/** A single `disabled` option, and the whole group disabled. */
export const Disabled: Story = {
  args: {
    items: deliveryItems,
    value: 'courier',
    onChange: () => undefined,
  },
  render: (args) => (
    <div className="flex min-w-[520px] gap-16 p-8">
      <RadioGroup
        {...args}
        labelProps={{ label: 'One option disabled' }}
        items={[
          { value: 'pickup', label: 'Pickup' },
          { value: 'courier', label: 'Courier' },
          { value: 'post', label: 'Post', disabled: true },
        ]}
      />
      <RadioGroup
        {...args}
        labelProps={{ label: 'Whole group disabled' }}
        items={deliveryItems.map(({ value, label }) => ({ value, label }))}
        disabled
      />
    </div>
  ),
};
