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
    labelClassName: { control: { type: 'text' } },
    breadcrumbClassName: { control: { type: 'text' } },

    path: { control: 'text' },
    makeHref: { control: false },
    onItemClick: { control: false },

    searchable: { control: { type: 'boolean' } },
    elementId: { control: { type: 'text' } },
    value: { control: { type: 'text' } },
    disabled: { control: { type: 'boolean' } },
    readOnly: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    searchClassName: { control: { type: 'text' } },
    searchContainerClassName: { control: { type: 'text' } },

    className: { control: { type: 'text' } },
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
          '#' + segments.slice(0, index + 1).join('/')
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

export const LongLabels: Story = {
  args: {
    path: 'Organization/Product Design Team/UI Components Library/Breadcrumb Navigation/Very Long Subfolder Name That Will Definitely Be Truncated/Another Very Long Subfolder With Lots Of Extra Words That Should Be Truncated Because It Is Way Too Long To Fit/Current Working Folder With An Extremely Long Descriptive Name That Exceeds The Available Space And Must Be Truncated With Ellipsis At The End Of The Text',
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
        '#' + segments.slice(0, index + 1).join('/')
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
    invalid: true,
  },
};

export const CompactView: Story = {
  args: {
    isCompactView: true,
    searchable: true,
    path: 'Organization/Folder 4',
    elementId: 'compact-search',
  },
  render: (args) => {
    return <DialFileManagerNavigationPanel {...args} />;
  },
};

export const WithHiddenPathPart: Story = {
  args: {
    path: 'files/user123/appdata/mindmap/Project/Subfolder',
    breadcrumbsHiddenPathPart: 'appdata/mindmap',
  },
  render: (args) => (
    <DialFileManagerNavigationPanel
      {...args}
      makeHref={(segments, index) =>
        '#' + segments.slice(0, index + 1).join('/')
      }
      onItemClick={(href) => {
        alert('Clicked breadcrumb item with href: ' + href);
      }}
    />
  ),
};

export const WithRootItem: Story = {
  args: {
    path: 'Organization/Department/Team/Project',
    rootItemPath: 'Organization',
    rootItemLabel: 'My Organization',
  },
  render: (args) => (
    <DialFileManagerNavigationPanel
      {...args}
      makeHref={(segments, index) =>
        '#' + segments.slice(0, index + 1).join('/')
      }
    />
  ),
};

export const WithHiddenPathAndRootItem: Story = {
  args: {
    path: 'files/user123/appdata/mindmap/Project/Subfolder',
    breadcrumbsHiddenPathPart: 'appdata/mindmap',
    rootItemPath: 'files/user123',
    rootItemLabel: 'My Files',
  },
  render: (args) => (
    <DialFileManagerNavigationPanel
      {...args}
      makeHref={(segments, index) =>
        '#' + segments.slice(0, index + 1).join('/')
      }
      onItemClick={(href) => {
        alert('Clicked breadcrumb item with href: ' + href);
      }}
    />
  ),
};
