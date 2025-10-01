import { IconX } from '@tabler/icons-react';
import classNames from 'classnames';
import type { FC, ReactNode, MouseEvent } from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { DialButton } from '@/components/Button/Button';
import { AlertVariant } from '@/types/alert';
import {
  alertBaseClasses,
  alertVariantClassMap,
  variantIcons,
} from './constants';

export interface DialAlertProps {
  variant?: AlertVariant;
  message: string | ReactNode;
  cssClass?: string;
  /** Whether the close button should be shown. @default false */
  closable?: boolean;
  /** Stretch to full width of container. @default true */
  fullWidth?: boolean;
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
 *   fullWidth={false}
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
 * @param [cssClass] - Additional CSS classes applied to the alert container
 * @param [closable=false] - Whether the alert has a close button
 * @param [fullWidth=true] - Stretch to full width of container
 * @param [onClose] - Callback fired when the close button is clicked
 */
export const DialAlert: FC<DialAlertProps> = ({
  variant = AlertVariant.Info,
  message,
  cssClass,
  closable = false,
  fullWidth = true,
  onClose,
}) => {
  const widthClasses = fullWidth
    ? 'flex w-full'
    : 'inline-flex w-auto self-start';

  return (
    <div
      role="alert"
      className={classNames(
        widthClasses,
        alertBaseClasses,
        alertVariantClassMap[variant],
        cssClass,
      )}
    >
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
