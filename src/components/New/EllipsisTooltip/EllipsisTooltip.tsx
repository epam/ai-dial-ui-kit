import { type FC, type ReactNode, useMemo } from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { TooltipContainer } from '../Tooltip/TooltipContainer';
import { TooltipContent } from '../Tooltip/TooltipContent';
import type { TooltipContainerOptions } from '../Tooltip/TooltipContext';
import { TooltipTrigger } from '../Tooltip/TooltipTrigger';
import { useTruncation } from './use-truncation';

export interface EllipsisTooltipProps extends TooltipContainerOptions {
  text: ReactNode;
  className?: string;
  contentClassName?: string;
  hideTooltip?: boolean;
  id?: string;
  customTooltipContent?: ReactNode;
}

/**
 * Single-line text with a CSS ellipsis that reveals the full string in a
 * tooltip **only when it is actually clipped**.
 * aliases: TruncatedText|TruncationTooltip
 * Design system 2.0
 *
 * Text that fits gets no tooltip at all, so a row of labels does not sprout
 * tooltips that repeat what is already on screen.
 *
 * The width has to be finite for anything to truncate: the element is a
 * `min-w-0`, `flex-1` block, and `className` sets the width it should fit into.
 *
 * a11y: while truncated, the full string is exposed as the element's
 * `aria-label`, so a screen reader reads the whole label even though the
 * tooltip itself renders nothing on mobile screens.
 *
 * @example
 * ```tsx
 * <EllipsisTooltip text="Very long message that will be truncated" />
 *
 * <EllipsisTooltip
 *   text={<span className="dial-small-semi-text">Custom node</span>}
 *   className="max-w-[160px]"
 * />
 *
 * <EllipsisTooltip text="Tooltip suppressed even when clipped" hideTooltip />
 * ```
 *
 * @param text - The text or node to display, truncated with an ellipsis when it does not fit
 * @param [className] - Additional CSS classes for the text element, typically its width
 * @param [contentClassName] - Additional CSS classes for the tooltip bubble
 * @param [hideTooltip=false] - Suppress the tooltip even while the text is truncated
 * @param [id] - `id` of the text element
 * @param [customTooltipContent] - Shown instead of the full text while truncated
 * @param [placement=TooltipPlacement.Bottom] - Side of the text the tooltip is placed on
 * @param [initialOpen=false] - Whether the tooltip starts open (uncontrolled only)
 * @param [isTriggerClickable=false] - Restrict hover handling to mouse input, ignoring touch
 * @param [open] - Controlled open state; disables the hover and focus triggers
 * @param [onOpenChange] - Callback fired when the open state should change
 */
export const EllipsisTooltip: FC<EllipsisTooltipProps> = ({
  text,
  className,
  contentClassName,
  hideTooltip = false,
  id,
  customTooltipContent,
  ...tooltipProps
}) => {
  const { ref, isTruncated, textContent, remeasure } =
    useTruncation<HTMLSpanElement>(text);

  // A node keeps its full string in the DOM, so the rendered text content is
  // the only place to read it from.
  const fullText = typeof text === 'string' ? text : textContent;

  const tooltipContent = useMemo(() => {
    if (hideTooltip || !isTruncated) return null;

    return customTooltipContent ?? fullText;
  }, [customTooltipContent, fullText, hideTooltip, isTruncated]);

  return (
    <TooltipContainer {...tooltipProps}>
      {/*
        The trigger is the text element itself rather than a wrapper: a wrapper
        would be the box that truncates, and its `aria-describedby` would not
        reach the text a screen reader is reading.
      */}
      <TooltipTrigger
        asChild
        onMouseEnter={remeasure}
        onFocusCapture={remeasure}
      >
        <span
          id={id}
          ref={ref}
          aria-label={isTruncated && fullText ? fullText : undefined}
          className={mergeClasses(
            'block min-w-0 max-w-full flex-1 truncate text-start',
            className,
          )}
        >
          {text}
        </span>
      </TooltipTrigger>
      {!!tooltipContent && (
        <TooltipContent className={contentClassName}>
          {tooltipContent}
        </TooltipContent>
      )}
    </TooltipContainer>
  );
};
