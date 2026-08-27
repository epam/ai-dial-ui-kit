import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { Button } from '../Button/Button';
import {
  ConditionalResizableContainer,
  type ConditionalResizableContainerProps,
} from './ConditionalResizableContainer';

const meta = {
  title: 'Components_2_0/ConditionalResizableContainer',
  component: ConditionalResizableContainer,
  tags: ['layout', 'resizable', 'container'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Renders its children inside a `ResizableContainer` only while `enabled`. When disabled the children are rendered on their own, with no wrapper element and no resize behaviour.',
      },
    },
  },
  argTypes: {
    enabled: {
      control: { type: 'boolean' },
      description: 'Whether resizing is enabled',
    },
    children: { control: false },
    onResize: { control: false },
    onResizeStop: { control: false },
  },
  args: {
    enabled: true,
    minWidth: 150,
    maxWidth: 500,
    defaultWidth: 260,
    children: (
      <div className="flex flex-col gap-1 p-4">
        <div className="dial-small-semi-text text-primary">Panel</div>
        <div className="dial-small-paragraph-text text-secondary">
          Resizable only while enabled.
        </div>
      </div>
    ),
  },
} satisfies Meta<ConditionalResizableContainerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Enabled: Story = {
  render: (args) => (
    <div className="flex h-[240px] bg-layer-base">
      <ConditionalResizableContainer {...args} />
      <div className="flex flex-1 items-center justify-center">
        <p className="dial-small-text text-secondary">Main content area</p>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: { enabled: false },
  render: Enabled.render,
};

const ToggleStory = (args: ConditionalResizableContainerProps) => {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex h-[240px] bg-layer-base">
      <ConditionalResizableContainer {...args} enabled={enabled} />
      <div className="flex flex-col items-start gap-2 p-4">
        <Button
          variant={ButtonVariant.Neutral}
          appearance={ButtonAppearance.Outlined}
          label={enabled ? 'Disable resizing' : 'Enable resizing'}
          onClick={() => setEnabled((value) => !value)}
        />
        <p className="dial-small-text text-secondary">
          Resizing: {enabled ? 'on' : 'off'}
        </p>
      </div>
    </div>
  );
};

export const Toggleable: Story = {
  render: ToggleStory,
};
