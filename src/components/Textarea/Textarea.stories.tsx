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
  title: 'Form/Textarea',
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

export const WithValue: Story = {
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
  },
};

export const AllVariants: Story = {
  args: {
    id: 'all-variants-textarea',
    placeholder: 'Enter your text here...',
  },
  render: () => (
    <div className="min-w-[800px] p-8">
      <div className="grid grid-cols-3 gap-6">
        {/* Default State */}
        <div>
          <div className="text-primary font-semibold mb-2">Default</div>
          <InteractiveTextarea
            id="default-textarea"
            placeholder="Enter your text here..."
          />
        </div>

        {/* Hover State */}
        <div>
          <div className="text-primary font-semibold mb-2">Hover</div>
          <InteractiveTextarea
            id="hover-textarea"
            className="dial-textarea-for-hover"
            placeholder="Enter your text here..."
          />
        </div>

        {/* Field State (with value) */}
        <div>
          <div className="text-primary font-semibold mb-2">Field</div>
          <InteractiveTextarea
            id="field-textarea"
            placeholder="Enter your text here..."
            value="This is some text in the textarea"
          />
        </div>

        {/* Field Hover State */}
        <div>
          <div className="text-primary font-semibold mb-2">Field hover</div>
          <InteractiveTextarea
            id="field-hover-textarea"
            placeholder="Enter your text here..."
            className="dial-textarea-for-hover"
            value="This is some text in the textarea"
          />
        </div>

        {/* Focus State */}
        <div>
          <div className="text-primary font-semibold mb-2">Focus</div>
          <InteractiveTextarea
            id="focus-textarea"
            className="dial-textarea-for-focus"
            placeholder="Enter your text here..."
          />
        </div>

        {/* Error State */}
        <div>
          <div className="text-primary font-semibold mb-2">Error</div>
          <InteractiveTextarea
            id="error-textarea"
            placeholder="Enter your text here..."
            invalid={true}
            value="This text has validation errors"
          />
        </div>

        {/* Disabled State */}
        <div>
          <div className="text-primary font-semibold mb-2">Disabled</div>
          <InteractiveTextarea
            id="disabled-textarea"
            placeholder="This textarea is disabled"
            disabled={true}
            value="This textarea is disabled"
          />
        </div>

        {/* Read-only State */}
        <div>
          <div className="text-primary font-semibold mb-2">Read-only</div>
          <InteractiveTextarea
            id="readonly-textarea"
            placeholder="This textarea is read-only"
            value="This textarea is read-only"
            readOnly={true}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    pseudo: {
      hover: ['.dial-textarea-for-hover'],
      focus: ['.dial-textarea-for-focus'],
    },
  },
};
