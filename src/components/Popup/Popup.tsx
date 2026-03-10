import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import classNames from 'classnames';
import { type FC, type MouseEvent, type ReactNode, useRef } from 'react';

import { DialCloseButton } from '@/components/CloseButton/CloseButton';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { PopupSize } from '@/types/popup';
import {
  overlayBaseClassName,
  popupDividerClassName,
  popupHeaderClassName,
  popupSizeClassMap,
} from './constants';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialPopupProps {
  open?: boolean;
  header?: ReactNode;
  portalId?: string;
  className?: string;
  overlayClassName?: string;
  titleClassName?: string;
  headerClassName?: string;
  // TODO: review after implementing common design system
  dividers?: boolean;
  dividerFooter?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
  onClose?: (e?: MouseEvent<HTMLButtonElement> | null) => void;
  size?: PopupSize;
  hideClose?: boolean;
  closeOnOutsideClick?: boolean;
  /** When true, focus is set to a non-input guard so the virtual keyboard does not open on mobile */
  preventKeyboardOnOpen?: boolean;
}

/**
 * An accessible modal dialog component using Floating UI.
 *
 * Renders in a portal with a scrim overlay, focus management, header with a title,
 * content area, optional footer and a close control.
 *
 * @example
 * ```tsx
 * <DialPopup
 *   open
 *   title="Title"
 *   size={PopupSize.Md}
 *   footer={
 *     <div className="flex justify-end gap-2">
 *       <button className="btn-secondary px-3 py-1 rounded">Cancel</button>
 *       <button className="btn-primary px-3 py-1 rounded">Confirm</button>
 *     </div>
 *   }
 *   onClose={() => console.log('closed')}
 * >
 *   <div className="p-6">Dialog content goes here…</div>
 * </DialPopup>
 * ```
 *
 * @param [open=false] - Controls visibility of the popup
 * @param [header] - Optional title rendered in the header
 * @param [portalId] - Optional portal container id
 * @param [className] - Additional CSS classes applied to the popup container
 * @param [overlayClassName] - Additional CSS classes applied to the overlay
 * @param [titleClassName] - Additional CSS classes applied to the title element
 * @param [headerClassName] - Additional CSS classes applied to the popup header container
 * @param [dividers=true] - Whether to render separators between sections
 * @param [dividerFooter=true] - Whether to render a divider above the footer when `dividers` is true
 * @param [children] - Body content
 * @param [footer] - Footer area for actions
 * @param [onClose] - Callback fired when the popup requests to close
 * @param [size=PopupSize.Md] - Sets the max-width of the popup
 * @param [hideClose=false] Whether the close button is hidden in the header (default: false)
 * @param [closeOnOutsideClick=true] - Whether the popup closes when clicking outside (default: true)
 * @param [preventKeyboardOnOpen=false] - When true, initial focus goes to a non-input guard to avoid opening the virtual keyboard on mobile
 */
export const DialPopup: FC<DialPopupProps> = ({
  open = false,
  header,
  portalId,
  className,
  overlayClassName,
  titleClassName,
  headerClassName,
  dividers = true,
  dividerFooter = true,
  children,
  footer,
  onClose,
  size = PopupSize.Md,
  hideClose = false,
  closeOnOutsideClick = true,
  preventKeyboardOnOpen = false,
}) => {
  const focusGuardRef = useRef<HTMLDivElement>(null);
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
    typeof header === 'string' ? 'dial-popup-heading' : undefined;

  const renderTitle = (title?: ReactNode) => {
    if (!title) return <span /* empty element to balance the close button */ />;

    return typeof title === 'string' ? (
      <h3
        id={headingId}
        className={classNames(
          'flex-1 min-w-0 mr-3 truncate dial-h3 text-primary',
          titleClassName,
        )}
      >
        <DialTooltip tooltip={title}>{title}</DialTooltip>
      </h3>
    ) : (
      title
    );
  };

  return (
    <FloatingPortal id={portalId}>
      <FloatingOverlay
        className={classNames(overlayBaseClassName, overlayClassName)}
      >
        <FloatingFocusManager
          context={context}
          initialFocus={preventKeyboardOnOpen ? focusGuardRef : undefined}
        >
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            className={classNames(
              'dial-popup',
              popupSizeClassMap[size],
              dividers && popupDividerClassName,
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
                <DialCloseButton
                  ariaLabel="Close dialog"
                  onClose={(e) => onClose?.(e)}
                />
              )}
            </div>
            <div
              className="flex-grow overflow-auto"
              aria-label="popup-description"
            >
              {/* Body area */}
              {children}
            </div>
            {dividerFooter && <div className={popupDividerClassName} />}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
};
