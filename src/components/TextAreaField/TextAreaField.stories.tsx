import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import {
  type DialTextAreaFieldProps,
  DialTextAreaField,
} from './TextAreaField';

const InteractiveTextAreaField = (
  args: DialTextAreaFieldProps & {
    divClassName?: string;
    additionalElements?: ReactNode;
  },
) => {
  const [value, setValue] = useState(args.value || '');
  const { divClassName, additionalElements, ...rest } = args;

  return (
    <div className={divClassName ? divClassName : 'w-full text-primary'}>
      {additionalElements}
      <DialTextAreaField
        {...rest}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </div>
  );
};

const meta = {
  title: 'Form/TextAreaField',
  component: DialTextAreaField,
  tags: ['textarea', 'field'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A complete textarea field component that combines a field label, textarea input, and error text with consistent styling and validation support. Perfect for forms requiring multi-line text input.',
      },
    },
  },
  argTypes: {
    fieldLabel: {
      control: 'text',
      description: 'The label text for the field',
    },
    elementId: {
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
    optional: {
      control: 'boolean',
      description: 'Whether to show optional indicator next to the label',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the textarea has validation errors',
    },
    errorText: {
      control: 'text',
      description: 'Error message to display below the textarea',
    },
    elementClassName: {
      control: 'text',
      description: 'Additional CSS classes to apply to the textarea element',
    },
    onChange: {
      action: 'changed',
      control: false,
      description: 'Callback function called when the textarea value changes',
    },
  },
} satisfies Meta<typeof DialTextAreaField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveTextAreaField,
  args: {
    fieldLabel: 'Description',
    elementId: 'default-textarea-field',
    placeholder: 'Enter your description here...',
  },
};

export const WithValue: Story = {
  render: InteractiveTextAreaField,
  args: {
    fieldLabel: 'Comments',
    elementId: 'textarea-field-with-value',
    placeholder: 'Enter your comments...',
    value: 'This is some default text in the textarea field',
  },
};

export const Optional: Story = {
  render: InteractiveTextAreaField,
  args: {
    fieldLabel: 'Additional Notes',
    elementId: 'optional-textarea-field',
    placeholder: 'Enter additional notes (optional)...',
    optional: true,
  },
};

export const WithError: Story = {
  render: InteractiveTextAreaField,
  args: {
    fieldLabel: 'Message',
    elementId: 'error-textarea-field',
    placeholder: 'Enter your message...',
    value: 'This text has validation errors',
    invalid: true,
    errorText: 'This field is required and must contain at least 10 characters',
  },
};

export const Disabled: Story = {
  render: InteractiveTextAreaField,
  args: {
    fieldLabel: 'Read-only Information',
    elementId: 'disabled-textarea-field',
    placeholder: 'This field is disabled',
    value: 'This textarea field is disabled and cannot be edited',
    disabled: true,
  },
};

export const FullParentHeightWithScroll = {
  render: InteractiveTextAreaField,
  parameters: {
    docs: {
      description: {
        story:
          'A story demonstrating a textarea field that fills the remaining height of its parent container, has scrolling, has disabled tooltip.',
      },
    },
  },
  args: {
    fieldLabel: 'Detailed Description',
    elementId: 'full-height-textarea-field',
    placeholder: 'Enter a detailed description...',
    value: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  `,
    divClassName: 'h-[200px] w-[300px] flex flex-col gap-4 bg-layer-1 p-2',
    containerClassName: 'flex-1',
    elementContainerClassName: 'flex-1',
    disableTooltip: true,
    additionalElements: (
      <div className="text-primary">
        Some text that is not part of the textarea field
      </div>
    ),
  },
};

export const AllVariants: Story = {
  args: {
    fieldLabel: 'Description',
    elementId: 'all-variants-textarea-field',
    placeholder: 'Enter your description here...',
  },
  render: () => (
    <div className="min-w-[800px] p-8">
      <div className="grid grid-cols-3 gap-6">
        {/* Default State */}
        <div>
          <div className="text-primary font-semibold mb-2">Default</div>
          <InteractiveTextAreaField
            fieldLabel="Description"
            elementId="default-textarea-field"
            placeholder="Enter your description here..."
          />
        </div>

        {/* Hover State */}
        <div>
          <div className="text-primary font-semibold mb-2">Hover</div>
          <InteractiveTextAreaField
            fieldLabel="Description"
            elementId="hover-textarea-field"
            placeholder="Enter your description here..."
            elementClassName="dial-textarea-field-for-hover"
          />
        </div>

        {/* Field State (with value) */}
        <div>
          <div className="text-primary font-semibold mb-2">Field</div>
          <InteractiveTextAreaField
            fieldLabel="Description"
            elementId="field-textarea-field"
            placeholder="Enter your description here..."
            value="This is some text in the textarea field"
          />
        </div>

        {/* Field Hover State */}
        <div>
          <div className="text-primary font-semibold mb-2">Field hover</div>
          <InteractiveTextAreaField
            fieldLabel="Description"
            elementId="field-hover-textarea-field"
            placeholder="Enter your description here..."
            elementClassName="dial-textarea-field-for-hover"
            value="This is some text in the textarea field"
          />
        </div>

        {/* Focus State */}
        <div>
          <div className="text-primary font-semibold mb-2">Focus</div>
          <InteractiveTextAreaField
            fieldLabel="Description"
            elementId="focus-textarea-field"
            placeholder="Enter your description here..."
            elementClassName="dial-textarea-field-for-focus"
          />
        </div>

        {/* Optional State */}
        <div>
          <div className="text-primary font-semibold mb-2">Optional</div>
          <InteractiveTextAreaField
            fieldLabel="Additional Notes"
            elementId="optional-textarea-field"
            placeholder="Enter additional notes (optional)..."
            optional={true}
          />
        </div>

        {/* Error State */}
        <div>
          <div className="text-primary font-semibold mb-2">Error</div>
          <InteractiveTextAreaField
            fieldLabel="Message"
            elementId="error-textarea-field"
            placeholder="Enter your message..."
            invalid={true}
            value="This text has validation errors"
            errorText="This field is required and must contain at least 10 characters"
          />
        </div>

        {/* Disabled State */}
        <div>
          <div className="text-primary font-semibold mb-2">Disabled</div>
          <InteractiveTextAreaField
            fieldLabel="Read-only Information"
            elementId="disabled-textarea-field"
            placeholder="This field is disabled"
            disabled={true}
            value="This textarea field is disabled"
          />
        </div>

        {/* Read-only State */}
        <div>
          <div className="text-primary font-semibold mb-2">Read-only</div>
          <InteractiveTextAreaField
            fieldLabel="Static Content"
            elementId="readonly-textarea-field"
            placeholder="This field is read-only"
            value="This textarea field is read-only"
            readonly={true}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    pseudo: {
      hover: ['.dial-textarea-field-for-hover'],
      focus: ['.dial-textarea-field-for-focus'],
    },
  },
};
