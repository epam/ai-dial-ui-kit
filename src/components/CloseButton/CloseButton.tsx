import { IconX } from '@tabler/icons-react';
import classNames from 'classnames';
import type { FC, MouseEvent } from 'react';
import { DialButton } from '@/components/Button/Button';

export interface DialCloseButtonProps {
  ariaLabel?: string;
  cssClass?: string;
  size?: number;
  onClose: (e: MouseEvent<HTMLButtonElement>) => void;
}
/**
 * A Close button component with a customizable icon and accessible label.
 *
 * @example
 * ```tsx
 * <DialCloseButton
 *   ariaLabel="Close dialog"
 *   onClose={handleClose}
 *   cssClass="custom-close"
 *   size={32}
 * />
 * ```
 *
 * @param [ariaLabel] - Accessible label for screen readers
 * @param [cssClass] - Additional CSS classes to apply to the button
 * @param [size=24] - Size of the close icon
 * @param onClose - Click event handler for the close button
 */
export const DialCloseButton: FC<DialCloseButtonProps> = ({
  ariaLabel,
  cssClass,
  size = 24,
  onClose,
}) => {
  const buttonClass = 'text-secondary hover:text-accent-primary';

  return (
    <DialButton
      ariaLabel={ariaLabel}
      cssClass={classNames(buttonClass, cssClass)}
      onClick={onClose}
      iconBefore={<IconX size={size} />}
    ></DialButton>
  );
};
