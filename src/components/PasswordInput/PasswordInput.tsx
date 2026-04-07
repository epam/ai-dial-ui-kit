import { type FC, useCallback, useState } from 'react';

import { DialHideIcon } from './Icons/HideIcon';
import { DialShowIcon } from './Icons/ShowIcon';
import { DialInput, type DialInputProps } from '@/components/Input/Input';

/**
 * A password input component with show/hide functionality and customizable props.
 * aliases: SecureInput|ToggleablePassword
 *
 * @example
 * ```tsx
 * <DialPasswordInput
 *   id="password"
 *   label="Password"
 *   value={password}
 *   onChange={e => setPassword(e.target.value)}
 *   disabled={false}
 * />
 * ```
 *
 * @param id - Unique identifier for the input element
 * @param [label] - The label text for the field
 * @param [value] - The current value of the input
 * @param [onChange] - Callback function called when the input value changes
 * @param [disabled=false] - Whether the input is disabled
 * @param [iconAfterInput] - Custom icon to display after the input (overridden by show/hide icons)
 */
export const DialPasswordInput: FC<DialInputProps> = ({ ...props }) => {
  const [showValue, setShowValue] = useState(false);

  const onChangeShowValue = useCallback((v: boolean) => {
    setShowValue(v);
  }, []);

  return (
    <DialInput
      type={showValue ? 'text' : 'password'}
      {...props}
      iconAfter={
        props.disabled ? null : showValue ? (
          <DialHideIcon onClick={() => onChangeShowValue(false)} />
        ) : (
          <DialShowIcon onClick={() => onChangeShowValue(true)} />
        )
      }
    />
  );
};
