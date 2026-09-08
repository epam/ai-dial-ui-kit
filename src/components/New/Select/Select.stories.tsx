import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  IconStar,
  IconAbc,
  IconDashboardOff,
  IconEqual,
} from '@tabler/icons-react';
import { useRef, useState } from 'react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { PrimaryButton } from '@/components/New/Button/ButtonWrappers';
import type { SelectOption } from '@/models/select';
import { ElementSize } from '@/types/size';
import { GhostIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { Select, type SelectProps } from './Select';
import { MenuItemMark } from '@/types/menu-item';

const iconSize = 16;
const baseOptions: SelectOption[] = [
  {
    value: 'contain',
    label: 'Contain',
    icon: <IconAbc size={iconSize} stroke={DIAL_KIT_ICON_STROKE} />,
  },
  {
    value: 'not-contains',
    label: 'Not contains',
    icon: <IconAbc size={iconSize} stroke={DIAL_KIT_ICON_STROKE} />,
  },
  {
    value: 'equal',
    label: 'Equal',
    icon: <IconEqual size={iconSize} stroke={DIAL_KIT_ICON_STROKE} />,
  },
  {
    value: 'not-equal',
    label: 'Not equal',
    icon: <IconDashboardOff size={iconSize} stroke={DIAL_KIT_ICON_STROKE} />,
  },
  {
    value: 'starts',
    label: 'Starts with',
    icon: <IconAbc size={iconSize} stroke={DIAL_KIT_ICON_STROKE} />,
  },
  {
    value: 'ends',
    label: 'Ends with',
    icon: <IconAbc size={iconSize} stroke={DIAL_KIT_ICON_STROKE} />,
  },
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
    icon: <IconDashboardOff size={iconSize} stroke={DIAL_KIT_ICON_STROKE} />,
    description: 'icon-long option description',
  },
  { value: 'option-1', label: 'Option 1', description: 'Option 1 description' },
  {
    value: 'option-icon',
    label: 'Option Icon',
    icon: <IconDashboardOff size={iconSize} stroke={DIAL_KIT_ICON_STROKE} />,
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
  title: 'Components_2_0/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A select whose field is the 2.0 `Input`, so it shares its sizes, ' +
          'label, caption, error and disabled states.',
      },
    },
  },
  argTypes: {
    options: { control: { type: 'object' } },
    multiple: { control: { type: 'boolean' } },
    value: { control: { type: 'object' } },
    prefix: { control: { type: 'text' } },
    defaultValue: { control: { type: 'object' } },
    placeholder: { control: { type: 'text' } },
    size: {
      control: { type: 'inline-radio' },
      options: [ElementSize.Standard, ElementSize.Small],
      description: 'Field height: standard is 40px, small is 24px',
    },
    searchable: { control: { type: 'boolean' } },
    searchSize: {
      control: { type: 'select' },
      options: [ElementSize.Standard, ElementSize.Small],
    },
    selectAll: { control: { type: 'boolean' } },
    selectAllLabel: { control: { type: 'text' } },
    emptyStateTitle: { control: { type: 'text' } },
    emptyStateDescription: { control: { type: 'text' } },
    emptyStateIcon: { control: { type: 'object' } },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    error: { control: { type: 'text' } },
    caption: { control: { type: 'text' } },
    className: { control: { type: 'text' } },
    fieldClassName: { control: { type: 'text' } },
    closable: { control: { type: 'boolean' } },
    open: { control: { type: 'boolean' } },
    onOpenChange: { control: false },
    onClose: { control: false },
    onChange: { control: false },
    onSearchQueryChange: { control: false },
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
    size: ElementSize.Standard,
  },
  render: (args) => {
    return (
      <div className="w-[320px]">
        <Select {...args} />
      </div>
    );
  },
} satisfies Meta<SelectProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SinglePreselected: Story = {
  args: { defaultValue: 'contain' },
};

