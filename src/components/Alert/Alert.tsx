import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
import classNames from 'classnames';
import type { FC, ReactNode, MouseEvent } from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { DialButton } from '@/components/Button/Button';

export type AlertVariant = 'info' | 'error' | 'warning' | 'success';

export interface DialAlertProps {
  /**
   * Defines the visual style and icon of the alert.
   *
   * - `info` – Informational message (default)
   * - `error` – Error or critical message
   * - `warning` – Warning or caution message
   * - `success` – Success or confirmation message
   */
  variant?: AlertVariant;

  /**
   * Message text displayed inside the alert.
   */
  message: string | ReactNode;

  /**
   * Additional CSS classes applied to the root element.
   */
  cssClass?: string;

  /**
   * Whether the close button should be shown.
   * @default true
   */
  closable?: boolean;

  /**
   * Callback fired when the close button is clicked.
   */
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const variantIcons: Record<AlertVariant, ReactNode> = {
  info: <IconInfoCircle size={24} data-testid="icon-info" />,
  error: <IconAlertCircle size={24} data-testid="icon-error" />,
  warning: <IconAlertTriangle size={24} data-testid="icon-warning" />,
  success: <IconCircleCheck size={24} data-testid="icon-success" />,
};

const variantClassMap: Record<AlertVariant, string> = {
  info: 'dial-base-alert bg-info border-info text-info',
  success: 'dial-base-alert bg-success border-success text-success',
  warning: 'dial-base-alert bg-warning border-warning text-warning',
  error: 'dial-base-alert bg-error border-error text-error',
};

/**
 * A contextual feedback component for displaying important messages.
 *
 * Renders a colored container with an icon, message text, and an optional
 * close button.
 *
 * @example
 * ```tsx
 * <DialAlert
 *   variant="info"
 *   message="This is an info alert."
 * />
 *
 * <DialAlert
 *   variant="success"
 *   message="Changes saved successfully."
 *   onClose={(e) => console.log('closed', e)}
 * />
 *
 * <DialAlert
 *   variant="error"
 *   closable={false}
 *   message="Something went wrong."
 * />
 * ```
 *
 * @param [variant='info'] - Defines the visual style and icon of the alert
 * @param message - Message text to display inside the alert
 * @param [cssClass] - Additional CSS classes applied to the alert container
 * @param [closable=true] - Whether the alert has a close button
 * @param [onClose] - Callback fired when the close button is clicked
 */
export const DialAlert: FC<DialAlertProps> = ({
  variant = 'info',
  message,
  cssClass,
  closable = true,
  onClose,
}) => {
  return (
    <div
      role="alert"
      className={classNames(variantClassMap[variant], cssClass)}
    >
      <div className="flex items-center gap-2">
        <DialIcon icon={variantIcons[variant]} />
        <div className="dial-alert-message">{message}</div>
      </div>

      {closable && (
        <DialButton
          cssClass="dial-alert-close"
          ariaLabel="Close alert"
          iconBefore={<IconX size={16} />}
          onClick={(e) => onClose?.(e)}
        />
      )}
    </div>
  );
};
