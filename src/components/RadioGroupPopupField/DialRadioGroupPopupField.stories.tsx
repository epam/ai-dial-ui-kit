import { useState, type FC } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DialRadioGroupPopupField,
  type RadioGroupPopupFieldProps,
} from './RadioGroupPopupField';
import { PopupSize } from '@/types/popup';

const demoOptions = [
  { id: 'option-1', name: 'Option 1' },
  { id: 'option-2', name: 'Option 2' },
  { id: 'option-3', name: 'Option 3' },
];

const StatefulRadioGroupPopupField: FC<RadioGroupPopupFieldProps> = (args) => {
  const initialRadio =
    args.selectedRadioValue ?? args.radioButtons?.[0]?.id ?? '';
  const [selectedRadioValue, setSelectedRadioValue] = useState(initialRadio);
  const [selectedValue, setSelectedValue] = useState(
    args.selectedValue ?? initialRadio,
  );

  return (
    <DialRadioGroupPopupField
      {...args}
      selectedRadioValue={selectedRadioValue}
      selectedValue={selectedValue}
      onChangeRadioField={(id) => {
        setSelectedRadioValue(id);
        args.onChangeRadioField?.(id);
      }}
      onApply={() => {
        setSelectedValue(selectedRadioValue);
        args.onApply?.();
      }}
    />
  );
};

const LiveSyncRadioGroupPopupField: FC<RadioGroupPopupFieldProps> = (args) => {
  const initial = args.selectedRadioValue ?? args.radioButtons?.[0]?.id ?? '';
  const [value, setValue] = useState(args.selectedValue ?? initial);

  return (
    <DialRadioGroupPopupField
      {...args}
      selectedValue={value}
      onChangeRadioField={(id) => {
        setValue(id);
        args.onChangeRadioField?.(id);
      }}
      onApply={() => {
        args.onApply?.();
      }}
    />
  );
};

const meta = {
  title: 'Form/RadioGroupPopupField',
  component: DialRadioGroupPopupField,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    fieldTitle: { control: { type: 'text' } },
    htmlFor: { control: { type: 'text' } },
    disabled: { control: { type: 'boolean' } },
    selectedValue: { control: { type: 'text' } },
    radioButtons: { control: { type: 'object' } },
    customInputValue: { control: { type: 'text' } },
    valueClassNames: { control: { type: 'text' } },
    inputClassNames: { control: { type: 'text' } },
    emptyValueText: { control: { type: 'text' } },
    title: { control: { type: 'text' } },
    portalId: { control: { type: 'text' } },
    cancelButtonTitle: { control: { type: 'text' } },
    applyButtonTitle: { control: { type: 'text' } },
    isValid: { control: { type: 'boolean' } },
    selectedRadioValue: {
      control: { type: 'select' },
      options: ['option-1', 'option-2', 'option-3'],
    },
    onChangeRadioField: { control: false },
    onApply: { control: false },
    onClose: { control: false },
    id: { control: { type: 'text' } },
    size: {
      control: { type: 'select' },
      options: [PopupSize.Sm, PopupSize.Md, PopupSize.Lg],
    },
  },
  args: {
    fieldTitle: 'Status',
    htmlFor: 'status',
    title: 'Select status',
    emptyValueText: 'None',
    radioButtons: demoOptions,
    selectedValue: 'option-1',
    selectedRadioValue: 'option-1',
    id: 'status-group',
    isValid: true,
    cancelButtonTitle: 'Cancel',
    applyButtonTitle: 'Apply',
    onApply: () => 'Apply clicked',
    onChangeRadioField: () => null,
  },
} satisfies Meta<RadioGroupPopupFieldProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <StatefulRadioGroupPopupField {...args} />,
};

export const WithCustomInputValue: Story = {
  args: {
    customInputValue: 'Custom (manual)',
  },
  render: (args) => <StatefulRadioGroupPopupField {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <StatefulRadioGroupPopupField {...args} />,
};

export const InvalidApply: Story = {
  args: { isValid: false },
  render: (args) => <StatefulRadioGroupPopupField {...args} />,
};

export const PreselectedSecond: Story = {
  args: {
    selectedValue: 'option-2',
    selectedRadioValue: 'option-2',
  },
  render: (args) => <StatefulRadioGroupPopupField {...args} />,
};

export const LiveSyncSelection: Story = {
  name: 'Live sync (no Apply needed)',
  render: (args) => <LiveSyncRadioGroupPopupField {...args} />,
};

export const DifferentSizes: Story = {
  name: 'Different sizes',
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 font-medium">Small</p>
        <LiveSyncRadioGroupPopupField {...args} size={PopupSize.Sm} />
      </div>
      <div>
        <p className="mb-2 font-medium">Medium (default)</p>
        <LiveSyncRadioGroupPopupField {...args} size={PopupSize.Md} />
      </div>
      <div>
        <p className="mb-2 font-medium">Large</p>
        <LiveSyncRadioGroupPopupField {...args} size={PopupSize.Lg} />
      </div>
    </div>
  ),
};
