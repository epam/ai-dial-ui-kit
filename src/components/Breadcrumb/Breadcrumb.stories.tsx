import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialBreadcrumb } from './Breadcrumb';
import { DialBreadcrumbItem } from './BreadcrumbItem';
import { IconFolder } from '@tabler/icons-react';
import { useState } from 'react';
import { DIAL_ICON_SIZE } from '@/constants/icon';

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
    labelClassName: { control: { type: 'text' } },
    onBeforeNavigate: { control: false },
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

export const WithNavigationGuard: Story = {
  name: 'With Navigation Guard (Unsaved Changes)',
  render: () => {
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);

    const handleBeforeNavigate = async () => {
      if (!hasUnsavedChanges) {
        return true;
      }

      // Simulate a confirmation dialog
      const userConfirmed = window.confirm(
        'You have unsaved changes. Do you want to leave this page?',
      );

      if (userConfirmed) {
        setHasUnsavedChanges(false);
      }

      return userConfirmed;
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasUnsavedChanges}
              onChange={(e) => setHasUnsavedChanges(e.target.checked)}
            />
            <span className="dial-small-text text-primary">
              Has unsaved changes (try clicking breadcrumb items)
            </span>
          </label>
        </div>
        <DialBreadcrumb
          pathItems={[
            { label: 'Home', href: '#' },
            { label: 'Projects', href: '#' },
            { label: 'Current Project (with unsaved changes)' },
          ]}
          onBeforeNavigate={handleBeforeNavigate}
        />
      </div>
    );
  },
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
        labelClassName="max-w-[80px]"
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
        iconBefore={<IconFolder size={DIAL_ICON_SIZE.SM} aria-label="folder" />}
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked Projects folder');
        }}
      />
      <DialBreadcrumbItem
        label="2025"
        href="#"
        iconBefore={<IconFolder size={DIAL_ICON_SIZE.SM} aria-label="folder" />}
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked 2025 folder');
        }}
      />
      <DialBreadcrumbItem
        label="Design System"
        iconBefore={<IconFolder size={DIAL_ICON_SIZE.SM} aria-label="folder" />}
        onClick={(e) => {
          e.preventDefault();
          alert('Clicked Design System folder');
        }}
      />
    </DialBreadcrumb>
  ),
};
