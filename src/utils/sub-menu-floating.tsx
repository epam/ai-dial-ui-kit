import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import classNames from 'classnames';
import { useState, type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Shared floating state for right-side submenus.
 * Handles open state, Floating UI positioning and hover/dismiss/role interactions.
 */
export function useSubMenuFloating(
  gap: number,
  ariaRole: 'menu' | 'listbox' = 'menu',
  disabled = false,
) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: 'right-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ mainAxis: 0, crossAxis: -4 }),
      flip({ padding: gap }),
      shift({ padding: gap }),
    ],
  });

  const hover = useHover(context, {
    enabled: !disabled,
    move: false,
    delay: { open: 80, close: 80 },
  });
  const dismiss = useDismiss(context, { bubbles: true });
  const role = useRole(context, { role: ariaRole });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    dismiss,
    role,
  ]);

  return {
    isOpen,
    refs,
    floatingStyles,
    context,
    getReferenceProps,
    getFloatingProps,
  };
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

interface SubMenuPanelProps {
  refs: ReturnType<typeof useSubMenuFloating>['refs'];
  floatingStyles: ReturnType<typeof useSubMenuFloating>['floatingStyles'];
  context: ReturnType<typeof useSubMenuFloating>['context'];
  getFloatingProps: ReturnType<typeof useSubMenuFloating>['getFloatingProps'];
  role: 'menu' | 'listbox';
  /** Extra classes appended to the default floating container classes. */
  className?: string;
  children: ReactNode;
}

/**
 * Shared floating panel wrapper (FloatingPortal → FloatingFocusManager → container div).
 * Used by DropdownSubMenuItem and SelectSubMenuItem.
 */
export const SubMenuPanel = ({
  refs,
  floatingStyles,
  context,
  getFloatingProps,
  role,
  className,
  children,
}: SubMenuPanelProps) => (
  <FloatingPortal>
    <FloatingFocusManager
      context={context}
      modal={false}
      initialFocus={-1}
      returnFocus={false}
    >
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        role={role}
        className={classNames(
          'z-[53] overflow-auto rounded bg-layer-0 text-primary shadow focus-visible:outline-none',
          className,
        )}
        {...getFloatingProps()}
      >
        {children}
      </div>
    </FloatingFocusManager>
  </FloatingPortal>
);
