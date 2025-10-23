import { mergeClasses } from '@/utils/merge-classes';
import type { FC } from 'react';
import { DialSharedEntityIndicator } from '@/components/SharedEntityIndicator/SharedEntityIndicator';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import { DialIcon } from '@/components/Icon/Icon';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { IconFolder } from '@tabler/icons-react';
import { DialLoader } from '../Loader/Loader';

export interface DialFolderNameProps {
  name: string;
  cssClass?: string;
  shared?: boolean;
  loading?: boolean;
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
 * @param cssClass - Additional CSS classes for the root container
 * @param shared - Whether the folder is shared
 */
export const DialFolderName: FC<DialFolderNameProps> = ({
  name,
  cssClass,
  shared = false,
  loading = false,
}) => {
  const getIcon = () => {
    if (loading) {
      return <DialLoader />;
    }
    return (
      <DialIcon
        icon={<IconFolder {...BASE_ICON_PROPS} />}
        className="inline-block align-middle"
      />
    );
  };

  return (
    <div className={mergeClasses('flex items-center gap-2 w-full', cssClass)}>
      <span className={'inline-flex relative text-secondary'} role="img">
        {getIcon()}
        {shared && (
          <span className="absolute -bottom-0.5 -left-0.5">
            <DialSharedEntityIndicator />
          </span>
        )}
      </span>
      <DialEllipsisTooltip
        cssClass="text-primary dial-small flex-1 min-w-0"
        text={name}
      />
    </div>
  );
};
