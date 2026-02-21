import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialNumberInput, type DialNumberInputProps } from './NumberInput';
import { inputBaseArgTypes } from '@/constants/storybook/input';

const InteractiveNumberInputField = (args: DialNumberInputProps) => {
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
    labelProps: { fieldLabel: 'Number Input' },
    id: 'number-input',
    required: false,
    placeholder: 'Enter a number',
    value: undefined,
    disabled: false,
    invalid: false,
    errorText: undefined,
    min: undefined,
    max: undefined,
  },
  render: InteractiveNumberInputField,
} satisfies Meta<DialNumberInputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    labelProps: { fieldLabel: 'Age' },
    id: 'age-input',
    placeholder: 'Enter your age',
  },
};

export const Filled: Story = {
  args: {
    labelProps: { fieldLabel: 'Price' },
    id: 'price-input',
    placeholder: 'Enter your price',
    value: 29.99,
  },
};

export const Invalid: Story = {
  args: {
    labelProps: { fieldLabel: 'Budget' },
    id: 'budget-input',
    placeholder: 'Enter budget amount',
    value: -100,
    invalid: true,
    errorText: 'Budget must be a positive number',
  },
};

export const Disabled: Story = {
  args: {
    labelProps: { fieldLabel: 'System Generated ID' },
    id: 'id-input',
    value: 12345,
    disabled: true,
  },
};

export const DecimalHandling: Story = {
  args: {
    labelProps: { fieldLabel: 'Precision Value' },
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
    labelProps: { fieldLabel: 'Age' },
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
    labelProps: { fieldLabel: 'Temperature' },
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
    labelProps: { fieldLabel: 'Percentage' },
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
