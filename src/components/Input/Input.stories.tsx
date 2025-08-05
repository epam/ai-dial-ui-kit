import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialInput, type DialInputProps } from './Input';
import { IconSearch, IconEye } from '@tabler/icons-react';

const InteractiveInput = (args: DialInputProps) => {
  const [value, setValue] = useState(args.value || '');

  return (
    <DialInput
      {...args}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    />
  );
};

const meta = {
  title: 'Inputs/Input',
  component: DialInput,
  tags: ['input'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An input component with various states and icon support.',
      },
    },
  },
  argTypes: {
    inputId: {
      control: { type: 'text' },
      description: 'Unique identifier for the input element',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'password', 'email', 'number', 'search'],
      description: 'Input type',
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
    cssClass: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the input element',
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
    hideBorder: {
      control: { type: 'boolean' },
      description: 'Whether to hide the input border',
    },
    iconBeforeInput: {
      control: false,
      description: 'Icon or element to display before the input',
    },
    iconAfterInput: {
      control: false,
      description: 'Icon or element to display after the input',
    },
    onChange: {
      control: false,
      description: 'Callback function called when the input value changes',
    },
  },
  args: {
    inputId: 'story-input',
    type: 'text',
    placeholder: 'Placeholder',
    disabled: false,
    invalid: false,
    hideBorder: false,
  },
  render: InteractiveInput,
} satisfies Meta<DialInputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Enter text...',
    value: 'Sample text',
  },
};

export const WithIconBefore: Story = {
  args: {
    placeholder: 'Search...',
    iconBeforeInput: <IconSearch size={16} />,
  },
};

export const WithIconAfter: Story = {
  args: {
    placeholder: 'Password',
    type: 'password',
    iconAfterInput: <IconEye size={16} />,
  },
};

