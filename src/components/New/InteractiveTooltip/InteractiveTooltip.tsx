import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
} from '@floating-ui/react';
import {
  type FC,
  type HTMLProps,
  type ReactElement,
  type ReactNode,
  type Ref,
  cloneElement,
  isValidElement,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useThemeScope } from '@/components/New/ThemeScope/ThemeScope';
import { useIsMobileScreen } from '@/hooks/use-is-mobile-screen';
import { TooltipPlacement } from '@/types/tooltip';
import { mergeClasses } from '@/utils/merge-classes';
import {
  INTERACTIVE_TOOLTIP_GAP,
  INTERACTIVE_TOOLTIP_HOVER_OPEN_DELAY,
  interactiveTooltipClassName,
} from './constants';

export interface InteractiveTooltipProps {
  /**
   * The panel's content. Left fully open-ended — unlike a plain tooltip's
   * text, this can be any markup, including its own buttons and links.
   */
  content: ReactNode;
  /** Side of the trigger the panel is placed on. */
  placement?: TooltipPlacement;
  /** The element the panel is anchored to and opened from. */
  children: ReactNode;
  /** Render `children` as the trigger instead of wrapping it in a `<span>`. */
  asChild?: boolean;
  /** Suppress the panel while keeping the trigger rendered. */
  hideTooltip?: boolean;
  /** Whether the panel starts open (uncontrolled only). */
  initialOpen?: boolean;
  /** Controlled open state; disables the hover and focus triggers. */
  open?: boolean;
  /** Callback fired when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Additional CSS classes for the trigger element. */
  triggerClassName?: string;
  /** Additional CSS classes for the panel. */
  contentClassName?: string;
}

type ElementWithRef = ReactElement<{ ref?: Ref<unknown> }>;

/**
 * A hover panel that, unlike {@link Tooltip}, can hold its own interactive
 * content.
 * aliases: HoverCard|InfoPopover
 * Design system 2.0
 *
 * Opens next to the trigger on hover or focus, the way a tooltip does, but
 * stays open while the pointer moves into the panel so its content — links,
 * buttons, anything — can be hovered and clicked. It carries no `role`, since
 * ARIA's `tooltip` role forbids focusable content and this is meant to hold
 * some; a panel with meaningfully interactive content should still be
 * reachable without a mouse (Tab from the trigger reaches it), but a purely
 * decorative one is fine to leave out of the tab order entirely.
 *
 * Renders nothing on a mobile screen, where there is no hover to reveal it —
 * so, as with {@link Tooltip}, a control must never depend on this panel alone
 * to be understood or operated.
 *
 * @example
 * ```tsx
 * <InteractiveTooltip
 *   placement={TooltipPlacement.Right}
 *   content={
 *     <>
 *       <p>Lets the model write and execute Python in an isolated sandbox.</p>
 *       <Button variant={ButtonVariant.Primary} appearance={ButtonAppearance.Link}>
 *         View details
 *       </Button>
 *     </>
 *   }
 * >
 *   <MenuItem label="code-interpreter" />
 * </InteractiveTooltip>
 * ```
 *
 * @param content - The panel's content
 * @param children - The element that triggers the panel
 * @param [asChild=false] - Use the child as the trigger instead of wrapping it in a `<span>`
 * @param [hideTooltip=false] - Suppress the panel while keeping the trigger rendered
 * @param [triggerClassName] - Additional CSS classes for the trigger element
 * @param [contentClassName] - Additional CSS classes for the panel
 * @param [placement=TooltipPlacement.Right] - Side of the trigger the panel is placed on
 * @param [initialOpen=false] - Whether the panel starts open (uncontrolled only)
 * @param [open] - Controlled open state; disables the hover and focus triggers
 * @param [onOpenChange] - Callback fired when the open state should change
 */
export const InteractiveTooltip: FC<InteractiveTooltipProps> = ({
  content,
  placement = TooltipPlacement.Right,
  children,
  asChild = false,
  hideTooltip = false,
  initialOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  triggerClassName,
  contentClassName,
}) => {
  const isMobile = useIsMobileScreen();
  const themeScope = useThemeScope();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(INTERACTIVE_TOOLTIP_GAP),
      /* No `fallbackAxisSideDirection`: a panel placed to the right should
       flip to the left when it does not fit, not drop to the perpendicular
       top/bottom axis, which reads as the panel landing in the wrong place.*/
      flip({ padding: 5 }),
      shift({ padding: 5 }),
    ],
  });

  const hover = useHover(context, {
    enabled: controlledOpen == null,
    /* Lets the pointer cross the gap between the trigger and the panel
       without closing it, so it can actually be reached and used. */
    handleClose: safePolygon(),
    delay: { open: INTERACTIVE_TOOLTIP_HOVER_OPEN_DELAY, close: 0 },
  });
  const focus = useFocus(context, { enabled: controlledOpen == null });
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
  ]);

  const floatingPropRef = useRef(null);
  const floatingRef = useMergeRefs(
    useMemo(() => [refs.setFloating, floatingPropRef], [refs.setFloating]),
  );

  const asValidChild = asChild && isValidElement(children);
  const childrenRef = asValidChild
    ? (children as ElementWithRef).props?.ref
    : null;
  const referenceRef = useMergeRefs(
    useMemo(
      () => [refs.setReference, ...(childrenRef ? [childrenRef] : [])],
      [refs.setReference, childrenRef],
    ),
  );

  const hasContent = !hideTooltip && !isMobile && !!content;

  const trigger = asValidChild ? (
    cloneElement(
      children,
      getReferenceProps({
        ...(children.props as HTMLProps<Element>),
        ref: referenceRef,
        className:
          mergeClasses(
            (children.props as HTMLProps<Element>).className,
            triggerClassName,
          ) || undefined,
      }),
    )
  ) : (
    <span
      ref={referenceRef}
      {...getReferenceProps()}
      className={triggerClassName ?? 'text-start'}
    >
      {children}
    </span>
  );

  return (
    <>
      {trigger}
      {open && hasContent && (
        <FloatingPortal id="interactive-tooltip-portal">
          <FloatingFocusManager
            context={context}
            modal={false}
            initialFocus={-1}
            returnFocus={false}
            order={['reference', 'content']}
          >
            <div
              ref={floatingRef}
              // Resolved side after flipping, exposed as a styling and testing hook.
              data-placement={context.placement}
              style={floatingStyles}
              {...getFloatingProps()}
              className={mergeClasses(
                interactiveTooltipClassName,
                themeScope,
                contentClassName,
              )}
            >
              {content}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
};
