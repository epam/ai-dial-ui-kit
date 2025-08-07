import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialTooltip } from './Tooltip';
import { DialButton } from '@/components/Button/Button';
import { DialInput } from '@/components/Input/Input';

const meta = {
  title: 'Components/Tooltip',
  component: DialTooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A Tooltip component that displays information on hover or focus. Supports multiple positioning options and can be controlled or uncontrolled.',
      },
    },
  },
  argTypes: {
    tooltip: {
      control: { type: 'text' },
      description: 'The content to display in the tooltip',
    },
    hideTooltip: {
      control: { type: 'boolean' },
      description: 'Whether to hide the tooltip completely',
    },
    placement: {
      control: { type: 'select' },
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
      description: 'Where to position the tooltip relative to the trigger',
    },
    initialOpen: {
      control: { type: 'boolean' },
      description: 'Whether the tooltip should be initially open',
    },
    isTriggerClickable: {
      control: { type: 'boolean' },
      description:
        'Whether the trigger should only show tooltip on hover, not on focus',
    },
    triggerClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the trigger element',
    },
    contentClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the tooltip content',
    },
    children: {
      control: false,
      description: 'The element that triggers the tooltip',
    },
    open: {
      control: false,
      description: 'Controlled open state for the tooltip',
    },
    onOpenChange: {
      control: false,
      description: 'Callback fired when the tooltip open state changes',
    },
  },
  args: {
    tooltip: 'This is helpful tooltip information',
    hideTooltip: false,
    placement: 'bottom',
    initialOpen: false,
    isTriggerClickable: false,
  },
  render: (args) => (
    <DialTooltip
      contentClassName="text-primary dial-small"
      triggerClassName="text-primary"
      {...args}
    />
  ),
} satisfies Meta<typeof DialTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <DialButton title="Hover me" />,
  },
};

export const TopPlacement: Story = {
  args: {
    children: <DialButton title="Tooltip on top" />,
    placement: 'top',
    tooltip: 'This tooltip appears above the trigger',
  },
};

export const LeftPlacement: Story = {
  args: {
    children: <DialButton title="Tooltip on left" />,
    placement: 'left',
    tooltip: 'This tooltip appears to the left',
  },
};

export const RightPlacement: Story = {
  args: {
    children: <DialButton title="Tooltip on right" />,
    placement: 'right',
    tooltip: 'This tooltip appears to the right',
  },
};

export const LongContent: Story = {
  args: {
    children: <DialButton title="Long tooltip" />,
    tooltip:
      'This is a very long tooltip that demonstrates how the component handles longer text content. It should wrap properly and maintain readability.',
  },
};

export const InitiallyOpen: Story = {
  args: {
    children: <DialButton title="Initially open" />,
    tooltip: 'This tooltip starts open',
    initialOpen: true,
  },
};

export const OnlyMouse: Story = {
  args: {
    children: <div />,
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <DialTooltip
        tooltip="Tooltip only on hover"
        isTriggerClickable={true}
        placement="top"
        contentClassName="text-primary dial-small"
      >
        <DialInput inputId="clickable-input" value="Hover only" />
      </DialTooltip>
      <DialTooltip
        tooltip="Tooltip on focus and hover"
        placement="bottom"
        isTriggerClickable={false}
        contentClassName="text-primary dial-small"
      >
        <DialInput inputId="focusable-input" value="Hover and focus" />
      </DialTooltip>
    </div>
  ),
};

export const RichContent: Story = {
  args: {
    children: <DialButton title="Rich content" />,
    tooltip: (
      <div>
        <strong>Rich tooltip content</strong>
        <br />
        With <em>multiple</em> elements
        <br />
        • Bullet point 1
        <br />• Bullet point 2
      </div>
    ),
  },
};

