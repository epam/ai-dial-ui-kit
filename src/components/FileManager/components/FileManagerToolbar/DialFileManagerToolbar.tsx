import { DialButtonDropdown } from '@/components/ButtonDropdown/ButtonDropdown';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DialSwitch } from '@/components/Switch/Switch';
import { DialTabs } from '@/components/Tabs/Tabs';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { BASE_ICON_PROPS, DIAL_ICON_SIZE } from '@/constants/icon';
import { useIsMobileScreen } from '@/hooks/use-is-mobile-screen';
import type { DropdownItem } from '@/models/dropdown';
import type { TabModel } from '@/models/tab';
import { ButtonVariant } from '@/types/button';
import { DialFileManagerTabs } from '@/types/file-manager';
import { ScreenResolution } from '@/types/tab';
import { IconDotsVertical, IconEye, IconEyeOff } from '@tabler/icons-react';
import { type FC, useMemo } from 'react';
import { ElementSize } from '@/types/size';
import { DialGhostIconButton } from '@/components/IconButton/IconButtonWrappers';

export interface DialFileManagerToolbarProps {
  tabs?: TabModel[];
  activeTab?: string;
  areHiddenFilesVisible: boolean;
  hiddenFilesSwitcherLabel?: string;
  showHiddenFilesLabel?: string;
  hideHiddenFilesLabel?: string;
  isNewButtonVisible?: boolean;
  isNewButtonDisabled?: boolean;
  newButtonVariant?: ButtonVariant;
  newButtonDropdownItems?: DropdownItem[];
  newButtonLabel?: string;
  showHiddenFilesToggle?: boolean;
  onTabChange?: (id: DialFileManagerTabs) => void;
  onToggleHiddenFiles?: (value: boolean) => void;
  disabledNewButtonTooltip?: string;
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
 * @param [isNewButtonDisabled] - Whether the "New" button is disabled.
 * @param [newButtonVariant=ButtonVariant.Primary] - Visual style variant for the new button.
 * @param [newButtonDropdownItems=[]] - Dropdown items available under the new button. If empty, a single new button is shown instead.
 * @param [newButtonLabel='New'] - Label text for the new button.
 * @param [disabledNewButtonTooltip] - Tooltip text to show when the new button is disabled.
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
  isNewButtonDisabled,
  newButtonVariant = ButtonVariant.Primary,
  newButtonDropdownItems = [],
  newButtonLabel = 'New',
  hiddenFilesSwitcherLabel = 'Hidden files',
  showHiddenFilesLabel = 'Show hidden files',
  hideHiddenFilesLabel = 'Hide hidden files',
  showHiddenFilesToggle = true,
  disabledNewButtonTooltip,
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
      {showHiddenFilesToggle && (
        <>
          <DialSwitch
            switchId="hidden-files-switch"
            label={hiddenFilesSwitcherLabel}
            isOn={areHiddenFilesVisible}
            onChange={onToggleHiddenFiles}
          />

          <div className="h-6 border-l border-primary" />
        </>
      )}

      {isNewButtonVisible && (
        <DialTooltip
          tooltip={
            isNewButtonDisabled && disabledNewButtonTooltip
              ? disabledNewButtonTooltip
              : undefined
          }
        >
          <DialButtonDropdown
            label={newButtonLabel}
            variant={newButtonVariant}
            items={newButtonDropdownItems}
            disabled={isNewButtonDisabled}
          />
        </DialTooltip>
      )}
    </>
  );

  const renderMobileActions = () => (
    <>
      <DialDropdown
        menu={{ items: dropdownItems }}
        allowedPlacements={['bottom', 'bottom-start']}
      >
        <DialGhostIconButton
          size={ElementSize.Small}
          icon={<IconDotsVertical stroke={2} size={DIAL_ICON_SIZE.SM} />}
        />
      </DialDropdown>

      {isNewButtonVisible ? (
        <DialTooltip
          tooltip={
            isNewButtonDisabled && disabledNewButtonTooltip
              ? disabledNewButtonTooltip
              : undefined
          }
        >
          <DialButtonDropdown
            label={newButtonLabel}
            variant={newButtonVariant}
            items={newButtonDropdownItems}
            disabled={isNewButtonDisabled}
          />
        </DialTooltip>
      ) : null}
    </>
  );

  return (
    <div className="flex w-full justify-between gap-4 items-center overflow-x-auto">
      <div className="flex-1 min-w-0">{renderTabs()}</div>
      <div className="flex gap-2 shrink-0 items-center">
        {isMobile ? renderMobileActions() : renderDesktopActions()}
      </div>
    </div>
  );
};
