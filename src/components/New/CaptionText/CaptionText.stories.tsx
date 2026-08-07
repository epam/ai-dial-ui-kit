import type { Meta, StoryObj } from '@storybook/react-vite';
import { CaptionType } from '@/types/caption';
import { CaptionText } from './CaptionText';

const meta = {
  title: 'Components_2_0/CaptionText',
  component: CaptionText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A component for displaying messages with consistent styling.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [CaptionType.Error, CaptionType.Description],
      description: 'The visual style variant of the caption text.',
    },
    text: {
      control: { type: 'text' },
      description: 'The message text to display',
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
    text: 'Field is required. Please provide a valid input to proceed.',
  },
} satisfies Meta<typeof CaptionText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    variant: CaptionType.Error,
  },
};
