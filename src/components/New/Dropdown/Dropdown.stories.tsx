import type { Placement } from '@floating-ui/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  IconChevronDown,
  IconCopy,
  IconDots,
  IconExternalLink,
  IconFileText,
  IconLogout,
  IconRowRemove,
  IconSettings,
  IconStack,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { useRef, useState, type ReactNode } from 'react';

import {
  NeutralButton,
  PrimaryButton,
} from '@/components/New/Button/ButtonWrappers';
import { DangerIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { Tooltip } from '@/components/New/Tooltip/Tooltip';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { type DropdownItem } from '@/models/dropdown';
import { DropdownItemType, DropdownTrigger } from '@/types/dropdown';
import { ElementSize } from '@/types/size';
import { TooltipPlacement } from '@/types/tooltip';
import { mergeClasses } from '@/utils/merge-classes';
import {
  dropdownDividerClassName,
  dropdownItemBaseClassName,
} from './constants';
import { Dropdown, type DropdownProps } from './Dropdown';

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
  <PrimaryButton
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
  title: 'Components_2_0/Dropdown',
  component: Dropdown,
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
} satisfies Meta<typeof Dropdown>;

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

const ControlledExample = (args: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const controllerRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="flex items-center gap-2">
      <span ref={controllerRef}>
        <NeutralButton
          label={open ? 'Close Dropdown' : 'Open Dropdown'}
          onClick={() => setOpen((v) => !v)}
        />
      </span>
      <Dropdown
        {...args}
        trigger={[]}
        open={open}
        onOpenChange={setOpen}
        outsidePressIgnoreRef={controllerRef}
      >
        <TriggerBtn label="Controlled" />
      </Dropdown>
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
      <Dropdown {...args}>
        <TriggerBtn label="Auto (default)" />
      </Dropdown>
      {PLACEMENTS.map((p) => (
        <Dropdown key={p} {...args} placement={p}>
          <TriggerBtn label={p} />
        </Dropdown>
      ))}
    </div>
  ),
};

