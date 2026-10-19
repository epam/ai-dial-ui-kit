import { IconChevronRight, IconDots, IconFolder } from '@tabler/icons-react';
import type { FC } from 'react';

import { DialBreadcrumbItem } from '@/components/Breadcrumb/BreadcrumbItem';
import {
  breadcrumbBaseClassName,
  breadcrumbItemBaseClassName,
  breadcrumbListClassName,
  breadcrumbSeparatorClassName,
} from '@/components/Breadcrumb/constants';
import { DialIcon } from '@/components/Icon/Icon';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { Tooltip } from '@/components/New/Tooltip/Tooltip';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { mergeClasses } from '@/utils/merge-classes';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';

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
  );
  const segmentLabelClassName = mergeClasses(
    labelClassName,
    'text-secondary',
    '!cursor-default',
  );

  const renderSegment = (index: number) => {
    const isLast = index === segments.length - 1;
    return (
      <DialBreadcrumbItem
        key={`item-${index}`}
        label={
          isLast ? (
            <span className={leafClassName}>{segments[index]}</span>
          ) : (
            segments[index]
          )
        }
        disabled
        iconBefore={index === 0 ? folderIcon : undefined}
        isFirst={index === 0 && segments.length > 1}
        isLast={isLast}
        separator={separator}
        labelClassName={segmentLabelClassName}
      />
    );
  };

  const isCollapsed = segments.length > MAX_VISIBLE_SEGMENTS;
  const hiddenSegments = segments.slice(1, -2);

  return (
    <nav
      aria-label={ariaLabel}
      className={mergeClasses(
        breadcrumbBaseClassName,
        className,
        DIAL_KIT_CLASS.folderPath,
      )}
    >
      <ol className={breadcrumbListClassName}>
        {isCollapsed ? (
          <>
            {renderSegment(0)}
            <li
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
              <span className={breadcrumbSeparatorClassName}>{separator}</span>
            </li>
            {renderSegment(segments.length - 2)}
            {renderSegment(segments.length - 1)}
          </>
        ) : (
          segments.map((_, index) => renderSegment(index))
        )}
      </ol>
    </nav>
  );
};
