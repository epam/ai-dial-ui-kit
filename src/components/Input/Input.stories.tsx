import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconEye, IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { DialInput, type DialInputProps } from './Input';
import { inputBaseArgTypes } from '@/constants/storybook/input';

const InteractiveInput = (args: DialInputProps) => {
  const [value, setValue] = useState(args.value || '');

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
  title: 'DIAL/Elements/Inputs/Input',
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
  },
  args: {
    id: 'story-input',
    type: 'text',
    placeholder: 'Placeholder',
    disabled: false,
    invalid: false,
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

export const Filled: Story = {
  args: {
    placeholder: 'Enter text...',
    value: 'Sample text',
  },
};

export const IconBefore: Story = {
  args: {
    placeholder: 'Search...',
    iconBefore: <IconSearch size={20} />,
  },
};

export const IconAfter: Story = {
  args: {
    placeholder: 'Password',
    type: 'password',
    iconAfter: <IconEye size={20} />,
  },
};

export const BothIcons: Story = {
  args: {
    placeholder: 'Search...',
    iconBefore: <IconSearch size={20} />,
    iconAfter: <IconEye size={20} />,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disable input',
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    placeholder: 'Invalid input',
    value: 'Invalid value',
    invalid: true,
  },
};

export const MaxView: Story = {
  render: () => {
    const props: DialInputProps = {
      placeholder: 'Placeholder',
      iconBefore: <IconSearch size={20} />,
      postfix: 'postfix',
      prefix: 'prefix',
      caption: 'Caption text',
      iconAfter: <IconEye size={20} />,
      inputButtonProps: {
        icon: <IconSearch size={20} />,
        onClick: () => alert('Input button clicked'),
      },
    };

    return (
      <div className="flex flex-col h-full w-full items-center">
        <h2 className="text-primary font-semibold mb-8">Inputs</h2>

        <div className="flex-1 min-h-0 flex flex-col gap-y-6">
          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Default
            </div>
            <InteractiveInput id="default-input" {...props} />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Filled
            </div>
            <InteractiveInput id="field-input" value="Text" {...props} />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Error
            </div>
            <InteractiveInput
              id="error-input"
              invalid={true}
              value="Text"
              error="Error message"
              {...props}
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Disabled filled
            </div>
            <InteractiveInput
              id="disable-input"
              disabled={true}
              value="Text"
              {...props}
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Disabled empty
            </div>
            <InteractiveInput id="disable-input" disabled={true} {...props} />
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
              iconBefore={<IconSearch size={20} />}
              iconAfter={<IconEye size={20} />}
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
              iconBefore={<IconSearch size={20} />}
              iconAfter={<IconEye size={20} />}
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
              iconBefore={<IconSearch size={20} />}
              iconAfter={<IconEye size={20} />}
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
              iconBefore={<IconSearch size={20} />}
              iconAfter={<IconEye size={20} />}
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
              iconBefore={<IconSearch size={20} />}
              iconAfter={<IconEye size={20} />}
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Disabled filled
            </div>
            <InteractiveInput
              id="disable-input"
              placeholder="Placeholder"
              disabled={true}
              value="Text"
              iconBefore={<IconSearch size={20} />}
              iconAfter={<IconEye size={20} />}
            />
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="text-primary font-semibold mb-2 w-[150px]">
              Disabled empty
            </div>
            <InteractiveInput
              id="disable-input"
              placeholder="Placeholder"
              disabled={true}
              iconBefore={<IconSearch size={20} />}
              iconAfter={<IconEye size={20} />}
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
