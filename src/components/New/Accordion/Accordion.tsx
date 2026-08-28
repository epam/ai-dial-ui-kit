import { IconChevronRight } from '@tabler/icons-react';
import { useId, useState, type FC, type ReactNode } from 'react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { resolveAccessibleName } from '@/utils/accessible-name';
import { mergeClasses } from '@/utils/merge-classes';

export interface AccordionProps {
  /** Title rendered in the header. */
  title: ReactNode;
  /** Optional secondary text rendered under the title. */
  description?: ReactNode;
  /** Content revealed when the accordion is expanded. */
  children?: ReactNode;
  /** Controlled expanded state. When provided, the component becomes controlled. */
  expanded?: boolean;
  /** Initial expanded state when uncontrolled. Defaults to `false`. */
  defaultExpanded?: boolean;
  /** Disables toggling. */
  disabled?: boolean;
  /**
   * Renders the panel permanently expanded: the content is always visible, the
   * caret is hidden and the header is a plain heading rather than a control.
   */
  nonCollapsible?: boolean;
  /**
   * Accessible name for the header control. Only needed when `title` is a node
   * that carries no text of its own — a string title already names the header.
   */
  ariaLabel?: string;
  /** Fired when the header is clicked. Receives the next expanded state. */
  onToggle?: (expanded: boolean) => void;
  /** Additional CSS classes for the outer container. */
  className?: string;
  /** Additional CSS classes for the header. */
  headerClassName?: string;
  /** Additional CSS classes for the content region. */
  contentClassName?: string;
}

/**
 * A collapsible panel that toggles its content when the header is clicked.
 * aliases: Collapse|Disclosure|ExpandablePanel
 * Design system 2.0
 *
 * Works as a controlled component when `expanded` is provided, otherwise it manages
 * its own state from `defaultExpanded`. The header shows a caret that rotates when
 * expanded, a title, and an optional description stacked beneath it.
 *
 * The revealed content is a labelled `region`, so assistive tech announces it by the
 * header it belongs to. `nonCollapsible` renders the header as static text instead of
 * a permanently disabled button, which keeps a decorative panel out of the tab order.
 *
 * @example
 * ```tsx
 * <Accordion title="Advanced settings" description="Optional configuration">
 *   <p>Panel content</p>
 * </Accordion>
 *
 * <Accordion title="Always open" nonCollapsible>
 *   <p>Panel content</p>
 * </Accordion>
 * ```
 *
 * @param title - Title rendered in the header.
 * @param [description] - Optional secondary text rendered under the title.
 * @param [children] - Content revealed when expanded.
 * @param [expanded] - Controlled expanded state.
 * @param [defaultExpanded=false] - Initial expanded state when uncontrolled.
 * @param [disabled] - Disables toggling.
 * @param [nonCollapsible] - Renders the panel permanently expanded, with a static header.
 * @param [ariaLabel] - Accessible name for the header; needed when `title` carries no text.
 * @param [onToggle] - Fired when the header is clicked. Receives the next expanded state.
 * @param [className] - Additional CSS classes for the outer container.
 * @param [headerClassName] - Additional CSS classes for the header.
 * @param [contentClassName] - Additional CSS classes for the content region.
 */
export const Accordion: FC<AccordionProps> = ({
  title,
  description,
  children,
  expanded,
  defaultExpanded = false,
  disabled,
  nonCollapsible,
  ariaLabel,
  onToggle,
  className,
  headerClassName,
  contentClassName,
}) => {
  const isControlled = expanded !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = nonCollapsible
    ? true
    : isControlled
      ? expanded
      : internalExpanded;

  // Generated rather than fixed: several accordions on one page would otherwise
  // share a header id, and every region would be named by the first one.
  const generatedId = useId();
  const headerId = `accordion-header-${generatedId}`;
  const contentId = `accordion-content-${generatedId}`;

  const handleToggle = () => {
    if (disabled) return;
    const next = !isExpanded;
    if (!isControlled) {
      setInternalExpanded(next);
    }
    onToggle?.(next);
  };

  const headerContent = (
    <>
      <span className="flex min-w-0 flex-col">
        <span className="truncate dial-body-text text-primary">{title}</span>
        {description ? (
          <span className="truncate dial-tiny-text text-secondary">
            {description}
          </span>
        ) : null}
      </span>
      {!nonCollapsible && (
        // Caret at the leading edge; it turns a quarter turn to point down when open.
        <IconChevronRight
          size={DIAL_ICON_SIZE.SM}
          stroke={DIAL_KIT_ICON_STROKE}
          aria-hidden="true"
          className={mergeClasses(
            'shrink-0 text-secondary transition-transform motion-reduce:transition-none',
            isExpanded && 'rotate-90',
          )}
        />
      )}
    </>
  );

  return (
    <div
      className={mergeClasses(
        'flex flex-col gap-3 py-3 overflow-hidden bg-transparent ',
        className,
      )}
    >
      {nonCollapsible ? (
        <div
          id={headerId}
          className={mergeClasses(
            'flex w-full px-4 rounded-xl items-center justify-between dial-tiny-text',
            headerClassName,
          )}
        >
          {headerContent}
        </div>
      ) : (
        <button
          id={headerId}
          type="button"
          aria-expanded={isExpanded}
          // The panel is unmounted while collapsed, so pointing at it only while
          // it exists keeps `aria-controls` from dangling on a missing id.
          aria-controls={isExpanded ? contentId : undefined}
          aria-label={resolveAccessibleName(ariaLabel)}
          disabled={disabled}
          onClick={handleToggle}
          className={mergeClasses(
            'flex w-full px-4 rounded-xl items-center justify-between dial-tiny-text',
            disabled
              ? 'cursor-not-allowed opacity-75'
              : // Applied only to a header that can actually be operated.
                'cursor-pointer hover:bg-control-accent-alpha-hover focus-visible:outline focus-visible:outline-focus',
            headerClassName,
          )}
        >
          {headerContent}
        </button>
      )}

      {isExpanded && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={headerId}
          className={mergeClasses(
            'px-4 dial-small-text text-primary',
            contentClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};
