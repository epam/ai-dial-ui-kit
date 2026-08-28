import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconGripVertical } from '@tabler/icons-react';
import { useState } from 'react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { ResizableContainerSide } from '@/types/resizable-container';
import {
  ResizableContainer,
  type ResizableContainerProps,
} from './ResizableContainer';

const PanelContent = (
  <div className="flex flex-col gap-1 p-4">
    <div className="dial-small-semi-text text-primary">Resizable panel</div>
    <div className="dial-small-paragraph-text text-secondary">
      Drag the edge, or focus it with the keyboard and use the arrow keys — Home
      and End jump to the bounds.
    </div>
  </div>
);

const Layout = (args: ResizableContainerProps) => (
  <div className="flex h-[280px] bg-layer-base">
    <ResizableContainer {...args} />
    <div className="flex flex-1 items-center justify-center">
      <p className="dial-small-text text-secondary">Main content area</p>
    </div>
  </div>
);

const meta = {
  title: 'Components_2_0/ResizableContainer',
  component: ResizableContainer,
  tags: ['layout', 'resizable', 'container'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A panel the user can widen or narrow by dragging its edge, in controlled or uncontrolled mode, from either side. The handle is a focusable `separator`, so the panel is also resizable with the arrow keys.',
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description: 'Content rendered inside the container',
    },
    minWidth: {
      control: { type: 'number' },
      description: 'Minimum width in px',
    },
    maxWidth: {
      control: { type: 'number' },
      description: 'Maximum width in px',
    },
    width: {
      control: { type: 'number' },
      description: 'Controlled width. Omit for uncontrolled mode',
    },
    defaultWidth: {
      control: { type: 'number' },
      description: 'Initial width when uncontrolled',
    },
    side: {
      control: { type: 'select' },
      options: Object.values(ResizableContainerSide),
      description: 'Edge carrying the resize handle',
    },
    keyboardStep: {
      control: { type: 'number' },
      description: 'Width change per arrow key press',
    },
    resizeHandlerClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the handle',
    },
    resizeHandler: {
      control: false,
      description:
        'Custom node rendered inside the handle, in place of the default chevron',
    },
    onResize: { control: false },
    onResizeStop: { control: false },
  },
  args: {
    minWidth: 150,
    maxWidth: 500,
    defaultWidth: 260,
    side: ResizableContainerSide.Right,
    children: PanelContent,
  },
  render: Layout,
} satisfies Meta<ResizableContainerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Uncontrolled: Story = {};

const ControlledStory = (args: ResizableContainerProps) => {
  const [width, setWidth] = useState(args.defaultWidth ?? args.minWidth);

  return (
    <div className="flex h-[280px] bg-layer-base">
      <ResizableContainer {...args} width={width} onResizeStop={setWidth}>
        <div className="flex flex-col gap-1 p-4">
          <div className="dial-small-semi-text text-primary">
            Controlled panel
          </div>
          <div className="dial-small-paragraph-text text-secondary">
            Width is owned by the story: {width}px
          </div>
        </div>
      </ResizableContainer>
      <div className="flex flex-1 items-center justify-center">
        <p className="dial-small-text text-secondary">Main content area</p>
      </div>
    </div>
  );
};

export const Controlled: Story = {
  render: ControlledStory,
};

export const ResizeFromLeft: Story = {
  args: {
    side: ResizableContainerSide.Left,
  },
  render: (args) => (
    <div className="flex h-[280px] justify-end bg-layer-base">
      <ResizableContainer {...args} />
    </div>
  ),
};

export const WithDividers: Story = {
  args: {
    className: 'divide-y divide-tertiary',
    children: (
      <>
        <div className="p-4 dial-small-semi-text text-primary">Header</div>
        <div className="flex-1 p-4 dial-small-text text-secondary">Body</div>
        <div className="p-4 dial-small-text text-secondary">Footer</div>
      </>
    ),
  },
};

export const CustomHandler: Story = {
  args: {
    resizeHandler: (
      <IconGripVertical
        stroke={DIAL_KIT_ICON_STROKE}
        className="size-4 text-accent"
        aria-hidden="true"
      />
    ),
    resizeHandlerClassName: 'w-1 flex items-center justify-center',
  },
};
