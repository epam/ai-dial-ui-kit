import { TooltipPlacement } from '@/types/tooltip';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { EllipsisTooltip, type EllipsisTooltipProps } from './EllipsisTooltip';

const meta = {
  title: 'Components_2_0/EllipsisTooltip',
  component: EllipsisTooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Single-line text with a CSS ellipsis that reveals the full string in a tooltip only when it is actually clipped. Text that fits gets no tooltip at all. The width has to be finite for anything to truncate, so `className` sets the width the text should fit into.',
      },
    },
  },
  argTypes: {
    text: {
      control: { type: 'text' },
      description:
        'The text or node to display, truncated when it does not fit',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS classes for the text element, typically its width',
    },
    contentClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the tooltip bubble',
    },
    hideTooltip: {
      control: { type: 'boolean' },
      description: 'Suppress the tooltip even while the text is truncated',
    },
    customTooltipContent: {
      control: { type: 'text' },
      description: 'Shown instead of the full text while truncated',
    },
    placement: {
      control: { type: 'select' },
      options: [
        TooltipPlacement.Top,
        TooltipPlacement.Right,
        TooltipPlacement.Bottom,
        TooltipPlacement.Left,
      ],
      description: 'Side of the text the tooltip is placed on',
    },
    initialOpen: {
      control: { type: 'boolean' },
      description: 'Whether the tooltip starts open',
    },
    isTriggerClickable: {
      control: { type: 'boolean' },
      description: 'Restrict hover handling to mouse input, ignoring touch',
    },
    open: { control: false },
    onOpenChange: {
      control: false,
      description: 'Callback fired when the open state should change',
    },
  },
  args: {
    text: 'This is a very long message that will be truncated in a narrow container. Hover or focus it to read the full text.',
    hideTooltip: false,
    placement: TooltipPlacement.Bottom,
  },
} satisfies Meta<EllipsisTooltipProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Truncated: Story = {
  render: (args) => (
    <div className="w-48">
      <EllipsisTooltip {...args} />
    </div>
  ),
};

export const NotTruncated: Story = {
  args: {
    text: 'Fits fine — no tooltip',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Text that fits renders no tooltip element at all, so a row of short labels does not sprout tooltips repeating what is already on screen.',
      },
    },
  },
};

export const InAFlexRow: Story = {
  args: {
    text: 'Put me in a flex row — min-w-0 on the row is what lets me truncate.',
  },
  render: (args) => (
    <div className="flex w-72 min-w-0 items-center gap-2">
      <span className="dial-small-semi-text shrink-0 text-primary">Name:</span>
      <EllipsisTooltip {...args} className="w-full min-w-0" />
    </div>
  ),
};

export const CustomContent: Story = {
  args: {
    customTooltipContent: 'Shown instead of the full text',
  },
  render: (args) => (
    <div className="w-48">
      <EllipsisTooltip {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`customTooltipContent` replaces the full text in the bubble, and — like the default content — only appears while the text is clipped.',
      },
    },
  },
};

export const Suppressed: Story = {
  args: {
    hideTooltip: true,
  },
  render: (args) => (
    <div className="w-48">
      <EllipsisTooltip {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`hideTooltip` suppresses the bubble but keeps the `aria-label`, so the clipped text still has the full string as its accessible name.',
      },
    },
  },
};

export const CustomNode: Story = {
  args: {
    text: (
      <span className="dial-small-semi-text text-accent">
        A node instead of a string — the tooltip still reads the full text out
        of the DOM.
      </span>
    ),
  },
  render: (args) => (
    <div className="w-48">
      <EllipsisTooltip {...args} />
    </div>
  ),
};
