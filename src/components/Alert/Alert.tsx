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

const variantStyles: Record<AlertVariant, string> = {
  info: 'bg-info border-info text-info',
  error: 'bg-error border-error text-error',
  warning: 'bg-warning border-warning text-warning',
  success: 'bg-success border-success text-success',
};

const variantIcons: Record<AlertVariant, ReactNode> = {
  info: <IconInfoCircle size={24} />,
  error: <IconAlertCircle size={24} />,
  warning: <IconAlertTriangle size={24} />,
  success: <IconCircleCheck size={24} />,
};

/**
 * A contextual feedback component for displaying important messages.
 *
 * Renders a colored container with an icon, message text, and an optional
 * close button. Variants are styled with your Tailwind theme tokens.
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
 */
export const DialAlert: FC<DialAlertProps> = ({
  variant = 'info',
  message,
  cssClass,
  closable = true,
  onClose,
}) => {
  const rootClass = classNames(
    'inline-flex w-auto items-center justify-between rounded border px-3 py-2 text-sm shadow',
    variantStyles[variant],
    cssClass,
  );

  return (
    <div role="alert" className={rootClass}>
      <div className="flex items-center gap-2">
        <DialIcon icon={variantIcons[variant]} />
        <div className="text-primary">{message}</div>
      </div>

      {closable && (
        <DialButton
          cssClass="ml-2 text-secondary hover:text-primary"
          ariaLabel="Close alert"
          iconBefore={<IconX size={16} />}
          onClick={(e) => onClose?.(e)}
        />
      )}
    </div>
  );
};
