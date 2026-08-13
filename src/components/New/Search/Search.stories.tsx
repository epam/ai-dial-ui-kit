import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type FC } from 'react';

import { ElementSize } from '@/types/size';
import { Search, type SearchProps } from './Search';

const InteractiveSearch = (args: SearchProps) => {
  const [value, setValue] = useState(args.value as string | undefined);

  return <Search {...args} value={value} onChange={setValue} />;
};

const meta = {
  title: 'Components_2_0/Search',
  component: Search,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A search field from the 2.0 design system, built on `Input`. Controlled: it renders the `value` it is given and reports edits through `onChange`, which receives `undefined` for an empty field. The clear button shows only while there is something to clear and hands focus back to the input.',
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the input element',
    },
    value: { control: 'text', description: 'Current query' },
    placeholder: { control: 'text', description: 'Placeholder text' },
    size: {
      control: 'select',
      options: [ElementSize.Standard, ElementSize.Small, ElementSize.Large],
      description:
        'Field height — standard is 40px, small is 24px, large is 48px',
      table: { defaultValue: { summary: ElementSize.Standard } },
    },
    withoutBorder: {
      control: 'boolean',
      description: 'Renders the field without its border and background',
    },
    clearLabel: {
      control: 'text',
      description: 'Accessible name of the clear button',
    },
    disabled: { control: 'boolean', description: 'Disables the field' },
    invalid: { control: 'boolean', description: 'Applies error styling' },
    onChange: {
      action: 'changed',
      control: false,
      description: 'Fired with the new query, or `undefined` when emptied',
    },
    onBlur: {
      action: 'blurred',
      control: false,
      description: 'Fired when the field loses focus',
    },
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveSearch,
  args: { id: 'search', placeholder: 'Search' },
};

export const Filled: Story = {
  render: InteractiveSearch,
  args: { id: 'search-filled', placeholder: 'Search', value: 'Conversations' },
};

export const Small: Story = {
  render: InteractiveSearch,
  args: {
    id: 'search-small',
    placeholder: 'Search',
    size: ElementSize.Small,
    value: 'Conversations',
  },
};

export const Large: Story = {
  render: InteractiveSearch,
  args: {
    id: 'search-large',
    placeholder: 'Search',
    size: ElementSize.Large,
    value: 'Conversations',
  },
};

export const WithoutBorder: Story = {
  render: InteractiveSearch,
  args: {
    id: 'search-borderless',
    placeholder: 'Search',
    withoutBorder: true,
    value: 'Conversations',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sits flush in a toolbar or panel header. The border stays at full width and turns transparent, so toggling it never shifts the layout.',
      },
    },
  },
};

export const WithLabelAndCaption: Story = {
  render: InteractiveSearch,
  args: {
    id: 'search-labelled',
    placeholder: 'Search',
    labelProps: { label: 'Find a conversation' },
    caption: 'Matches titles and message text',
  },
};

const AllVariantsComponent: FC = () => {
  const states: { label: string; props: Partial<SearchProps> }[] = [
    { label: 'Empty', props: {} },
    { label: 'Filled', props: { value: 'Conversations' } },
    {
      label: 'Borderless',
      props: { value: 'Conversations', withoutBorder: true },
    },
    { label: 'Invalid', props: { value: 'Conversations', invalid: true } },
    { label: 'Disabled', props: { disabled: true } },
    {
      label: 'Disabled filled',
      props: { value: 'Conversations', disabled: true },
    },
  ];

  return (
    <div className="flex min-w-[640px] flex-row gap-8 p-8">
      {[ElementSize.Large, ElementSize.Standard, ElementSize.Small].map(
        (size) => (
          <div key={size} className="flex-1">
            <div className="dial-small-semi-text mb-4 capitalize text-primary">
              Size: {size}
            </div>
            <div className="flex flex-col gap-4">
              {states.map(({ label, props }) => (
                <div key={label}>
                  <div className="dial-tiny-text mb-1 text-secondary">
                    {label}
                  </div>
                  <InteractiveSearch
                    id={`search-${size}-${label.replace(/\s/g, '-')}`}
                    placeholder="Search"
                    size={size}
                    {...props}
                  />
                </div>
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export const AllVariants: Story = {
  args: { id: 'search-all' },
  render: () => <AllVariantsComponent />,
};
