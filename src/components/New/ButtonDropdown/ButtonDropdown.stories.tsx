import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonDropdown, type ButtonDropdownProps } from './ButtonDropdown';
import { ButtonAppearance, ButtonVariant } from '@/types/button';

const dropdownItems = [
  {
    key: 'Action1',
    label: 'Action 1',
    onClick: () => alert('Action1 clicked!'),
  },
  {
    key: 'Action2',
    label: 'Action 2',
    onClick: () => alert('Action2 clicked!'),
  },
];
const longDropdownItems = [
  {
    key: 'Action1',
    label: 'A very very long name for Action 1',
    onClick: () => alert('Action1 clicked!'),
  },
  {
    key: 'Action2',
    label: 'A very very long name for Action 2',
    onClick: () => alert('Action2 clicked!'),
  },
];

const meta: Meta<typeof ButtonDropdown> = {
  title: 'Components_2_0/ButtonDropdown',
  component: ButtonDropdown,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A dropdown component with button trigger, and multiple action items.',
      },
    },
  },
  argTypes: {
    items: { control: { type: 'object' }, description: 'Items for dropdown' },
    variant: {
      control: { type: 'select' },
      options: [
        ButtonVariant.Primary,
        ButtonVariant.Secondary,
        ButtonVariant.Tertiary,
      ],
      description: 'Button style variant',
    },
    appearance: {
      control: { type: 'select' },
      options: [
        ButtonAppearance.Ghost,
        ButtonAppearance.Link,
        ButtonAppearance.Solid,
        ButtonAppearance.Outlined,
      ],
      description: 'Button appearance',
    },

    title: {
      control: { type: 'text' },
      description: 'Button text content',
    },
  },
} satisfies Meta<ButtonDropdownProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const Example = (args: ButtonDropdownProps) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <ButtonDropdown {...args} />
    </div>
  );
};

export const Default: Story = {
  args: {
    title: 'Actions',
    variant: ButtonVariant.Neutral,
    appearance: ButtonAppearance.Outlined,
    items: dropdownItems,
  },
  render: Example,
};

export const DefaultWithLongActions: Story = {
  args: {
    title: 'Actions',
    variant: ButtonVariant.Neutral,
    appearance: ButtonAppearance.Outlined,
    items: longDropdownItems,
  },
  render: Example,
};

export const AllVariants: Story = {
  render: () => (
    <div className="p-8 flex flex-col gap-y-6">
      {/* Default */}
      <div className="flex flex-row items-center">
        <div className="text-primary pr-4 py-2">Default</div>
        <ButtonDropdown
          title="Actions"
          variant={ButtonVariant.Neutral}
          appearance={ButtonAppearance.Outlined}
          items={dropdownItems}
        />
      </div>
      {/* Long Action Names */}
      <div className="flex flex-row items-center">
        <div className="text-primary pr-4 py-2">Long names</div>
        <ButtonDropdown title="Actions" items={longDropdownItems} />
      </div>
    </div>
  ),
};
