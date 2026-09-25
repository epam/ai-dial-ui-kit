import type { TransferQueueLabels } from './TransferQueue';

/** Delay before a queue whose items have all succeeded closes itself. */
export const TRANSFER_QUEUE_AUTO_CLOSE_DELAY_MS = 8000;

/* Fixed footprint for every trailing status slot so switching between statuses never shifts layout. */
export const STATUS_SLOT_CLASS =
  'flex size-7 shrink-0 items-center justify-center';

/** English defaults for every `TransferQueue` string; a host passes translations through `labels`. */
export const DEFAULT_TRANSFER_QUEUE_LABELS: TransferQueueLabels = {
  cancelItemAriaLabel: (name) => `Cancel "${name}"`,
  itemProgressAriaLabel: (name) => `"${name}" in progress`,
  successLabel: 'Completed',
  canceledLabel: 'Canceled',
  failedMessage: 'Failed',
  warningMessage: 'Completed with warnings',
  queueProgressAriaLabel: 'Progress',
  queueProgressValueText: (completed, total) => `${completed} of ${total}`,
  collapseAriaLabel: 'Collapse',
  expandAriaLabel: 'Expand',
  closeAriaLabel: 'Close',
  closeConfirmHeader: 'Close?',
  closeConfirmDescriptionInProgress: 'Some items are still in progress.',
  closeConfirmDescriptionFailed: 'Some items have failed.',
  closeConfirmDescriptionMixed:
    'Some items are still in progress, and some have failed.',
  closeConfirmLabel: 'Close',
  closeCancelLabel: 'Cancel',
};
