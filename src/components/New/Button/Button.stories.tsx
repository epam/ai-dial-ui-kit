import { ButtonAppearance, ButtonVariant } from '@/types/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { Fragment, type ReactNode } from 'react';
import { Button, type ButtonProps } from './Button';
import {
  DangerButton,
  GhostButton,
  LinkButton,
  NeutralButton,
  OutlinedButton,
  PrimaryButton,
} from './ButtonWrappers';
import { ElementSize } from '@/types/size';
import { DIAL_ICON_SIZE } from '@/constants/icon';

const meta = {
  title: 'Components_2.0/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A button component. Has all properties from the standard `ButtonHTMLAttributes<HTMLButtonElement>` extended with additional ones for variant, icons, and text styling.',
      },
    },
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Button label content',
    },
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
      description: 'Button appearance',
    },
    size: {
      control: { type: 'select' },
      options: [ElementSize.Standard, ElementSize.Small],
      description: 'Button size',
    },
    textClassName: {
      control: { type: 'text' },
      description:
        'Additional CSS classes to apply specifically to the button text',
    },
    iconBefore: {
      control: false,
      description: 'Icon or element to display before the button text',
    },
    iconAfter: {
      control: false,
      description: 'Icon or element to display after the button text',
    },
  },
  args: {
    label: 'Button',
    variant: ButtonVariant.Primary,
    appearance: ButtonAppearance.Solid,
    size: ElementSize.Standard,
    disabled: false,
  },
} satisfies Meta<ButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const STATE_ROWS = [
  {
    label: 'Default',
    stateClassName: undefined,
    disabled: false,
    size: ElementSize.Standard,
  },
  {
    label: 'Disable',
    stateClassName: undefined,
    disabled: true,
    size: ElementSize.Standard,
  },
  {
    label: 'Small',
    stateClassName: undefined,
    disabled: false,
    size: ElementSize.Small,
  },
  {
    label: 'Small · Disable',
    stateClassName: undefined,
    disabled: true,
    size: ElementSize.Small,
  },
] satisfies {
  label: string;
  stateClassName: string | undefined;
  disabled: boolean;
  size: ElementSize;
}[];

export const AllVariants: Story = {
  render: () => {
    const columns: {
      title: string;
      render: (p: ButtonProps) => ReactNode;
    }[] = [
      {
        title: 'Primary · Solid',
        render: (p) => (
          <PrimaryButton {...p} appearance={ButtonAppearance.Solid} />
        ),
      },
      {
        title: 'Primary · Ghost',
        render: (p) => <GhostButton {...p} />,
      },
      {
        title: 'Primary · Link',
        render: (p) => <LinkButton {...p} />,
      },
      {
        title: 'Neutral · Outlined',
        render: (p) => <OutlinedButton {...p} />,
      },
      {
        title: 'Danger · Solid',
        render: (p) => (
          <DangerButton {...p} appearance={ButtonAppearance.Solid} />
        ),
      },
      {
        title: 'Danger · Outlined',
        render: (p) => (
          <DangerButton {...p} appearance={ButtonAppearance.Outlined} />
        ),
      },
      {
        title: 'Danger · Ghost',
        render: (p) => (
          <DangerButton {...p} appearance={ButtonAppearance.Ghost} />
        ),
      },
      {
        title: 'Neutral · Solid',
        render: (p) => <NeutralButton {...p} />,
      },
    ];

    return (
      <div
        className="inline-grid items-center gap-x-8 gap-y-4"
        style={{
          gridTemplateColumns: `auto repeat(${columns.length}, minmax(0, auto))`,
        }}
      >
        <div />
        {columns.map(({ title }) => (
          <div key={title} className="text-center font-semibold text-primary">
            {title}
          </div>
        ))}
        {STATE_ROWS.map(({ label, stateClassName, disabled, size }) => {
          const iconSize =
            size === ElementSize.Small ? DIAL_ICON_SIZE.SM : DIAL_ICON_SIZE.MD;

          return (
            <Fragment key={label}>
              <div className="flex items-center justify-end text-sm text-secondary">
                {label}
              </div>
              {columns.map(({ title, render }) => (
                <div
                  key={`${label}-${title}`}
                  className="flex items-center justify-center"
                >
                  {render({
                    label: 'Button',
                    iconAfter: <IconArrowRight size={iconSize} />,
                    iconBefore: <IconArrowLeft size={iconSize} />,
                    className: stateClassName,
                    disabled,
                    size,
                  })}
                </div>
              ))}
            </Fragment>
          );
        })}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Matrix of primary/neutral/danger variants with solid, ghost, link, and outlined appearances, shown across default, hover, active, and disabled states.',
      },
    },
  },
};
