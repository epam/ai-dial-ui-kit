import classNames from 'classnames';
import { useCallback, type FC, type ReactNode } from 'react';

import { DialButton } from '@/components/Button/Button';
import { DialPopup, type DialPopupProps } from '@/components/Popup/Popup';
import {
  actionsBaseClassName,
  defaultCancelLabel,
  defaultConfirmLabel,
  descriptionBaseClassName,
  variantConfig,
} from './constants';
import { DialLoader } from '@/components/Loader/Loader';
import { ConfirmationPopupVariant } from '@/types/confirmation-popup';
import { PopupSize } from '@/types/popup';
import { DialNeutralButton } from '@/components/Button/ButtonWrappers';

export interface DialConfirmationPopupProps extends DialPopupProps {
  description?: ReactNode;
  descriptionClassName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  disableConfirmButton?: boolean;
  confirmClassName?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  children?: ReactNode;
  variant?: ConfirmationPopupVariant;
}

/**
 * A confirmation dialog built with DialPopup and DialButton.
 * aliases: ConfirmDialog|WarningDialog
 *
 * Provides an accessible modal with a title, optional description or custom content,
 * and a footer with Cancel / Confirm actions.
 *
 * @example
 * ```tsx
 * <ConfirmationModal
 *   open
 *   header="Delete item?"
 *   description="This action cannot be undone."
 *   confirmLabel="Delete"
 *   onClose={() => setOpen(false)}
 *   onConfirm={handleDelete}
 * />
 * ```
 *
 * @param header - Title content for the header
 * @param [description] - Secondary text (ignored when `children` set)
 * @param [descriptionClassName] - Custom CSS class for the description
 * @param [open=false] - Controls visibility of the popup
 * @param [confirmLabel="Ok"] - Label for the confirm button
 * @param [cancelLabel="Cancel"] - Label for the cancel button
 * @param [isLoading=false] - Shows loader placeholder and hides actions
 * @param [disableConfirmButton=false] - Disables the confirm button
 * @param [className] - Extra classes for the popup container
 * @param [confirmClassName] - Extra classes merged into the confirm button
 * @param onClose - Fired on close
 * @param onConfirm - Fired on confirm
 * @param [onCancel] - Fired on cancel (falls back to `onClose`)
 * @param [children] - Custom body content
 * @param [dividers=false] - Whether to render separators between sections
 * @param [variant=ConfirmationPopupVariant.Info] - Visual variant for the popup
 * @param [size=PopupSize.Sm] - Size of the popup
 */
export const DialConfirmationPopup: FC<DialConfirmationPopupProps> = ({
  header,
  description,
  descriptionClassName,
  open = false,
  confirmLabel = defaultConfirmLabel,
  cancelLabel = defaultCancelLabel,
  isLoading = false,
  disableConfirmButton = false,
  className,
  confirmClassName,
  onClose,
  onConfirm,
  onCancel,
  children,
  dividers = false,
  variant = ConfirmationPopupVariant.Info,
  size = PopupSize.Sm,
  footer,
}) => {
  const defaultFooter = !isLoading ? (
    <div className={actionsBaseClassName}>
      <DialNeutralButton
        label={cancelLabel}
        onClick={() => (onCancel ? onCancel() : onClose?.())}
      />
      <DialButton
        variant={variantConfig[variant].confirm?.variant}
        appearance={variantConfig[variant].confirm?.appearance}
        className={confirmClassName}
        label={confirmLabel}
        disabled={disableConfirmButton}
        onClick={() => onConfirm()}
      />
    </div>
  ) : null;

  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <div className="px-6 py-4 h-[120px]">
          <DialLoader size={50} />
        </div>
      );
    }

    if (children != null) {
      return children;
    }

    if (description) {
      return (
        <div
          className={classNames(descriptionBaseClassName, descriptionClassName)}
        >
          {description}
        </div>
      );
    }

    return null;
  }, [children, description, isLoading, descriptionClassName]);

  return (
    <DialPopup
      open={open}
      header={header}
      className={classNames(variantConfig[variant].container, className)}
      dividers={dividers}
      onClose={() => onClose?.()}
      footer={footer ?? defaultFooter}
      size={size}
    >
      {renderContent()}
    </DialPopup>
  );
};
