import type { FC, ReactNode } from 'react';

import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';
import { IconButton } from '../../IconButton/IconButton';
import { inputButtonClassName } from './constants';

export interface InputButtonProps {
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
 * <InputButton
 *   icon={<IconInfoCircle size={16} />}
 * />
 * ```
 *
 * @param [icon] - Icon to display inside the input button
 * @param [onClick] - Click handler for the info button
 * @param [disabled] - Whether the button is disabled
 * @param [size] - Size of the input button, which adjusts the icon size and padding. Uses the {@link ElementSize} enum.
 */
export const InputButton: FC<InputButtonProps> = ({
  icon,
  onClick,
  disabled,
  size = ElementSize.Standard,
  className,
}) => {
  return (
    <div
      className={mergeClasses(
        'border-l border-tertiary',
        size === ElementSize.Standard ? 'size-[40px]' : 'size-[24px]',
      )}
    >
      <IconButton
        className={mergeClasses(
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
