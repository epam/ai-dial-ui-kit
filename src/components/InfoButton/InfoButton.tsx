import { IconInfoCircle } from '@tabler/icons-react';
import type { FC } from 'react';

import { DialIconButton } from '@/components/IconButton/IconButton';
import { DialTooltip } from '@/components/Tooltip/Tooltip';

export interface DialInfoButtonProps {
  caption?: string;
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
 */
export const DialInfoButton: FC<DialInfoButtonProps> = ({ caption }) => {
  if (!caption) return null;

  return (
    <DialTooltip tooltip={caption} triggerClassName="flex">
      <DialIconButton
        aria-label={caption}
        className="w-auto h-auto text-secondary hover:text-controls-accent-primary-hover active:text-controls-accent-primary-active focus-within:border-focus"
        icon={<IconInfoCircle size={16} />}
      />
    </DialTooltip>
  );
};