export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: ['contain', 'equal'],
  },
};

export const Small: Story = {
  args: {
    size: ElementSize.Small,
  },
};

export const WithLabel: Story = {
  name: 'With label and caption',
  args: {
    id: 'labelled-select',
    labelProps: { label: 'Operator', required: true },
    caption: 'Pick how the values are compared',
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    error: 'Please select an operator',
    labelProps: { label: 'Operator' },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'contain',
  },
};

export const WithFooterClickCallback: Story = {
  name: 'With footer click callback',
  args: {
    header: (
      <div className="px-3 py-2 border-b">
        <span className="dial-small-text text-primary font-medium">
          Select time range
        </span>
      </div>
    ),
    footer: <PrimaryButton label="Apply" />,
    onFooterClick: (e) => {
      console.info('Footer clicked', e);
    },
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

export const SearchableSmall: Story = {
  name: 'Searchable (small search)',
  args: {
    searchable: true,
    searchSize: ElementSize.Small,
  },
};

const productsMockOptions: SelectOption[] = [
  { value: 'laptop', label: 'Laptop' },
  { value: 'smartphone', label: 'Smartphone' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'smartwatch', label: 'Smartwatch' },
  { value: 'headphones', label: 'Headphones' },
  { value: 'camera', label: 'Camera' },
  { value: 'printer', label: 'Printer' },
  { value: 'monitor', label: 'Monitor' },
  { value: 'keyboard', label: 'Keyboard' },
  { value: 'mouse', label: 'Mouse' },
];

export const SearchWithExternalRequest: Story = {
  name: 'Search with external request',
  args: {
    searchable: true,
    searchPlaceholder: 'Start typing device name, e.g. smartphone...',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Simulates fetching options from an external source based on the overlay ' +
          'search query, with debounce.',
      },
    },
  },
  render: (args) => {
    const [options, setOptions] = useState<SelectOption[]>(productsMockOptions);
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

    const handleSearch = (query: string) => {
      // Clear previous timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Simulate an API request with debounce
      debounceTimeoutRef.current = setTimeout(() => {
        setOptions(
          query.length
            ? productsMockOptions.filter((option) =>
                option.label.toLowerCase().includes(query.toLowerCase()),
              )
            : productsMockOptions,
        );
      }, 300);
    };

    return (
      <div className="w-[320px]">
        <Select
          {...args}
          options={options}
          onSearchQueryChange={handleSearch}
        />
      </div>
    );
  },
};

export const CustomFieldClass: Story = {
  name: 'Custom field class',
  args: {
    fieldClassName: '!h-auto min-h-[48px]',
  },
};

export const WithSubMenuOptions: Story = {
  name: 'With sub-menu options',
  render: (args) => (
    <div className="w-[280px]">
      <Select
        {...args}
        placeholder="Select option..."
        options={[
          {
            value: 'contain',
            label: 'Contain',
            icon: <IconAbc size={iconSize} stroke={DIAL_KIT_ICON_STROKE} />,
          },
          {
            value: 'equal',
            label: 'Equal',
            icon: <IconEqual size={iconSize} stroke={DIAL_KIT_ICON_STROKE} />,
          },
          {
            value: 'group-compare',
            label: 'Compare',
            children: [
              { value: 'gt', label: 'Greater than' },
              { value: 'gte', label: 'Greater than or equal' },
              { value: 'lt', label: 'Less than' },
              { value: 'lte', label: 'Less than or equal' },
            ],
          },
          {
            value: 'disabled-group',
            label: 'Disabled group',
            disabled: true,
            icon: (
              <IconDashboardOff size={iconSize} stroke={DIAL_KIT_ICON_STROKE} />
            ),
            children: [{ value: 'x', label: 'Child X' }],
          },
        ]}
      />
    </div>
  ),
};

/**
 * Splits a dotted label into a secondary-colored namespace part (everything up
 * to and including the last dot) and a primary-colored name part (everything
 * after the last dot). This mimics styling being computed by the consumer.
 */
