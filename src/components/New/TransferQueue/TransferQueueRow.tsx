import {
  IconAlertCircleFilled,
  IconAlertTriangleFilled,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import type { FC } from 'react';

import { EllipsisTooltip } from '@/components/New/EllipsisTooltip/EllipsisTooltip';
import { FileIcon } from '@/components/New/FileIcon/FileIcon';
import { GhostIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { Tooltip } from '@/components/New/Tooltip/Tooltip';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { Spinner } from '@/components/Spinner/Spinner';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { DialItemType } from '@/types/item';
import { ElementSize } from '@/types/size';
import { TransferQueueItemStatus } from '@/types/transfer-queue';
import { mergeClasses } from '@/utils/merge-classes';
import { STATUS_SLOT_CLASS } from './constants';
import type { TransferQueueItem, TransferQueueLabels } from './TransferQueue';

interface TransferQueueRowProps {
  item: TransferQueueItem;
  labels: TransferQueueLabels;
  onCancel?: (id: string) => void;
}

interface StatusIconProps {
  message: string;
  isError: boolean;
}

/*
 * The reason is the icon's accessible name, not only its tooltip: a tooltip
 * renders nothing on a touch screen, so relying on it alone would leave the
 * outcome unexplained there. Focusable for the same reason.
 */
const StatusIcon: FC<StatusIconProps> = ({ message, isError }) => {
  const Icon = isError ? IconAlertCircleFilled : IconAlertTriangleFilled;

  return (
    <Tooltip tooltip={message} asChild>
      <span
        className={STATUS_SLOT_CLASS}
        role="img"
        aria-label={message}
        tabIndex={0}
      >
        <Icon
          size={DIAL_ICON_SIZE.SM}
          className={isError ? 'text-error' : 'text-warning-icon'}
          aria-hidden
        />
      </span>
    </Tooltip>
  );
};

/** One queue row: the file's icon and name, plus a trailing status slot. */
export const TransferQueueRow: FC<TransferQueueRowProps> = ({
  item,
  labels,
  onCancel,
}) => {
  const isCanceled = item.status === TransferQueueItemStatus.Canceled;

  return (
    <div className="group flex items-center gap-2 px-4 py-2">
      <FileIcon
        type={DialItemType.File}
        name={item.name}
        size={DIAL_ICON_SIZE.MD}
        className={mergeClasses(isCanceled && 'opacity-50')}
        decorative
      />
      <EllipsisTooltip
        text={item.name}
        className={mergeClasses(
          'dial-small-text',
          isCanceled ? 'text-secondary' : 'text-primary',
        )}
      />
      {item.status === TransferQueueItemStatus.InProgress && (
        <div className={mergeClasses(STATUS_SLOT_CLASS, 'grid')}>
          {/*
           * The spinner fades out under hover/focus so the cancel control can
           * show in the same cell. It must not take pointer events: its own
           * stacking context paints it over the button, which would otherwise
           * never receive a click.
           */}
          <Spinner
            size={DIAL_ICON_SIZE.SM}
            ariaLabel={labels.itemProgressAriaLabel(item.name)}
            className={mergeClasses(
              'pointer-events-none col-start-1 row-start-1 transition-opacity',
              onCancel && 'group-focus-within:opacity-0 group-hover:opacity-0',
            )}
          />
          {onCancel && (
            <GhostIconButton
              aria-label={labels.cancelItemAriaLabel(item.name)}
              size={ElementSize.Small}
              icon={
                <IconX
                  size={DIAL_ICON_SIZE.SM}
                  stroke={DIAL_KIT_ICON_STROKE}
                  className="text-secondary"
                  aria-hidden
                />
              }
              onClick={() => onCancel(item.id)}
              className="col-start-1 row-start-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
            />
          )}
        </div>
      )}
      {item.status === TransferQueueItemStatus.Success && (
        <span
          className={STATUS_SLOT_CLASS}
          role="img"
          aria-label={labels.successLabel}
        >
          <IconCheck
            size={DIAL_ICON_SIZE.SM}
            stroke={DIAL_KIT_ICON_STROKE}
            className="text-accent"
            aria-hidden
          />
        </span>
      )}
      {item.status === TransferQueueItemStatus.Warning && (
        <StatusIcon
          message={item.message || labels.warningMessage}
          isError={false}
        />
      )}
      {item.status === TransferQueueItemStatus.Failed && (
        <StatusIcon message={item.message || labels.failedMessage} isError />
      )}
      {isCanceled && (
        <span className="dial-small-text shrink-0 text-secondary">
          {labels.canceledLabel}
        </span>
      )}
    </div>
  );
};
