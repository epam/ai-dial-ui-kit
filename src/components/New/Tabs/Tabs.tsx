import {
  useCallback,
  useId,
  useRef,
  type FC,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { TabOrientation } from '@/types/tab';

/** A single tab entry rendered by {@link Tabs}. */
export interface TabItem {
  /** Unique identifier used to match against `activeTabId`. */
  id: string;
  /** Visible label text for the tab. */
  label: string;
  /** Optional numeric badge rendered after the label. */
  count?: number;
  /** Decorative icon rendered before the label. The label names the tab, so the icon is hidden from assistive tech. */
  icon?: ReactNode;
  /** Renders the tab greyed out and unselectable, and skips it during keyboard navigation. */
  disabled?: boolean;
}

export interface TabsProps {
  /** Ordered list of tabs to render. */
  tabs: TabItem[];
  /** ID of the currently selected tab. */
  activeTabId: string;
  /** Fired with the tab's `id` when the user selects a tab. */
  onTabChange: (tabId: string) => void;
  /** Layout direction of the tab list. Uses the {@link TabOrientation} enum. Defaults to `TabOrientation.Horizontal`. */
  orientation?: TabOrientation;
  /**
   * Already-translated heading rendered above the tabs, which also names the
   * tab list. Omit to render no heading.
   */
  sectionLabel?: string;
  /**
   * Accessible name for the tab list. A row of tabs carries no name of its own,
   * so screen readers announce it as an unlabelled list without this — unless
   * `sectionLabel` is naming it already.
   */
  ariaLabel?: string;
  /** Additional CSS classes for the root element. */
  className?: string;
  /**
   * Additional CSS classes for the `role="tablist"`. `className` reaches it
   * only when there is no `sectionLabel`, since the heading wrapper is then
   * the root; this prop reaches it in either case.
   */
  tabListClassName?: string;
  /** Additional CSS classes applied to every tab. */
  tabClassName?: string;
  /** Additional CSS classes for the `sectionLabel` heading. */
  sectionLabelClassName?: string;
}

/** The two keys that move the selection, named per orientation. */
const NAVIGATION_KEYS: Record<
  TabOrientation,
  { next: string; previous: string }
> = {
  [TabOrientation.Horizontal]: { next: 'ArrowRight', previous: 'ArrowLeft' },
  [TabOrientation.Vertical]: { next: 'ArrowDown', previous: 'ArrowUp' },
};

/**
 * A row or rail of tabs, marking the active one and showing optional icons and count badges.
 * aliases: TabRow|TabNavigation|TabBar|VerticalTabs|SettingsNav|SideNav
 * Design system 2.0
 *
 * Follows the ARIA tabs pattern with automatic activation: only the active tab is
 * in the tab order, and the arrow keys move both focus and selection. `Home` and
 * `End` jump to the first and last tab, and the arrows wrap around the ends.
 * Tabs marked `disabled` are greyed out, cannot be clicked, and are skipped by
 * keyboard navigation.
 *
 * `TabOrientation.Horizontal` draws the default row: the active tab takes a
 * gradient underline, and `ArrowLeft` / `ArrowRight` move along it.
 * `TabOrientation.Vertical` draws the settings-page rail instead — full-width
 * rows with the active one on a tinted pill rather than an underline, driven by
 * `ArrowUp` / `ArrowDown`. The rail is the shape to reach for when the tabs
 * label whole pages of a settings surface; the row, when they filter one.
 *
 * `className` lands on whichever element is outermost: the heading wrapper when
 * `sectionLabel` is set, the `role="tablist"` itself when it is not.
 *
 * The component renders the tabs only; the panels stay with the consumer.
 *
 * @example
 * ```tsx
 * <Tabs
 *   ariaLabel="Conversation views"
 *   tabs={[
 *     { id: 'all', label: 'All', count: 12 },
 *     { id: 'shared', label: 'Shared with me' },
 *   ]}
 *   activeTabId={activeTabId}
 *   onTabChange={setActiveTabId}
 * />
 * ```
 *
 * @example A settings rail, named by its own heading.
 * ```tsx
 * <Tabs
 *   orientation={TabOrientation.Vertical}
 *   sectionLabel={t('Settings')}
 *   className="w-[240px] shrink-0 border-e border-e-tertiary"
 *   tabs={[
 *     { id: 'preferences', label: t('Preferences'), icon: <IconSettings size={18} /> },
 *     { id: 'usage', label: t('Usage'), icon: <IconChartBar size={18} /> },
 *   ]}
 *   activeTabId={activeTabId}
 *   onTabChange={setActiveTabId}
 * />
 * ```
 *
 * @param tabs - Ordered list of tabs to render.
 * @param activeTabId - ID of the currently selected tab.
 * @param onTabChange - Fired with the tab's `id` when the user selects a tab.
 * @param [orientation=TabOrientation.Horizontal] - Layout direction of the tab list.
 * @param [sectionLabel] - Heading rendered above the tabs, which also names the tab list.
 * @param [ariaLabel] - Accessible name for the tab list.
 * @param [className] - Additional CSS classes for the root element.
 * @param [tabListClassName] - Additional CSS classes for the `role="tablist"`.
 * @param [tabClassName] - Additional CSS classes applied to every tab.
 * @param [sectionLabelClassName] - Additional CSS classes for the `sectionLabel` heading.
 */
export const Tabs: FC<TabsProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  orientation = TabOrientation.Horizontal,
  sectionLabel,
  ariaLabel,
  className,
  tabListClassName,
  tabClassName,
  sectionLabelClassName,
}) => {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const sectionLabelId = useId();
  const isVertical = orientation === TabOrientation.Vertical;

  // Roving tabindex: the row is a single tab stop. A disabled tab cannot hold it,
  // so an `activeTabId` pointing at one falls back to the first enabled tab —
  // otherwise the row would drop out of the tab order entirely.
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const tabStopId =
    activeTab && !activeTab.disabled
      ? activeTab.id
      : tabs.find((tab) => !tab.disabled)?.id;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const { next, previous } = NAVIGATION_KEYS[orientation];
      if (
        ![next, previous, 'Home', 'End'].includes(event.key) ||
        tabs.length === 0
      ) {
        return;
      }

      // Disabled tabs are not selectable, so they are not navigation targets either.
      const selectable = tabs.filter((tab) => !tab.disabled);
      if (selectable.length === 0) return;

      // An `activeTabId` that matches nothing still has to have somewhere to go.
      const activeIndex = Math.max(
        selectable.findIndex((tab) => tab.id === activeTabId),
        0,
      );
      const lastIndex = selectable.length - 1;

      let nextIndex = activeIndex;
      if (event.key === next) {
        nextIndex = activeIndex === lastIndex ? 0 : activeIndex + 1;
      } else if (event.key === previous) {
        nextIndex = activeIndex === 0 ? lastIndex : activeIndex - 1;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else {
        nextIndex = lastIndex;
      }

      // Arrow keys would otherwise scroll the page along with moving selection.
      event.preventDefault();

      const nextTab = selectable[nextIndex];
      tabRefs.current[nextTab.id]?.focus();
      if (nextTab.id !== activeTabId) {
        onTabChange(nextTab.id);
      }
    },
    [tabs, activeTabId, onTabChange, orientation],
  );

  const tabList = (
    <div
      role="tablist"
      aria-orientation={isVertical ? 'vertical' : undefined}
      aria-label={ariaLabel}
      // The heading already names the list; a second name would only compete.
      aria-labelledby={!ariaLabel && sectionLabel ? sectionLabelId : undefined}
      onKeyDown={handleKeyDown}
      className={mergeClasses(
        isVertical ? 'flex flex-col gap-1 px-2' : 'flex justify-start gap-1',
        // Without a heading the list is the root, so it takes the caller's
        // classes — and the root kit class below — itself.
        !sectionLabel && className,
        tabListClassName,
        DIAL_KIT_CLASS.tabList,
        !sectionLabel && DIAL_KIT_CLASS.tabs,
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id;
        const isDisabled = !!tab.disabled;

        return (
          <button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[tab.id] = element;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={isDisabled}
            tabIndex={tab.id === tabStopId ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            className={mergeClasses(
              'dial-kit-enhanced-target flex items-center gap-2 text-start',
              'transition-colors motion-reduce:transition-none',
              'focus-visible:outline focus-visible:outline-focus',
              isVertical
                ? [
                    'h-11 w-full rounded-lg px-3 desktop:h-10',
                    'focus-visible:-outline-offset-1',
                    isActive
                      ? 'dial-small-semi-text'
                      : 'dial-small-text text-secondary',
                  ]
                : [
                    'dial-small-paragraph-semi-text border-b-2 border-transparent px-3 py-2',
                    'focus-visible:outline-offset-2',
                  ],
              isDisabled &&
                (isVertical
                  ? 'cursor-not-allowed text-control-disable-primary'
                  : 'cursor-not-allowed border-control-disable-primary text-control-disable-primary'),
              !isDisabled &&
                (isVertical
                  ? isActive
                    ? 'bg-control-accent-alpha text-accent hover:bg-control-accent-alpha-hover'
                    : 'hover:bg-control-accent-alpha-hover'
                  : isActive
                    ? 'dial-kit-tab-selected-underline text-primary'
                    : 'border-transparent text-secondary'),
              tabClassName,
              DIAL_KIT_CLASS.tab,
              isActive && DIAL_KIT_CLASS.tabSelected,
            )}
          >
            {tab.icon && (
              // The label names the tab, so the icon beside it is decorative —
              // and a Tabler icon is a bare `<svg>` that would otherwise be
              // announced as an unnamed graphic.
              <span aria-hidden="true" className="flex shrink-0">
                {tab.icon}
              </span>
            )}
            <span
              className={mergeClasses(
                isVertical && !isActive && !isDisabled && 'text-primary',
              )}
            >
              {tab.label}
            </span>
            {tab.count != null && (
              <span
                className={mergeClasses(
                  'dial-tiny-semi-text rounded-full px-1.5 py-0.5',
                  // In a rail the badge belongs at the far end of the row, not
                  // hanging off the label.
                  isVertical && 'ms-auto',
                  isDisabled && 'bg-layer-sunken text-control-disable-primary',
                  !isDisabled &&
                    (isActive
                      ? 'bg-control-accent-alpha text-accent'
                      : 'bg-layer-sunken text-secondary'),
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  if (!sectionLabel) return tabList;

  return (
    <div
      className={mergeClasses(
        'flex flex-col gap-3',
        className,
        DIAL_KIT_CLASS.tabs,
      )}
    >
      <div
        className={mergeClasses(
          'flex h-16 shrink-0 items-center',
          isVertical ? 'px-4' : 'px-3',
        )}
      >
        <span
          id={sectionLabelId}
          className={mergeClasses(
            'dial-h1-text text-primary',
            sectionLabelClassName,
            DIAL_KIT_CLASS.tabsSectionLabel,
          )}
        >
          {sectionLabel}
        </span>
      </div>
      {tabList}
    </div>
  );
};
