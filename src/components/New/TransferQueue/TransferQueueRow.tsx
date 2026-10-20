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

/* A 16px ring drawn with the spinner's tokens: secondary track, accent arc. */
const RING_STROKE_WIDTH = 2;
const RING_RADIUS = (DIAL_ICON_SIZE.SM - RING_STROKE_WIDTH) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface ProgressRingProps {
  percent: number;
  label: string;
  className?: string;
}

/*
 * Determinate counterpart of the row spinner, for an item whose `percent` is
 * known. The arc starts at the top and grows clockwise; a full circle has no
 * inherent direction, so it is not mirrored under `dir="rtl"`.
 */
const ProgressRing: FC<ProgressRingProps> = ({ percent, label, className }) => {
  const value = Math.min(100, Math.max(0, Math.round(percent)));
  const center = DIAL_ICON_SIZE.SM / 2;

  return (
    <span
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={mergeClasses('flex', className)}
    >
      <svg
        width={DIAL_ICON_SIZE.SM}
        height={DIAL_ICON_SIZE.SM}
        viewBox={`0 0 ${DIAL_ICON_SIZE.SM} ${DIAL_ICON_SIZE.SM}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={center}
          cy={center}
          r={RING_RADIUS}
          fill="none"
          strokeWidth={RING_STROKE_WIDTH}
          className="stroke-(--stroke-secondary,#d1dbea)"
        />
        <circle
          cx={center}
          cy={center}
          r={RING_RADIUS}
          fill="none"
          strokeWidth={RING_STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE * (1 - value / 100)}
          className="stroke-(--stroke-accent,#1d4ed8) transition-[stroke-dashoffset] duration-200 motion-reduce:transition-none"
        />
      </svg>
    </span>
  );
};

/** One queue row: the file's icon and name, plus a trailing status slot. */
export const TransferQueueRow: FC<TransferQueueRowProps> = ({
  item,
  labels,
  onCancel,
}) => {
  const isCanceled = item.status === TransferQueueItemStatus.Canceled;
  /*
   * The progress indicator fades out under hover/focus so the cancel control
   * can show in the same cell, and takes no pointer events, since its own
   * stacking context would otherwise paint it over the button.
   */
  const progressClassName = mergeClasses(
    'pointer-events-none col-start-1 row-start-1 transition-opacity',
    onCancel && 'group-focus-within:opacity-0 group-hover:opacity-0',
  );

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
          {typeof item.percent === 'number' ? (
            <ProgressRing
              percent={item.percent}
              label={labels.itemProgressAriaLabel(item.name)}
              className={progressClassName}
            />
          ) : (
            <Spinner
              size={DIAL_ICON_SIZE.SM}
              ariaLabel={labels.itemProgressAriaLabel(item.name)}
              className={progressClassName}
            />
          )}
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
