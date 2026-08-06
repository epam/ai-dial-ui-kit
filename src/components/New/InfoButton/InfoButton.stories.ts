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
      description: 'Text to display inside the info button',
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
