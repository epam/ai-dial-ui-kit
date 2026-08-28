import { IconChevronRight, IconFolder } from '@tabler/icons-react';
import type { FC } from 'react';

import { DialBreadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { DialIcon } from '@/components/Icon/Icon';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { mergeClasses } from '@/utils/merge-classes';

export interface FolderPathProps {
  segments: string[];
  labelClassName?: string;
  leafClassName?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * A read-only, non-clickable folder/location path built on top of `DialBreadcrumb`.
 * aliases: FolderBreadcrumb|LocationPath
 * Design system 2.0
 *
 * Every segment is disabled (no navigation); the first segment gets a leading
 * folder icon and the last segment is styled as the current/leaf item.
 *
 * @example
 * ```tsx
 * <FolderPath segments={['Shared', 'Team Space', 'Reports']} />
 * ```
 *
 * @param segments - Path segments to display, outermost first
 * @param [labelClassName='dial-small-text'] - Additional CSS classes applied to non-leaf segments
 * @param [leafClassName='dial-small-semi-text'] - Additional CSS classes applied to the last (leaf) segment
 * @param [className] - Additional CSS classes applied to the breadcrumb's `<nav>` element.
 *  `DialBreadcrumb` scrolls horizontally on overflow, so this must not shrink
 *  the nav to content width (e.g. never `w-auto`).
 * @param [ariaLabel='Folder path'] - Accessible name for the underlying `<nav>`.
 *  `DialBreadcrumb` would otherwise name it "Breadcrumb", which misdescribes a
 *  path with no navigable items; override it when a page shows more than one.
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
  const pathItems = segments.map((seg, i) => ({
    label:
      i === segments.length - 1 ? (
        <span className={leafClassName}>{seg}</span>
      ) : (
        seg
      ),
    disabled: true,
    ...(i === 0 ? { iconBefore: folderIcon } : {}),
  }));

  return (
    <DialBreadcrumb
      className={className}
      ariaLabel={ariaLabel}
      separator={
        <DialIcon
          icon={
            <IconChevronRight
              size={14}
              stroke={DIAL_KIT_ICON_STROKE}
              aria-hidden="true"
              // eslint-disable-next-line tailwindcss/no-unnecessary-arbitrary-value -- keep in sync with the source implementation's RTL mirroring
              className="rtl:scale-x-[-1]"
            />
          }
          className="text-secondary"
        />
      }
      pathItems={pathItems}
      labelClassName={mergeClasses(
        labelClassName,
        'text-secondary',
        '!cursor-default',
      )}
    />
  );
};
