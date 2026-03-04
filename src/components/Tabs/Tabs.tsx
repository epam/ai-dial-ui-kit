import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from 'react';

import classNames from 'classnames';
import type { TabModel } from '@/models/tab';
import { ScreenResolution, TabOrientation } from '@/types/tab';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DropdownTrigger } from '@/types/dropdown';
import { DialIcon } from '@/components/Icon/Icon';
import { IconChevronDown, IconDotsVertical } from '@tabler/icons-react';
import { DialTab } from '@/components/Tab/Tab';
import { DialButton } from '@/components/Button/Button';
import { DESKTOP_TABS_GAP_PX } from './constants';
import { mergeClasses } from '@/utils/merge-classes';
import { ScreenType } from '@/types/screen';
import { useScreenType } from '@/hooks/use-screen-type';
import { DIAL_ICON_SIZE } from '@/constants/icon';

export interface DialTabsProps {
  tabs: TabModel[];
  activeTab: string;
  onClick: (id: string) => void;
  orientation?: TabOrientation;
  screenThreshold?: ScreenResolution;
  smallScreenContainerClassName?: string;
  smallScreenDropdownItemClassName?: string;
  desktopDropdownClassName?: string;
  desktopTabClassName?: string;
}

/**
 * A responsive and overflow-aware tabs component that automatically adapts its layout
 * between a scrollable tab bar and a dropdown menu on smaller screens.
 *
 * When there are too many tabs to fit in a single line, it introduces a dropdown button
 * for accessing hidden tabs and ensures smooth horizontal scrolling. The component also
 * automatically keeps the active tab in view.
 *
 * Supports both horizontal and vertical orientations and dynamically adjusts layout
 * based on screen size and available space.
 *
 * On larger screens, tabs are displayed according to the `orientation` prop
 * (horizontal or vertical). On smaller screens (mobile or tablet), the tabs collapse
 * into a dropdown menu for better usability.
 *
 * @example
 * ```tsx
 * <DialTabs
 *   tabs={[
 *     { id: 'overview', name: 'Overview' },
 *     { id: 'details', name: 'Details' },
 *     { id: 'settings', name: 'Settings', invalid: true },
 *   ]}
 *   activeTab="overview"
 *   onClick={(id) => setActiveTab(id)}
 *   orientation={TabOrientation.Horizontal}
 * />
 * ```
 *
 * @param tabs - Array of tab models to render. Each tab must include an `id` and a display `name`.
 * @param activeTab - The identifier of the currently active tab.
 * @param onClick - Callback fired when a tab is selected. Receives the tab's `id` as an argument.
 * @param [orientation=TabOrientation.Horizontal] - Layout direction of the tabs. Uses the {@link TabOrientation} enum.
 * @param [screenThreshold=ScreenResolution.Tablet] - Defines the screen size threshold
 *   below which tabs collapse into a dropdown. Uses the {@link ScreenRelosution} enum.
 *   When set to `Tablet`, both mobile and tablet screens will trigger dropdown mode.
 * @param [smallScreenContainerClassName] - Optional CSS class applied to the dropdown container
 *   in small-screen (collapsed) mode.
 * @param [smallScreenDropdownItemClassName] - Optional CSS class applied to individual dropdown
 *   items in small-screen mode.
 * @param [desktopDropdownClassName] - Optional CSS class applied to dropdown button in non small-screen mode.
 * @param [desktopTabClassName] - Optional CSS class applied to tab in non small-screed mode.
 *
 * @remarks
 * - Automatically detects horizontal overflow via `ResizeObserver` and shows a dropdown when needed.
 * - Smoothly scrolls to keep the active tab visible when navigating.
 * - Switches layout responsively based on `screenThreshold`.
 */
