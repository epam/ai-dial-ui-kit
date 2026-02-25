import { type FC } from 'react';

import { IconExclamationCircle } from '@tabler/icons-react';
import classNames from 'classnames';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { DialInput, type DialInputProps } from '@/components/Input/Input';

interface DialFilledInputProps extends DialInputProps {
  errorText?: string;
  onClick?: () => void;
}

/**
 * A styled input component that wraps `DialInput` and provides built-in
 * error handling and icon display.
 *
 * - Displays an error icon (`IconExclamationCircle`) when the input is invalid.
 * - Supports an optional `errorText` tooltip shown on hover when invalid.
 *
 * @example
 * <DialFilledInput
 *   value={username}
 *   onChange={handleChange}
 *   invalid={!username}
 *   errorText="Username is required"
 *   iconBefore={<UserIcon />}
 * />
 *
 * @component
 * @param {DialFilledInputProps} props - The properties for the filled input component.
 * @param {string} [props.errorText] - Optional text to display in a tooltip when the input is invalid.
 * @param {() => void} [props.onClick] - Optional click handler for the input container.
 * @returns {JSX.Element} The rendered filled input component.
 */
export const DialFilledInput: FC<DialFilledInputProps> = ({
  iconBefore,
  className,
  errorText,
  ...props
}) => {
  const isInvalid = props.invalid;

  const getIcon = () => (
    <div className="mr-2">
      {isInvalid ? (
        <IconExclamationCircle {...BASE_ICON_PROPS} className="text-error" />
      ) : (
        iconBefore
      )}
    </div>
  );

  return (
    <DialInput
      {...props}
      iconBefore={getIcon()}
      containerClassName="h-[40px] p-0"
      className={classNames(
        'rounded-r-none border-r-0',
        isInvalid && 'text-error',
        className,
      )}
    />
  );
};
