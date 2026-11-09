import { IconCode, IconPhoto, IconWorld } from '@tabler/icons-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ToggleChip } from './ToggleChip';

const meta = {
  title: 'Components_2_0/ToggleChip',
  component: ToggleChip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A chip that switches one option on and off on its own — a native `<button aria-pressed>` drawn as the selectable filter chip. Use it for a row of independent toggles; `FilterChips` picks one value out of several, and `Tag` is a label that may be clicked or removed.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description:
        'Content after the icon; any node, so trailing state text can follow the name',
    },
    icon: {
      control: false,
      description: 'Icon rendered before the label',
    },
    isSelected: {
      control: 'boolean',
      description: 'Whether the chip is on; rendered as `aria-pressed`',
    },
    onToggle: {
      action: 'toggled',
      control: false,
      description: 'Called with the next value when the chip is activated',
    },
    disabled: {
      control: 'boolean',
      description: 'Greys the chip out and stops it responding',
    },
    className: {
      control: 'text',
      description: 'Additional classes on the button',
    },
  },
  args: {
    label: 'Web search',
    isSelected: false,
    disabled: false,
  },
} satisfies Meta<typeof ToggleChip>;

export default meta;
type Story = StoryObj<typeof meta>;

const iconProps = { size: DIAL_ICON_SIZE.SM, stroke: DIAL_KIT_ICON_STROKE };

export const Default: Story = {
  args: { icon: <IconWorld {...iconProps} /> },
};

export const Selected: Story = {
  args: { icon: <IconWorld {...iconProps} />, isSelected: true },
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex gap-2">
      <ToggleChip
        icon={<IconWorld {...iconProps} />}
        label="Web search"
        disabled
      />
      <ToggleChip
        icon={<IconWorld {...iconProps} />}
        label="Web search"
        isSelected
        disabled
      />
    </div>
  ),
};

interface Tool {
  id: string;
  label: string;
  icon: ReactNode;
}

const TOOLS: Tool[] = [
  { id: 'search', label: 'Web search', icon: <IconWorld {...iconProps} /> },
  { id: 'code', label: 'Code interpreter', icon: <IconCode {...iconProps} /> },
  {
    id: 'image',
    label: 'Image generation',
    icon: <IconPhoto {...iconProps} />,
  },
];

const ToolRow = () => {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    search: true,
  });

  return (
    <div role="group" aria-label="Tools" className="flex flex-wrap gap-1">
      {TOOLS.map((tool) => {
        const isOn = Boolean(enabled[tool.id]);

        return (
          <ToggleChip
            key={tool.id}
            icon={tool.icon}
            label={
              <>
                {tool.label}
                <span aria-hidden="true">: {isOn ? 'ON' : 'OFF'}</span>
              </>
            }
            isSelected={isOn}
            onToggle={(next) =>
              setEnabled((current) => ({ ...current, [tool.id]: next }))
            }
          />
        );
      })}
    </div>
  );
};

/**
 * A row of independent toggles, each with visible ON / OFF state text after
 * its name. The state text is `aria-hidden`: the chip already announces
 * "pressed", and its accessible name stays the same in both states.
 */
export const ToolRowWithStateText: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ToolRow />,
};
