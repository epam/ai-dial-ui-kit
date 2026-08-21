import { TooltipPlacement } from '@/types/tooltip';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Tooltip, type TooltipProps } from './Tooltip';

const meta = {
  title: 'Components_2_0/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Shows a short explanation next to an element while it is hovered or focused. Placed on one of the four sides of the trigger, it follows the trigger on scroll and flips to the opposite side when it would not fit. Nothing renders on mobile screens, so a tooltip must never be the only accessible name of a control.',
      },
    },
  },
  argTypes: {
    tooltip: {
      control: { type: 'text' },
      description: 'The content to display in the tooltip',
    },
    placement: {
      control: { type: 'select' },
      options: [
        TooltipPlacement.Top,
        TooltipPlacement.Right,
        TooltipPlacement.Bottom,
        TooltipPlacement.Left,
      ],
      description: 'Side of the trigger the tooltip is placed on',
    },
    asChild: {
      control: { type: 'boolean' },
      description:
        'Use the child as the trigger instead of wrapping it in a span, so the tooltip describes the control itself',
    },
    hideTooltip: {
      control: { type: 'boolean' },
      description: 'Suppress the tooltip while keeping the trigger rendered',
    },
    initialOpen: {
      control: { type: 'boolean' },
      description: 'Whether the tooltip starts open',
    },
    isTriggerClickable: {
      control: { type: 'boolean' },
      description: 'Restrict hover handling to mouse input, ignoring touch',
    },
    triggerClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the trigger element',
    },
    contentClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the tooltip bubble',
    },
    children: {
      control: false,
      description: 'The element that triggers the tooltip',
    },
    onOpenChange: {
      control: false,
      description: 'Callback fired when the open state should change',
    },
  },
  args: {
    tooltip: 'Tooltip text',
    placement: TooltipPlacement.Top,
    asChild: true,
    children: <Button label="Hover me" />,
  },
} satisfies Meta<TooltipProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const placements = [
  TooltipPlacement.Top,
  TooltipPlacement.Right,
  TooltipPlacement.Left,
  TooltipPlacement.Bottom,
];

export const AllPlacements: Story = {
  render: (args) => (
    <div className="flex flex-col gap-16 p-16">
      {placements.map((placement) => (
        <div key={placement} className="flex items-center gap-6">
          <span className="dial-small-text w-[64px] capitalize text-secondary">
            {placement}
          </span>
          <Tooltip {...args} placement={placement} initialOpen>
            <Button label="Trigger" />
          </Tooltip>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Every placement, held open so the arrow position can be compared. In use a tooltip flips to the opposite side when the chosen one does not fit.',
      },
    },
  },
};

export const LongContent: Story = {
  args: {
    tooltip:
      'A long tooltip that wraps onto several lines once it reaches the maximum width of 300 pixels, and keeps the line breaks it is given.',
  },
};

export const OnAWrappedTrigger: Story = {
  args: {
    asChild: false,
    children: 'Plain text trigger',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Without `asChild` the trigger is wrapped in a `<span>`, which is the only option when the trigger is not a single element. The tooltip then describes the wrapper, so the control still needs its own accessible name.',
      },
    },
  },
};

export const Hidden: Story = {
  args: {
    hideTooltip: true,
    children: <Button label="No tooltip" />,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`hideTooltip` suppresses the tooltip without changing how the trigger renders — useful when the explanation only applies in some states.',
      },
    },
  },
};
