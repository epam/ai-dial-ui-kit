import { type FC, useCallback, useEffect, useId, useState } from 'react';

import { ConfirmationPopup } from '@/components/New/ConfirmationPopup/ConfirmationPopup';
import { ProgressBar } from '@/components/ProgressBar/ProgressBar';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { ConfirmationPopupVariant } from '@/types/confirmation-popup';
import { ElementSize } from '@/types/size';
import { TransferQueueItemStatus } from '@/types/transfer-queue';
import { mergeClasses } from '@/utils/merge-classes';
import {
  DEFAULT_TRANSFER_QUEUE_LABELS,
  TRANSFER_QUEUE_AUTO_CLOSE_DELAY_MS,
} from './constants';
import { TransferQueueHeader } from './TransferQueueHeader';
import { TransferQueueRow } from './TransferQueueRow';

/** One file (or other named unit of work) tracked by a `TransferQueue`. */
export interface TransferQueueItem {
  /** Stable identifier, passed back to `onCancelItem`. */
  id: string;
  /** Name shown on the row; a file's extension also picks its `FileIcon` glyph. */
  name: string;
  /** Current lifecycle status. */
  status: TransferQueueItemStatus;
  /**
   * Completion as 0–100. Feeds only the aggregate bar shown while the queue
   * is collapsed; a settled item without one counts as 100, a running one as 0.
   */
  percent?: number;
  /**
   * Why a `Failed` or `Warning` item ended as it did. Shown as the status
   * icon's tooltip and used as its accessible name; falls back to
   * `labels.failedMessage` / `labels.warningMessage`.
   */
  message?: string;
}

/** Every user-visible string of `TransferQueue`. */
export interface TransferQueueLabels {
  /** Accessible name of an in-progress row's cancel control. */
  cancelItemAriaLabel: (name: string) => string;
  /** Accessible name of an in-progress row's spinner. */
  itemProgressAriaLabel: (name: string) => string;
  /** Accessible name of a succeeded row's check icon. */
  successLabel: string;
  /** Trailing text on a canceled row. */
  canceledLabel: string;
  /** Fallback reason for a failed item without its own `message`. */
  failedMessage: string;
  /** Fallback reason for a warned item without its own `message`. */
  warningMessage: string;
  /** Accessible name of the collapsed queue's aggregate progress bar. */
  queueProgressAriaLabel: string;
  /**
   * The aggregate bar's `aria-valuetext`. Given settled and total counts
   * rather than a percentage, because "3 of 10 files" reads better than "36%"
   * when the work is a list of files.
   */
  queueProgressValueText: (completed: number, total: number) => string;
  /** Accessible name of the collapse toggle while expanded. */
  collapseAriaLabel: string;
  /** Accessible name of the expand toggle while collapsed. */
  expandAriaLabel: string;
  /** Accessible name of the close control. */
  closeAriaLabel: string;
  /** Heading of the close-confirmation dialog. */
  closeConfirmHeader: string;
  /** Confirmation description when an item is in progress and none failed. */
  closeConfirmDescriptionInProgress: string;
  /** Confirmation description when an item failed and none is in progress. */
  closeConfirmDescriptionFailed: string;
  /** Confirmation description when items are both in progress and failed. */
  closeConfirmDescriptionMixed: string;
  /** Confirm button of the close-confirmation dialog. */
  closeConfirmLabel: string;
  /** Cancel button of the close-confirmation dialog. */
  closeCancelLabel: string;
}

/** Props for `TransferQueue`. */
export interface TransferQueueProps {
  /**
   * Heading, rendered verbatim. The host composes any count into it
   * (e.g. "Importing 5 files"); the component never pluralizes.
   */
  title: string;
  /** Items to show, in display order. The queue renders nothing when empty. */
  items: TransferQueueItem[];
  /**
   * Called when the queue should close — from the close control (after a
   * confirmation while work is in progress or a failure is unread), or by
   * itself once every item has succeeded.
   */
  onClose: () => void;
  /**
   * Called with an item's id when the user cancels it. The host aborts the
   * work and keeps the item in `items` with status `Canceled`. Without it,
   * in-progress rows show a spinner only.
   */
  onCancelItem?: (id: string) => void;
  /** Overrides for the English default strings. */
  labels?: Partial<TransferQueueLabels>;
  /**
   * Milliseconds after every item succeeded before `onClose` is called by
   * itself. Defaults to 8000; `0` or less disables it.
   */
  autoCloseDelay?: number;
  /** Additional CSS classes for the root panel. */
  className?: string;
  /** Additional CSS classes for the scrollable list of rows. */
  bodyClassName?: string;
}

/*
 * Mean completion across every item, settled ones included. Unweighted on
 * purpose: sizes are often unknown when the queue is built, and a weighted
 * value would jump backwards as they were discovered.
 */
const getAggregatePercent = (items: TransferQueueItem[]): number =>
  Math.round(
    items.reduce(
      (total, item) =>
        total +
        (item.percent ??
          (item.status === TransferQueueItemStatus.InProgress ? 0 : 100)),
      0,
    ) / items.length,
  );

const getCloseConfirmDescription = (
  hasInProgress: boolean,
  hasFailed: boolean,
  labels: TransferQueueLabels,
): string => {
  if (hasInProgress && hasFailed) {
    return labels.closeConfirmDescriptionMixed;
  }
  if (hasFailed) {
    return labels.closeConfirmDescriptionFailed;
  }
  return labels.closeConfirmDescriptionInProgress;
};

