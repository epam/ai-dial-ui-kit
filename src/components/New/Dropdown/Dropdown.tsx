import {
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  autoPlacement,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  size as fuiSize,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
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
  cloneElement,
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FC,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';

import { InteractiveTooltip } from '@/components/New/InteractiveTooltip/InteractiveTooltip';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import {
  DropdownTrigger,
  DropdownItemType,
  DropdownOverlayRole,
} from '@/types/dropdown';
import { MenuItemMark } from '@/types/menu-item';

import {
  dropdownBaseClassName,
  dropdownListBaseClassName,
  dropdownDividerClassName,
  dropdownItemListClassName,
  dropdownGap,
  dropdownNoResultsClassName,
  dropdownSearchClassName,
  getDropdownListHeight,
} from './constants';
import { type DropdownItem } from '@/models/dropdown';
import { CloseButton } from '@/components/New/CloseButton/CloseButton';
import { MenuItem } from '@/components/New/MenuItem/MenuItem';
import { Search } from '@/components/New/Search/Search';

import { useThemeScope } from '@/components/New/ThemeScope/ThemeScope';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';
import { DropdownSubMenuItem } from './DropdownSubMenuItem';
import { getItemRole, resolveItemMark } from './item-mark';
import {
  filterDropdownItems,
  highlightDropdownItems,
  type DropdownItemFilter,
} from './search';

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
  /**
   * Inline style for the floating overlay. The overlay renders in a portal, so
   * this is the only way to hand it CSS custom properties from a caller's own
   * scope — e.g. theme variables that its rows and header read. Positioning
   * stays the dropdown's own: `floatingStyles` is applied on top of it.
   */
  listStyle?: CSSProperties;
  outsidePressIgnoreRef?: RefObject<HTMLElement | null>;
  outsideClosable?: boolean;
  anchorToMouse?: boolean;
  matchReferenceWidth?: boolean;
  maxDropdownHeight?: number | null;
  /**
   * Initial focus inside the overlay on open, forwarded to
   * `FloatingFocusManager`'s `initialFocus`. `0` focuses the first tabbable
   * element (menu behavior); `-1` leaves focus where it is (typeahead
   * behavior, e.g. a `/`-command menu opened from a textarea). When omitted,
   * defaults to menu behavior for click/context opens and to `-1` for hover
   * opens, matching the pre-existing behavior.
   */
  initialFocus?: 0 | -1 | RefObject<HTMLElement | null>;
  /**
   * Whether closing the overlay moves focus back to the trigger: on Escape, a
   * chosen item, the close button or a controlled `open` flip. Focus that has
   * already left the overlay is left where it went — an outside press on
   * another control, or an item whose action focuses something else (e.g. a
   * rename field). Defaults to `true`.
   */
  returnFocus?: boolean;
  /**
   * Role of the floating overlay, and with it the trigger's `aria-haspopup`.
   * Applies to `renderOverlay` content only: the `items` list is always a
   * menu. Arrow-key movement between options runs for `Menu` only; a `Dialog`
   * or `None` overlay owns its keys. Defaults to `DropdownOverlayRole.Menu`.
   */
  overlayRole?: DropdownOverlayRole;
  /**
   * Accessible name of the overlay. Ignored with `DropdownOverlayRole.None`,
   * whose role-less wrapper cannot be named. With neither this nor
   * `overlayAriaLabelledBy`, a menu or a dialog is named by its trigger.
   */
  overlayAriaLabel?: string;
  /**
   * Id of the element that names the overlay, typically a heading inside
   * `renderOverlay`. Wins over `overlayAriaLabel`. Ignored with
   * `DropdownOverlayRole.None`.
   */
  overlayAriaLabelledBy?: string;
  /**
   * Puts a search field above `items` that narrows them as the user types and
   * highlights the match in each remaining label. The query is cleared when
   * the menu closes.
   */
  searchable?: boolean;
  /** Controlled query of the search field; when omitted, the dropdown keeps its own. */
  searchValue?: string;
  /** Fired with every edit of the search field, and with `''` when the menu closes. */
  onSearchChange?: (value: string) => void;
  /** Placeholder and accessible name of the search field. */
  searchPlaceholder?: string;
  /** Accessible name of the search field's clear button. */
  searchClearLabel?: string;
  /** Text shown, and announced, when the query leaves no items. */
  noResultsLabel?: string;
  /**
   * Decides whether an item matches the query, which arrives trimmed and
   * lower-cased. Defaults to a substring match on a string `label`. A submenu
   * whose own row matches keeps all its children; otherwise it keeps only the
   * matching ones, and disappears when none do.
   */
  filterItem?: DropdownItemFilter;
  /**
   * Number of rows the item list shows before it scrolls. The cap applies to
   * the list alone, so a search field or header stays in view above it.
   */
  maxVisibleItems?: number;
}

