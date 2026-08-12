import { useCallback, useRef, type FC, type KeyboardEvent } from 'react';

import { mergeClasses } from '@/utils/merge-classes';

/** A single tab entry rendered by {@link Tabs}. */
export interface TabItem {
  /** Unique identifier used to match against `activeTabId`. */
  id: string;
  /** Visible label text for the tab. */
  label: string;
  /** Optional numeric badge rendered after the label. */
  count?: number;
}

export interface TabsProps {
  /** Ordered list of tabs to render. */
  tabs: TabItem[];
  /** ID of the currently selected tab. */
  activeTabId: string;
  /** Fired with the tab's `id` when the user selects a tab. */
  onTabChange: (tabId: string) => void;
  /**
   * Accessible name for the tab list. A row of tabs carries no name of its own,
   * so screen readers announce it as an unlabelled list without this.
   */
  ariaLabel?: string;
  /** Additional CSS classes for the tab list container. */
  className?: string;
  /** Additional CSS classes applied to every tab. */
  tabClassName?: string;
}

/** Keys that move the selection within the tab list. */
const NAVIGATION_KEYS = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];

/**
 * A horizontal row of tabs, underlining the active one and showing optional count badges.
 * aliases: TabRow|TabNavigation|TabBar
 *
 * Follows the ARIA tabs pattern with automatic activation: only the active tab is
 * in the tab order, and the arrow keys move both focus and selection. `Home` and
 * `End` jump to the first and last tab, and the arrows wrap around the ends.
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
 * @param tabs - Ordered list of tabs to render.
 * @param activeTabId - ID of the currently selected tab.
 * @param onTabChange - Fired with the tab's `id` when the user selects a tab.
 * @param [ariaLabel] - Accessible name for the tab list.
 * @param [className] - Additional CSS classes for the tab list container.
 * @param [tabClassName] - Additional CSS classes applied to every tab.
 */
export const Tabs: FC<TabsProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  ariaLabel,
  className,
  tabClassName,
}) => {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!NAVIGATION_KEYS.includes(event.key) || tabs.length === 0) return;

      // An `activeTabId` that matches nothing still has to have somewhere to go.
      const activeIndex = Math.max(
        tabs.findIndex((tab) => tab.id === activeTabId),
        0,
      );
      const lastIndex = tabs.length - 1;

      let nextIndex = activeIndex;
      switch (event.key) {
        case 'ArrowRight':
          nextIndex = activeIndex === lastIndex ? 0 : activeIndex + 1;
          break;
        case 'ArrowLeft':
          nextIndex = activeIndex === 0 ? lastIndex : activeIndex - 1;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = lastIndex;
          break;
      }

      // Arrow keys would otherwise scroll the page along with moving selection.
      event.preventDefault();

      const nextTab = tabs[nextIndex];
      tabRefs.current[nextTab.id]?.focus();
      if (nextTab.id !== activeTabId) {
        onTabChange(nextTab.id);
      }
    },
    [tabs, activeTabId, onTabChange],
  );

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={mergeClasses(
        'flex justify-start gap-1 border-b border-tertiary',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id;

        return (
          <button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[tab.id] = element;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            // Roving tabindex: the tab list is a single tab stop, and the arrow
            // keys move within it.
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            className={mergeClasses(
              'dial-small-semi-text dial-kit-enhanced-target',
              // Pulled a pixel down so the tab's own border sits on top of the row's.
              '-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-start',
              'transition-colors motion-reduce:transition-none',
              'focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-focus-black',
              isActive
                ? 'border-info text-primary'
                : 'border-transparent text-secondary hover:text-primary',
              tabClassName,
            )}
          >
            <span>{tab.label}</span>
            {tab.count != null && (
              <span
                className={mergeClasses(
                  'dial-tiny-semi-text rounded-full px-1.5 py-0.5',
                  isActive
                    ? 'bg-control-accent-alpha-hover text-accent'
                    : 'bg-layer-sunken text-secondary',
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
};
