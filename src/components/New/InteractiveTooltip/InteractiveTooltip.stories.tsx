import type { Meta, StoryObj } from '@storybook/react-vite';

import { TooltipPlacement } from '@/types/tooltip';
import { Button } from '../Button/Button';
import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { MenuItem } from '../MenuItem/MenuItem';
import {
  InteractiveTooltip,
  type InteractiveTooltipProps,
} from './InteractiveTooltip';

const meta = {
  title: 'Components_2_0/InteractiveTooltip',
  component: InteractiveTooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A hover panel that, unlike Tooltip, can hold its own interactive content. It opens next to the trigger on hover or focus and stays open while the pointer moves into the panel, so buttons and links inside it can be used. Renders nothing on a mobile screen, where there is no hover to reveal it.',
      },
    },
  },
  argTypes: {
    content: {
      control: false,
      description: "The panel's content",
    },
    placement: {
      control: { type: 'select' },
      options: [
        TooltipPlacement.Top,
        TooltipPlacement.Right,
        TooltipPlacement.Bottom,
        TooltipPlacement.Left,
      ],
      description: 'Side of the trigger the panel is placed on',
    },
    asChild: {
      control: { type: 'boolean' },
      description:
        'Use the child as the trigger instead of wrapping it in a span',
    },
    hideTooltip: {
      control: { type: 'boolean' },
      description: 'Suppress the panel while keeping the trigger rendered',
    },
    initialOpen: {
      control: { type: 'boolean' },
      description: 'Whether the panel starts open',
    },
    triggerClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the trigger element',
    },
    contentClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the panel',
    },
    children: {
      control: false,
      description: 'The element that triggers the panel',
    },
    onOpenChange: {
      control: false,
      description: 'Callback fired when the open state should change',
    },
  },
  args: {
    content: (
      <div className="flex flex-col gap-3">
        <p>
          Lets the model write and execute Python in an isolated sandbox instead
          of answering from memory. Useful for analyzing uploaded files, running
          calculations that need to be exact, generating charts, and converting
          between formats.
        </p>
        <Button
          variant={ButtonVariant.Primary}
          appearance={ButtonAppearance.Link}
          label="View details"
        />
      </div>
    ),
    placement: TooltipPlacement.Right,
    asChild: true,
    children: <MenuItem label="code-interpreter" />,
  },
} satisfies Meta<InteractiveTooltipProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-[220px] rounded-xl bg-layer-raised p-1 shadow-md">
      <InteractiveTooltip {...args} />
    </div>
  ),
};

export const OnAPlainTrigger: Story = {
  args: {
    asChild: false,
    children: <Button label="Hover me" />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Without `asChild` the trigger is wrapped in a `<span>`, which is the only option when the trigger is not a single element.',
      },
    },
  },
};

export const Hidden: Story = {
  args: {
    hideTooltip: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`hideTooltip` suppresses the panel without changing how the trigger renders.',
      },
    },
  },
};