export const SecondaryEllipsisTrigger: Story = {
  name: 'Secondary trigger (ellipsis)',
  args: {
    children: (
      <NeutralButton
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
      <Dropdown
        {...args}
        placement="bottom-start"
        allowedPlacements={['top-start', 'top-end']}
        items={specItems}
      >
        <TriggerBtn label="Allowed Placements" />
      </Dropdown>
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

const FooterActionsExample = (args: DropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown
      {...args}
      trigger={[DropdownTrigger.Click]}
      open={open}
      onOpenChange={setOpen}
      items={timeItems}
      menuFooter={() => (
        <div className="px-2 pb-2 pt-1 border-t border-divider">
          <div className="flex items-center justify-end gap-2">
            <NeutralButton label="Cancel" onClick={() => setOpen(false)} />
            <PrimaryButton label="Apply" onClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    >
      <TriggerBtn label="With footer actions" />
    </Dropdown>
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
    <Dropdown {...args}>
      <div className="h-48 w-[520px] p-4 text-primary border border-secondary flex items-center justify-center">
        Right-click anywhere in this area
      </div>
    </Dropdown>
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
    <Dropdown {...args}>
      <PrimaryButton label="Click me (opens near cursor)" />
    </Dropdown>
  ),
};

export const CompareWidthModes: Story = {
  name: 'Compare: matchReferenceWidth=true vs false',
  args: {},
  render: (args) => (
    <div className="flex gap-6">
      <Dropdown {...args} matchReferenceWidth>
        <NeutralButton label="Match trigger width" />
      </Dropdown>
      <Dropdown
        {...args}
        matchReferenceWidth={false}
        renderOverlay={() => (
          <div className="p-3 whitespace-nowrap">
            Very long, unwrapped overlay content that should define its own
            width
          </div>
        )}
      >
        <NeutralButton label="Hug content width" />
      </Dropdown>
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
    const borderCss = 'border-l-2 border-accent pl-2 rounded-l-none';

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
      <Dropdown
        {...args}
        open={open}
        onOpenChange={setOpen}
        onClose={() => setOpen(false)}
        placement="bottom"
        items={items}
      >
        <TriggerBtn label="Dynamic items" />
      </Dropdown>
    );
  },
};

export const WithSubMenu: Story = {
  name: 'With sub-menu items',
  render: (args) => (
    <Dropdown
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
    </Dropdown>
  ),
};

type CollectionItem = DropdownItem & { description?: string };

const collectionItems: CollectionItem[] = [
  {
    key: 'roadmap',
    label: 'Product Roadmap',
    icon: <IconFileText size={DIAL_ICON_SIZE.SM} />,
    description: 'Q3 planning document with feature timelines',
  },
  {
    key: 'notes',
    label: 'Meeting Notes',
    icon: <IconFileText size={DIAL_ICON_SIZE.SM} />,
    description: 'Notes from the last product sync',
  },
];

const badgedCollectionItems: CollectionItem[] = collectionItems.map((item) => ({
  ...item,
  renderItem: () => (
    <>
      {item.icon}
      <span className="flex-1 truncate text-start">
        <span className="block truncate">{item.label}</span>
        {item.description && (
          <span className="block truncate dial-caption-text text-secondary">
            {item.description}
          </span>
        )}
      </span>
    </>
  ),
}));

export const WithCustomItemRender: Story = {
  name: 'Custom item render (renderItem)',
  render: (args) => (
    <Dropdown
      {...args}
      placement="bottom-start"
      items={[
        {
          key: 'storage',
          label: 'Storage',
          icon: <IconSettings size={DIAL_ICON_SIZE.SM} />,
          renderItem: (it) => (
            <>
              {it.icon}
              <span className="flex-1 truncate text-start">{it.label}</span>
              <span className="dial-caption-text text-secondary">82%</span>
            </>
          ),
        },
        {
          key: 'collection',
          label: 'My collection',
          icon: <IconStack size={DIAL_ICON_SIZE.SM} />,
          children: badgedCollectionItems,
        },
        {
          key: 'logout',
          label: 'Logout',
          icon: <IconLogout size={DIAL_ICON_SIZE.SM} />,
        },
      ]}
    >
      <TriggerBtn label="Custom item render" />
    </Dropdown>
  ),
};

export const WithSubMenuCustomContent: Story = {
  name: 'Sub-menu with fully custom content',
  // Storybook's dynamic "Show code" snippet re-walks the rendered element tree
  // at runtime; combined with the portaled submenu panel it blows the stack
  // (RangeError: Invalid string length) rather than throwing an app error.
  // Static source avoids that runtime tree walk.
  parameters: { docs: { source: { type: 'code' } } },
  render: (args) => (
    <Dropdown
      {...args}
      placement="bottom-start"
      items={[
        {
          key: 'profile',
          label: 'Profile',
          icon: <IconUser size={DIAL_ICON_SIZE.SM} />,
        },
        {
          key: 'collection',
          label: 'My collection',
          icon: <IconStack size={DIAL_ICON_SIZE.SM} />,
          children: collectionItems,
          renderSubMenu: () => (
            <>
              <div className="px-3 py-2">
                <span className="dial-small-text font-medium text-secondary">
                  My collection
                </span>
              </div>

              <div role="none" className="py-1">
                {collectionItems.map((collectionItem) => (
                  <div
                    key={collectionItem.key}
                    className={mergeClasses(
                      dropdownItemBaseClassName,
                      'justify-between pr-1',
                    )}
                  >
                    <Tooltip
                      tooltip={collectionItem.description}
                      hideTooltip={!collectionItem.description}
                      placement={TooltipPlacement.Right}
                      triggerClassName="flex-1"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        className="flex w-full items-center gap-2 truncate text-start"
                      >
                        {collectionItem.icon}
                        <span className="flex-1 truncate">
                          {collectionItem.label}
                        </span>
                      </button>
                    </Tooltip>
                    <DangerIconButton
                      aria-label={`Delete ${collectionItem.label}`}
                      icon={<IconTrash size={DIAL_ICON_SIZE.SM} />}
                      size={ElementSize.Small}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.alert(`Deleted "${collectionItem.label}"`);
                      }}
                    />
                  </div>
                ))}
              </div>

              <div role="separator" className={dropdownDividerClassName} />

              <div className="px-2 pb-2 pt-1">
                <PrimaryButton
                  label="Explore"
                  className="w-full"
                  onClick={() => window.alert('Explore clicked')}
                />
              </div>
            </>
          ),
        },
        {
          key: 'logout',
          label: 'Logout',
          icon: <IconLogout size={DIAL_ICON_SIZE.SM} />,
        },
      ]}
    >
      <TriggerBtn label="Sub-menu footer" />
    </Dropdown>
  ),
};

export const WithSubMenuHeaderAndFooter: Story = {
  name: 'Sub-menu with header and footer',
  // See the comment on WithSubMenuCustomContent above.
  parameters: { docs: { source: { type: 'code' } } },
  render: (args) => (
    <Dropdown
      {...args}
      placement="bottom-start"
      items={[
        {
          key: 'profile',
          label: 'Profile',
          icon: <IconUser size={DIAL_ICON_SIZE.SM} />,
        },
        {
          key: 'collection',
          label: 'My collection',
          icon: <IconStack size={DIAL_ICON_SIZE.SM} />,
          children: collectionItems,
          menuHeader: (
            <div className="px-3 py-2">
              <span className="dial-small-text font-medium text-secondary">
                My collection
              </span>
            </div>
          ),
          menuFooter: (
            <>
              <div role="separator" className={dropdownDividerClassName} />
              <div className="px-2 pb-2 pt-1">
                <PrimaryButton
                  label="Explore"
                  className="w-full"
                  onClick={() => window.alert('Explore clicked')}
                />
              </div>
            </>
          ),
        },
        {
          key: 'logout',
          label: 'Logout',
          icon: <IconLogout size={DIAL_ICON_SIZE.SM} />,
        },
      ]}
    >
      <TriggerBtn label="Sub-menu header/footer" />
    </Dropdown>
  ),
};

/**
 * Selectable items turn the menu into a multiselect list: each row is a
 * `menuitemcheckbox` with a checkbox box, a click toggles it without closing the
 * menu, and a plain item alongside them still closes it.
 */
export const MultiselectItems: Story = {
  render: () => {
    const MultiselectExample = () => {
      const [checked, setChecked] = useState<string[]>(['drafts']);

      const toggle = (key: string) =>
        setChecked((prev) =>
          prev.includes(key)
            ? prev.filter((value) => value !== key)
            : [...prev, key],
        );

      return (
        <Dropdown
          placement="bottom-start"
          items={[
            ...[
              { key: 'drafts', label: 'Drafts' },
              { key: 'shared', label: 'Shared with me' },
              { key: 'archived', label: 'Archived' },
              { key: 'deleted', label: 'Deleted', disabled: true },
            ].map((item) => ({
              ...item,
              selectable: true,
              checked: checked.includes(item.key),
              onClick: () => toggle(item.key),
            })),
            { key: 'divider', type: DropdownItemType.Divider },
            {
              key: 'reset',
              label: 'Reset',
              danger: true,
              onClick: () => setChecked([]),
            },
          ]}
        >
          <TriggerBtn label={`Filters (${checked.length})`} />
        </Dropdown>
      );
    };

    return <MultiselectExample />;
  },
};
