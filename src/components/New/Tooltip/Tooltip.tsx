import type { FC, ReactNode } from 'react';

import { TooltipContainer } from './TooltipContainer';
import { TooltipContent } from './TooltipContent';
import type { TooltipContainerOptions } from './TooltipContext';
import { TooltipTrigger } from './TooltipTrigger';

export interface TooltipProps extends TooltipContainerOptions {
  hideTooltip?: boolean;
  tooltip?: ReactNode;
  children: ReactNode;
  asChild?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
}

/**
 * Shows a short explanation next to an element while it is hovered or focused.
 * aliases: HoverPopover|InfoPopover
 * Design system 2.0
 *
 * The tooltip is placed on one of the four sides of the trigger and follows it
 * on scroll, flipping to the opposite side when it would not fit.
 *
 * Tooltip text does not reach assistive technology unless the trigger itself
 * carries it: pass `asChild` so the `aria-describedby` lands on the control
 * rather than on a wrapper `<span>`, and never let a tooltip be the only
 * accessible name of a control — it renders nothing on mobile screens.
 *
 * @example
 * ```tsx
 * <Tooltip tooltip="Tooltip text" placement={TooltipPlacement.Top} asChild>
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 *
 * @param [tooltip] - The content to display in the tooltip
 * @param children - The element that triggers the tooltip
 * @param [asChild=false] - Use the child as the trigger instead of wrapping it in a `<span>`
 * @param [hideTooltip=false] - Suppress the tooltip while keeping the trigger rendered
 * @param [triggerClassName] - Additional CSS classes for the trigger element
 * @param [contentClassName] - Additional CSS classes for the tooltip bubble
 * @param [initialOpen=false] - Whether the tooltip starts open (uncontrolled only)
 * @param [placement=TooltipPlacement.Bottom] - Side of the trigger the tooltip is placed on
 * @param [isTriggerClickable=false] - Restrict hover handling to mouse input, ignoring touch
 * @param [open] - Controlled open state; disables the hover and focus triggers
 * @param [onOpenChange] - Callback fired when the open state should change
 */
export const Tooltip: FC<TooltipProps> = ({
  hideTooltip = false,
  tooltip,
  children,
  asChild = false,
  triggerClassName,
  contentClassName,
  ...tooltipProps
}) => {
  const hasTooltip = !hideTooltip && !!tooltip;

  return (
    <TooltipContainer {...tooltipProps}>
      <TooltipTrigger asChild={asChild} className={triggerClassName}>
        {children}
      </TooltipTrigger>
      {/*
        Nothing to show is nothing to render: an empty bubble would still
        portal a positioned element and announce itself to a screen reader.
      */}
      {hasTooltip && (
        <TooltipContent className={contentClassName}>{tooltip}</TooltipContent>
      )}
    </TooltipContainer>
  );
};
