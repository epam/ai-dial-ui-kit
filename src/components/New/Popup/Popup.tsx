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

import { Button, type ButtonProps } from '@/components/New/Button/Button';
import { CloseButton } from '@/components/New/CloseButton/CloseButton';
import { GhostIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { Tooltip } from '@/components/New/Tooltip/Tooltip';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ButtonVariant } from '@/types/button';
import { PopupSize } from '@/types/popup';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';
import { IconChevronLeft } from '@tabler/icons-react';
import {
  popupActionsGroupClassName,
  popupBaseClassName,
  popupFooterClassName,
  popupFooterDividerClassName,
  popupHeaderClassName,
  popupHeaderDividerClassName,
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
  footerClassName?: string;
  onClose?: (e?: MouseEvent<HTMLButtonElement> | null) => void;
  onBack?: (e: MouseEvent<HTMLButtonElement>) => void;
  backAriaLabel?: string;
  headerActions?: ReactNode;
  headerDivider?: boolean;
  mainButtons?: ButtonProps[];
  additionalButtons?: ButtonProps[];
  additionalButtonsOnLeft?: boolean;
  footerDivider?: boolean;
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
 * are separated by spacing rather than rules; opt into a rule with
 * `headerDivider` / `footerDivider`.
 *
 * The header grows from the title alone: `onBack` prepends a back control,
 * `headerActions` sits between the title and the close button.
 *
 * The footer is declared as data, not markup: `mainButtons` and
 * `additionalButtons` take {@link ButtonProps} and the popup renders the
 * {@link Button}s itself, so spacing, order and the neutral default are the
 * same on every dialog. `additionalButtonsOnLeft` moves the secondary group to
 * the opposite edge. A `footer` node still wins over both, for the rare surface
 * that needs something other than a row of buttons.
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
 *   onBack={() => setStep(step - 1)}
 *   headerActions={<InfoButton caption="What is this?" />}
 *   additionalButtonsOnLeft
 *   additionalButtons={[
 *     {
 *       label: 'Back',
 *       variant: ButtonVariant.Primary,
 *       appearance: ButtonAppearance.Link,
 *       iconBefore: <IconArrowLeft />,
 *       onClick: goBack,
 *     },
 *   ]}
 *   mainButtons={[
 *     { label: 'Cancel', onClick: () => setOpen(false) },
 *     { label: 'Confirm', variant: ButtonVariant.Primary, onClick: submit },
 *   ]}
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
 * @param [footer] - Custom footer node; overrides `mainButtons` and `additionalButtons`
 * @param [footerClassName] - Additional CSS classes applied to the built-in footer container
 * @param [onBack] - Callback for the header back button; the button renders only when set
 * @param [backAriaLabel="Back"] - Accessible name of the back button
 * @param [headerActions] - Controls rendered between the title and the close button
 * @param [headerDivider=false] - Whether a rule is drawn under the header
 * @param [mainButtons] - Primary footer buttons, aligned to the trailing edge; each defaults to `ButtonVariant.Neutral`
 * @param [additionalButtons] - Secondary footer buttons, next to `mainButtons` unless moved left
 * @param [additionalButtonsOnLeft=false] - Whether `additionalButtons` sit on the leading edge
 * @param [footerDivider=false] - Whether a rule is drawn above the footer
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
  footerClassName,
  onClose,
  onBack,
  backAriaLabel = 'Back',
  headerActions,
  headerDivider = false,
  mainButtons,
  additionalButtons,
  additionalButtonsOnLeft = false,
  footerDivider = false,
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
        {/*
          The trigger has to clip its own text: unlike the 1.0 tooltip, the 2.0
          one does not force `truncate` on it, and the ellipsis of the `<h2>`
          never reaches text inside the trigger's own box.
        */}
        <Tooltip tooltip={title} triggerClassName="truncate">
          {title}
        </Tooltip>
      </h2>
    ) : (
      title
    );
  };

  const closeButton = hideClose ? null : (
    <CloseButton ariaLabel={closeAriaLabel} onClose={(e) => onClose?.(e)} />
  );

  // Neutral rather than the `Button` default of no variant: an unstyled button
  // in a dialog footer is never what the caller meant, and it matches the
  // `NeutralButton` wrapper these footers were written with by hand.
  // The two groups share a parent when the additional buttons are not moved
  // left, so their keys have to be namespaced or the indices collide.
  const renderButtons = (prefix: string, buttons: ButtonProps[] = []) =>
    buttons.map(({ variant = ButtonVariant.Neutral, ...button }, index) => (
      <Button key={`${prefix}-${index}`} variant={variant} {...button} />
    ));

  // A `footer` node stays authoritative so callers that hand-rolled one before
  // the structured props existed render exactly what they did before.
  const renderFooter = () => {
    if (footer !== undefined) return footer;
    if (!mainButtons?.length && !additionalButtons?.length) return null;

    const additional = renderButtons('additional', additionalButtons);

    return (
      <div
        className={mergeClasses(
          popupFooterClassName,
          footerDivider && popupFooterDividerClassName,
          footerClassName,
        )}
      >
        {/* Guarded on the content, not just the flag: an empty leading group
            would still claim the container's gap. */}
        {additionalButtonsOnLeft && additional.length > 0 && (
          <div className={popupActionsGroupClassName}>{additional}</div>
        )}
        {/* `ml-auto` rather than `justify-end`: it pins the main group to the
            trailing edge whether or not a leading group precedes it. */}
        <div className={mergeClasses(popupActionsGroupClassName, 'ml-auto')}>
          {!additionalButtonsOnLeft && additional}
          {renderButtons('main', mainButtons)}
        </div>
      </div>
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
              className={mergeClasses(
                popupHeaderClassName,
                headerDivider && popupHeaderDividerClassName,
                headerClassName,
              )}
            >
              {onBack && (
                <GhostIconButton
                  aria-label={backAriaLabel}
                  // Matches the 24px close button across the header rather than
                  // the 40px default, which would set the header's height.
                  size={ElementSize.Small}
                  className="mr-2"
                  onClick={onBack}
                  icon={
                    <IconChevronLeft
                      size={DIAL_ICON_SIZE.SM}
                      aria-hidden="true"
                    />
                  }
                />
              )}
              {renderTitle(header)}
              {/* Grouped only when there are actions to group with: without
                  them the close button stays a direct child of the header, so
                  markup that predates `headerActions` is untouched. */}
              {headerActions ? (
                <div className={popupActionsGroupClassName}>
                  {headerActions}
                  {closeButton}
                </div>
              ) : (
                closeButton
              )}
            </div>

            <div className={mergeClasses('grow overflow-auto', bodyClassName)}>
              {children}
            </div>

            {renderFooter()}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
};
