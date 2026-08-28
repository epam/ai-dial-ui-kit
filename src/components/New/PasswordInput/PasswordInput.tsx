import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { type FC, useState } from 'react';

import { GhostIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { Input, type InputProps } from '@/components/New/Input/Input';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ElementSize } from '@/types/size';

export interface PasswordInputProps extends Omit<
  InputProps,
  'type' | 'iconAfter'
> {
  /** Accessible name of the reveal toggle while the value is masked. */
  showPasswordLabel?: string;
  /** Accessible name of the reveal toggle while the value is visible. */
  hidePasswordLabel?: string;
}

/**
 * A password field with a reveal toggle, built on {@link Input}.
 * aliases: SecureInput|ToggleablePassword
 * Design system 2.0
 *
 * The toggle is a real `<button>`, so it is reachable by keyboard and announces
 * both its purpose and its state. `type` and `iconAfter` are owned by this
 * component; every other {@link Input} prop is passed through.
 *
 * @example
 * ```tsx
 * <PasswordInput
 *   id="password"
 *   labelProps={{ label: 'Password', required: true }}
 *   value={password}
 *   onChange={setPassword}
 * />
 * ```
 *
 * @param [showPasswordLabel="Show password"] - Accessible name of the toggle while the value is masked
 * @param [hidePasswordLabel="Hide password"] - Accessible name of the toggle while the value is visible
 * @param [size=ElementSize.Standard] - Field height: standard is 40px, small is 24px
 * @param [disabled=false] - Disables the field and its reveal toggle
 */
export const PasswordInput: FC<PasswordInputProps> = ({
  showPasswordLabel = 'Show password',
  hidePasswordLabel = 'Hide password',
  disabled,
  size = ElementSize.Standard,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // A disabled field is never revealed: its toggle cannot be reached to mask the
  // value again, and `Input` exposes the value of a disabled non-password field
  // through a tooltip, which would leak the password.
  const isRevealed = isVisible && !disabled;

  return (
    <Input
      {...props}
      size={size}
      disabled={disabled}
      type={isRevealed ? 'text' : 'password'}
      iconAfter={
        <GhostIconButton
          size={ElementSize.Small}
          disabled={disabled}
          aria-label={isRevealed ? hidePasswordLabel : showPasswordLabel}
          aria-pressed={isRevealed}
          icon={
            isRevealed ? (
              <IconEyeOff
                size={DIAL_ICON_SIZE.SM}
                stroke={DIAL_KIT_ICON_STROKE}
                aria-hidden="true"
              />
            ) : (
              <IconEye
                size={DIAL_ICON_SIZE.SM}
                stroke={DIAL_KIT_ICON_STROKE}
                aria-hidden="true"
              />
            )
          }
          onClick={() => setIsVisible((prev) => !prev)}
        />
      }
    />
  );
};
