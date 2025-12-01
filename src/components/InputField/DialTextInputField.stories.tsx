import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconNetwork, IconSearch, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { DialTextInputField, type DialTextInputFieldProps } from './InputField';
import {
  fieldControlArgTypes,
  inputBaseArgTypes,
} from '@/constants/storybook/input';
import { dialFormItemBaseArgTypes } from '@/constants/storybook/form-item';

const InteractiveTextInputField = (args: DialTextInputFieldProps) => {
  const [value, setValue] = useState(args.value || '');

  return (
    <div className="text-primary">
      <DialTextInputField
        {...args}
        value={value}
        onChange={(newValue) => setValue(newValue || '')}
      />
    </div>
  );
};

const meta = {
  title: 'Form/TextInputField',
  component: DialTextInputField,
  tags: ['input'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A text input field component that combines a field label, text input, and error text with consistent styling and validation support.',
      },
    },
  },
  argTypes: {
    ...dialFormItemBaseArgTypes,
    ...fieldControlArgTypes,
    ...inputBaseArgTypes,
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
    fieldTitle: 'Text Field',
    elementId: 'text-input',
    optional: false,
    placeholder: 'Enter text',
    value: undefined,
    disabled: false,
    readonly: false,
    invalid: false,
    errorText: undefined,
    defaultEmptyText: undefined,
  },
  render: InteractiveTextInputField,
} satisfies Meta<DialTextInputFieldProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicTextField: Story = {
  args: {
    fieldTitle: 'Full Name',
    elementId: 'name-input',
    placeholder: 'Enter your full name',
  },
};

export const WithValue: Story = {
  args: {
    fieldTitle: 'Email Address',
    elementId: 'email-input',
    placeholder: 'Enter your email',
    value: 'user@example.com',
  },
};

export const OptionalField: Story = {
  args: {
    fieldTitle: 'Middle Name',
    elementId: 'middle-name-input',
    placeholder: 'Enter middle name',
    optional: true,
  },
};

export const WithError: Story = {
  args: {
    fieldTitle: 'Username',
    elementId: 'username-input',
    placeholder: 'Enter username',
    value: 'user@123',
    invalid: true,
    errorText: 'Username can only contain letters, numbers, and underscores',
  },
};

export const DisabledField: Story = {
  args: {
    fieldTitle: 'System User ID',
    elementId: 'user-id-input',
    value: 'USR_12345',
    disabled: true,
  },
};

export const ReadOnlyField: Story = {
  args: {
    fieldTitle: 'Account Type',
    elementId: 'account-type-input',
    value: 'Premium',
    readonly: true,
  },
};

export const ReadOnlyWithEmptyValue: Story = {
  args: {
    fieldTitle: 'Nickname',
    elementId: 'nickname-input',
    readonly: true,
    defaultEmptyText: 'No nickname set',
  },
};

export const WithTextBeforeInput: Story = {
  args: {
    fieldTitle: 'Website URL',
    elementId: 'website-input',
    placeholder: 'Enter website URL',
    textBeforeInput: 'https://example.com/custom-domains/',
  },
};

export const WithTextAfterInput: Story = {
  args: {
    fieldTitle: 'Phone Number',
    elementId: 'phone-input',
    placeholder: 'Enter phone number',
    textAfterInput: 'US',
  },
};

export const WithPrefixAndSuffix: Story = {
  args: {
    fieldTitle: 'Price',
    elementId: 'price-input',
    placeholder: 'Enter price',
    prefix: '$',
    suffix: 'USD',
  },
};

