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
  title: 'Components_2_0/Button',
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
    sizes: [ElementSize.Standard, ElementSize.Small],
  },
  {
    label: 'Disable',
    stateClassName: undefined,
    disabled: true,
    sizes: [ElementSize.Standard, ElementSize.Small],
  },
] satisfies {
  label: string;
  stateClassName: string | undefined;
  disabled: boolean;
  sizes: ElementSize[];
}[];

export const Focus: Story = {
  parameters: {
    pseudo: { focusVisible: true },
    docs: {
      description: {
        story:
          'Keyboard focus state — a 1px outline painted with the `--stroke-focus-black` token.',
      },
    },
  },
};

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
        title: 'Neutral · Solid',
        render: (p) => <NeutralButton {...p} />,
      },
      {
        title: 'Danger · Solid',
        render: (p) => (
          <DangerButton {...p} appearance={ButtonAppearance.Solid} />
        ),
      },
      {
        title: 'Primary · Ghost',
        render: (p) => <GhostButton {...p} />,
      },

      {
        title: 'Danger · Ghost',
        render: (p) => (
          <DangerButton {...p} appearance={ButtonAppearance.Ghost} />
        ),
      },
      {
        title: 'Neutral · Outlined',
        render: (p) => <OutlinedButton {...p} />,
      },
      {
        title: 'Danger · Outlined',
        render: (p) => (
          <DangerButton {...p} appearance={ButtonAppearance.Outlined} />
        ),
      },
      {
        title: 'Primary · Link',
        render: (p) => <LinkButton {...p} />,
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
        {STATE_ROWS.map(({ label, stateClassName, disabled, sizes }) => (
          <div key={label} className="flex items-center gap-x-8">
            <div className="flex w-28 shrink-0 items-center justify-start text-sm text-secondary">
              {label}
            </div>
            {columns.map(({ title, render }) => (
              <div
                key={`${label}-${title}`}
                className="flex flex-1 basis-0 items-center justify-center gap-x-2"
              >
                {sizes.map((size) => {
                  const iconSize =
                    size === ElementSize.Small
                      ? DIAL_ICON_SIZE.SM
                      : DIAL_ICON_SIZE.MD;

                  return (
                    <Fragment key={size}>
                      {render({
                        label: 'Button',
                        iconAfter: <IconArrowRight size={iconSize} />,
                        iconBefore: <IconArrowLeft size={iconSize} />,
                        className: stateClassName,
                        disabled,
                        size,
                      })}
                    </Fragment>
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
          'Matrix of primary/neutral/danger variants with solid, ghost, link, and outlined appearances, shown across default, hover, active, and disabled states.',
      },
    },
  },
};

export const AsLink: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-y-3">
      <LinkButton label="Same tab" href="#same-tab" />
      <LinkButton
        label="New tab"
        href="https://epam.github.io/ai-dial/"
        target="_blank"
      />
      <LinkButton label="Disabled link" href="#unreachable" disabled />
      <LinkButton label="No href — stays a button" onClick={() => undefined} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Passing `href` renders a real `<a>`, so the control keeps the link role, middle-click, and "open in new tab". `target="_blank"` gets `rel="noopener noreferrer"` unless `rel` is set explicitly. A disabled link drops its `href` and leaves the tab order, and is marked `aria-disabled` since an anchor has no disabled state.',
      },
    },
  },
};
