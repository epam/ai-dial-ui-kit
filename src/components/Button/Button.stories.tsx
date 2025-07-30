import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialButton, type DialButton as ButtonProps } from './Button';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

interface StoryButtonProps
  extends Omit<ButtonProps, 'iconBefore' | 'iconAfter' | 'onClick'> {
  showIconBefore?: boolean;
  showIconAfter?: boolean;
  enableOnClick?: boolean;
}

const meta = {
  title: 'Components/Button',
  component: DialButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: { component: 'A button component.' },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Button text content',
    },
    cssClass: {
      control: { type: 'select' },
      options: [
        'dial-primary-button',
        'dial-secondary-button',
        'dial-tertiary-button',
      ],
      description: 'Button style variant',
    },
    disable: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    hideTitleOnMobile: {
      control: { type: 'boolean' },
      description: 'Hide title text on mobile devices',
    },
    showIconBefore: {
      control: { type: 'boolean' },
      description: 'Show icon before the button text',
    },
    showIconAfter: {
      control: { type: 'boolean' },
      description: 'Show icon after the button text',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessibility label (used when title is not provided)',
    },
    enableOnClick: {
      control: { type: 'boolean' },
      description: 'Add click handler that shows an alert',
    },
  },
  args: {
    title: 'Button',
    cssClass: 'dial-primary-button',
    disable: false,
    hideTitleOnMobile: false,
    showIconBefore: false,
    showIconAfter: false,
    enableOnClick: false,
  },
  render: (args: StoryButtonProps) => {
    const { showIconBefore, showIconAfter, enableOnClick, ...buttonProps } =
      args;

    return (
      <DialButton
        {...buttonProps}
        iconBefore={showIconBefore ? <IconArrowLeft size={16} /> : undefined}
        iconAfter={showIconAfter ? <IconArrowRight size={16} /> : undefined}
        onClick={enableOnClick ? () => alert('Button clicked!') : undefined}
      />
    );
  },
} satisfies Meta<StoryButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div className="dial p-4 max-w-[1000px] flex justify-center">
      <div className="grid grid-cols-4 gap-8">
        {/* Header */}
        <div></div>
        <div className="text-primary text-center font-semibold">Primary</div>
        <div className="text-primary text-center font-semibold">Secondary</div>
        <div className="text-primary text-center font-semibold">Tertiary</div>

        <div className="text-primary text-right pr-4 py-2">Default</div>
        <div className="flex justify-center">
          <DialButton
            title="Button label"
            cssClass="dial-primary-button"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <DialButton
            title="Button label"
            cssClass="dial-secondary-button"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <DialButton
            title="Button label"
            cssClass="dial-tertiary-button"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>

        {/* Hover State */}
        <div className="text-primary text-right pr-4 py-2">Hover</div>
        <div className="flex justify-center">
          <DialButton
            title="Button label"
            cssClass="dial-primary-button"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <DialButton
            title="Button label"
            cssClass="dial-secondary-button"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <DialButton
            title="Button label"
            cssClass="dial-tertiary-button"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>

        {/* Focus State */}
        <div className="text-primary text-right pr-4 py-2">Focus</div>
        <div className="flex justify-center">
          <DialButton
            title="Button label"
            cssClass="dial-primary-button"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <DialButton
            title="Button label"
            cssClass="dial-secondary-button"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <DialButton
            title="Button label"
            cssClass="dial-tertiary-button"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>

        {/* Active State */}
        <div className="text-primary text-right pr-4 py-2">Active</div>
        <div className="flex justify-center">
          <DialButton
            title="Button label"
            cssClass="dial-primary-button"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <DialButton
            title="Button label"
            cssClass="dial-secondary-button"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <DialButton
            title="Button label"
            cssClass="dial-tertiary-button"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>

        {/* Disabled State */}
        <div className="text-primary text-right pr-4 py-2">Disable</div>
        <div className="flex justify-center">
          <DialButton
            title="Button label"
            cssClass="dial-primary-button"
            disable={true}
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <DialButton
            title="Button label"
            cssClass="dial-secondary-button"
            disable={true}
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <DialButton
            title="Button label"
            cssClass="dial-tertiary-button"
            disable={true}
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    pseudo: {
      hover: [
        'div:nth-child(10) button',
        'div:nth-child(11) button',
        'div:nth-child(12) button',
      ],
      focus: [
        'div:nth-child(14) button',
        'div:nth-child(15) button',
        'div:nth-child(16) button',
      ],
      active: [
        'div:nth-child(18) button',
        'div:nth-child(19) button',
        'div:nth-child(20) button',
      ],
    },
    docs: {
      description: {
        story:
          'A comprehensive view of all button variants and states. This story displays Primary, Secondary, and Tertiary buttons across Default, Hover, Focus, Active, and Disabled states.',
      },
    },
  },
};

export const PrimaryButton: Story = {
  args: {
    title: 'Primary Button',
    cssClass: 'dial-primary-button',
  },
};

export const SecondaryButton: Story = {
  args: {
    title: 'Secondary Button',
    cssClass: 'dial-secondary-button',
  },
};
export const TertiaryButton: Story = {
  args: {
    title: 'Tertiary Button',
    cssClass: 'dial-tertiary-button',
  },
};

export const WithBothIcons: Story = {
  args: {
    title: 'Action',
    showIconAfter: true,
    showIconBefore: true,
  },
};

export const WithIconBefore: Story = {
  args: {
    title: 'Save',
    showIconBefore: true,
    cssClass: 'dial-primary-button',
  },
};

export const WithIconAfter: Story = {
  args: {
    title: 'Alert',
    showIconAfter: true,
    cssClass: 'dial-tertiary-button',
  },
};

export const Disabled: Story = {
  args: {
    title: 'Disabled Button',
    cssClass: 'dial-tertiary-button',
    disable: true,
  },
};

export const Hover: Story = {
  args: {
    title: 'Hover Button',
    cssClass: 'dial-primary-button',
  },
  parameters: {
    pseudo: {
      hover: true,
    },
  },
};

export const Focus: Story = {
  args: {
    title: 'Focus Button',
    cssClass: 'dial-secondary-button',
  },
  parameters: {
    pseudo: {
      focus: true,
    },
  },
};

export const Active: Story = {
  args: {
    title: 'Active Button',
    cssClass: 'dial-tertiary-button',
  },
  parameters: {
    pseudo: {
      active: true,
    },
  },
};
