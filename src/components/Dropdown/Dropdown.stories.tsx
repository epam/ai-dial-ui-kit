import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  IconUser,
  IconSettings,
  IconLogout,
  IconHome,
  IconSearch,
  IconStar,
  IconHeart,
  IconBookmark,
  IconFile,
  IconFolder,
  IconPhoto,
  IconVideo,
  IconMusic,
  IconCode,
} from '@tabler/icons-react';

import { DialDropdown } from './Dropdown';
import type { DropdownType } from '@/types/dropdown';
import type { DialDropdownComponentProps } from './DropdownComponent';
import type { DropdownItemsModel } from '@/models/dropdown';

// Define proper type for story args
type StoryArgs = DialDropdownComponentProps;

// Sample data
const basicItems: DropdownItemsModel[] = [
  { id: '1', name: 'Option 1' },
  { id: '2', name: 'Option 2' },
  { id: '3', name: 'Option 3' },
  { id: '4', name: 'Option 4' },
  { id: '5', name: 'Option 5' },
];

const itemsWithIcons: DropdownItemsModel[] = [
  { id: 'profile', name: 'Profile', icon: <IconUser size={16} /> },
  { id: 'settings', name: 'Settings', icon: <IconSettings size={16} /> },
  { id: 'home', name: 'Home', icon: <IconHome size={16} /> },
  { id: 'logout', name: 'Logout', icon: <IconLogout size={16} /> },
];

const itemsWithDescriptions: DropdownItemsModel[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    description: '$9/month',
    icon: <IconStar size={16} />,
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    description: '$19/month',
    icon: <IconHeart size={16} />,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Contact us',
    icon: <IconBookmark size={16} />,
  },
];

const fileTypeItems: DropdownItemsModel[] = [
  { id: 'document', name: 'Document', icon: <IconFile size={16} /> },
  { id: 'folder', name: 'Folder', icon: <IconFolder size={16} /> },
  { id: 'image', name: 'Image', icon: <IconPhoto size={16} /> },
  { id: 'video', name: 'Video', icon: <IconVideo size={16} /> },
  { id: 'music', name: 'Music', icon: <IconMusic size={16} /> },
  { id: 'code', name: 'Code', icon: <IconCode size={16} /> },
];

const longList: DropdownItemsModel[] = Array.from({ length: 20 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: `Long List Item ${i + 1}`,
  description: `Description for item ${i + 1}`,
}));

const statusItems: DropdownItemsModel[] = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
  { id: 'pending', name: 'Pending' },
  { id: 'disabled', name: 'Disabled', disabled: true },
];

// Story Components
const BasicExample = (args: StoryArgs) => {
  const [selectedValue, setSelectedValue] = useState<DropdownItemsModel>();

  return (
    <div className="w-64">
      <DialDropdown {...args} selectedValue={selectedValue}>
        {basicItems.map((item) => (
          <DialDropdown.Item
            key={item.id}
            dropdownItem={item}
            onClick={() => setSelectedValue(item)}
          />
        ))}
      </DialDropdown>
    </div>
  );
};

const WithIconsExample = (args: StoryArgs) => {
  const [selectedValue, setSelectedValue] = useState<DropdownItemsModel>();

  return (
    <div className="w-64">
      <DialDropdown {...args} selectedValue={selectedValue}>
        {itemsWithIcons.map((item) => (
          <DialDropdown.Item
            key={item.id}
            dropdownItem={item}
            onClick={() => setSelectedValue(item)}
          />
        ))}
      </DialDropdown>
    </div>
  );
};

const WithDescriptionsExample = (args: StoryArgs) => {
  const [selectedValue, setSelectedValue] = useState<DropdownItemsModel>();

  return (
    <div className="w-80">
      <DialDropdown {...args} selectedValue={selectedValue}>
        {itemsWithDescriptions.map((item) => (
          <DialDropdown.Item
            key={item.id}
            dropdownItem={item}
            onClick={() => setSelectedValue(item)}
          />
        ))}
      </DialDropdown>
    </div>
  );
};

const DisabledExample = (args: StoryArgs) => {
  const [selectedValue, setSelectedValue] = useState<DropdownItemsModel>(
    basicItems[0],
  );

  return (
    <div className="w-64">
      <DialDropdown {...args} selectedValue={selectedValue}>
        {basicItems.map((item) => (
          <DialDropdown.Item
            key={item.id}
            dropdownItem={item}
            onClick={() => setSelectedValue(item)}
          />
        ))}
      </DialDropdown>
    </div>
  );
};

