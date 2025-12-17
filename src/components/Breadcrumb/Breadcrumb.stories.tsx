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
      { label: 'First Level Navigation', href: '#' },
      { label: 'Second Level Navigation', href: '#' },
      { label: 'Third Level Navigation', href: '#' },
      { label: 'Current Page Name' },
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    separator: '/',
    pathItems: [
      { label: 'Home', href: '#' },
      { label: 'Library', href: '#' },
      { label: 'Data' },
    ],
  },
};

export const DisabledItem: Story = {
  args: {
    pathItems: [
      { label: 'Home', href: '#' },
      { label: 'Section (disabled)', href: '#', disabled: true },
      { label: 'Current Page' },
    ],
  },
};

export const CompositionAPI: Story = {
  name: 'Composition API (<DialBreadcrumbItem/>)',
  render: () => (
    <DialBreadcrumb>
      <DialBreadcrumbItem
        label="Home"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked Home');
        }}
      />
      <DialBreadcrumbItem
        label="Section"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked Section');
        }}
      />
      <DialBreadcrumbItem
        label="Design System"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked Design System');
        }}
      />
      <DialBreadcrumbItem
        label="Components"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked Components');
        }}
      />
      <DialBreadcrumbItem
        label="Current Page"
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
            label: 'Very long first level navigation name that should truncate',
            href: '#',
          },
          {
            label:
              'Extremely verbose second level navigation name that also truncates',
            href: '#',
          },
          { label: 'Current Page With A Long Name' },
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
        label="Projects"
        href="#"
        iconBefore={<IconFolder size={16} aria-label="folder" />}
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked Projects folder');
        }}
      />
      <DialBreadcrumbItem
        label="2025"
        href="#"
        iconBefore={<IconFolder size={16} aria-label="folder" />}
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked 2025 folder');
        }}
      />
      <DialBreadcrumbItem
        label="Design System"
        iconBefore={<IconFolder size={16} aria-label="folder" />}
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked Design System folder');
        }}
      />
    </DialBreadcrumb>
  ),
};
