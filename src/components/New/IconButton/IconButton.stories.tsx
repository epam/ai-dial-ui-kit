import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconRepeat, IconSettings } from '@tabler/icons-react';
import type { ReactNode } from 'react';

import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { ElementSize } from '@/types/size';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { IconButton, type IconButtonProps } from './IconButton';
import {
  DangerIconButton,
  GhostIconButton,
  NeutralIconButton,
  PrimaryIconButton,
} from './IconButtonWrappers';

const meta = {
  title: 'Components_2.0/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An icon-only button component. Has all properties from the standard `ButtonHTMLAttributes<HTMLButtonElement>` extended with additional ones for variant, appearance, and size.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.values(ButtonVariant),
      description: 'Button style variant',
    },
    appearance: {
      control: { type: 'select' },
      options: Object.values(ButtonAppearance).filter(
        (appearance) => appearance !== ButtonAppearance.Link,
      ),
      description: 'Button appearance',
    },
    size: {
      control: { type: 'select' },
      options: [ElementSize.Standard, ElementSize.Small],
      description: 'Button size',
    },
    icon: {
      control: false,
      description: 'Icon to display inside the button',
    },
    tooltipProps: {
      control: false,
      description: 'Props forwarded to the tooltip wrapping the button',
    },
  },
  args: {
    variant: ButtonVariant.Primary,
    appearance: ButtonAppearance.Solid,
    size: ElementSize.Standard,
    disabled: false,
    icon: <IconRepeat size={DIAL_ICON_SIZE.MD} />,
    'aria-label': 'Settings',
  },
} satisfies Meta<IconButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
};

export const Focus: Story = {
  parameters: { pseudo: { focusVisible: true } },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Small: Story = {
  args: {
    size: ElementSize.Small,
    icon: <IconSettings size={DIAL_ICON_SIZE.SM} />,
  },
};

export const WithTooltip: Story = {
  args: {
    tooltipProps: { tooltip: 'Settings' },
  },
};

const STATE_ROWS = [
  {
    label: 'Default',
    disabled: false,
  },
  {
    label: 'Disable',
    disabled: true,
  },
] satisfies { label: string; disabled: boolean }[];

export const AllVariants: Story = {
  render: () => {
    const columns: {
      title: string;
      render: (p: IconButtonProps) => ReactNode;
    }[] = [
      {
        title: 'Primary · Solid',
        render: (p) => (
          <PrimaryIconButton {...p} appearance={ButtonAppearance.Solid} />
        ),
      },
      {
        title: 'Neutral · Solid',
        render: (p) => <NeutralIconButton {...p} />,
      },
      {
        title: 'Primary · Ghost',
        render: (p) => <GhostIconButton {...p} />,
      },
      {
        title: 'Danger · Ghost',
        render: (p) => (
          <DangerIconButton {...p} appearance={ButtonAppearance.Ghost} />
        ),
      },
      {
        title: 'Neutral · Outlined',
        render: (p) => (
          <IconButton
            {...p}
            variant={ButtonVariant.Neutral}
            appearance={ButtonAppearance.Outlined}
          />
        ),
      },
      {
        title: 'Static · Solid',
        render: (p) => (
          <IconButton
            {...p}
            variant={ButtonVariant.Static}
            appearance={ButtonAppearance.Solid}
          />
        ),
      },
    ];

    return (
      <div className="inline-flex flex-col gap-y-4 overflow-auto">
        <div className="flex items-center gap-x-8">
          <div className="w-28 shrink-0" />
          {columns.map(({ title }) => (
            <div
              key={title}
              className="flex-1 basis-0 text-center font-semibold text-primary"
            >
              {title}
            </div>
          ))}
        </div>
        {STATE_ROWS.map(({ label, disabled }) => (
          <div key={label} className="flex items-center gap-x-8">
            <div className="flex w-28 shrink-0 items-center justify-start text-sm text-secondary">
              {label}
            </div>
            {columns.map(({ title, render }) => (
              <div
                key={`${label}-${title}`}
                className="flex flex-1 basis-0 items-center justify-center gap-x-2"
              >
                {[ElementSize.Standard, ElementSize.Small].map((size) => {
                  const iconSize =
                    size === ElementSize.Small
                      ? DIAL_ICON_SIZE.SM
                      : DIAL_ICON_SIZE.MD;

                  return (
                    <div key={size}>
                      {render({
                        icon: <IconSettings size={iconSize} />,
                        'aria-label': 'Settings',
                        disabled,
                        size,
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Matrix of primary/neutral/danger variants with solid, ghost, and outlined appearances, shown across standard/small sizes and default/disabled states.',
      },
    },
  },
};
