import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialTextarea, type DialTextareaProps } from './Textarea';

const InteractiveTextarea = (args: DialTextareaProps) => {
  const [value, setValue] = useState(args.value || '');

  return (
    <div className="w-full text-primary">
      <DialTextarea
        {...args}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </div>
  );
};

const meta = {
  title: 'DIAL/Elements/Textarea',
  component: DialTextarea,
  tags: ['textarea'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible textarea component with validation support and consistent styling. Perfect for multi-line text input with error handling and disabled states.',
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the textarea element',
    },
    value: {
      control: 'text',
      description: 'The current value of the textarea',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when textarea is empty',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the textarea has validation errors',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the textarea',
    },
    onChange: {
      action: 'changed',
      control: false,
      description: 'Callback function called when the textarea value changes',
    },
  },
} satisfies Meta<typeof DialTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveTextarea,
  args: {
    id: 'default-textarea',
    placeholder: 'Enter your text here...',
  },
};

export const Filled: Story = {
  render: InteractiveTextarea,
  args: {
    id: 'textarea-with-value',
    placeholder: 'Enter your text here...',
    value: 'This is some default text in the textarea',
  },
};

export const Disabled: Story = {
  render: InteractiveTextarea,
  args: {
    id: 'disabled-textarea',
    placeholder: 'This textarea is disabled',
    value: 'This textarea is disabled and cannot be edited',
    disabled: true,
  },
};

export const Invalid: Story = {
  render: InteractiveTextarea,
  args: {
    id: 'invalid-textarea',
    placeholder: 'Enter valid text...',
    value: 'This text has validation errors',
    invalid: true,
    errorText: 'This field is required and must be valid.',
  },
};

export const Resize: Story = {
  render: InteractiveTextarea,
  args: {
    id: 'resize-textarea',
    placeholder: 'Enter text...',
    value: 'This textarea can be resized',
    resize: true,
  },
};

export const AllVariants: Story = {
  render: () => {
    const props = {
      labelProps: { label: 'Label', required: true },
      id: 'interactive-textarea',
      placeholder: 'Enter your text here...',
      caption:
        'This is a caption text providing additional information about the textarea.',
    };
    return (
      <div className="flex flex-col h-full w-full items-center">
        <h2 className="text-primary font-semibold mb-8">Textarea</h2>

        <div className="flex-1 min-h-0 flex flex-col gap-y-6">
          <div className="flex flex-row items-center gap-x-6">
            <div className="flex flex-row items-center gap-x-6">
              <div className="text-primary font-semibold mb-2 w-[150px]">
                Default
              </div>
              <InteractiveTextarea {...props} />
            </div>

            <div className="flex flex-row items-center gap-x-6">
              <div className="text-primary font-semibold mb-2 w-[150px]">
                Filled
              </div>
              <InteractiveTextarea {...props} value="Text" />
            </div>
          </div>
          <div className="flex flex-row items-center gap-x-6">
            <div className="flex flex-row items-center gap-x-6">
              <div className="text-primary font-semibold mb-2 w-[150px]">
                Hover
              </div>
              <InteractiveTextarea
                {...props}
                className="dial-input-for-hover"
              />
            </div>

            <div className="flex flex-row items-center gap-x-6">
              <div className="text-primary font-semibold mb-2 w-[150px]">
                Focus/Active
              </div>
              <InteractiveTextarea
                {...props}
                className="dial-input-for-focus"
              />
            </div>
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <div className="flex flex-row items-center gap-x-6">
              <div className="text-primary font-semibold mb-2 w-[150px]">
                Disabled filled
              </div>
              <InteractiveTextarea {...props} disabled={true} value="Text" />
            </div>

            <div className="flex flex-row items-center gap-x-6">
              <div className="text-primary font-semibold mb-2 w-[150px]">
                Disabled empty
              </div>
              <InteractiveTextarea {...props} disabled={true} />
            </div>
          </div>
          <div className="flex flex-row items-center gap-x-6">
            <div className="flex flex-row items-center gap-x-6">
              <div className="text-primary font-semibold mb-2 w-[150px]">
                Error
              </div>
              <InteractiveTextarea
                {...props}
                invalid={true}
                value="Text"
                errorText="Error message"
              />
            </div>

            <div className="flex flex-row items-center gap-x-6">
              <div className="text-primary font-semibold mb-2 w-[150px]">
                Error without message
              </div>
              <InteractiveTextarea {...props} invalid={true} value="Text" />
            </div>
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