const WithPrefixExample = (args: StoryArgs) => {
  const [selectedValue, setSelectedValue] = useState<DropdownItemsModel>();

  return (
    <div className="w-64">
      <DialDropdown {...args} selectedValue={selectedValue}>
        {fileTypeItems.map((item) => (
          <DialDropdown.Item
            key={item.id}
            dropdownItem={item}
            onClick={() => setSelectedValue(item)}
          />
        ))}
      </DialDropdown>
    </div>
  );
};

const MultiSelectExample = (args: StoryArgs) => {
  const [multipleValues, setMultipleValues] = useState<string[]>([]);

  const handleToggle = (itemId: string) => {
    setMultipleValues((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  return (
    <div className="w-64">
      <DialDropdown {...args} multipleValues={multipleValues}>
        {basicItems.map((item) => (
          <DialDropdown.Item
            key={item.id}
            dropdownItem={item}
            onClick={() => handleToggle(item.id)}
            multipleValues={multipleValues}
            allItemsCount={basicItems.length}
          />
        ))}
      </DialDropdown>
    </div>
  );
};

const MultiSelectWithSelectAllExample = (args: StoryArgs) => {
  const [multipleValues, setMultipleValues] = useState<string[]>([]);
  const allIds = basicItems.map((item) => item.id);

  const handleToggle = (itemId: string) => {
    if (itemId === 'ALL') {
      setMultipleValues(multipleValues.length === allIds.length ? [] : allIds);
    } else {
      setMultipleValues((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId],
      );
    }
  };

  const itemsWithSelectAll = [{ id: 'ALL', name: 'Select All' }, ...basicItems];

  return (
    <div className="w-64">
      <DialDropdown {...args} multipleValues={multipleValues}>
        {itemsWithSelectAll.map((item) => (
          <DialDropdown.Item
            key={item.id}
            dropdownItem={item}
            onClick={() => handleToggle(item.id)}
            multipleValues={multipleValues}
            allItemsCount={basicItems.length}
          />
        ))}
      </DialDropdown>
    </div>
  );
};

const MenuStyleExample = (args: StoryArgs) => {
  const [selectedValue, setSelectedValue] = useState<DropdownItemsModel>();

  return (
    <div className="w-64">
      <DialDropdown {...args} selectedValue={selectedValue}>
        {itemsWithIcons.map((item) => (
          <DialDropdown.Item
            key={item.id}
            dropdownItem={item}
            onClick={() => setSelectedValue(item)}
            isMenu={true}
          />
        ))}
      </DialDropdown>
    </div>
  );
};

const CustomTriggerExample = (args: StoryArgs) => {
  const [selectedValue, setSelectedValue] = useState<DropdownItemsModel>();

  return (
    <div className="w-64">
      <DialDropdown
        {...args}
        selectedValue={selectedValue}
        trigger={
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <IconSearch size={16} />
            {selectedValue?.name || 'Custom Button'}
          </button>
        }
      >
        {itemsWithIcons.map((item) => (
          <DialDropdown.Item
            key={item.id}
            dropdownItem={item}
            onClick={() => setSelectedValue(item)}
          />
        ))}
      </DialDropdown>
    </div>
  );
};

const LongListExample = (args: StoryArgs) => {
  const [selectedValue, setSelectedValue] = useState<DropdownItemsModel>();

  return (
    <div className="w-80">
      <DialDropdown {...args} selectedValue={selectedValue}>
        {longList.map((item) => (
          <DialDropdown.Item
            key={item.id}
            dropdownItem={item}
            onClick={() => setSelectedValue(item)}
          />
        ))}
      </DialDropdown>
    </div>
  );
};

const FieldWrapperExample = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  return (
    <div className="w-80">
      <DialDropdown.Field
        elementId="field-dropdown"
        fieldTitle="Select Status"
        items={statusItems}
        selectedValue={selectedValue}
        onChange={setSelectedValue}
        placeholder="Choose status..."
        optional={false}
      />
    </div>
  );
};

const OptionalFieldExample = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  return (
    <div className="w-80">
      <DialDropdown.Field
        elementId="optional-dropdown"
        fieldTitle="Category"
        items={fileTypeItems}
        selectedValue={selectedValue}
        onChange={setSelectedValue}
        placeholder="Select category..."
        optional={true}
      />
    </div>
  );
};

const FieldWithMultiSelectExample = () => {
  const [multipleValues, setMultipleValues] = useState<string[]>([]);

  const handleChange = (value: string) => {
    setMultipleValues((prev) =>
      prev.includes(value)
        ? prev.filter((id) => id !== value)
        : [...prev, value],
    );
  };

  return (
    <div className="w-80">
      <DialDropdown.Field
        elementId="multi-field"
        fieldTitle="Select Multiple Options"
        items={basicItems}
        selectedValue=""
        onChange={handleChange}
        multipleValues={multipleValues}
        placeholder="Select multiple..."
      />
    </div>
  );
};

const ControlledExample = (args: StoryArgs) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<DropdownItemsModel>();

  return (
    <div className="w-64 space-y-4">
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          {isOpen ? 'Close' : 'Open'} Dropdown
        </button>
      </div>
      <DialDropdown
        {...args}
        selectedValue={selectedValue}
        isMenuOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        {basicItems.map((item) => (
          <DialDropdown.Item
            key={item.id}
            dropdownItem={item}
            onClick={() => setSelectedValue(item)}
          />
        ))}
      </DialDropdown>
    </div>
  );
};