/**
 * A floating panel listing the files of an upload, download, import or export
 * with a live status per row.
 * aliases: UploadQueue|ImportQueue|ExportQueue|UploadProgress|ProgressToast
 * Design system 2.0
 *
 * Each row shows the file's `FileIcon` and name, and a trailing status: a
 * spinner (with a cancel control on hover or focus) while in progress, a check
 * on success, a warning or error icon whose reason is both its tooltip and its
 * accessible name, or "Canceled". The header carries the host's title, a count
 * of failed items, and collapse and close controls. Collapsed while work runs,
 * the rows are replaced by one aggregate `ProgressBar`.
 *
 * Closing while an item is in progress or has failed asks for confirmation
 * first. Once every item has succeeded the queue closes itself after
 * `autoCloseDelay`; a warned or canceled row keeps it open so it can be read.
 *
 * The root is a polite `role="status"` live region. Positioning is left to
 * the host — wrap it in a fixed container at the screen corner.
 *
 * @example
 * ```tsx
 * <TransferQueue
 *   title="Importing 2 files"
 *   items={[
 *     { id: '1', name: 'report.pdf', status: TransferQueueItemStatus.Success },
 *     { id: '2', name: 'data.csv', status: TransferQueueItemStatus.InProgress, percent: 40 },
 *   ]}
 *   onClose={handleClose}
 *   onCancelItem={handleCancel}
 * />
 * ```
 *
 * @param title - Heading, rendered verbatim
 * @param items - Items to show, in display order
 * @param onClose - Called when the queue should close
 * @param [onCancelItem] - Called with an item's id when the user cancels it
 * @param [labels] - Overrides for the English default strings
 * @param [autoCloseDelay=8000] - Delay before an all-succeeded queue closes itself; `0` disables
 * @param [className] - Additional CSS classes for the root panel
 * @param [bodyClassName] - Additional CSS classes for the list of rows
 */
export const TransferQueue: FC<TransferQueueProps> = ({
  title,
  items,
  onClose,
  onCancelItem,
  labels: labelOverrides,
  autoCloseDelay = TRANSFER_QUEUE_AUTO_CLOSE_DELAY_MS,
  className,
  bodyClassName,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const itemsId = useId();
  const labels = { ...DEFAULT_TRANSFER_QUEUE_LABELS, ...labelOverrides };

  const inProgressCount = items.filter(
    (item) => item.status === TransferQueueItemStatus.InProgress,
  ).length;
  const hasInProgress = inProgressCount > 0;
  const failedCount = items.filter(
    (item) => item.status === TransferQueueItemStatus.Failed,
  ).length;
  const hasFailed = failedCount > 0;
  const isEverySucceeded =
    items.length > 0 &&
    items.every((item) => item.status === TransferQueueItemStatus.Success);

  const handleClose = useCallback(() => {
    if (hasInProgress || hasFailed) {
      setIsConfirmOpen(true);
    } else {
      onClose();
    }
  }, [hasInProgress, hasFailed, onClose]);

  const handleConfirmClose = useCallback(() => {
    setIsConfirmOpen(false);
    onClose();
  }, [onClose]);

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((value) => !value);
  }, []);

  useEffect(() => {
    if (!isEverySucceeded || autoCloseDelay <= 0) return undefined;

    const timeoutId = setTimeout(onClose, autoCloseDelay);
    return () => clearTimeout(timeoutId);
  }, [isEverySucceeded, autoCloseDelay, onClose]);

  if (items.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={mergeClasses(
        'w-[370px] max-w-[calc(100vw-2rem)] rounded-xl bg-layer-raised shadow-md',
        className,
        DIAL_KIT_CLASS.transferQueue,
      )}
    >
      <TransferQueueHeader
        title={title}
        failedCount={failedCount}
        isCollapsed={isCollapsed}
        itemsId={itemsId}
        labels={labels}
        onToggleCollapse={handleToggleCollapse}
        onClose={handleClose}
      />
      {isCollapsed && hasInProgress && (
        /*
         * Only while collapsed: expanded, every running row already shows its
         * own spinner, so an aggregate bar would restate what is on screen.
         */
        <ProgressBar
          value={getAggregatePercent(items)}
          size={ElementSize.Small}
          aria-label={labels.queueProgressAriaLabel}
          aria-valuetext={labels.queueProgressValueText(
            items.length - inProgressCount,
            items.length,
          )}
        />
      )}
      {!isCollapsed && (
        <div
          id={itemsId}
          className={mergeClasses(
            'flex max-h-[40vh] flex-col overflow-y-auto py-1',
            bodyClassName,
          )}
        >
          {items.map((item) => (
            <TransferQueueRow
              key={item.id}
              item={item}
              labels={labels}
              onCancel={onCancelItem}
            />
          ))}
        </div>
      )}
      <ConfirmationPopup
        open={isConfirmOpen}
        header={labels.closeConfirmHeader}
        description={getCloseConfirmDescription(
          hasInProgress,
          hasFailed,
          labels,
        )}
        confirmLabel={labels.closeConfirmLabel}
        cancelLabel={labels.closeCancelLabel}
        variant={ConfirmationPopupVariant.Danger}
        onConfirm={handleConfirmClose}
        onClose={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};
