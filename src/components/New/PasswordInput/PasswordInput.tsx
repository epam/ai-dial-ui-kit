import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { type FC, useEffect, useState } from 'react';

import { GhostIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { Input, type InputProps } from '@/components/New/Input/Input';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ElementSize } from '@/types/size';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { mergeClasses } from '@/utils/merge-classes';

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
 * A disabled field is masked with no toggle at all, and comes back masked if it
 * is enabled again.
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
 * @param [disabled=false] - Disables the field, masks it, and hides the reveal toggle
 */
export const PasswordInput: FC<PasswordInputProps> = ({
  showPasswordLabel = 'Show password',
  hidePasswordLabel = 'Hide password',
  disabled,
  size = ElementSize.Standard,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  /*
   * A disabled field is never revealed, and draws no toggle at all: there is
   * nothing a control in that state could do, and the design draws a masked
   * field with no trailing button. (`Input` also exposes the value of a
   * disabled non-password field through a tooltip, which is why `type` stays
   * `password` here rather than only the toggle going away.)
   */
  const isRevealed = isVisible && !disabled;

  /*
   * Masking is also reset while disabled, so a field that is disabled and then
   * enabled again — a form that locks its inputs during a request, say — comes
   * back masked instead of silently restoring a reveal the user asked for
   * before, with no toggle on screen to tell them it is still on.
   */
  useEffect(() => {
    if (disabled) setIsVisible(false);
  }, [disabled]);

  return (
    <Input
      {...props}
      wrapperClassName={mergeClasses(
        props.wrapperClassName,
        DIAL_KIT_CLASS.passwordInput,
      )}
      size={size}
      disabled={disabled}
      type={isRevealed ? 'text' : 'password'}
      iconAfter={
        disabled ? undefined : (
          <GhostIconButton
            size={ElementSize.Small}
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
        )
      }
    />
  );
};
