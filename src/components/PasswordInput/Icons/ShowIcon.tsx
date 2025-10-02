import { IconEye } from '@tabler/icons-react';
import type { FC } from 'react';

import { BASE_ICON_PROPS } from '@/constants/icon';

interface Props {
  onClick: () => void;
}
/**
 * An icon button component for showing password input (eye icon).
 *
 * @example
 * ```tsx
 * <DialShowIcon onClick={() => setShowPassword(true)} />
 * ```
 *
 * @param onClick - Callback function called when the icon is clicked
 */
export const DialShowIcon: FC<Props> = ({ onClick }) => {
  return (
    <IconEye {...BASE_ICON_PROPS} className="text-primary" onClick={onClick} />
  );
};
