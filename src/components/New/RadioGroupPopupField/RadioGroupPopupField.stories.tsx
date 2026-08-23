import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { PopupSize } from '@/types/popup';
import {
  RadioGroupPopupField,
  type RadioGroupPopupFieldProps,
} from './RadioGroupPopupField';

const statusItems = [
  { value: 'draft', label: 'Draft', caption: 'Only visible to you' },
  { value: 'review', label: 'In review', caption: 'Waiting for approval' },
  { value: 'published', label: 'Published', caption: 'Visible to everyone' },
];

const InteractiveField = (args: RadioGroupPopupFieldProps) => {
  const [value, setValue] = useState(args.value);

  return (
    <div className="w-[320px]">
      <RadioGroupPopupField {...args} value={value} onApply={setValue} />
    </div>
  );
};

const meta = {
  title: 'Components_2_0/RadioGroupPopupField',
  component: RadioGroupPopupField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A collapsed field whose value is picked from a `RadioGroup` inside a `Popup`. The selection is a draft until Apply commits it; Cancel and the header close both discard it.',
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Options offered inside the popup',
    },
    value: {
      control: 'text',
      description: 'The committed value, shown in the collapsed field',
    },
    header: {
      control: 'text',
      description: 'Title of the popup',
    },
    onApply: {
      action: 'applied',
      control: false,
      description:
        'Callback fired with the selected value when Apply is clicked',
    },
    labelProps: {
      control: 'object',
      description: 'Props of the `Label` rendered above the field',
    },
    placeholder: {
      control: 'text',
      description: 'Text shown in the field while no value is selected',
    },
    customValue: {
      control: 'text',
      description: "Text shown in place of the selected option's label",
    },
    isValid: {
      control: 'boolean',
      description: 'Whether Apply is enabled',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the field, so the popup cannot be opened',
    },
    invalid: {
      control: 'boolean',
      description: 'Paints the field with the error border',
    },
    error: {
      control: 'text',
      description: 'Error message rendered below the field',
    },
    caption: {
      control: 'text',
      description: 'Helper text rendered below the field',
    },
    size: {
      control: 'inline-radio',
      options: Object.values(PopupSize),
      description: 'Size of the popup',
    },
  },
} satisfies Meta<typeof RadioGroupPopupField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveField,
  args: {
    labelProps: { label: 'Status' },
    header: 'Select status',
    placeholder: 'None',
    items: statusItems,
    size: PopupSize.Sm,
    onApply: () => undefined,
  },
};

export const WithValue: Story = {
  render: InteractiveField,
  args: {
    ...Default.args,
    value: 'review',
  },
};

export const WithCaption: Story = {
  render: InteractiveField,
  args: {
    ...Default.args,
    value: 'draft',
    caption: 'A draft can be published later',
  },
};

export const WithError: Story = {
  render: InteractiveField,
  args: {
    ...Default.args,
    labelProps: { label: 'Status', required: true },
    invalid: true,
    error: 'Pick a status before saving',
  },
};

export const Disabled: Story = {
  render: InteractiveField,
  args: {
    ...Default.args,
    value: 'published',
    disabled: true,
  },
};

/**
 * `customValue` replaces the readout when the committed value is not one of the
 * options — a computed summary, or a value entered elsewhere.
 */
export const CustomValue: Story = {
  render: InteractiveField,
  args: {
    ...Default.args,
    value: 'draft',
    customValue: 'Draft (auto-saved)',
  },
};

/**
 * A controlled draft: the parent holds the in-popup selection, which is what
 * `isValid` needs in order to depend on it. Here Apply stays disabled until the
 * selection actually changes.
 */
export const ControlledDraft: Story = {
  args: {
    ...Default.args,
    items: statusItems,
  },
  render: (args) => {
    const ControlledExample = () => {
      const [value, setValue] = useState('draft');
      const [draft, setDraft] = useState(value);

      return (
        <div className="w-[320px]">
          <RadioGroupPopupField
            {...args}
            value={value}
            selectedValue={draft}
            onSelectionChange={setDraft}
            isValid={draft !== value}
            caption="Apply is enabled once the selection changes"
            onApply={(next) => setValue(next ?? '')}
            onCancel={() => setDraft(value)}
          />
        </div>
      );
    };

    return <ControlledExample />;
  },
};
