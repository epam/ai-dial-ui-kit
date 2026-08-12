import { IconX } from '@tabler/icons-react';
import type { FC, MouseEvent } from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { DialGhostIconButton } from '../IconButton/IconButtonWrappers';

export interface DialCloseButtonProps {
  ariaLabel?: string;
  className?: string;
  size?: number;
  onClose: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}
/**
 * A Close button component with a customizable icon and accessible label.
 * aliases: DismissButton|ExitButton
 * Design system 1.0
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
  return (
    <DialGhostIconButton
      aria-label={ariaLabel}
      className={mergeClasses(
        className,
        'w-auto h-auto', // Exception: DialCloseButton does not require a static size
      )}
      onClick={onClose}
      icon={<IconX size={size} />}
      {...props}
    />
  );
};
