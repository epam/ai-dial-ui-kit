import {
  useId,
  useState,
  type FC,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';

import { IconButton } from '../IconButton/IconButton';

/** Width of the collapsed rail — wide enough for the 40px toggle button. */
const COLLAPSED_WIDTH = 48;

export interface CollapsibleSidebarProps {
  /** Content shown while the sidebar is expanded. */
  children: ReactNode;
  /** Name of the panel, rendered as vertical text while collapsed. */
  title: ReactNode;
  /** Width in px while expanded. Defaults to `280`. */
  width?: number;
  /** Width in px while collapsed. Defaults to `48`. */
  collapsedWidth?: number;
  /** Controlled open state. When provided, the component becomes controlled. */
  isOpened?: boolean;
  /** Initial open state when uncontrolled. Defaults to `true`. */
  defaultOpened?: boolean;
  /** Fired when the toggle is clicked. Receives the next open state. */
  onToggle?: (nextOpened: boolean, e: MouseEvent<HTMLButtonElement>) => void;
  /** Extra controls rendered in the footer next to the toggle, expanded only. */
  additionalButtons?: ReactNode;
  /** Accessible name of the sidebar region. Defaults to `'Sidebar'`. */
  ariaLabel?: string;
  /** Name and tooltip of the toggle while expanded. Defaults to `'Collapse sidebar'`. */
  collapseLabel?: string;
  /** Name and tooltip of the toggle while collapsed. Defaults to `'Expand sidebar'`. */
  expandLabel?: string;
  /** Additional CSS classes for the outer container. */
  className?: string;
  /** Additional CSS classes for the vertical title. */
  titleClassName?: string;
  /** Additional CSS classes for the content region. */
  contentClassName?: string;
  /** Additional CSS classes for the footer holding the toggle. */
  footerClassName?: string;
}

/**
 * A side panel that collapses to a narrow rail carrying its title vertically.
 * aliases: ToggleSidebar|CollapsiblePanel|SidePanel
 * Design system 2.0
 *
 * Works as a controlled component when `isOpened` is provided, otherwise it keeps
 * its own state from `defaultOpened`. The width is derived from the open state, so
 * changing `width` on an open sidebar takes effect immediately.
 *
 * The panel is an `aside` named by `ariaLabel`, and the toggle is a real
 * `aria-expanded` control pointing at the content region. Content stays mounted
 * while collapsed — hidden with `display: none` — so scroll position and any
 * form state inside it survive a collapse.
 *
 * The container paints no background and no radius: it is meant to sit on the
 * surface it belongs to. Pass `className` for either.
 *
 * @example
 * ```tsx
 * <CollapsibleSidebar title="Filters" width={320}>
 *   <FilterForm />
 * </CollapsibleSidebar>
 *
 * <CollapsibleSidebar
 *   title="Filters"
 *   isOpened={opened}
 *   onToggle={setOpened}
 * >
 *   <FilterForm />
 * </CollapsibleSidebar>
 * ```
 *
 * @param children - Content shown while the sidebar is expanded.
 * @param title - Name of the panel, rendered as vertical text while collapsed.
 * @param [width=280] - Width in px while expanded.
 * @param [collapsedWidth=48] - Width in px while collapsed.
 * @param [isOpened] - Controlled open state.
 * @param [defaultOpened=true] - Initial open state when uncontrolled.
 * @param [onToggle] - Fired when the toggle is clicked. Receives the next open state.
 * @param [additionalButtons] - Extra footer controls, rendered while expanded.
 * @param [ariaLabel='Sidebar'] - Accessible name of the sidebar region.
 * @param [collapseLabel='Collapse sidebar'] - Name and tooltip of the toggle while expanded.
 * @param [expandLabel='Expand sidebar'] - Name and tooltip of the toggle while collapsed.
 * @param [className] - Additional CSS classes for the outer container.
 * @param [titleClassName] - Additional CSS classes for the vertical title.
 * @param [contentClassName] - Additional CSS classes for the content region.
 * @param [footerClassName] - Additional CSS classes for the footer.
 */
export const CollapsibleSidebar: FC<CollapsibleSidebarProps> = ({
  children,
  title,
  width = 280,
  collapsedWidth = COLLAPSED_WIDTH,
  isOpened,
  defaultOpened = true,
  onToggle,
  additionalButtons,
  ariaLabel = 'Sidebar',
  collapseLabel = 'Collapse sidebar',
  expandLabel = 'Expand sidebar',
  className,
  titleClassName,
  contentClassName,
  footerClassName,
}) => {
  const isControlled = isOpened !== undefined;
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const opened = isControlled ? isOpened : internalOpened;

  // Generated rather than fixed: two sidebars on one page would otherwise share
  // a content id and both toggles would point at the first one.
  const contentId = `collapsible-sidebar-content-${useId()}`;

  const toggleLabel = opened ? collapseLabel : expandLabel;

  const changeVisibility = (e: MouseEvent<HTMLButtonElement>) => {
    const next = !opened;

    if (!isControlled) {
      setInternalOpened(next);
    }

    onToggle?.(next, e);
  };

  return (
    <aside
      aria-label={ariaLabel}
      style={{ width: `${opened ? width : collapsedWidth}px` }}
      className={mergeClasses('flex flex-col justify-between', className)}
    >
      <div
        id={contentId}
        // Kept mounted while collapsed so the content does not lose its state.
        // Hidden through the attribute rather than a `hidden` class: that also
        // takes it out of the accessibility tree, and it holds even where the
        // utility layer has not been loaded.
        hidden={!opened}
        className={mergeClasses(
          'min-h-0 flex-1 overflow-auto p-4',
          contentClassName,
        )}
      >
        {children}
      </div>
      <div
        hidden={opened}
        className={mergeClasses(
          'rotate-180 px-3 py-4 [writing-mode:tb-rl] dial-small-text text-primary',
          titleClassName,
        )}
      >
        {title}
      </div>
      <div
        className={mergeClasses(
          'flex h-12 shrink-0 flex-row items-center gap-2 border-t border-tertiary py-1',
          opened ? 'justify-end px-2' : 'justify-center',
          footerClassName,
        )}
      >
        {opened && additionalButtons}
        <IconButton
          variant={ButtonVariant.Primary}
          appearance={ButtonAppearance.Ghost}
          size={ElementSize.Standard}
          onClick={changeVisibility}
          aria-label={toggleLabel}
          aria-expanded={opened}
          aria-controls={contentId}
          tooltipProps={{ tooltip: toggleLabel }}
          icon={
            opened ? (
              <IconChevronsLeft
                size={DIAL_ICON_SIZE.MD}
                stroke={DIAL_KIT_ICON_STROKE}
                aria-hidden="true"
              />
            ) : (
              <IconChevronsRight
                size={DIAL_ICON_SIZE.MD}
                stroke={DIAL_KIT_ICON_STROKE}
                aria-hidden="true"
              />
            )
          }
        />
      </div>
    </aside>
  );
};
