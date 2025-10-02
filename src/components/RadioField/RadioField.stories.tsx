import type { FC } from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialRadioField, type DialRadioFieldProps } from './RadioField';
import { RadioFieldOrientation } from '@/types/radioField';

const ControlledExample: FC = () => {
  const [selected, setSelected] = useState<'none' | 'all'>('none');
  return (
    <DialRadioField
      fieldTitle="Attachments"
      elementId="attachments-controlled"
      orientation={RadioFieldOrientation.Row}
      activeRadioButton={selected}
      radioButtons={[
        { id: 'none', name: '— None —' },
        { id: 'all', name: 'All attachments' },
      ]}
      onChange={(v: string) => setSelected(v as 'none' | 'all')}
    />
  );
};

const WithDescriptions: FC = () => {
  const [selected, setSelected] = useState<'free' | 'team' | 'business'>(
    'team',
  );
  return (
    <DialRadioField
      fieldTitle="Plan"
      elementId="plans"
      orientation={RadioFieldOrientation.Column}
      activeRadioButton={selected}
      radioButtons={[
        { id: 'free', name: 'Free', description: 'Personal usage' },
        {
          id: 'team',
          name: 'Team',
          description: 'Collaboration for small teams',
        },
        { id: 'business', name: 'Business', description: 'Security and SSO' },
      ]}
      onChange={(v) => setSelected(v as typeof selected)}
    />
  );
};

const meta = {
  title: 'Components/RadioField',
  component: DialRadioField,
  parameters: { layout: 'centered' },
  argTypes: {
    fieldTitle: { control: { type: 'text' } },
    elementId: { control: { type: 'text' } },
    radioCssClass: { control: { type: 'text' } },
    disabled: { control: { type: 'boolean' } },
    activeRadioButton: { control: { type: 'text' } },
    orientation: {
      control: { type: 'radio' },
      options: [RadioFieldOrientation.Row, RadioFieldOrientation.Column],
    },
    onChange: { control: false },
  },
  args: {
    fieldTitle: 'Attachments',
    elementId: 'attachments',
    radioCssClass: undefined,
    disabled: false,
    activeRadioButton: 'none',
    orientation: RadioFieldOrientation.Row,
    radioButtons: [
      { id: 'none', name: '— None —' },
      { id: 'all', name: 'All attachments' },
    ],
  },
} satisfies Meta<DialRadioFieldProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Row: Story = {
  args: {
    onChange: () => null,
  },
};

export const Column: Story = {
  args: {
    orientation: RadioFieldOrientation.Column,
    onChange: () => null,
  },
};

export const DisabledGroup: Story = {
  args: {
    disabled: true,
    onChange: () => null,
  },
};

export const CustomInputClass: Story = {
  args: {
    radioCssClass: 'ring-2',
    onChange: () => null,
  },
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
  args: {
    onChange: () => null,
  },
};

export const ManyWithDescriptions: Story = {
  render: () => <WithDescriptions />,
  args: { onChange: () => null },
};
