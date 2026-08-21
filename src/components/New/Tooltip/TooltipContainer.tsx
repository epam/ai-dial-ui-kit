import type { FC, ReactNode } from 'react';

import {
  TooltipContext,
  useTooltip,
  type TooltipContainerOptions,
} from './TooltipContext';

interface Props {
  children: ReactNode;
}

/**
 * Provides tooltip positioning and open state to a trigger and a content pair.
 * aliases: TooltipProvider|TooltipRoot
 * Design system 2.0
 *
 * Use it directly only when the trigger and the content cannot be rendered by
 * `Tooltip` itself — for example when the content needs custom markup.
 *
 * @example
 * ```tsx
 * <TooltipContainer placement={TooltipPlacement.Top}>
 *   <TooltipTrigger asChild>
 *     <button>Hover me</button>
 *   </TooltipTrigger>
 *   <TooltipContent>Tooltip text</TooltipContent>
 * </TooltipContainer>
 * ```
 *
 * @param children - The tooltip trigger and content components
 * @param [initialOpen=false] - Whether the tooltip starts open (uncontrolled only)
 * @param [placement=TooltipPlacement.Bottom] - Side of the trigger the tooltip is placed on
 * @param [isTriggerClickable=false] - Restrict hover handling to mouse input, ignoring touch
 * @param [open] - Controlled open state; disables the hover and focus triggers
 * @param [onOpenChange] - Callback fired when the open state should change
 */
export const TooltipContainer: FC<Props & TooltipContainerOptions> = ({
  children,
  ...options
}) => {
  const tooltip = useTooltip(options);

  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
};
