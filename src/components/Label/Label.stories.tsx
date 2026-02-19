import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialLabel, type DialLabelProps } from './Label';

const meta = {
  title: 'DIAL/Elements/Label',
  component: DialLabel,
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
    fieldLabel: {
      control: { type: 'text' },
      description: 'The title/label text to display for the field',
    },
    htmlFor: {
      control: { type: 'text' },
      description: 'The ID of the form element this label is associated with',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Whether the field is optional (displays "(Optional)" text)',
    },
  },
  args: {
    fieldLabel: 'Field Label',
    htmlFor: 'field-input',
    required: false,
  },
  render: (args: DialLabelProps) => {
    return (
      <div className="w-80">
        <DialLabel {...args} />
      </div>
    );
  },
} satisfies Meta<DialLabelProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    fieldLabel: 'Email Address',
    htmlFor: 'email-input',
  },
};

export const Required: Story = {
  args: {
    fieldLabel: 'Phone Number',
    htmlFor: 'phone-input',
    required: true,
  },
};

export const Caption: Story = {
  args: {
    fieldLabel: 'Phone Number',
    htmlFor: 'phone-input',
    required: true,
    caption: 'This is a caption for the phone number field',
  },
};

export const LongLabel: Story = {
  args: {
    fieldLabel:
      'This is a very long field label that might wrap to multiple lines',
    htmlFor: 'long-label-input',
    required: true,
  },
};