export const WithBothIcons: Story = {
  args: {
    placeholder: 'Search...',
    iconBeforeInput: <IconSearch size={16} />,
    iconAfterInput: <IconEye size={16} />,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const Readonly: Story = {
  args: {
    placeholder: 'Readonly input',
    readonly: true,
    value: "Value can't be changed",
  },
};
export const Invalid: Story = {
  args: {
    placeholder: 'Invalid input',
    value: 'Invalid value',
    invalid: true,
  },
};

export const WithoutBorder: Story = {
  args: {
    placeholder: 'Borderless input',
    hideBorder: true,
  },
};

export const NumberInput: Story = {
  args: {
    type: 'number',
    placeholder: '0',
    value: 42,
  },
};

export const AllVariantsWithIcons: Story = {
  render: () => (
    <div className="p-8 max-w-[1200px]">
      <div className="grid grid-cols-4 gap-6">
        {/* Default State */}
        <div>
          <div className="text-primary font-semibold mb-2">Default</div>
          <InteractiveInput
            inputId="default-input"
            placeholder="Placeholder"
            iconBeforeInput={<IconSearch size={16} />}
            iconAfterInput={<IconEye size={16} />}
          />
        </div>

        {/* Hover State */}
        <div>
          <div className="text-primary font-semibold mb-2">Hover</div>
          <InteractiveInput
            inputId="hover-input"
            containerCssClass="dial-input-for-hover"
            placeholder="Placeholder"
            iconBeforeInput={<IconSearch size={16} />}
            iconAfterInput={<IconEye size={16} />}
          />
        </div>

        {/* Field State (with value) */}
        <div>
          <div className="text-primary font-semibold mb-2">Field</div>
          <InteractiveInput
            inputId="field-input"
            placeholder="Placeholder"
            value="Input value"
            iconBeforeInput={<IconSearch size={16} />}
            iconAfterInput={<IconEye size={16} />}
          />
        </div>

        {/* Field Hover State */}
        <div>
          <div className="text-primary font-semibold mb-2">Field hover</div>
          <InteractiveInput
            inputId="field-hover-input"
            placeholder="Placeholder"
            containerCssClass="dial-input-for-hover"
            value="Input value"
            iconBeforeInput={<IconSearch size={16} />}
            iconAfterInput={<IconEye size={16} />}
          />
        </div>

        {/* Focus State */}
        <div>
          <div className="text-primary font-semibold mb-2">Focus</div>
          <InteractiveInput
            inputId="focus-input"
            containerCssClass="dial-input-for-focus"
            placeholder="Placeholder"
            iconBeforeInput={<IconSearch size={16} />}
            iconAfterInput={<IconEye size={16} />}
          />
        </div>

        {/* Error State */}
        <div>
          <div className="text-primary font-semibold mb-2">Error</div>
          <InteractiveInput
            inputId="error-input"
            placeholder="Placeholder"
            invalid={true}
            iconBeforeInput={<IconSearch size={16} />}
            iconAfterInput={<IconEye size={16} />}
          />
        </div>

        {/* Disable State */}
        <div>
          <div className="text-primary font-semibold mb-2">Disable</div>
          <InteractiveInput
            inputId="disable-input"
            placeholder="Placeholder"
            disabled={true}
            value="Disabled input"
            iconBeforeInput={<IconSearch size={16} />}
            iconAfterInput={<IconEye size={16} />}
          />
        </div>

        {/* Read-only State */}
        <div>
          <div className="text-primary font-semibold mb-2">Read-only</div>
          <InteractiveInput
            inputId="readonly-input"
            placeholder="Placeholder"
            readonly={true}
            value="Read-only value"
            iconBeforeInput={<IconSearch size={16} />}
            iconAfterInput={<IconEye size={16} />}
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
  },
};

export const AllVariantsWithoutIcon: Story = {
  render: () => (
    <div className="p-8 max-w-[1200px]">
      <div className="grid grid-cols-4 gap-6">
        {/* Default State */}
        <div>
          <div className="text-primary font-semibold mb-2">Default</div>
          <InteractiveInput
            inputId="default-no-icon-input"
            placeholder="Placeholder"
          />
        </div>

        {/* Hover State */}
        <div>
          <div className="text-primary font-semibold mb-2">Hover</div>
          <InteractiveInput
            inputId="hover-no-icon-input"
            containerCssClass="dial-input-for-hover-no-icon"
            placeholder="Placeholder"
          />
        </div>

        {/* Field State (with value) */}
        <div>
          <div className="text-primary font-semibold mb-2">Field</div>
          <InteractiveInput
            inputId="field-no-icon-input"
            placeholder="Placeholder"
            value="Input value"
          />
        </div>

        {/* Field Hover State */}
        <div>
          <div className="text-primary font-semibold mb-2">Field hover</div>
          <InteractiveInput
            inputId="field-hover-no-icon-input"
            containerCssClass="dial-input-for-hover-no-icon"
            placeholder="Placeholder"
            value="Input value"
          />
        </div>

        {/* Focus State */}
        <div>
          <div className="text-primary font-semibold mb-2">Focus</div>
          <InteractiveInput
            inputId="focus-no-icon-input"
            containerCssClass="dial-input-for-focus-no-icon"
            placeholder="Placeholder"
          />
        </div>

        {/* Error State */}
        <div>
          <div className="text-primary font-semibold mb-2">Error</div>
          <InteractiveInput
            inputId="error-no-icon-input"
            placeholder="Placeholder"
            invalid={true}
          />
        </div>

        {/* Disable State */}
        <div>
          <div className="text-primary font-semibold mb-2">Disable</div>
          <InteractiveInput
            inputId="disable-no-icon-input"
            placeholder="Placeholder"
            disabled={true}
            value="Disabled input"
          />
        </div>

        {/* Read-only State */}
        <div>
          <div className="text-primary font-semibold mb-2">Read-only</div>
          <InteractiveInput
            inputId="readonly-no-icon-input"
            placeholder="Placeholder"
            readonly={true}
            value="Read-only value"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    pseudo: {
      hover: ['.dial-input-for-hover-no-icon'],
      focus: ['.dial-input-for-focus-no-icon'],
    },
  },
};

export const AllVariantsWithoutBorder: Story = {
  render: () => (
    <div className="p-8">
      <h3 className=" mb-4 font-semibold text-primary">
        Input States Without Border
      </h3>
      <table className="w-full border-collapse text-primary border border-white">
        <thead>
          <tr>
            <th className="text-left p-1 border border-white font-semibold">
              State
            </th>
            <th className="text-left p-1 border border-white font-semibold">
              Text Input
            </th>
            <th className="text-left p-1 border border-white font-semibold">
              Password Input
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-1 border border-white font-medium">Default</td>
            <td className="p-1 border border-white">
              <InteractiveInput
                inputId="table-default-text"
                placeholder="Enter text"
                hideBorder={true}
              />
            </td>
            <td className="p-1 border border-white">
              <InteractiveInput
                inputId="table-default-password"
                type="password"
                placeholder="Enter password"
                hideBorder={true}
                iconAfterInput={<IconEye size={16} />}
              />
            </td>
          </tr>
          <tr>
            <td className="p-1 border border-white font-medium">With Value</td>
            <td className="p-1 border border-white">
              <InteractiveInput
                inputId="table-value-text"
                placeholder="Enter text"
                value="Sample text"
                hideBorder={true}
              />
            </td>
            <td className="p-1 border border-white">
              <InteractiveInput
                inputId="table-value-password"
                type="password"
                placeholder="Enter password"
                value="password123"
                hideBorder={true}
                iconAfterInput={<IconEye size={16} />}
              />
            </td>
          </tr>
          <tr>
            <td className="p-1 border border-white font-medium">Disabled</td>
            <td className="p-1 border border-white">
              <InteractiveInput
                inputId="table-disabled-text"
                placeholder="Disabled text"
                value="Disabled value"
                disabled={true}
                hideBorder={true}
              />
            </td>
            <td className="p-1 border border-white">
              <InteractiveInput
                inputId="table-disabled-password"
                type="password"
                placeholder="Disabled password"
                value="disabled123"
                disabled={true}
                hideBorder={true}
                iconAfterInput={<IconEye size={16} />}
              />
            </td>
          </tr>
          <tr>
            <td className="p-1 border border-white font-medium">Read-only</td>
            <td className="p-1 border border-white">
              <InteractiveInput
                inputId="table-readonly-text"
                placeholder="Read-only text"
                value="Read-only value"
                readonly={true}
                hideBorder={true}
              />
            </td>
            <td className="p-1 border border-white">
              <InteractiveInput
                inputId="table-readonly-password"
                type="password"
                placeholder="Read-only password"
                value="readonly123"
                readonly={true}
                hideBorder={true}
                iconAfterInput={<IconEye size={16} />}
              />
            </td>
          </tr>
          <tr>
            <td className="p-1 border border-white font-medium">Error</td>
            <td className="p-1 border border-white">
              <InteractiveInput
                inputId="table-error-text"
                placeholder="Invalid text"
                value="Invalid value"
                invalid={true}
                hideBorder={true}
              />
            </td>
            <td className="p-1 border border-white">
              <InteractiveInput
                inputId="table-error-password"
                type="password"
                placeholder="Invalid password"
                value="invalid123"
                invalid={true}
                hideBorder={true}
                iconAfterInput={<IconEye size={16} />}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
};
