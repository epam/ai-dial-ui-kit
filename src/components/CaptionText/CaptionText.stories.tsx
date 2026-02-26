import type { Meta, StoryObj } from '@storybook/react-vite';
import { CaptionType } from '@/types/caption';
import { DialCaptionText } from './CaptionText';

const meta = {
  title: 'DIAL/Elements/CaptionText',
  component: DialCaptionText,
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
} satisfies Meta<typeof DialCaptionText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomClassName: Story = {
  args: {
    text: 'This is an error with custom class',
    className: 'border border-secondary p-2',
  },
};

export const AriaAttributes: Story = {
  args: {
    text: 'Error with aria attributes',
    'aria-label': 'Error message',
  },
};

export const Error: Story = {
  args: {
    variant: CaptionType.Error,
  },
};
