import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialErrorText } from './ErrorText';

const meta = {
  title: 'Feedback/ErrorText',
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
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes merged with base classes.',
    },
    'aria-label': {
      control: { type: 'text' },
      description: 'ARIA label to improve accessibility.',
    },
  },
  args: {
    errorText: 'Field is required. Please provide a valid input to proceed.',
  },
} satisfies Meta<typeof DialErrorText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomClassName: Story = {
  args: {
    errorText: 'This is an error with custom class',
    className: 'border border-secondary p-2',
  },
};

export const WithAriaAttributes: Story = {
  args: {
    errorText: 'Error with aria attributes',
    'aria-label': 'Error message',
  },
};
