import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialLabelledText, type DialLabelledTextProps } from './LabelledText';

const meta: Meta<typeof DialLabelledText> = {
  title: 'Data Display/LabelledText',
  component: DialLabelledText,
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
} satisfies Meta<DialLabelledTextProps>;

export default meta;

type Story = StoryObj<typeof DialLabelledText>;

export const Default: Story = {
  args: {
    label: 'Username',
    text: 'Enter your username',
  },
};

export const WithContent: Story = {
  args: {
    label: 'Custom Content',
    children: <span style={{ color: 'green' }}>Custom node here</span>,
  },
};

export const WithContentAfterText: Story = {
  args: {
    label: 'With Action',
    text: 'Copy this value',
    postfix: <button style={{ marginLeft: 8 }}>Copy</button>,
  },
};

export const TooltipOnly: Story = {
  args: {
    label: 'Tooltip Only',
    text: 'Hover for tooltip',
  },
};
