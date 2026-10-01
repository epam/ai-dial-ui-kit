import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { IconArrowLeft } from '@tabler/icons-react';
import { useId, type CSSProperties, type FC, type ReactNode } from 'react';

import { CloseButton } from '@/components/New/CloseButton/CloseButton';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { GhostIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { useThemeScope } from '@/components/New/ThemeScope/ThemeScope';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';

/** Props for `BottomSheet`. */
export interface BottomSheetProps {
  /** Whether the sheet is shown. */
  open: boolean;
  /** Called when the sheet asks to close: the close button, Escape, or a press on the backdrop. */
  onClose: () => void;
  /** Title of the header. A sheet without one has no header and needs `ariaLabel`. */
  title?: string;
  /** Accessible name of the sheet when it has no `title`. */
  ariaLabel?: string;
  /** Shows a back button at the start of the header when set. */
  onBack?: () => void;
  /** Accessible name of the back button. */
  backAriaLabel?: string;
  /** Accessible name of the close button. */
  closeAriaLabel?: string;
  /** Whether a press on the backdrop closes the sheet. */
  closeOnOutsideClick?: boolean;
  /** Content of the sheet, scrolled when it is taller than the sheet allows. */
  children?: ReactNode;
  /** Additional CSS classes for the sheet panel, e.g. a different maximum height. */
  className?: string;
  /** Additional CSS classes for the backdrop. */
  overlayClassName?: string;
  /** Additional CSS classes for the header row. */
  headerClassName?: string;
  /**
   * Inline style for the panel. It renders in a portal, so this is how custom
   * properties reach the panel and its content.
   */
  style?: CSSProperties;
  /** Inline style for the backdrop, merged after its own positioning. */
  overlayStyle?: CSSProperties;
  /** Additional CSS classes for the scrolling body. */
  bodyClassName?: string;
  /** Type-scale class for the title, replacing its own. */
  titleClassName?: string;
  /** Id of the element to portal into, instead of the end of `<body>`. */
  portalId?: string;
}

/**
 * A panel that slides up from the bottom edge over a dimmed page — the mobile
 * counterpart of `Popup`.
 * aliases: ActionSheet|Drawer|MobileSheet|BottomDrawer
 * Design system 2.0
 *
 * It is a modal dialog: focus moves into it on open and stays there, returns
 * to where it came from on close, and the page behind it does not scroll.
 * Escape, the close button and a press on the backdrop all call `onClose`;
 * the sheet itself stays controlled by `open`.
 *
 * With a `title` the header shows it centred, a close button at the end and,
 * when `onBack` is set, a back button at the start for a sheet that drills
 * into pages of its own; the title also names the dialog. Without one there is
 * no header, and `ariaLabel` names the sheet instead. The body scrolls once
 * the content is taller than 85% of the viewport.
 *
 * @example
 * ```tsx
 * <BottomSheet open={isOpen} title="Select model" onClose={() => setIsOpen(false)}>
 *   <ModelList />
 * </BottomSheet>
 * ```
 *
 * @param open - Whether the sheet is shown
 * @param onClose - Called when the sheet asks to close
 * @param [title] - Title of the header; without it the sheet has no header
 * @param [ariaLabel] - Accessible name when there is no `title`
 * @param [onBack] - Shows a back button at the start of the header
 * @param [backAriaLabel='Back'] - Accessible name of the back button
 * @param [closeAriaLabel='Close'] - Accessible name of the close button
 * @param [closeOnOutsideClick=true] - Whether a press on the backdrop closes the sheet
 * @param [children] - Content of the sheet
 * @param [className] - Additional CSS classes for the sheet panel
 * @param [overlayClassName] - Additional CSS classes for the backdrop
 * @param [headerClassName] - Additional CSS classes for the header row
 * @param [style] - Inline style for the panel, e.g. custom properties
 * @param [overlayStyle] - Inline style for the backdrop
 * @param [bodyClassName] - Additional CSS classes for the scrolling body
 * @param [titleClassName] - Type-scale class for the title
 * @param [portalId] - Id of the element to portal into
 */
export const BottomSheet: FC<BottomSheetProps> = ({
  open,
  onClose,
  title,
  ariaLabel,
  onBack,
  backAriaLabel = 'Back',
  closeAriaLabel = 'Close',
  closeOnOutsideClick = true,
  children,
  className,
  overlayClassName,
  headerClassName,
  style,
  overlayStyle,
  bodyClassName,
  titleClassName,
  portalId,
}) => {
  const themeScope = useThemeScope();
  const titleId = `bottom-sheet-title-${useId()}`;
  const { refs, context } = useFloating({
    open,
    onOpenChange: (next) => {
      if (!next) onClose();
    },
  });

  const role = useRole(context, { role: 'dialog' });
  const dismiss = useDismiss(context, { outsidePress: closeOnOutsideClick });
  const { getFloatingProps } = useInteractions([role, dismiss]);

  if (!open) return null;

  return (
    <FloatingPortal id={portalId}>
      <FloatingOverlay
        lockScroll
        style={overlayStyle}
        className={mergeClasses(
          'z-popup flex items-end bg-backdrop',
          themeScope,
          overlayClassName,
        )}
      >
        {/* Focus the panel itself, as `Popup` does: the first control is the
            back or close button, and Enter there would leave the sheet before
            the user reached its content. */}
        <FloatingFocusManager context={context} initialFocus={refs.floating}>
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-label={title ? undefined : ariaLabel}
            style={style}
            className={mergeClasses(
              'flex max-h-[85dvh] w-full flex-col rounded-t-lg bg-layer-raised outline-none',
              'animate-slideUp motion-reduce:animate-none',
              className,
              DIAL_KIT_CLASS.bottomSheet,
            )}
          >
            {title && (
              <div
                className={mergeClasses(
                  'relative flex h-[60px] shrink-0 items-center justify-center border-b border-tertiary px-14',
                  headerClassName,
                )}
              >
                {onBack && (
                  <GhostIconButton
                    aria-label={backAriaLabel}
                    className="absolute start-4"
                    onClick={onBack}
                    icon={
                      <IconArrowLeft
                        size={DIAL_ICON_SIZE.LG}
                        stroke={DIAL_KIT_ICON_STROKE}
                        className="rtl:-scale-x-100"
                        aria-hidden="true"
                      />
                    }
                  />
                )}
                <h2
                  id={titleId}
                  className={mergeClasses(
                    'min-w-0 truncate text-primary',
                    titleClassName ?? 'dial-body-semi-text',
                  )}
                >
                  {title}
                </h2>
                <CloseButton
                  ariaLabel={closeAriaLabel}
                  onClose={onClose}
                  size={ElementSize.Standard}
                  className="absolute end-4"
                />
              </div>
            )}
            <div
              className={mergeClasses('min-h-0 overflow-y-auto', bodyClassName)}
            >
              {children}
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
};
