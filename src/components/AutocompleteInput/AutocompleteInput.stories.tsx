import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  DialAutocompleteInput,
  type DialAutocompleteInputProps,
} from './AutocompleteInput';

const InteractiveAutocomplete = (args: DialAutocompleteInputProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(
    args.selectedItems || [],
  );

  return (
    <div className="text-primary">
      <DialAutocompleteInput
        {...args}
        selectedItems={selectedItems}
        updateSelected={setSelectedItems}
      />
    </div>
  );
};

const meta: Meta<typeof DialAutocompleteInput> = {
  title: 'Components/AutocompleteInput',
  component: DialAutocompleteInput,
  tags: ['autocomplete', 'input'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An autocomplete-style input that lets users enter text and press Enter to add items. Supports deletion with Backspace when input is empty. Displays selected items as removable badges with tooltips.',
      },
    },
  },
  argTypes: {
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text shown when no items are selected',
    },
    selectedItems: {
      control: { type: 'object' },
      description: 'Array of currently selected items',
    },
    updateSelected: {
      action: 'updateSelected',
      control: false,
      description: 'Callback triggered when selected items change',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveAutocomplete,
  args: {
    placeholder: 'Type and press Enter...',
    selectedItems: [],
  },
};

export const WithInitialItems: Story = {
  render: InteractiveAutocomplete,
  args: {
    placeholder: 'Add more tags...',
    selectedItems: ['React', 'TypeScript', 'Storybook'],
  },
};

export const CustomPlaceholder: Story = {
  render: InteractiveAutocomplete,
  args: {
    placeholder: 'Add skills...',
    selectedItems: [],
  },
};

export const LongItems: Story = {
  render: InteractiveAutocomplete,
  args: {
    placeholder: 'Add tags...',
    selectedItems: [
      'This is a very long tag that will be truncated',
      'Another long one with more words',
    ],
  },
};

export const AllVariants: Story = {
  render: () => {
    const variants: { label: string; args: DialAutocompleteInputProps }[] = [
      {
        label: 'Empty',
        args: {
          placeholder: 'Type and press Enter...',
          updateSelected: (items) => items,
        },
      },
      {
        label: 'With Items',
        args: {
          placeholder: 'Add more...',
          selectedItems: ['React', 'Next.js', 'Tailwind'],
          updateSelected: (items) => items,
        },
      },
      {
        label: 'Long Items',
        args: {
          placeholder: 'Tags...',
          selectedItems: [
            'Supercalifragilisticexpialidocious',
            'ExtremelyLongWordWithoutSpaces',
          ],
          updateSelected: (items) => items,
        },
      },
    ];

    return (
      <div className="text-primary flex flex-col gap-8 min-w-[400px]">
        {variants.map(({ label, args }) => (
          <div key={label}>
            <div className="text-lg font-semibold mb-2">{label}</div>
            <InteractiveAutocomplete {...args} />
          </div>
        ))}
      </div>
    );
  },
};
