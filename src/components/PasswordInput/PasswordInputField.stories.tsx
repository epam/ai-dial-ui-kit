import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  DialPasswordInputField,
  type DialPasswordInputFieldProps,
} from './PasswordInputField';

const InteractiveInput = (args: DialPasswordInputFieldProps) => {
  const [value, setValue] = useState(args.value || '');

  return (
    <DialPasswordInputField
      {...args}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    />
  );
};

const meta: Meta<typeof DialPasswordInputField> = {
  title: 'Components/PasswordInput',
  component: DialPasswordInputField,
  tags: ['input'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An password input component with various states.',
      },
    },
  },
  argTypes: {
    elementId: {
      control: { type: 'text' },
      description: 'Unique identifier for the input element',
    },
    value: {
      control: { type: 'text' },
      description: 'Input value',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    containerCssClass: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the container',
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
      description: 'Whether the input has an error state',
    },
    onChange: {
      control: false,
      description: 'Callback function called when the input value changes',
    },
  },
  args: {
    elementId: 'story-input',
    placeholder: 'Placeholder',
    disabled: false,
    invalid: false,
  },
  render: InteractiveInput,
};
export default meta;

type Story = StoryObj<typeof DialPasswordInputField>;

export const Default: Story = {
  args: {
    elementId: 'password',
    fieldTitle: 'Password',
    value: '',
  },
};

export const WithError: Story = {
  args: {
    elementId: 'password-error',
    fieldTitle: 'Password',
    errorText: 'Password is required',
    invalid: true,
  },
};

export const Optional: Story = {
  args: {
    elementId: 'password-optional',
    fieldTitle: 'Password',
    value: '',
    errorText: '',
    optional: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="p-8 max-w-[1200px]">
      <div className="grid grid-cols-4 gap-6">
        {/* Default State */}
        <div>
          <div className="text-primary font-semibold mb-2">Default</div>
          <InteractiveInput
            elementId="password"
            fieldTitle="Password"
            placeholder="Placeholder"
          />
        </div>

        {/* With Error */}
        <div>
          <div className="text-primary font-semibold mb-2">With Error</div>
          <InteractiveInput
            elementId="password"
            fieldTitle="Password"
            placeholder="Placeholder"
            invalid={true}
            errorText="Password is required"
          />
        </div>

        {/* With Error */}
        <div>
          <div className="text-primary font-semibold mb-2">Optional</div>
          <InteractiveInput
            elementId="password"
            fieldTitle="Password"
            placeholder="Placeholder"
            optional={true}
          />
        </div>
      </div>
    </div>
  ),
};
