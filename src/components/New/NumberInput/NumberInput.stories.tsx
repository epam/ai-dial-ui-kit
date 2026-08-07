import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { ElementSize } from '@/types/size';
import { NumberInput, type NumberInputProps } from './NumberInput';

const InteractiveNumberInput = (args: NumberInputProps) => {
  const [value, setValue] = useState(args.value);

  return (
    <div className="max-w-80 text-primary">
      <NumberInput
        {...args}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </div>
  );
};

const meta = {
  title: 'Components_2_0/NumberInput',
  component: NumberInput,
  tags: ['input'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A number field built on the 2.0 `Input`, with special handling for leading zeros and decimal values.',
      },
    },
  },
  // `type` is owned by the component, so the shared input argTypes are not
  // spread in here — they would offer controls that do nothing.
  argTypes: {
    placeholder: { control: { type: 'text' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    error: { control: { type: 'text' } },
    caption: { control: { type: 'text' } },
    size: {
      control: { type: 'inline-radio' },
      options: [ElementSize.Standard, ElementSize.Small],
      description: 'Field height: standard is 40px, small is 24px',
    },
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    integer: {
      control: { type: 'boolean' },
      description: 'Restrict input to integer values only',
    },
    onChange: { control: false },
  },
  args: {
    labelProps: { label: 'Number Input' },
    id: 'number-input',
    required: false,
    placeholder: 'Enter a number',
    value: undefined,
    disabled: false,
    invalid: false,
    integer: false,
    error: undefined,
    min: undefined,
    max: undefined,
  },
  render: InteractiveNumberInput,
} satisfies Meta<NumberInputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    labelProps: { label: 'Age' },
    id: 'age-input',
    placeholder: 'Enter your age',
  },
};

export const Filled: Story = {
  args: {
    labelProps: { label: 'Price' },
    id: 'price-input',
    placeholder: 'Enter your price',
    value: 29.99,
  },
};

export const Invalid: Story = {
  args: {
    labelProps: { label: 'Budget' },
    id: 'budget-input',
    placeholder: 'Enter budget amount',
    value: -100,
    invalid: true,
    error: 'Budget must be a positive number',
  },
};

export const Disabled: Story = {
  args: {
    labelProps: { label: 'System Generated ID' },
    id: 'id-input',
    value: 12345,
    disabled: true,
  },
};

export const DecimalHandling: Story = {
  args: {
    labelProps: { label: 'Precision Value' },
    id: 'precision-input',
    placeholder: 'Enter decimal value',
    value: 0.005,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates how the component handles decimal values with leading zeros.',
      },
    },
  },
};

export const MinAndMaxValues: Story = {
  args: {
    labelProps: { label: 'Age' },
    id: 'age-input',
    placeholder: 'Enter your age (18-120)',
    min: 18,
    max: 120,
    value: 25,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates a number input with minimum and maximum value constraints.',
      },
    },
  },
};

export const MinValue: Story = {
  args: {
    labelProps: { label: 'Temperature' },
    id: 'temp-input',
    placeholder: 'Enter temperature (min: -273.15°C)',
    min: -273.15,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates a number input with only a minimum value constraint.',
      },
    },
  },
};

export const MaxValue: Story = {
  args: {
    labelProps: { label: 'Percentage' },
    id: 'percentage-input',
    placeholder: 'Enter percentage (max: 100%)',
    max: 100,
    value: 85,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates a number input with only a maximum value constraint.',
      },
    },
  },
};

export const Integer: Story = {
  args: {
    labelProps: { label: 'Port Number' },
    id: 'port-input',
    placeholder: 'Enter port number',
    integer: true,
    min: 0,
    max: 65535,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Integer-only input mode. Decimal points, minus signs, plus signs, and scientific notation (e/E) are blocked. Pasted text is sanitized to digits only.',
      },
    },
  },
};
