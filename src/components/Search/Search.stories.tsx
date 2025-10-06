import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialSearch, type DialSearchProps } from './Search';
import { SearchSize } from '@/types/search';

const InteractiveSearch = (args: DialSearchProps) => {
  const [value, setValue] = useState(args.value || '');
  return (
    <DialSearch
      {...args}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    />
  );
};

const meta: Meta<typeof DialSearch> = {
  title: 'Components/Search',
  component: DialSearch,
  tags: ['search'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible search input with customizable placeholder, icons, and clear functionality. Supports multiple sizes.',
      },
    },
  },
  argTypes: {
    elementId: {
      control: { type: 'text' },
      description: 'Unique identifier for the input element',
    },
    value: {
      control: { type: 'text' },
      description: 'Input value',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'base'],
      description: 'Size of the input field',
      table: {
        defaultValue: { summary: 'base' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the search is disabled',
    },
    onChange: {
      action: 'changed',
      control: false,
      description: 'Callback called when the input value changes',
    },
  },
} satisfies Meta<typeof DialSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveSearch,
  args: {
    elementId: 'search',
    placeholder: 'Search',
    value: '',
    size: SearchSize.Base,
  },
};

export const Small: Story = {
  render: InteractiveSearch,
  args: {
    elementId: 'search-small',
    placeholder: 'Search small',
    value: '',
    size: SearchSize.Small,
  },
};

export const Filled: Story = {
  render: InteractiveSearch,
  args: {
    elementId: 'search-filled',
    placeholder: 'Search',
    value: 'What is it?',
    size: SearchSize.Base,
  },
};

export const Disabled: Story = {
  render: InteractiveSearch,
  args: {
    elementId: 'search-disabled',
    placeholder: 'Search',
    value: '',
    size: SearchSize.Base,
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => {
    const sizes = [SearchSize.Small, SearchSize.Base] as const;
    const states = [
      { label: 'Default', props: {} },
      { label: 'Filled', props: { value: 'Hello world' } },
      { label: 'Disabled', props: { disabled: true } },
    ];

    return (
      <div className="min-w-[600px] flex flex-col gap-8">
        {sizes.map((size) => (
          <div key={size}>
            <div className="text-primary font-semibold text-lg mb-4 capitalize">
              Size: {size}
            </div>
            <div className="flex flex-col gap-4">
              {states.map(({ label, props }) => (
                <div key={label}>
                  <div className="text-sm text-secondary mb-1">{label}</div>
                  <InteractiveSearch
                    elementId={`search-${size}-${label.toLowerCase()}`}
                    placeholder={`Search ${label.toLowerCase()}`}
                    size={size}
                    {...props}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
