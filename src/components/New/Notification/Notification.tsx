import {
  type FC,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useMemo,
} from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { NotificationType, NotificationVariant } from '@/types/notification';
import { mergeClasses } from '@/utils/merge-classes';
import { CloseButton } from '../CloseButton/CloseButton';
import {
  alertBaseClassName,
  notificationVariantClassNameMap,
  notificationVariantRoleMap,
  variantIcons,
} from './constants';

export interface NotificationProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  variant?: NotificationVariant;
  type?: NotificationType;
  title?: ReactNode;
  message: ReactNode;
  closable?: boolean;
  iconSize?: number;
  iconStroke?: number;
  textClassName?: string;
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * A contextual feedback component for displaying important messages.
 * aliases: Notification
 * Design system 2.0
 *
 * Renders a colored container with an icon, message text, and an optional
 * close button.
 *
 * The container is a live region whose politeness follows the variant: `error`
 * and `warning` use `role="alert"` (assertive, interrupts the screen reader),
 * every other variant uses `role="status"` (polite, queues). Pass an explicit
 * `role` to override — including for a notification that is static page content
 * rather than an update.
 *
 * @example
 * ```tsx
 * <Notification
 *   variant={NotificationVariant.Info}
 *   message="This is an info alert."
 * />
 *
 * <Notification
 *   variant={NotificationVariant.Success}
 *   title="Saved"
 *   message="Changes saved successfully."
 * />
 *
 * <Notification
 *   variant={NotificationVariant.Error}
 *   closable
 *   message="Something went wrong."
 *   onClose={(e) => console.log('closed', e)}
 * />
 *
 * <Notification
 *   variant={NotificationVariant.Loading}
 *   title="Processing"
 *   message="Please wait..."
 * />
 * ```
 *
 * @param [variant=NotificationVariant.Info] - Defines the visual style and icon of the alert
 * @param [type=NotificationType.Toast] - Defines the type of notification, either a toast or a section message
 * @param [title] - Optional heading displayed above the message in semibold
 * @param message - Message text to display inside the alert
 * @param [className] - Additional CSS classes applied to the alert container
 * @param [textClassName] - Additional CSS classes applied to the message text
 * @param [closable=false] - Whether the alert has a close button
 * @param [iconSize=24] - Size of the icon displayed in the alert
 * @param [iconStroke=2] - Stroke width of the icon displayed in the alert
 * @param [onClose] - Callback fired when the close button is clicked
 */
export const Notification: FC<NotificationProps> = ({
  variant = NotificationVariant.Info,
  type = NotificationType.Toast,
  title,
  message,
  className,
  iconSize = 24,
  iconStroke = 2,
  closable = false,
  onClose,
  children,
  textClassName,
  ...props
}) => {
  const icon = useMemo(() => {
    return variantIcons({ size: iconSize, stroke: iconStroke })[variant];
  }, [variant, iconSize, iconStroke]);

  const resolvedTextClassName =
    textClassName ??
    (type === NotificationType.SectionMessage
      ? 'flex-row flex-wrap items-baseline gap-x-1'
      : 'flex-col');

  return (
    <div
      // Before the spread, so a consumer can still override it — a notification
      // rendered as static page content may want no live region at all.
      role={notificationVariantRoleMap[variant]}
      {...props}
      className={mergeClasses(
        alertBaseClassName,
        notificationVariantClassNameMap[variant],
        type === NotificationType.Toast &&
          'min-w-[200px] max-w-[600px] shadow-lg',
        type === NotificationType.SectionMessage &&
          variant === NotificationVariant.Loading &&
          'border-secondary',
        className,
      )}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/*
          The variant icon restates what the message already says. It also has
          to stay out of the accessibility tree because the Loading variant's
          spinner carries its own `role="status"` — a live region nested inside
          this one causes the content to be announced twice.
        */}
        <span aria-hidden="true" className="flex shrink-0">
          <DialIcon icon={icon} />
        </span>
        {title ? (
          <div
            className={mergeClasses(
              'flex min-w-0 text-primary break-words',
              resolvedTextClassName,
            )}
          >
            <div className="dial-small-paragraph-semi-text min-w-0 break-words">
              {title}
            </div>
            <div className="dial-small-paragraph-text min-w-0 break-words">
              {message}
            </div>
          </div>
        ) : (
          <div className="dial-small-paragraph-text min-w-0 text-primary break-words">
            {message}
          </div>
        )}
      </div>

      {children}
      {closable && (
        <div className="relative size-[40px]">
          <CloseButton
            className="absolute top-[-2px] right-0 size-auto hover:bg-transparent "
            ariaLabel="Close notification"
            onClose={(e) => onClose?.(e)}
          />
        </div>
      )}
    </div>
  );
};
