import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialFileIcon, type DialFileIconProps } from './FileIcon';
import { supportedExtensions } from './constants';
import { DialSharedEntityIndicator } from '@/components/SharedEntityIndicator/SharedEntityIndicator';

const meta = {
  title: 'FileManager/DialFileIcon',
  component: DialFileIcon,
  parameters: { layout: 'centered' },
  argTypes: {
    extension: { control: { type: 'text' } },
    size: { control: { type: 'number', min: 12, max: 64, step: 2 } },
    stroke: { control: { type: 'number', min: 1, max: 2, step: 0.25 } },
    decorative: { control: { type: 'boolean' } },
    label: { control: { type: 'text' } },
    cssClass: { control: { type: 'text' } },
  },
  args: {
    extension: '.pdf',
    size: 20,
    stroke: 1.5,
    decorative: false,
  },
} satisfies Meta<DialFileIconProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: { extension: '.pdf', cssClass: 'text-primary' },
};

export const Decorative: Story = {
  args: { extension: '.png', decorative: true },
};

export const Unknown: Story = {
  args: { extension: '.unknown', cssClass: 'text-primary' },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {supportedExtensions.map((ext) => (
        <div key={ext} className="flex items-center gap-2 p-2 rounded border">
          <DialFileIcon {...args} extension={ext} cssClass="text-primary" />
          <span className="dial-tiny text-secondary">{ext}</span>
        </div>
      ))}
    </div>
  ),
  args: { size: 24, decorative: false },
};

export const WithIndicator: Story = {
  render: (args) => (
    <div className="w-12 h-12 flex items-center justify-center bg-layer-3">
      <DialFileIcon {...args} indicator={<DialSharedEntityIndicator />} />
    </div>
  ),
  args: {
    extension: 'default',
    size: 18,
    decorative: false,
    cssClass: 'text-primary bg-layer-3',
  },
};
