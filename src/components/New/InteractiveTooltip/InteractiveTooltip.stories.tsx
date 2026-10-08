import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InteractiveTooltipTrigger, TooltipPlacement } from '@/types/tooltip';
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
          'A hover panel that, unlike Tooltip, can hold its own interactive content. It opens next to the trigger on hover or focus and stays open while the pointer moves into the panel, so buttons and links inside it can be used. Renders nothing on a mobile screen, where there is no hover to reveal it, unless it is opened by click or tap (`trigger`).',
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
    trigger: {
      control: { type: 'select' },
      options: [
        InteractiveTooltipTrigger.Hover,
        InteractiveTooltipTrigger.Click,
      ],
      description:
        'What opens the panel: hover or focus (default), or a click or tap that keeps it open until dismissed',
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

export const UncontrolledWithOnOpenChange: Story = {
  render: (args) => {
    const [log, setLog] = useState<boolean[]>([]);

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-[220px] rounded-xl bg-layer-raised p-1 shadow-md">
          <InteractiveTooltip
            {...args}
            onOpenChange={(next) => setLog((prev) => [...prev, next])}
          />
        </div>
        <p className="text-sm text-secondary">
          onOpenChange log: {log.length === 0 ? '—' : log.join(', ')}
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'The panel stays uncontrolled (no `open` prop) while `onOpenChange` is only used to observe transitions — e.g. to lazily fetch the panel content on first open. The panel still opens on hover/focus and the callback fires alongside it.',
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

export const OpenedByClick: Story = {
  args: {
    asChild: false,
    placement: TooltipPlacement.Top,
    trigger: InteractiveTooltipTrigger.Click,
    children: <Button label="Tap me" />,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          '`trigger={InteractiveTooltipTrigger.Click}` opens the panel on a click or tap and keeps it open until a second tap on the trigger, a press outside or Escape. It works on every screen size, including a mobile one where the default hover panel renders nothing, and it ignores hover and focus. Use it for a trigger whose only job is to reveal the panel, such as an info chip; a trigger with an action of its own would run both on the same tap.',
      },
    },
  },
};
