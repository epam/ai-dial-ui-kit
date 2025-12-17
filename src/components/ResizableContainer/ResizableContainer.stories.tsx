import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ResizableContainerSide } from '@/types/resizable-container';
import { IconGripVertical } from '@tabler/icons-react';
import {
  DialResizableContainer,
  type DialResizableContainerProps,
} from './ResizableContainer';

const InteractiveResizable = (args: DialResizableContainerProps) => {
  const content = (args.children as React.ReactNode) ?? (
    <div className="p-4 text-primary">
      <div className="font-medium">Resizable content</div>
      <div className="text-sm opacity-80">
        Example children passed to the container
      </div>
    </div>
  );

  const [width, setWidth] = useState<number | undefined>(
    args.width ?? args.defaultWidth,
  );

  return (
    <div className="h-full">
      <DialResizableContainer
        {...args}
        width={width}
        onResizeStop={(w) => setWidth(w)}
      >
        {content}
      </DialResizableContainer>
    </div>
  );
};

const meta: Meta<typeof DialResizableContainer> = {
  title: 'Components/ResizableContainer',
  component: DialResizableContainer,
  tags: ['layout', 'resizable', 'container'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A resizable container that supports controlled and uncontrolled modes, left/right resizing, and custom resize handles.',
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description: 'Content rendered inside the resizable container (JSX).',
    },
    minWidth: {
      control: { type: 'number' },
      description: 'Minimum allowed width.',
    },
    maxWidth: {
      control: { type: 'number' },
      description: 'Maximum allowed width.',
    },
    width: {
      control: { type: 'number' },
      description: 'Controlled width. Omit for uncontrolled mode.',
    },
    defaultWidth: {
      control: { type: 'number' },
      description: 'Initial width for uncontrolled mode.',
    },
    side: {
      control: { type: 'select' },
      options: Object.values(ResizableContainerSide),
      description: 'Which side the resize handle appears on.',
    },
    resizeHandlerClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the resize handle.',
    },
    resizeHandler: {
      control: false,
      description: 'Custom handler ReactNode.',
    },
    onResizeStop: {
      control: false,
    },
    onResize: {
      control: false,
    },
  },
  args: {
    minWidth: 150,
    maxWidth: 500,
    defaultWidth: 260,
    side: ResizableContainerSide.Right,
    children: (
      <div className="p-4 text-primary">
        <div className="font-medium">Default children content</div>
        <div className="text-sm opacity-80">
          Pass custom JSX via the `children` arg.
        </div>
      </div>
    ),
  },
  render: InteractiveResizable,
};

export default meta;

type Story = StoryObj<typeof DialResizableContainer>;

export const Uncontrolled: Story = {
  args: {
    defaultWidth: 260,
  },
};

export const Controlled: Story = {
  args: {
    width: 300,
    defaultWidth: 300,
    children: (
      <div className="p-4 text-primary">
        <div>Controlled content</div>
        <div className="dial-small opacity-70">
          Width is controlled by the story wrapper
        </div>
      </div>
    ),
  },
};

export const ResizeFromLeft: Story = {
  args: {
    defaultWidth: 260,
    side: ResizableContainerSide.Left,
    children: (
      <div className="p-4 text-primary">
        <div>Left-side handle</div>
      </div>
    ),
  },
  render: (args) => (
    <div className="flex justify-end h-full">
      <InteractiveResizable {...args} />
    </div>
  ),
};

export const CustomHandler: Story = {
  args: {
    defaultWidth: 260,
    resizeHandler: <IconGripVertical className="h-4 w-4" />,
    resizeHandlerClassName: 'bg-error text-error w-2',
    children: (
      <div className="p-4 text-primary">
        <div>Custom handler example</div>
      </div>
    ),
  },
};
