import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProgressBarRole } from '@/types/progress-bar';
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
          'A horizontal bar indicating progress toward a goal, or — with `role={ProgressBarRole.Meter}` — a level within a range such as capacity used. Names itself from `labelProps.label`, falling back to `aria-label`.',
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
    labelProps: {
      control: 'object',
      description:
        'Props of the `Label` rendered above the bar, which also names it',
    },
    valueLabel: {
      control: 'text',
      description: 'Readout rendered at the end of the label row',
    },
    role: {
      control: 'radio',
      options: Object.values(ProgressBarRole),
      description:
        'ARIA role: `progressbar` for a task on its way to done, `meter` for a level within a range',
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
    role: ProgressBarRole.Progressbar,
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { labelProps: { label: 'Uploading' } },
};

/**
 * `valueLabel` sits at the end of the label row. Formatting stays with the
 * caller — round the raw number there rather than showing `3.313182`.
 */
export const WithValueReadout: Story = {
  args: {
    value: 3.313182,
    max: 500,
    labelProps: { label: 'Cost per month' },
    valueLabel: '3.31 / 500',
    'aria-valuetext': '3.31 of 500',
  },
};

export const ValueReadoutWithoutLabel: Story = {
  args: {
    value: 40,
    valueLabel: '40 / 100',
    'aria-label': 'Quota used',
  },
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
    labelProps: { label: 'Uploading files' },
    'aria-valuetext': '3 of 10 files',
  },
};

/**
 * `ProgressBarRole.Meter` renders `role="meter"`, for a level inside a range
 * that never completes — here, how much of a project's context capacity its
 * files take. Pass `aria-valuetext` so the reading is announced in the same
 * words the readout shows.
 */
export const Meter: Story = {
  args: {
    role: ProgressBarRole.Meter,
    value: 3_400_000,
    max: 10_000_000,
    size: ElementSize.Small,
    labelProps: { label: 'Project capacity' },
    valueLabel: '34% used',
    'aria-valuetext': '34% used',
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
