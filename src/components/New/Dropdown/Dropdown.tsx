import {
  FloatingFocusManager,
  FloatingPortal,
  autoPlacement,
  autoUpdate,
  flip,
  offset,
  shift,
  size as fuiSize,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import type {
  OpenChangeReason,
  Placement,
  ReferenceElement,
} from '@floating-ui/react';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FC,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { DropdownTrigger, DropdownItemType } from '@/types/dropdown';

import {
  dropdownBaseClassName,
  dropdownListBaseClassName,
  dropdownItemBaseClassName,
  dropdownItemDisabledClassName,
  dropdownItemDangerClassName,
  dropdownDividerClassName,
  dropdownGap,
} from './constants';
import { type DropdownItem } from '@/models/dropdown';
import { CloseButton } from '@/components/New/CloseButton/CloseButton';

import { mergeClasses } from '@/utils/merge-classes';
import { DropdownSubMenuItem } from './DropdownSubMenuItem';

export interface DropdownProps {
  children: ReactNode;
  items?: DropdownItem[];
  onItemClick?: (info: { key: string; domEvent: MouseEvent }) => void;
  menuHeader?: ReactNode | (() => ReactNode);
  menuFooter?: ReactNode | (() => ReactNode);
  renderOverlay?: () => ReactNode;
  trigger?: DropdownTrigger[];
  placement?: Placement;
  allowedPlacements?: Placement[];
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closable?: boolean;
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  overlayContentClassName?: string;
  separatorClassName?: string;
  listClassName?: string;
  outsidePressIgnoreRef?: RefObject<HTMLElement | null>;
  outsideClosable?: boolean;
  anchorToMouse?: boolean;
  matchReferenceWidth?: boolean;
  maxDropdownHeight?: number | null;
}

/**
 * Options the overlay's arrow keys walk through. Both roles are arrow-navigated
 * per ARIA: `menuitem` covers this component's own item list, `option` covers a
 * listbox rendered through `renderOverlay` (`Select` builds on this component).
 */
const OVERLAY_OPTION_SELECTOR = '[role="menuitem"], [role="option"]';

const isEnabledOption = (el: HTMLElement): boolean =>
  !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true';

/** Keys that move focus between overlay options. */
const OVERLAY_NAV_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

/**
 * Index the given key moves to. Arrow keys wrap around, and starting from
 * outside the option list (`currentIndex` of -1, e.g. focus still on a search
 * field) enters it from the end the key points at.
 */
const nextOptionIndex = (
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

const getRefWidth = (el: ReferenceElement): number => {
  if ('clientWidth' in el) return (el as Element).clientWidth;
  const rect = (
    el as { getBoundingClientRect?: () => DOMRect }
  ).getBoundingClientRect?.();
  return rect?.width ?? 0;
};

/**
 *
 * Renders the given trigger (`children`) and a floating contextual menu overlay.
 * aliases: ContextMenu|PopupMenu
 * Design system 2.0
 *
 * Supports click/hover/contextMenu triggers, controlled/uncontrolled open, and an optional
 * close button inside the overlay. Placement is taken directly from Floating UI; when
 * `placement` is **undefined** (default), automatic placement is handled by `autoPlacement`.
 *
 * @example
 * ```tsx
 * // Simple items menu
 * <Dropdown items={[{ key: 'profile', label: 'Profile' }, { key: 'logout', label: 'Logout' }]}>
 *   <button type="button" className="px-3 py-2 rounded border">Open</button>
 * </Dropdown>
 *
 * // Hover trigger
 * <Dropdown trigger={[DropdownTrigger.Hover]} placement="bottom-end" items={items}>
 *   <button type="button" className="px-3 py-2 rounded border">Hover me</button>
 * </Dropdown>
 *
 * // Custom overlay content
 * <Dropdown closable renderOverlay={() => <div className="p-3">Custom content</div>}>
 *   <button type="button" className="px-3 py-2 rounded border">Custom</button>
 * </Dropdown>
 * ```
 *
 * @param children - Trigger element(s) to anchor and open the menu
 * @param [items] - Menu items to render
 * @param [onItemClick] - Global handler fired when any item is clicked
 * @param [menuHeader] - Content rendered above the items list
 * @param [menuFooter] - Content rendered below the items list
 * @param [renderOverlay] - Render function for fully custom overlay content (ignored when `items` is provided)
 * @param [trigger=[DropdownTrigger.Click]] - Interactions that open the menu
 * @param [placement] - Floating UI placement string; when omitted, auto placement is used
 * @param [allowedPlacements] - Restricts the allowed placements
 * @param [disabled=false] - Disables interaction and prevents opening
 * @param [open] - Controlled open state (when provided, `defaultOpen` is ignored)
 * @param [defaultOpen=false] - Initial open state in uncontrolled mode
 * @param [onOpenChange] - Fired whenever the open state changes
 * @param [closable=false] - Whether the overlay shows an internal close button
 * @param [onClose] - Fired when the close button inside the overlay is clicked
 * @param [className] - Additional CSS classes applied to the trigger wrapper
 * @param [overlayContentClassName] - Additional CSS classes applied to the overlay content
 * @param [separatorClassName] - Additional CSS classes applied to the separators between items
 * @param [listClassName] - Additional CSS classes applied to the floating overlay
 * @param [outsidePressIgnoreRef] - Ref to an element that should not trigger outside press behavior
 * @param [outsideClosable=true] - Whether clicks outside the overlay should close it
 * @param [anchorToMouse=false] - Whether to anchor the dropdown to the mouse position
 * @param [matchReferenceWidth=true] - Whether to match the reference element's width
 * @param [maxDropdownHeight] - Maximum height of the dropdown menu; when omitted, no limit is applied
 */
export const Dropdown: FC<DropdownProps> = ({
  children,
  items,
  onItemClick,
  menuHeader,
  menuFooter,
  renderOverlay,
  trigger = [DropdownTrigger.Click],
  placement,
  disabled = false,
  open,
  defaultOpen = false,
  onOpenChange,
  closable = false,
  onClose,
  className,
  overlayContentClassName,
  separatorClassName,
  listClassName,
  outsidePressIgnoreRef,
  outsideClosable = true,
  allowedPlacements,
  anchorToMouse = false,
  matchReferenceWidth = true,
  maxDropdownHeight,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? !!open : uncontrolledOpen;
  const pointedElementRef = useRef<Element | null>(null);

  /*
   * A hover-opened menu must not pull focus: the pointer is elsewhere and the
   * user may well be typing. Every other way in — a click, Enter/Space on the
   * trigger, the context menu, a controlled `open` flip — is deliberate, so the
   * overlay claims focus and a keyboard user lands on its first control instead
   * of being left on a trigger whose menu they cannot reach.
   */
  const [shouldFocusOverlay, setShouldFocusOverlay] = useState(true);

  const setOpen = useCallback(
    (next: boolean, _event?: Event, reason?: OpenChangeReason) => {
      if (next) {
        setShouldFocusOverlay(reason !== 'hover' && reason !== 'safe-polygon');
      }
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const listId = useId();
  const useAuto = placement === undefined;

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ mainAxis: dropdownGap, crossAxis: 0 }),
      useAuto
        ? autoPlacement({
            alignment: 'start',
            crossAxis: true,
            padding: dropdownGap,
            allowedPlacements,
          })
        : flip({ padding: dropdownGap }),
      shift({ padding: dropdownGap }),
      fuiSize({
        padding: dropdownGap,
        apply({ availableWidth, availableHeight, elements }) {
          const floating = elements.floating as HTMLElement;
          const refWidth = getRefWidth(elements.reference);

          floating.style.setProperty(
            '--fui-available-height',
            `${Math.floor(availableHeight)}px`,
          );
          floating.style.setProperty(
            '--reference-width',
            matchReferenceWidth ? `${Math.round(refWidth)}px` : '0px',
          );

          if (matchReferenceWidth) {
            floating.style.minWidth = `${Math.round(refWidth)}px`;
          } else {
            floating.style.removeProperty('min-width');
          }

          floating.style.maxWidth = `${Math.floor(availableWidth)}px`;
          const heightLimit = Math.floor(availableHeight);
          floating.style.maxHeight = `${maxDropdownHeight ? Math.min(heightLimit, maxDropdownHeight) : heightLimit}px`;
        },
      }),
    ],
  });

  const click = useClick(context, {
    enabled: trigger.includes(DropdownTrigger.Click) && !disabled,
  });

  const hover = useHover(context, {
    enabled: trigger.includes(DropdownTrigger.Hover) && !disabled,
    move: false,
    restMs: 40,
    delay: { open: 80, close: 80 },
  });

  const dismiss = useDismiss(context, {
    bubbles: true,
    referencePress: false,
    outsidePress: (event) => {
      if (!outsideClosable) return false;
      const target = event.target;
      if (
        outsidePressIgnoreRef?.current &&
        target instanceof Node &&
        outsidePressIgnoreRef.current.contains(target)
      ) {
        return false;
      }
      return true;
    },
  });

  const role = useRole(context, { role: 'menu' });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    hover,
    dismiss,
    role,
  ]);

  const setPositionFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      refs.setPositionReference({
        getBoundingClientRect: () =>
          ({
            width: 0,
            height: 0,
            x: clientX,
            y: clientY,
            top: clientY,
            left: clientX,
            right: clientX,
            bottom: clientY,
          }) as DOMRect,
      });
    },
    [refs],
  );

  const onContextMenu = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!trigger.includes(DropdownTrigger.ContextMenu) || disabled) return;
      e.preventDefault();
      if (anchorToMouse) {
        setPositionFromPointer(e.clientX, e.clientY);
        pointedElementRef.current = document.elementFromPoint(
          e.clientX,
          e.clientY,
        );
      }
      setOpen(true);
    },
    [anchorToMouse, disabled, setOpen, setPositionFromPointer, trigger],
  );

  const onPointerDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!anchorToMouse || disabled) return;

      if (trigger.includes(DropdownTrigger.ContextMenu) && isOpen) {
        setOpen(false);
      }

      setPositionFromPointer(e.clientX, e.clientY);
      pointedElementRef.current = document.elementFromPoint(
        e.clientX,
        e.clientY,
      );
    },
    [anchorToMouse, disabled, setPositionFromPointer, isOpen, trigger, setOpen],
  );

  useEffect(() => {
    if (disabled && isOpen) setOpen(false);
  }, [disabled, isOpen, setOpen]);

  /*
   * Arrow-key movement between the overlay's options, with Home/End for the
   * ends. A `menu` is expected to be arrow-navigated, and neither the item list
   * below nor a `renderOverlay` listbox wires that up on its own — Tab alone
   * leaves the overlay after the last option instead of cycling.
   *
   * Bails out on an already-handled key so an overlay that navigates itself
   * (its handler runs first, in the capture phase, and calls `preventDefault`)
   * is not moved a second time.
   */
  const handleFloatingKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.defaultPrevented) return;
      if (!OVERLAY_NAV_KEYS.includes(event.key)) return;

      const options = Array.from(
        event.currentTarget.querySelectorAll<HTMLElement>(
          OVERLAY_OPTION_SELECTOR,
        ),
      ).filter(isEnabledOption);
      if (options.length === 0) return;

      event.preventDefault();
      const focused = event.currentTarget.ownerDocument.activeElement;
      const currentIndex = options.findIndex((el) => el === focused);
      options[
        nextOptionIndex(event.key, currentIndex, options.length)
      ]?.focus();
    },
    [],
  );

  const handleItemClick = useCallback(
    (item: DropdownItem) => (e: MouseEvent) => {
      if (item.disabled) return;
      item.onClick?.({ key: item.key, domEvent: e });
      onItemClick?.({ key: item.key, domEvent: e });
      setOpen(false);
    },
    [onItemClick, setOpen],
  );

  const overlayContent: ReactNode = useMemo(() => {
    if (renderOverlay) return renderOverlay();
    if (!items) return null;

    return (
      <>
        {menuHeader && (
          <>{typeof menuHeader === 'function' ? menuHeader() : menuHeader}</>
        )}

        <div
          role="none"
          className={mergeClasses('py-1', overlayContentClassName)}
          aria-label="dropdown"
        >
          {items.map((it) => {
            if (it.type === DropdownItemType.Divider) {
              return (
                <div
                  key={it.key}
                  role="separator"
                  className={mergeClasses(
                    dropdownDividerClassName,
                    separatorClassName,
                  )}
                />
              );
            }
            if (it.type === DropdownItemType.PlainText) {
              return (
                <div
                  key={it.key}
                  className={mergeClasses(
                    'px-3 py-2 text-secondary dial-caption-text',
                    it.className,
                  )}
                >
                  {it.label}
                </div>
              );
            }
            if (it.children?.length) {
              return (
                <DropdownSubMenuItem
                  key={it.key}
                  item={it}
                  onRootClose={() => setOpen(false)}
                />
              );
            }
            return (
              <button
                key={it.key}
                role="menuitem"
                type="button"
                aria-disabled={!!it.disabled}
                className={mergeClasses(
                  dropdownItemBaseClassName,
                  it.disabled && dropdownItemDisabledClassName,
                  it.danger && dropdownItemDangerClassName,
                  it.className,
                )}
                disabled={it.disabled}
                onClick={handleItemClick(it)}
              >
                {it.renderItem ? (
                  it.renderItem(it)
                ) : (
                  <>
                    {it.icon && (
                      <span
                        className={mergeClasses(
                          it.danger && 'text-error',
                          it.disabled && 'text-secondary',
                        )}
                      >
                        <DialIcon icon={it.icon} />
                      </span>
                    )}
                    <span
                      className={mergeClasses(
                        'flex-1 truncate text-start',
                        it.danger && 'text-error',
                        it.disabled && 'text-secondary',
                      )}
                    >
                      {it.label}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {menuFooter && (
          <>{typeof menuFooter === 'function' ? menuFooter() : menuFooter}</>
        )}
      </>
    );
  }, [
    handleItemClick,
    items,
    menuFooter,
    menuHeader,
    renderOverlay,
    setOpen,
    overlayContentClassName,
    separatorClassName,
  ]);

  const referenceProps = getReferenceProps({
    onContextMenu,
    onMouseDown: onPointerDown,
  });

  useEffect(() => {
    if (!isOpen) return;

    const refEl = refs.reference.current;
    let targetEl: Element | null = null;

    if (refEl instanceof Element) {
      targetEl = refEl;
    } else if (pointedElementRef.current instanceof Element) {
      targetEl = pointedElementRef.current;
    }

    if (!targetEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setOpen(false);
      },
      { root: null, threshold: 0 },
    );

    observer.observe(targetEl);

    return () => observer.disconnect();
  }, [isOpen, refs.reference, setOpen]);

  return (
    <>
      <span
        ref={refs.setReference}
        className={mergeClasses(
          dropdownBaseClassName,
          disabled && '!cursor-not-allowed opacity-75',
          className,
        )}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={listId}
        {...referenceProps}
      >
        {children}
      </span>

      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager
            context={context}
            modal={false}
            /* 0 puts focus on the overlay's first control, falling back to the
               overlay itself when it holds none; -1 leaves focus where it is,
               which is only right for a menu the pointer opened on hover. */
            initialFocus={shouldFocusOverlay ? 0 : -1}
            returnFocus
          >
            <div
              id={listId}
              ref={refs.setFloating}
              style={floatingStyles}
              className={mergeClasses(
                dropdownListBaseClassName,
                !matchReferenceWidth && 'w-max',
                listClassName,
              )}
              {...getFloatingProps({ onKeyDown: handleFloatingKeyDown })}
            >
              {closable && (
                <div className="flex items-center justify-between px-2 pt-2">
                  <CloseButton
                    ariaLabel="Close dropdown"
                    onClose={(e) => {
                      onClose?.(e);
                      setOpen(false);
                    }}
                  />
                </div>
              )}
              {overlayContent}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
};
