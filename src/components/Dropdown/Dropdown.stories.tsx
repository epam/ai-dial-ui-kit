import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState, type ReactNode } from 'react';
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
import {
  DialNeutralButton,
  DialPrimaryButton,
} from '@/components/Button/ButtonWrappers';
import { type DropdownItem } from '@/models/dropdown';
import { DIAL_ICON_SIZE } from '@/constants/icon';

const items: DropdownItem[] = [
  {
    key: 'profile',
    label: 'Profile',
    icon: <IconUser size={DIAL_ICON_SIZE.SM} />,
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: <IconSettings size={DIAL_ICON_SIZE.SM} />,
  },
  {
    key: 'disabled',
    label: 'Disabled',
    icon: <IconStack size={DIAL_ICON_SIZE.SM} />,
    disabled: true,
  },
  {
    key: 'danger',
    label: 'Danger',
    icon: <IconRowRemove size={DIAL_ICON_SIZE.SM} />,
    danger: true,
  },
  { key: 'd1', type: DropdownItemType.Divider },
  {
    key: 'logout',
    label: 'Logout',
    icon: <IconLogout size={DIAL_ICON_SIZE.SM} />,
  },
];

const specItems: DropdownItem[] = [
  {
    key: 'open',
    label: 'Open in a new tab',
    icon: <IconExternalLink size={DIAL_ICON_SIZE.SM} />,
  },
  {
    key: 'dup',
    label: 'Duplicate as a new version',
    icon: <IconCopy size={DIAL_ICON_SIZE.SM} />,
  },
  { key: 'd2', type: DropdownItemType.Divider },
  {
    key: 'del',
    label: 'Delete',
    icon: <IconTrash size={DIAL_ICON_SIZE.SM} />,
    danger: true,
  },
];

const TriggerBtn = ({ label = 'Open' }: { label?: ReactNode }) => (
  <DialPrimaryButton
    iconAfter={<IconChevronDown size={DIAL_ICON_SIZE.SM} />}
    label={label}
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
  title: 'Dropdown/Dropdown',
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
    anchorToMouse: { control: { type: 'boolean' } },
    matchReferenceWidth: { control: { type: 'boolean' } },
    className: { control: { type: 'text' } },
    listClassName: { control: { type: 'text' } },
    open: { control: false },
    defaultOpen: { control: false },
    onOpenChange: { control: false },
    onClose: { control: false },
    items: { control: false },
    onItemClick: { control: false },
    menuHeader: { control: false },
    menuFooter: { control: false },
    renderOverlay: { control: false },
    children: { control: false },
  },
  args: {
    trigger: [DropdownTrigger.Click],
    disabled: false,
    closable: false,
    anchorToMouse: false,
    matchReferenceWidth: true,
    children: <TriggerBtn />,
    items,
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
    matchReferenceWidth: false,
    items: specItems,
  },
};

const ControlledExample = (args: DialDropdownProps) => {
  const [open, setOpen] = useState(false);
  const controllerRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="flex items-center gap-2">
      <span ref={controllerRef}>
        <DialNeutralButton
          label={open ? 'Close Dropdown' : 'Open Dropdown'}
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
  render: ControlledExample,
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
      <DialNeutralButton
        aria-label="More actions"
        iconBefore={<IconDots size={DIAL_ICON_SIZE.SM} />}
      />
    ),
    items: specItems,
    placement: 'bottom-end',
  },
};

export const AllowedPlacements: Story = {
  name: 'Allowed placements',
  render: (args) => (
    <div className="flex flex-col gap-2">
      <span className="text-primary dial-small-text">
        The dropdown below is set to open at bottom-start, but if there is not
        enough space, it can only be placed at top-start or top-end (no right or
        left placements).
      </span>
      <DialDropdown
        {...args}
        placement="bottom-start"
        allowedPlacements={['top-start', 'top-end']}
        items={specItems}
      >
        <TriggerBtn label="Allowed Placements" />
      </DialDropdown>
    </div>
  ),
};

