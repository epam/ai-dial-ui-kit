import { type FC } from 'react';
import { DialTabs } from '@/components/Tabs/Tabs';
import { DialSwitch } from '@/components/Switch/Switch';
import { DialButton } from '@/components/Button/Button';
import { IconRefresh } from '@tabler/icons-react';
import type { TabModel } from '@/models/tab';
import { ButtonVariant } from '@/types/button';
import { DialButtonDropdown } from '@/components/ButtonDropdown/ButtonDropdown';
import type { DropdownItem } from '@/models/dropdown';
import { BASE_ICON_PROPS } from '@/constants/icon';

export interface DialFileManagerToolbarProps {
  tabs: TabModel[];
  activeTab: string;
  areHiddenFilesVisible: boolean;
  hiddenFilesSwitcherLabel?: string;
  isCreateButtonVisible?: boolean;
  createButtonVariant?: ButtonVariant;
  createButtonDropdownItems?: DropdownItem[];
  createButtonLabel?: string;
  refreshButtonLabel?: string;
  onTabChange: (id: string) => void;
  onToggleHiddenFiles: (value: boolean) => void;
  onRefresh: () => void;
}

/**
 * DialFileManagerToolbar — A configurable toolbar component for file manager views.
 *
 * Provides a clean and functional toolbar for file management pages with:
 * - Tab navigation for switching between different sections or views
 * - Hidden files toggle via `DialSwitch`
 * - Refresh button with icon
 * - Optional "Create" button or dropdown for file/folder creation
 * - Fully responsive horizontal layout
 *
 * @example
 * ```tsx
 * // Basic usage
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
 *   onToggleHiddenFiles={(visible) => console.log('Hidden files:', visible)}
 *   onRefresh={() => console.log('Refreshing...')}
 *   isCreateButtonVisible
 *   createButtonDropdownItems={[
 *     { key: 'folder', label: 'New Folder' },
 *     { key: 'file', label: 'Upload File' },
 *   ]}
 * />
 * ```
 *
 * @param [tabs] - Array of tabs to display, each defined by a `TabModel` (id and label).
 * @param [activeTab] - ID of the currently active tab.
 * @param [onTabChange] - Callback fired when the user selects a different tab.
 * @param [areHiddenFilesVisible] - Indicates whether hidden files are currently visible.
 * @param [onToggleHiddenFiles] - Callback fired when the hidden files toggle is switched.
 * @param [hiddenFilesSwitcherLabel='Hidden files'] - Label text for the hidden files toggle switch.
 * @param [onRefresh] - Callback fired when the refresh button is clicked.
 * @param [refreshButtonLabel='Refresh'] - Label for the refresh button.
 * @param [isCreateButtonVisible] - Whether the create button or dropdown should be visible.
 * @param [createButtonVariant=ButtonVariant.Secondary] - Visual style variant for the create button.
 * @param [createButtonDropdownItems=[]] - Dropdown menu items for the create button (used when multiple creation options are available).
 * @param [createButtonLabel='Create'] - Label for the create button.
 *
 * @remarks
 * - The component is layout-flexible and designed for use inside file or asset management toolbars.
 * - Tabs are rendered using `DialTabs`, and actions use `DialButton`, `DialSwitch`, and `DialButtonDropdown`.
 * - The refresh and create actions are aligned on the right for intuitive placement.
 * - When `createButtonDropdownItems` is empty, the create button behaves as a single-action button.
 */
export const DialFileManagerToolbar: FC<DialFileManagerToolbarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  areHiddenFilesVisible,
  onToggleHiddenFiles,
  onRefresh,
  isCreateButtonVisible,
  createButtonVariant = ButtonVariant.Secondary,
  createButtonDropdownItems = [],
  createButtonLabel = 'Create',
  hiddenFilesSwitcherLabel = 'Hidden files',
  refreshButtonLabel = 'Refresh',
}) => {
  return (
    <div className="flex justify-between gap-4 items-center overflow-x-auto">
      <DialTabs tabs={tabs} activeTab={activeTab} onClick={onTabChange} />

      <div className="flex gap-4 flex-shrink-0 items-center">
        <DialSwitch
          switchId="hidden-files-switch"
          title={hiddenFilesSwitcherLabel}
          isOn={areHiddenFilesVisible}
          onChange={onToggleHiddenFiles}
        />

        <div className="h-6 border-l border-primary" />

        <DialButton
          title={refreshButtonLabel}
          onClick={onRefresh}
          variant={ButtonVariant.Secondary}
          iconBefore={<IconRefresh {...BASE_ICON_PROPS} />}
        />

        {isCreateButtonVisible && (
          <DialButtonDropdown
            title={createButtonLabel}
            variant={createButtonVariant}
            items={createButtonDropdownItems}
          />
        )}
      </div>
    </div>
  );
};
