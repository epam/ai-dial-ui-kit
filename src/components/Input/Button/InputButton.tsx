import type { FC, ReactNode } from 'react';

import { DialIconButton } from '../../IconButton/IconButton';
import { inputButtonClassName } from './constants';

export interface DialInputButtonProps {
  icon: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
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
 */
export const DialInputButton: FC<DialInputButtonProps> = ({
  icon,
  onClick,
  disabled,
}) => {
  return (
    <div className="border-l border-tertiary h-[40px]">
      <DialIconButton
        className={inputButtonClassName}
        icon={icon}
        onClick={onClick}
        disabled={disabled}
      />
    </div>
  );
};
