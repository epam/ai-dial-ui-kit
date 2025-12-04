import { IconX } from '@tabler/icons-react';
import type { FC, MouseEvent } from 'react';
import { DialButton } from '@/components/Button/Button';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialCloseButtonProps {
  ariaLabel?: string;
  className?: string;
  size?: number;
  onClose: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}
/**
 * A Close button component with a customizable icon and accessible label.
 *
 * @example
 * ```tsx
 * <DialCloseButton
 *   ariaLabel="Close dialog"
 *   onClose={handleClose}
 *   className="custom-close"
 *   size={32}
 * />
 * ```
 *
 * @param [ariaLabel] - Accessible label for screen readers
 * @param [className] - Additional CSS classes to apply to the button
 * @param [size=24] - Size of the close icon
 * @param onClose - Click event handler for the close button
 * @param [disabled] - Whether the button is disabled
 */
export const DialCloseButton: FC<DialCloseButtonProps> = ({
  ariaLabel,
  className,
  size = 24,
  onClose,
  ...props
}) => {
  const buttonClassName = 'text-secondary hover:enabled:text-accent-primary';

  return (
    <DialButton
      aria-label={ariaLabel}
      className={mergeClasses(buttonClassName, className)}
      onClick={onClose}
      iconBefore={<IconX size={size} />}
      {...props}
    />
  );
};
