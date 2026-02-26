import type { FC, ReactNode } from 'react';

import { DialIconButton } from '@/components/IconButton/IconButton';
import { ElementSize } from '@/types/size';
import classNames from 'classnames';
import { inputButtonClassName } from './constants';

export interface DialInputButtonProps {
  icon: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  size?: ElementSize;
}
/**
 * An Input button component with a customizable icon and accessible label.
 *
 * @example
 * ```tsx
 * <DialInputButton
 *   icon={<IconInfoCircle size={16} />}
 * />
 * ```
 *
 * @param [icon] - Icon to display inside the input button
 * @param [onClick] - Click handler for the info button
 * @param [disabled] - Whether the button is disabled
 * @param [size] - Size of the input button, which adjusts the icon size and padding. Uses the {@link ElementSize} enum.
 */
export const DialInputButton: FC<DialInputButtonProps> = ({
  icon,
  onClick,
  disabled,
  size = ElementSize.Standard,
}) => {
  return (
    <div
      className={classNames(
        'border-l border-tertiary',
        size === ElementSize.Standard
          ? 'h-[40px] w-[44px]'
          : 'h-[22px] w-[32px]',
      )}
    >
      <DialIconButton
        className={inputButtonClassName}
        icon={icon}
        onClick={onClick}
        disabled={disabled}
      />
    </div>
  );
};
