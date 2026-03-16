import { mergeClasses } from '@/utils/merge-classes';
import type { FC } from 'react';
import { DialSharedEntityIndicator } from '@/components/SharedEntityIndicator/SharedEntityIndicator';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import { DialIcon } from '@/components/Icon/Icon';
import { BASE_ICON_PROPS, BASE_ICON_SIZE } from '@/constants/icon';
import { IconFolder } from '@tabler/icons-react';
import { DialLoader } from '@/components/Loader/Loader';
import classNames from 'classnames';

export interface DialFolderNameProps {
  name: string;
  shared?: boolean;
  loading?: boolean;
  iconSize?: number;
  className?: string;
  sharedIndicatorClassName?: string;
  isInvalidName?: boolean;
}

/**
 * Component to display a folder name with a folder icon and shared indicator.
 * Handles long names with ellipsis and tooltip.
 *
 * @example
 * ```tsx
 * <DialFolderName name="Organization" />
 * ```
 *
 * @param name - Folder name
 * @param className - Additional CSS classes for the root container
 * @param shared - If true, shows shared indicator. Default: false.
 * @param loading - If true, shows loading state. Default: false.
 * @param iconSize - Icon size in px. Default: BASE_ICON_SIZE.
 * @param sharedIndicatorClassName - Additional CSS classes for the shared indicator
 * @param isInvalidName - If true, applies disabled styling to indicate the file name has invalid characters.
 */
export const DialFolderName: FC<DialFolderNameProps> = ({
  name,
  className,
  shared = false,
  loading = false,
  iconSize = BASE_ICON_SIZE,
  sharedIndicatorClassName,
  isInvalidName = false,
}) => {
  const getIcon = () => {
    if (loading) {
      return <DialLoader size={iconSize} />;
    }
    return (
      <DialIcon
        icon={<IconFolder {...BASE_ICON_PROPS} size={iconSize} />}
        className="inline-block align-middle"
      />
    );
  };

  return (
    <div className={mergeClasses('flex items-center gap-2 w-full', className)}>
      <span className="inline-flex relative text-secondary" role="img">
        {getIcon()}
        {shared && (
          <span className="absolute z-50 -bottom-0.5 -left-0.5">
            <DialSharedEntityIndicator className={sharedIndicatorClassName} />
          </span>
        )}
      </span>
      <DialEllipsisTooltip
        className={classNames(
          'dial-small flex-1 min-w-0',
          isInvalidName ? 'text-secondary' : 'text-primary',
        )}
        text={name}
        id="name"
      />
    </div>
  );
};
