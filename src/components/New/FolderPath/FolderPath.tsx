import { IconChevronRight, IconDots, IconFolder } from '@tabler/icons-react';
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  breadcrumbBaseClassName,
  breadcrumbCurrentClassName,
  breadcrumbItemBaseClassName,
  breadcrumbLinkBaseClassName,
  breadcrumbListClassName,
  breadcrumbSeparatorClassName,
} from '@/components/Breadcrumb/constants';
import { DialIcon } from '@/components/Icon/Icon';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { Tooltip } from '@/components/New/Tooltip/Tooltip';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { mergeClasses } from '@/utils/merge-classes';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import {
  observeElementSize,
  scheduleMeasure,
} from '@/utils/element-size-observer';

export interface FolderPathProps {
  segments: string[];
  labelClassName?: string;
  leafClassName?: string;
  className?: string;
  ariaLabel?: string;
}

/** Segments shown in full; a longer path collapses everything between the first and the last two. */
const MAX_VISIBLE_SEGMENTS = 3;

/**
 * A read-only, non-clickable folder/location path styled like `DialBreadcrumb`.
 * aliases: FolderBreadcrumb|LocationPath
 * Design system 2.0
 *
 * Every segment is disabled (no navigation); the first segment gets a leading
 * folder icon and the last segment is styled as the current/leaf item. A path
 * of more than three segments collapses its middle into a non-interactive `…`
 * that shows the full path (`Shared > Team > Sub > Reports`) in a tooltip on
 * hover; the hidden segments stay in the accessible text.
 *
 * When the path is too wide, the leaf keeps its width longest: the folder
 * before it truncates first, down to about one character, and if the leaf
 * still does not fit, that folder joins the `…` as well. Only then does the
 * leaf truncate.
 *
 * @example
 * ```tsx
 * <FolderPath segments={['Shared', 'Team Space', 'Reports']} />
 * ```
 *
 * @param segments - Path segments to display, outermost first
 * @param [labelClassName='dial-small-text'] - Additional CSS classes applied to non-leaf segments
 * @param [leafClassName='dial-small-semi-text'] - Additional CSS classes applied to the last (leaf) segment
 * @param [className] - Additional CSS classes applied to the `<nav>` element.
 *  The nav clips on overflow, so this must not shrink it to content width
 *  (e.g. never `w-auto`).
 * @param [ariaLabel='Folder path'] - Accessible name for the `<nav>`. A path
 *  has no navigable items, so it is not named "Breadcrumb"; override it when a
 *  page shows more than one.
 */
