import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

const meta = {
  title: 'Components/Button',
  component: Button,
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
      control: { type: 'text' },
      description: 'Additional CSS classes to apply',
    },
    disable: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    hideTitleOnMobile: {
      control: { type: 'boolean' },
      description: 'Hide title text on mobile devices',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessibility label (used when title is not provided)',
    },
    onClick: {
      action: 'clicked',
      description: 'Click event handler',
    },
  },
  args: {
    title: 'Button',
    disable: false,
    hideTitleOnMobile: false,
    iconBefore: undefined,
    iconAfter: undefined,
  },
} satisfies Meta<typeof Button>;

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
          <Button
            title="Button label"
            cssClass="dial-primary"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <Button
            title="Button label"
            cssClass="dial-secondary"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <Button
            title="Button label"
            cssClass="dial-tertiary"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>

        {/* Hover State */}
        <div className="text-primary text-right pr-4 py-2">Hover</div>
        <div className="flex justify-center">
          <Button
            title="Button label"
            cssClass="dial-primary"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <Button
            title="Button label"
            cssClass="dial-secondary"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <Button
            title="Button label"
            cssClass="dial-tertiary"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>

        {/* Focus State */}
        <div className="text-primary text-right pr-4 py-2">Focus</div>
        <div className="flex justify-center">
          <Button
            title="Button label"
            cssClass="dial-primary"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <Button
            title="Button label"
            cssClass="dial-secondary"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <Button
            title="Button label"
            cssClass="dial-tertiary"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>

        {/* Active State */}
        <div className="text-primary text-right pr-4 py-2">Active</div>
        <div className="flex justify-center">
          <Button
            title="Button label"
            cssClass="dial-primary"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <Button
            title="Button label"
            cssClass="dial-secondary"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <Button
            title="Button label"
            cssClass="dial-tertiary"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>

        {/* Disabled State */}
        <div className="text-primary text-right pr-4 py-2">Disable</div>
        <div className="flex justify-center">
          <Button
            title="Button label"
            cssClass="dial-primary"
            disable={true}
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <Button
            title="Button label"
            cssClass="dial-secondary"
            disable={true}
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="flex justify-center">
          <Button
            title="Button label"
            cssClass="dial-tertiary"
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
    cssClass: 'dial-primary',
  },
};

export const SecondaryButton: Story = {
  args: {
    title: 'Secondary Button',
    cssClass: 'dial-secondary',
  },
};
export const TertiaryButton: Story = {
  args: {
    title: 'Tertiary Button',
    cssClass: 'dial-tertiary',
  },
};

export const WithBothIcons: Story = {
  args: {
    title: 'Action',
    iconBefore: <IconArrowLeft size={16} />,
    iconAfter: <IconArrowRight size={16} />,
    cssClass: 'dial-secondary',
  },
};

export const WithIconBefore: Story = {
  args: {
    title: 'Save',
    iconBefore: <IconArrowRight size={16} />,
    cssClass: 'dial-primary',
  },
};

export const WithIconAfter: Story = {
  args: {
    title: 'Alert',
    iconAfter: <IconArrowRight size={16} />,
    cssClass: 'dial-tertiary',
  },
};

export const Disabled: Story = {
  args: {
    title: 'Disabled Button',
    cssClass: 'dial-tertiary',
    disable: true,
  },
};

export const Hover: Story = {
  args: {
    title: 'Hover Button',
    cssClass: 'dial-primary',
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
    cssClass: 'dial-secondary',
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
    cssClass: 'dial-tertiary',
  },
  parameters: {
    pseudo: {
      active: true,
    },
  },
};
