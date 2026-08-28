import { IconInfoCircle } from '@tabler/icons-react';
import type { FC } from 'react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';
import { IconButton } from '../IconButton/IconButton';

export interface InfoButtonProps {
  caption?: string;
  onClick?: () => void;
  'aria-label'?: string;
}
/**
 * An Info button component with a customizable icon and accessible label.
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <InfoButton
 *   caption="Info"
 * />
 * ```
 *
 * The button is icon-only, so it needs an accessible name. `caption` is used as
 * the name because a tooltip alone never reaches assistive tech — pass a short
 * `aria-label` when the caption is a long sentence.
 *
 * @param [caption] - Text shown in the tooltip, and the fallback accessible name
 * @param [onClick] - Click handler for the info button
 * @param [aria-label] - Accessible name; takes precedence over `caption`
 */
export const InfoButton: FC<InfoButtonProps> = ({
  caption,
  onClick,
  'aria-label': ariaLabel,
}) => {
  if (!caption) return null;

  const infoButtonClassName = mergeClasses(
    'text-secondary hover:text-control-accent-hover active:text-control-accent-active',
    'focus-visible:outline focus-visible:outline-focus',
  );

  return (
    <IconButton
      aria-label={ariaLabel}
      className={infoButtonClassName}
      icon={
        <IconInfoCircle
          size={DIAL_ICON_SIZE.SM}
          stroke={DIAL_KIT_ICON_STROKE}
          aria-hidden="true"
        />
      }
      onClick={onClick}
      size={ElementSize.Small}
      tooltipProps={{ tooltip: caption }}
    />
  );
};