export const AllPositions: Story = {
  args: {
    children: <div />,
  },
  render: () => (
    <div className="grid grid-cols-3 gap-x-[160px] gap-y-[80px] text-primary">
      {/* Top positions */}
      <DialTooltip
        tooltip="text"
        placement="top"
        initialOpen={true}
        contentClassName="text-primary dial-small"
      >
        <div className="bg-layer-3 p-1 rounded text-center">
          <div className="font-semibold">Top</div>

          <div>Multiline content</div>
        </div>
      </DialTooltip>

      <DialTooltip
        tooltip="text"
        placement="top-start"
        initialOpen={true}
        contentClassName="text-primary dial-small"
      >
        <div className="bg-layer-3 p-1 rounded text-center">
          <div className="font-semibold">Top Start</div>

          <div>Multiline content</div>
        </div>
      </DialTooltip>

      <DialTooltip
        tooltip="text"
        placement="top-end"
        initialOpen={true}
        contentClassName="text-primary dial-small"
      >
        <div className="bg-layer-3 p-1 rounded text-center">
          <div className="font-semibold">Top End</div>

          <div>Multiline content</div>
        </div>
      </DialTooltip>

      {/* Left positions */}
      <DialTooltip
        tooltip="text"
        placement="left"
        initialOpen={true}
        contentClassName="text-primary dial-small"
      >
        <div className="bg-layer-3 p-1 rounded text-center">
          <div className="font-semibold">Left</div>

          <div>Multiline content</div>
        </div>
      </DialTooltip>

      <DialTooltip
        tooltip="text"
        placement="left-start"
        initialOpen={true}
        contentClassName="text-primary dial-small"
      >
        <div className="bg-layer-3 p-1 rounded text-center">
          <div className="font-semibold">Left Start</div>

          <div>Multiline content</div>
        </div>
      </DialTooltip>

      <DialTooltip
        tooltip="text"
        placement="left-end"
        initialOpen={true}
        contentClassName="text-primary dial-small"
      >
        <div className="bg-layer-3 p-1 rounded text-center">
          <div className="font-semibold">Left End</div>

          <div>Multiline content</div>
        </div>
      </DialTooltip>

      {/* Right positions */}
      <DialTooltip
        tooltip="text"
        placement="right"
        initialOpen={true}
        contentClassName="text-primary dial-small"
      >
        <div className="bg-layer-3 p-1 rounded text-center">
          <div className="font-semibold">Right</div>

          <div>Multiline content</div>
        </div>
      </DialTooltip>

      <DialTooltip
        tooltip="text"
        placement="right-start"
        initialOpen={true}
        contentClassName="text-primary dial-small"
      >
        <div className="bg-layer-3 p-1 rounded text-center">
          <div className="font-semibold">Right Start</div>

          <div>Multiline content</div>
        </div>
      </DialTooltip>

      <DialTooltip
        tooltip="text"
        placement="right-end"
        initialOpen={true}
        contentClassName="text-primary dial-small"
      >
        <div className="bg-layer-3 p-1 rounded text-center">
          <div className="font-semibold">Right End</div>

          <div>Multiline content</div>
        </div>
      </DialTooltip>

      {/* Bottom positions */}
      <DialTooltip
        tooltip="text"
        placement="bottom"
        initialOpen={true}
        contentClassName="text-primary dial-small"
      >
        <div className="bg-layer-3 p-1 rounded text-center">
          <div className="font-semibold">Bottom</div>

          <div>Multiline content</div>
        </div>
      </DialTooltip>

      <DialTooltip
        tooltip="text"
        placement="bottom-start"
        initialOpen={true}
        contentClassName="text-primary dial-small"
      >
        <div className="bg-layer-3 p-1 rounded text-center">
          <div className="font-semibold">Bottom Start</div>

          <div>Multiline content</div>
        </div>
      </DialTooltip>

      <DialTooltip
        tooltip="text"
        placement="bottom-end"
        initialOpen={true}
        contentClassName="text-primary dial-small"
      >
        <div className="bg-layer-3 p-1 rounded text-center">
          <div className="font-semibold">Bottom End</div>

          <div>Multiline content</div>
        </div>
      </DialTooltip>
    </div>
  ),
};
