import type { FC, ReactNode } from 'react';
import classNames from 'classnames';

import { DialIconButton } from '@/components/IconButton/IconButton';
import { ElementSize } from '@/types/size';
import { inputButtonClassName } from './constants';

export interface DialInputButtonProps {
  icon: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  size?: ElementSize;
  className?: string;
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
  className,
}) => {
  return (
    <div
      className={classNames(
        'border-l border-tertiary',
        size === ElementSize.Standard
          ? 'h-[40px] w-[44px]'
          : 'h-[24px] w-[32px]',
      )}
    >
      <DialIconButton
        className={classNames(
          inputButtonClassName,
          size === ElementSize.Small && 'p-1',
          className,
        )}
        icon={icon}
        onClick={onClick}
        disabled={disabled}
        size={size}
      />
    </div>
  );
};
