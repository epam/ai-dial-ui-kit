import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch, type SwitchProps } from './Switch';

const InteractiveSwitch = (args: SwitchProps) => {
  const [value, setValue] = useState(args.isOn);

  return <Switch {...args} isOn={value} onChange={setValue} />;
};

const meta = {
  title: 'Components_2_0/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A switch (toggle) control from the 2.0 design system, built on a native checkbox.',
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'The id of the underlying checkbox input',
    },
    label: {
      control: 'text',
      description: 'Visible label rendered next to the control',
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
      description: 'Callback fired with the new value when toggled',
    },
    caption: {
      control: 'text',
      description: 'Caption text rendered below the label',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveSwitch,
  args: {
    id: 'default-switch',
    label: 'Active',
  },
};

export const On: Story = {
  render: InteractiveSwitch,
  args: {
    id: 'on-switch',
    label: 'Active',
    isOn: true,
  },
};

export const Disabled: Story = {
  render: InteractiveSwitch,
  args: {
    id: 'disabled-off-switch',
    label: 'Active',
    isOn: false,
    disabled: true,
  },
};

export const DisabledOn: Story = {
  render: InteractiveSwitch,
  args: {
    id: 'disabled-on-switch',
    label: 'Active',
    isOn: true,
    disabled: true,
  },
};

export const WithCaption: Story = {
  render: InteractiveSwitch,
  args: {
    id: 'caption-switch',
    label: 'Active',
    isOn: true,
    caption: 'Some caption text',
  },
};

export const AllVariants: Story = {
  args: { id: 'all-variants-switch' },
  render: () => (
    <div className="flex min-w-[400px] flex-col gap-y-6 p-8">
      <div>
        <div className="text-primary dial-small-semi-text mb-2">Off</div>
        <InteractiveSwitch id="all-off" label="Active" />
      </div>
      <div>
        <div className="text-primary dial-small-semi-text mb-2">On</div>
        <InteractiveSwitch id="all-on" label="Active" isOn />
      </div>
      <div>
        <div className="text-primary dial-small-semi-text mb-2">
          Disabled off
        </div>
        <InteractiveSwitch id="all-disabled-off" label="Active" disabled />
      </div>
      <div>
        <div className="text-primary dial-small-semi-text mb-2">
          Disabled on
        </div>
        <InteractiveSwitch id="all-disabled-on" label="Active" isOn disabled />
      </div>
      <div>
        <div className="text-primary dial-small-semi-text mb-2">
          With caption
        </div>
        <InteractiveSwitch
          id="all-caption"
          label="Active"
          isOn
          caption="Some caption text"
        />
      </div>
    </div>
  ),
};
