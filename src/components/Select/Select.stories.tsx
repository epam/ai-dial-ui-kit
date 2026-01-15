import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconAbc, IconEqual, IconDashboardOff } from '@tabler/icons-react';
import { DialSelect, type DialSelectProps } from './Select';
import type { SelectOption } from '@/models/select';
import { SelectSize, SelectVariant } from '@/types/select';
import { DialPrimaryButton } from '@/components/Button/ButtonWrappers';

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
    description: 'another long option description',
  },
  {
    value: 'icon-long-option',
    label: 'Long option that has icon. It should be truncated appropriately',
    icon: <IconDashboardOff size={iconSize} />,
    description: 'icon-long option description',
  },
  { value: 'option-1', label: 'Option 1', description: 'Option 1 description' },
  {
    value: 'option-icon',
    label: 'Option Icon',
    icon: <IconDashboardOff size={iconSize} />,
    description: 'Option Icon description',
  },
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
  title: 'Form/Select',
  component: DialSelect,
  parameters: { layout: 'centered' },
  argTypes: {
    options: { control: { type: 'object' } },
    multiple: { control: { type: 'boolean' } },
    value: { control: { type: 'object' } },
    prefix: { control: { type: 'text' } },
    defaultValue: { control: { type: 'object' } },
    placeholder: { control: { type: 'text' } },
    searchable: { control: { type: 'boolean' } },
    selectAll: { control: { type: 'boolean' } },
    selectAllLabel: { control: { type: 'text' } },
    emptyStateTitle: { control: { type: 'text' } },
    emptyStateDescription: { control: { type: 'text' } },
    emptyStateIcon: { control: { type: 'object' } },
    disabled: { control: { type: 'boolean' } },
    className: { control: { type: 'text' } },
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

export const Small: Story = {
  args: {
    size: SelectSize.Sm,
  },
};

export const WithHeaderAndFooter: Story = {
  name: 'With header and footer',
  args: {
    header: (
      <div className="px-3 py-2 border-b">
        <span className="dial-small text-primary font-medium">
          Select time range
        </span>
      </div>
    ),
    footer: (
      <div className="px-3 py-2 border-t">
        <span className="dial-small text-primary font-medium">
          Footer content
        </span>
      </div>
    ),
  },
};

export const WithFooterClickClose: Story = {
  name: 'With header and footer - close on footer click',
  args: {
    header: (
      <div className="px-3 py-2 border-b">
        <span className="dial-small text-primary font-medium">
          Select time range
        </span>
      </div>
    ),
    footer: (
      <div className="px-3 py-2 border-t">
        <span className="dial-small text-primary font-medium">
          Click footer to close
        </span>
      </div>
    ),
    onFooterClick: () => {
      console.info('Footer clicked - dropdown will close');
    },
  },
};

export const WithFooterClickCallback: Story = {
  name: 'With footer click callback',
  args: {
    header: (
      <div className="px-3 py-2 border-b">
        <span className="dial-small text-primary font-medium">
          Select time range
        </span>
      </div>
    ),
    footer: <DialPrimaryButton label="Apply" />,
    onFooterClick: (e) => {
      console.info('Footer clicked', e);
    },
  },
};

export const Secondary: Story = {
  args: {
    size: SelectSize.Sm,
    variant: SelectVariant.Secondary,
  },
};

export const WithCustomSelectedValue: Story = {
  args: {
    customSelectedValue: 'Custom Selected Value',
    value: 'custom-value',
  },
};

export const Searchable: Story = {
  args: {
    prefix: 'Filter:',
    searchable: true,
  },
};

export const InlineSearch: Story = {
  name: 'Inline search',
  args: {
    inlineSearch: true,
    searchPlaceholder: 'Display name',
  },
};

export const CustomTriggerClass: Story = {
  args: {
    className: 'min-h-[48px] p-8',
  },
};
