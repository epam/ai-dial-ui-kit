import type {
  ButtonHTMLAttributes,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
} from 'react';

import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { variantClassMap } from './constants';

/** The tooltip fields that decide whether a disabled button must stay reachable. */
interface DisabledTooltipFields {
  tooltip?: ReactNode;
  hideTooltip?: boolean;
}

/** The props a button element takes for its disabled state and its click. */
type DisabledButtonProps = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled' | 'aria-disabled' | 'onClick'
>;

const swallowClick = (event: MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};

/**
 * Returns the disabled-state props for a button element: native `disabled`,
 * or — for a disabled button that shows a tooltip — `aria-disabled` with the
 * click swallowed, so the button stays hoverable and focusable.
 */
export const getDisabledButtonProps = (
  disabled: boolean | undefined,
  tooltipProps: DisabledTooltipFields | undefined,
  onClick: MouseEventHandler<HTMLButtonElement> | undefined,
): DisabledButtonProps => {
  /*
   * A natively disabled button receives no pointer or focus events, so a
   * tooltip on it can never open — and "why is this disabled" is the one hint
   * a disabled button most often needs. `preventDefault` also stops a
   * `type="submit"` button from submitting its form.
   */
  const hasVisibleTooltip =
    tooltipProps != null &&
    !tooltipProps.hideTooltip &&
    tooltipProps.tooltip != null &&
    tooltipProps.tooltip !== '';

  if (disabled && hasVisibleTooltip) {
    return {
      disabled: undefined,
      'aria-disabled': true,
      onClick: swallowClick,
    };
  }

  return { disabled, onClick };
};

export const getButtonClassNames = (
  variant = ButtonVariant.Primary,
  appearance = ButtonAppearance.Solid,
): string => {
  const existingVariant = variantClassMap[variant]?.[appearance];
  if (!existingVariant) {
    console.warn(
      `Could not find Button styles for variant: ${variant} and appearance: ${appearance}. Using default primary solid button styles.`,
    );
    return variantClassMap[ButtonVariant.Primary][ButtonAppearance.Solid];
  }
  return existingVariant;
};
