import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  DialFileManagerNavigationPanel,
  type DialFileManagerNavigationPanelProps,
} from './FileManagerNavigationPanel';

const meta = {
  title: 'FileManager/components/FileManagerNavigationPanel',
  component: DialFileManagerNavigationPanel,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    ariaLabel: { control: { type: 'text' } },
    titleCssClass: { control: { type: 'text' } },
    breadcrumbCssClass: { control: { type: 'text' } },

    path: { control: 'text' },
    makeHref: { control: false },
    onItemClick: { control: false },

    searchable: { control: { type: 'boolean' } },
    elementId: { control: { type: 'text' } },
    value: { control: { type: 'text' } },
    disabled: { control: { type: 'boolean' } },
    readonly: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    searchCssClass: { control: { type: 'text' } },
    searchContainerCssClass: { control: { type: 'text' } },

    cssClass: { control: { type: 'text' } },
  },
  args: {
    path: 'Organization/Folder 4',
    searchable: true,
    elementId: 'storybook-fm-search',
    value: '',
  },
} satisfies Meta<DialFileManagerNavigationPanelProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutSearch: Story = {
  args: { searchable: false },
};

export const WithItemClick: Story = {
  render: (args) => {
    const handleItemClick = (href?: string) => {
      alert('Clicked breadcrumb item with href: ' + href);
    };
    return (
      <DialFileManagerNavigationPanel
        {...args}
        onItemClick={handleItemClick}
        makeHref={(segments, index) =>
          '#' + '/' + segments.slice(0, index + 1).join('/')
        }
      />
    );
  },
};

export const LongPath: Story = {
  args: {
    path: 'Organization/Department/Team/Project/Sprint 14/Folder 4',
  },
};

export const WithLinks: Story = {
  args: {
    path: 'Org/Team/Design/Assets',
  },
  render: (args) => (
    <DialFileManagerNavigationPanel
      {...args}
      // Make all but the last breadcrumb items clickable
      makeHref={(segments, index) =>
        '#' + '/' + segments.slice(0, index + 1).join('/')
      }
    />
  ),
};

const ControlledSearchStateComponent = (
  args: DialFileManagerNavigationPanelProps,
) => {
  const [query, setQuery] = useState(args.value as string);
  return (
    <DialFileManagerNavigationPanel
      {...args}
      value={query}
      onSearchChange={setQuery}
    />
  );
};

export const ControlledSearchState: Story = {
  render: (args) => <ControlledSearchStateComponent {...args} />,
};

export const DisabledReadonlyInvalid: Story = {
  args: {
    disabled: false,
    readonly: false,
    invalid: true,
  },
};
