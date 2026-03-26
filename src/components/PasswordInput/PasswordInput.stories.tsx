import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialPasswordInput } from './PasswordInput';
import type { DialInputProps } from '@/components/Input/Input';

const InteractiveInput = (args: DialInputProps) => {
  const [value, setValue] = useState(args.value || '');

  return (
    <DialPasswordInput
      {...args}
      value={value}
      onChange={(newValue) => setValue(newValue as string)}
    />
  );
};

const meta: Meta<typeof DialPasswordInput> = {
  title: 'Dial/Elements/Inputs/PasswordInput',
  component: DialPasswordInput,
  tags: ['input'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A password input component with various states.',
      },
    },
  },
  argTypes: {
    id: {
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
    containerClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the container',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the input is disabled',
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
    id: 'story-input',
    placeholder: 'Placeholder',
    disabled: false,
    invalid: false,
  },
  render: InteractiveInput,
};
export default meta;

type Story = StoryObj<typeof DialPasswordInput>;

export const Default: Story = {
  args: {
    id: 'password',
    labelProps: { label: 'Password' },
    value: '',
  },
};

export const Invalid: Story = {
  args: {
    id: 'password-error',
    labelProps: { label: 'Password' },
    required: true,
    error: 'Password is required',
    invalid: true,
  },
};

export const Required: Story = {
  args: {
    id: 'password-required',
    labelProps: { label: 'Password' },
    value: '',
    error: '',
    required: true,
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
            id="password"
            labelProps={{ label: 'Password' }}
            placeholder="Placeholder"
          />
        </div>

        {/* Invalid State */}
        <div>
          <div className="text-primary font-semibold mb-2">Invalid</div>
          <InteractiveInput
            id="password-error"
            labelProps={{ label: 'Password' }}
            placeholder="Placeholder"
            invalid
            error="Password is required"
          />
        </div>

        {/* Required */}
        <div>
          <div className="text-primary font-semibold mb-2">Required</div>
          <InteractiveInput
            id="password-required"
            labelProps={{ label: 'Password' }}
            placeholder="Placeholder"
            required
          />
        </div>
        {/* Disabled */}
        <div>
          <div className="text-primary font-semibold mb-2">Disabled</div>
          <InteractiveInput
            id="password-disabled"
            labelProps={{ label: 'Password' }}
            placeholder="Placeholder"
            value="Password text"
            disabled
          />
        </div>
      </div>
    </div>
  ),
};
