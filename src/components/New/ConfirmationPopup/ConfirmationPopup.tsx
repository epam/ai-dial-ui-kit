import { type FC, type ReactNode, useCallback } from 'react';

import { Button } from '@/components/New/Button/Button';
import { NeutralButton } from '@/components/New/Button/ButtonWrappers';
import { Popup, type PopupProps } from '@/components/New/Popup/Popup';
import { Spinner } from '@/components/Spinner/Spinner';
import { ConfirmationPopupVariant } from '@/types/confirmation-popup';
import { PopupSize } from '@/types/popup';
import { mergeClasses } from '@/utils/merge-classes';
import {
  actionsBaseClassName,
  defaultCancelLabel,
  defaultConfirmLabel,
  descriptionBaseClassName,
  loaderContainerClassName,
  variantConfig,
} from './constants';

export interface ConfirmationPopupProps extends PopupProps {
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
 * A confirmation dialog built from {@link Popup} and the 2.0 {@link Button}.
 * aliases: ConfirmDialog|WarningDialog
 * Design system 2.0
 *
 * Provides an accessible modal with a title, optional description or custom content,
 * and a footer with Cancel / Confirm actions.
 *
 * @example
 * ```tsx
 * <ConfirmationPopup
 *   open
 *   header="Delete item?"
 *   description="This action cannot be undone."
 *   confirmLabel="Delete"
 *   variant={ConfirmationPopupVariant.Danger}
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
 * @param [variant=ConfirmationPopupVariant.Info] - Visual variant for the popup
 * @param [size=PopupSize.Sm] - Size of the popup
 */
export const ConfirmationPopup: FC<ConfirmationPopupProps> = ({
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
  variant = ConfirmationPopupVariant.Info,
  size = PopupSize.Sm,
  footer,
  hideClose,
  ...popupProps
}) => {
  const defaultFooter = !isLoading ? (
    <div className={actionsBaseClassName}>
      <NeutralButton
        label={cancelLabel}
        onClick={() => (onCancel ? onCancel() : onClose?.())}
      />
      <Button
        variant={variantConfig[variant].confirm.variant}
        appearance={variantConfig[variant].confirm.appearance}
        className={confirmClassName}
        label={confirmLabel}
        disabled={disableConfirmButton}
        onClick={onConfirm}
      />
    </div>
  ) : null;

  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <div className={loaderContainerClassName}>
          <Spinner size={40} />
        </div>
      );
    }

    if (children != null) {
      return children;
    }

    if (description) {
      return (
        <div
          className={mergeClasses(
            descriptionBaseClassName,
            descriptionClassName,
          )}
        >
          {description}
        </div>
      );
    }

    return null;
  }, [children, description, isLoading, descriptionClassName]);

  return (
    <Popup
      {...popupProps}
      open={open}
      header={header}
      className={mergeClasses(variantConfig[variant].container, className)}
      onClose={() => onClose?.()}
      footer={footer ?? defaultFooter}
      size={size}
      // The dialog's own Cancel already dismisses it, so the header X is dropped
      // unless the caller supplied a footer of their own (or none is rendered).
      hideClose={hideClose ?? (!isLoading && footer === undefined)}
    >
      {renderContent()}
    </Popup>
  );
};
