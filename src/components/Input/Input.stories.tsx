import {
  inputBaseArgTypes,
  numberInputBaseArgTypes,
} from '@/constants/storybook/input';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconEye, IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { DialInput, type DialInputProps } from './Input';

const InteractiveInput = (args: DialInputProps) => {
  const [value, setValue] = useState(args.value || '');

  console.log(args.error);
  return (
    <DialInput
      {...args}
      value={value}
      onChange={(newValue) => setValue(newValue ?? '')}
      // eslint-disable-next-line no-console
      onBlur={({ target }) => console.log(target.value)}
    />
  );
};

const meta = {
  title: 'DIAL/Elements/Input',
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
    ...inputBaseArgTypes,
    ...numberInputBaseArgTypes,
    type: {
      control: { type: 'select' },
      options: ['text', 'password', 'email', 'number', 'search'],
      description: 'Input type',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    containerClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the container',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the input element',
    },
    hideBorder: {
      control: { type: 'boolean' },
      description: 'Whether to hide the input border',
    },
    onChange: {
      control: false,
      description: 'Callback function called when the input value changes',
    },
    onBlur: {
      control: false,
      description: 'Callback function called when the input blurs',
    },
    hideTooltip: {
      control: { type: 'boolean' },
      description: 'Whether to hide the tooltip',
    },
  },
  args: {
    id: 'story-input',
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
    iconBefore: <IconSearch size={16} />,
  },
};

export const WithIconAfter: Story = {
  args: {
    placeholder: 'Password',
    type: 'password',
    iconAfter: <IconEye size={16} />,
  },
};

export const WithBothIcons: Story = {
  args: {
    placeholder: 'Search...',
    iconBefore: <IconSearch size={16} />,
    iconAfter: <IconEye size={16} />,
  },
};

export const Disable: Story = {
  args: {
    placeholder: 'Disable input',
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    placeholder: 'Invalid input',
    value: 'Invalid value',
    invalid: true,
  },
};

export const NumberInput: Story = {
  args: {
    type: 'number',
    placeholder: '0',
    value: 42,
  },
};

export const NumberInputWithMinMax: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter age (18-120)',
    min: 18,
    max: 120,
    value: 25,
  },
};

export const WithPrefixAndSuffix: Story = {
  args: {
    placeholder: 'Enter amount',
    value: '100',
    prefix: '$',
    suffix: 'USD',
  },
};

export const WithTextBeforeAndAfter: Story = {
  args: {
    placeholder: 'Enter domain',
    value: 'example',
    textBeforeInput: 'https://',
    textAfterInput: '.com',
  },
};

export const WithAllExtraParts: Story = {
  args: {
    placeholder: 'Enter value',
    value: 'test',
    prefix: 'pre',
    suffix: 'suf',
    textBeforeInput: 'before',
    textAfterInput: 'after',
    iconBefore: <IconSearch size={16} />,
    iconAfter: <IconEye size={16} />,
  },
};

export const WithTooltipText: Story = {
  args: {
    value: 'example value',
    tooltipProps: { text: 'This is a tooltip' },
  },
};

export const HiddenTooltip: Story = {
  args: {
    value: 'example value',
    hideTooltip: true,
  },
};

export const AllVariants: Story = {
  render: () => {
    return (
      <div className="flex flex-col h-full w-full items-center">
        <h2 className="text-primary font-semibold mb-8">Inputs</h2>

        <div className="flex-1 min-h-0 flex flex-col gap-y-6">
          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Default
            </div>
            <InteractiveInput
              id="default-input"
              placeholder="Placeholder"
              iconBefore={<IconSearch size={16} />}
              iconAfter={<IconEye size={16} />}
            />
          </div>
          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Hover
            </div>
            <InteractiveInput
              id="hover-input"
              containerClassName="dial-input-for-hover"
              placeholder="Placeholder"
              iconBefore={<IconSearch size={16} />}
              iconAfter={<IconEye size={16} />}
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Focus/Active
            </div>
            <InteractiveInput
              id="focus-input"
              containerClassName="dial-input-for-focus"
              placeholder="Placeholder"
              iconBefore={<IconSearch size={16} />}
              iconAfter={<IconEye size={16} />}
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Filled
            </div>
            <InteractiveInput
              id="field-input"
              placeholder="Placeholder"
              value="Text"
              iconBefore={<IconSearch size={16} />}
              iconAfter={<IconEye size={16} />}
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Error
            </div>
            <InteractiveInput
              id="error-input"
              placeholder="Placeholder"
              invalid={true}
              value="Text"
              error="Error message"
              iconBefore={<IconSearch size={16} />}
              iconAfter={<IconEye size={16} />}
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Disabled
            </div>
            <InteractiveInput
              id="disable-input"
              placeholder="Placeholder"
              disabled={true}
              value="Disabled input"
              iconBefore={<IconSearch size={16} />}
              iconAfter={<IconEye size={16} />}
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    pseudo: {
      hover: ['.dial-input-for-hover'],
      focus: ['.dial-input-for-focus'],
    },
  },
};

export const AllVariantsWithIcons: Story = {
  render: () => (
    <div className="p-8 max-w-[1200px]">
      <div className="grid grid-cols-4 gap-6">
        {/* Field State (with value) */}
        <div>
          <div className="text-primary font-semibold mb-2">Field</div>
          <InteractiveInput
            id="field-input"
            placeholder="Placeholder"
            value="Input value"
            iconBefore={<IconSearch size={16} />}
            iconAfter={<IconEye size={16} />}
          />
        </div>

        {/* Field Hover State */}
        <div>
          <div className="text-primary font-semibold mb-2">Field hover</div>
          <InteractiveInput
            id="field-hover-input"
            placeholder="Placeholder"
            containerClassName="dial-input-for-hover"
            value="Input value"
            iconBefore={<IconSearch size={16} />}
            iconAfter={<IconEye size={16} />}
          />
        </div>

        {/* Error State */}
        <div>
          <div className="text-primary font-semibold mb-2">Error</div>
          <InteractiveInput
            id="error-input"
            placeholder="Placeholder"
            error="Error text"
            invalid={true}
            iconBefore={<IconSearch size={16} />}
            iconAfter={<IconEye size={16} />}
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
