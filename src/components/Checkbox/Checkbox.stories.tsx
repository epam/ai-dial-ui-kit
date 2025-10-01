import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialCheckbox, type DialCheckboxProps } from './Checkbox';

const InteractiveCheckbox = (args: DialCheckboxProps) => {
  const [value, setValue] = useState(args.checked);

  return (
    <DialCheckbox
      {...args}
      checked={value}
      onChange={(newValue) => setValue(newValue)}
    />
  );
};

const meta = {
  label: 'Components/Checkbox',
  component: DialCheckbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: { component: 'A checkbox component.' },
    },
  },
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'Unique identifier for the checkbox element',
    },
    label: {
      control: 'text',
      description: 'The label/label text to display for the checkbox',
    },
    onChange: {
      action: 'changed',
      control: false,
      description: 'Callback function called when the switch value changes',
    },
  },
  args: {
    label: 'Checkbox',
    id: 'checkbox',
  },
} satisfies Meta<DialCheckboxProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveCheckbox,
  args: {
    id: 'default-checkbox',
    checked: true,
    label: 'Default Checkbox',
  },
};

export const DefaultNotActive: Story = {
  render: InteractiveCheckbox,
  args: {
    id: 'default-checkbox',
    checked: false,
    label: 'Default Checkbox',
  },
};

export const DefaultIndeterminate: Story = {
  render: InteractiveCheckbox,
  args: {
    id: 'default-checkbox',
    checked: true,
    indeterminate: true,
    label: 'Default Checkbox',
  },
};

export const DisabledDefault: Story = {
  render: InteractiveCheckbox,
  args: {
    id: 'default-checkbox',
    checked: true,
    disabled: true,
    label: 'Default Checkbox',
  },
};

export const DisabledNotActive: Story = {
  render: InteractiveCheckbox,
  args: {
    id: 'default-checkbox',
    checked: false,
    disabled: true,
    label: 'Default Checkbox',
  },
};

export const DisabledIndeterminate: Story = {
  render: InteractiveCheckbox,
  args: {
    id: 'default-checkbox',
    checked: true,
    indeterminate: true,
    disabled: true,
    label: 'Default Checkbox',
  },
};

export const AllVariants: Story = {
  args: {
    id: 'all-variants-textarea',
    label: 'Checkbox',
  },
  render: () => (
    <div className="min-w-[800px] p-8 flex flex-col gap-y-6">
      {/* Default State */}
      <div>
        <div className="text-primary font-semibold mb-2">Default</div>
        <InteractiveCheckbox
          id="default-checkbox"
          label="Checkbox"
          checked={true}
        />
      </div>

      {/* Default State not active Checkbox  */}
      <div>
        <div className="text-primary font-semibold mb-2">
          Default for not active Checkbox
        </div>
        <InteractiveCheckbox
          id="default-checkbox"
          label="Checkbox"
          checked={false}
        />
      </div>
      {/* Default State for Indeterminate Checkbox  */}
      <div>
        <div className="text-primary font-semibold mb-2">
          Default for Indeterminate Checkbox
        </div>
        <InteractiveCheckbox
          id="default-checkbox"
          label="Checkbox"
          checked={true}
          indeterminate={true}
        />
      </div>

      {/* Disable State for Checkbox  */}
      <div>
        <div className="text-primary font-semibold mb-2">
          Disable State for Checkbox
        </div>
        <InteractiveCheckbox
          id="default-checkbox"
          label="Checkbox"
          checked={true}
          disabled={true}
        />
      </div>

      {/* Disable State for Not Active Checkbox  */}
      <div>
        <div className="text-primary font-semibold mb-2">
          Disable State for Not Active Checkbox
        </div>
        <InteractiveCheckbox
          id="default-checkbox"
          label="Checkbox"
          checked={false}
          disabled={true}
        />
      </div>

      {/* Disable State for Indeterminate Checkbox  */}
      <div>
        <div className="text-primary font-semibold mb-2">
          Disable for Indeterminate Checkbox
        </div>
        <InteractiveCheckbox
          id="default-checkbox"
          label="Checkbox"
          checked={true}
          disabled={true}
          indeterminate={true}
        />
      </div>
    </div>
  ),
};
