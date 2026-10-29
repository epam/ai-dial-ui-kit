/**
 * How urgently a `LiveRegion` asks a screen reader to read a change.
 */
export enum LiveRegionPoliteness {
  /** `role="status"` + `aria-live="polite"`: read once the user is idle, queued behind other speech. */
  Polite = 'polite',
  /** `role="alert"` + `aria-live="assertive"`: interrupts current speech. Reserve for failures the user must act on. */
  Assertive = 'assertive',
}

/**
 * The element a `LiveRegion` renders as its always-mounted wrapper.
 */
export enum LiveRegionElement {
  Div = 'div',
  Span = 'span',
  P = 'p',
}
