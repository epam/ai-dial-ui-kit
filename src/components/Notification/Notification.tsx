import { IconX } from '@tabler/icons-react';
import {
  type FC,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useMemo,
} from 'react';

import { DialButton } from '@/components/Button/Button';
import { DialIcon } from '@/components/Icon/Icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { NotificationVariant } from '@/types/notification';
import { mergeClasses } from '@/utils/merge-classes';
import {
  alertBaseClassName,
  notificationVariantClassNameMap,
  variantIcons,
} from './constants';

export interface DialNotificationProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  variant?: NotificationVariant;
  title?: ReactNode;
  message: ReactNode;
  closable?: boolean;
  iconSize?: number;
  iconStroke?: number;
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * A contextual feedback component for displaying important messages.
 * aliases: Notification|StatusBanner
 *
 * Renders a colored container with an icon, message text, and an optional
 * close button.
 *
 * @example
 * ```tsx
 * <DialAlert
 *   variant={NotificationVariant.Info}
 *   message="This is an info alert."
 * />
 *
 * <DialAlert
 *   variant={NotificationVariant.Success}
 *   title="Saved"
 *   message="Changes saved successfully."
 * />
 *
 * <DialAlert
 *   variant={NotificationVariant.Error}
 *   closable
 *   message="Something went wrong."
 *   onClose={(e) => console.log('closed', e)}
 * />
 *
 * <DialAlert
 *   variant={NotificationVariant.Loading}
 *   title="Processing"
 *   message="Please wait..."
 * />
 * ```
 *
 * @param [variant=NotificationVariant.Info] - Defines the visual style and icon of the alert
 * @param [title] - Optional heading displayed above the message in semibold
 * @param message - Message text to display inside the alert
 * @param [className] - Additional CSS classes applied to the alert container
 * @param [closable=false] - Whether the alert has a close button
 * @param [iconSize=24] - Size of the icon displayed in the alert
 * @param [iconStroke=2] - Stroke width of the icon displayed in the alert
 * @param [onClose] - Callback fired when the close button is clicked
 */
export const DialNotification: FC<DialNotificationProps> = ({
  variant = NotificationVariant.Info,
  title,
  message,
  className,
  iconSize = 24,
  iconStroke = 2,
  closable = false,
  onClose,
  children,
  ...props
}) => {
  const icon = useMemo(() => {
    return variantIcons({ size: iconSize, stroke: iconStroke })[variant];
  }, [variant, iconSize, iconStroke]);

  return (
    <div
      {...props}
      role="alert"
      className={mergeClasses(
        alertBaseClassName,
        notificationVariantClassNameMap[variant],
        className,
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <DialIcon icon={icon} />
        {title ? (
          <div className="flex flex-col gap-1 text-primary">
            <div className="dial-small-semi-text">{title}</div>
            <div className="dial-small-text">{message}</div>
          </div>
        ) : (
          <div className="dial-small-text text-primary">{message}</div>
        )}
      </div>

      {children}
      {closable && (
        <DialButton
          className="ml-2 text-secondary hover:text-primary"
          aria-label="Close alert"
          iconBefore={<IconX size={DIAL_ICON_SIZE.LG} />}
          onClick={onClose}
        />
      )}
    </div>
  );
};
