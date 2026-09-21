import { IconBrandOpenai, IconStar } from '@tabler/icons-react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, test } from 'vitest';

import { DialDropdownIcon } from '@/components/DropdownIcon/DropdownIcon';
import { FabButton } from '@/components/FabButton/FabButton';
import { ProgressBar } from '@/components/ProgressBar/ProgressBar';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Spinner } from '@/components/Spinner/Spinner';
import { Accordion } from '@/components/New/Accordion/Accordion';
import { Breadcrumbs } from '@/components/New/Breadcrumbs/Breadcrumbs';
import { Button } from '@/components/New/Button/Button';
import { ButtonDropdown } from '@/components/New/ButtonDropdown/ButtonDropdown';
import { Calendar } from '@/components/New/Calendar/Calendar';
import {
  CaptionText,
  ErrorText,
} from '@/components/New/CaptionText/CaptionText';
import { CardShell } from '@/components/New/CardShell/CardShell';
import { Checkbox } from '@/components/New/Checkbox/Checkbox';
import { CheckboxBox } from '@/components/New/Checkbox/CheckboxBox';
import { CloseButton } from '@/components/New/CloseButton/CloseButton';
import { CollapsibleSidebar } from '@/components/New/CollapsibleSidebar/CollapsibleSidebar';
import { ConfirmationPopup } from '@/components/New/ConfirmationPopup/ConfirmationPopup';
import { Dropdown } from '@/components/New/Dropdown/Dropdown';
import { EllipsisTooltip } from '@/components/New/EllipsisTooltip/EllipsisTooltip';
import { FileDropzone } from '@/components/New/FileDropzone/FileDropzone';
import { FilterChips } from '@/components/New/FilterChips/FilterChips';
import { FolderPath } from '@/components/New/FolderPath/FolderPath';
import { Highlight } from '@/components/New/Highlight/Highlight';
import { IconButton } from '@/components/New/IconButton/IconButton';
import { InfoButton } from '@/components/New/InfoButton/InfoButton';
import { InlineSelect } from '@/components/New/InlineSelect/InlineSelect';
import { Input } from '@/components/New/Input/Input';
import { InteractiveTooltip } from '@/components/New/InteractiveTooltip/InteractiveTooltip';
import { Label } from '@/components/New/Label/Label';
import { NoDataContent } from '@/components/New/NoDataContent/NoDataContent';
import { Notification } from '@/components/New/Notification/Notification';
import { NumberInput } from '@/components/New/NumberInput/NumberInput';
import { PasswordInput } from '@/components/New/PasswordInput/PasswordInput';
import { Popup } from '@/components/New/Popup/Popup';
import { Radio } from '@/components/New/Radio/Radio';
import { RadioGroup } from '@/components/New/RadioGroup/RadioGroup';
import { RadioGroupPopupField } from '@/components/New/RadioGroupPopupField/RadioGroupPopupField';
import { ResizableContainer } from '@/components/New/ResizableContainer/ResizableContainer';
import { Search } from '@/components/New/Search/Search';
import { SegmentedControl } from '@/components/New/SegmentedControl/SegmentedControl';
import { Select } from '@/components/New/Select/Select';
import { Switch } from '@/components/New/Switch/Switch';
import { Tabs } from '@/components/New/Tabs/Tabs';
import { Tag } from '@/components/New/Tag/Tag';
import { TagInput } from '@/components/New/TagInput/TagInput';
import { Textarea } from '@/components/New/Textarea/Textarea';
import { ToggleIconButton } from '@/components/New/ToggleIconButton/ToggleIconButton';
import { Tooltip } from '@/components/New/Tooltip/Tooltip';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { MenuItemMark } from '@/types/menu-item';
import { TabOrientation } from '@/types/tab';

/*
 * The contract test for the public class names. It is deliberately one table
 * rather than an assertion scattered across forty component specs: the promise
 * a host relies on is that *every* entry of the record reaches the DOM, and
 * only a single list can be checked for completeness (see the last test).
 *
 * These cases query by the class on purpose — here the class is the feature
 * under test, not a locator standing in for a role. Where the element also has
 * a role, the component's own spec asserts the pairing; `MenuItem`,
 * `Dropdown` and `DropdownIcon` carry those.
 */

const noop = () => undefined;
const icon = <IconStar aria-hidden="true" />;
const items = [
  { key: 'a', label: 'A' },
  { key: 'b', label: 'B' },
];

