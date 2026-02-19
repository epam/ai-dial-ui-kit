import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialInfoButton, type DialInfoButtonProps } from './InfoButton';

const meta: Meta<typeof DialInfoButton> = {
  title: 'DIAL/Elements/Buttons/InfoButton',
  component: DialInfoButton,
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
      description: 'Text to display inside the info button',
    },
  },
} satisfies Meta<DialInfoButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    caption: 'Info',
  },
};
