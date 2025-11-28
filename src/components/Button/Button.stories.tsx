import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialButton, type DialButtonProps } from './Button';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { ButtonVariant } from '@/types/button';
import { Fragment } from 'react/jsx-runtime';

const meta = {
  title: 'Form/Button',
  component: DialButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: { component: 'A button component.' },
    },
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Button text content',
    },
    variant: {
      control: { type: 'select' },
      options: [
        ButtonVariant.Primary,
        ButtonVariant.Secondary,
        ButtonVariant.Tertiary,
      ],
      description: 'Button style variant',
    },
    className: {
      control: { type: 'text' },
      description: 'Button additional styles',
    },
    textClassName: {
      control: { type: 'text' },
      description:
        'Additional CSS classes to apply specifically to the button text',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    hideTitleOnMobile: {
      control: { type: 'boolean' },
      description: 'Hide title text on mobile devices',
    },
    iconBefore: {
      control: false,
      description: 'Icon or element to display before the button text',
    },
    iconAfter: {
      control: false,
      description: 'Icon or element to display after the button text',
    },
    'aria-label': {
      control: { type: 'text' },
      description: 'Accessibility label (used when label is not provided)',
    },
    onClick: {
      control: false,
      description: 'Click event handler for the button',
    },
    ref: {
      control: false,
      description: 'Ref to access the button DOM element',
    },
  },
  args: {
    label: 'Button',
    variant: ButtonVariant.Primary,
    disabled: false,
    hideTitleOnMobile: false,
  },
} satisfies Meta<DialButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryButton: Story = {
  args: {
    label: 'Primary Button',
    variant: ButtonVariant.Primary,
  },
};

export const SecondaryButton: Story = {
  args: {
    label: 'Secondary Button',
    variant: ButtonVariant.Secondary,
  },
};
export const TertiaryButton: Story = {
  args: {
    label: 'Tertiary Button',
    variant: ButtonVariant.Tertiary,
  },
};

export const DangerButton: Story = {
  args: {
    label: 'Danger Button',
    variant: ButtonVariant.Danger,
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Action',
    iconAfter: <IconArrowRight size={16} />,
    iconBefore: <IconArrowLeft size={16} />,
  },
};

export const WithIconBefore: Story = {
  args: {
    label: 'Save',
    iconBefore: <IconArrowLeft size={16} />,
    variant: ButtonVariant.Primary,
  },
};

export const WithIconAfter: Story = {
  args: {
    label: 'Alert',
    iconAfter: <IconArrowRight size={16} />,
    className: 'dial-tertiary-button',
  },
};

export const WithCustomTextStyling: Story = {
  args: {
    label: 'Custom Text Styling',
    variant: ButtonVariant.Primary,
    textClassName: 'font-bold uppercase tracking-wider',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the textClassName prop which allows custom styling of the button text while keeping the button container styling intact.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    variant: ButtonVariant.Tertiary,
    disabled: true,
  },
};

export const Hover: Story = {
  args: {
    label: 'Hover Button',
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
    label: 'Focus Button',
    variant: ButtonVariant.Secondary,
  },
  parameters: {
    pseudo: {
      focus: true,
    },
  },
};

export const Active: Story = {
  args: {
    label: 'Active Button',
    variant: ButtonVariant.Tertiary,
  },
  parameters: {
    pseudo: {
      active: true,
    },
  },
};

export const AllVariants: Story = {
  render: () => {
    const variants = [
      { key: 'primary', label: 'Primary', variant: ButtonVariant.Primary },
      {
        key: 'secondary',
        label: 'Secondary',
        variant: ButtonVariant.Secondary,
      },
      { key: 'tertiary', label: 'Tertiary', variant: ButtonVariant.Tertiary },
      { key: 'danger', label: 'Danger', variant: ButtonVariant.Danger },
    ];

    const states = [
      { key: 'default', label: 'Default' },
      { key: 'hover', label: 'Hover' },
      { key: 'focus', label: 'Focus' },
      { key: 'active', label: 'Active' },
      { key: 'disable', label: 'Disable' },
    ];

    return (
      <div className="p-4 max-w-[1200px]">
        <div className="grid grid-cols-5 gap-8">
          {/* header row */}
          <div></div>
          {variants.map((v) => (
            <div
              key={v.key}
              className={'text-primary text-center font-semibold'}
            >
              {v.label}
            </div>
          ))}

          {states.map((state) => (
            <Fragment key={state.key}>
              <div className="text-primary text-right pr-4 py-2">
                {state.label}
              </div>
              {variants.map((v) => {
                const commonProps = {
                  label: 'Button label',
                  variant: v.variant,
                  iconBefore: <IconArrowLeft size={16} />,
                  iconAfter: <IconArrowRight size={16} />,
                };

                return (
                  <div
                    key={v.key}
                    className={`flex justify-center ${
                      state.key !== 'default' ? `state-${state.key}` : ''
                    }`}
                  >
                    <DialButton
                      {...commonProps}
                      disabled={state.key === 'disable'}
                    />
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    pseudo: {
      hover: ['.state-hover button'],
      focus: ['.state-focus button'],
      active: ['.state-active button'],
    },
    docs: {
      description: {
        story:
          'All button variants (Primary, Secondary, Tertiary, Danger) across all states.',
      },
    },
  },
};
