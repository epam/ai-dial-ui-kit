import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  IconBolt,
  IconBrandOpenai,
  IconCirclePlus,
  IconMessageCircle,
  IconRobot,
  IconSparkles,
} from '@tabler/icons-react';
import { useState, type ReactNode } from 'react';

import { DialDropdownIcon, type DialDropdownIconProps } from './DropdownIcon';
import { DropdownItemType } from '@/types/dropdown';
import type { DropdownItem } from '@/models/dropdown';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ElementSize } from '@/types/size';

const modelItems: DropdownItem[] = [
  {
    key: 'gpt-5-4',
    label: 'GPT 5.4',
    icon: <IconBrandOpenai size={DIAL_ICON_SIZE.SM} />,
  },
  {
    key: 'gemini-3-1',
    label: 'Gemini 3.1',
    icon: <IconSparkles size={DIAL_ICON_SIZE.SM} />,
  },
  {
    key: 'claude-4-6',
    label: 'Anthropic Claude 4.6',
    icon: <IconBolt size={DIAL_ICON_SIZE.SM} />,
  },
  {
    key: 'assistant',
    label: 'Assistant 10k',
    icon: <IconMessageCircle size={DIAL_ICON_SIZE.SM} />,
  },
  {
    key: 'testing',
    label: 'Testing-flask',
    icon: <IconRobot size={DIAL_ICON_SIZE.SM} />,
  },
  {
    key: 'claude-4-6',
    label: 'Anthropic Claude 4.6',
    icon: <IconBolt size={DIAL_ICON_SIZE.SM} />,
  },
  { key: 'divider', type: DropdownItemType.Divider },
  {
    key: 'assistant',
    label: 'Assistant 10k',
    icon: <IconMessageCircle size={DIAL_ICON_SIZE.SM} />,
  },
  {
    key: 'testing',
    label: 'Testing-flask',
    icon: <IconRobot size={DIAL_ICON_SIZE.SM} />,
  },
  {
    key: 'default',
    label: 'Default-agent',
    icon: <IconMessageCircle size={DIAL_ICON_SIZE.SM} />,
  },
  {
    key: 'marketplace',
    label: 'Add from marketplace',
    icon: <IconCirclePlus size={DIAL_ICON_SIZE.SM} />,
  },
];

const meta = {
  title: 'Dropdown/DropdownIcon',
  component: DialDropdownIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A compact dropdown trigger for icon-first selectors and model menus.',
      },
    },
  },
  argTypes: {
    ariaLabel: { control: { type: 'text' } },
    size: {
      control: { type: 'select' },
      options: [ElementSize.Standard, ElementSize.Small],
    },
    disabled: { control: { type: 'boolean' } },
    showCaret: { control: { type: 'boolean' } },
    icon: { control: false },
    caretIcon: { control: false },
    menu: { control: false },
    placement: { control: false },
    allowedPlacements: { control: false },
    className: { control: false },
    buttonClassName: { control: false },
    iconClassName: { control: false },
  },
  args: {
    ariaLabel: 'Select model',
    icon: <IconBrandOpenai size={DIAL_ICON_SIZE.MD} />,
    menu: { items: modelItems },
    showCaret: true,
    disabled: false,
  },
} satisfies Meta<DialDropdownIconProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: ElementSize.Small,
    icon: <IconBrandOpenai size={DIAL_ICON_SIZE.SM} />,
  },
};

export const WithoutCaret: Story = {
  args: {
    showCaret: false,
  },
};

const modelOptions: { key: string; label: string; icon: ReactNode }[] = [
  {
    key: 'gpt-5-4',
    label: 'GPT 5.4',
    icon: <IconBrandOpenai size={DIAL_ICON_SIZE.MD} />,
  },
  {
    key: 'gemini-3-1',
    label: 'Gemini 3.1',
    icon: <IconSparkles size={DIAL_ICON_SIZE.MD} />,
  },
  {
    key: 'claude-4-6',
    label: 'Anthropic Claude 4.6',
    icon: <IconBolt size={DIAL_ICON_SIZE.MD} />,
  },
  {
    key: 'assistant',
    label: 'Assistant 10k',
    icon: <IconMessageCircle size={DIAL_ICON_SIZE.MD} />,
  },
  {
    key: 'testing',
    label: 'Testing-flask',
    icon: <IconRobot size={DIAL_ICON_SIZE.MD} />,
  },
];

export const ControlledOpen: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the controlled `open` + `onOpenChange` pattern. The parent owns open state; the component fires `onOpenChange` but never updates it unilaterally.',
      },
    },
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <DialDropdownIcon {...args} open={open} onOpenChange={setOpen} />
        <span className="text-sm text-secondary">
          Dropdown is {open ? 'open' : 'closed'}
        </span>
      </div>
    );
  },
};

export const ModelSelector: Story = {
  render: (args) => {
    const [selectedKey, setSelectedKey] = useState('gpt-5-4');
    const selected =
      modelOptions.find((m) => m.key === selectedKey) ?? modelOptions[0];

    const items: DropdownItem[] = [
      ...modelOptions.map((m) => ({
        key: m.key,
        label: m.label,
        icon: m.icon,
        onClick: () => setSelectedKey(m.key),
      })),
      { key: 'divider', type: DropdownItemType.Divider },
      {
        key: 'marketplace',
        label: 'Add from marketplace',
        icon: <IconCirclePlus size={DIAL_ICON_SIZE.MD} />,
      },
    ];

    return (
      <DialDropdownIcon
        {...args}
        icon={
          <span className="size-6 flex items-center justify-center">
            {selected.icon}
          </span>
        }
        menu={{ items }}
        maxDropdownHeight={200}
      />
    );
  },
};
