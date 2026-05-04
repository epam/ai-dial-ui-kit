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
import type { Placement, ReferenceElement } from '@floating-ui/react';
import classNames from 'classnames';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FC,
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
  submenuCaretIcon,
} from './constants';
import { type DropdownItem } from '@/models/dropdown';
import { DialCloseButton } from '@/components/CloseButton/CloseButton';

import { mergeClasses } from '@/utils/merge-classes';
import { useSubMenuFloating, SubMenuPanel } from '@/utils/sub-menu-floating';

// ---------------------------------------------------------------------------
// Sub-menu item
// ---------------------------------------------------------------------------

interface DropdownSubMenuItemProps {
  item: DropdownItem;
  /** Close the root dropdown when a leaf child is selected. */
  onRootClose: () => void;
}

const DropdownSubMenuItem: FC<DropdownSubMenuItemProps> = ({
  item,
  onRootClose,
}) => {
  const {
    isOpen,
    refs,
    floatingStyles,
    context,
    getReferenceProps,
    getFloatingProps,
  } = useSubMenuFloating(dropdownGap, 'menu', !!item.disabled);

  const handleChildClick = useCallback(
    (child: DropdownItem) => (e: MouseEvent) => {
      if (child.disabled) return;
      child.onClick?.({ key: child.key, domEvent: e });
      onRootClose();
    },
    [onRootClose],
  );

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-disabled={!!item.disabled}
        disabled={item.disabled}
        className={classNames(
          dropdownItemBaseClassName,
          item.disabled && dropdownItemDisabledClassName,
          item.className,
        )}
        {...getReferenceProps()}
      >
        {item.icon && (
          <span className={classNames(item.disabled && 'text-secondary')}>
            <DialIcon icon={item.icon} />
          </span>
        )}
        <span
          className={classNames(
            'flex-1 truncate text-left',
            item.disabled && 'text-secondary',
          )}
        >
          {item.label}
        </span>
        <span
          className={classNames(
            'ml-auto shrink-0',
            item.disabled && 'text-secondary',
          )}
        >
          {submenuCaretIcon}
        </span>
      </button>

      {isOpen && (
        <SubMenuPanel
          refs={refs}
          floatingStyles={floatingStyles}
          context={context}
          getFloatingProps={getFloatingProps}
          role="menu"
          className="w-max"
        >
          <div role="none" className="py-1">
            {item.children!.map((child) => (
              <button
                key={child.key}
                role="menuitem"
                type="button"
                aria-disabled={!!child.disabled}
                disabled={child.disabled}
                className={classNames(
                  dropdownItemBaseClassName,
                  child.disabled && dropdownItemDisabledClassName,
                  child.danger && dropdownItemDangerClassName,
                  child.className,
                )}
                onClick={handleChildClick(child)}
              >
                {child.icon && (
                  <span
                    className={classNames(
                      child.danger && 'text-error',
                      child.disabled && 'text-secondary',
                    )}
                  >
                    <DialIcon icon={child.icon} />
                  </span>
                )}
                <span
                  className={classNames(
                    'flex-1 truncate text-left',
                    child.danger && 'text-error',
                    child.disabled && 'text-secondary',
                  )}
                >
                  {child.label}
                </span>
              </button>
            ))}
          </div>
        </SubMenuPanel>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------
// Main Dropdown
// ---------------------------------------------------------------------------

export interface DropdownMenuProps {
  items: DropdownItem[];
  onClick?: (info: { key: string; domEvent: MouseEvent }) => void;
  header?: ReactNode | (() => ReactNode);
  footer?: ReactNode | (() => ReactNode);
}

export interface DialDropdownProps {
  children: ReactNode;
  menu?: DropdownMenuProps;
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
  listClassName?: string;
  outsidePressIgnoreRef?: RefObject<HTMLElement | null>;
  outsideClosable?: boolean;
  anchorToMouse?: boolean;
  matchReferenceWidth?: boolean;
  maxDropdownHeight?: number | null;
}

/**
 *
 * Renders the given trigger (`children`) and a floating contextual menu overlay.
 * aliases: ContextMenu|PopupMenu
 *
 * Supports click/hover/contextMenu triggers, controlled/uncontrolled open, and an optional
 * close button inside the overlay. Placement is taken directly from Floating UI; when
 * `placement` is **undefined** (default), automatic placement is handled by `autoPlacement`.
 *
 * @example
 * ```tsx
 * // Simple items menu
 * <DialDropdown menu={{ items: [{ key: 'profile', label: 'Profile' }, { key: 'logout', label: 'Logout' }] }}>
 *   <button type="button" className="px-3 py-2 rounded border">Open</button>
 * </DialDropdown>
 *
 * // Hover trigger
 * <DialDropdown trigger={[DropdownTrigger.Hover]} placement="bottom-end" menu={{ items }}>
 *   <button type="button" className="px-3 py-2 rounded border">Hover me</button>
 * </DialDropdown>
 *
 * // Custom overlay content
 * <DialDropdown closable renderOverlay={() => <div className="p-3">Custom content</div>}>
 *   <button type="button" className="px-3 py-2 rounded border">Custom</button>
 * </DialDropdown>
 * ```
 *
 * @param children - Trigger element(s) to anchor and open the menu
 * @param [menu] - Items-based menu definition
 * @param [renderOverlay] - Render function for fully custom overlay content (ignored when `menu` is provided)
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
 * @param [listClassName] - Additional CSS classes applied to the floating overlay
 * @param [outsidePressIgnoreRef] - Ref to an element that should not trigger outside press behavior
 * @param [outsideClosable=true] - Whether clicks outside the overlay should close it
 * @param [anchorToMouse=false] - Whether to anchor the dropdown to the mouse position
 * @param [matchReferenceWidth=false] - Whether to match the reference element's width
 * @param [maxDropdownHeight] - Maximum height of the dropdown menu; when omitted, no limit is applied
 */
const getRefWidth = (el: ReferenceElement): number => {
  if ('clientWidth' in el) return (el as Element).clientWidth;
  const rect = (
    el as { getBoundingClientRect?: () => DOMRect }
  ).getBoundingClientRect?.();
  return rect?.width ?? 0;
};

export const DialDropdown: FC<DialDropdownProps> = ({
  children,
  menu,
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

  const setOpen = useCallback(
    (next: boolean) => {
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

  const handleItemClick = useCallback(
    (item: DropdownItem) => (e: MouseEvent) => {
      if (item.disabled) return;
      item.onClick?.({ key: item.key, domEvent: e });
      menu?.onClick?.({ key: item.key, domEvent: e });
      setOpen(false);
    },
    [menu, setOpen],
  );

  const overlayContent: ReactNode = useMemo(() => {
    if (renderOverlay) return renderOverlay();
    if (!menu) return null;

    return (
      <>
        {menu.header && (
          <>{typeof menu.header === 'function' ? menu.header() : menu.header}</>
        )}

        <div role="none" className="py-1" aria-label="dropdown">
          {menu.items.map((it) => {
            if (it.type === DropdownItemType.Divider) {
              return (
                <div
                  key={it.key}
                  role="separator"
                  className={dropdownDividerClassName}
                />
              );
            }
            if (it.type === DropdownItemType.PlainText) {
              return (
                <div
                  key={it.key}
                  className={mergeClasses(
                    'px-3 py-2 text-secondary dial-caption',
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
                className={classNames(
                  dropdownItemBaseClassName,
                  it.disabled && dropdownItemDisabledClassName,
                  it.danger && dropdownItemDangerClassName,
                  it.className,
                )}
                disabled={it.disabled}
                onClick={handleItemClick(it)}
              >
                {it.icon && (
                  <span
                    className={classNames(
                      it.danger && 'text-error',
                      it.disabled && 'text-secondary',
                    )}
                  >
                    <DialIcon icon={it.icon} />
                  </span>
                )}
                <span
                  className={classNames(
                    'flex-1 truncate text-left',
                    it.danger && 'text-error',
                    it.disabled && 'text-secondary',
                  )}
                  aria-labelledby="item-text"
                >
                  {it.label}
                </span>
              </button>
            );
          })}
        </div>

        {menu.footer && (
          <>{typeof menu.footer === 'function' ? menu.footer() : menu.footer}</>
        )}
      </>
    );
  }, [handleItemClick, menu, renderOverlay, setOpen]);

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
        className={classNames(
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
            initialFocus={-1}
            returnFocus
          >
            <div
              id={listId}
              ref={refs.setFloating}
              style={floatingStyles}
              className={classNames(
                dropdownListBaseClassName,
                !matchReferenceWidth && 'w-max',
                listClassName,
              )}
              {...getFloatingProps()}
            >
              {closable && (
                <div className="flex items-center justify-between px-2 pt-2">
                  <DialCloseButton
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
