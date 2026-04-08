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
    label: {
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
    collapseTagOverflow: {
      control: 'boolean',
      description:
        'Single-line tags with a +N chip when they do not fit the field width',
    },
    readOnly: {
      control: 'boolean',
      description:
        'Hides the text input so no new tags can be added. The outer label/caption wrapper is also omitted, making the component embeddable inside an existing container.',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveTagInput,
  args: {
    elementId: 'tag-input-default',
    label: 'Tags',
    placeholder: 'Enter values, separated by commas',
    initialTags: [],
  },
};

export const WithInitialTags: Story = {
  render: InteractiveTagInput,
  args: {
    elementId: 'tag-input-initial',
    label: 'Technologies',
    placeholder: 'Add a tag...',
    initialTags: ['React', 'TypeScript', 'Storybook'],
  },
};

export const OptionalField: Story = {
  render: InteractiveTagInput,
  args: {
    elementId: 'tag-input-optional',
    label: 'Skills',
    placeholder: 'Add a skill...',
    required: true,
    initialTags: ['UI Design'],
  },
};

export const WithError: Story = {
  render: InteractiveTagInput,
  args: {
    elementId: 'tag-input-error',
    label: 'Required Tags',
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
    label: 'Tags (Disabled)',
    placeholder: 'Cannot add tags',
    disabled: true,
    initialTags: ['React', 'Next.js'],
  },
};

export const CollapsedOverflow: Story = {
  render: InteractiveTagInput,
  args: {
    elementId: 'tag-input-collapsed',
    label: 'Tags (single line)',
    placeholder: 'Add more…',
    collapseTagOverflow: true,
    initialTags: [
      'React',
      'TypeScript',
      'Storybook',
      'Tailwind',
      'Vite',
      'Vitest',
    ],
  },
};

export const ReadOnly: Story = {
  render: InteractiveTagInput,
  args: {
    readOnly: true,
    initialTags: ['React', 'TypeScript', 'Storybook'],
  },
};

export const ReadOnlyCollapsedOverflow: Story = {
  render: InteractiveTagInput,
  args: {
    readOnly: true,
    collapseTagOverflow: true,
    initialTags: [
      'React',
      'TypeScript',
      'Storybook',
      'Tailwind',
      'Vite',
      'Vitest',
    ],
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-5 w-[450px] text-primary">
      <div>
        <h4 className="text-lg font-semibold mb-2">Default</h4>
        <InteractiveTagInput
          elementId="tag-input-default"
          label="Tags"
          placeholder="Add tags..."
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">With Initial Tags</h4>
        <InteractiveTagInput
          elementId="tag-input-initial"
          label="Technologies"
          initialTags={['React', 'TypeScript']}
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">Optional Field</h4>
        <InteractiveTagInput
          elementId="tag-input-optional"
          label="Skills"
          required
          initialTags={['Design']}
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">With Error</h4>
        <InteractiveTagInput
          elementId="tag-input-error"
          label="Tags"
          invalid
          errorText="You must add at least one tag"
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">Disabled</h4>
        <InteractiveTagInput
          elementId="tag-input-disabled"
          label="Tags"
          disabled
          initialTags={['React']}
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">Read Only (embedded)</h4>
        <InteractiveTagInput
          readOnly
          initialTags={['React', 'TypeScript', 'Storybook']}
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">
          Read Only + Collapsed overflow
        </h4>
        <InteractiveTagInput
          readOnly
          collapseTagOverflow
          initialTags={[
            'React',
            'TypeScript',
            'Storybook',
            'Tailwind',
            'Vite',
            'Vitest',
          ]}
        />
      </div>
    </div>
  ),
};
