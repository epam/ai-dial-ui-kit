import { IconX } from '@tabler/icons-react';
import classNames from 'classnames';
import { type FC, type ReactNode, type MouseEvent, useMemo } from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { DialButton } from '@/components/Button/Button';
import { AlertVariant } from '@/types/alert';
import {
  alertBaseClassName,
  alertVariantClassNameMap,
  variantIcons,
} from './constants';

export interface DialAlertProps {
  variant?: AlertVariant;
  message: string | ReactNode;
  className?: string;
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
}) => {
  const icon = useMemo(() => {
    return variantIcons({ size: iconSize, stroke: iconStroke })[variant];
  }, [variant, iconSize, iconStroke]);

  return (
    <div
      role="alert"
      className={classNames(
        alertBaseClassName,
        alertVariantClassNameMap[variant],
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <DialIcon icon={icon} />
        <div className="text-primary dial-small">{message}</div>
      </div>

      {closable && (
        <DialButton
          className="ml-2 text-secondary hover:text-primary"
          aria-label="Close alert"
          iconBefore={<IconX size={16} />}
          onClick={onClose}
        />
      )}
    </div>
  );
};
