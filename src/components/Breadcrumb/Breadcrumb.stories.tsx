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
    className: { control: { type: 'text' } },
    pathItems: { control: false },
    children: { control: false },
    titleClassName: { control: { type: 'text' } },
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

export const CompositionAPI: Story = {
  name: 'Composition API (<DialBreadcrumbItem/>)',
  render: () => (
    <DialBreadcrumb>
      <DialBreadcrumbItem
        title="Home"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked Home');
        }}
      />
      <DialBreadcrumbItem
        title="Section"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked Section');
        }}
      />
      <DialBreadcrumbItem
        title="Design System"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked Design System');
        }}
      />
      <DialBreadcrumbItem
        title="Components"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked Components');
        }}
      />
      <DialBreadcrumbItem
        title="Current Page"
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked Current Page');
        }}
      />
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
        titleClassName="max-w-[80px]"
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
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked Projects folder');
        }}
      />
      <DialBreadcrumbItem
        title="2025"
        href="#"
        iconBefore={<IconFolder size={16} aria-label="folder" />}
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked 2025 folder');
        }}
      />
      <DialBreadcrumbItem
        title="Design System"
        iconBefore={<IconFolder size={16} aria-label="folder" />}
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked Design System folder');
        }}
      />
    </DialBreadcrumb>
  ),
};
