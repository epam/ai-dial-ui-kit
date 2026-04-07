import type { FC, ReactNode } from 'react';
import { IconClipboardX } from '@tabler/icons-react';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialNoDataContentProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  containerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

/**
 * A component for displaying a message and icon when there is no data to show.
 * aliases: EmptyState|NoResults
 *
 * @example
 * ```tsx
 * <NoDataContent
 *   emptyDataTitle="No results found"
 *   icon={<CustomIcon />}
 * />
 * ```
 *
 * @param [icon] - Custom icon to display (defaults to clipboard icon)
 * @param title - The message to display when no data is present
 * @param [description] - The description to display when no data is present
 * @param [containerClassName] - Additional CSS classes for the container
 * @param [titleClassName] - Additional CSS classes for the title text
 * @param [descriptionClassName] - Additional CSS classes for the description text
 */
export const DialNoDataContent: FC<DialNoDataContentProps> = ({
  icon,
  title,
  description,
  containerClassName,
  titleClassName,
  descriptionClassName,
}) => {
  return (
    <div
      className={mergeClasses(
        'h-full w-full flex flex-col items-center justify-center text-secondary',
        containerClassName,
      )}
      aria-label="no-data-container"
    >
      {icon || <IconClipboardX width={60} height={60} stroke={0.5} />}
      <span
        className={mergeClasses(
          'dial-small-text mt-2 text-primary',
          titleClassName,
        )}
        aria-label="no-results-title"
      >
        {title}
      </span>
      {description && (
        <span
          className={mergeClasses('mt-1 text-primary', descriptionClassName)}
          aria-label="no-results-description"
        >
          {description}
        </span>
      )}
    </div>
  );
};
