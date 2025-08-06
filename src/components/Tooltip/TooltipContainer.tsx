import type { FC, ReactNode } from 'react';
import {
  TooltipContext,
  useTooltip,
  type DialTooltipContainerOptions,
} from '@/components/Tooltip/TooltipContext';

interface Props {
  children: ReactNode;
}

/**
 * The container component that provides tooltip context and state management
 *
 *
 * @param children - The tooltip trigger and content components
 * @param [initialOpen=false] - Whether the tooltip should be initially open
 * @param [placement='bottom'] - Where to position the tooltip relative to the trigger
 * @param [isTriggerClickable=false] - Whether the logic only runs for mouse input, ignoring touch input
 * @param [open] - Controlled open state for the tooltip
 * @param [onOpenChange] - Callback fired when the tooltip open state changes
 */
export const DialTooltipContainer: FC<Props & DialTooltipContainerOptions> = ({
  children,
  ...options
}) => {
  // or other positioning options.
  const tooltip = useTooltip(options);

  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
};
