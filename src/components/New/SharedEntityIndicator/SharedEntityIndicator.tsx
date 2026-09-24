import { IconArrowUpRight } from '@tabler/icons-react';
import type { FC, ReactNode } from 'react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { Tooltip } from '@/components/New/Tooltip/Tooltip';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { mergeClasses } from '@/utils/merge-classes';

/** Props for `SharedEntityIndicator`. */
export interface SharedEntityIndicatorProps {
  /** Accessible name of the badge. */
  label?: string;
  /** Tooltip shown while the badge is hovered. */
  tooltip?: ReactNode;
  /** Arrow size in px. */
  size?: number;
  /** Additional CSS classes for the badge, e.g. to position it over an icon. */
  className?: string;
}

/**
 * A small arrow badge marking an entity as shared.
 * aliases: SharedIcon|AccessIndicator
 * Design system 2.0
 *
 * A `role="img"` named by `label`, so it can stand on its own. Placed inside a
 * larger `role="img"` — as `FileIcon` does — its name is folded into the
 * parent's, which is why `FileIcon` names the shared state itself. The tooltip
 * is a pointer-only hint: the badge is not focusable, and the tooltip never
 * reaches assistive technology, so `label` is what carries the meaning.
 *
 * @example
 * ```tsx
 * <SharedEntityIndicator />
 * <SharedEntityIndicator tooltip="Shared with 3 people" className="absolute -bottom-0.5 -left-0.5" />
 * ```
 *
 * @param [label='Shared'] - Accessible name of the badge
 * @param [tooltip='Shared'] - Tooltip shown while the badge is hovered
 * @param [size=12] - Arrow size in px
 * @param [className] - Additional CSS classes for the badge
 */
export const SharedEntityIndicator: FC<SharedEntityIndicatorProps> = ({
  label = 'Shared',
  tooltip,
  size = 12,
  className,
}) => (
  <Tooltip tooltip={tooltip || 'Shared'} asChild>
    <span
      role="img"
      aria-label={label}
      className={mergeClasses(
        'flex shrink-0 rounded-sm bg-layer-raised text-accent',
        className,
        DIAL_KIT_CLASS.sharedEntityIndicator,
      )}
    >
      <IconArrowUpRight
        size={size}
        stroke={DIAL_KIT_ICON_STROKE}
        aria-hidden="true"
      />
    </span>
  </Tooltip>
);
