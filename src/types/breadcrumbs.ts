export enum BreadcrumbsSize {
  /** 14px `dial-small-text`, with a `dial-small-semi-text` current page. */
  Small = 'small',
  /**
   * 12px `dial-tiny-text`, with a `dial-tiny-semi-text` current page: a 16px
   * trail for a dense header. It never clips, so a focus ring stays whole, and
   * nothing is capped: the middle truncates first, the current page last.
   */
  Tiny = 'tiny',
  /**
   * 18px `dial-h2-text`, for a trail that doubles as the page heading. The
   * token is semibold, so every segment is — including the current page.
   */
  Heading = 'heading',
}
