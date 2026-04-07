import { ElementSize } from '@/types/size';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type FC } from 'react';
import { DialSearch, type DialSearchProps } from './Search';

const InteractiveSearch = (args: DialSearchProps) => {
  const [value, setValue] = useState(args.value || '');
  return (
    <DialSearch
      {...args}
      value={value}
      onChange={(newValue) => setValue(newValue || '')}
    />
  );
};

const meta: Meta<typeof DialSearch> = {
  title: 'DIAL/Elements/Search',
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
    id: {
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
    invalid: {
      control: 'boolean',
      description: 'Whether the search should be styled as invalid',
    },
    // onChange: {
    //   action: 'changed',
    //   control: false,
    //   description: 'Callback called when the input value changes',
    // },
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
    id: 'search',
    placeholder: 'Search',
    value: '',
    size: ElementSize.Standard,
  },
};

export const Small: Story = {
  render: InteractiveSearch,
  args: {
    id: 'search-small',
    placeholder: 'Search small',
    value: '',
    size: ElementSize.Small,
  },
};

export const Filled: Story = {
  render: InteractiveSearch,
  args: {
    id: 'search-filled',
    placeholder: 'Search',
    value: 'What is it?',
    size: ElementSize.Standard,
  },
};

export const Disabled: Story = {
  render: InteractiveSearch,
  args: {
    id: 'search-disabled',
    placeholder: 'Search',
    value: '',
    size: ElementSize.Standard,
    disabled: true,
  },
};

export const Invalid: Story = {
  render: InteractiveSearch,
  args: {
    id: 'search-invalid',
    placeholder: 'Search',
    value: 'Invalid input',
    size: ElementSize.Standard,
    invalid: true,
  },
};

const BlurHandlerComponent: FC = () => {
  const [value, setValue] = useState('');
  const [blurCount, setBlurCount] = useState(0);

  return (
    <div className="flex flex-col gap-4 min-w-[400px]">
      <DialSearch
        id="search-with-blur"
        placeholder="Type and click outside"
        value={value}
        onChange={(newValue) => setValue(newValue || '')}
        onBlur={() => setBlurCount((prev) => prev + 1)}
        size={ElementSize.Standard}
      />
      <div className="dial-small-text text-secondary">
        Blur event triggered: <strong>{blurCount} times</strong>
      </div>
    </div>
  );
};

export const WithBlurHandler: Story = {
  render: () => <BlurHandlerComponent />,
};

const AllVariantsComponent: FC = () => {
  const sizes = [ElementSize.Standard, ElementSize.Small] as const;
  const states = [
    { label: 'Default', props: {} },
    { label: 'Filled', props: { value: 'Hello world' } },
    { label: 'Disabled', props: { disabled: true } },
    {
      label: 'Disabled Filled',
      props: { disabled: true, value: 'Hello world' },
    },
  ];

  return (
    <div className="min-w-[600px] flex flex-row gap-8">
      {sizes.map((size) => (
        <div key={size}>
          <div className="text-primary font-semibold mb-4 capitalize">
            Size: {size}
          </div>
          <div className="flex flex-col gap-4">
            {states.map(({ label, props }) => (
              <div key={label}>
                <div className="dial-small-text text-secondary mb-1">
                  {label}
                </div>
                <InteractiveSearch
                  id={`search-${size}-${label.toLowerCase()}`}
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
