import { ButtonAppearance, ButtonSize, ButtonVariant } from '@/types/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconRefresh } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { DialIconButton, type DialIconButtonProps } from './IconButton';
import {
  DialErrorIconButton,
  DialNeutralIconButton,
  DialPrimaryIconButton,
  DialSecondaryIconButton,
  DialSuccessIconButton,
  DialTertiaryIconButton,
} from './IconButtonWrappers';

const meta = {
  title: 'Dial/Elements/IconButton',
  component: DialIconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A icon button component. Has all properties from the standard `ButtonHTMLAttributes<HTMLButtonElement>` extended with additional ones for variant, icons, and text styling.',
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
      options: [
        ButtonAppearance.Ghost,
        ButtonAppearance.Link,
        ButtonAppearance.Solid,
        ButtonAppearance.Outlined,
      ],
      description: 'Icon Button appearance',
    },
    size: {
      control: { type: 'select' },
      options: [ButtonSize.Standard, ButtonSize.Small],
      description: 'Button size',
    },
    icon: {
      control: false,
      description: 'Icon or element to display in the button',
    },
  },
  args: {
    variant: ButtonVariant.Primary,
    appearance: ButtonAppearance.Solid,
    size: ButtonSize.Standard,
    disabled: false,
    icon: <IconRefresh size={24} stroke={1.5} />,
  },
} satisfies Meta<DialIconButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimarySolidIconButton: Story = {
  args: {
    variant: ButtonVariant.Primary,
  },
};

export const NeutralOutlinedIconButton: Story = {
  args: {
    variant: ButtonVariant.Neutral,
    appearance: ButtonAppearance.Outlined,
  },
};

export const IconButtonWithTooltip: Story = {
  args: {
    tooltipProps: { tooltip: 'Custom tooltip text' },
    variant: ButtonVariant.Neutral,
    appearance: ButtonAppearance.Outlined,
  },
};

export const ErrorSolidIconButton: Story = {
  args: {
    variant: ButtonVariant.Error,
    appearance: ButtonAppearance.Solid,
  },
};

export const Hover: Story = {
  args: {
    variant: ButtonVariant.Primary,
  },
  parameters: {
    pseudo: {
      hover: true,
    },
  },
};

export const Focus: Story = {
  args: {
    variant: ButtonVariant.Primary,
  },
  parameters: {
    pseudo: {
      focus: true,
    },
  },
};

export const Active: Story = {
  args: {
    variant: ButtonVariant.Primary,
  },
  parameters: {
    pseudo: {
      active: true,
    },
  },
};

export const AllVariants: Story = {
  render: () => {
    const baseProps: DialIconButtonProps = {
      icon: <IconRefresh size={24} stroke={1.5} />,
    };

    const smallProps: DialIconButtonProps = {
      icon: <IconRefresh size={16} stroke={1.5} />,
      size: ButtonSize.Small,
    };

    const blocks: {
      title: string;
      render: (p: DialIconButtonProps) => ReactNode;
    }[] = [
      {
        title: 'Primary · Solid',
        render: (p) => (
          <DialPrimaryIconButton {...p} appearance={ButtonAppearance.Solid} />
        ),
      },
      {
        title: 'Neutral · Outlined',
        render: (p) => (
          <DialNeutralIconButton
            {...p}
            appearance={ButtonAppearance.Outlined}
          />
        ),
      },

      {
        title: 'Primary · Ghost', // TODO: AAAA
        render: (p) => (
          <DialPrimaryIconButton {...p} appearance={ButtonAppearance.Ghost} />
        ),
      },

      {
        title: 'Secondary · Ghost',
        render: (p) => <DialSecondaryIconButton {...p} />,
      },

      {
        title: 'Tertiary · Ghost',
        render: (p) => <DialTertiaryIconButton {...p} />,
      },

      {
        title: 'Error · Ghost',
        render: (p) => (
          <DialErrorIconButton {...p} appearance={ButtonAppearance.Ghost} />
        ),
      },
      {
        title: 'Success · Ghost',
        render: (p) => <DialSuccessIconButton {...p} />,
      },
    ];

    return (
      <div className="flex flex-row gap-8 flex-wrap">
        {blocks.map(({ title, render }) => (
          <div key={title} className="flex flex-col gap-4">
            <div className="font-bold text-primary">{title}</div>
            <div className="flex flex-row flex-wrap gap-4 items-center">
              {render(baseProps)}
              {render({ ...baseProps, disabled: true })}
              {render(smallProps)}
              {render({ ...smallProps, disabled: true })}
            </div>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Matrix of primary/neutral/error variants with solid, ghost, link, and outlined appearances, shown in standard and small sizes with enabled/disabled states.',
      },
    },
  },
};
