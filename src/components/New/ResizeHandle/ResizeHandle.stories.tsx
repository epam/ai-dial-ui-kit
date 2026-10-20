import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { ResizeHandle, type ResizeHandleProps } from './ResizeHandle';

const Layout = ({
  width: initialWidth,
  dir,
  ...args
}: ResizeHandleProps & { dir?: 'ltr' | 'rtl' }) => {
  const [width, setWidth] = useState(initialWidth);

  return (
    <div dir={dir} className="flex h-[280px] bg-layer-base">
      <div
        className="relative shrink-0 p-4"
        style={{ width: `${width}px` }}
        data-testid="panel"
      >
        <div className="dial-small-semi-text text-primary">Left column</div>
        <div className="dial-small-paragraph-text text-secondary">
          Width: {width}px. Drag the edge, or focus it and use the arrow keys —
          Home and End jump to the bounds, a double click resets the width.
        </div>
        <ResizeHandle {...args} width={width} onWidthChange={setWidth} />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <p className="dial-small-text text-secondary">Main content area</p>
      </div>
    </div>
  );
};

const meta = {
  title: 'Components_2_0/ResizeHandle',
  component: ResizeHandle,
  tags: ['layout', 'resizable', 'splitter'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A vertical separator on the inline-end edge of a panel that resizes the panel by pointer or keyboard. It is controlled: the host applies the reported width. The accent line and the hint appear once the pointer has rested on it, and a themed arrow replaces the native cursor.',
      },
    },
  },
  argTypes: {
    width: {
      control: { type: 'number' },
      description: 'Current width of the panel in px',
    },
    minWidth: {
      control: { type: 'number' },
      description: 'Smallest width in px',
    },
    maxWidth: {
      control: { type: 'number' },
      description: 'Largest width in px',
    },
    defaultWidth: {
      control: { type: 'number' },
      description: 'Width a double click resets to',
    },
    onWidthChange: {
      control: false,
      description: 'Called with the next, limited width',
    },
    label: { control: 'text', description: 'Accessible name of the separator' },
    tooltip: {
      control: 'text',
      description: 'Hint shown once the pointer rests on the handle',
    },
    keyboardStep: {
      control: { type: 'number' },
      description: 'Width change of one arrow key press in px',
    },
    className: { control: false },
  },
  args: {
    width: 400,
    minWidth: 280,
    maxWidth: 640,
    defaultWidth: 400,
    label: 'Resize columns',
    tooltip: 'Drag to resize',
    onWidthChange: () => {},
  },
  render: (args) => <Layout {...args} />,
} satisfies Meta<ResizeHandleProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Drag and arrow keys follow the writing direction, and the hint opens on the other side. */
export const RightToLeft: Story = {
  render: (args) => <Layout {...args} dir="rtl" />,
};

export const WithoutTooltip: Story = {
  args: { tooltip: undefined },
};

export const CustomKeyboardStep: Story = {
  args: { keyboardStep: 48 },
};
