import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import {
  DialNumberInputField,
  type DialNumberInputFieldProps,
} from './InputField';
import {
  fieldControlArgTypes,
  inputBaseArgTypes,
} from '@/constants/storybook/input';
import { dialFormItemBaseArgTypes } from '@/constants/storybook/form-item';

const InteractiveNumberInputField = (args: DialNumberInputFieldProps) => {
  const [value, setValue] = useState(args.value);

  return (
    <div className="max-w-80 text-primary">
      <DialNumberInputField
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
  title: 'Form/NumberInputField',
  component: DialNumberInputField,
  tags: ['input'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A number input field component that combines a field label, number input, and error text with special handling for leading zeros and decimal values.',
      },
    },
  },
  argTypes: {
    ...dialFormItemBaseArgTypes,
    ...fieldControlArgTypes,
    ...inputBaseArgTypes,
    value: {
      control: { type: 'number' },
      description: 'The current value of the input',
    },
    errorText: {
      control: { type: 'text' },
      description: 'Error message text to display below the input',
    },
    defaultEmptyText: {
      control: { type: 'text' },
      description: 'Text to display when readonly and value is empty',
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum allowed value for the number input',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum allowed value for the number input',
    },
  },
  args: {
    fieldLabel: 'Number Field',
    elementId: 'number-input',
    optional: false,
    placeholder: 'Enter a number',
    value: undefined,
    disabled: false,
    readonly: false,
    invalid: false,
    errorText: undefined,
    defaultEmptyText: undefined,
    min: undefined,
    max: undefined,
  },
  render: InteractiveNumberInputField,
} satisfies Meta<DialNumberInputFieldProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicNumberField: Story = {
  args: {
    fieldLabel: 'Age',
    elementId: 'age-input',
    placeholder: 'Enter your age',
  },
};

export const WithValue: Story = {
  args: {
    fieldLabel: 'Price',
    elementId: 'price-input',
    placeholder: 'Enter price',
    value: 29.99,
  },
};

export const OptionalField: Story = {
  args: {
    fieldLabel: 'Discount Percentage',
    elementId: 'discount-input',
    placeholder: 'Enter discount %',
    optional: true,
  },
};

export const WithError: Story = {
  args: {
    fieldLabel: 'Budget',
    elementId: 'budget-input',
    placeholder: 'Enter budget amount',
    value: -100,
    invalid: true,
    errorText: 'Budget must be a positive number',
  },
};

export const DisabledField: Story = {
  args: {
    fieldLabel: 'System Generated ID',
    elementId: 'id-input',
    value: 12345,
    disabled: true,
  },
};

export const ReadOnlyField: Story = {
  args: {
    fieldLabel: 'Total Amount',
    elementId: 'total-input',
    value: 150.75,
    readonly: true,
  },
};

export const ReadOnlyWithEmptyValue: Story = {
  args: {
    fieldLabel: 'Score',
    elementId: 'score-input',
    readonly: true,
    defaultEmptyText: 'Not calculated yet',
  },
};

