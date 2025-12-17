import { useCallback, type FC, type ReactNode } from 'react';

import { DialButton } from '@/components/Button/Button';
import { DialPopup, type DialPopupProps } from '@/components/Popup/Popup';
import { DialLoader } from '@/components/Loader/Loader';
import { ButtonVariant } from '@/types/button';
import { PopupSize } from '@/types/popup';

import {
  actionsBaseClassName,
  defaultCancelLabel,
  defaultSubmitLabel,
} from './constants';

export interface DialFormPopupProps extends DialPopupProps {
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  disableSubmitButton?: boolean;
  submitClassName?: string;
  onSubmit: () => void;
  onCancel?: () => void;
  children?: ReactNode;
}

/**
 * A form-oriented popup dialog.
 *
 * Provides an accessible popup with a title, custom body,
 * and a footer with "Cancel" and "Submit" actions.
 *
 * @example
 * ```tsx
 * <DialFormPopup
 *   open
 *   header="Create Model"
 *   onClose={() => setOpen(false)}
 *   onSubmit={handleSubmit}
 * />
 * ```
 *
 * @param header - Title content for the header
 * @param [open=false] - Controls visibility of the popup
 * @param [submitLabel="Submit"] - Label for the primary action button
 * @param [cancelLabel="Cancel"] - Label for the cancel button
 * @param [isLoading=false] - Shows loader placeholder and hides actions
 * @param [disableSubmitButton=false] - Disables the submit button
 * @param [className] - Extra classes for the popup container
 * @param [submitClassName] - Extra classes merged into the submit button
 * @param onClose - Fired on close
 * @param onSubmit - Fired on submit
 * @param [onCancel] - Fired on cancel (falls back to `onClose`)
 * @param [children] - Custom body content
 * @param [dividers=true] - Whether to render separators between sections
 * @param [size=PopupSize.Md] - Size of the popup
 */
export const DialFormPopup: FC<DialFormPopupProps> = ({
  header,
  open = false,
  submitLabel = defaultSubmitLabel,
  cancelLabel = defaultCancelLabel,
  isLoading = false,
  disableSubmitButton = false,
  className,
  submitClassName,
  onClose,
  onSubmit,
  onCancel,
  children,
  dividers = true,
  size = PopupSize.Md,
  footer,
}) => {
  const defaultFooter = !isLoading ? (
    <div className={actionsBaseClassName}>
      <DialButton
        variant={ButtonVariant.Secondary}
        label={cancelLabel}
        onClick={() => (onCancel ? onCancel() : onClose?.())}
      />
      <DialButton
        variant={ButtonVariant.Primary}
        className={submitClassName}
        label={submitLabel}
        disabled={disableSubmitButton}
        onClick={() => onSubmit()}
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

    return null;
  }, [children, isLoading]);

  return (
    <DialPopup
      open={open}
      header={header}
      className={className}
      dividers={dividers}
      onClose={() => onClose?.()}
      footer={footer ?? defaultFooter}
      size={size}
    >
      {renderContent()}
    </DialPopup>
  );
};
