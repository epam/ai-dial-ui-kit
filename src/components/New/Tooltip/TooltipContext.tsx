import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { TooltipPlacement } from '@/types/tooltip';
import { ARROW_GAP, ARROW_HEIGHT, HOVER_OPEN_DELAY } from './constants';

type ContextType = ReturnType<typeof useTooltip> | null;

export const TooltipContext = createContext<ContextType>(null);

export interface TooltipContainerOptions {
  initialOpen?: boolean;
  placement?: TooltipPlacement;
  isTriggerClickable?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const useTooltipContext = () => {
  const context = useContext(TooltipContext);

  if (context == null) {
    throw new Error(
      'Tooltip components must be wrapped in <TooltipContainer />',
    );
  }

  return context;
};

/**
 * Positioning and interaction state shared by the tooltip trigger and content.
 * Design system 2.0
 *
 * @param [initialOpen=false] - Whether the tooltip starts open (uncontrolled only)
 * @param [placement=TooltipPlacement.Bottom] - Side of the trigger the tooltip is placed on
 * @param [isTriggerClickable=false] - Restrict hover handling to mouse input, ignoring touch
 * @param [open] - Controlled open state; disables the hover and focus triggers
 * @param [onOpenChange] - Callback fired when the open state should change
 */
export const useTooltip = ({
  initialOpen = false,
  placement = TooltipPlacement.Bottom,
  isTriggerClickable = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TooltipContainerOptions = {}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
  const arrowRef = useRef<SVGSVGElement>(null);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(ARROW_HEIGHT + ARROW_GAP),
      flip({
        fallbackAxisSideDirection: 'start',
        padding: 5,
      }),
      shift({ padding: 5 }),
      arrow({ element: arrowRef }),
    ],
  });

  const hover = useHover(data.context, {
    move: false,
    enabled: controlledOpen == null,
    mouseOnly: isTriggerClickable,
    delay: { open: HOVER_OPEN_DELAY, close: 0 },
  });
  const focus = useFocus(data.context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(data.context);
  const role = useRole(data.context, { role: 'tooltip' });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  // A trigger scrolled out of view leaves its tooltip stranded next to an
  // anchor the user can no longer see, so close it once the trigger leaves the
  // viewport.
  useEffect(() => {
    if (!open) return;

    const element = data.refs.reference.current;

    if (!(element instanceof Element)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setOpen(false);
        }
      },
      { root: null, threshold: 0 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [open, data.refs.reference, setOpen]);

  return useMemo(
    () => ({
      open,
      setOpen,
      arrowRef,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data],
  );
};
