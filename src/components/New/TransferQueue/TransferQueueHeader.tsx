import { IconChevronDown, IconChevronUp, IconX } from '@tabler/icons-react';
import type { FC } from 'react';

import { GhostIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ElementSize } from '@/types/size';
import { STATUS_SLOT_CLASS } from './constants';
import type { TransferQueueLabels } from './TransferQueue';

interface TransferQueueHeaderProps {
  title: string;
  /** The badge renders only when this is positive. */
  failedCount: number;
  isCollapsed: boolean;
  /** Id of the rows container the collapse toggle controls. */
  itemsId: string;
  labels: TransferQueueLabels;
  onToggleCollapse: () => void;
  onClose: () => void;
}

/** Queue heading with its failed-item badge and the collapse and close controls. */
export const TransferQueueHeader: FC<TransferQueueHeaderProps> = ({
  title,
  failedCount,
  isCollapsed,
  itemsId,
  labels,
  onToggleCollapse,
  onClose,
}) => {
  const ChevronIcon = isCollapsed ? IconChevronUp : IconChevronDown;

  return (
    <div className="mx-4 flex items-center justify-between border-b border-tertiary py-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="dial-small-paragraph-semi-text truncate text-primary">
          {title}
        </span>
        {failedCount > 0 && (
          /*
           * On the filled --bg-control-error swatch, so it takes the on-control
           * token; --text-tertiary would contrast at under 2:1 over that fill.
           */
          <span className="dial-small-paragraph-semi-text inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-control-error px-1 text-control-permanent">
            {failedCount}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <GhostIconButton
          aria-label={
            isCollapsed ? labels.expandAriaLabel : labels.collapseAriaLabel
          }
          aria-expanded={!isCollapsed}
          aria-controls={itemsId}
          size={ElementSize.Small}
          icon={
            <ChevronIcon
              size={DIAL_ICON_SIZE.SM}
              stroke={DIAL_KIT_ICON_STROKE}
              className="text-secondary"
              aria-hidden
            />
          }
          onClick={onToggleCollapse}
          className={STATUS_SLOT_CLASS}
        />
        <GhostIconButton
          aria-label={labels.closeAriaLabel}
          size={ElementSize.Small}
          icon={
            <IconX
              size={DIAL_ICON_SIZE.SM}
              stroke={DIAL_KIT_ICON_STROKE}
              className="text-secondary"
              aria-hidden
            />
          }
          onClick={onClose}
          className={STATUS_SLOT_CLASS}
        />
      </div>
    </div>
  );
};
