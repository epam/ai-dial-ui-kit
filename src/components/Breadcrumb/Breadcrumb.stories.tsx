import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialBreadcrumb } from './Breadcrumb';
import { DialBreadcrumbItem } from './BreadcrumbItem';
import { IconFolder } from '@tabler/icons-react';

const meta = {
  title: 'Navigation/Breadcrumb',
  component: DialBreadcrumb,
  parameters: { layout: 'centered' },
  argTypes: {
    separator: { control: { type: 'text' } },
    ariaLabel: { control: { type: 'text' } },
    cssClass: { control: { type: 'text' } },
    pathItems: { control: false },
    children: { control: false },
    titleCssClass: { control: { type: 'text' } },
  },
  args: {
    ariaLabel: 'Breadcrumb',
  },
} satisfies Meta<typeof DialBreadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default (pathItems prop)',
  args: {
    pathItems: [
      { title: 'First Level Navigation', href: '#' },
      { title: 'Second Level Navigation', href: '#' },
      { title: 'Third Level Navigation', href: '#' },
      { title: 'Current Page Name' },
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    separator: '/',
    pathItems: [
      { title: 'Home', href: '#' },
      { title: 'Library', href: '#' },
      { title: 'Data' },
    ],
  },
};

export const DisabledItem: Story = {
  args: {
    pathItems: [
      { title: 'Home', href: '#' },
      { title: 'Section (disabled)', href: '#', disabled: true },
      { title: 'Current Page' },
    ],
  },
};

export const Scrollable: Story = {
  render: () => (
    <div className="w-[280px] border border-primary p-2 bg-layer-2">
      <DialBreadcrumb
        pathItems={[
          { title: 'First Level Navigation', href: '#' },
          { title: 'Second Level Navigation', href: '#' },
          { title: 'Third Level Navigation', href: '#' },
          { title: 'Fourth Level Navigation', href: '#' },
          { title: 'Fifth Level Navigation', href: '#' },
          { title: 'Current Page Name' },
        ]}
      />
    </div>
  ),
};

export const CompositionAPI: Story = {
  name: 'Composition API (<DialBreadcrumbItem/>)',
  render: () => (
    <DialBreadcrumb>
      <DialBreadcrumbItem title="Home" href="#" />
      <DialBreadcrumbItem title="Section" href="#" />
      <DialBreadcrumbItem title="Current Page" />
    </DialBreadcrumb>
  ),
};

export const LongLabelsTruncate: Story = {
  render: () => (
    <div className="w-[360px]">
      <DialBreadcrumb
        pathItems={[
          {
            title: 'Very long first level navigation name that should truncate',
            href: '#',
          },
          {
            title:
              'Extremely verbose second level navigation name that also truncates',
            href: '#',
          },
          { title: 'Current Page With A Long Name' },
        ]}
        titleCssClass="max-w-[80px]"
      />
    </div>
  ),
};
export const WithFolderIcons: Story = {
  name: 'With folder icons',
  render: () => (
    <DialBreadcrumb>
      <DialBreadcrumbItem
        title="Projects"
        href="#"
        iconBefore={<IconFolder size={16} aria-label="folder" />}
      />
      <DialBreadcrumbItem
        title="2025"
        href="#"
        iconBefore={<IconFolder size={16} aria-label="folder" />}
      />
      <DialBreadcrumbItem
        title="Design System"
        iconBefore={<IconFolder size={16} aria-label="folder" />}
      />
    </DialBreadcrumb>
  ),
};
