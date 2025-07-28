import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './Button';
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
    dataTestId: {
      control: { type: 'text' },
      description: 'Test identifier for testing frameworks',
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

export const PrimaryButton: Story = {
  args: {
    title: 'Primary Button',
    cssClass: 'primary',
  },
};

export const SecondaryButton: Story = {
  args: {
    title: 'Secondary Button',
    cssClass: 'secondary',
  },
};
export const TertiaryButton: Story = {
  args: {
    title: 'Tertiary Button',
    cssClass: 'tertiary',
  },
};

export const WithBothIcons: Story = {
  args: {
    title: 'Action',
    iconBefore: <IconArrowLeft size={16} />,
    iconAfter: <IconArrowRight size={16} />,
    cssClass: 'secondary',
  },
};

export const WithIconBefore: Story = {
  args: {
    title: 'Save',
    iconBefore: <IconArrowRight size={16} />,
    cssClass: 'primary',
  },
};

export const WithIconAfter: Story = {
  args: {
    title: 'Alert',
    iconAfter: <IconArrowLeft size={16} />,
    cssClass: 'tertiary',
  },
};

export const Disabled: Story = {
  args: {
    title: 'Disabled Button',
    cssClass: 'tertiary',
    disable: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="dial dial-p-8 max-w-[400px]">
      <div className="dial-grid dial-grid-cols-4 dial-gap-8">
        {/* Header */}
        <div></div>
        <div className="dial-text-primary dial-text-center dial-font-semibold">
          Primary
        </div>
        <div className="dial-text-primary dial-text-center dial-font-semibold">
          Secondary
        </div>
        <div className="dial-text-primary dial-text-center dial-font-semibold">
          Tertiary
        </div>

        {/* Default State */}
        <div className="dial-text-primary dial-text-right dial-pr-4 dial-py-2">
          Default
        </div>
        <div className="dial-flex dial-justify-center">
          <Button
            title="Button label"
            cssClass="primary"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="dial-flex dial-justify-center">
          <Button
            title="Button label"
            cssClass="secondary"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="dial-flex dial-justify-center">
          <Button
            title="Button label"
            cssClass="tertiary"
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>

        {/* Disabled State */}
        <div className="dial-text-primary dial-text-right dial-pr-4 dial-py-2">
          Disable
        </div>
        <div className="dial-flex dial-justify-center">
          <Button
            title="Button label"
            cssClass="primary"
            disable={true}
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="dial-flex dial-justify-center">
          <Button
            title="Button label"
            cssClass="secondary"
            disable={true}
            iconBefore={<IconArrowLeft size={16} />}
            iconAfter={<IconArrowRight size={16} />}
          />
        </div>
        <div className="dial-flex dial-justify-center">
          <Button
            title="Button label"
            cssClass="tertiary"
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
    docs: {
      description: {
        story:
          'A comprehensive view of all button variants and states. This story displays Primary, Secondary, and Tertiary buttons across Default, Hover, Focus, Active, and Disabled states.',
      },
    },
  },
};