/** Rendered once per case; a portalled component lands outside the container. */
const cases: Array<[keyof typeof DIAL_KIT_CLASS, () => ReactNode]> = [
  ['spinner', () => <Spinner />],
  ['progressBar', () => <ProgressBar value={50} />],
  [
    'progressBar',
    () => <ProgressBar value={50} labelProps={{ label: 'Upload' }} />,
  ],
  ['skeleton', () => <Skeleton />],
  ['notification', () => <Notification message="Saved" />],
  ['noDataContent', () => <NoDataContent title="Nothing here" />],

  ['highlight', () => <Highlight text="alpha beta" query="beta" />],
  ['captionText', () => <CaptionText text="Helper" />],
  ['errorText', () => <ErrorText text="Required" />],
  ['label', () => <Label label="Name" />],

  ['cardShell', () => <CardShell>Card</CardShell>],
  [
    'collapsibleSidebar',
    () => (
      <CollapsibleSidebar title="Panel" isOpened>
        Content
      </CollapsibleSidebar>
    ),
  ],
  [
    'resizableContainer',
    () => (
      <ResizableContainer minWidth={100} maxWidth={400}>
        Content
      </ResizableContainer>
    ),
  ],
  ['popup', () => <Popup open header="Title" />],
  [
    'confirmationPopup',
    () => <ConfirmationPopup open header="Sure?" onConfirm={noop} />,
  ],
  ['accordion', () => <Accordion title="Section">Body</Accordion>],
  ['folderPath', () => <FolderPath segments={['root', 'nested']} />],
  [
    'breadcrumbs',
    () => (
      <Breadcrumbs
        items={[{ label: 'Root', href: '/' }, { label: 'Current' }]}
      />
    ),
  ],
  [
    'breadcrumbsItem',
    () => (
      <Breadcrumbs
        items={[{ label: 'Root', href: '/' }, { label: 'Current' }]}
      />
    ),
  ],

  [
    'dropdown',
    () => (
      <Dropdown items={items}>
        <button type="button">Open</button>
      </Dropdown>
    ),
  ],
  ['ellipsisTooltip', () => <EllipsisTooltip text="Long text" />],

  ['search', () => <Search value="" onChange={noop} />],
  ['passwordInput', () => <PasswordInput value="" onChange={noop} />],
  ['numberInput', () => <NumberInput value={1} onChange={noop} />],
  ['tagInput', () => <TagInput value={[]} onChange={noop} />],
  [
    'select',
    () => <Select options={[{ value: 'a', label: 'A' }]} onChange={noop} />,
  ],
  ['inlineSelect', () => <InlineSelect items={items} />],
  ['calendar', () => <Calendar />],
  ['fileDropzone', () => <FileDropzone label="Drop" onChange={noop} />],

  ['switch', () => <Switch labelProps={{ label: 'On' }} onChange={noop} />],
  [
    'checkbox',
    () => <Checkbox labelProps={{ label: 'Agree' }} onChange={noop} />,
  ],
  ['checkboxBox', () => <CheckboxBox isSelected />],
  ['radio', () => <Radio name="group" value="a" labelProps={{ label: 'A' }} />],
  [
    'radioGroup',
    () => (
      <RadioGroup
        items={[{ value: 'a', label: 'A' }]}
        onChange={noop}
        name="group"
      />
    ),
  ],
  [
    'radioGroupPopupField',
    () => (
      <RadioGroupPopupField
        items={[{ value: 'a', label: 'A' }]}
        header="Pick"
        onApply={noop}
      />
    ),
  ],
  [
    'segmentedControl',
    () => (
      <SegmentedControl
        items={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        value="a"
        onChange={noop}
        aria-label="Mode"
      />
    ),
  ],
  [
    'segmentedControlItem',
    () => (
      <SegmentedControl
        items={[{ value: 'a', label: 'A' }]}
        value="a"
        onChange={noop}
        aria-label="Mode"
      />
    ),
  ],
  [
    'filterChips',
    () => (
      <FilterChips
        items={[{ value: 'a', label: 'A' }]}
        value="a"
        onChange={noop}
        aria-label="Filter"
      />
    ),
  ],
  [
    'tabs',
    () => (
      <Tabs
        tabs={[{ id: 'a', label: 'A' }]}
        activeTabId="a"
        onTabChange={noop}
        ariaLabel="Sections"
      />
    ),
  ],
  [
    'tabList',
    () => (
      <Tabs
        tabs={[{ id: 'a', label: 'A' }]}
        activeTabId="a"
        onTabChange={noop}
        ariaLabel="Sections"
      />
    ),
  ],
  [
    'tab',
    () => (
      <Tabs
        tabs={[{ id: 'a', label: 'A' }]}
        activeTabId="a"
        onTabChange={noop}
        ariaLabel="Sections"
      />
    ),
  ],
  [
    'tabsSectionLabel',
    () => (
      <Tabs
        orientation={TabOrientation.Vertical}
        sectionLabel="Settings"
        tabs={[{ id: 'a', label: 'A' }]}
        activeTabId="a"
        onTabChange={noop}
      />
    ),
  ],
  ['tag', () => <Tag label="Draft" />],
  [
    'toggleIconButton',
    () => <ToggleIconButton icon={icon} aria-label="Favourite" />,
  ],
  ['closeButton', () => <CloseButton ariaLabel="Close" onClose={noop} />],
  ['infoButton', () => <InfoButton caption="More" aria-label="Info" />],
  ['buttonDropdown', () => <ButtonDropdown items={items} label="Actions" />],
];

describe('Dial UI Kit :: public class names', () => {
  test.each(cases)('stamps %s', (key, renderCase) => {
    render(<>{renderCase()}</>);

    expect(
      document.body.querySelector(`.${DIAL_KIT_CLASS[key]}`),
    ).toBeInTheDocument();
  });

  test('stamps the dropdown list, its rows and a chosen row check', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        items={[
          {
            key: 'en',
            label: 'English',
            mark: MenuItemMark.Check,
            checked: true,
          },
          { key: 'de', label: 'German', mark: MenuItemMark.Check },
        ]}
      >
        <button type="button">Open</button>
      </Dropdown>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));

    const chosen = screen.getByRole('menuitemradio', { name: 'English' });
    expect(chosen).toHaveClass(DIAL_KIT_CLASS.menuItem);
    expect(chosen.parentElement).toHaveClass(DIAL_KIT_CLASS.dropdownList);
    expect(
      chosen.querySelector(`.${DIAL_KIT_CLASS.menuItemCheck}`),
    ).toBeInTheDocument();
    expect(
      screen
        .getByRole('menuitemradio', { name: 'German' })
        .querySelector(`.${DIAL_KIT_CLASS.menuItemCheck}`),
    ).not.toBeInTheDocument();
  });

  test('stamps the icon and caret of a DialDropdownIcon trigger', () => {
    render(
      <DialDropdownIcon
        ariaLabel="Select model"
        icon={<IconBrandOpenai />}
        items={items}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Select model' });
    expect(
      trigger.querySelector(`.${DIAL_KIT_CLASS.dropdownIcon}`),
    ).toBeInTheDocument();
    expect(
      trigger.querySelector(`.${DIAL_KIT_CLASS.dropdownIconCaret}`),
    ).toBeInTheDocument();
  });

  test('stamps a revealed tooltip bubble and an interactive panel', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <Tooltip asChild tooltip="Details">
        <button type="button">Hover</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button', { name: 'Hover' }));
    await waitFor(() =>
      expect(
        document.body.querySelector(`.${DIAL_KIT_CLASS.tooltip}`),
      ).toBeInTheDocument(),
    );
    unmount();

    render(
      <InteractiveTooltip content={<span>Panel</span>}>
        <button type="button">Hover me</button>
      </InteractiveTooltip>,
    );
    await user.hover(screen.getByRole('button', { name: 'Hover me' }));
    await waitFor(() =>
      expect(
        document.body.querySelector(`.${DIAL_KIT_CLASS.interactiveTooltip}`),
      ).toBeInTheDocument(),
    );
  });

  test('every entry of the record is covered by a case above', () => {
    const covered = new Set<string>([
      ...cases.map(([key]) => key),
      'dropdownList',
      'menuItem',
      'menuItemCheck',
      'dropdownIcon',
      'dropdownIconCaret',
      'tooltip',
      'interactiveTooltip',
    ]);

    expect(
      Object.keys(DIAL_KIT_CLASS).filter((key) => !covered.has(key)),
    ).toEqual([]);
  });

  test('leaves the components that already carry a kit class alone', () => {
    /*
     * These four are the reason the record has no entry for them: the element a
     * host would target already has a stable class, and a second one would be
     * two names for one thing.
     */
    const { container } = render(
      <>
        <Button label="Save" />
        <IconButton icon={icon} aria-label="Star" />
        <FabButton icon={icon} aria-label="Add" />
        <Input value="" onChange={noop} />
        <Textarea value="" onChange={noop} />
      </>,
    );

    expect(
      container.querySelector('.dial-kit-base-button'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('.dial-kit-base-icon-button'),
    ).toBeInTheDocument();
    expect(container.querySelector('.dial-kit-fab-button')).toBeInTheDocument();
    expect(container.querySelector('.dial-kit-input')).toBeInTheDocument();
    expect(container.querySelector('.dial-kit-textarea')).toBeInTheDocument();
  });
});
