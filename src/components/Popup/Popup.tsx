import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { IconX } from '@tabler/icons-react';
import classNames from 'classnames';
import type { FC, MouseEvent, ReactNode } from 'react';

import { DialButton } from '@/components/Button/Button';
import {
  overlayBaseClasses,
  popupBaseClasses,
  popupDividerClasses,
  popupHeaderClasses,
  popupSizeClassMap,
} from './constants';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { PopupSize } from '@/types/popup';

export interface DialPopupProps {
  open?: boolean;
  title?: string | ReactNode;
  portalId?: string;
  cssClass?: string;
  overlayClass?: string;
  headingClass?: string;
  dividers?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
  onClose?: (e?: MouseEvent<HTMLButtonElement> | null) => void;
  size?: PopupSize;
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
 * @param [title] - Optional title rendered in the header
 * @param [portalId] - Optional portal container id
 * @param [cssClass] - Additional CSS classes applied to the popup container
 * @param [overlayClass] - Additional CSS classes applied to the overlay
 * @param [headingClass] - Additional CSS classes applied to the title element
 * @param [dividers=true] - Whether to render separators between sections
 * @param [children] - Body content
 * @param [footer] - Footer area for actions
 * @param [onClose] - Callback fired when the popup requests to close
 * @param [size=PopupSize.Md] - Sets the max-width of the popup
 */
export const DialPopup: FC<DialPopupProps> = ({
  open = false,
  title,
  portalId,
  cssClass,
  overlayClass,
  headingClass,
  dividers = true,
  children,
  footer,
  onClose,
  size = PopupSize.Md,
}) => {
  const { refs, context } = useFloating({
    open,
    onOpenChange: (next) => {
      if (!next) onClose?.(null);
    },
  });

  const role = useRole(context, { role: 'dialog' });
  const dismiss = useDismiss(context, { outsidePress: true });
  const { getFloatingProps } = useInteractions([role, dismiss]);

  if (!open) return null;

  const headingId =
    typeof title === 'string' ? 'dial-popup-heading' : undefined;

  const renderTitle = (title?: ReactNode | string) => {
    if (!title) return <span /* empty element to balance the close button */ />;

    return typeof title === 'string' ? (
      <h3
        id={headingId}
        className={classNames(
          'flex-1 min-w-0 mr-3 truncate dial-h3 text-primary',
          headingClass,
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
      <FloatingOverlay className={classNames(overlayBaseClasses, overlayClass)}>
        <FloatingFocusManager context={context}>
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            className={classNames(
              popupBaseClasses,
              popupSizeClassMap[size],
              dividers && popupDividerClasses,
              cssClass,
            )}
          >
            <div className={popupHeaderClasses}>
              {renderTitle(title)}
              <DialButton
                cssClass="text-secondary hover:text-accent-primary"
                ariaLabel="Close dialog"
                iconBefore={<IconX size={18} />}
                onClick={(e) => onClose?.(e)}
              />
            </div>
            <div className="flex-grow overflow-auto">
              {/* Body area */}
              {children}
            </div>
            {footer}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
};
