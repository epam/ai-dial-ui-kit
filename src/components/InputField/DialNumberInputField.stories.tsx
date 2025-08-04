import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import {
  DialNumberInputField,
  type DialNumberInputFieldProps,
} from './InputField';

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

const meta = {
  title: 'Inputs/NumberInputField',
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
    fieldTitle: {
      control: { type: 'text' },
      description: 'The title/label text to display for the field',
    },
    elementId: {
      control: { type: 'text' },
      description: 'The unique identifier for the input element',
    },
    optional: {
      control: { type: 'boolean' },
      description: 'Whether the field is optional (displays "(Optional)" text)',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text displayed when input is empty',
    },
    value: {
      control: { type: 'number' },
      description: 'The current value of the input',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the input is disabled',
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'Whether the input is read-only',
    },
    invalid: {
      control: { type: 'boolean' },
      description: 'Whether the input has validation errors',
    },
    errorText: {
      control: { type: 'text' },
      description: 'Error message text to display below the input',
    },
    defaultEmptyText: {
      control: { type: 'text' },
      description: 'Text to display when readonly and value is empty',
    },
  },
  args: {
    fieldTitle: 'Number Field',
    elementId: 'number-input',
    optional: false,
    placeholder: 'Enter a number',
    value: undefined,
    disabled: false,
    readonly: false,
    invalid: false,
    errorText: undefined,
    defaultEmptyText: undefined,
  },
  render: InteractiveNumberInputField,
} satisfies Meta<DialNumberInputFieldProps>;

export default meta;
type Story = StoryObj<typeof meta>;

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
            fieldTitle="Basic Field"
            placeholder="Enter number"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="hover-no-value"
            fieldTitle="Hover Field"
            placeholder="Enter number"
            elementContainerCssClass="dial-input-for-hover"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="focus-no-value"
            fieldTitle="Focus Field"
            placeholder="Enter number"
            elementContainerCssClass="dial-input-for-focus"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="disabled-no-value"
            fieldTitle="Disabled Field"
            placeholder="Enter number"
            disabled={true}
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="readonly-no-value"
            fieldTitle="Readonly Field"
            readonly={true}
            defaultEmptyText="No value set"
          />
        </div>

        {/* Row 2: With Value */}
        <div>
          <InteractiveNumberInputField
            elementId="basic-value"
            fieldTitle="Basic Field"
            placeholder="Enter number"
            value={42.5}
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="hover-value"
            fieldTitle="Hover Field"
            placeholder="Enter number"
            value={42.5}
            elementContainerCssClass="dial-input-for-hover"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="focus-value"
            fieldTitle="Focus Field"
            placeholder="Enter number"
            value={42.5}
            elementContainerCssClass="dial-input-for-focus"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="disabled-value"
            fieldTitle="Disabled Field"
            placeholder="Enter number"
            value={123}
            disabled={true}
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="readonly-value"
            fieldTitle="Readonly Field"
            value={99.99}
            readonly={true}
          />
        </div>

        {/* Row 3: No Value with Icon */}
        <div>
          <InteractiveNumberInputField
            elementId="basic-no-value-icon"
            fieldTitle="Basic with Icon"
            placeholder="Enter number"
            iconBeforeInput={<IconSearch size={16} />}
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="hover-no-value-icon"
            fieldTitle="Hover with Icon"
            placeholder="Enter number"
            iconBeforeInput={<IconSearch size={16} />}
            elementContainerCssClass="dial-input-for-hover"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="focus-no-value-icon"
            fieldTitle="Focus with Icon"
            placeholder="Enter number"
            iconBeforeInput={<IconSearch size={16} />}
            elementContainerCssClass="dial-input-for-focus"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="disabled-no-value-icon"
            fieldTitle="Disabled with Icon"
            placeholder="Enter number"
            iconBeforeInput={<IconSearch size={16} />}
            disabled={true}
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="readonly-no-value-icon"
            fieldTitle="Readonly with Icon"
            readonly={true}
            defaultEmptyText="No value set"
          />
        </div>

        {/* Row 4: With Value and Icon */}
        <div>
          <InteractiveNumberInputField
            elementId="basic-value-icon"
            fieldTitle="Basic with Icon"
            placeholder="Enter number"
            value={0.005}
            iconBeforeInput={<IconSearch size={16} />}
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="hover-value-icon"
            fieldTitle="Hover with Icon"
            placeholder="Enter number"
            value={0.005}
            iconBeforeInput={<IconSearch size={16} />}
            elementContainerCssClass="dial-input-for-hover"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="focus-value-icon"
            fieldTitle="Focus with Icon"
            placeholder="Enter number"
            value={0.005}
            iconBeforeInput={<IconSearch size={16} />}
            elementContainerCssClass="dial-input-for-focus"
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="disabled-value-icon"
            fieldTitle="Disabled with Icon"
            placeholder="Enter number"
            value={999}
            iconBeforeInput={<IconSearch size={16} />}
            disabled={true}
          />
        </div>
        <div>
          <InteractiveNumberInputField
            elementId="readonly-value-icon"
            fieldTitle="Readonly with Icon"
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

export const BasicNumberField: Story = {
  args: {
    fieldTitle: 'Age',
    elementId: 'age-input',
    placeholder: 'Enter your age',
  },
};

export const WithValue: Story = {
  args: {
    fieldTitle: 'Price',
    elementId: 'price-input',
    placeholder: 'Enter price',
    value: 29.99,
  },
};

export const OptionalField: Story = {
  args: {
    fieldTitle: 'Discount Percentage',
    elementId: 'discount-input',
    placeholder: 'Enter discount %',
    optional: true,
  },
};

export const WithError: Story = {
  args: {
    fieldTitle: 'Budget',
    elementId: 'budget-input',
    placeholder: 'Enter budget amount',
    value: -100,
    invalid: true,
    errorText: 'Budget must be a positive number',
  },
};

export const DisabledField: Story = {
  args: {
    fieldTitle: 'System Generated ID',
    elementId: 'id-input',
    value: 12345,
    disabled: true,
  },
};

export const ReadOnlyField: Story = {
  args: {
    fieldTitle: 'Total Amount',
    elementId: 'total-input',
    value: 150.75,
    readonly: true,
  },
};

export const ReadOnlyWithEmptyValue: Story = {
  args: {
    fieldTitle: 'Score',
    elementId: 'score-input',
    readonly: true,
    defaultEmptyText: 'Not calculated yet',
  },
};

export const DecimalHandling: Story = {
  args: {
    fieldTitle: 'Precision Value',
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