const DifferentPlacementsExample = (args: StoryArgs) => {
  const [selectedValue, setSelectedValue] = useState<DropdownItemsModel>();

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      <div className="w-64">
        <p className="mb-2 text-sm font-medium">Top Placement</p>
        <DialDropdown {...args} selectedValue={selectedValue} placement="top">
          {basicItems.slice(0, 3).map((item) => (
            <DialDropdown.Item
              key={item.id}
              dropdownItem={item}
              onClick={() => setSelectedValue(item)}
            />
          ))}
        </DialDropdown>
      </div>

      <div className="w-64">
        <p className="mb-2 text-sm font-medium">Bottom Placement (Default)</p>
        <DialDropdown
          {...args}
          selectedValue={selectedValue}
          placement="bottom"
        >
          {basicItems.slice(0, 3).map((item) => (
            <DialDropdown.Item
              key={item.id}
              dropdownItem={item}
              onClick={() => setSelectedValue(item)}
            />
          ))}
        </DialDropdown>
      </div>

      <div className="w-64">
        <p className="mb-2 text-sm font-medium">Right Placement</p>
        <DialDropdown {...args} selectedValue={selectedValue} placement="right">
          {basicItems.slice(0, 3).map((item) => (
            <DialDropdown.Item
              key={item.id}
              dropdownItem={item}
              onClick={() => setSelectedValue(item)}
            />
          ))}
        </DialDropdown>
      </div>
    </div>
  );
};

const ComplexExampleBase = (args: StoryArgs) => {
  const [selectedValue, setSelectedValue] = useState<DropdownItemsModel>();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = itemsWithDescriptions.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-96 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Search and Select Plan
        </label>
        <input
          type="text"
          placeholder="Search plans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
        />
      </div>

      <DialDropdown
        {...args}
        selectedValue={selectedValue}
        placeholder="Select a plan..."
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <DialDropdown.Item
              key={item.id}
              dropdownItem={item}
              onClick={() => setSelectedValue(item)}
            />
          ))
        ) : (
          <DialDropdown.Item>
            <div className="px-3 py-2 text-gray-500">No plans found</div>
          </DialDropdown.Item>
        )}
      </DialDropdown>

      {selectedValue && (
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-medium">Selected Plan:</h3>
          <p className="text-sm text-gray-600">
            {selectedValue.name} - {selectedValue.description}
          </p>
        </div>
      )}
    </div>
  );
};

const SizeVariantsExample = (args: StoryArgs) => {
  const [selectedValue, setSelectedValue] = useState<DropdownItemsModel>();

  return (
    <div className="space-y-6">
      <div className="w-48">
        <p className="mb-2 text-sm font-medium">Small (w-48)</p>
        <DialDropdown {...args} selectedValue={selectedValue}>
          {basicItems.slice(0, 3).map((item) => (
            <DialDropdown.Item
              key={item.id}
              dropdownItem={item}
              onClick={() => setSelectedValue(item)}
            />
          ))}
        </DialDropdown>
      </div>

      <div className="w-64">
        <p className="mb-2 text-sm font-medium">Medium (w-64)</p>
        <DialDropdown {...args} selectedValue={selectedValue}>
          {basicItems.slice(0, 3).map((item) => (
            <DialDropdown.Item
              key={item.id}
              dropdownItem={item}
              onClick={() => setSelectedValue(item)}
            />
          ))}
        </DialDropdown>
      </div>

      <div className="w-96">
        <p className="mb-2 text-sm font-medium">Large (w-96)</p>
        <DialDropdown {...args} selectedValue={selectedValue}>
          {basicItems.slice(0, 3).map((item) => (
            <DialDropdown.Item
              key={item.id}
              dropdownItem={item}
              onClick={() => setSelectedValue(item)}
            />
          ))}
        </DialDropdown>
      </div>
    </div>
  );
};

