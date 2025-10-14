import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type { Placement } from '@floating-ui/react';
import {
  IconUser,
  IconSettings,
  IconLogout,
  IconChevronDown,
  IconRowRemove,
  IconStack,
  IconExternalLink,
  IconCopy,
  IconTrash,
  IconDots,
} from '@tabler/icons-react';

import { DialDropdown, type DialDropdownProps } from './Dropdown';
import { DropdownItemType, DropdownTrigger } from '@/types/dropdown';
import { DialButton } from '@/components/Button/Button';
import { ButtonVariant } from '@/types/button';
import { type DropdownItem } from '@/models/dropdown';

const items: DropdownItem[] = [
  { key: 'profile', label: 'Profile', icon: <IconUser size={16} /> },
  { key: 'settings', label: 'Settings', icon: <IconSettings size={16} /> },
  {
    key: 'disabled',
    label: 'Disabled',
    icon: <IconStack size={16} />,
    disabled: true,
  },
  {
    key: 'danger',
    label: 'Danger',
    icon: <IconRowRemove size={16} />,
    danger: true,
  },
  { key: 'd1', type: DropdownItemType.Divider },
  {
    key: 'logout',
    label: 'Logout',
    icon: <IconLogout size={16} />,
  },
];

const specItems: DropdownItem[] = [
  {
    key: 'open',
    label: 'Open in a new tab',
    icon: <IconExternalLink size={16} />,
  },
  {
    key: 'dup',
    label: 'Duplicate as a new version',
    icon: <IconCopy size={16} />,
  },
  { key: 'd2', type: DropdownItemType.Divider },
  { key: 'del', label: 'Delete', icon: <IconTrash size={16} />, danger: true },
];

const TriggerBtn = ({ label = 'Open' }: { label?: string }) => (
  <DialButton
    variant={ButtonVariant.Primary}
    iconAfter={<IconChevronDown size={16} />}
    title={label}
  />
);

const PLACEMENTS: Placement[] = [
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
];

const meta = {
  title: 'Overlay/Dropdown',
  component: DialDropdown,
  parameters: { layout: 'centered', themes: {} },
  argTypes: {
    trigger: {
      control: { type: 'inline-check' },
      options: [
        DropdownTrigger.Click,
        DropdownTrigger.Hover,
        DropdownTrigger.ContextMenu,
      ],
    },
    placement: { control: { type: 'select' }, options: PLACEMENTS },
    disabled: { control: { type: 'boolean' } },
    closable: { control: { type: 'boolean' } },
    cssClass: { control: { type: 'text' } },
    listClassName: { control: { type: 'text' } },
    open: { control: false },
    defaultOpen: { control: false },
    onOpenChange: { control: false },
    onClose: { control: false },
    menu: { control: false },
    renderOverlay: { control: false },
    children: { control: false },
  },
  args: {
    trigger: [DropdownTrigger.Click],
    disabled: false,
    closable: false,
    children: <TriggerBtn />,
    menu: { items },
  },
} satisfies Meta<typeof DialDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const RightTightGap: Story = {
  args: { placement: 'right-start' },
};

export const HoverTrigger: Story = {
  args: { trigger: [DropdownTrigger.Hover] },
};

export const SpecWidthHugContent: Story = {
  name: 'Width hugs content (spec-like)',
  args: {
    placement: 'bottom-start',
    menu: { items: specItems },
  },
};

const ControlledExample = (args: DialDropdownProps) => {
  const [open, setOpen] = useState(false);
  const controllerRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="flex items-center gap-2">
      <span ref={controllerRef}>
        <DialButton
          variant={ButtonVariant.Secondary}
          title={open ? 'Close Dropdown' : 'Open Dropdown'}
          onClick={() => setOpen((v) => !v)}
        />
      </span>
      <DialDropdown
        {...args}
        trigger={[]}
        open={open}
        onOpenChange={setOpen}
        outsidePressIgnoreRef={controllerRef}
      >
        <TriggerBtn label="Controlled" />
      </DialDropdown>
    </div>
  );
};

export const ControlledOpen: Story = {
  args: {},
  render: (args) => <ControlledExample {...args} />,
};

export const AllPlacements: Story = {
  args: {},
  render: (args) => (
    <div className="flex flex-col gap-2">
      <DialDropdown {...args}>
        <TriggerBtn label="Auto (default)" />
      </DialDropdown>
      {PLACEMENTS.map((p) => (
        <DialDropdown key={p} {...args} placement={p}>
          <TriggerBtn label={p} />
        </DialDropdown>
      ))}
    </div>
  ),
};

export const SecondaryEllipsisTrigger: Story = {
  name: 'Secondary trigger (ellipsis)',
  args: {
    children: (
      <DialButton
        variant={ButtonVariant.Secondary}
        ariaLabel="More actions"
        iconBefore={<IconDots size={16} />}
      />
    ),
    menu: { items: specItems },
    placement: 'bottom-end',
  },
};

export const AllowedPlacements: Story = {
  name: 'Allowed placements',
  render: (args) => (
    <div className="flex flex-col gap-2">
      <span className="text-primary dial-small">
        The dropdown below is set to open at bottom-start, but if there is not
        enough space, it can only be placed at top-start or top-end (no right or
        left placements).
      </span>
      <DialDropdown
        {...args}
        placement="bottom-start"
        allowedPlacements={['top-start', 'top-end']}
        menu={{ items: specItems }}
      >
        <TriggerBtn label="Allowed Placements" />
      </DialDropdown>
    </div>
  ),
};
