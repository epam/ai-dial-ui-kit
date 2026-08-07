import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label, type LabelProps } from './Label';

const meta = {
  title: 'Components_2_0/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A field label component that provides consistent styling for form labels with optional indicators and icons.',
      },
    },
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'The title/label text to display for the field',
    },
    htmlFor: {
      control: { type: 'text' },
      description: 'The ID of the form element this label is associated with',
    },
    required: {
      control: { type: 'boolean' },
      description:
        'Whether the field is required (displays `*` plus visually hidden "(required)" text)',
    },
    caption: {
      control: { type: 'text' },
      description:
        'Explanatory text, exposed through an info button next to the label',
    },
  },
  args: {
    label: 'Field Label',
    htmlFor: 'field-input',
    required: false,
  },
  render: (args: LabelProps) => {
    return (
      <div className="w-80">
        <Label {...args} />
      </div>
    );
  },
} satisfies Meta<LabelProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    label: 'Email Address',
    htmlFor: 'email-input',
  },
};

export const Required: Story = {
  args: {
    label: 'Phone Number',
    htmlFor: 'phone-input',
    required: true,
  },
};

export const Caption: Story = {
  args: {
    label: 'Phone Number',
    htmlFor: 'phone-input',
    required: true,
    caption: 'This is a caption for the phone number field',
  },
};

export const LongLabel: Story = {
  args: {
    label: 'This is a very long field label that might wrap to multiple lines',
    htmlFor: 'long-label-input',
    required: true,
  },
};
