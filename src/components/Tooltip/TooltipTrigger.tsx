import { useTooltipContext } from '@/components/Tooltip/TooltipContext';
import { useMergeRefs } from '@floating-ui/react';
import {
  type FC,
  type HTMLProps,
  type Ref,
  cloneElement,
  isValidElement,
  useRef,
} from 'react';

interface TooltipTriggerProps extends HTMLProps<HTMLElement> {
  asChild?: boolean;
}
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
  const propRef = useRef(null);

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
};
