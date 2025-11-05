import { useMergeRefs } from '@floating-ui/react';
import {
  type HTMLProps,
  type Ref,
  cloneElement,
  forwardRef,
  isValidElement,
} from 'react';
import { useTooltipContext } from '@/components/Tooltip/TooltipContext';

/**
 * The trigger element for a tooltip that can be clicked or hovered
 *
 * @param children - The element that will trigger the tooltip
 * @param [asChild=false] - Whether to render as a child element instead of wrapping in a span
 */
export const DialTooltipTrigger = forwardRef<
  HTMLElement,
  HTMLProps<HTMLElement> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useTooltipContext();

  const asValidChild = asChild && isValidElement(children);

  const isRefInChildren =
    children &&
    typeof children === 'object' &&
    'ref' in children &&
    children.ref !== undefined;

  const childrenRef = isRefInChildren
    ? (children.ref as Ref<HTMLElement>)
    : undefined;

  const refsToMerge = [context.refs.setReference, propRef];
  if (asValidChild && childrenRef) {
    refsToMerge.push(childrenRef);
  }

  const ref = useMergeRefs(refsToMerge);

  // `asChild` allows the user to pass any element as the anchor
  if (asValidChild) {
    return cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...(children.props as HTMLProps<Element>),
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
});
