import type { FC } from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialRadioButton, type DialRadioButtonProps } from './RadioButton';

/** Helper components for stateful examples (avoid hooks inside Story `render`) */
const ControlledGroup: FC = () => {
  const [selected, setSelected] = useState<'basic' | 'pro'>('basic');
  return (
    <div className="flex flex-col gap-3">
      <DialRadioButton
        name="plan-group"
        value="basic"
        inputId="plan-basic"
        label="Basic"
        description="Good for starters"
        checked={selected === 'basic'}
        onChange={() => setSelected('basic')}
      />
      <DialRadioButton
        name="plan-group"
        value="pro"
        inputId="plan-pro"
        label="Pro"
        description="Advanced features and support"
        checked={selected === 'pro'}
        onChange={() => setSelected('pro')}
      />
      <div className="tiny text-secondary">Selected: {selected}</div>
    </div>
  );
};

const ManyOptionsGroup: FC = () => {
  type Value = 'free' | 'team' | 'business' | 'enterprise';
  const [value, setValue] = useState<Value>('team');
  const options: { value: Value; title: string; description?: string }[] = [
    { value: 'free', title: 'Free', description: 'Personal experiments' },
    {
      value: 'team',
      title: 'Team',
      description: 'Collaboration for small teams',
    },
    { value: 'business', title: 'Business', description: 'Security and SSO' },
    {
      value: 'enterprise',
      title: 'Enterprise',
      description: 'Custom SLAs and support',
    },
  ];
  return (
    <div className="flex flex-col gap-3 w-[360px]">
      {options.map((o) => (
        <DialRadioButton
          key={o.value}
          name="plans-many"
          value={o.value}
          inputId={`plans-many-${o.value}`}
          label={o.title}
          description={o.description}
          checked={value === o.value}
          onChange={() => setValue(o.value)}
        />
      ))}
      <div className="tiny text-secondary">Selected: {value}</div>
    </div>
  );
};

const meta = {
  title: 'Form/RadioButton',
  component: DialRadioButton,
  parameters: { layout: 'centered' },
  argTypes: {
    name: { control: { type: 'text' } },
    value: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    description: { control: { type: 'text' } },
    inputId: { control: { type: 'text' } },
    checked: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    className: { control: { type: 'text' } },
    labelClassName: { control: { type: 'text' } },
    onChange: { control: false },
  },
  args: {
    name: 'plan',
    value: 'basic',
    inputId: 'radio-basic',
    label: 'Basic plan',
    checked: false,
    disabled: false,
  },
} satisfies Meta<DialRadioButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CheckedWithDescription: Story = {
  args: {
    checked: true,
    description: 'Includes the essential features to get started.',
  },
};

export const Disabled: Story = { args: { disabled: true } };

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    checked: true,
    description: 'No label, description still visible when checked.',
  },
};

export const LongLabelAndDescription: Story = {
  args: {
    label:
      'A very long label that should wrap onto multiple lines to demonstrate text wrapping behavior in the radio label',
    checked: true,
    descriptionClassName: 'text-secondary',
    description:
      'This is a long description intended to demonstrate multiline wrapping and spacing relative to the radio input and label.',
  },
};

export const CustomClasses: Story = {
  args: {
    className: 'ring-2 ring-offset-1',
    labelClassName: 'text-primary font-medium',
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    label: 'Disabled & checked',
    description: 'This option is locked by policy.',
  },
};
export const Caption: Story = {
  args: {
    label: 'Disabled & checked',
    caption: 'This option is locked by policy.',
  },
};

export const GroupControlled: Story = {
  render: () => <ControlledGroup />,
};

export const GroupWithManyOptions: Story = {
  render: () => <ManyOptionsGroup />,
};
