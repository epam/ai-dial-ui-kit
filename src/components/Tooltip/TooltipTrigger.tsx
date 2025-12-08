import { useTooltipContext } from '@/components/Tooltip/TooltipContext';
import { useMergeRefs } from '@floating-ui/react';
import {
  type FC,
  type HTMLProps,
  type ReactElement,
  type Ref,
  cloneElement,
  isValidElement,
} from 'react';

interface TooltipTriggerProps extends HTMLProps<HTMLElement> {
  asChild?: boolean;
}

type ElementWithRef = ReactElement<{ ref?: Ref<unknown> }>;

/**
 * The trigger element for a tooltip that can be clicked or hovered
 *
 * @param children - The element that will trigger the tooltip
 * @param [asChild=false] - Whether to render as a child element instead of wrapping in a span
 */
export const DialTooltipTrigger: FC<TooltipTriggerProps> = ({
  children,
  asChild = false,
  ...props
}) => {
  const context = useTooltipContext();

  const asValidChild = asChild && isValidElement(children);

  const childrenRef = asValidChild
    ? (children as ElementWithRef).props?.ref
    : null;

  const ref = useMergeRefs([
    context.refs.setReference,
    ...(childrenRef ? [childrenRef] : []),
  ]);

  // `asChild` allows the user to pass any element as the anchor
  if (asValidChild) {
    return cloneElement(
      children,
      context.getReferenceProps({
        ...(children.props as HTMLProps<Element>),
        ...props,
        ref,
      }),
    );
  }

  return (
    <span
      ref={ref}
      {...context.getReferenceProps(props)}
      className={props.className ?? 'dial-tooltip-trigger text-left'}
    >
      {children}
    </span>
  );
};
