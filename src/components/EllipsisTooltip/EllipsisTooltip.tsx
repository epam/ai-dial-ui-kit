import type { FC, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { DialTooltipContainer } from '@/components/Tooltip/TooltipContainer';
import { DialTooltipContent } from '@/components/Tooltip/TooltipContent';
import type { DialTooltipContainerOptions } from '@/components/Tooltip/TooltipContext';
import { DialTooltipTrigger } from '@/components/Tooltip/TooltipTrigger';
import { tooltipContentBaseClasses } from './constants';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialEllipsisTooltipProps extends DialTooltipContainerOptions {
  text: string | ReactNode;
  cssClass?: string;
  contentClassName?: string;
  hideTooltip?: boolean;
}

/**
 * Single-line text with CSS ellipsis that shows a tooltip **only when actually truncated**.
 * If the text fits, tooltip content is empty and the popup stays hidden.
 *
 * Important: width must be finite for truncation.
 * Consumers can override via `cssClass`.
 *
 * a11y: when truncated, the full text is exposed via `aria-label` on the reference node.
 *
 * @example
 * ```tsx
 * <DialEllipsisTooltip text="Very long message that will be truncated" />
 * <DialEllipsisTooltip text={<span className="font-medium">Custom node</span>} cssClass="max-w-[160px]" />
 * <DialEllipsisTooltip text="Tooltip disabled even if truncated" hideTooltip />
 * ```
 *
 * @param text The text or node to display (truncated with ellipsis if too long).
 * @param cssClass Optional additional CSS classes for the text container (e.g. to set width).
 * @param contentClassName Optional additional CSS classes for the tooltip content.
 * @param hideTooltip If true, disables the tooltip even if text is truncated.
 * @param tooltipProps Additional props to pass to the underlying DialTooltipContainer.
 */
export const DialEllipsisTooltip: FC<DialEllipsisTooltipProps> = ({
  text,
  cssClass,
  contentClassName,
  hideTooltip,
  ...tooltipProps
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [nodeTextSnapshot, setNodeTextSnapshot] = useState<string>('');
  const rafRef = useRef<number | null>(null);

  const computeTruncation = () => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;

    setNodeTextSnapshot(el.textContent ?? '');
    const client = el.clientWidth;
    const scroll = el.scrollWidth;
    const rectW = Math.ceil(el.getBoundingClientRect().width);
    setIsTruncated(scroll > client || scroll > rectW);
  };

  const scheduleCompute = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(computeTruncation);
  }, []);

  useEffect(() => {
    scheduleCompute();

    const onResize = () => scheduleCompute();
    window.addEventListener('resize', onResize);

    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window && ref.current) {
      ro = new ResizeObserver(() => scheduleCompute());
      ro.observe(ref.current);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, scheduleCompute]);

  const fullText = useMemo(
    () => (typeof text === 'string' ? text : nodeTextSnapshot),
    [nodeTextSnapshot, text],
  );

  const tooltipContent = useMemo(() => {
    if (hideTooltip) return '';
    return isTruncated ? fullText : '';
  }, [fullText, hideTooltip, isTruncated]);

  return (
    <DialTooltipContainer {...tooltipProps}>
      <DialTooltipTrigger
        asChild
        ref={ref}
        onMouseEnter={scheduleCompute}
        onFocusCapture={scheduleCompute}
      >
        <span
          className={mergeClasses(
            'block truncate min-w-0 max-w-full',
            cssClass,
          )}
          aria-label={isTruncated ? fullText : undefined}
          onMouseEnter={scheduleCompute}
          onFocus={scheduleCompute}
        >
          {text}
        </span>
      </DialTooltipTrigger>

      <DialTooltipContent
        className={mergeClasses(
          tooltipContentBaseClasses,
          contentClassName,
          !tooltipContent && 'hidden',
        )}
      >
        {tooltipContent}
      </DialTooltipContent>
    </DialTooltipContainer>
  );
};
