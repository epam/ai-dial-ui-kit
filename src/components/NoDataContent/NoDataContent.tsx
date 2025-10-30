import type { FC, ReactNode } from 'react';
import { IconClipboardX } from '@tabler/icons-react';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialNoDataContentProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  containerCssClass?: string;
  titleCssClass?: string;
  descriptionCssClass?: string;
}

/**
 * A component for displaying a message and icon when there is no data to show.
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
 */
export const DialNoDataContent: FC<DialNoDataContentProps> = ({
  icon,
  title,
  description,
  containerCssClass,
  titleCssClass,
  descriptionCssClass,
}) => {
  return (
    <div
      className={mergeClasses(
        'h-full w-full flex flex-col items-center justify-center text-secondary',
        containerCssClass,
      )}
    >
      {icon || <IconClipboardX width={60} height={60} />}
      <span
        className={mergeClasses('dial-small mt-2 text-primary', titleCssClass)}
      >
        {title}
      </span>
      {description && (
        <span
          className={mergeClasses('mt-1 text-primary', descriptionCssClass)}
        >
          {description}
        </span>
      )}
    </div>
  );
};
