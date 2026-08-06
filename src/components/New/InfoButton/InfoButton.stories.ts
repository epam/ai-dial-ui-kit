import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfoButton, type InfoButtonProps } from './InfoButton';

const meta: Meta<typeof InfoButton> = {
  title: 'Components_2_0/InfoButton',
  component: InfoButton,
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
    caption: {
      control: { type: 'text' },
      description:
        'Tooltip text, and the fallback accessible name of the button',
    },
    'aria-label': {
      control: { type: 'text' },
      description: 'Accessible name; takes precedence over `caption`',
    },
  },
} satisfies Meta<InfoButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caption: 'Info',
  },
};

/**
 * A long caption still works as a tooltip, but a short `aria-label` keeps the
 * announced name scannable.
 */
export const ExplicitAccessibleName: Story = {
  args: {
    caption: 'Only digits, without spaces or a country prefix',
    'aria-label': 'Phone number help',
  },
};
