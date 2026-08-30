import type { FC, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { DialTooltipContainer } from '@/components/Tooltip/TooltipContainer';
import { DialTooltipContent } from '@/components/Tooltip/TooltipContent';
import type { DialTooltipContainerOptions } from '@/components/Tooltip/TooltipContext';
import { DialTooltipTrigger } from '@/components/Tooltip/TooltipTrigger';
import { tooltipContentBaseClassName } from './constants';
import {
  observeElementSize,
  scheduleMeasure,
} from '@/utils/element-size-observer';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialEllipsisTooltipProps extends DialTooltipContainerOptions {
  text: ReactNode;
  className?: string;
  contentClassName?: string;
  hideTooltip?: boolean;
  id?: string;
  customTooltipContent?: ReactNode;
}

/**
 * Single-line text with CSS ellipsis that shows a tooltip **only when actually truncated**.
 * aliases: TruncatedText|TruncationTooltip
 * Design system 1.0
 *
 * If the text fits, tooltip content is empty and the popup stays hidden.
 *
 * Important: width must be finite for truncation.
 * Consumers can override via `className`.
 *
 * a11y: when truncated, the full text is exposed via `aria-label` on the reference node.
 *
 * @example
 * ```tsx
 * <DialEllipsisTooltip text="Very long message that will be truncated" />
 * <DialEllipsisTooltip text={<span className="font-medium">Custom node</span>} className="max-w-[160px]" />
 * <DialEllipsisTooltip text="Tooltip disabled even if truncated" hideTooltip />
 * ```
 *
 * @param text The text or node to display (truncated with ellipsis if too long).
 * @param className Optional additional CSS classes for the text container (e.g. to set width).
 * @param contentClassName Optional additional CSS classes for the tooltip content.
 * @param hideTooltip If true, disables the tooltip even if text is truncated.
 * @param id Optional attribute for unique identification
 * @param customTooltipContent If provided, this content will be shown in the tooltip instead of the full text when truncated.
 * @param tooltipProps Additional props to pass to the underlying DialTooltipContainer.
 */
export const DialEllipsisTooltip: FC<DialEllipsisTooltipProps> = ({
  text,
  className,
  contentClassName,
  hideTooltip,
  id,
  customTooltipContent,
  ...tooltipProps
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [nodeTextSnapshot, setNodeTextSnapshot] = useState<string>('');

  const computeTruncation = useCallback(() => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;

    setNodeTextSnapshot(el.textContent ?? '');
    // `scrollWidth` against `clientWidth` is the whole check: both are layout
    // widths of the same box, so a wider scroll width is exactly what
    // `text-overflow` clips.
    setIsTruncated(el.scrollWidth > el.clientWidth);
  }, []);

  // Reading layout inside an event handler forces a synchronous reflow, so the
  // measurement is deferred to the next frame — shared with every other pending
  // measurement, which keeps a screen full of these to one reflow per frame.
  const scheduleCompute = useCallback(
    () => scheduleMeasure(computeTruncation),
    [computeTruncation],
  );

  // Observing is tied to the element, not to the text: a new string must not
  // cost an unobserve and a re-observe. The shared observer means the whole
  // page allocates one `ResizeObserver` and one resize listener in total.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return observeElementSize(el, computeTruncation);
  }, [computeTruncation]);

  useEffect(() => {
    scheduleCompute();
  }, [text, scheduleCompute]);

  const fullText = useMemo(
    () => (typeof text === 'string' ? text : nodeTextSnapshot),
    [nodeTextSnapshot, text],
  );

  const tooltipContent = useMemo(() => {
    if (hideTooltip) return '';
    if (customTooltipContent) return customTooltipContent;
    return isTruncated ? fullText : '';
  }, [customTooltipContent, fullText, hideTooltip, isTruncated]);

  return (
    <DialTooltipContainer {...tooltipProps}>
      <DialTooltipTrigger
        asChild
        onMouseEnter={scheduleCompute}
        onFocusCapture={scheduleCompute}
      >
        <span
          id={id}
          className={mergeClasses(
            'block truncate flex-1 min-w-0 max-w-full text-start',
            className,
          )}
          aria-label={isTruncated ? fullText : undefined}
          onMouseEnter={scheduleCompute}
          onFocus={scheduleCompute}
          ref={ref}
        >
          {text}
        </span>
      </DialTooltipTrigger>

      <DialTooltipContent
        className={mergeClasses(
          tooltipContentBaseClassName,
          contentClassName,
          !tooltipContent && 'hidden',
        )}
      >
        {tooltipContent}
      </DialTooltipContent>
    </DialTooltipContainer>
  );
};
