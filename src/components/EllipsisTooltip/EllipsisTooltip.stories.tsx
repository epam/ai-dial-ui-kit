import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  DialEllipsisTooltip,
  type DialEllipsisTooltipProps,
} from './EllipsisTooltip';
import { DialButton } from '@/components/Button/Button';
import { ButtonVariant } from '@/types/button';

const meta = {
  title: 'Overlay/EllipsisTooltip',
  component: DialEllipsisTooltip,
  parameters: { layout: 'centered' },
  argTypes: {
    text: { control: { type: 'text' } },
    className: { control: { type: 'text' } },
    contentClassName: { control: { type: 'text' } },
    hideTooltip: { control: { type: 'boolean' } },
    placement: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
    },
    initialOpen: { control: { type: 'boolean' } },
    isTriggerClickable: { control: { type: 'boolean' } },
    open: { control: false },
    onOpenChange: { control: false },
  },
  args: {
    text: 'This is a very long message that will be truncated in a narrow container. Hover or focus to see full text.',
    hideTooltip: false,
    placement: 'bottom',
    initialOpen: false,
    isTriggerClickable: false,
  },
} satisfies Meta<DialEllipsisTooltipProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: truncates due to built-in width (w-48). */
export const Default: Story = {
  render: (args) => (
    <div className="w-48">
      <DialEllipsisTooltip {...args} />
    </div>
  ),
};

export const NotTruncated_AutoWidth: Story = {
  args: {
    text: 'Fits fine — no tooltip content',
    className: 'w-auto',
  },
};

export const NotTruncated_ShortText: Story = {
  args: {
    text: 'Short',
  },
};

export const VeryNarrow: Story = {
  args: {
    text: 'Extremely long content that definitely will not fit into a tiny width, thus the tooltip should mirror the full string.',
    className: 'w-32',
  },
};

export const InsideFlexRow_Truncated: Story = {
  render: (args) => (
    <div className="flex items-center gap-2 min-w-0 w-72">
      <span className="shrink-0 text-primary">Label:</span>
      <DialEllipsisTooltip {...args} className="min-w-0 w-full" />
    </div>
  ),
  args: {
    text: 'Put me in a flex row — min-w-0 helps me truncate properly.',
  },
};

export const InsideFlexRow_NotTruncated: Story = {
  render: (args) => (
    <div className="flex items-center gap-2 w-full">
      <span className="shrink-0 text-primary">Label:</span>
      <DialEllipsisTooltip {...args} className="w-auto" />
    </div>
  ),
  args: {
    text: 'Plenty of space here — no truncation.',
  },
};

export const LongUnbrokenWord: Story = {
  args: {
    text: 'SupercalifragilisticexpialidociousSupercalifragilisticexpialidociousSupercalifragilisticexpialidocious',
    className: 'w-40',
  },
};

export const DisabledTooltip: Story = {
  args: {
    text: 'Tooltip suppressed even when truncated',
    className: 'w-32',
    hideTooltip: true,
  },
};

export const WithNodeContent: Story = {
  args: {
    text: (
      <span>
        <strong>Bold</strong> node content with inline elements that will be
        truncated
      </span>
    ),
    className: 'w-40',
  },
};

function DynamicResizeExample(args: DialEllipsisTooltipProps) {
  const [narrow, setNarrow] = useState(true);
  return (
    <div className="flex flex-col items-center gap-3">
      <DialButton
        onClick={() => setNarrow((v) => !v)}
        variant={ButtonVariant.Secondary}
        label={`Toggle width (${narrow ? 'narrow' : 'wide'})`}
      />
      <div className={narrow ? 'w-40' : 'w-auto'}>
        <DialEllipsisTooltip
          {...args}
          className={narrow ? 'w-full' : 'w-auto'}
        />
      </div>
    </div>
  );
}

export const DynamicResize: Story = {
  render: DynamicResizeExample,
  args: {
    text: 'Resize me with the button — when narrow, I truncate; when wide, I do not.',
  },
};
