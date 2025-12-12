import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type FC } from 'react';
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
          'A flexible search input with customizable placeholder, icons, and clear functionality. Supports multiple sizes and blur events.',
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
    readonly: {
      control: 'boolean',
      description: 'Whether the search is read-only',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the search should be styled as invalid',
    },
    allowClear: {
      control: 'boolean',
      description: 'Whether to show a clear button when there is a value',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    onChange: {
      action: 'changed',
      control: false,
      description: 'Callback called when the input value changes',
    },
    onBlur: {
      action: 'blurred',
      control: false,
      description: 'Callback called when the input loses focus',
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

export const ReadOnly: Story = {
  render: InteractiveSearch,
  args: {
    elementId: 'search-readonly',
    placeholder: 'Search',
    value: 'Read-only value',
    size: SearchSize.Base,
    readonly: true,
  },
};

export const Invalid: Story = {
  render: InteractiveSearch,
  args: {
    elementId: 'search-invalid',
    placeholder: 'Search',
    value: 'Invalid input',
    size: SearchSize.Base,
    invalid: true,
  },
};

export const WithoutClearButton: Story = {
  render: InteractiveSearch,
  args: {
    elementId: 'search-no-clear',
    placeholder: 'Search',
    value: 'Cannot clear me',
    size: SearchSize.Base,
    allowClear: false,
  },
};

const WithBlurHandlerComponent: FC = () => {
  const [value, setValue] = useState('');
  const [blurCount, setBlurCount] = useState(0);

  return (
    <div className="flex flex-col gap-4 min-w-[400px]">
      <DialSearch
        elementId="search-with-blur"
        placeholder="Type and click outside"
        value={value}
        onChange={setValue}
        onBlur={() => setBlurCount((prev) => prev + 1)}
        size={SearchSize.Base}
      />
      <div className="dial-small text-secondary">
        Blur event triggered: <strong>{blurCount} times</strong>
      </div>
    </div>
  );
};

export const WithBlurHandler: Story = {
  render: () => <WithBlurHandlerComponent />,
};

const AllVariantsComponent: FC = () => {
  const sizes = [SearchSize.Small, SearchSize.Base] as const;
  const states = [
    { label: 'Default', props: {} },
    { label: 'Filled', props: { value: 'Hello world' } },
    { label: 'Disabled', props: { disabled: true } },
    { label: 'Read-only', props: { readonly: true, value: 'Read-only' } },
    { label: 'Invalid', props: { invalid: true, value: 'Invalid' } },
  ];

  return (
    <div className="min-w-[600px] flex flex-col gap-8">
      {sizes.map((size) => (
        <div key={size}>
          <div className="text-primary font-semibold mb-4 capitalize">
            Size: {size}
          </div>
          <div className="flex flex-col gap-4">
            {states.map(({ label, props }) => (
              <div key={label}>
                <div className="dial-small text-secondary mb-1">{label}</div>
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
};

export const AllVariants: Story = {
  render: () => <AllVariantsComponent />,
};
