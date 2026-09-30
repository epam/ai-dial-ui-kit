import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { IconChevronLeft } from '@tabler/icons-react';
import { useId, type FC, type ReactNode } from 'react';

import { CloseButton } from '@/components/New/CloseButton/CloseButton';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { GhostIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { useThemeScope } from '@/components/New/ThemeScope/ThemeScope';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';

/** Props for `SideDrawer`. */
export interface SideDrawerProps {
  /** Whether the drawer is open. */
  open: boolean;
  /** Called when the drawer asks to close: the close button, Escape, or a press on the backdrop. */
  onClose: () => void;
  /** Header title. A string also names the dialog; a node needs `ariaLabel`. */
  header?: ReactNode;
  /** Accessible name of the drawer when `header` is not a string. */
  ariaLabel?: string;
  /** Controls placed in the header between the title and the close button. */
  headerActions?: ReactNode;
  /** Shows a back button at the start of the header when set. */
  onBack?: () => void;
  /** Accessible name of the back button. */
  backAriaLabel?: string;
  /** Whether the back button is disabled. */
  backDisabled?: boolean;
  /** Accessible name of the close button. */
  closeAriaLabel?: string;
  /** Whether the close button is disabled, e.g. while a submission is in flight. */
  closeDisabled?: boolean;
  /** Whether the header's close button is left out. */
  hideClose?: boolean;
  /** Whether a press on the backdrop closes the drawer. */
  closeOnOutsideClick?: boolean;
  /** Content of the drawer, scrolled when it is taller than the viewport. */
  children?: ReactNode;
  /** Additional CSS classes for the drawer panel, e.g. a different desktop width. */
  className?: string;
  /** Additional CSS classes for the backdrop. */
  overlayClassName?: string;
  /** Additional CSS classes for the header row. */
  headerClassName?: string;
  /** Additional CSS classes for the scrolling body. */
  bodyClassName?: string;
  /** Type-scale class for a string title, replacing its own. */
  titleClassName?: string;
  /** Id of the element to portal into, instead of the end of `<body>`. */
  portalId?: string;
}

/**
 * A full-height panel that slides in from the inline end over a dimmed page.
 * aliases: Drawer|SidePanel|SideSheet|DetailsPanel
 * Design system 2.0
 *
 * It is a modal dialog while open: focus moves to the panel and stays inside,
 * returns to where it came from on close, and the page behind it does not
 * scroll. Escape, the close button and a press on the backdrop all call
 * `onClose`; the drawer stays controlled by `open`.
 *
 * The panel stays mounted while closed, so it can slide out as well as in and
 * keep the state of whatever it holds. Closed, it is `inert` — out of both
 * the tab order and the accessibility tree — and the backdrop lets pointer
 * events through. On desktop the drawer is 540px wide with a rounded,
 * bordered leading edge; on mobile it takes the full width. It slides from
 * the end in either direction, and not at all under `prefers-reduced-motion`.
 *
 * The header follows `Popup`: an optional back button, the title,
 * `headerActions`, and the close button. A string `header` renders an `<h2>`
 * that names the dialog; for a node, pass `ariaLabel`.
 *
 * @example
 * ```tsx
 * <SideDrawer open={isOpen} header="Publish" onClose={() => setIsOpen(false)}>
 *   <PublishForm />
 * </SideDrawer>
 * ```
 *
 * @param open - Whether the drawer is open
 * @param onClose - Called when the drawer asks to close
 * @param [header] - Header title; a string also names the dialog
 * @param [ariaLabel] - Accessible name when `header` is not a string
 * @param [headerActions] - Controls between the title and the close button
 * @param [onBack] - Shows a back button at the start of the header
 * @param [backAriaLabel='Back'] - Accessible name of the back button
 * @param [backDisabled=false] - Whether the back button is disabled
 * @param [closeAriaLabel='Close'] - Accessible name of the close button
 * @param [closeDisabled=false] - Whether the close button is disabled
 * @param [hideClose=false] - Whether the close button is left out
 * @param [closeOnOutsideClick=true] - Whether a press on the backdrop closes the drawer
 * @param [children] - Content of the drawer
 * @param [className] - Additional CSS classes for the drawer panel
 * @param [overlayClassName] - Additional CSS classes for the backdrop
 * @param [headerClassName] - Additional CSS classes for the header row
 * @param [bodyClassName] - Additional CSS classes for the scrolling body
 * @param [titleClassName] - Type-scale class for a string title
 * @param [portalId] - Id of the element to portal into
 */
export const SideDrawer: FC<SideDrawerProps> = ({
  open,
  onClose,
  header,
  ariaLabel,
  headerActions,
  onBack,
  backAriaLabel = 'Back',
  backDisabled = false,
  closeAriaLabel = 'Close',
  closeDisabled = false,
  hideClose = false,
  closeOnOutsideClick = true,
  children,
  className,
  overlayClassName,
  headerClassName,
  bodyClassName,
  titleClassName,
  portalId,
}) => {
  const themeScope = useThemeScope();
  const titleId = `side-drawer-title-${useId()}`;
  const isTitleText = typeof header === 'string';
  const { refs, context } = useFloating({
    open,
    onOpenChange: (next) => {
      if (!next) onClose();
    },
  });

  const role = useRole(context, { role: 'dialog' });
  const dismiss = useDismiss(context, { outsidePress: closeOnOutsideClick });
  const { getFloatingProps } = useInteractions([role, dismiss]);

  const hasHeader = header != null || onBack != null || !hideClose;

  return (
    <FloatingPortal id={portalId}>
      <FloatingOverlay
        lockScroll={open}
        className={mergeClasses(
          'z-popup bg-backdrop transition-opacity duration-300 motion-reduce:transition-none',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
          themeScope,
          overlayClassName,
        )}
      >
        {/* Disabled while closed: the panel stays mounted to slide out, and a
            live focus manager would trap focus in an invisible panel. */}
        <FloatingFocusManager
          context={context}
          disabled={!open}
          initialFocus={refs.floating}
        >
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={isTitleText ? titleId : undefined}
            aria-label={isTitleText ? undefined : ariaLabel}
            inert={!open}
            className={mergeClasses(
              'fixed inset-y-0 end-0 flex w-full flex-col overflow-hidden bg-layer-raised outline-none',
              'desktop:w-[540px] desktop:rounded-s-xl desktop:border-s desktop:border-secondary',
              'transition-transform duration-300 motion-reduce:transition-none',
              open ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full',
              className,
              DIAL_KIT_CLASS.sideDrawer,
            )}
          >
            {hasHeader && (
              <div
                className={mergeClasses(
                  'flex shrink-0 items-center gap-2 border-b border-tertiary px-6 py-3',
                  headerClassName,
                )}
              >
                {onBack && (
                  <GhostIconButton
                    aria-label={backAriaLabel}
                    disabled={backDisabled}
                    onClick={onBack}
                    icon={
                      <IconChevronLeft
                        size={DIAL_ICON_SIZE.MD}
                        stroke={DIAL_KIT_ICON_STROKE}
                        className="rtl:-scale-x-100"
                        aria-hidden="true"
                      />
                    }
                  />
                )}
                {isTitleText ? (
                  <h2
                    id={titleId}
                    className={mergeClasses(
                      'min-w-0 flex-1 truncate text-primary',
                      titleClassName ?? 'dial-h2-text',
                    )}
                  >
                    {header}
                  </h2>
                ) : (
                  <div className="min-w-0 flex-1">{header}</div>
                )}
                {headerActions}
                {!hideClose && (
                  <CloseButton
                    ariaLabel={closeAriaLabel}
                    onClose={onClose}
                    disabled={closeDisabled}
                    size={ElementSize.Standard}
                  />
                )}
              </div>
            )}
            <div
              className={mergeClasses(
                'min-h-0 flex-1 overflow-y-auto',
                bodyClassName,
              )}
            >
              {children}
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
};
