import { useCallback, useEffect, useRef, useState, type FC } from 'react';

import classNames from 'classnames';
import type { TabModel } from '@/models/tab';
import { TabOrientation } from '@/types/tab';
import { useIsTabletScreen } from '@/hooks/use-is-tablet-screen';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DropdownTrigger } from '@/types/dropdown';
import { DialIcon } from '@/components/Icon/Icon';
import { IconChevronDown, IconDotsVertical } from '@tabler/icons-react';
import { DialTab } from '@/components/Tab/Tab';

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
  // TODO: Tabs might have additional mobile versions (e.g., chat, mindmap). We need to support these later or allow flexible customization for the mobile view.
  const [isMobileDropdownOpen, setIsMobileDropDownOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const isTablet = useIsTabletScreen();
  const isHorizontal = orientation === TabOrientation.Horizontal;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLDivElement | null>(null);

  const staticTabsClassnames = classNames('flex', {
    hidden: jsonEditorEnabled,
  });

  const tabsScrollClassnames = classNames(
    'flex gap-3',
    isHorizontal
      ? 'flex-row flex-nowrap overflow-x-auto'
      : 'flex-col flex-wrap',
  );

  const staticDropDownContainerClassNames = classNames(
    'h-11 flex items-center bg-layer-3',
    {
      hidden: jsonEditorEnabled,
    },
  );

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
    staticTabsClassnames,
    staticDropDownContainerClassNames,
  ]);

  const activeTabModel = tabs.find((t) => t.id === activeTab)!;

  const checkOverflow = useCallback(() => {
    const el = scrollableContainerRef.current;
    if (!el) return;
    setShowDropdown(el.scrollWidth > el.clientWidth);
  }, []);

  useEffect(() => {
    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    if (scrollableContainerRef.current) {
      observer.observe(scrollableContainerRef.current);
    }
    return () => observer.disconnect();
  }, [tabs, checkOverflow]);

  useEffect(() => {
    const active = activeTabRef.current;
    const scrollEl = scrollableContainerRef.current;
    if (!active || !scrollEl) return;

    const offsetLeft = active.offsetLeft;
    const offsetRight = offsetLeft + active.offsetWidth;

    const visibleStart = scrollEl.scrollLeft;
    const visibleEnd = visibleStart + scrollEl.clientWidth;

    const tabsGapPx = 12;

    if (offsetLeft < visibleStart) {
      scrollEl.scrollTo({ left: offsetLeft - tabsGapPx, behavior: 'smooth' });
    } else if (offsetRight > visibleEnd) {
      scrollEl.scrollTo({
        left: offsetRight - scrollEl.clientWidth + tabsGapPx,
        behavior: 'smooth',
      });
    }
  }, [activeTab]);

  return (
    <>
      <div ref={containerRef} className={tabsClassNames}>
        <div ref={scrollableContainerRef} className={tabsScrollClassnames}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              ref={activeTab === tab.id ? activeTabRef : undefined}
            >
              <DialTab
                tab={tab}
                active={activeTab === tab.id}
                onClick={onClick}
                horizontal={isHorizontal}
              />
            </div>
          ))}
        </div>
        {showDropdown && (
          <div className="flex items-center ml-2">
            <DialDropdown
              trigger={[DropdownTrigger.Click]}
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
              placement="bottom-end"
              renderOverlay={() =>
                tabs.map((tab) => (
                  <DialTab
                    key={tab.id}
                    tab={tab}
                    active={tab.id === activeTab}
                    onClick={(id) => {
                      onClick(id);
                      setIsDropdownOpen(false);
                    }}
                    cssClass="w-full rounded-none h-[32px] items-center px-3 py-2"
                  />
                ))
              }
            >
              <button
                className={classNames(
                  'w-8 h-8 flex items-center justify-center rounded border',
                  isDropdownOpen
                    ? 'bg-layer-4 border-transparent'
                    : 'border-primary',
                )}
              >
                <IconDotsVertical size={18} />
              </button>
            </DialDropdown>
          </div>
        )}
      </div>

      <div className={mobileTabsClassNames}>
        <div className="h-full px-4">
          <DialDropdown
            trigger={[DropdownTrigger.Click]}
            open={isMobileDropdownOpen}
            onOpenChange={setIsMobileDropDownOpen}
            placement="bottom-start"
            allowedPlacements={['bottom-start', 'top-start']}
            renderOverlay={() =>
              tabs.map((tab) => (
                <DialTab
                  key={tab.id}
                  tab={tab}
                  active={tab.id === activeTab}
                  onClick={(id) => {
                    onClick(id);
                    setIsMobileDropDownOpen(false);
                  }}
                  cssClass="w-full rounded-none h-11 items-center px-6"
                />
              ))
            }
          >
            <div className="flex gap-2 items-center h-11 cursor-pointer">
              <DialTab
                key={activeTab}
                tab={activeTabModel}
                active
                onClick={onClick}
                cssClass="rounded-none bg-transparent border-l-0 border-b-[2px] border-accent-primary h-full items-center px-0"
              />
              <DialIcon
                icon={<IconChevronDown size={16} />}
                className={classNames(
                  'text-primary',
                  isMobileDropdownOpen && 'rotate-180',
                )}
              />
            </div>
          </DialDropdown>
        </div>
      </div>
    </>
  );
};
