import {
  IconBookmark,
  IconBookmarkFilled,
  IconHeart,
  IconHeartFilled,
  IconPin,
  IconPinFilled,
} from '@tabler/icons-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment, useState } from 'react';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { ElementSize } from '@/types/size';
import {
  ToggleIconButton,
  type ToggleIconButtonProps,
} from './ToggleIconButton';

const InteractiveToggleIconButton = (args: ToggleIconButtonProps) => {
  const [isSelected, setIsSelected] = useState(args.isSelected);

  return (
    <ToggleIconButton
      {...args}
      isSelected={isSelected}
      onToggle={setIsSelected}
    />
  );
};

const meta = {
  title: 'Components_2_0/ToggleIconButton',
  component: ToggleIconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An icon button that stays pressed, for a setting the icon itself represents. The state rides on `aria-pressed`, so it is announced as a toggle rather than named differently in each state.',
      },
    },
  },
  argTypes: {
    icon: {
      control: false,
      description: 'Icon shown while unselected',
    },
    selectedIcon: {
      control: false,
      description: 'Icon shown while selected; falls back to `icon`',
    },
    isSelected: {
      control: 'boolean',
      description: 'Whether the toggle is on',
    },
    size: {
      control: 'select',
      options: Object.values(ElementSize),
      description: 'Defines the size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    onToggle: {
      action: 'toggled',
      control: false,
      description: 'Callback fired with the next value when clicked',
    },
    tooltipProps: {
      control: 'object',
      description: 'Props of the 2.0 `Tooltip` wrapping the button',
    },
  },
} satisfies Meta<typeof ToggleIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveToggleIconButton,
  args: {
    icon: <IconBookmark stroke={DIAL_KIT_ICON_STROKE} />,
    selectedIcon: <IconBookmarkFilled />,
    tooltipProps: { tooltip: 'Bookmark' },
  },
};

export const Selected: Story = {
  render: InteractiveToggleIconButton,
  args: {
    icon: <IconBookmark stroke={DIAL_KIT_ICON_STROKE} />,
    selectedIcon: <IconBookmarkFilled />,
    isSelected: true,
    tooltipProps: { tooltip: 'Bookmark' },
  },
};

export const Disabled: Story = {
  args: {
    icon: <IconBookmark stroke={DIAL_KIT_ICON_STROKE} />,
    selectedIcon: <IconBookmarkFilled />,
    disabled: true,
    'aria-label': 'Bookmark',
  },
};

export const DisabledSelected: Story = {
  args: {
    icon: <IconBookmark stroke={DIAL_KIT_ICON_STROKE} />,
    selectedIcon: <IconBookmarkFilled />,
    isSelected: true,
    disabled: true,
    'aria-label': 'Bookmark',
  },
};

/**
 * Without `selectedIcon` the same glyph is used in both states, so only the
 * accent colour and `aria-pressed` distinguish them.
 */
export const SingleIcon: Story = {
  render: InteractiveToggleIconButton,
  args: {
    icon: <IconPin stroke={DIAL_KIT_ICON_STROKE} />,
    tooltipProps: { tooltip: 'Pin' },
  },
};

/**
 * The Unselected / Selected × Default / Disable matrix from the design spec.
 * Hover, active and focus are interaction states — hover, hold or tab to a
 * control to see them.
 */
export const AllVariants: Story = {
  args: { icon: <IconBookmark stroke={DIAL_KIT_ICON_STROKE} /> },
  render: () => {
    const rows: { title: string; disabled?: boolean }[] = [
      { title: 'Default' },
      { title: 'Disable', disabled: true },
    ];

    return (
      <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-x-10 gap-y-6 p-8">
        <span />
        <span className="text-primary dial-small-semi-text">Unselected</span>
        <span className="text-primary dial-small-semi-text">Selected</span>

        {rows.map((row) => (
          <Fragment key={row.title}>
            <span className="text-secondary dial-small-text">{row.title}</span>
            {[false, true].map((isSelected) => (
              <ToggleIconButton
                key={`${row.title}-${String(isSelected)}`}
                icon={<IconBookmark stroke={DIAL_KIT_ICON_STROKE} />}
                selectedIcon={<IconBookmarkFilled />}
                isSelected={isSelected}
                disabled={row.disabled}
                aria-label="Bookmark"
              />
            ))}
          </Fragment>
        ))}
      </div>
    );
  },
};

/** Every size tier. The 16px glyph is fixed, so only the tint square grows. */
export const Sizes: Story = {
  args: { icon: <IconHeart stroke={DIAL_KIT_ICON_STROKE} /> },
  render: () => (
    <div className="flex items-center gap-6 p-8">
      {Object.values(ElementSize).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <span className="text-secondary dial-tiny-text">{size}</span>
          <ToggleIconButton
            icon={<IconHeart stroke={DIAL_KIT_ICON_STROKE} />}
            selectedIcon={<IconHeartFilled />}
            size={size}
            isSelected
            aria-label={`Favourite (${size})`}
          />
        </div>
      ))}
    </div>
  ),
};

/** A row of toggles, each holding its own state. */
export const Toolbar: Story = {
  args: { icon: <IconBookmark stroke={DIAL_KIT_ICON_STROKE} /> },
  render: () => {
    const ToolbarExample = () => {
      const [active, setActive] = useState<string[]>(['bookmark']);
      const toggles = [
        {
          key: 'bookmark',
          label: 'Bookmark',
          icon: <IconBookmark stroke={DIAL_KIT_ICON_STROKE} />,
          selectedIcon: <IconBookmarkFilled />,
        },
        {
          key: 'favourite',
          label: 'Favourite',
          icon: <IconHeart stroke={DIAL_KIT_ICON_STROKE} />,
          selectedIcon: <IconHeartFilled />,
        },
        {
          key: 'pin',
          label: 'Pin',
          icon: <IconPin stroke={DIAL_KIT_ICON_STROKE} />,
          selectedIcon: <IconPinFilled />,
        },
      ];

      return (
        <div className="flex items-center gap-2 p-8">
          {toggles.map((toggle) => (
            <ToggleIconButton
              key={toggle.key}
              icon={toggle.icon}
              selectedIcon={toggle.selectedIcon}
              isSelected={active.includes(toggle.key)}
              onToggle={(isSelected) =>
                setActive((current) =>
                  isSelected
                    ? [...current, toggle.key]
                    : current.filter((item) => item !== toggle.key),
                )
              }
              tooltipProps={{ tooltip: toggle.label }}
            />
          ))}
        </div>
      );
    };

    return <ToolbarExample />;
  },
};
