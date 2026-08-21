import { useMergeRefs } from '@floating-ui/react';
import {
  type FC,
  type HTMLProps,
  type ReactElement,
  type Ref,
  cloneElement,
  isValidElement,
} from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { useTooltipContext } from './TooltipContext';

interface TooltipTriggerProps extends HTMLProps<HTMLElement> {
  asChild?: boolean;
}

type ElementWithRef = ReactElement<{ ref?: Ref<unknown> }>;

/**
 * The element a tooltip is anchored to and opened from.
 * Design system 2.0
 *
 * Prefer `asChild` whenever the trigger is a single element: it puts the
 * `aria-describedby` that names the tooltip on the control itself instead of on
 * a wrapper `<span>`, which is the only way the tooltip text reaches assistive
 * technology.
 *
 * @param children - The element that opens the tooltip
 * @param [asChild=false] - Render the child as the trigger instead of wrapping it in a `<span>`
 */
export const TooltipTrigger: FC<TooltipTriggerProps> = ({
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
    const childProps = children.props as HTMLProps<Element>;

    return cloneElement(
      children,
      context.getReferenceProps({
        ...childProps,
        ...props,
        /*
          `Tooltip` always forwards `triggerClassName`, so `className` is a
          present-but-undefined key here even when the caller passes nothing —
          spreading it over the child would wipe every class the child owns.
          Merge the two instead of letting the trigger replace the child.
        */
        className:
          mergeClasses(childProps.className, props.className) || undefined,
        ref,
      }),
    );
  }

  return (
    <span
      ref={ref}
      {...context.getReferenceProps(props)}
      className={props.className ?? 'text-start'}
    >
      {children}
    </span>
  );
};
