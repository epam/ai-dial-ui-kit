import {
  FloatingArrow,
  FloatingPortal,
  useMergeRefs,
} from '@floating-ui/react';
import classNames from 'classnames';
import { type CSSProperties, type FC, type HTMLProps, useRef } from 'react';

import { useTooltipContext } from '@/components/Tooltip/TooltipContext';

export interface Props extends HTMLProps<HTMLDivElement> {
  style?: CSSProperties;
}
/**
 * The content area of a tooltip that displays the tooltip information
 *
 * @param children - The content to display inside the tooltip
 * @param [style] - Additional inline styles for the tooltip content
 */
export const DialTooltipContent: FC<Props> = ({ style, ...props }) => {
  const context = useTooltipContext();
  const propRef = useRef(null);
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!context.open) {
    return null;
  }

  return (
    <FloatingPortal id="tooltip-portal">
      <div
        ref={ref}
        style={{
          ...context.floatingStyles,
          ...style,
        }}
        {...context.getFloatingProps(props)}
        className={classNames(
          'z-[55] whitespace-pre-wrap break-words rounded border border-primary bg-layer-0 px-2 py-1 dial-tiny shadow max-w-[300px]',
          context.getFloatingProps(props).className as string,
        )}
      >
        {props.children}
        <FloatingArrow
          ref={context.arrowRef}
          context={context.context}
          fill="currentColor"
          strokeWidth={1}
          className="stroke-primary w-2 text-[var(--bg-layer-0,_#000000)]"
        />
      </div>
    </FloatingPortal>
  );
};
