import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialButton, type DialButton as ButtonProps } from './Button';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

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
    iconBefore: {
      control: false,
      description: 'Icon or element to display before the button text',
    },
    iconAfter: {
      control: false,
      description: 'Icon or element to display after the button text',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessibility label (used when title is not provided)',
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
    title: 'Button',
    cssClass: 'dial-primary-button',
    disable: false,
    hideTitleOnMobile: false,
  },
} satisfies Meta<ButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

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
    iconAfter: <IconArrowRight size={16} />,
    iconBefore: <IconArrowLeft size={16} />,
  },
};

export const WithIconBefore: Story = {
  args: {
    title: 'Save',
    iconBefore: <IconArrowLeft size={16} />,
    cssClass: 'dial-primary-button',
  },
};

export const WithIconAfter: Story = {
  args: {
    title: 'Alert',
    iconAfter: <IconArrowRight size={16} />,
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

export const AllVariants: Story = {
  render: () => (
    <div className="p-4 max-w-[1000px]">
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
