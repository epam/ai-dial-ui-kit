import type { FC, ReactNode } from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';

import { NoDataIllustration } from '@/components/New/NoDataContent/NoDataIllustration';

export interface NoDataContentProps {
  /** Headline of the empty state. */
  title: ReactNode;
  /** Optional secondary line under the title. */
  description?: ReactNode;
  /** Illustration above the title. Defaults to the placeholder-list card. */
  icon?: ReactNode;
  /** Optional way forward, such as a button, rendered under the text. */
  action?: ReactNode;
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
 * Fills its container and centres an illustration, a headline, an optional
 * secondary line and an optional action. The icon is decorative, so it is
 * hidden from assistive tech and the text carries the message on its own.
 *
 * @example
 * ```tsx
 * <NoDataContent
 *   title="No chats found"
 *   description="Try a different search term or check your filters."
 *   live
 * />
 *
 * <NoDataContent
 *   title="No chats yet"
 *   description="Chats will appear here once you start one."
 *   action={<Button label="New chat" onClick={createChat} />}
 * />
 * ```
 *
 * @param title - Headline of the empty state.
 * @param [description] - Optional secondary line under the title.
 * @param [icon] - Illustration above the title. Defaults to the placeholder-list card.
 * @param [action] - Optional way forward, rendered under the text.
 * @param [live=false] - Announce the empty state to assistive tech as it appears.
 * @param [className] - Additional CSS classes for the container.
 * @param [titleClassName] - Additional CSS classes for the title.
 * @param [descriptionClassName] - Additional CSS classes for the description.
 */
export const NoDataContent: FC<NoDataContentProps> = ({
  title,
  description,
  icon,
  action,
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
        'flex size-full flex-col items-center justify-center px-4 text-center',
        className,
        DIAL_KIT_CLASS.noDataContent,
      )}
    >
      {icon ?? <NoDataIllustration />}
      <span
        className={mergeClasses(
          'dial-small-semi-text mt-6 text-primary',
          titleClassName,
        )}
      >
        {title}
      </span>
      {description != null && (
        <span
          className={mergeClasses(
            'dial-small-text mt-2 text-secondary',
            descriptionClassName,
          )}
        >
          {description}
        </span>
      )}
      {action != null && <div className="mt-4">{action}</div>}
    </div>
  );
};
