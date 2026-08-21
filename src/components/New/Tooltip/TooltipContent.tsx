import {
  FloatingArrow,
  FloatingPortal,
  useMergeRefs,
} from '@floating-ui/react';
import classNames from 'classnames';
import { type CSSProperties, type FC, type HTMLProps, useRef } from 'react';

import { useIsMobileScreen } from '@/hooks/use-is-mobile-screen';
import { arrowClassName, tooltipClassName } from './constants';
import { useTooltipContext } from './TooltipContext';

export interface TooltipContentProps extends HTMLProps<HTMLDivElement> {
  style?: CSSProperties;
}

/**
 * The floating bubble that carries the tooltip text.
 * Design system 2.0
 *
 * Rendered in a portal, above popups and dropdowns, with an arrow pointing back
 * at the trigger. Renders nothing on a mobile screen, where there is no hover
 * to reveal it — so a control must never depend on a tooltip alone to be
 * understood, or to have an accessible name.
 *
 * @param children - The content to display inside the tooltip
 * @param [className] - Additional CSS classes applied to the tooltip bubble
 * @param [style] - Additional inline styles for the tooltip bubble
 */
export const TooltipContent: FC<TooltipContentProps> = ({
  style,
  ...props
}) => {
  const context = useTooltipContext();
  const isMobile = useIsMobileScreen();
  const propRef = useRef(null);
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!context.open || isMobile) {
    return null;
  }

  return (
    <FloatingPortal id="tooltip-portal">
      <div
        ref={ref}
        // Resolved side after flipping, exposed as a styling and testing hook.
        data-placement={context.placement}
        style={{
          ...context.floatingStyles,
          ...style,
        }}
        {...context.getFloatingProps(props)}
        className={classNames(
          tooltipClassName,
          context.getFloatingProps(props).className as string,
        )}
      >
        {props.children}
        <FloatingArrow
          ref={context.arrowRef}
          context={context.context}
          className={arrowClassName}
        />
      </div>
    </FloatingPortal>
  );
};
