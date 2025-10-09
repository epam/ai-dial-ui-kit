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
  useState,
  type FC,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { IconX } from '@tabler/icons-react';

import { DialButton } from '@/components/Button/Button';
import { DialIcon } from '@/components/Icon/Icon';
import { DropdownTrigger } from '@/types/dropdown';

import {
  dropdownBaseClasses,
  dropdownListBaseClasses,
  dropdownItemBaseClasses,
  dropdownItemDisabledClasses,
  dropdownItemDangerClasses,
  dropdownDividerClasses,
  dropdownGap,
} from './constants';

export type Key = string;

export interface DropdownItem {
  key: Key;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  type?: 'item' | 'divider';
  onClick?: (info: { key: Key; domEvent: MouseEvent }) => void;
}

export interface DropdownMenuProps {
  items: DropdownItem[];
  onClick?: (info: { key: Key; domEvent: MouseEvent }) => void;
}

export interface DialDropdownProps {
  children: ReactNode;
  menu?: DropdownMenuProps;
  renderOverlay?: () => ReactNode;
  trigger?: DropdownTrigger[];
  placement?: Placement;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closable?: boolean;
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
  cssClass?: string;
  listClassName?: string;
  outsidePressIgnoreRef?: RefObject<HTMLElement | null>;
  outsideClosable?: boolean;
}

/**
 *
 * Renders the given trigger (`children`) and a floating contextual menu overlay.
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
 * @param [disabled=false] - Disables interaction and prevents opening
 * @param [open] - Controlled open state (when provided, `defaultOpen` is ignored)
 * @param [defaultOpen=false] - Initial open state in uncontrolled mode
 * @param [onOpenChange] - Fired whenever the open state changes
 * @param [closable=false] - Whether the overlay shows an internal close button
 * @param [onClose] - Fired when the close button inside the overlay is clicked
 * @param [cssClass] - Additional CSS classes applied to the trigger wrapper
 * @param [listClassName] - Additional CSS classes applied to the floating overlay
 * @param [outsidePressIgnoreRef] - Ref to an element that should not trigger outside press behavior
 * @param [outsideClosable=true] - Whether clicks outside the overlay should close it
 */
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
  cssClass,
  listClassName,
  outsidePressIgnoreRef,
  outsideClosable = true,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? !!open : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const listId = useId();

  const getRefWidth = (el: ReferenceElement | null): number => {
    if (!el) return 0;
    if ('clientWidth' in el) return (el as Element).clientWidth;
    const rect = (
      el as { getBoundingClientRect?: () => DOMRect }
    ).getBoundingClientRect?.();
    return rect?.width ?? 0;
  };

  const useAuto = placement === undefined;

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ mainAxis: dropdownGap, crossAxis: 0 }),
      useAuto
        ? autoPlacement({ alignment: 'start', crossAxis: true, padding: 8 })
        : flip({ padding: 8 }),
      shift({ padding: 8 }),
      fuiSize({
        apply({ availableWidth, elements }) {
          const refWidth = getRefWidth(elements.reference);
          elements.floating.style.setProperty(
            '--reference-width',
            `${refWidth}px`,
          );
          elements.floating.style.maxWidth = `${availableWidth}px`;
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

  const onContextMenu = (e: MouseEvent) => {
    if (!trigger.includes(DropdownTrigger.ContextMenu) || disabled) return;
    e.preventDefault();
    setOpen(true);
  };

  useEffect(() => {
    if (disabled && isOpen) setOpen(false);
  }, [disabled, isOpen, setOpen]);

  const handleItemClick = (item: DropdownItem) => (e: MouseEvent) => {
    if (item.disabled) return;
    item.onClick?.({ key: item.key, domEvent: e });
    menu?.onClick?.({ key: item.key, domEvent: e });
    setOpen(false);
  };

  const overlayContent: ReactNode = renderOverlay
    ? renderOverlay()
    : menu && (
        <div role="none" className="py-1">
          {menu.items.map((it) => {
            if (it.type === 'divider') {
              return (
                <div
                  key={it.key}
                  role="separator"
                  className={dropdownDividerClasses}
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
                  dropdownItemBaseClasses,
                  it.disabled && dropdownItemDisabledClasses,
                  it.danger && dropdownItemDangerClasses,
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
                >
                  {it.label}
                </span>
              </button>
            );
          })}
        </div>
      );

  return (
    <>
      <span
        ref={refs.setReference}
        className={classNames(
          dropdownBaseClasses,
          disabled && 'cursor-not-allowed opacity-60',
          cssClass,
        )}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={listId}
        onContextMenu={onContextMenu}
        {...getReferenceProps()}
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
              className={classNames(dropdownListBaseClasses, listClassName)}
              {...getFloatingProps()}
            >
              {closable && (
                <div className="flex items-center justify-between px-2 pt-2">
                  <DialButton
                    cssClass="ml-auto text-secondary hover:text-primary"
                    ariaLabel="Close dropdown"
                    iconBefore={<IconX size={16} />}
                    onClick={(e) => {
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
