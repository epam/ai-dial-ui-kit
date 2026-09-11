import type { FC, ReactNode } from 'react';

import NoDataIcon from '@/assets/icons/no-data.svg?react';
import { mergeClasses } from '@/utils/merge-classes';

/** Footprint of the default icon, large enough to carry an empty state. */
const DEFAULT_ICON_SIZE = 32;

export interface NoDataContentProps {
  /** Headline of the empty state. */
  title: ReactNode;
  /** Optional secondary line under the title. */
  description?: ReactNode;
  /** Illustration above the title. Defaults to the empty-state document mark. */
  icon?: ReactNode;
  /**
   * Announces the empty state to assistive tech as it appears. Turn it on where
   * the content replaces a list the user has just filtered or searched.
   */
  live?: boolean;
  /** Additional CSS classes for the container. */
  className?: string;
  /** Additional CSS classes for the title. */
  titleClassName?: string;
  /** Additional CSS classes for the description. */
  descriptionClassName?: string;
}

/**
 * Message shown in place of a list, table or grid that has nothing to show.
 * aliases: EmptyState|NoResults|ZeroState
 * Design system 2.0
 *
 * Fills its container and centres an illustration, a headline and an optional
 * secondary line. The icon is decorative, so it is hidden from assistive tech
 * and the text carries the message on its own.
 *
 * @example
 * ```tsx
 * <NoDataContent
 *   title="No results found"
 *   description="Try a different search term."
 * />
 *
 * <NoDataContent title="Nothing here yet" icon={<IconInbox size={60} />} live />
 * ```
 *
 * @param title - Headline of the empty state.
 * @param [description] - Optional secondary line under the title.
 * @param [icon] - Illustration above the title. Defaults to the empty-state document mark.
 * @param [live=false] - Announce the empty state to assistive tech as it appears.
 * @param [className] - Additional CSS classes for the container.
 * @param [titleClassName] - Additional CSS classes for the title.
 * @param [descriptionClassName] - Additional CSS classes for the description.
 */
export const NoDataContent: FC<NoDataContentProps> = ({
  title,
  description,
  icon,
  live = false,
  className,
  titleClassName,
  descriptionClassName,
}) => {
  return (
    <div
      // `status` announces the message once it appears, which is what a grid
      // emptied by a filter needs; a decorative empty state stays silent.
      role={live ? 'status' : undefined}
      className={mergeClasses(
        'flex size-full flex-col items-center justify-center gap-2 text-tertiary',
        className,
      )}
    >
      {icon ?? (
        <NoDataIcon
          width={DEFAULT_ICON_SIZE}
          height={DEFAULT_ICON_SIZE}
          aria-hidden="true"
        />
      )}
      <span
        className={mergeClasses(
          'dial-tiny-text text-secondary',
          titleClassName,
        )}
      >
        {title}
      </span>
      {description && (
        <span
          className={mergeClasses(
            'dial-tiny-text text-secondary',
            descriptionClassName,
          )}
        >
          {description}
        </span>
      )}
    </div>
  );
};