const renderDottedLabel = (label: string) => {
  const lastDot = label.lastIndexOf('.');
  if (lastDot === -1) {
    return <span className="text-primary">{label}</span>;
  }

  const namespace = label.slice(0, lastDot + 1);
  const name = label.slice(lastDot + 1);

  return (
    <span className="truncate">
      <span className="text-secondary">{namespace}</span>
      <span className="text-primary">{name}</span>
    </span>
  );
};

const dottedLabels = [
  'someValue.withOption',
  'secondValue.specificOption',
  'lastValue.strongText',
];

const dottedOptions: SelectOption[] = dottedLabels.map((label) => ({
  value: label,
  label,
  labelNode: renderDottedLabel(label),
}));

export const CustomLabelNode: Story = {
  name: 'Custom label node',
  args: {
    options: dottedOptions,
    placeholder: 'Select value…',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Options can render a custom `labelNode` while keeping a plain-text `label` ' +
          'for filtering and accessibility. Here the part before the last dot ' +
          '(including the dot) is muted (`text-secondary`) and the part after it is ' +
          'emphasized (`text-primary`). Styling and labels are computed by the consumer. ' +
          'Because a `labelNode` cannot live inside an `<input>`, the selected value is ' +
          "rendered in the field's content slot and folded into its accessible name.",
      },
    },
  },
  render: (args) => (
    <div className="w-[320px]">
      <Select {...args} />
    </div>
  ),
};

/**
 * The multiselect row from the design spec, with the list held open. Each row is
 * one `option`: the box is decorative and the whole 40px rectangle selects.
 * Hover and focus are interaction states — hover a row or tab to it to see them.
 */
export const MultiselectRowStates: Story = {
  args: {
    multiple: true,
    open: true,
    selectAll: true,
    labelProps: { label: 'Folders' },
    defaultValue: ['selected', 'selected-disabled'],
    options: [
      { value: 'unselected', label: 'Label' },
      { value: 'selected', label: 'Label' },
      { value: 'unselected-disabled', label: 'Label', disabled: true },
      { value: 'selected-disabled', label: 'Label', disabled: true },
      {
        value: 'with-description',
        label: 'Label',
        description: 'with description',
      },
      {
        value: 'truncated',
        label:
          'A label long enough that the row has to clip it rather than grow',
      },
    ],
  },
  render: (args) => (
    // The open list is absolutely positioned, so the story needs room under it.
    <div className="h-[420px] w-[320px]">
      <Select {...args} />
    </div>
  ),
};

/**
 * A select list tints its chosen row — that is the design's mark, and the
 * default. `selectedOptionMark` swaps it for a trailing check, the way a menu
 * marks its rows, or for the navigation highlight.
 */
export const SelectedOptionCheck: Story = {
  name: 'Selected option: trailing check',
  args: {
    selectedOptionMark: MenuItemMark.Check,
    defaultValue: 'contain',
  },
};

export const NavigationHighlight: Story = {
  name: 'Selected option: navigation highlight',
  args: {
    selectedOptionMark: MenuItemMark.Highlight,
    defaultValue: 'contain',
  },
};

/**
 * An option can carry a control of its own at its trailing edge — the design's
 * favourite toggle. It sits beside the option rather than inside it, so it
 * keeps its own click and does not become part of the option name.
 */
export const OptionsWithRightControl: Story = {
  name: 'Options with a right control',
  args: {
    options: baseOptions.slice(0, 3).map((option) => ({
      ...option,
      rightControl: (
        <GhostIconButton
          aria-label={`Add ${option.label} to favourites`}
          size={ElementSize.Small}
          icon={
            <IconStar
              size={iconSize}
              stroke={DIAL_KIT_ICON_STROKE}
              aria-hidden="true"
            />
          }
        />
      ),
    })),
  },
};
