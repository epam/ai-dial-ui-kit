import type { Meta, StoryObj } from '@storybook/react-vite';

import { ElementSize } from '@/types/size';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Components_2_0/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A horizontal bar indicating progress toward a goal. Names itself from `label`, falling back to `aria-label`.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Current progress, clamped into `0…max`',
    },
    max: {
      control: { type: 'number' },
      description: 'Value that counts as complete',
    },
    size: {
      control: 'radio',
      options: [ElementSize.Small, ElementSize.Standard],
      description: 'Bar height: standard is 8px, small is 4px',
    },
    label: {
      control: 'text',
      description: 'Visible label rendered above the bar; also names it',
    },
    className: {
      control: 'text',
      description: 'Additional classes on the track element',
    },
  },
  args: {
    value: 50,
    max: 100,
    size: ElementSize.Standard,
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: 'Uploading' },
};

export const Small: Story = {
  args: { size: ElementSize.Small },
};

export const Empty: Story = {
  args: { value: 0 },
};

export const Full: Story = {
  args: { value: 100 },
};

/**
 * A `max` other than 100 is announced as a percentage. Pass `aria-valuetext`
 * when the raw counts are more meaningful than the ratio.
 */
export const CustomMax: Story = {
  args: {
    value: 3,
    max: 10,
    label: 'Uploading files',
    'aria-valuetext': '3 of 10 files',
  },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-full flex-col gap-6">
      {[ElementSize.Small, ElementSize.Standard].map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="dial-tiny-text text-secondary">{size}</span>
          <ProgressBar value={65} size={size} aria-label={`Progress ${size}`} />
        </div>
      ))}
    </div>
  ),
};
