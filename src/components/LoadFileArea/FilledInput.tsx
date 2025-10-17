import { type FC } from 'react';

import { IconExclamationCircle } from '@tabler/icons-react';
import classNames from 'classnames';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { DialInput, type DialInputProps } from '@/components/Input/Input';

interface DialFilledInputProps extends DialInputProps {
  errorText?: string;
  onClick?: () => void;
}

export const DialFilledInput: FC<DialFilledInputProps> = ({
  iconBefore,
  cssClass,
  errorText,
  ...props
}) => {
  const isInvalid = props.invalid;

  const getIcon = () => (
    <div className="mr-2">
      {isInvalid ? <IconExclamationCircle {...BASE_ICON_PROPS} /> : iconBefore}
    </div>
  );

  return (
    <DialInput
      {...props}
      iconBefore={getIcon()}
      tooltipTriggerClassName="flex-1 min-w-0"
      cssClass={classNames(isInvalid ? 'text-error' : '', cssClass)}
      tooltipText={isInvalid && errorText ? errorText : undefined}
      hideBorder
    />
  );
};
