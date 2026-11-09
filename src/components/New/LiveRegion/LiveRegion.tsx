import { createElement, type FC, type HTMLAttributes } from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { LiveRegionElement, LiveRegionPoliteness } from '@/types/live-region';

export interface LiveRegionProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'role' | 'aria-live' | 'aria-atomic'
> {
  /**
   * How urgently the change is read. `Polite` (default) renders
   * `role="status"` + `aria-live="polite"`; `Assertive` renders
   * `role="alert"` + `aria-live="assertive"`.
   */
  politeness?: LiveRegionPoliteness;
  /** Hide the region visually while keeping it readable by assistive tech (`sr-only`). */
  visuallyHidden?: boolean;
  /** Sets `aria-atomic`: read the whole region, not only the changed node, on each change. */
  atomic?: boolean;
  /** The wrapper element. Default `LiveRegionElement.Div`; use `Span` inside inline content. */
  as?: LiveRegionElement;
}

const ROLE_BY_POLITENESS: Record<LiveRegionPoliteness, 'status' | 'alert'> = {
  [LiveRegionPoliteness.Polite]: 'status',
  [LiveRegionPoliteness.Assertive]: 'alert',
};

/**
 * A live region that is always in the DOM, so a screen reader announces the
 * message put into it.
 * aliases: AriaLive|Announcer|StatusMessage|ScreenReaderAnnouncement|SrOnlyStatus
 * Design system 2.0
 *
 * Screen readers announce a live region reliably only when the region already
 * exists before its content changes; a region mounted together with its text is
 * often read late or not at all. `LiveRegion` always renders its wrapper, even
 * when `children` is empty, `null` or `false` — only the content changes.
 *
 * Use it for a message that is not attached to one control and must be heard:
 * a failed submit, an async status ("Saved", "3 results"), an empty search.
 * Use something else when:
 * - the message belongs to a form field — render `ErrorText` / `CaptionText`
 *   with an `id` and point the control's `aria-describedby` at it (or pass
 *   `announce` to them when the error must also be announced);
 * - the message is a toast or a section message — `Notification` and its
 *   wrappers are already live regions.
 *
 * An empty, visible region takes no layout space: while it has no child nodes
 * it gets `sr-only` (through `empty:sr-only`) rather than `display: none`,
 * because some screen readers drop a `display: none` node from the
 * accessibility tree and would then miss the first message put into it.
 *
 * @example
 * ```tsx
 * <LiveRegion politeness={LiveRegionPoliteness.Assertive}>
 *   {submitError && <ErrorText text={submitError} />}
 * </LiveRegion>
 *
 * <LiveRegion visuallyHidden>{isEmpty ? 'No results' : ''}</LiveRegion>
 * ```
 *
 * @param [politeness] - `LiveRegionPoliteness.Polite` (default) or `Assertive`.
 * @param [visuallyHidden] - Hide the region visually (`sr-only`); it is still announced.
 * @param [atomic] - Sets `aria-atomic`.
 * @param [as] - The wrapper element, `LiveRegionElement.Div` by default.
 * @param [className] - Additional CSS classes for the wrapper.
 * @param [children] - The message. May be empty; the wrapper is rendered anyway.
 */
export const LiveRegion: FC<LiveRegionProps> = ({
  politeness = LiveRegionPoliteness.Polite,
  visuallyHidden = false,
  atomic,
  as = LiveRegionElement.Div,
  className,
  children,
  ...props
}) =>
  createElement(
    as,
    {
      ...props,
      role: ROLE_BY_POLITENESS[politeness],
      'aria-live': politeness,
      'aria-atomic': atomic,
      className: mergeClasses(
        visuallyHidden ? 'sr-only' : 'empty:sr-only',
        className,
        DIAL_KIT_CLASS.liveRegion,
      ),
    },
    children,
  );