/**
 * Options the overlay's arrow keys walk through. All three roles are
 * arrow-navigated per ARIA: `menuitem`, `menuitemcheckbox` and
 * `menuitemradio` cover this
 * component's own item list, `option` covers a listbox rendered through
 * `renderOverlay` (`Select` builds on this component).
 */
const OVERLAY_OPTION_SELECTOR =
  '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="option"]';

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
 * A menu of **actions or navigation options**, opened from a trigger. It is not
 * the control for picking a value out of a list — a country, a sort order, a
 * filter — which is what {@link Select} is for.
 *
 * Supports click/hover/contextMenu triggers, controlled/uncontrolled open, and an optional
 * close button inside the overlay. Placement is taken directly from Floating UI; when
 * `placement` is **undefined** (default), automatic placement is handled by `autoPlacement`.
 *
 * A chosen row is marked through the item's `mark`: the design draws a menu's
 * single-select and multiselect the same way, with a check at the trailing edge
 * (`MenuItemMark.Check`). Pair it with `selectable` for a multiselect row, which
 * keeps the menu open across toggles. `MenuItemMark.Highlight` is the current
 * item of a navigation menu.
 *
 * The overlay is a `menu` by default. A `renderOverlay` panel that is not a
 * menu — a popover of free-form content — sets `overlayRole` to
 * `DropdownOverlayRole.Dialog` (named by `overlayAriaLabel`,
 * `overlayAriaLabelledBy` or, failing both, by the trigger), or to
 * `DropdownOverlayRole.None` when its content carries its own role; the
 * trigger's `aria-haspopup` follows the choice. Closing the overlay, Escape
 * included, returns focus to the trigger unless `returnFocus` is `false`.
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
 *
 * // A panel that is not a menu: role="dialog", trigger aria-haspopup="dialog"
 * <Dropdown
 *   overlayRole={DropdownOverlayRole.Dialog}
 *   overlayAriaLabelledBy="limits-title"
 *   renderOverlay={() => (
 *     <div className="p-3">
 *       <h2 id="limits-title">Usage limits</h2>
 *     </div>
 *   )}
 * >
 *   <button type="button" className="px-3 py-2 rounded border">Limits</button>
 * </Dropdown>
 *
 * // Searchable menu, seven rows tall before it scrolls
 * <Dropdown searchable maxVisibleItems={7} items={items}>
 *   <button type="button" className="px-3 py-2 rounded border">Create</button>
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
 * @param [listStyle] - Inline style applied to the floating overlay, under the dropdown's own positioning styles
 * @param [outsidePressIgnoreRef] - Ref to an element that should not trigger outside press behavior
 * @param [outsideClosable=true] - Whether clicks outside the overlay should close it
 * @param [anchorToMouse=false] - Whether to anchor the dropdown to the mouse position
 * @param [matchReferenceWidth=true] - Whether to match the reference element's width
 * @param [maxDropdownHeight] - Maximum height of the dropdown menu; when omitted, no limit is applied
 * @param [initialFocus] - Initial focus target inside the overlay on open, forwarded to `FloatingFocusManager`; when omitted, matches pre-existing behavior
 * @param [returnFocus=true] - Whether closing the overlay (Escape included) returns focus to the trigger
 * @param [overlayRole=DropdownOverlayRole.Menu] - Role of a `renderOverlay` overlay, and the trigger's matching `aria-haspopup`; the `items` list is always a menu
 * @param [overlayAriaLabel] - Accessible name of the overlay; ignored with `DropdownOverlayRole.None`
 * @param [overlayAriaLabelledBy] - Id of the element naming the overlay; wins over `overlayAriaLabel`, ignored with `DropdownOverlayRole.None`
 * @param [searchable=false] - Show a search field above `items` that filters them and highlights the match
 * @param [searchValue] - Controlled query of the search field
 * @param [onSearchChange] - Fired with every edit of the search field, and with `''` when the menu closes
 * @param [searchPlaceholder="Search"] - Placeholder and accessible name of the search field
 * @param [searchClearLabel="Clear search"] - Accessible name of the search field's clear button
 * @param [noResultsLabel="No results found"] - Text shown and announced when the query leaves no items
 * @param [filterItem] - Item matcher; defaults to a case-insensitive substring match on a string `label`
 * @param [maxVisibleItems] - Rows the item list shows before it scrolls
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
  listStyle,
  outsidePressIgnoreRef,
  outsideClosable = true,
  allowedPlacements,
  anchorToMouse = false,
  matchReferenceWidth = true,
  maxDropdownHeight,
  initialFocus,
  returnFocus = true,
  overlayRole = DropdownOverlayRole.Menu,
  overlayAriaLabel,
  overlayAriaLabelledBy,
  searchable = false,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search',
  searchClearLabel = 'Clear search',
  noResultsLabel = 'No results found',
  filterItem,
  maxVisibleItems,
}) => {
  const themeScope = useThemeScope();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? !!open : uncontrolledOpen;
  const pointedElementRef = useRef<Element | null>(null);

  const [uncontrolledQuery, setUncontrolledQuery] = useState('');
  const query = searchValue ?? uncontrolledQuery;
  const setQuery = useCallback(
    (next: string) => {
      if (searchValue === undefined) setUncontrolledQuery(next);
      onSearchChange?.(next);
    },
    [searchValue, onSearchChange],
  );

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
      } else if (searchable && query) {
        // A closed menu drops its search, so reopening starts from the full list.
        setQuery('');
      }
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange, searchable, query, setQuery],
  );

  const listId = useId();
  const useAuto = placement === undefined;
  /*
   * Registered with the `FloatingTree` this component provides below, so a
   * nested `InteractiveTooltip` (on an item or submenu item) is recognized as
   * this menu's own floating descendant rather than something outside it —
   * without this, hovering into the tooltip's panel or clicking a control
   * inside it would read as "left"/"outside" and close the menu underneath it.
   */
  const nodeId = useFloatingNodeId();

  const { refs, floatingStyles, context } = useFloating({
    nodeId,
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
    handleClose: safePolygon(),
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

  // The item list is always a menu; only a custom overlay chooses its role.
  const resolvedRole = renderOverlay ? overlayRole : DropdownOverlayRole.Menu;
  const isMenu = resolvedRole === DropdownOverlayRole.Menu;
  const isDialog = resolvedRole === DropdownOverlayRole.Dialog;
  const triggerWrapperId = useId();

  /* Disabled for `None`, which leaves the overlay role-less and the trigger
     without `aria-haspopup`; `aria-expanded`/`aria-controls` are filled in
     below either way. */
  const role = useRole(context, {
    role: isDialog ? 'dialog' : 'menu',
    enabled: resolvedRole !== DropdownOverlayRole.None,
  });
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
      /* Only a menu is arrow-navigated here: a dialog or a role-less panel may
         hold a text area or a widget of its own whose arrow keys it owns. */
      if (!isMenu) return;
      if (event.defaultPrevented) return;
      if (!OVERLAY_NAV_KEYS.includes(event.key)) return;
      /* A submenu renders through a portal, so its key events bubble here
         through the React tree from outside this overlay's DOM; moving focus
         among this overlay's rows would pull it out of the open submenu. */
      if (!event.currentTarget.contains(event.target as Node)) return;
      // In a text field Home/End move the caret, not the focus.
      if (
        event.target instanceof HTMLInputElement &&
        (event.key === 'Home' || event.key === 'End')
      ) {
        return;
      }

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
    [isMenu],
  );

  const handleItemClick = useCallback(
    (item: DropdownItem) => (e: MouseEvent) => {
      if (item.disabled) return;
      item.onClick?.({ key: item.key, domEvent: e });
      onItemClick?.({ key: item.key, domEvent: e });
      // A multiselect row is meant to be toggled several times in a row, so it
      // leaves the menu open — dismissing it is the user's call, as it is in a
      // multi-select `Select`.
      if (!item.selectable) setOpen(false);
    },
    [onItemClick, setOpen],
  );

  const visibleItems = useMemo(() => {
    if (!items || !searchable) return items;
    return highlightDropdownItems(
      filterDropdownItems(items, query, filterItem),
      query,
    );
  }, [items, searchable, query, filterItem]);

  const overlayContent: ReactNode = useMemo(() => {
    if (renderOverlay) return renderOverlay();
    if (!visibleItems) return null;

    const hasNoResults = searchable && visibleItems.length === 0;

    return (
      <>
        {menuHeader && (
          <>{typeof menuHeader === 'function' ? menuHeader() : menuHeader}</>
        )}

        {searchable && (
          <div
            className={mergeClasses(
              dropdownSearchClassName,
              DIAL_KIT_CLASS.dropdownSearch,
            )}
          >
            <Search
              value={query}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              clearLabel={searchClearLabel}
              size={ElementSize.Small}
              onChange={(next) => setQuery(next ?? '')}
            />
          </div>
        )}

        <div
          role="none"
          className={mergeClasses(
            dropdownItemListClassName,
            /* Under a search field or a row cap the list scrolls by itself,
               so the field stays in view; the panel's own height cap still
               shrinks it through `min-h-0`. */
            (searchable || maxVisibleItems != null) &&
              'min-h-0 flex-1 overflow-auto',
            overlayContentClassName,
            DIAL_KIT_CLASS.dropdownList,
          )}
          style={
            maxVisibleItems != null
              ? { maxHeight: getDropdownListHeight(maxVisibleItems) }
              : undefined
          }
          aria-label="dropdown"
        >
          {searchable && (
            /* Always mounted, so a screen reader announces the text when a
               query empties the list rather than missing a fresh region. */
            <div
              role="status"
              className={hasNoResults ? dropdownNoResultsClassName : 'sr-only'}
            >
              {hasNoResults ? noResultsLabel : ''}
            </div>
          )}
          {visibleItems.map((it) => {
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
            const mark = resolveItemMark(it);
            const role = getItemRole(it);

            const row = (
              <MenuItem
                role={role}
                aria-checked={role === 'menuitem' ? undefined : !!it.checked}
                aria-current={
                  mark === MenuItemMark.Highlight && it.checked
                    ? true
                    : undefined
                }
                aria-disabled={!!it.disabled}
                disabled={it.disabled}
                mark={mark}
                selected={!!it.checked}
                danger={it.danger}
                icon={it.icon}
                label={it.label}
                className={it.className}
                rightControl={it.rightControl}
                onClick={handleItemClick(it)}
              >
                {it.renderItem?.(it)}
              </MenuItem>
            );

            return (
              <Fragment key={it.key}>
                {it.interactiveTooltip ? (
                  <InteractiveTooltip
                    asChild
                    placement={it.interactiveTooltip.placement}
                    content={it.interactiveTooltip.content}
                    contentClassName={it.interactiveTooltip.contentClassName}
                  >
                    {row}
                  </InteractiveTooltip>
                ) : (
                  row
                )}
              </Fragment>
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
    visibleItems,
    menuFooter,
    menuHeader,
    renderOverlay,
    setOpen,
    overlayContentClassName,
    separatorClassName,
    searchable,
    query,
    setQuery,
    searchPlaceholder,
    searchClearLabel,
    noResultsLabel,
    maxVisibleItems,
  ]);

  // A list that scrolls by itself needs a column panel that does not scroll too.
  const hasOwnListScroll =
    !renderOverlay && (searchable || maxVisibleItems != null);

  const {
    'aria-haspopup': ariaHasPopup,
    'aria-expanded': ariaExpanded = isOpen,
    'aria-controls': ariaControls = listId,
    ...referenceProps
  } = getReferenceProps({
    onContextMenu,
    onMouseDown: onPointerDown,
  }) as HTMLAttributes<HTMLSpanElement>;

  /*
   * A dialog needs a name. Without one from the caller it borrows the
   * trigger's, the way Floating UI already labels a menu by its reference. A
   * role-less (`None`) wrapper is generic and cannot be named at all.
   */
  const labelsByTrigger =
    isDialog && !overlayAriaLabel && !overlayAriaLabelledBy;
  const getOverlayNameProps = (): HTMLAttributes<HTMLDivElement> => {
    if (resolvedRole === DropdownOverlayRole.None) return {};
    if (overlayAriaLabelledBy) {
      return { 'aria-labelledby': overlayAriaLabelledBy };
    }
    if (overlayAriaLabel) {
      return { 'aria-label': overlayAriaLabel, 'aria-labelledby': undefined };
    }
    return labelsByTrigger ? { 'aria-labelledby': triggerWrapperId } : {};
  };

  /*
   * The wrapper `<span>` has no role, and ARIA forbids `aria-expanded` there,
   * so a screen reader never hears the menu state. A single element trigger
   * (the usual icon button) carries the popup attributes itself instead; the
   * trigger's own values win, so a combobox keeps `aria-haspopup="listbox"`.
   * An empty `trigger` (the child opens a controlled dropdown itself) counts
   * as an element trigger too. Text or several nodes, and a context-menu-only
   * trigger (a grid cell, not a control), leave them on the wrapper as before.
   */
  const triggerAria: HTMLAttributes<HTMLSpanElement> = {
    'aria-haspopup': ariaHasPopup,
    'aria-expanded': ariaExpanded,
    'aria-controls': ariaControls,
  };
  const isElementTrigger =
    isValidElement<HTMLAttributes<HTMLElement>>(children) &&
    (trigger.length === 0 ||
      trigger.some((type) => type !== DropdownTrigger.ContextMenu));
  const triggerNode = isElementTrigger
    ? cloneElement(children, {
        'aria-haspopup': children.props['aria-haspopup'] ?? ariaHasPopup,
        'aria-expanded': children.props['aria-expanded'] ?? ariaExpanded,
        'aria-controls': children.props['aria-controls'] ?? ariaControls,
      })
    : children;

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
    <FloatingTree>
      <FloatingNode id={nodeId}>
        <span
          ref={refs.setReference}
          id={labelsByTrigger ? triggerWrapperId : undefined}
          className={mergeClasses(
            dropdownBaseClassName,
            disabled && '!cursor-not-allowed opacity-75',
            className,
            DIAL_KIT_CLASS.dropdown,
          )}
          {...(isElementTrigger ? undefined : triggerAria)}
          {...referenceProps}
        >
          {triggerNode}
        </span>

        {isOpen && (
          <FloatingPortal>
            <FloatingFocusManager
              context={context}
              modal={false}
              /* An explicit `initialFocus` prop wins outright — it's how a
                 host (e.g. a typeahead/command menu opened from a textarea)
                 opts out of focus theft entirely. Otherwise 0 puts focus on
                 the overlay's first control, falling back to the overlay
                 itself when it holds none; -1 leaves focus where it is,
                 which is only right for a menu the pointer opened on hover. */
              initialFocus={
                initialFocus !== undefined
                  ? initialFocus
                  : shouldFocusOverlay
                    ? 0
                    : -1
              }
              returnFocus={returnFocus}
            >
              <div
                id={listId}
                ref={refs.setFloating}
                style={
                  listStyle
                    ? { ...listStyle, ...floatingStyles }
                    : floatingStyles
                }
                className={mergeClasses(
                  dropdownListBaseClassName,
                  !matchReferenceWidth && 'w-max',
                  hasOwnListScroll
                    ? 'flex flex-col overflow-hidden'
                    : 'overflow-auto',
                  themeScope,
                  listClassName,
                )}
                {...getFloatingProps({ onKeyDown: handleFloatingKeyDown })}
                {...getOverlayNameProps()}
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
      </FloatingNode>
    </FloatingTree>
  );
};
