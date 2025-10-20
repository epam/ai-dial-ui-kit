import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialFileName, type DialFileNameProps } from './FileName';

const meta = {
  title: 'FileManager/FileName',
  component: DialFileName,
  parameters: { layout: 'centered' },
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'Full file name with or without extension',
    },
    cssClass: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the root container',
    },
    shared: {
      control: { type: 'boolean' },
      description: 'Whether the file is shared',
    },
  },
  args: {
    name: 'Document.pdf',
    shared: false,
  },
} satisfies Meta<DialFileNameProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'Document.pdf' },
};

export const NoExtension: Story = {
  args: { name: 'README' },
};

export const Shared: Story = {
  args: { name: 'design.sketch', shared: true },
};

export const LongName: Story = {
  args: {
    name: 'Quarterly Performance Review – Mobile App v2.7.3 (final-approved).xlsx',
  },
  render: (args) => (
    <div className="w-64">
      <DialFileName {...args} />
    </div>
  ),
};

export const WithCustomClass: Story = {
  args: {
    name: 'photo.png',
    cssClass: 'bg-layer-2 border-2 border-accent-primary p-2 rounded-xl',
  },
};