export const WithAllExtraParts: Story = {
  args: {
    fieldTitle: 'Endpoint',
    elementId: 'custom-input',
    placeholder: 'Enter domain',
    iconBefore: <IconNetwork size={16} />,
    iconAfter: <IconTrash size={16} />,
    textBeforeInput: 'https://',
    textAfterInput: '.com',
    prefix: 'id',
    suffix: 'end',
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
          <InteractiveTextInputField
            elementId="basic-no-value"
            fieldTitle="Basic Field"
            placeholder="Enter text"
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="hover-no-value"
            fieldTitle="Hover Field"
            placeholder="Enter text"
            elementContainerClassName="dial-input-for-hover"
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="focus-no-value"
            fieldTitle="Focus Field"
            placeholder="Enter text"
            elementContainerClassName="dial-input-for-focus"
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="disabled-no-value"
            fieldTitle="Disabled Field"
            placeholder="Enter text"
            disabled={true}
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="readonly-no-value"
            fieldTitle="Readonly Field"
            readonly={true}
            defaultEmptyText="No value set"
          />
        </div>

        {/* Row 2: With Value */}
        <div>
          <InteractiveTextInputField
            elementId="basic-value"
            fieldTitle="Basic Field"
            placeholder="Enter text"
            value="Sample text"
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="hover-value"
            fieldTitle="Hover Field"
            placeholder="Enter text"
            value="Sample text"
            elementContainerClassName="dial-input-for-hover"
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="focus-value"
            fieldTitle="Focus Field"
            placeholder="Enter text"
            value="Sample text"
            elementContainerClassName="dial-input-for-focus"
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="disabled-value"
            fieldTitle="Disabled Field"
            placeholder="Enter text"
            value="Disabled text"
            disabled={true}
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="readonly-value"
            fieldTitle="Readonly Field"
            value="Readonly text"
            readonly={true}
          />
        </div>

        {/* Row 3: No Value with Icon */}
        <div>
          <InteractiveTextInputField
            elementId="basic-no-value-icon"
            fieldTitle="Basic with Icon"
            placeholder="Enter text"
            iconBefore={<IconSearch size={16} />}
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="hover-no-value-icon"
            fieldTitle="Hover with Icon"
            placeholder="Enter text"
            iconBefore={<IconSearch size={16} />}
            elementContainerClassName="dial-input-for-hover"
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="focus-no-value-icon"
            fieldTitle="Focus with Icon"
            placeholder="Enter text"
            iconBefore={<IconSearch size={16} />}
            elementContainerClassName="dial-input-for-focus"
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="disabled-no-value-icon"
            fieldTitle="Disabled with Icon"
            placeholder="Enter text"
            iconBefore={<IconSearch size={16} />}
            disabled={true}
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="readonly-no-value-icon"
            fieldTitle="Readonly with Icon"
            readonly={true}
            defaultEmptyText="No value set"
          />
        </div>

        {/* Row 4: With Value and Icon */}
        <div>
          <InteractiveTextInputField
            elementId="basic-value-icon"
            fieldTitle="Basic with Icon"
            placeholder="Enter text"
            value="Sample text"
            iconBefore={<IconSearch size={16} />}
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="hover-value-icon"
            fieldTitle="Hover with Icon"
            placeholder="Enter text"
            value="Sample text"
            iconBefore={<IconSearch size={16} />}
            elementContainerClassName="dial-input-for-hover"
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="focus-value-icon"
            fieldTitle="Focus with Icon"
            placeholder="Enter text"
            value="Sample text"
            iconBefore={<IconSearch size={16} />}
            elementContainerClassName="dial-input-for-focus"
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="disabled-value-icon"
            fieldTitle="Disabled with Icon"
            placeholder="Enter text"
            value="Disabled text"
            iconBefore={<IconSearch size={16} />}
            disabled={true}
          />
        </div>
        <div>
          <InteractiveTextInputField
            elementId="readonly-value-icon"
            fieldTitle="Readonly with Icon"
            value="Readonly text"
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
          'Comprehensive showcase of all text input field variants in a grid layout: columns show different states (basic, hover, focus, disabled, readonly) and rows show different configurations (no value, with value, no value with icons, value with icons).',
      },
    },
  },
};

export const AllVariantsForExtraParts: Story = {
  render: () => (
    <div className="p-8 max-w-[1400px]">
      <div className="grid gap-x-2 gap-y-10 grid-cols-[minmax(0,100px)_1fr] items-center">
        {/* row 1 */}
        <div className="text-primary font-semibold text-center">Basic</div>
        <InteractiveTextInputField
          fieldTitle="Endpoint"
          elementId="custom-input"
          placeholder="Enter domain"
          iconBefore={<IconNetwork size={16} />}
          iconAfter={<IconTrash size={16} />}
          textBeforeInput="https://"
          textAfterInput=".com"
          prefix="id"
          suffix="end"
        />

        {/* row 2 */}
        <div className="text-primary font-semibold text-center">Hover</div>
        <InteractiveTextInputField
          fieldTitle="Endpoint"
          elementId="custom-input"
          placeholder="Enter domain"
          elementContainerClassName="dial-input-for-hover"
          iconBefore={<IconNetwork size={16} />}
          iconAfter={<IconTrash size={16} />}
          textBeforeInput="https://"
          textAfterInput=".com"
          prefix="id"
          suffix="end"
        />
        {/* row 3 */}
        <div className="text-primary font-semibold text-center">Focus</div>
        <InteractiveTextInputField
          fieldTitle="Endpoint"
          elementId="custom-input"
          placeholder="Enter domain"
          elementContainerClassName="dial-input-for-focus"
          iconBefore={<IconNetwork size={16} />}
          iconAfter={<IconTrash size={16} />}
          textBeforeInput="https://"
          textAfterInput=".com"
          prefix="id"
          suffix="end"
        />
        {/* row 4 */}
        <div className="text-primary font-semibold text-center">Disabled</div>
        <InteractiveTextInputField
          fieldTitle="Endpoint"
          elementId="custom-input"
          placeholder="Enter domain"
          iconBefore={<IconNetwork size={16} />}
          iconAfter={<IconTrash size={16} />}
          textBeforeInput="https://"
          textAfterInput=".com"
          disabled={true}
          prefix="id"
          suffix="end"
        />
        {/* row 5 */}
        <div className="text-primary font-semibold text-center">Readonly</div>
        <InteractiveTextInputField
          fieldTitle="Endpoint"
          elementId="custom-input"
          placeholder="Enter domain"
          iconBefore={<IconNetwork size={16} />}
          iconAfter={<IconTrash size={16} />}
          textBeforeInput="https://"
          textAfterInput=".com"
          readonly={true}
          prefix="id"
          suffix="end"
        />
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
          'Comprehensive showcase of all text input field variants in a grid layout: columns show different states (basic, hover, focus, disabled, readonly) and rows show different configurations (no value, with value, no value with icons, value with icons).',
      },
    },
  },
};
