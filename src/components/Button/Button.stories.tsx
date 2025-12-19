import { ButtonAppearance, ButtonVariant } from '@/types/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { DialButton, type DialButtonProps } from './Button';
import {
  DialErrorButton,
  DialNeutralButton,
  DialPrimaryButton,
} from './Buttons';

const meta = {
  title: 'Form/Button',
  component: DialButton,
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
      options: [
        ButtonVariant.Primary,
        ButtonVariant.Secondary,
        ButtonVariant.Tertiary,
      ],
      description: 'Button style variant',
    },
    textClassName: {
      control: { type: 'text' },
      description:
        'Additional CSS classes to apply specifically to the button text',
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

export const PrimarySolidButton: Story = {
  args: {
    label: 'Primary Solid Button',
    variant: ButtonVariant.Primary,
  },
};

export const NeutralOutlinedButton: Story = {
  args: {
    label: 'Neutral Outlined Button',
    variant: ButtonVariant.Neutral,
    appearance: ButtonAppearance.Outlined,
  },
};

export const ErrorSolidButton: Story = {
  args: {
    label: 'Error Solid Button',
    variant: ButtonVariant.Error,
    appearance: ButtonAppearance.Solid,
  },
};

export const WithReactNodeLabel: Story = {
  args: {
    label: (
      <span>
        Custom <strong>React</strong> Label
      </span>
    ),
    variant: ButtonVariant.Primary,
    'aria-label': 'Custom React Label',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates that label can accept ReactNode for more complex content. Remember to provide aria-label for accessibility when using ReactNode.',
      },
    },
  },
};

export const WithIconAsLabel: Story = {
  args: {
    label: <IconArrowRight size={20} />,
    variant: ButtonVariant.Secondary,
    'aria-label': 'Arrow button',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Button with an icon as the label content. Requires aria-label for accessibility.',
      },
    },
  },
};

export const WithComplexLabel: Story = {
  args: {
    label: (
      <span className="flex items-center gap-1">
        <span className="dial-small">🔥</span>
        <span>Hot Deal</span>
      </span>
    ),
    variant: ButtonVariant.Primary,
    'aria-label': 'Hot Deal',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Example of a complex label with emoji and custom layout using ReactNode.',
      },
    },
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Action',
    iconAfter: <IconArrowRight size={20} />,
    iconBefore: <IconArrowLeft size={20} />,
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
    return (
      <div className="flex flex-row gap-x-12">
        <div className="flex flex-col gap-y-6">
          <div className="font-bold mb-2 text-primary">Primary Solid</div>
          <DialPrimaryButton label="Button" />
          <DialPrimaryButton label="Button" disabled />
        </div>

        <div className="flex flex-col gap-y-6">
          <div className="font-bold mb-2 text-primary">Neutral Outlined</div>
          <DialNeutralButton label="Button" />
          <DialNeutralButton label="Button" disabled />
        </div>

        <div className="flex flex-col gap-y-6">
          <div className="font-bold mb-2 text-primary">Primary Ghost</div>
          <DialPrimaryButton
            label="Button"
            appearance={ButtonAppearance.Ghost}
          />
          <DialPrimaryButton
            label="Button"
            appearance={ButtonAppearance.Ghost}
          />
        </div>

        <div className="flex flex-col gap-y-6">
          <div className="font-bold mb-2 text-primary">Primary Link</div>
          <DialPrimaryButton
            label="Button"
            appearance={ButtonAppearance.Link}
          />
          <DialPrimaryButton
            label="Button"
            appearance={ButtonAppearance.Link}
          />
        </div>

        <div className="flex flex-col gap-y-6">
          <div className="font-bold mb-2 text-primary">Error Solid</div>
          <DialErrorButton label="Button" />
          <DialErrorButton label="Button" />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'All button variants (Primary, Secondary, Tertiary, Danger) across all states.',
      },
    },
  },
};
