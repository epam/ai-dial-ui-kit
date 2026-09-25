/** Lifecycle status of one item in a `TransferQueue`. */
export enum TransferQueueItemStatus {
  /** Queued or running; the row shows a spinner and, when cancelable, a cancel control. */
  InProgress = 'inProgress',
  Success = 'success',
  /** Delivered, but not everything the user asked for made it through. */
  Warning = 'warning',
  Failed = 'failed',
  Canceled = 'canceled',
}
