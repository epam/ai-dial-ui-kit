import { IconInfoCircle } from '@tabler/icons-react';
import type { FC } from 'react';

import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { IconButton } from '../IconButton/IconButton';
import { mergeClasses } from '../../../utils/merge-classes';

export interface InfoButtonProps {
  caption?: string;
  onClick?: () => void;
}
/**
 * An Info button component with a customizable icon and accessible label.
 *
 * @example
 * ```tsx
 * <InfoButton
 *   caption="Info"
 * />
 * ```
 *
 * @param [caption] - Text to display inside the info button
 * @param [onClick] - Click handler for the info button
 */
export const InfoButton: FC<InfoButtonProps> = ({ caption, onClick }) => {
  if (!caption) return null;
  const infoButtonClassName = mergeClasses(
    'size-[20px] flex items-center justify-center text-secondary hover:text-control-blue-hover active:text-control-blue-active',
    'focus-visible:outline focus-visible:outline-focus-black',
  );
  const button = (
    <IconButton
      aria-label={caption}
      className={infoButtonClassName}
      icon={<IconInfoCircle size={DIAL_ICON_SIZE.SM} />}
      onClick={onClick}
    />
  );
  return caption ? (
    <DialTooltip
      tooltip={caption}
      triggerClassName="flex justify-center items-center"
    >
      {button}
    </DialTooltip>
  ) : (
    button
  );
};
