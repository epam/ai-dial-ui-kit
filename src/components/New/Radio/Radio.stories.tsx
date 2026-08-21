import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Radio, type RadioProps } from './Radio';

const InteractiveRadio = (args: RadioProps) => {
  const [value, setValue] = useState(args.isSelected ? args.value : '');

  return (
    <Radio {...args} isSelected={value === args.value} onChange={setValue} />
  );
};

const meta = {
  title: 'Components_2_0/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A radio button from the 2.0 design system, built on a native radio input. Radios sharing a `name` form one group with a single tab stop and arrow-key selection.',
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'The id of the underlying radio input',
    },
    name: {
      control: 'text',
      description: 'The group this radio belongs to',
    },
    value: {
      control: 'text',
      description: 'The value reported to `onChange` when selected',
    },
    labelProps: {
      control: 'object',
      description: 'Props of the `Label` rendered next to the control',
    },
    isSelected: {
      control: 'boolean',
      description: 'Whether this radio is the selected one of its group',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio is disabled',
    },
    onChange: {
      action: 'changed',
      control: false,
      description:
        'Callback fired with `value` when this radio becomes selected',
    },
    caption: {
      control: 'text',
      description: 'Caption text rendered below the label',
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveRadio,
  args: {
    id: 'default-radio',
    name: 'default',
    value: 'text',
    labelProps: { label: 'Text' },
  },
};

export const Selected: Story = {
  render: InteractiveRadio,
  args: {
    id: 'selected-radio',
    name: 'selected',
    value: 'text',
    labelProps: { label: 'Text' },
    isSelected: true,
  },
};

export const Disabled: Story = {
  render: InteractiveRadio,
  args: {
    id: 'disabled-radio',
    name: 'disabled',
    value: 'text',
    labelProps: { label: 'Text' },
    disabled: true,
  },
};

export const DisabledSelected: Story = {
  render: InteractiveRadio,
  args: {
    id: 'disabled-selected-radio',
    name: 'disabled-selected',
    value: 'text',
    labelProps: { label: 'Text' },
    isSelected: true,
    disabled: true,
  },
};

export const WithCaption: Story = {
  render: InteractiveRadio,
  args: {
    id: 'caption-radio',
    name: 'caption',
    value: 'text',
    labelProps: { label: 'Text' },
    isSelected: true,
    caption: 'Some caption text',
  },
};

/**
 * The Default / Selected × Enabled / Disabled matrix from the design spec.
 * Hover and focus are interaction states — hover a control or tab to it to see them.
 */
export const AllVariants: Story = {
  args: { id: 'all-variants-radio', name: 'all-variants', value: 'text' },
  render: () => (
    <div className="grid min-w-[320px] grid-cols-[auto_1fr_1fr] items-center gap-x-8 gap-y-6 p-8">
      <span />
      <span className="text-primary dial-small-semi-text">Default</span>
      <span className="text-primary dial-small-semi-text">Selected</span>

      <span className="text-secondary dial-small-text">Enabled</span>
      <Radio
        id="all-enabled-default"
        name="all-enabled"
        value="a"
        labelProps={{ label: 'Text' }}
      />
      <Radio
        id="all-enabled-selected"
        name="all-enabled"
        value="b"
        labelProps={{ label: 'Text' }}
        isSelected
      />

      <span className="text-secondary dial-small-text">Disabled</span>
      <Radio
        id="all-disabled-default"
        name="all-disabled"
        value="a"
        labelProps={{ label: 'Text' }}
        disabled
      />
      <Radio
        id="all-disabled-selected"
        name="all-disabled"
        value="b"
        labelProps={{ label: 'Text' }}
        isSelected
        disabled
      />
    </div>
  ),
};

/**
 * A group of radios sharing one `name`: the browser gives the set a single tab
 * stop and moves the selection with the arrow keys.
 */
export const Group: Story = {
  args: { id: 'group-radio', name: 'plan', value: 'free' },
  render: () => {
    const RadioGroupExample = () => {
      const [plan, setPlan] = useState('pro');

      return (
        <fieldset className="flex min-w-[280px] flex-col gap-3 p-8">
          <legend className="text-primary dial-small-semi-text mb-2">
            Plan
          </legend>
          {[
            { value: 'free', label: 'Free', caption: 'One project' },
            { value: 'pro', label: 'Pro', caption: 'Unlimited projects' },
            { value: 'team', label: 'Team', caption: 'Adds shared workspaces' },
          ].map((option) => (
            <Radio
              key={option.value}
              id={`plan-${option.value}`}
              name="plan"
              value={option.value}
              labelProps={{ label: option.label }}
              caption={option.caption}
              isSelected={plan === option.value}
              onChange={setPlan}
            />
          ))}
        </fieldset>
      );
    };

    return <RadioGroupExample />;
  },
};
