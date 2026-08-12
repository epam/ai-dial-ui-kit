import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { ElementSize } from '@/types/size';
import { TagInput, type TagInputProps } from './TagInput';

const InteractiveTagInput = (args: TagInputProps) => {
  const [tags, setTags] = useState<string[]>(args.value ?? args.defaultValue ?? []);

  return (
    <div className="w-[420px]">
      <TagInput {...args} value={tags} onChange={setTags} />
    </div>
  );
};

const meta = {
  title: 'Components_2_0/TagInput',
  component: TagInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A tag input from the 2.0 design system. Type a value and commit it with Enter or comma; Backspace on an empty input removes the last tag. Built on the 2.0 `Input`, so it shares its sizes, label, caption and error states.',
      },
    },
  },
  argTypes: {
    id: { control: 'text', description: 'The id of the text input' },
    value: { control: false, description: 'Controlled tag list' },
    defaultValue: {
      control: false,
      description: 'Initial tag list when uncontrolled',
    },
    size: {
      control: 'radio',
      options: [ElementSize.Small, ElementSize.Standard],
      description: 'Field height: standard is 40px, small is 24px',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder shown while there are no tags',
    },
    caption: { control: 'text', description: 'Helper text below the field' },
    error: { control: 'text', description: 'Error message below the field' },
    invalid: {
      control: 'boolean',
      description: "Applies the field's error styling",
    },
    disabled: {
      control: 'boolean',
      description: 'Disables typing and tag removal',
    },
    readOnly: {
      control: 'boolean',
      description: 'Shows the tags without allowing new ones or removal',
    },
    collapseTagOverflow: {
      control: 'boolean',
      description: 'Keep the tags on one line behind a `+N` chip',
    },
    onChange: {
      action: 'changed',
      control: false,
      description: 'Called with the new list whenever a tag is added or removed',
    },
  },
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveTagInput,
  args: {
    id: 'default-tag-input',
    labelProps: { label: 'Skills' },
    placeholder: 'Add a skill',
    caption: 'Press Enter or comma to add',
  },
};

export const WithTags: Story = {
  render: InteractiveTagInput,
  args: {
    id: 'with-tags-tag-input',
    labelProps: { label: 'Skills' },
    placeholder: 'Add a skill',
    defaultValue: ['React', 'TypeScript', 'Storybook'],
  },
};

export const Required: Story = {
  render: InteractiveTagInput,
  args: {
    id: 'required-tag-input',
    labelProps: { label: 'Skills', required: true },
    placeholder: 'Add a skill',
    defaultValue: ['React'],
  },
};

export const Small: Story = {
  render: InteractiveTagInput,
  args: {
    id: 'small-tag-input',
    size: ElementSize.Small,
    labelProps: { label: 'Skills' },
    placeholder: 'Add a skill',
    defaultValue: ['React', 'TypeScript'],
  },
};

export const Invalid: Story = {
  render: InteractiveTagInput,
  args: {
    id: 'invalid-tag-input',
    labelProps: { label: 'Skills' },
    placeholder: 'Add a skill',
    defaultValue: ['React'],
    invalid: true,
    error: 'Add at least three skills',
  },
};

export const Disabled: Story = {
  render: InteractiveTagInput,
  args: {
    id: 'disabled-tag-input',
    labelProps: { label: 'Skills' },
    defaultValue: ['React', 'TypeScript'],
    disabled: true,
  },
};

export const ReadOnly: Story = {
  render: InteractiveTagInput,
  args: {
    id: 'read-only-tag-input',
    labelProps: { label: 'Skills' },
    defaultValue: ['React', 'TypeScript'],
    readOnly: true,
  },
};

export const Wrapping: Story = {
  render: InteractiveTagInput,
  args: {
    id: 'wrapping-tag-input',
    labelProps: { label: 'Skills' },
    placeholder: 'Add a skill',
    defaultValue: [
      'React',
      'TypeScript',
      'Storybook',
      'Vitest',
      'Tailwind CSS',
      'Accessibility',
    ],
  },
};

export const CollapsedOverflow: Story = {
  render: InteractiveTagInput,
  args: {
    id: 'collapsed-tag-input',
    labelProps: { label: 'Skills' },
    placeholder: 'Add a skill',
    caption: 'The tags that do not fit collapse into a +N chip',
    collapseTagOverflow: true,
    defaultValue: [
      'React',
      'TypeScript',
      'Storybook',
      'Vitest',
      'Tailwind CSS',
      'Accessibility',
    ],
  },
};

export const WithoutLabel: Story = {
  render: InteractiveTagInput,
  args: {
    id: 'unlabelled-tag-input',
    ariaLabel: 'Skills',
    placeholder: 'Add a skill',
  },
};
