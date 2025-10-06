import type { FC } from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialRadioGroup, type DialRadioGroupProps } from './RadioGroup';
import { RadioGroupOrientation } from '@/types/radio-group';

const ControlledExample: FC = () => {
  const [active, setActive] = useState<'pickup' | 'courier'>('pickup');
  return (
    <DialRadioGroup
      fieldTitle="Delivery"
      elementId="delivery"
      orientation={RadioGroupOrientation.Column}
      activeRadioButton={active}
      radioButtons={[
        {
          id: 'pickup',
          name: 'Pickup',
          content: <div className="tiny text-secondary">Free, ready today</div>,
        },
        {
          id: 'courier',
          name: 'Courier',
          content: <div className="tiny text-secondary">Arrives tomorrow</div>,
        },
      ]}
      onChange={(id) => setActive(id as typeof active)}
    />
  );
};

const meta = {
  title: 'Components/RadioGroup',
  component: DialRadioGroup,
  parameters: { layout: 'centered' },
  argTypes: {
    fieldTitle: { control: { type: 'text' } },
    elementId: { control: { type: 'text' } },
    radioCssClass: { control: { type: 'text' } },
    labelCssClass: { control: { type: 'text' } },
    disabled: { control: { type: 'boolean' } },
    activeRadioButton: { control: { type: 'text' } },
    orientation: {
      control: { type: 'radio' },
      options: [RadioGroupOrientation.Row, RadioGroupOrientation.Column],
    },
    onChange: { control: false },
  },
  args: {
    fieldTitle: 'Attachments',
    elementId: 'attachments',
    radioCssClass: undefined,
    labelCssClass: undefined,
    disabled: false,
    activeRadioButton: 'none',
    orientation: RadioGroupOrientation.Row,
    radioButtons: [
      {
        id: 'none',
        name: '— None —',
        content: <div className="tiny text-secondary">No extras</div>,
      },
      {
        id: 'all',
        name: 'All attachments',
        content: <div className="tiny text-secondary">Everything included</div>,
      },
    ],
  },
} satisfies Meta<DialRadioGroupProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Row: Story = {
  args: {
    onChange: () => null,
  },
};

export const Column: Story = {
  args: {
    orientation: RadioGroupOrientation.Column,
    onChange: () => null,
  },
};

export const WithCustomLabelAndInputClasses: Story = {
  args: {
    labelCssClass: 'text-primary font-medium',
    radioCssClass: 'ring-2 ring-sky-400 ring-offset-0',
    onChange: () => null,
  },
};

export const DisabledGroup: Story = {
  args: {
    disabled: true,
    activeRadioButton: 'all',
    onChange: () => null,
  },
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
  args: {
    onChange: () => null,
  },
};

export const ManyOptions: Story = {
  args: {
    elementId: 'plans',
    fieldTitle: 'Plan',
    orientation: RadioGroupOrientation.Column,
    activeRadioButton: 'team',
    onChange: () => null,
    radioButtons: [
      {
        id: 'free',
        name: 'Free',
        content: <div className="tiny text-secondary">Personal usage</div>,
      },
      {
        id: 'team',
        name: 'Team',
        content: (
          <div className="tiny text-secondary">
            Collaboration for small teams
          </div>
        ),
      },
      {
        id: 'business',
        name: 'Business',
        content: <div className="tiny text-secondary">Security and SSO</div>,
      },
    ],
  },
};