export const DialTabs: FC<DialTabsProps> = ({
  tabs,
  activeTab,
  onClick,
  orientation = TabOrientation.Horizontal,
  screenThreshold = ScreenResolution.Tablet,
  smallScreenContainerClassName,
  smallScreenDropdownItemClassName,
  desktopDropdownClassName,
  desktopTabClassName,
}) => {
  // TODO: Add support for additional mobile views (chat, mindmap) or customizable mobile layouts.
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const screenType = useScreenType();

  const isSmallScreen =
    screenType === ScreenType.Mobile ||
    (screenThreshold === ScreenResolution.Tablet &&
      screenType === ScreenType.Tablet);

  const isHorizontal = orientation === TabOrientation.Horizontal;

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);

  const activeTabModel = tabs.find((t) => t.id === activeTab)!;

  const scrollContainerClass = useMemo(
    () =>
      classNames(
        'flex gap-2',
        isHorizontal
          ? 'flex-row flex-nowrap overflow-x-auto'
          : 'flex-col flex-wrap w-full',
      ),
    [isHorizontal],
  );

  const checkOverflow = useCallback(() => {
    const el = scrollableRef.current;
    if (!el) return;
    setShowDropdown(el.scrollWidth > el.clientWidth);
  }, []);

  const scrollToActiveTab = useCallback(() => {
    const activeEl = activeTabRef.current;
    const scrollEl = scrollableRef.current;
    if (!activeEl || !scrollEl) return;

    const activeRect = activeEl.getBoundingClientRect();
    const scrollRect = scrollEl.getBoundingClientRect();

    // Skip if dimensions aren't ready yet
    if (activeRect.width === 0 || scrollRect.width === 0) return;

    const gap = DESKTOP_TABS_GAP_PX;
    let nextScrollLeft = scrollEl.scrollLeft;

    if (activeRect.left < scrollRect.left + gap) {
      nextScrollLeft -= scrollRect.left + gap - activeRect.left;
    } else if (activeRect.right > scrollRect.right - gap) {
      nextScrollLeft += activeRect.right - (scrollRect.right - gap);
    } else {
      return;
    }

    const maxScrollLeft = Math.max(
      0,
      scrollEl.scrollWidth - scrollEl.clientWidth,
    );
    nextScrollLeft = Math.max(0, Math.min(nextScrollLeft, maxScrollLeft));

    if (nextScrollLeft !== scrollEl.scrollLeft) {
      scrollEl.scrollTo({
        left: nextScrollLeft,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleClick = useCallback(
    (id: string) => {
      onClick(id);
      if (id === activeTab) {
        scrollToActiveTab();
      }
    },
    [onClick, activeTab, scrollToActiveTab],
  );

  useEffect(() => {
    checkOverflow();
    const observer = new ResizeObserver(() => checkOverflow());
    const scrollableEl = scrollableRef.current;
    if (scrollableEl) observer.observe(scrollableEl);
    return () => observer.disconnect();
  }, [tabs, checkOverflow]);

  useEffect(() => {
    scrollToActiveTab();
  }, [activeTab, scrollToActiveTab]);

  return isSmallScreen ? (
    <div
      role="tablist"
      className={mergeClasses(
        'h-11 flex items-center bg-layer-3 px-4',
        smallScreenContainerClassName,
      )}
    >
      <DialDropdown
        trigger={[DropdownTrigger.Click]}
        open={isMobileDropdownOpen}
        onOpenChange={setIsMobileDropdownOpen}
        placement="bottom-start"
        allowedPlacements={['bottom-start', 'top-start']}
        renderOverlay={() =>
          tabs.map((tab) => (
            <DialTab
              key={tab.id}
              tab={tab}
              active={tab.id === activeTab}
              onClick={(id) => {
                handleClick(id);
                setIsMobileDropdownOpen(false);
              }}
              className={mergeClasses(
                'w-full rounded-none h-11 items-center px-6',
                smallScreenDropdownItemClassName,
              )}
            />
          ))
        }
      >
        <div className="flex gap-2 items-center h-11 cursor-pointer">
          <DialTab
            key={activeTab}
            tab={activeTabModel}
            active
            onClick={handleClick}
            className="rounded-none bg-transparent border-l-0 border-b-0 h-full items-center px-0"
          />
          <DialIcon
            icon={<IconChevronDown size={DIAL_ICON_SIZE.SMALL} />}
            className={classNames(
              'text-primary transition-transform',
              isMobileDropdownOpen && 'rotate-180',
            )}
          />
        </div>
      </DialDropdown>
    </div>
  ) : (
    // Desktop
    <div ref={containerRef} className="flex w-full items-start">
      <div ref={scrollableRef} role="tablist" className={scrollContainerClass}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            ref={activeTab === tab.id ? activeTabRef : undefined}
            className="w-full"
          >
            <DialTab
              tab={tab}
              active={activeTab === tab.id}
              onClick={handleClick}
              horizontal={isHorizontal}
              className={mergeClasses('w-full', desktopTabClassName)}
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
                    handleClick(id);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full rounded-none h-8 items-center px-3 py-2"
                />
              ))
            }
          >
            <DialButton
              iconBefore={<IconDotsVertical size={DIAL_ICON_SIZE.BASE} />}
              className={mergeClasses(
                'w-8 h-8 flex items-center justify-center rounded border',
                isDropdownOpen
                  ? 'bg-layer-4 border-transparent'
                  : 'border-primary',
                desktopDropdownClassName,
              )}
            />
          </DialDropdown>
        </div>
      )}
    </div>
  );
};
