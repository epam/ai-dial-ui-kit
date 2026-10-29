/**
 * The ARIA role a `ProgressBar` renders, which decides what its value means to
 * a screen reader.
 */
export enum ProgressBarRole {
  /** `role="progressbar"`: how far a task has got toward completion — an upload, an import. */
  Progressbar = 'progressbar',
  /**
   * `role="meter"`: a scalar inside a known range that is not a task's
   * progress — capacity used, a quota, a score. It never "completes".
   */
  Meter = 'meter',
}
