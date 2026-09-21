import { IconDots } from '@tabler/icons-react';
import {
  useCallback,
  useMemo,
  type FC,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { Dropdown } from '@/components/New/Dropdown/Dropdown';
import { EllipsisTooltip } from '@/components/New/EllipsisTooltip/EllipsisTooltip';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import type { DropdownItem } from '@/models/dropdown';
import { mergeClasses } from '@/utils/merge-classes';

import {
  DEFAULT_MAX_VISIBLE_ITEMS,
  MIN_VISIBLE_ITEMS,
  currentSegmentClassName,
  defaultSeparator,
  itemClassName,
  linkSegmentClassName,
  listClassName,
  navClassName,
  overflowButtonClassName,
  segmentClassName,
  segmentWidthClassName,
  separatorClassName,
  staticSegmentClassName,
} from './constants';

/** One step of the trail rendered by {@link Breadcrumbs}. */
export interface BreadcrumbsItem {
  /**
   * The segment's text. A plain string rather than a node, because it is both
   * what is drawn and what the tooltip shows once the trail truncates it.
   */
  label: string;
  /** Where the segment navigates. Renders the segment as a link. */
  href?: string;
  /**
   * Fired when the segment is activated. Renders the segment as a button when
   * there is no `href`, and runs before the browser follows one when there is —
   * call `preventDefault()` on the event to keep the user where they are.
   */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Leading icon, e.g. a folder glyph on the root. Decorative: pass `aria-hidden`. */
  icon?: ReactNode;
}

export interface BreadcrumbsProps {
  /** The trail, outermost first. The last entry is the current page. */
  items: BreadcrumbsItem[];
  /**
   * How many segments are drawn before the middle collapses behind an
   * ellipsis menu. Clamped to a floor of three — the root, the ellipsis and
   * the current page.
   */
  maxVisibleItems?: number;
  /** Node drawn between two segments. Defaults to a right chevron, mirrored in RTL. */
  separator?: ReactNode;
  /** Accessible name for the `<nav>`. */
  ariaLabel?: string;
  /** Accessible name for the ellipsis button that reveals the collapsed segments. */
  overflowAriaLabel?: string;
  /** Additional CSS classes for the `<nav>`. Must not shrink it to its content. */
  className?: string;
  /** Additional CSS classes applied to every segment. */
  itemClassName?: string;
}

/**
 * A navigation trail: where the user is, and every level they can step back to.
 * aliases: Breadcrumb|NavigationPath|BreadcrumbTrail
 * Design system 2.0
 *
 * The last item is the current page — drawn semibold and primary, and never a
 * control, since a link to the page you are already on does nothing. Every
 * earlier item with an `href` or an `onClick` is a link; one with neither is
 * drawn as plain text, which is how a read-only location path is built.
 *
 * The trail never wraps. Segments truncate instead, each revealing its full
 * label in a tooltip only once it is actually clipped, and a trail longer than
 * `maxVisibleItems` collapses its middle behind an ellipsis menu — the root and
 * the current page, the two segments that carry the most meaning, always stay
 * on screen.
 *
 * a11y: an `<ol>` inside a named `<nav>`, with `aria-current="page"` on the last
 * segment. Separators are decorative and hidden from assistive tech, so the
 * trail is announced as a list of links rather than a string of chevrons.
 *
 * Labels are the caller's to translate; the two accessible names default to
 * English and take an override.
 *
 * @example
 * ```tsx
 * <Breadcrumbs
 *   ariaLabel={t('File path')}
 *   items={[
 *     { label: t('My files'), onClick: () => open('/') },
 *     { label: 'DK Test', onClick: () => open('/DK Test') },
 *     { label: 'DK Test with nested' },
 *   ]}
 * />
 * ```
 *
 * @param items - The trail, outermost first; the last entry is the current page
 * @param [maxVisibleItems=4] - Segments drawn before the middle collapses behind an ellipsis menu
 * @param [separator] - Node drawn between two segments; defaults to a right chevron
 * @param [ariaLabel='Breadcrumb'] - Accessible name for the `<nav>`
 * @param [overflowAriaLabel='Show hidden path segments'] - Accessible name for the ellipsis button
 * @param [className] - Additional CSS classes for the `<nav>`
 * @param [itemClassName] - Additional CSS classes applied to every segment
 */
export const Breadcrumbs: FC<BreadcrumbsProps> = ({
  items,
  maxVisibleItems = DEFAULT_MAX_VISIBLE_ITEMS,
  separator = defaultSeparator,
  ariaLabel = 'Breadcrumb',
  overflowAriaLabel = 'Show hidden path segments',
  className,
  itemClassName: segmentClassNameProp,
}) => {
  const visibleCount = Math.max(maxVisibleItems, MIN_VISIBLE_ITEMS);

  /*
   * The collapsed middle. Everything between the root and the trailing
   * `visibleCount - 2` segments moves into the ellipsis menu; an empty array
   * means the trail fits and is drawn whole.
   */
  const collapsed = useMemo(
    () =>
      items.length > visibleCount ? items.slice(1, -(visibleCount - 2)) : [],
    [items, visibleCount],
  );

  const collapsedMenuItems: DropdownItem[] = useMemo(
    () =>
      collapsed.map((item, index) => ({
        key: String(index),
        label: item.label,
        icon: item.icon,
      })),
    [collapsed],
  );

  const handleCollapsedClick = useCallback(
    ({ key, domEvent }: { key: string; domEvent: MouseEvent }) => {
      const item = collapsed[Number(key)];
      if (!item) return;

      item.onClick?.(domEvent as MouseEvent<HTMLElement>);

      /*
       * A menu row is a button, not a link, so a segment that only knows an
       * `href` has to be navigated to by hand — and an `onClick` that called
       * `preventDefault()` still means "stay here".
       */
      if (!item.onClick && item.href && !domEvent.defaultPrevented) {
        window.location.href = item.href;
      }
    },
    [collapsed],
  );

  if (items.length === 0) return null;

  const tail = items.slice(collapsed.length + 1);

  const renderSegment = (
    item: BreadcrumbsItem,
    {
      index,
      isFirst,
      isCurrent,
    }: { index: number; isFirst: boolean; isCurrent: boolean },
  ) => {
    const interactive = !isCurrent && (!!item.href || !!item.onClick);
    const contentClassName = mergeClasses(
      DIAL_KIT_CLASS.breadcrumbsItem,
      segmentClassName,
      interactive
        ? linkSegmentClassName
        : isCurrent
          ? currentSegmentClassName
          : staticSegmentClassName,
      segmentClassNameProp,
    );
    const content = (
      <>
        {item.icon}
        <EllipsisTooltip text={item.label} />
      </>
    );

    return (
      <li
        key={`segment-${index}`}
        className={mergeClasses(
          itemClassName,
          segmentWidthClassName[
            isCurrent ? 'last' : isFirst ? 'first' : 'middle'
          ],
        )}
      >
        {interactive ? (
          item.href ? (
            <a
              href={item.href}
              onClick={item.onClick}
              className={contentClassName}
            >
              {content}
            </a>
          ) : (
            <button
              type="button"
              onClick={item.onClick}
              className={contentClassName}
            >
              {content}
            </button>
          )
        ) : (
          <span
            className={contentClassName}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {content}
          </span>
        )}

        {!isCurrent && (
          <span className={separatorClassName} aria-hidden="true">
            {separator}
          </span>
        )}
      </li>
    );
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={mergeClasses(
        DIAL_KIT_CLASS.breadcrumbs,
        navClassName,
        className,
      )}
    >
      <ol className={listClassName}>
        {renderSegment(items[0], {
          index: 0,
          isFirst: true,
          isCurrent: items.length === 1,
        })}

        {collapsed.length > 0 && (
          <li className={mergeClasses(itemClassName, 'shrink-0')}>
            <Dropdown
              items={collapsedMenuItems}
              onItemClick={handleCollapsedClick}
              placement="bottom-start"
              matchReferenceWidth={false}
            >
              <button
                type="button"
                aria-label={overflowAriaLabel}
                className={overflowButtonClassName}
              >
                <IconDots
                  size={DIAL_ICON_SIZE.SM}
                  stroke={DIAL_KIT_ICON_STROKE}
                  aria-hidden="true"
                />
              </button>
            </Dropdown>
            <span className={separatorClassName} aria-hidden="true">
              {separator}
            </span>
          </li>
        )}

        {tail.map((item, index) =>
          renderSegment(item, {
            index: items.length - tail.length + index,
            isFirst: false,
            isCurrent: index === tail.length - 1,
          }),
        )}
      </ol>
    </nav>
  );
};
