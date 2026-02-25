import { IconInfoCircle } from '@tabler/icons-react';
import type { FC } from 'react';

import { DialIconButton } from '@/components/IconButton/IconButton';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { infoButtonClassName } from './constants';

export interface DialInfoButtonProps {
  caption?: string;
  onClick?: () => void;
}
/**
 * An Info button component with a customizable icon and accessible label.
 *
 * @example
 * ```tsx
 * <DialInfoButton
 *   caption="Info"
 * />
 * ```
 *
 * @param [caption] - Text to display inside the info button
 * @param [onClick] - Click handler for the info button
 */
export const DialInfoButton: FC<DialInfoButtonProps> = ({
  caption,
  onClick,
}) => {
  if (!caption) return null;

  const button = (
    <DialIconButton
      aria-label={caption}
      className={infoButtonClassName}
      icon={<IconInfoCircle size={16} />}
      onClick={onClick}
    />
  );
  return caption ? (
    <DialTooltip tooltip={caption} triggerClassName="flex">
      {button}
    </DialTooltip>
  ) : (
    button
  );
};
