import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialFieldLabel, type DialFieldLabelProps } from './FieldLabel';

const meta: Meta<typeof DialFieldLabel> = {
  title: 'Components/FieldLabel',
  component: DialFieldLabel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A contextual feedback component for displaying important messages with optional close button.',
      },
    },
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'The main label text for the field',
    },
    text: {
      control: { type: 'text' },
      description: 'The main text for the field',
    },
  },
} satisfies Meta<DialFieldLabelProps>;

export default meta;

type Story = StoryObj<typeof DialFieldLabel>;

export const Default: Story = {
  args: {
    label: 'Username',
    text: 'Enter your username',
  },
};

export const WithContent: Story = {
  args: {
    label: 'Custom Content',
    content: <span style={{ color: 'green' }}>Custom node here</span>,
  },
};

export const WithContentAfterText: Story = {
  args: {
    label: 'With Action',
    text: 'Copy this value',
    contentAfterText: <button style={{ marginLeft: 8 }}>Copy</button>,
  },
};

export const TooltipOnly: Story = {
  args: {
    label: 'Tooltip Only',
    text: 'Hover for tooltip',
  },
};
