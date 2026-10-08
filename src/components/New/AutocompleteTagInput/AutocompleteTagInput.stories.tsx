import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { ElementSize } from '@/types/size';
import {
  AutocompleteTagInput,
  type AutocompleteTagInputProps,
  type AutocompleteTagInputSuggestion,
} from './AutocompleteTagInput';

const mimeSuggestions: AutocompleteTagInputSuggestion[] = [
  ['GIF', 'image/gif'],
  ['PNG', 'image/png'],
  ['JPG', 'image/jpeg'],
  ['TIFF', 'image/tiff'],
  ['JSON', 'application/json'],
  ['CSV', 'text/csv'],
  ['MARKDOWN', 'text/markdown'],
  ['PLAIN-TEXT', 'text/plain'],
  ['PDF', 'application/pdf'],
  ['SVG', 'image/svg+xml'],
  ['WEBP', 'image/webp'],
  [
    'DOCX',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  ['XLSX', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
].map(([label, value]) => ({ label, value, description: value }));

const InteractiveAutocompleteTagInput = (args: AutocompleteTagInputProps) => {
  const [tags, setTags] = useState<string[]>(
    args.value ?? args.defaultValue ?? [],
  );

  return (
    <div className="w-[420px]">
      <AutocompleteTagInput {...args} value={tags} onChange={setTags} />
    </div>
  );
};

const meta = {
  title: 'Components_2_0/AutocompleteTagInput',
  component: AutocompleteTagInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A tag input that suggests values while typing and also accepts its own. Typing lists the matching suggestions; Enter or comma adds the highlighted one, or the typed text when nothing matches. The arrow keys move the highlight, Escape closes the list, and Backspace on an empty input removes the last tag. Built on the 2.0 `Input`, so it shares its sizes, label, caption and error states.',
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
    suggestions: {
      control: false,
      description:
        'Values offered while typing: `{ value, label, description? }`',
    },
    getRemoveTagLabel: {
      control: false,
      description:
        "Accessible name of a tag's remove button, given the tag; defaults to `Remove <tag>`",
    },
    maxSuggestions: {
      control: 'number',
      description: 'How many matching suggestions the list shows at most',
    },
    openOnFocus: {
      control: 'boolean',
      description:
        'Opens the full list of suggestions that are not yet tags on focus or click, and keeps it open after a pick',
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
    onChange: {
      action: 'changed',
      control: false,
      description:
        'Called with the new list whenever a tag is added or removed',
    },
  },
} satisfies Meta<typeof AutocompleteTagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseArgs = {
  labelProps: { label: 'Attachment types' },
  placeholder: 'Enter attachment types',
  caption:
    'Choose from suggested MIME types or add a new one using <type>/<subtype>.',
  suggestions: mimeSuggestions,
};

export const Default: Story = {
  render: InteractiveAutocompleteTagInput,
  args: { ...baseArgs, id: 'default-autocomplete-tag-input' },
};

export const WithTags: Story = {
  render: InteractiveAutocompleteTagInput,
  args: {
    ...baseArgs,
    id: 'with-tags-autocomplete-tag-input',
    defaultValue: ['application/pdf', 'image/png', 'audio/mpeg'],
  },
};

export const OpenOnFocus: Story = {
  render: InteractiveAutocompleteTagInput,
  args: {
    ...baseArgs,
    id: 'open-on-focus-autocomplete-tag-input',
    defaultValue: ['text/markdown'],
    openOnFocus: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Focusing or clicking the field lists every suggestion that is not yet a tag, with nothing highlighted, so Enter adds nothing by itself. The list stays open after a pick; typing filters it.',
      },
    },
  },
};

export const Required: Story = {
  render: InteractiveAutocompleteTagInput,
  args: {
    ...baseArgs,
    id: 'required-autocomplete-tag-input',
    labelProps: { label: 'Attachment types', required: true },
  },
};

export const Small: Story = {
  render: InteractiveAutocompleteTagInput,
  args: {
    ...baseArgs,
    id: 'small-autocomplete-tag-input',
    size: ElementSize.Small,
    defaultValue: ['application/pdf'],
  },
};

export const Invalid: Story = {
  render: InteractiveAutocompleteTagInput,
  args: {
    ...baseArgs,
    id: 'invalid-autocomplete-tag-input',
    labelProps: { label: 'Attachment types', required: true },
    invalid: true,
    error: 'Select at least one attachment type',
  },
};

export const Disabled: Story = {
  render: InteractiveAutocompleteTagInput,
  args: {
    ...baseArgs,
    id: 'disabled-autocomplete-tag-input',
    defaultValue: ['application/pdf', 'image/png'],
    disabled: true,
  },
};

export const ReadOnly: Story = {
  render: InteractiveAutocompleteTagInput,
  args: {
    ...baseArgs,
    id: 'read-only-autocomplete-tag-input',
    defaultValue: ['application/pdf', 'image/png'],
    readOnly: true,
  },
};

export const Wrapping: Story = {
  render: InteractiveAutocompleteTagInput,
  args: {
    ...baseArgs,
    id: 'wrapping-autocomplete-tag-input',
    defaultValue: [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'text/markdown',
      'application/json',
      'text/csv',
    ],
  },
};

export const WithoutLabel: Story = {
  render: InteractiveAutocompleteTagInput,
  args: {
    ...baseArgs,
    labelProps: undefined,
    id: 'unlabelled-autocomplete-tag-input',
    ariaLabel: 'Attachment types',
  },
};
