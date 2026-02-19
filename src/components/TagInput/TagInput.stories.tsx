import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialTagInput, type DialTagInputProps } from './TagInput';

const InteractiveTagInput = (args: DialTagInputProps) => {
  const [tags, setTags] = useState<string[]>(args.initialTags || []);

  return (
    <div className="bg-gray-50 rounded-md w-[400px]">
      <DialTagInput
        {...args}
        initialTags={tags}
        onChange={(newTags) => setTags(newTags)}
      />
    </div>
  );
};

const meta: Meta<typeof DialTagInput> = {
  title: 'Form/TagInput',
  component: DialTagInput,
  tags: ['form', 'input', 'tags'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A tag input field that allows users to add multiple tags using the Enter or comma key. Supports removing tags, displaying field labels, optional indicators, and validation states.',
      },
    },
  },
  argTypes: {
    elementId: {
      control: { type: 'text' },
      description: 'Unique ID for the input element',
    },
    fieldLabel: {
      control: { type: 'text' },
      description: 'Label displayed above the input field',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text displayed inside the input field',
    },
    initialTags: {
      control: { type: 'object' },
      description: 'Initial array of tags displayed when component loads',
    },
    required: {
      control: 'boolean',
      description: 'Displays an “Optional” indicator next to the field label',
    },
    invalid: {
      control: 'boolean',
      description: 'Marks the input as invalid (red border)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input, preventing new tags from being added',
    },
    errorText: {
      control: { type: 'text' },
      description: 'Error message displayed below the input',
    },
    onChange: {
      action: 'changed',
      control: false,
      description: 'Callback fired when the tag list changes',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveTagInput,
  args: {
    elementId: 'tag-input-default',
    fieldLabel: 'Tags',
    placeholder: 'Enter values, separated by commas',
    initialTags: [],
  },
};

export const WithInitialTags: Story = {
  render: InteractiveTagInput,
  args: {
    elementId: 'tag-input-initial',
    fieldLabel: 'Technologies',
    placeholder: 'Add a tag...',
    initialTags: ['React', 'TypeScript', 'Storybook'],
  },
};

export const OptionalField: Story = {
  render: InteractiveTagInput,
  args: {
    elementId: 'tag-input-optional',
    fieldLabel: 'Skills',
    placeholder: 'Add a skill...',
    required: true,
    initialTags: ['UI Design'],
  },
};

export const WithError: Story = {
  render: InteractiveTagInput,
  args: {
    elementId: 'tag-input-error',
    fieldLabel: 'Required Tags',
    placeholder: 'Add tags...',
    invalid: true,
    errorText: 'At least one tag is required',
    initialTags: [],
  },
};

export const Disabled: Story = {
  render: InteractiveTagInput,
  args: {
    elementId: 'tag-input-disabled',
    fieldLabel: 'Tags (Disabled)',
    placeholder: 'Cannot add tags',
    disabled: true,
    initialTags: ['React', 'Next.js'],
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-5 w-[450px] text-primary">
      <div>
        <h4 className="text-lg font-semibold mb-2">Default</h4>
        <InteractiveTagInput
          elementId="tag-input-default"
          fieldLabel="Tags"
          placeholder="Add tags..."
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">With Initial Tags</h4>
        <InteractiveTagInput
          elementId="tag-input-initial"
          fieldLabel="Technologies"
          initialTags={['React', 'TypeScript']}
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">Optional Field</h4>
        <InteractiveTagInput
          elementId="tag-input-optional"
          fieldLabel="Skills"
          required
          initialTags={['Design']}
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">With Error</h4>
        <InteractiveTagInput
          elementId="tag-input-error"
          fieldLabel="Tags"
          invalid
          errorText="You must add at least one tag"
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">Disabled</h4>
        <InteractiveTagInput
          elementId="tag-input-disabled"
          fieldLabel="Tags"
          disabled
          initialTags={['React']}
        />
      </div>
    </div>
  ),
};
