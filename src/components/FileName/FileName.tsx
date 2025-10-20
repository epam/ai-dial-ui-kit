import { mergeClasses } from '@/utils/merge-classes';
import type { FC } from 'react';
import { DialFileIcon } from '../FileIcon/FileIcon';
import { DialSharedEntityIndicator } from '../SharedEntityIndicator/SharedEntityIndicator';
import { DialEllipsisTooltip } from '../EllipsisTooltip/EllipsisTooltip';

export interface DialFileNameProps {
  name: string;
  cssClass?: string;
  shared?: boolean;
}

/**
 * Component to display a file name with an optional file icon and shared indicator.
 * Handles long names with ellipsis and tooltip.
 *
 * @example
 * ```tsx
 * <DialFileName name="Document.pdf" />
 * ```
 *
 * @param name - Full file name with or without extension
 * @param cssClass - Additional CSS classes for the root container
 * @param shared - Whether the file is shared
 */
export const DialFileName: FC<DialFileNameProps> = ({
  name,
  cssClass,
  shared = false,
}) => {
  const extension = name.includes('.') ? name.split('.').pop() : null;

  return (
    <div className={mergeClasses('flex items-center gap-2 w-full', cssClass)}>
      {extension && (
        <DialFileIcon
          extension={extension}
          cssClass="text-secondary"
          indicator={shared ? <DialSharedEntityIndicator /> : null}
          label="File type icon"
        />
      )}
      <DialEllipsisTooltip
        cssClass="text-primary dial-small flex-1 min-w-0"
        text={name}
      />
    </div>
  );
};
