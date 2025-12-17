import { type FC, useMemo } from 'react';
import { DialTabs } from '@/components/Tabs/Tabs';
import { DialSwitch } from '@/components/Switch/Switch';
import { DialButton } from '@/components/Button/Button';
import { IconDotsVertical, IconEye, IconEyeOff } from '@tabler/icons-react';
import type { TabModel } from '@/models/tab';
import { ButtonVariant } from '@/types/button';
import { DialButtonDropdown } from '@/components/ButtonDropdown/ButtonDropdown';
import type { DropdownItem } from '@/models/dropdown';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { DialFileManagerTabs } from '@/types/file-manager';
import { ScreenResolution } from '@/types/tab';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { useIsMobileScreen } from '@/hooks/use-is-mobile-screen';

export interface DialFileManagerToolbarProps {
  tabs?: TabModel[];
  activeTab?: string;
  areHiddenFilesVisible: boolean;
  hiddenFilesSwitcherLabel?: string;
  showHiddenFilesLabel?: string;
  hideHiddenFilesLabel?: string;
  isNewButtonVisible?: boolean;
  newButtonVariant?: ButtonVariant;
  newButtonDropdownItems?: DropdownItem[];
  newButtonLabel?: string;
  onTabChange?: (id: DialFileManagerTabs) => void;
  onToggleHiddenFiles?: (value: boolean) => void;
}

/**
 * DialFileManagerToolbar — A configurable, responsive toolbar component for file management views.
 *
 * Provides a flexible toolbar interface for file managers or similar UIs, supporting:
 * - Tab navigation for switching between file sections or views
 * - A toggle for showing or hiding hidden files
 * - A refresh button for reloading content
 * - An optional "New" button or dropdown for creating new files or folders
 *
 * @example
 * ```tsx
 * const tabs: TabModel[] = [
 *   { id: 'all', name: 'All Files' },
 *   { id: 'favorites', name: 'Favorites' },
 * ];
 *
 * <DialFileManagerToolbar
 *   tabs={tabs}
 *   activeTab="all"
 *   areHiddenFilesVisible={false}
 *   onTabChange={(id) => console.log('Switched to tab:', id)}
 *   onToggleHiddenFiles={(visible) => console.log('Hidden files visible:', visible)}
 *   onRefresh={() => console.log('Refreshed')}
 *   isNewButtonVisible
 *   newButtonDropdownItems={[
 *     { key: 'folder', label: 'New Folder' },
 *     { key: 'file', label: 'Upload File' },
 *   ]}
 * />
 * ```
 *
 * @param [tabs] - List of tab definitions to display, each represented by a `TabModel` containing `id` and `name`.
 * @param [activeTab] - The ID of the currently active tab.
 * @param areHiddenFilesVisible - Whether hidden files are currently visible.
 * @param [hiddenFilesSwitcherLabel='Hidden files'] - Label for the hidden files toggle control.
 * @param [showHiddenFilesLabel='Show hidden'] - Label shown when hidden files are not visible.
 * @param [hideHiddenFilesLabel='Hide hidden'] - Label shown when hidden files are visible.
 * @param [onTabChange] - Callback fired when the user switches between tabs. Receives the selected tab ID.
 * @param [onToggleHiddenFiles] - Callback fired when the hidden files visibility is toggled. Receives the new visibility state.
 * @param [isNewButtonVisible] - Whether the "New" button or dropdown should be displayed.
 * @param [newButtonVariant=ButtonVariant.Secondary] - Visual style variant for the new button.
 * @param [newButtonDropdownItems=[]] - Dropdown items available under the new button. If empty, a single new button is shown instead.
 * @param [newButtonLabel='New'] - Label text for the new button.
 *
 * @remarks
 * - Tabs are rendered via `DialTabs`.
 * - The hidden files toggle uses `DialSwitch`.
 * - The refresh and new actions use `DialButton` or dropdown variants for consistency.
 * - The toolbar automatically adapts its layout for different screen sizes.
 * - When `newButtonDropdownItems` is provided, the new button becomes a dropdown menu.
 */
export const DialFileManagerToolbar: FC<DialFileManagerToolbarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  areHiddenFilesVisible,
  onToggleHiddenFiles,
  isNewButtonVisible,
  newButtonVariant = ButtonVariant.Secondary,
  newButtonDropdownItems = [],
  newButtonLabel = 'New',
  hiddenFilesSwitcherLabel = 'Hidden files',
  showHiddenFilesLabel = 'Show hidden files',
  hideHiddenFilesLabel = 'Hide hidden files',
}) => {
  const isMobile = useIsMobileScreen();

  const dropdownItems = useMemo(() => {
    const items: DropdownItem[] = [
      {
        key: 'hidden-files-switch',
        label: areHiddenFilesVisible
          ? hideHiddenFilesLabel
          : showHiddenFilesLabel,
        icon: areHiddenFilesVisible ? (
          <IconEyeOff {...BASE_ICON_PROPS} className="text-secondary" />
        ) : (
          <IconEye {...BASE_ICON_PROPS} className="text-secondary" />
        ),
        onClick: () => onToggleHiddenFiles?.(!areHiddenFilesVisible),
      },
    ];

    return items;
  }, [
    areHiddenFilesVisible,
    hideHiddenFilesLabel,
    showHiddenFilesLabel,
    onToggleHiddenFiles,
  ]);

  const renderTabs = () =>
    tabs && activeTab && onTabChange ? (
      <DialTabs
        tabs={tabs}
        activeTab={activeTab}
        onClick={(id: string) => onTabChange(id as DialFileManagerTabs)}
        screenThreshold={ScreenResolution.Tablet}
        smallScreenContainerClassName="w-fit bg-transparent h-[38px] overflow-hidden"
        smallScreenDropdownItemClassName="px-3 h-[38px]"
      />
    ) : null;

  const renderDesktopActions = () => (
    <>
      <DialSwitch
        switchId="hidden-files-switch"
        label={hiddenFilesSwitcherLabel}
        isOn={areHiddenFilesVisible}
        onChange={onToggleHiddenFiles}
      />

      {isNewButtonVisible && (
        <>
          <div className="h-6 border-l border-primary" />
          <DialButtonDropdown
            label={newButtonLabel}
            variant={newButtonVariant}
            items={newButtonDropdownItems}
          />
        </>
      )}
    </>
  );

  const renderMobileActions = () => (
    <>
      <DialDropdown
        menu={{ items: dropdownItems }}
        allowedPlacements={['bottom', 'bottom-start']}
      >
        <DialButton
          className="h-[38px]"
          iconBefore={
            <IconDotsVertical
              {...BASE_ICON_PROPS}
              className="text-secondary hover:text-accent-primary"
            />
          }
        />
      </DialDropdown>

      {isNewButtonVisible ? (
        <DialButtonDropdown
          label={newButtonLabel}
          variant={newButtonVariant}
          items={newButtonDropdownItems}
        />
      ) : null}
    </>
  );

  return (
    <div className="flex w-full justify-between gap-4 items-center overflow-x-auto">
      <div className="flex-1 min-w-0">{renderTabs()}</div>
      <div className="flex gap-4 flex-shrink-0 items-center">
        {isMobile ? renderMobileActions() : renderDesktopActions()}
      </div>
    </div>
  );
};