export const DecimalHandling: Story = {
  args: {
    fieldLabel: 'Precision Value',
    elementId: 'precision-input',
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

export const AllVariants: Story = {
  render: () => (
    <div className="p-8 max-w-[1400px]">
      <div className="grid grid-cols-5 gap-6">
        {/* Headers */}
        <div className="text-primary font-semibold text-center">Basic</div>
        <div className="text-primary font-semibold text-center">Hover</div>
        <div className="text-primary font-semibold text-center">Focus</div>
        <div className="text-primary font-semibold text-center">Disabled</div>
        <div className="text-primary font-semibold text-center">Readonly</div>

        {/* Row 1: No Value */}
        <div>
          <InteractiveNumberInputField
            elementId="basic-no-value"
            fieldLabel="Basic Field"
            placeholder="Enter number"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="hover-no-value"
            fieldLabel="Hover Field"
            placeholder="Enter number"
            elementContainerClassName="dial-input-for-hover"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="focus-no-value"
            fieldLabel="Focus Field"
            placeholder="Enter number"
            elementContainerClassName="dial-input-for-focus"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="disabled-no-value"
            fieldLabel="Disabled Field"
            placeholder="Enter number"
            disabled={true}
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="readonly-no-value"
            fieldLabel="Readonly Field"
            readonly={true}
            defaultEmptyText="No value set"
          />
        </div>

        {/* Row 2: With Value */}
        <div>
          <InteractiveNumberInputField
            elementId="basic-value"
            fieldLabel="Basic Field"
            placeholder="Enter number"
            value={42.5}
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="hover-value"
            fieldLabel="Hover Field"
            placeholder="Enter number"
            value={42.5}
            elementContainerClassName="dial-input-for-hover"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="focus-value"
            fieldLabel="Focus Field"
            placeholder="Enter number"
            value={42.5}
            elementContainerClassName="dial-input-for-focus"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="disabled-value"
            fieldLabel="Disabled Field"
            placeholder="Enter number"
            value={123}
            disabled={true}
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="readonly-value"
            fieldLabel="Readonly Field"
            value={99.99}
            readonly={true}
          />
        </div>

        {/* Row 3: No Value with Icon */}
        <div>
          <InteractiveNumberInputField
            elementId="basic-no-value-icon"
            fieldLabel="Basic with Icon"
            placeholder="Enter number"
            iconBefore={<IconSearch size={16} />}
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="hover-no-value-icon"
            fieldLabel="Hover with Icon"
            placeholder="Enter number"
            iconBefore={<IconSearch size={16} />}
            elementContainerClassName="dial-input-for-hover"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="focus-no-value-icon"
            fieldLabel="Focus with Icon"
            placeholder="Enter number"
            iconBefore={<IconSearch size={16} />}
            elementContainerClassName="dial-input-for-focus"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="disabled-no-value-icon"
            fieldLabel="Disabled with Icon"
            placeholder="Enter number"
            iconBefore={<IconSearch size={16} />}
            disabled={true}
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="readonly-no-value-icon"
            fieldLabel="Readonly with Icon"
            readonly={true}
            defaultEmptyText="No value set"
          />
        </div>

        {/* Row 4: With Value and Icon */}
        <div>
          <InteractiveNumberInputField
            elementId="basic-value-icon"
            fieldLabel="Basic with Icon"
            placeholder="Enter number"
            value={0.005}
            iconBefore={<IconSearch size={16} />}
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="hover-value-icon"
            fieldLabel="Hover with Icon"
            placeholder="Enter number"
            value={0.005}
            iconBefore={<IconSearch size={16} />}
            elementContainerClassName="dial-input-for-hover"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="focus-value-icon"
            fieldLabel="Focus with Icon"
            placeholder="Enter number"
            value={0.005}
            iconBefore={<IconSearch size={16} />}
            elementContainerClassName="dial-input-for-focus"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="disabled-value-icon"
            fieldLabel="Disabled with Icon"
            placeholder="Enter number"
            value={999}
            iconBefore={<IconSearch size={16} />}
            disabled={true}
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="readonly-value-icon"
            fieldLabel="Readonly with Icon"
            value={0.005}
            readonly={true}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    pseudo: {
      hover: ['.dial-input-for-hover'],
      focus: ['.dial-input-for-focus'],
    },
    docs: {
      description: {
        story:
          'Comprehensive showcase of all number input field variants in a grid layout: columns show different states (basic, hover, focus, disabled, readonly) and rows show different configurations (no value, with value, no value with icons, value with icons).',
      },
    },
  },
};

export const WithMinMax: Story = {
  args: {
    fieldLabel: 'Age',
    elementId: 'age-input',
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

export const WithMinOnly: Story = {
  args: {
    fieldLabel: 'Temperature',
    elementId: 'temp-input',
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

export const WithMaxOnly: Story = {
  args: {
    fieldLabel: 'Percentage',
    elementId: 'percentage-input',
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
