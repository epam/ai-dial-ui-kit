import { useEffect, useState, type FC } from 'react';

import classNames from 'classnames';
import type { TabModel } from '@/models/tab';
import { TabOrientation } from '@/types/tab';
import { useIsTabletScreen } from '@/hooks/use-is-tablet-screen';
import { DialDropdown } from '../Dropdown/Dropdown';
import { DropdownTrigger } from '@/types/dropdown';
import { DialIcon } from '../Icon/Icon';
import { IconChevronDown } from '@tabler/icons-react';
import { DialTab } from './Tab';

export interface DialTabsProps {
  tabs: TabModel[];
  activeTab: string;
  onClick: (id: string) => void;
  jsonEditorEnabled?: boolean;
  orientation?: TabOrientation;
}

/**
 * A responsive tabs component that adapts between horizontal and dropdown (mobile) layouts
 * based on screen size. Supports both horizontal and vertical orientations and can integrate
 * with JSON editor states to toggle visibility when needed.
 *
 * When viewed on larger screens, tabs are displayed horizontally or vertically based on the
 * {@link TabOrientation} prop. On smaller screens, the component automatically switches to
 * a dropdown menu for better usability.
 *
 * @example
 * ```tsx
 * <DialTabs
 *   tabs={[
 *     { id: 'overview', label: 'Overview' },
 *     { id: 'details', label: 'Details' },
 *     { id: 'settings', label: 'Settings' },
 *   ]}
 *   activeTab="overview"
 *   onClick={(id) => setActiveTab(id)}
 *   orientation={TabOrientation.Horizontal}
 * />
 * ```
 *
 * @param tabs - Array of tab models to render. Each tab should include an `id` and `label`.
 * @param activeTab - The identifier of the currently active tab.
 * @param onClick - Callback fired when a tab is selected. Receives the tab's `id` as an argument.
 * @param [jsonEditorEnabled=false] - If true, hides the tab UI to integrate with JSON editor layouts.
 * @param [orientation=TabOrientation.Horizontal] - The layout direction of the tabs. Uses the {@link TabOrientation} enum.
 */
export const DialTabs: FC<DialTabsProps> = ({
  tabs,
  activeTab,
  onClick,
  jsonEditorEnabled,
  orientation = TabOrientation.Horizontal,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isHorizontal = orientation === TabOrientation.Horizontal;
  const staticTabsClassnames = classNames(
    'flex gap-3 flex-wrap',
    isHorizontal ? 'flex-row' : 'flex-col',
    jsonEditorEnabled ? 'hidden' : '',
  );

  const staticDropDownContainerClassNames = classNames(
    'h-11 flex items-center bg-layer-3',
    jsonEditorEnabled ? 'hidden' : '',
  );
  const isTablet = useIsTabletScreen();
  const [tabsClassNames, setTabsClassNames] = useState(
    classNames(staticTabsClassnames, 'hidden'),
  );
  const [mobileTabsClassNames, setMobileTabsClassNames] = useState(
    classNames(staticDropDownContainerClassNames, 'hidden'),
  );

  useEffect(() => {
    setTabsClassNames(
      classNames(
        staticTabsClassnames,
        isTablet || jsonEditorEnabled ? 'hidden' : '',
      ),
    );
    setMobileTabsClassNames(
      classNames(
        staticDropDownContainerClassNames,
        !isTablet || jsonEditorEnabled ? 'hidden' : '',
      ),
    );
  }, [
    isTablet,
    jsonEditorEnabled,
    staticDropDownContainerClassNames,
    staticTabsClassnames,
  ]);

  return (
    <>
      <div className={tabsClassNames}>
        {tabs.map((tab) => (
          <DialTab
            key={tab.id}
            tab={tab}
            isActive={activeTab == tab.id}
            onClick={onClick}
            isHorizontal={isHorizontal}
          />
        ))}
      </div>

      <div className={mobileTabsClassNames}>
        <div className="h-full px-4">
          <DialDropdown
            trigger={[DropdownTrigger.Click]}
            open={isMobileOpen}
            onOpenChange={setIsMobileOpen}
            placement="bottom-start"
            renderOverlay={() =>
              tabs.map((tab) => (
                <DialTab
                  key={tab.id}
                  tab={tab}
                  isActive={tab.id === activeTab}
                  onClick={(id) => {
                    onClick(id);
                    setIsMobileOpen(false);
                  }}
                  cssClass="w-full rounded-none h-11 items-center px-6"
                />
              ))
            }
          >
            <div className="flex gap-2 items-center h-11 cursor-pointer">
              <DialTab
                key={activeTab}
                tab={tabs.find((t) => t.id === activeTab)!}
                isActive
                onClick={onClick}
                cssClass="rounded-none bg-transparent border-l-0 border-b-[2px] border-accent-primary h-full items-center px-0"
              />
              <DialIcon
                icon={<IconChevronDown size={16} />}
                className={classNames(
                  'text-primary',
                  isMobileOpen && 'rotate-180',
                )}
              />
            </div>
          </DialDropdown>
        </div>
      </div>
    </>
  );
};
