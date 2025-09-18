import type { FC, ReactNode } from 'react';

import { DialTooltipContainer } from '@/components/Tooltip/TooltipContainer';
import { DialTooltipContent } from '@/components/Tooltip/TooltipContent';
import type { DialTooltipContainerOptions } from '@/components/Tooltip/TooltipContext';
import { DialTooltipTrigger } from '@/components/Tooltip/TooltipTrigger';
import classNames from 'classnames';

export interface Props extends DialTooltipContainerOptions {
  hideTooltip?: boolean;
  tooltip: ReactNode;
  children: ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
}

/**
 * A Tooltip component that displays information on hover
 *
 * @example
 * ```tsx
 * <DialTooltip tooltip="This is helpful information">
 *   <button>Hover me</button>
 * </DialTooltip>
 * ```
 *
 * @param tooltip - The content to display in the tooltip
 * @param children - The element that triggers the tooltip
 * @param [hideTooltip=false] - Whether to hide the tooltip completely
 * @param [triggerClassName] - Additional CSS classes for the trigger element
 * @param [contentClassName] - Additional CSS classes for the tooltip content
 * @param [initialOpen=false] - Whether the tooltip should be initially open
 * @param [placement='bottom'] - Where to position the tooltip relative to the trigger
 * @param [isTriggerClickable=false] - Whether the trigger should only show tooltip on hover, not on focus
 * @param [open] - Controlled open state for the tooltip
 * @param [onOpenChange] - Callback fired when the tooltip open state changes
 */
export const DialTooltip: FC<Props> = ({
  hideTooltip,
  tooltip,
  children,
  triggerClassName,
  contentClassName,
  ...tooltipProps
}) => {
  if (hideTooltip || !tooltip) {
    return <span className={triggerClassName}>{children}</span>;
  }

  return (
    <DialTooltipContainer {...tooltipProps}>
      <DialTooltipTrigger className={triggerClassName}>
        {children}
      </DialTooltipTrigger>
      <DialTooltipContent
        className={classNames('text-primary', contentClassName)}
      >
        {tooltip}
      </DialTooltipContent>
    </DialTooltipContainer>
  );
};
