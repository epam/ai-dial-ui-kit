import { IconX } from '@tabler/icons-react';
import type { FC, MouseEvent } from 'react';

import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ElementSize } from '@/types/size';
import { GhostIconButton } from '../IconButton/IconButtonWrappers';

export interface CloseButtonProps {
  ariaLabel?: string;
  className?: string;
  size?: ElementSize;
  onClose: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

/**
 * A close button: a ghost {@link IconButton} carrying an X icon.
 * aliases: DismissButton|ExitButton
 *
 * Sized through {@link ElementSize} like every other 2.0 control. It defaults to
 * the small 24px box that headers and toasts want; pass `ElementSize.Standard`
 * where the control stands alone, since only that variant carries the 44×44
 * pointer target. Name it after the thing it closes ("Close dialog", "Close
 * notification") — the default `"Close"` only keeps the control from being unnamed.
 *
 * @example
 * ```tsx
 * <CloseButton ariaLabel="Close notification" onClose={handleClose} />
 * <CloseButton ariaLabel="Close dialog" size={ElementSize.Standard} onClose={handleClose} />
 * ```
 *
 * @param [ariaLabel="Close"] - Accessible name of the button
 * @param [className] - Additional CSS classes to apply to the button
 * @param [size=ElementSize.Small] - Button size: small is 24px, standard is 40px
 * @param onClose - Click event handler for the close button
 * @param [disabled] - Whether the button is disabled
 */
export const CloseButton: FC<CloseButtonProps> = ({
  ariaLabel = 'Close',
  className,
  size = ElementSize.Small,
  onClose,
  ...props
}) => {
  return (
    <GhostIconButton
      {...props}
      size={size}
      aria-label={ariaLabel}
      className={className}
      onClick={onClose}
      icon={
        <IconX
          size={
            size === ElementSize.Small ? DIAL_ICON_SIZE.SM : DIAL_ICON_SIZE.MD
          }
          aria-hidden="true"
        />
      }
    />
  );
};
