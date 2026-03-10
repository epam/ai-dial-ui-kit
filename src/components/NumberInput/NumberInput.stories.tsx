import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialNumberInput, type DialNumberInputProps } from './NumberInput';
import { inputBaseArgTypes } from '@/constants/storybook/input';

const InteractiveNumberInput = (args: DialNumberInputProps) => {
  const [value, setValue] = useState(args.value);

  return (
    <div className="max-w-80 text-primary">
      <DialNumberInput
        {...args}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </div>
  );
};

const baseArgTypes = { ...inputBaseArgTypes };
delete baseArgTypes.value;

const meta = {
  title: 'Dial/Elements/Inputs/NumberInput',
  component: DialNumberInput,
  tags: ['input'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A number input component that combines a field label, number input, and error text with special handling for leading zeros and decimal values.',
      },
    },
  },
  argTypes: {
    ...inputBaseArgTypes,
  },
  args: {
    labelProps: { label: 'Number Input' },
    id: 'number-input',
    required: false,
    placeholder: 'Enter a number',
    value: undefined,
    disabled: false,
    invalid: false,
    error: undefined,
    min: undefined,
    max: undefined,
  },
  render: InteractiveNumberInput,
} satisfies Meta<DialNumberInputProps>;

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
