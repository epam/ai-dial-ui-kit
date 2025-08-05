import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialErrorText } from './ErrorText';

const meta = {
  title: 'Components/ErrorText',
  component: DialErrorText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A component for displaying error messages with consistent styling.',
      },
    },
  },
  argTypes: {
    errorText: {
      control: { type: 'text' },
      description: 'The error message text to display',
    },
  },
  args: {
    errorText: 'Field is required. Please provide a valid input to proceed.',
  },
} satisfies Meta<typeof DialErrorText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
