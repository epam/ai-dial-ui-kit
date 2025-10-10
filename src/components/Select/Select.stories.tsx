import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconAbc, IconEqual, IconDashboardOff } from '@tabler/icons-react';
import { DialSelect, type DialSelectProps } from './Select';
import type { SelectOption } from '@/models/select';

const iconSize = 16;
const baseOptions: SelectOption[] = [
  { value: 'contain', label: 'Contain', icon: <IconAbc size={iconSize} /> },
  {
    value: 'not-contains',
    label: 'Not contains',
    icon: <IconAbc size={iconSize} />,
  },
  { value: 'equal', label: 'Equal', icon: <IconEqual size={iconSize} /> },
  {
    value: 'not-equal',
    label: 'Not equal',
    icon: <IconDashboardOff size={iconSize} />,
  },
  { value: 'starts', label: 'Starts with', icon: <IconAbc size={iconSize} /> },
  { value: 'ends', label: 'Ends with', icon: <IconAbc size={iconSize} /> },
  { value: 'empty', label: 'Is empty' },
  { value: 'disabled', label: 'Disabled option', disabled: true },
  {
    value: 'long-option',
    label:
      'This is a very long option to test overflow. It should be truncated appropriately',
  },
  {
    value: 'another-long-option',
    label:
      'Another long option to test overflow. It should be truncated appropriately',
  },
  { value: 'option-1', label: 'Option 1' },
  { value: 'option-2', label: 'Option 2' },
  { value: 'option-3', label: 'Option 3' },
  { value: 'option-4', label: 'Option 4' },
  { value: 'option-5', label: 'Option 5' },
  { value: 'option-6', label: 'Option 6' },
  { value: 'option-7', label: 'Option 7' },
  { value: 'option-8', label: 'Option 8' },
  { value: 'option-9', label: 'Option 9' },
  { value: 'option-10', label: 'Option 10' },
];

const meta = {
  title: 'Components/Select',
  component: DialSelect,
  parameters: { layout: 'centered' },
  argTypes: {
    options: { control: { type: 'object' } },
    multiple: { control: { type: 'boolean' } },
    value: { control: { type: 'object' } },
    defaultValue: { control: { type: 'object' } },
    placeholder: { control: { type: 'text' } },
    searchable: { control: { type: 'boolean' } },
    selectAll: { control: { type: 'boolean' } },
    selectAllLabel: { control: { type: 'text' } },
    emptyTitle: { control: { type: 'text' } },
    emptyDescription: { control: { type: 'text' } },
    disabled: { control: { type: 'boolean' } },
    cssClass: { control: { type: 'text' } },
    closable: { control: { type: 'boolean' } },
    onClose: { control: false },
    onChange: { control: false },
  },
  args: {
    options: baseOptions,
    placeholder: 'Select…',
    searchable: false,
    multiple: false,
    selectAll: false,
    selectAllLabel: 'Select all',
    closable: false,
    disabled: false,
  },
  render: (args) => {
    return (
      <div className="w-[320px]">
        <DialSelect {...args} />
      </div>
    );
  },
} satisfies Meta<DialSelectProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const SinglePreselected: Story = {
  args: { defaultValue: 'contain' },
};

export const Multiple: Story = {
  args: {
    multiple: true,
  },
};

export const WithSelectAll: Story = {
  args: {
    multiple: true,
    selectAll: true,
  },
};

export const Searchable: Story = {
  args: {
    searchable: true,
  },
};
