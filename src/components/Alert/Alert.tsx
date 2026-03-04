import { IconX } from '@tabler/icons-react';
import {
  type FC,
  type MouseEvent,
  type ReactNode,
  useMemo,
  type HTMLAttributes,
} from 'react';

import { DialButton } from '@/components/Button/Button';
import { DialIcon } from '@/components/Icon/Icon';
import { AlertVariant } from '@/types/alert';
import { mergeClasses } from '@/utils/merge-classes';
import {
  alertBaseClassName,
  alertVariantClassNameMap,
  variantIcons,
} from './constants';
import { DIAL_ICON_SIZE } from '@/constants/icon';

export interface DialAlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  message: ReactNode;
  closable?: boolean;
  iconSize?: number;
  iconStroke?: number;
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * A contextual feedback component for displaying important messages.
 *
 * Renders a colored container with an icon, message text, and an optional
 * close button.
 *
 * @example
 * ```tsx
 * <DialAlert
 *   variant={AlertVariant.Info}
 *   message="This is an info alert."
 * />
 *
 * <DialAlert
 *   variant={AlertVariant.Success}
 *   message="Changes saved successfully."
 * />
 *
 * <DialAlert
 *   variant={AlertVariant.Error}
 *   closable
 *   message="Something went wrong."
 *   onClose={(e) => console.log('closed', e)}
 * />
 *
 * <DialAlert
 *   variant={AlertVariant.Warning}
 *   message="Custom alert"
 *   aria-live="polite"
 *   id="warning-alert"
 * />
 * ```
 *
 * @param [variant=AlertVariant.Info] - Defines the visual style and icon of the alert
 * @param message - Message text to display inside the alert
 * @param [className] - Additional CSS classes applied to the alert container
 * @param [closable=false] - Whether the alert has a close button
 * @param [iconSize=24] - Size of the icon displayed in the alert
 * @param [iconStroke=2] - Stroke width of the icon displayed in the alert
 * @param [onClose] - Callback fired when the close button is clicked
 */
export const DialAlert: FC<DialAlertProps> = ({
  variant = AlertVariant.Info,
  message,
  className,
  iconSize = 24,
  iconStroke = 2,
  closable = false,
  onClose,
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
        alertVariantClassNameMap[variant],
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <DialIcon icon={icon} />
        <div className="text-primary">{message}</div>
      </div>

      {closable && (
        <DialButton
          className="ml-2 text-secondary hover:text-primary"
          aria-label="Close alert"
          iconBefore={<IconX size={DIAL_ICON_SIZE.SMALL} />}
          onClick={onClose}
        />
      )}
    </div>
  );
};
