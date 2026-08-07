import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { ElementSize } from '@/types/size';
import { PasswordInput, type PasswordInputProps } from './PasswordInput';

const InteractivePasswordInput = (args: PasswordInputProps) => {
  const [value, setValue] = useState(args.value ?? '');

  return (
    <PasswordInput
      {...args}
      value={value}
      onChange={(newValue) => setValue(newValue ?? '')}
    />
  );
};

const meta = {
  title: 'Components_2_0/PasswordInput',
  component: PasswordInput,
  tags: ['input'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A password field built on the 2.0 `Input`. The reveal toggle is a real ' +
          'button, so it can be reached by keyboard and announces its state.',
      },
    },
  },
  // `type` and `iconAfter` are owned by the component, so the shared input
  // argTypes are not spread in here — they would offer controls that do nothing.
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
    showPasswordLabel: { control: { type: 'text' } },
    hidePasswordLabel: { control: { type: 'text' } },
    onChange: { control: false },
  },
  args: {
    id: 'story-password',
    placeholder: 'Placeholder',
    disabled: false,
    invalid: false,
    size: ElementSize.Standard,
  },
  render: InteractivePasswordInput,
} satisfies Meta<PasswordInputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    labelProps: { label: 'Password' },
  },
};

export const Filled: Story = {
  args: {
    labelProps: { label: 'Password' },
    value: 'sup3r-s3cret',
  },
};

export const WithCaption: Story = {
  name: 'With caption',
  args: {
    labelProps: { label: 'Password' },
    caption: 'At least 12 characters',
  },
};

export const Invalid: Story = {
  args: {
    labelProps: { label: 'Password', required: true },
    value: 'short',
    invalid: true,
    error: 'Password is too short',
  },
};

export const Disabled: Story = {
  args: {
    labelProps: { label: 'Password' },
    value: 'sup3r-s3cret',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A disabled field stays masked and its toggle is disabled, so the value ' +
          'cannot be revealed while the field is out of reach.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    labelProps: { label: 'Password' },
    value: 'sup3r-s3cret',
    size: ElementSize.Small,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-y-6">
      {[ElementSize.Standard, ElementSize.Small].map((size) => (
        <div key={size} className="flex flex-row items-start gap-x-6">
          <InteractivePasswordInput
            id={`${size}-default`}
            size={size}
            labelProps={{ label: 'Default' }}
            placeholder="Placeholder"
          />
          <InteractivePasswordInput
            id={`${size}-filled`}
            size={size}
            labelProps={{ label: 'Filled' }}
            value="sup3r-s3cret"
          />
          <InteractivePasswordInput
            id={`${size}-invalid`}
            size={size}
            labelProps={{ label: 'Invalid', required: true }}
            value="short"
            invalid
            error="Password is too short"
          />
          <InteractivePasswordInput
            id={`${size}-disabled`}
            size={size}
            labelProps={{ label: 'Disabled' }}
            value="sup3r-s3cret"
            disabled
          />
        </div>
      ))}
    </div>
  ),
};
