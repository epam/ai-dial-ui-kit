import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialFieldLabel, type DialFieldLabelProps } from './Field';

const meta = {
  title: 'Inputs/FieldLabel',
  component: DialFieldLabel,
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
    fieldTitle: {
      control: { type: 'text' },
      description: 'The title/label text to display for the field',
    },
    htmlFor: {
      control: { type: 'text' },
      description: 'The ID of the form element this label is associated with',
    },
    optional: {
      control: { type: 'boolean' },
      description: 'Whether the field is optional (displays "(Optional)" text)',
    },
    optionalText: {
      control: { type: 'text' },
      description: 'Custom text for optional indicator',
    },
  },
  args: {
    fieldTitle: 'Field Label',
    htmlFor: 'field-input',
    optional: false,
    optionalText: undefined,
  },
  render: (args: DialFieldLabelProps) => {
    const { optionalText, ...fieldLabelProps } = args;

    return (
      <div className="w-80">
        <DialFieldLabel {...fieldLabelProps} optionalText={optionalText} />
      </div>
    );
  },
} satisfies Meta<DialFieldLabelProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicLabel: Story = {
  args: {
    fieldTitle: 'Email Address',
    htmlFor: 'email-input',
  },
};

export const OptionalField: Story = {
  args: {
    fieldTitle: 'Phone Number',
    htmlFor: 'phone-input',
    optional: true,
  },
};

export const WithCustomOptionalText: Story = {
  args: {
    fieldTitle: 'Priority Level',
    htmlFor: 'priority-input',
    optional: true,
    optionalText: '(Not Required)',
  },
};

export const LongFieldTitle: Story = {
  args: {
    fieldTitle:
      'This is a very long field title that might wrap to multiple lines',
    htmlFor: 'long-title-input',
    optional: true,
  },
};
