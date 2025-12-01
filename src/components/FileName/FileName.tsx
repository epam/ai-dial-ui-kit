import { mergeClasses } from '@/utils/merge-classes';
import type { FC } from 'react';
import { DialFileIcon } from '@/components/FileIcon/FileIcon';
import { DialSharedEntityIndicator } from '@/components/SharedEntityIndicator/SharedEntityIndicator';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import { BASE_ICON_SIZE } from '@/constants/icon';

export interface DialFileNameProps {
  name: string;
  className?: string;
  shared?: boolean;
  iconSize?: number;
}

/**
 * Component to display a file name with a file icon and shared indicator.
 * Handles long names with ellipsis and tooltip.
 *
 * @example
 * ```tsx
 * <DialFileName name="Document.pdf" />
 * ```
 *
 * @param name - Full file name with or without extension
 * @param className - Additional CSS classes for the root container
 * @param shared - Whether the file is shared
 * @param iconSize - Icon size in px. Default: BASE_ICON_SIZE.
 */
export const DialFileName: FC<DialFileNameProps> = ({
  name,
  className,
  shared = false,
  iconSize = BASE_ICON_SIZE,
}) => {
  const extension = name.includes('.') ? name.split('.').pop() : null;

  return (
    <div className={mergeClasses('flex items-center gap-2 w-full', className)}>
      {extension && (
        <DialFileIcon
          extension={extension}
          size={iconSize}
          className="text-secondary"
          indicator={shared ? <DialSharedEntityIndicator /> : null}
          label="File type icon"
        />
      )}
      <DialEllipsisTooltip
        className="text-primary dial-small flex-1 min-w-0"
        text={name}
      />
    </div>
  );
};
