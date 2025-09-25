import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialSwitch, type DialSwitchProps } from './Switch';

const InteractiveSwitch = (args: DialSwitchProps) => {
  const [value, setValue] = useState(args.isOn);

  return (
    <div className="w-full text-primary">
      <DialSwitch
        {...args}
        isOn={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </div>
  );
};

const meta = {
  title: 'Switch',
  component: DialSwitch,
  tags: ['switch'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible switch component with consistent styling.',
      },
    },
  },
  argTypes: {
    switchId: {
      control: 'text',
      description: 'Unique identifier for the switch element',
    },
    title: {
      control: 'text',
      description: 'The title/label text to display for the switch',
    },
    isOn: {
      control: 'boolean',
      description: 'The current value of the switch',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    onChange: {
      action: 'changed',
      control: false,
      description: 'Callback function called when the switch value changes',
    },
  },
} satisfies Meta<typeof DialSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveSwitch,
  args: {
    switchId: 'default-switch',
    title: 'Enable feature',
  },
};

export const WithActiveValue: Story = {
  render: InteractiveSwitch,
  args: {
    switchId: 'default-switch',
    title: 'Enable feature',
    isOn: true,
  },
};

export const Disabled: Story = {
  render: InteractiveSwitch,
  args: {
    switchId: 'default-switch',
    title: 'Enable feature',
    isOn: true,
    disabled: true,
  },
};

export const AllVariants: Story = {
  args: {
    switchId: 'all-variants-textarea',
  },
  render: () => (
    <div className="min-w-[800px] p-8">
      <div className="grid grid-cols-3 gap-6">
        {/* Default State */}
        <div>
          <div className="text-primary font-semibold mb-2">Default</div>
          <InteractiveSwitch switchId="default-switch" title="Switch" />
        </div>

        {/* Disabled State for active Switch */}
        <div>
          <div className="text-primary font-semibold mb-2">
            Disabled for active Switch
          </div>
          <InteractiveSwitch
            switchId="disabled-switch"
            title="Disabled Switch"
            disabled={true}
            isOn={true}
          />
        </div>

        {/* Disabled State for not active Switch */}
        <div>
          <div className="text-primary font-semibold mb-2">
            Disabled for not active Switch
          </div>
          <InteractiveSwitch
            switchId="disabled-switch"
            title="Disabled Switch"
            disabled={true}
            isOn={false}
          />
        </div>
      </div>
    </div>
  ),
};
