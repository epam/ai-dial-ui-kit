import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import classNames from 'classnames';
import {
  useCallback,
  useEffect,
  useState,
  type HTMLProps,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { useThemeScope } from '@/components/New/ThemeScope/ThemeScope';

// ---------------------------------------------------------------------------
// Keyboard helpers
// ---------------------------------------------------------------------------

/** Rows a submenu's keyboard navigation moves focus between. */
const SUB_MENU_OPTION_SELECTOR =
  '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="option"]';

/** Keys that move focus between a submenu's rows. */
const SUB_MENU_NAV_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

const getEnabledOptions = (container: HTMLElement): HTMLElement[] =>
  Array.from(
    container.querySelectorAll<HTMLElement>(SUB_MENU_OPTION_SELECTOR),
  ).filter(
    (el) =>
      !el.hasAttribute('disabled') &&
      el.getAttribute('aria-disabled') !== 'true',
  );

const isRtl = (el: Element): boolean =>
  el.ownerDocument.defaultView?.getComputedStyle(el).direction === 'rtl';

/* The inline-end arrow opens a submenu and the inline-start one closes it, so
   both flip with the writing direction. */
const getOpenKey = (el: Element): string =>
  isRtl(el) ? 'ArrowLeft' : 'ArrowRight';
const getCloseKey = (el: Element): string =>
  isRtl(el) ? 'ArrowRight' : 'ArrowLeft';

/* Caret and Home/End keys belong to a text field the submenu may host (e.g. a
   search input), so the panel leaves them alone there. */
const isTextField = (el: EventTarget): boolean =>
  el instanceof HTMLElement &&
  (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);

const nextSubMenuOptionIndex = (
  key: string,
  currentIndex: number,
  length: number,
): number => {
  if (key === 'Home') return 0;
  if (key === 'End') return length - 1;

  const step = key === 'ArrowDown' ? 1 : -1;
  if (currentIndex === -1) return step === 1 ? 0 : length - 1;
  return (currentIndex + step + length) % length;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface SubMenuHoverOptions {
  delay?: number | { open?: number; close?: number };
  move?: boolean;
}

/**
 * Shared floating state for right-side submenus.
 * Handles open state, Floating UI positioning, hover/dismiss/role interactions,
 * and the menu keyboard pattern: the inline-end arrow, Enter, or Space on the
 * trigger opens the submenu and focuses its first row; ArrowUp/ArrowDown/Home/End
 * move between its rows; the inline-start arrow closes it back to the trigger.
 */
export function useSubMenuFloating(
  gap: number,
  ariaRole: 'menu' | 'listbox' = 'menu',
  disabled = false,
  hoverOptions?: SubMenuHoverOptions,
) {
  const [isOpen, setIsOpen] = useState(false);
  const nodeId = useFloatingNodeId();

  const { refs, elements, floatingStyles, context } = useFloating({
    nodeId,
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
    /* Lets the pointer travel into a nested floating element — an
       InteractiveTooltip anchored to this menu's trigger or a child row —
       without closing this menu; requires the `FloatingTree`/`FloatingNode`
       wiring the trigger's own `nodeId` connects to. */
    handleClose: safePolygon(),
    delay: hoverOptions?.delay ?? { open: 80, close: 80 },
  });
  const click = useClick(context, { enabled: !disabled });
  const dismiss = useDismiss(context, {
    bubbles: { escapeKey: false, outsidePress: true },
  });
  const role = useRole(context, { role: ariaRole });

  const {
    getReferenceProps: getInteractionReferenceProps,
    getFloatingProps: getInteractionFloatingProps,
  } = useInteractions([hover, click, dismiss, role]);

  /*
   * Set by a keyboard open so focus lands on the first row once the panel has
   * mounted: the panel renders through a portal, so its element only exists a
   * commit after `isOpen` flips.
   */
  const [shouldFocusFirstOption, setShouldFocusFirstOption] = useState(false);
  const floatingElement = elements.floating;

  useEffect(() => {
    if (!isOpen || !shouldFocusFirstOption || floatingElement == null) return;
    getEnabledOptions(floatingElement)[0]?.focus();
    setShouldFocusFirstOption(false);
  }, [isOpen, shouldFocusFirstOption, floatingElement]);

  const handleReferenceKeyDown = useCallback(
    (event: KeyboardEvent<Element>) => {
      if (disabled) return;
      const isOpenKey =
        event.key === getOpenKey(event.currentTarget) ||
        event.key === 'Enter' ||
        event.key === ' ';
      if (!isOpenKey) return;

      /* Keeps the native button click (and `useClick`'s toggle) from closing
         an already-open submenu: a keyboard open always opens. */
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(true);
      setShouldFocusFirstOption(true);
    },
    [disabled],
  );

  const handleFloatingKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.defaultPrevented || isTextField(event.target)) return;

      if (event.key === getCloseKey(event.currentTarget)) {
        event.preventDefault();
        event.stopPropagation();
        setIsOpen(false);
        (refs.domReference.current as HTMLElement | null)?.focus();
        return;
      }

      if (!SUB_MENU_NAV_KEYS.includes(event.key)) return;

      /* Consumed even with no rows to move to, so the key never reaches the
         parent menu, which would move focus out of this panel. */
      event.preventDefault();
      event.stopPropagation();
      const options = getEnabledOptions(event.currentTarget);
      if (options.length === 0) return;

      const focused = event.currentTarget.ownerDocument.activeElement;
      const currentIndex = options.findIndex((el) => el === focused);
      options[
        nextSubMenuOptionIndex(event.key, currentIndex, options.length)
      ]?.focus();
    },
    [refs.domReference],
  );

  const getReferenceProps = useCallback(
    (userProps?: HTMLProps<Element>) =>
      getInteractionReferenceProps({
        ...userProps,
        onKeyDown: handleReferenceKeyDown,
      }),
    [getInteractionReferenceProps, handleReferenceKeyDown],
  );

  const getFloatingProps = useCallback(
    (userProps?: HTMLProps<HTMLElement>) =>
      getInteractionFloatingProps({
        ...userProps,
        onKeyDown: handleFloatingKeyDown,
      }),
    [getInteractionFloatingProps, handleFloatingKeyDown],
  );

  return {
    isOpen,
    nodeId,
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
}: SubMenuPanelProps) => {
  const themeScope = useThemeScope();

  return (
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
            'z-floating overflow-auto text-primary focus-visible:outline-none',
            surfaceClassName ?? subMenuSurfaceClassName,
            themeScope,
            className,
          )}
          {...getFloatingProps()}
        >
          {children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};
