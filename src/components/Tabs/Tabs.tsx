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
