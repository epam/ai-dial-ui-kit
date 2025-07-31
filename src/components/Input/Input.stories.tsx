import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialInput, type DialInputProps } from './Input';
import { IconSearch, IconEye } from '@tabler/icons-react';

interface StoryInputProps
  extends Omit<DialInputProps, 'iconBefore' | 'iconAfter' | 'onChange'> {
  showIconBefore?: boolean;
  showIconAfter?: boolean;
}

const InteractiveInput = (args: StoryInputProps) => {
  const { showIconBefore, showIconAfter, ...inputProps } = args;
  const [value, setValue] = useState(inputProps.value || '');

  return (
    <DialInput
      {...inputProps}
      value={value}
      onChange={(newValue) => setValue(newValue)}
      iconBeforeInput={showIconBefore ? <IconSearch size={16} /> : undefined}
      iconAfterInput={showIconAfter ? <IconEye size={16} /> : undefined}
    />
  );
};

const meta = {
  title: 'Inputs/Input',
  component: DialInput,
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
    cssClass: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
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
    showIconBefore: {
      control: { type: 'boolean' },
      description: 'Show icon before the input',
    },
    showIconAfter: {
      control: { type: 'boolean' },
      description: 'Show icon after the input',
    },
  },
  args: {
    inputId: 'story-input',
    type: 'text',
    placeholder: 'Placeholder',
    disabled: false,
    invalid: false,
    hideBorder: false,
    showIconBefore: false,
    showIconAfter: false,
  },
  render: InteractiveInput,
} satisfies Meta<StoryInputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

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
            showIconBefore={true}
            showIconAfter={true}
          />
        </div>

        {/* Hover State */}
        <div>
          <div className="text-primary font-semibold mb-2">Hover</div>
          <InteractiveInput
            inputId="hover-input"
            containerCssClass="dial-input-for-hover"
            placeholder="Placeholder"
            showIconBefore={true}
            showIconAfter={true}
          />
        </div>

        {/* Field State (with value) */}
        <div>
          <div className="text-primary font-semibold mb-2">Field</div>
          <InteractiveInput
            inputId="field-input"
            placeholder="Placeholder"
            value="Input value"
            showIconBefore={true}
            showIconAfter={true}
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
            showIconBefore={true}
            showIconAfter={true}
          />
        </div>

        {/* Focus State */}
        <div>
          <div className="text-primary font-semibold mb-2">Focus</div>
          <InteractiveInput
            inputId="focus-input"
            containerCssClass="dial-input-for-focus"
            placeholder="Placeholder"
            showIconBefore={true}
            showIconAfter={true}
          />
        </div>

        {/* Error State */}
        <div>
          <div className="text-primary font-semibold mb-2">Error</div>
          <InteractiveInput
            inputId="error-input"
            placeholder="Placeholder"
            invalid={true}
            showIconBefore={true}
            showIconAfter={true}
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
            showIconBefore={true}
            showIconAfter={true}
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
            showIconBefore={true}
            showIconAfter={true}
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
                showIconAfter={true}
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
                showIconAfter={true}
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
                showIconAfter={true}
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
                showIconAfter={true}
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
                showIconAfter={true}
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
    showIconBefore: true,
  },
};

export const WithIconAfter: Story = {
  args: {
    placeholder: 'Password',
    type: 'password',
    showIconAfter: true,
  },
};

export const WithBothIcons: Story = {
  args: {
    placeholder: 'Search...',
    showIconBefore: true,
    showIconAfter: true,
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
