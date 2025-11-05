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

export interface DialItemIconProps
  extends Omit<DialFileIconProps, 'extension'> {
  type: DialItemType;
  name: string;
  shared?: boolean;
  loading?: boolean;
}

export const DialItemIcon: FC<DialItemIconProps> = ({
  name,
  type,
  shared = false,
  loading = false,
  ...restProps
}) => {
  const wrapIcon = (icon: ReactNode) => (
    <span className={'inline-flex relative text-secondary'} role="img">
      {icon}
      {shared && (
        <span className="absolute -bottom-0.5 -left-0.5">
          <DialSharedEntityIndicator />
        </span>
      )}
    </span>
  );

  if (loading) {
    return wrapIcon(<DialLoader />);
  }

  if (type === DialItemType.File) {
    const extension = name.includes('.') ? name.split('.').pop() : null;

    return (
      <DialFileIcon
        {...restProps}
        extension={extension ?? ''}
        cssClass="text-secondary"
        indicator={shared ? <DialSharedEntityIndicator /> : null}
        label="File type icon"
      />
    );
  }

  if (type === DialItemType.Folder) {
    return wrapIcon(
      <DialIcon
        icon={
          <IconFolder
            className={restProps.cssClass}
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
