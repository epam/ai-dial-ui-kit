import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialSearch } from './Search';
import type { DialInputProps } from '@/components/Input/Input';

const InteractiveSearch = (args: DialInputProps) => {
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
          'An input component with a customizable placeholder, icons, flexible props, and the ability to clear the input value via a clear button.',
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
    containerCssClass: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the container',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the search is disabled',
    },
    onChange: {
      action: 'changed',
      control: false,
      description: 'Callback function called when the search value changes',
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
  },
};

export const Filled: Story = {
  render: InteractiveSearch,
  args: {
    elementId: 'search-filled',
    placeholder: 'Search',
    value: 'What is it?',
  },
};

export const Disabled: Story = {
  render: InteractiveSearch,
  args: {
    elementId: 'search-disabled',
    placeholder: 'Search',
    value: '',
    disabled: true,
  },
};

export const AllVariants: Story = {
  args: {
    elementId: 'search-all-variants',
  },
  render: () => (
    <div className="min-w-[600px] flex flex-col gap-6">
      {/* Default State */}
      <div>
        <div className="text-primary font-semibold mb-2">Default</div>
        <InteractiveSearch elementId="search" placeholder="Search" />
      </div>

      {/* Filled State  */}
      <div>
        <div className="text-primary font-semibold mb-2">Filled</div>
        <InteractiveSearch
          elementId="search-filled"
          placeholder="Search"
          value="What is it?"
        />
      </div>

      {/* Disabled State */}
      <div>
        <div className="text-primary font-semibold mb-2">Disabled</div>
        <InteractiveSearch
          elementId="search-disabled"
          placeholder="Search"
          disabled={true}
        />
      </div>
    </div>
  ),
};
