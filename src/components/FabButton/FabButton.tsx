import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  ReactNode,
} from 'react';

import {
  DialTooltip,
  type DialTooltipProps,
} from '@/components/Tooltip/Tooltip';
import { mergeClasses } from '@/utils/merge-classes';
import { resolveAccessibleName } from '@/utils/accessible-name';
import { IconArrowNarrowDown } from '@tabler/icons-react';

type TooltipProps = Omit<DialTooltipProps, 'children'>;

export interface FabButtonProps extends DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  icon?: ReactNode;
  tooltipProps?: TooltipProps;
}

/**
 * A Floating Action Button (FAB) component — circular icon button for primary actions.
 * aliases: FloatingActionButton|FabButton|CircularButton
 *
 * @example
 * ```tsx
 * <FabButton
 *   icon={<IconArrowNarrowDown size={24} stroke={1.5} />}
 *   onClick={handleClick}
 *   aria-label="Scroll to bottom"
 * />
 * ```
 *
 * inherits all properties from `ButtonHTMLAttributes<HTMLButtonElement>`
 *
 * The button is icon-only, so it needs an accessible name: pass `aria-label`,
 * or a string `tooltipProps.tooltip`, which is used as the label when no
 * `aria-label` is given.
 *
 * @param icon - Icon to display inside the button
 * @param [tooltipProps] - Optional tooltip configuration
 */
export const FabButton: FC<FabButtonProps> = ({
  className,
  icon,
  tooltipProps,
  type = 'button',
  ...props
}) => {
  const btnClassName = mergeClasses(
    'flex items-center justify-center rounded-full size-[40px]',
    'dial-kit-enhanced-target',
    'dial-kit-fab-button disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-focus-black outline-offset-0',
    className,
  );

  const button = (
    <button
      {...props}
      type={type}
      className={btnClassName}
      aria-label={resolveAccessibleName(
        props['aria-label'],
        tooltipProps?.tooltip,
      )}
    >
      {icon || (
        <IconArrowNarrowDown size={24} stroke={1.5} aria-hidden="true" />
      )}
    </button>
  );

  return tooltipProps ? (
    <DialTooltip {...tooltipProps}>{button}</DialTooltip>
  ) : (
    button
  );
};