const timeItems = [
  { key: '15m', label: 'Last 15m' },
  { key: '30m', label: 'Last 30m' },
  { key: '1h', label: 'Last 1h' },
  { key: '3h', label: 'Last 3h' },
  { key: '6h', label: 'Last 6h' },
  { key: '12h', label: 'Last 12h' },
  { key: '24h', label: 'Last 24h' },
  { key: 'd', label: 'Last 2d' },
  { key: '7d', label: 'Last 7d' },
  { key: '30d', label: 'Last 30d' },
].map((i) => ({ key: i.key, label: i.label }));

export const WithCustomHeader: Story = {
  name: 'With custom header',
  args: {
    placement: 'bottom-start',
    items: [{ key: 'divider', type: DropdownItemType.Divider }, ...timeItems],
    menuHeader: (
      <div className="px-3 pt-2">
        <div className="flex items-center justify-between text-secondary">
          <span className="dial-small-text font-medium">Custom Time Range</span>
          <IconChevronDown size={14} />
        </div>
      </div>
    ),
  },
};

export const WithCustomFooter: Story = {
  name: 'With custom footer',
  args: {
    placement: 'bottom-start',
    items: timeItems,
    menuFooter: (
      <div className="px-3 py-2 border-t">
        <span className="dial-small-text text-primary font-medium">
          Footer content
        </span>
      </div>
    ),
  },
};

export const WithHeaderAndFooter: Story = {
  name: 'With header and footer',
  args: {
    placement: 'bottom-start',
    items: timeItems,
    menuHeader: (
      <div className="px-3 py-2 border-b">
        <span className="dial-small-text text-primary font-medium">
          Select time range
        </span>
      </div>
    ),
    menuFooter: (
      <div className="px-3 py-2 border-t">
        <span className="dial-small-text text-primary font-medium">
          Footer content
        </span>
      </div>
    ),
  },
};