const meta = {
  title: 'Components/Dropdown',
  component: DialDropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible dropdown component with support for single and multi-selection, icons, descriptions, and various customization options. Use DialDropdown.Item for dropdown items and DialDropdown.Field for form integration.',
      },
    },
  },
  argTypes: {
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text when no item is selected',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the dropdown is disabled',
    },
    type: {
      control: { type: 'select' },
      options: ['dropdown', 'menu'] as DropdownType[],
      description: 'Type of dropdown display',
    },
    isMenu: {
      control: { type: 'boolean' },
      description: 'Whether to style as a menu',
    },
    shouldFlip: {
      control: { type: 'boolean' },
      description: 'Whether to flip when space is limited',
    },
    shouldApplySize: {
      control: { type: 'boolean' },
      description: 'Whether to apply size constraints',
    },
    prefix: {
      control: { type: 'text' },
      description: 'Text prefix for selected value',
    },
    listClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for dropdown list',
    },
    selectedClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for selected value display',
    },
  },
  args: {
    placeholder: 'Select an option...',
    disabled: false,
    type: 'dropdown' as DropdownType,
    isMenu: false,
    shouldFlip: true,
    shouldApplySize: true,
  },
} satisfies Meta<typeof DialDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Basic: Story = {
  render: (args) => <BasicExample {...args} />,
};

export const WithIcons: Story = {
  render: (args) => <WithIconsExample {...args} />,
  args: {
    placeholder: 'Select with icon...',
  },
};

export const WithDescriptions: Story = {
  render: (args) => <WithDescriptionsExample {...args} />,
  args: {
    placeholder: 'Choose your plan...',
  },
};

export const Disabled: Story = {
  render: (args) => <DisabledExample {...args} />,
  args: {
    disabled: true,
  },
};

export const WithPrefix: Story = {
  render: (args) => <WithPrefixExample {...args} />,
  args: {
    prefix: 'Type: ',
    placeholder: 'Select file type...',
  },
};

// Multi-select Examples
export const MultiSelect: Story = {
  render: (args) => <MultiSelectExample {...args} />,
  args: {
    placeholder: 'Select multiple options...',
  },
};

export const MultiSelectWithSelectAll: Story = {
  render: (args) => <MultiSelectWithSelectAllExample {...args} />,
  args: {
    placeholder: 'Select options...',
  },
};

// Menu Style Examples
export const MenuStyle: Story = {
  render: (args) => <MenuStyleExample {...args} />,
  args: {
    isMenu: true,
    type: 'menu' as DropdownType,
    placeholder: 'Menu style...',
  },
};

// Custom Trigger Examples
export const CustomTrigger: Story = {
  render: (args) => <CustomTriggerExample {...args} />,
};

// Large List Example
export const LongList: Story = {
  render: (args) => <LongListExample {...args} />,
  args: {
    placeholder: 'Select from long list...',
  },
};

// Field Examples
export const FieldWrapper: Story = {
  render: () => <FieldWrapperExample />,
};

export const OptionalField: Story = {
  render: () => <OptionalFieldExample />,
};

export const FieldWithMultiSelect: Story = {
  render: () => <FieldWithMultiSelectExample />,
};

// Controlled Examples
export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
  args: {
    placeholder: 'Controlled dropdown...',
  },
};

// Placement Examples
export const DifferentPlacements: Story = {
  render: (args) => <DifferentPlacementsExample {...args} />,
  args: {
    placeholder: 'Different placements...',
  },
};

// Complex Example
export const ComplexExample: Story = {
  render: (args) => <ComplexExampleBase {...args} />,
};

// Size Variants
export const SizeVariants: Story = {
  render: (args) => <SizeVariantsExample {...args} />,
  args: {
    placeholder: 'Size example...',
  },
};
