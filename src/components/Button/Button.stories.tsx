import { ButtonAppearance, ButtonVariant } from '@/types/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { DialButton, type DialButtonProps } from './Button';
import {
  DialErrorButton,
  DialGhostButton,
  DialLinkButton,
  DialNeutralButton,
  DialPrimaryButton,
} from './ButtonWrappers';
import { ElementSize } from '@/types/size';

const meta = {
  title: 'DIAL/Elements/Buttons/Button',
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
    appearance: ButtonAppearance.Solid,
    size: ElementSize.Standard,
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
    label: 'Active Button',
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
    const baseProps: DialButtonProps = {
      label: 'Standard',
      iconAfter: <IconArrowRight size={20} />,
      iconBefore: <IconArrowLeft size={20} />,
    };

    const smallProps: DialButtonProps = {
      label: 'Small',
      iconAfter: <IconArrowRight size={16} />,
      iconBefore: <IconArrowLeft size={16} />,
      size: ElementSize.Small,
    };

    const blocks: {
      title: string;
      render: (p: DialButtonProps) => ReactNode;
    }[] = [
      {
        title: 'Primary · Solid',
        render: (p) => (
          <DialPrimaryButton {...p} appearance={ButtonAppearance.Solid} />
        ),
      },
      {
        title: 'Primary · Ghost',
        render: (p) => (
          <DialPrimaryButton {...p} appearance={ButtonAppearance.Ghost} />
        ),
      },
      {
        title: 'Primary · Link',
        render: (p) => (
          <DialPrimaryButton {...p} appearance={ButtonAppearance.Link} />
        ),
      },
      {
        title: 'Neutral · Outlined',
        render: (p) => (
          <DialNeutralButton {...p} appearance={ButtonAppearance.Outlined} />
        ),
      },
      {
        title: 'Error · Solid',
        render: (p) => (
          <DialErrorButton {...p} appearance={ButtonAppearance.Solid} />
        ),
      },
      {
        title: 'Error · Outlined',
        render: (p) => (
          <DialErrorButton {...p} appearance={ButtonAppearance.Outlined} />
        ),
      },
      {
        title: 'Ghost Wrapper (Primary)',
        render: (p) => <DialGhostButton {...p} />,
      },
      {
        title: 'Link Wrapper (Primary)',
        render: (p) => <DialLinkButton {...p} />,
      },
    ];

    return (
      <div className="flex flex-col gap-8">
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

export const SmallPrimaryButton: Story = {
  args: {
    label: 'Small Primary',
    variant: ButtonVariant.Primary,
    size: ElementSize.Small,
  },
};

export const WithIconsBeforeAfter: Story = {
  args: {
    label: 'With Icons',
    variant: ButtonVariant.Primary,
    iconBefore: <IconArrowLeft size={20} />,
    iconAfter: <IconArrowRight size={20} />,
  },
};

export const IconOnlyButton: Story = {
  args: {
    variant: ButtonVariant.Primary,
    iconBefore: <IconArrowRight size={20} />,
    'aria-label': 'Next',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Icon-only button. Provide `aria-label` for accessibility when no text label is present.',
      },
    },
  },
};

export const HideTitleOnMobile: Story = {
  args: {
    label: 'Hidden on mobile',
    variant: ButtonVariant.Primary,
    hideTitleOnMobile: true,
    iconBefore: <IconArrowLeft size={20} />,
    iconAfter: <IconArrowRight size={20} />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows how `hideTitleOnMobile` keeps the label hidden on small screens while still rendering icons.',
      },
    },
  },
};

export const CustomTextClassName: Story = {
  args: {
    label: 'Custom text class',
    variant: ButtonVariant.Primary,
    textClassName: 'uppercase tracking-widest font-semibold',
  },
};

export const SubmitTypeButton: Story = {
  args: {
    label: 'Submit',
    variant: ButtonVariant.Primary,
    type: 'submit',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates using the native `type` prop (`submit`, `button`, `reset`).',
      },
    },
  },
};

export const LinkWrapperButton: Story = {
  render: (args) => <DialLinkButton {...args} />,
  args: {
    label: 'Link Button',
    iconAfter: <IconArrowRight size={20} />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Preconfigured Link appearance via `DialLinkButton` wrapper (primary variant by default).',
      },
    },
  },
};

export const GhostWrapperButton: Story = {
  render: (args) => <DialGhostButton {...args} />,
  args: {
    label: 'Ghost Button',
    iconBefore: <IconArrowLeft size={20} />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Preconfigured Ghost appearance via `DialGhostButton` wrapper (primary variant by default).',
      },
    },
  },
};
