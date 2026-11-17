import type { FC } from 'react';

import { Button, type ButtonProps } from '@/components/New/Button/Button';
import { ButtonVariant } from '@/types/button';
import { mergeClasses } from '@/utils/merge-classes';
import {
  popupActionsGroupClassName,
  popupFooterClassName,
  popupFooterDividerClassName,
  popupMainActionButtonClassName,
  popupMainActionsGroupClassName,
} from './constants';

export interface PopupFooterProps {
  /** Primary buttons, aligned to the trailing edge; each defaults to `ButtonVariant.Neutral`. */
  mainButtons?: ButtonProps[];
  /** Secondary buttons, next to `mainButtons` unless moved left. */
  additionalButtons?: ButtonProps[];
  /** Whether `additionalButtons` sit on the leading edge. */
  additionalButtonsOnLeft?: boolean;
  /** Whether a rule is drawn above the footer. */
  footerDivider?: boolean;
  /** Additional CSS classes for the footer row. */
  className?: string;
}

/**
 * The action footer shared by `Popup` and `SideDrawer`: buttons declared as
 * data, so spacing, order, the neutral default and the mobile split-row layout
 * are the same on every dialog. Renders nothing without buttons.
 */
export const PopupFooter: FC<PopupFooterProps> = ({
  mainButtons,
  additionalButtons,
  additionalButtonsOnLeft = false,
  footerDivider = false,
  className,
}) => {
  if (!mainButtons?.length && !additionalButtons?.length) return null;

  // Neutral rather than the `Button` default of no variant: an unstyled button
  // in a dialog footer is never what the caller meant, and it matches the
  // `NeutralButton` wrapper these footers were written with by hand.
  // The two groups share a parent when the additional buttons are not moved
  // left, so their keys have to be namespaced or the indices collide.
  const renderButtons = (
    prefix: string,
    buttons: ButtonProps[] = [],
    buttonClassName?: string,
  ) =>
    buttons.map(
      ({ variant = ButtonVariant.Neutral, className, ...button }, index) => (
        <Button
          key={`${prefix}-${index}`}
          variant={variant}
          className={mergeClasses(buttonClassName, className)}
          {...button}
        />
      ),
    );

  // Only buttons in the trailing group stretch on mobile; a leading group
  // keeps its natural width beside them.
  const additional = renderButtons(
    'additional',
    additionalButtons,
    additionalButtonsOnLeft ? undefined : popupMainActionButtonClassName,
  );

  return (
    <div
      className={mergeClasses(
        popupFooterClassName,
        footerDivider && popupFooterDividerClassName,
        className,
      )}
    >
      {/* Guarded on the content, not just the flag: an empty leading group
          would still claim the container's gap. */}
      {additionalButtonsOnLeft && additional.length > 0 && (
        <div className={popupActionsGroupClassName}>{additional}</div>
      )}
      {/* `ml-auto` rather than `justify-end`: it pins the main group to the
          trailing edge whether or not a leading group precedes it. */}
      <div
        className={mergeClasses(
          popupActionsGroupClassName,
          popupMainActionsGroupClassName,
        )}
      >
        {!additionalButtonsOnLeft && additional}
        {renderButtons('main', mainButtons, popupMainActionButtonClassName)}
      </div>
    </div>
  );
};
