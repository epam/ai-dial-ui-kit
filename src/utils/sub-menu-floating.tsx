import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
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

export interface SubMenuHoverOptions {
  delay?: number | { open?: number; close?: number };
  move?: boolean;
}

/**
 * Shared floating state for right-side submenus.
 * Handles open state, Floating UI positioning and hover/dismiss/role interactions.
 */
export function useSubMenuFloating(
  gap: number,
  ariaRole: 'menu' | 'listbox' = 'menu',
  disabled = false,
  hoverOptions?: SubMenuHoverOptions,
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
    move: hoverOptions?.move ?? false,
    delay: hoverOptions?.delay ?? { open: 80, close: 80 },
  });
  const click = useClick(context, { enabled: !disabled });
  const dismiss = useDismiss(context, {
    bubbles: { escapeKey: false, outsidePress: true },
  });
  const role = useRole(context, { role: ariaRole });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    click,
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
  /**
   * Replaces the surface tokens — radius, background, shadow, inset. The 2.0
   * menus pass their own overlay surface so a submenu is the same object as the
   * panel that opened it; the 1.0 menus keep the default.
   */
  surfaceClassName?: string;
  /** Extra classes appended to the default floating container classes. */
  className?: string;
  children: ReactNode;
}

/** Surface of the 1.0 submenus, kept as the default for their sake. */
const subMenuSurfaceClassName = 'rounded bg-layer-0 shadow';

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
  surfaceClassName,
  className,
  children,
}: SubMenuPanelProps) => (
  <FloatingPortal>
    <FloatingFocusManager
      context={context}
      modal={false}
      initialFocus={-1}
      returnFocus
    >
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        role={role}
        className={classNames(
          'z-[53] overflow-auto text-primary focus-visible:outline-none',
          surfaceClassName ?? subMenuSurfaceClassName,
          className,
        )}
        {...getFloatingProps()}
      >
        {children}
      </div>
    </FloatingFocusManager>
  </FloatingPortal>
);
