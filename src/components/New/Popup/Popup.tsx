import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { type FC, type MouseEvent, type ReactNode, useId, useRef } from 'react';

import { CloseButton } from '@/components/New/CloseButton/CloseButton';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { PopupSize } from '@/types/popup';
import { mergeClasses } from '@/utils/merge-classes';
import {
  popupBaseClassName,
  popupHeaderClassName,
  popupOverlayBaseClassName,
  popupSizeClassMap,
  popupTitleClassName,
} from './constants';

export interface PopupProps {
  open?: boolean;
  header?: ReactNode;
  ariaLabel?: string;
  portalId?: string;
  className?: string;
  overlayClassName?: string;
  titleClassName?: string;
  headerClassName?: string;
  /** Additional CSS classes applied to the scrollable body wrapper around `children`. */
  bodyClassName?: string;
  children?: ReactNode;
  footer?: ReactNode;
  onClose?: (e?: MouseEvent<HTMLButtonElement> | null) => void;
  size?: PopupSize;
  hideClose?: boolean;
  closeAriaLabel?: string;
  closeOnOutsideClick?: boolean;
  preventKeyboardOnOpen?: boolean;
}

/**
 * An accessible modal dialog using Floating UI.
 * aliases: Modal|Dialog
 * Design system 2.0
 *
 * Renders in a portal with a scrim overlay, focus management, a header with the
 * title and close control, a scrollable body and an optional footer. Sections
 * are separated by spacing rather than rules; add your own through
 * `headerClassName` or the footer node if a surface needs them.
 *
 * A string `header` names the dialog automatically. A `header` node cannot —
 * pass `ariaLabel` in that case, or the dialog opens unnamed.
 *
 * @example
 * ```tsx
 * <Popup
 *   open
 *   header="Title"
 *   size={PopupSize.Md}
 *   footer={
 *     <div className="flex justify-end gap-2 px-6 py-4">
 *       <NeutralButton label="Cancel" />
 *       <PrimaryButton label="Confirm" />
 *     </div>
 *   }
 *   onClose={() => setOpen(false)}
 * >
 *   <div className="px-6 py-4">Dialog content goes here…</div>
 * </Popup>
 * ```
 *
 * @param [open=false] - Controls visibility of the popup
 * @param [header] - Optional title rendered in the header
 * @param [ariaLabel] - Accessible name for the dialog; needed when `header` is not a string
 * @param [portalId] - Optional portal container id
 * @param [className] - Additional CSS classes applied to the popup container
 * @param [overlayClassName] - Additional CSS classes applied to the overlay
 * @param [titleClassName] - Additional CSS classes applied to the title element
 * @param [headerClassName] - Additional CSS classes applied to the popup header container
 * @param [bodyClassName] - Additional CSS classes applied to the scrollable body wrapper around `children`
 * @param [children] - Body content
 * @param [footer] - Footer area for actions
 * @param [onClose] - Callback fired when the popup requests to close
 * @param [size=PopupSize.Md] - Sets the max-width of the popup
 * @param [hideClose=false] - Whether the close button is hidden in the header
 * @param [closeAriaLabel="Close dialog"] - Accessible name of the close button
 * @param [closeOnOutsideClick=true] - Whether the popup closes when clicking outside
 * @param [preventKeyboardOnOpen=false] - When true, initial focus goes to a non-input guard to avoid opening the virtual keyboard on mobile. Redundant since the default focuses the dialog container, which never raises the keyboard; kept for compatibility
 */
export const Popup: FC<PopupProps> = ({
  open = false,
  header,
  ariaLabel,
  portalId,
  className,
  overlayClassName,
  titleClassName,
  headerClassName,
  bodyClassName,
  children,
  footer,
  onClose,
  size = PopupSize.Md,
  hideClose = false,
  closeAriaLabel = 'Close dialog',
  closeOnOutsideClick = true,
  preventKeyboardOnOpen = false,
}) => {
  const focusGuardRef = useRef<HTMLDivElement>(null);
  // Generated rather than fixed: two popups mounted at once would otherwise
  // share one heading id, and each dialog would be named by the first title.
  const generatedId = useId();
  const { refs, context } = useFloating({
    open,
    onOpenChange: (next) => {
      if (!next) onClose?.(null);
    },
  });

  const role = useRole(context, { role: 'dialog' });
  const dismiss = useDismiss(context, { outsidePress: closeOnOutsideClick });
  const { getFloatingProps } = useInteractions([role, dismiss]);

  if (!open) return null;

  const headingId =
    typeof header === 'string' ? `popup-heading-${generatedId}` : undefined;

  const renderTitle = (title?: ReactNode) => {
    if (!title) return <span /* empty element to balance the close button */ />;

    return typeof title === 'string' ? (
      <h2
        id={headingId}
        className={mergeClasses(popupTitleClassName, titleClassName)}
      >
        <DialTooltip tooltip={title}>{title}</DialTooltip>
      </h2>
    ) : (
      title
    );
  };

  return (
    <FloatingPortal id={portalId}>
      <FloatingOverlay
        className={mergeClasses(popupOverlayBaseClassName, overlayClassName)}
      >
        <FloatingFocusManager
          context={context}
          /* The manager's default (`0`) focuses the first tabbable descendant,
             which in this markup is the close button — the title above it is a
             heading, not a control. Enter then activated it and dismissed the
             dialog before the user reached a single field. Focus the dialog
             container instead: the focus manager gives it `tabindex="-1"`, so
             it takes focus without becoming a tab stop, screen readers announce
             the dialog on open, and Tab still lands on the first real control. */
          initialFocus={preventKeyboardOnOpen ? focusGuardRef : refs.floating}
        >
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            aria-label={headingId ? undefined : ariaLabel}
            className={mergeClasses(
              popupBaseClassName,
              popupSizeClassMap[size],
              className,
            )}
          >
            {preventKeyboardOnOpen && (
              <div
                ref={focusGuardRef}
                tabIndex={-1}
                aria-hidden
                className="absolute size-px -m-px overflow-hidden opacity-0 pointer-events-none"
              />
            )}
            <div
              className={mergeClasses(popupHeaderClassName, headerClassName)}
            >
              {renderTitle(header)}
              {!hideClose && (
                <CloseButton
                  ariaLabel={closeAriaLabel}
                  onClose={(e) => onClose?.(e)}
                />
              )}
            </div>

            <div className={mergeClasses('grow overflow-auto', bodyClassName)}>
              {children}
            </div>

            {footer}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
};
