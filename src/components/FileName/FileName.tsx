import { mergeClasses } from '@/utils/merge-classes';
import type { FC, ReactNode } from 'react';
import { DialFileIcon } from '@/components/FileIcon/FileIcon';
import { DialSharedEntityIndicator } from '@/components/SharedEntityIndicator/SharedEntityIndicator';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import { BASE_ICON_SIZE } from '@/constants/icon';
import classNames from 'classnames';

export interface DialFileNameProps {
  name: string;
  className?: string;
  shared?: boolean;
  iconSize?: number;
  details?: ReactNode;
  sharedIndicatorClassName?: string;
  isInvalidName?: boolean;
}

/**
 * Component to display a file name with a file icon and shared indicator.
 * Handles long names with ellipsis and tooltip.
 *
 * If `details` is provided (e.g., file size, date), the component switches to
 * a vertical layout and renders the extra information below the file name.
 *
 * @example
 * ```tsx
 * // Without details
 * <DialFileName name="Document.pdf" />
 *
 * // With details (file size and updated date)
 * <DialFileName
 *   name="Document.pdf"
 *   details={<span className="text-secondary">24 KB · Jul 20, 2025</span>}
 * />
 * ```
 *
 * @param name - Full file name with or without extension.
 * @param className - Additional CSS classes for the root container.
 * @param shared - Whether the file is shared.
 * @param iconSize - Icon size in px. Default: BASE_ICON_SIZE.
 * @param details - Optional metadata block displayed under the file name (e.g., size, modified date).
 * @param sharedIndicatorClassName - Additional CSS classes for the shared indicator.
 * @param isInvalidName - If true, applies disabled styling to indicate the file name has invalid characters.

 */
export const DialFileName: FC<DialFileNameProps> = ({
  name,
  className,
  shared = false,
  iconSize = BASE_ICON_SIZE,
  details,
  sharedIndicatorClassName,
  isInvalidName = false,
}) => {
  const extension = name.includes('.') ? name.split('.').pop() : undefined;

  return (
    <div className={mergeClasses('flex items-center gap-2 w-full', className)}>
      <DialFileIcon
        extension={extension}
        size={iconSize}
        className="text-secondary"
        indicator={
          shared ? (
            <DialSharedEntityIndicator className={sharedIndicatorClassName} />
          ) : null
        }
        label="File type icon"
      />

      <div
        className={classNames([
          'w-full flex min-w-0',
          details && 'flex-col gap-1',
        ])}
      >
        <DialEllipsisTooltip
          className={classNames([
            'dial-small flex-1 min-w-0',
            isInvalidName ? 'text-secondary' : 'text-primary',
          ])}
          text={name}
          id="name"
        />
        {details}
      </div>
    </div>
  );
};
