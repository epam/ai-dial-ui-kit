import type { FC, ReactNode } from 'react';
import { DialIcon } from '@/components/Icon/Icon';
import { BASE_ICON_PROPS } from '@/constants/icon';
import {
  DialFileIcon,
  type DialFileIconProps,
} from '@/components/FileIcon/FileIcon';
import { DialItemType } from '@/types/item';
import { DialSharedEntityIndicator } from '@/components/SharedEntityIndicator/SharedEntityIndicator';
import { IconFolder } from '@tabler/icons-react';
import { DialLoader } from '@/components/Loader/Loader';

export interface DialFileManagerItemIconProps
  extends Omit<DialFileIconProps, 'extension'> {
  type: DialItemType;
  name: string;
  shared?: boolean;
  loading?: boolean;
  sharedIndicatorClassName?: string;
  sharedIndicatorTooltip?: ReactNode;
}

/**
 * Renders an icon representing either a file or folder entity in the Dial system.
 *
 * Displays:
 * - A file icon based on its extension (via `DialFileIcon`)
 * - A folder icon (via `IconFolder`)
 * - A loading spinner if `loading` is true
 * - A shared indicator if the entity is marked as shared
 *
 * @example
 * ```tsx
 * <DialFileManagerItemIcon
 *   name="document.pdf"
 *   type={DialItemType.File}
 *   shared
 * />
 *
 * <DialFileManagerItemIcon
 *   name="My Folder"
 *   type={DialItemType.Folder}
 *   loading
 * />
 * ```
 *
 * @param {Object} props
 * @param {string} props.name - The name of the file or folder (used to determine extension for files).
 * @param {DialItemType} props.type - The type of the item (`file` or `folder`).
 * @param {boolean} [props.shared=false] - Whether the item is shared.
 * @param {boolean} [props.loading=false] - Whether to display the loading state.
 * @param {number} [props.size] - Optional icon size override.
 * @param {number} [props.stroke] - Optional icon stroke width override.
 * @param {string} [props.className] - Optional CSS class for styling.
 * @param {boolean} [props.decorative] - Whether the icon is decorative (for accessibility).
 * @param {string} [props.label] - Accessible label for screen readers.
 * @param {ReactNode} [props.indicator] - Optional indicator to display over the icon.
 * @param {string} [props.sharedIndicatorClassName] - Optional CSS class for the shared indicator.
 * @param  [sharedIndicatorTooltip] - Custom tooltip content for the shared indicator; defaults to "Shared"
 */
export const DialFileManagerItemIcon: FC<DialFileManagerItemIconProps> = ({
  name,
  type,
  shared = false,
  loading = false,
  sharedIndicatorClassName,
  sharedIndicatorTooltip,
  ...restProps
}) => {
  const wrapIcon = (icon: ReactNode) => (
    <span className="inline-flex relative text-secondary" role="img">
      {icon}
      {shared && (
        <span className="absolute -bottom-0.5 -left-0.5">
          <DialSharedEntityIndicator
            className={sharedIndicatorClassName}
            sharedIndicatorTooltip={sharedIndicatorTooltip}
          />
        </span>
      )}
    </span>
  );

  if (loading) {
    return wrapIcon(<DialLoader />);
  }

  if (type === DialItemType.File) {
    const extension = name.includes('.') ? name.split('.').pop() : undefined;

    return (
      <DialFileIcon
        {...restProps}
        extension={extension ?? ''}
        className="text-secondary"
        indicator={
          shared ? (
            <DialSharedEntityIndicator
              className={sharedIndicatorClassName}
              sharedIndicatorTooltip={sharedIndicatorTooltip}
            />
          ) : null
        }
        label="File type icon"
      />
    );
  }

  if (type === DialItemType.Folder) {
    return wrapIcon(
      <DialIcon
        icon={
          <IconFolder
            className={restProps.className}
            size={restProps.size ?? BASE_ICON_PROPS.size}
            stroke={restProps.stroke ?? BASE_ICON_PROPS.stroke}
          />
        }
        className="inline-block align-middle"
      />,
    );
  }

  return null;
};