export const FolderPath: FC<FolderPathProps> = ({
  segments,
  labelClassName = 'dial-small-text',
  leafClassName = 'dial-small-semi-text',
  className,
  ariaLabel = 'Folder path',
}) => {
  const navRef = useRef<HTMLElement>(null);
  const leafLabelRef = useRef<HTMLSpanElement>(null);
  const preLeafLabelRef = useRef<HTMLSpanElement>(null);

  /*
   * Whether the folder before the leaf has been folded into the `…` because
   * the leaf did not fit even with that folder at its minimum width. Mirrored
   * in a ref so the observer callback stays referentially stable.
   */
  const [isPreLeafFolded, setIsPreLeafFolded] = useState(false);
  const isPreLeafFoldedRef = useRef(false);
  // Nav width at which the folded folder fits back in alongside a full leaf.
  const unfoldWidthRef = useRef(0);

  const setFolded = useCallback((isFolded: boolean) => {
    isPreLeafFoldedRef.current = isFolded;
    setIsPreLeafFolded(isFolded);
  }, []);

  const measure = useCallback(() => {
    const nav = navRef.current;

    if (!nav) return;

    if (isPreLeafFoldedRef.current) {
      if (nav.clientWidth >= unfoldWidthRef.current) setFolded(false);
      return;
    }

    const leaf = leafLabelRef.current;
    const preLeaf = preLeafLabelRef.current;

    if (!leaf || !preLeaf) return;

    const leafDeficit = leaf.scrollWidth - leaf.clientWidth;
    const preLeafMinWidth = parseFloat(getComputedStyle(preLeaf).minWidth) || 0;
    // The leaf shrinks a little alongside the folder before it, so only a
    // folder that has hit its minimum width means the leaf has run out of room.
    const isPreLeafAtMin = preLeaf.clientWidth <= preLeafMinWidth + 1;

    if (leafDeficit > 0 && isPreLeafAtMin) {
      unfoldWidthRef.current = nav.clientWidth + leafDeficit;
      setFolded(true);
    }
  }, [setFolded]);

  useEffect(() => {
    const nav = navRef.current;

    if (!nav) return;

    return observeElementSize(nav, measure);
  }, [measure]);

  // A new path starts unfolded and is measured afresh.
  const pathKey = segments.join('\u0000');
  useEffect(() => {
    setFolded(false);
    scheduleMeasure(measure);
  }, [pathKey, measure, setFolded]);

  // Unfolding changes nothing about the nav's own box, so the observer would
  // not fire again; re-measure so a path that still does not fit folds back.
  useEffect(() => {
    if (!isPreLeafFolded) scheduleMeasure(measure);
  }, [isPreLeafFolded, measure]);

  const folderIcon = (
    <DialIcon
      icon={
        <IconFolder
          size={DIAL_ICON_SIZE.SM}
          stroke={DIAL_KIT_ICON_STROKE}
          aria-hidden="true"
        />
      }
      className="text-secondary"
    />
  );
  const separator = (
    <span className={breadcrumbSeparatorClassName}>
      <DialIcon
        icon={
          <IconChevronRight
            size={14}
            stroke={DIAL_KIT_ICON_STROKE}
            aria-hidden="true"
            // Keep in sync with the source implementation's RTL mirroring.
            className="rtl:scale-x-[-1]"
          />
        }
        className="text-secondary"
      />
    </span>
  );
  const segmentLabelClassName = mergeClasses(
    labelClassName,
    'text-secondary cursor-default',
  );

  const leafIndex = segments.length - 1;
  const preLeafIndex = segments.length >= 3 ? leafIndex - 1 : -1;
  const isCollapsed = segments.length > MAX_VISIBLE_SEGMENTS || isPreLeafFolded;
  const hiddenSegments = segments.slice(
    1,
    isPreLeafFolded ? leafIndex : leafIndex - 1,
  );

  const renderSegment = (index: number) => {
    const isLeaf = index === leafIndex;
    const isPreLeaf = index === preLeafIndex;
    let label: ReactNode = segments[index];

    if (isLeaf) {
      label = <span className={leafClassName}>{segments[index]}</span>;
    }

    return (
      <li
        key={`item-${index}`}
        className={mergeClasses(
          breadcrumbItemBaseClassName,
          isLeaf && 'min-w-0',
          // Gives up its width long before the leaf does.
          isPreLeaf && 'shrink-[1000]',
          !isLeaf && !isPreLeaf && 'shrink-0',
        )}
      >
        <span
          className={mergeClasses(
            breadcrumbLinkBaseClassName,
            breadcrumbCurrentClassName,
            'pointer-events-none opacity-75',
            // Lets the label's own minimum width hold the folder at one character.
            isPreLeaf && 'min-w-auto',
          )}
          aria-current={isLeaf ? 'page' : undefined}
          aria-disabled="true"
        >
          {index === 0 && folderIcon}
          <span
            ref={
              (isLeaf && leafLabelRef) ||
              (isPreLeaf && preLeafLabelRef) ||
              undefined
            }
            className={mergeClasses(
              'truncate',
              isLeaf && 'min-w-0 flex-1',
              isPreLeaf && 'min-w-[2ch]',
              segmentLabelClassName,
            )}
          >
            {label}
          </span>
        </span>
        {!isLeaf && separator}
      </li>
    );
  };

  const renderEllipsis = () => (
    <li
      key="ellipsis"
      className={mergeClasses(breadcrumbItemBaseClassName, 'shrink-0')}
    >
      <Tooltip
        tooltip={segments.join(' > ')}
        triggerClassName="inline-flex cursor-default items-center text-secondary"
      >
        <IconDots
          size={DIAL_ICON_SIZE.SM}
          stroke={DIAL_KIT_ICON_STROKE}
          aria-hidden="true"
        />
        <span className="sr-only">{hiddenSegments.join(', ')}</span>
      </Tooltip>
      {separator}
    </li>
  );

  const items: ReactNode[] = [];
  if (isCollapsed) {
    items.push(renderSegment(0), renderEllipsis());
    if (!isPreLeafFolded) items.push(renderSegment(leafIndex - 1));
    items.push(renderSegment(leafIndex));
  } else {
    segments.forEach((_, index) => items.push(renderSegment(index)));
  }

  return (
    <nav
      ref={navRef}
      aria-label={ariaLabel}
      className={mergeClasses(
        breadcrumbBaseClassName,
        className,
        DIAL_KIT_CLASS.folderPath,
      )}
    >
      <ol className={breadcrumbListClassName}>{items}</ol>
    </nav>
  );
};