const FooterActionsExample = (args: DialDropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DialDropdown
      {...args}
      trigger={[DropdownTrigger.Click]}
      open={open}
      onOpenChange={setOpen}
      items={timeItems}
      menuFooter={() => (
        <div className="px-2 pb-2 pt-1 border-t border-divider">
          <div className="flex items-center justify-end gap-2">
            <DialNeutralButton label="Cancel" onClick={() => setOpen(false)} />
            <DialPrimaryButton label="Apply" onClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    >
      <TriggerBtn label="With footer actions" />
    </DialDropdown>
  );
};

export const WithFooterActionsControlled: Story = {
  render: FooterActionsExample,
};

export const ContextMenuAtCursor: Story = {
  name: 'Context menu anchored to cursor',
  args: {
    trigger: [DropdownTrigger.ContextMenu],
    anchorToMouse: true,
    matchReferenceWidth: false,
    items: specItems,
  },
  render: (args) => (
    <DialDropdown {...args}>
      <div className="h-48 w-[520px] p-4 text-primary border border-secondary flex items-center justify-center">
        Right-click anywhere in this area
      </div>
    </DialDropdown>
  ),
};

export const ClickNearCursor: Story = {
  name: 'Click anchored to cursor',
  args: {
    trigger: [DropdownTrigger.Click],
    anchorToMouse: true,
    matchReferenceWidth: false,
    items: specItems,
  },
  render: (args) => (
    <DialDropdown {...args}>
      <DialPrimaryButton label="Click me (opens near cursor)" />
    </DialDropdown>
  ),
};

export const CompareWidthModes: Story = {
  name: 'Compare: matchReferenceWidth=true vs false',
  args: {},
  render: (args) => (
    <div className="flex gap-6">
      <DialDropdown {...args} matchReferenceWidth>
        <DialNeutralButton label="Match trigger width" />
      </DialDropdown>
      <DialDropdown
        {...args}
        matchReferenceWidth={false}
        renderOverlay={() => (
          <div className="p-3 whitespace-nowrap">
            Very long, unwrapped overlay content that should define its own
            width
          </div>
        )}
      >
        <DialNeutralButton label="Hug content width" />
      </DialDropdown>
    </div>
  ),
};

export const DropdownDynamicButtons: Story = {
  name: 'With dynamic button items and styles',
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [selectedFirstSection, setSelectedFirstSection] = useState<
      string | null
    >('custom');
    const [selectedSecondSection, setSelectedSecondSection] = useState<
      string | null
    >('subsection1');
    const [showSubsection, setShowSubsection] = useState(false);
    const borderCss = 'border-l-2 border-accent-primary pl-2 rounded-l-none';

    const baseItems: DropdownItem[] = [
      {
        key: 'header1',
        type: DropdownItemType.PlainText,
        label: 'First Section',
      },
      {
        key: 'normal',
        label: 'Normal Item',
        className: selectedFirstSection === 'normal' ? borderCss : undefined,
        onClick: () => {
          setSelectedFirstSection('normal');
        },
      },
      {
        key: 'custom',
        label: 'Custom Styled Item',
        className: selectedFirstSection === 'custom' ? borderCss : undefined,
        onClick: () => {
          setSelectedFirstSection('custom');
        },
      },
      {
        key: 'withSubsection',
        label: 'Item with Subsection',
        className:
          selectedFirstSection === 'withSubsection' ? borderCss : undefined,
        onClick: (info) => {
          info.domEvent.preventDefault();
          setSelectedFirstSection('withSubsection');
          setShowSubsection(true);
          setTimeout(() => setOpen(true), 0);
        },
      },
    ];

    const subsectionItems: DropdownItem[] =
      showSubsection && selectedFirstSection === 'withSubsection'
        ? [
            { key: 'd1', type: DropdownItemType.Divider },
            {
              key: 'header2',
              type: DropdownItemType.PlainText,
              label: 'Subsection',
            },
            {
              key: 'subsection1',
              label: 'Subsection Item 1',
              className:
                selectedSecondSection === 'subsection1' ? borderCss : undefined,
              onClick: () => {
                setSelectedSecondSection('subsection1');
              },
            },
            {
              key: 'subsection2',
              label: 'Subsection Item 2',
              className:
                selectedSecondSection === 'subsection2' ? borderCss : undefined,
              onClick: () => {
                setSelectedSecondSection('subsection2');
              },
            },
          ]
        : [];

    const items = [...baseItems, ...subsectionItems];

    return (
      <DialDropdown
        {...args}
        open={open}
        onOpenChange={setOpen}
        onClose={() => setOpen(false)}
        placement="bottom"
        items={items}
      >
        <TriggerBtn label="Dynamic items" />
      </DialDropdown>
    );
  },
};

export const WithSubMenu: Story = {
  name: 'With sub-menu items',
  render: (args) => (
    <DialDropdown
      {...args}
      placement="bottom-start"
      items={[
        {
          key: 'profile',
          label: 'Profile',
          icon: <IconUser size={DIAL_ICON_SIZE.SM} />,
        },
        {
          key: 'more',
          label: 'More actions',
          icon: <IconStack size={DIAL_ICON_SIZE.SM} />,
          children: [
            {
              key: 'open',
              label: 'Open in new tab',
              icon: <IconExternalLink size={DIAL_ICON_SIZE.SM} />,
            },
            {
              key: 'copy',
              label: 'Duplicate',
              icon: <IconCopy size={DIAL_ICON_SIZE.SM} />,
            },
            {
              key: 'del',
              label: 'Delete',
              icon: <IconTrash size={DIAL_ICON_SIZE.SM} />,
              danger: true,
            },
          ],
        },
        {
          key: 'logout',
          label: 'Logout',
          icon: <IconLogout size={DIAL_ICON_SIZE.SM} />,
        },
      ]}
    >
      <TriggerBtn label="Sub-menu" />
    </DialDropdown>
  ),
};
