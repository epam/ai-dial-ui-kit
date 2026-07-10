import { useId, useState, type FC, type ReactNode } from 'react';

import { IconChevronRight } from '@tabler/icons-react';
import classNames from 'classnames';

import { DialIcon } from '@/components/Icon/Icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialAccordionProps {
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
   * chevron icon is hidden and the header is no longer interactive.
   */
  nonCollapsible?: boolean;
  /** Fired when the header is clicked. Receives the next expanded state. */
  onToggle?: (expanded: boolean) => void;
  /** Additional CSS classes for the outer container. */
  className?: string;
  /** Additional CSS classes for the header button. */
  headerClassName?: string;
  /** Additional CSS classes for the content region. */
  contentClassName?: string;
}

/**
 * A collapsible panel that toggles its content when the header is clicked.
 * aliases: Collapse|Disclosure|ExpandablePanel
 *
 * Works as a controlled component when `expanded` is provided, otherwise it manages
 * its own state from `defaultExpanded`. The header shows a chevron that rotates when
 * expanded, a title, and an optional description.
 *
 * @example
 * ```tsx
 * <DialAccordion title="Advanced settings" description="Optional configuration">
 *   <p>Panel content</p>
 * </DialAccordion>
 * ```
 *
 * @param title - Title rendered in the header.
 * @param [description] - Optional secondary text rendered under the title.
 * @param [children] - Content revealed when expanded.
 * @param [expanded] - Controlled expanded state.
 * @param [defaultExpanded=false] - Initial expanded state when uncontrolled.
 * @param [disabled] - Disables toggling.
 * @param [nonCollapsible] - Renders the panel permanently expanded without a chevron or toggle.
 * @param [onToggle] - Fired when the header is clicked. Receives the next expanded state.
 * @param [className] - Additional CSS classes for the outer container.
 * @param [headerClassName] - Additional CSS classes for the header button.
 * @param [contentClassName] - Additional CSS classes for the content region.
 */
export const DialAccordion: FC<DialAccordionProps> = ({
  title,
  description,
  children,
  expanded,
  defaultExpanded = false,
  disabled,
  nonCollapsible,
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
  const contentId = useId();

  const handleToggle = () => {
    if (disabled) return;
    const next = !isExpanded;
    if (!isControlled) {
      setInternalExpanded(next);
    }
    onToggle?.(next);
  };

  return (
    <div className={mergeClasses('rounded border border-secondary', className)}>
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        disabled={disabled || nonCollapsible}
        onClick={handleToggle}
        className={mergeClasses(
          'flex w-full items-center gap-2 p-4 text-left',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          nonCollapsible && 'cursor-default',
          headerClassName,
        )}
      >
        {!nonCollapsible && (
          <DialIcon
            className={classNames(
              'text-secondary transition-transform',
              isExpanded && 'rotate-90',
            )}
            icon={<IconChevronRight size={DIAL_ICON_SIZE.SM} />}
          />
        )}
        <span className="dial-body-text text-primary">{title}</span>
        {description != null && description !== false && (
          <span className="dial-tiny-text text-secondary">{description}</span>
        )}
      </button>
      {isExpanded && (
        <div
          id={contentId}
          role="region"
          className={mergeClasses('px-4 pb-4', contentClassName)}
        >
          {children}
        </div>
      )}
    </div>
  );
};
