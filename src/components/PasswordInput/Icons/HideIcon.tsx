import type { FC } from 'react';
import { IconEyeOff } from '@tabler/icons-react';

import { BASE_ICON_PROPS } from '@/constants/icon';

interface Props {
  onClick: () => void;
}
/**
 * An icon button component for hiding password input (eye-off icon).
 *
 * @example
 * ```tsx
 * <DialHideIcon onClick={() => setShowPassword(false)} />
 * ```
 *
 * @param onClick - Callback function called when the icon is clicked
 */
export const DialHideIcon: FC<Props> = ({ onClick }) => {
  return (
    <IconEyeOff
      {...BASE_ICON_PROPS}
      className="text-primary"
      onClick={onClick}
      role="button"
      aria-label="hide"
    />
  );
};
