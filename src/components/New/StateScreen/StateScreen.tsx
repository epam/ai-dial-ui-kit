import { useId, type FC, type ReactNode } from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';

export interface StateScreenProps {
  /** Headline of the state, rendered as the page's `h1`. */
  title: ReactNode;
  /** Optional line under the title saying what the state means or what to do. */
  description?: ReactNode;
  /** Glyph drawn in the round badge above the title. Decorative: hidden from assistive tech. */
  icon?: ReactNode;
  /** The way out of the state — typically one button (Log in, Log out, Retry). */
  action?: ReactNode;
  /** Additional CSS classes for the container. */
  className?: string;
  /** Additional CSS classes for the title. */
  titleClassName?: string;
  /** Additional CSS classes for the description. */
  descriptionClassName?: string;
}

/**
 * A whole screen given over to one state the app cannot work past: signed out,
 * access denied, a misconfigured provider.
 * aliases: AuthScreen|LoginScreen|ForbiddenPage|AccessDenied|ErrorPage|FullPageState
 * Design system 2.0
 *
 * Fills its container and centres a round icon badge, an `h1`, an optional
 * description and an optional action. The root is a `section` named by its
 * title, so the state is a landmark of its own. For an empty list or grid
 * inside a page, use `NoDataContent` instead.
 *
 * @example
 * ```tsx
 * <StateScreen
 *   icon={<IconLock size={DIAL_ICON_SIZE.LG} stroke={DIAL_KIT_ICON_STROKE} />}
 *   title="Log in to configure your QuickApp"
 *   description="Set up instructions, add-ons and settings."
 *   action={<NeutralButton label="Log in" onClick={openLogin} />}
 * />
 * ```
 *
 * @param title - Headline of the state, rendered as the page's `h1`.
 * @param [description] - Optional line under the title.
 * @param [icon] - Glyph drawn in the round badge; the badge is omitted without one.
 * @param [action] - The way out of the state, rendered under the text.
 * @param [className] - Additional CSS classes for the container.
 * @param [titleClassName] - Additional CSS classes for the title.
 * @param [descriptionClassName] - Additional CSS classes for the description.
 */
export const StateScreen: FC<StateScreenProps> = ({
  title,
  description,
  icon,
  action,
  className,
  titleClassName,
  descriptionClassName,
}) => {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={mergeClasses(
        'flex size-full flex-col items-center justify-center px-4 text-center',
        className,
        DIAL_KIT_CLASS.stateScreen,
      )}
    >
      {icon != null && (
        <span
          aria-hidden="true"
          className="mb-4 flex size-14 items-center justify-center rounded-full border border-secondary text-secondary"
        >
          {icon}
        </span>
      )}
      <h1
        id={titleId}
        className={mergeClasses(
          'dial-body-semi-text text-primary',
          titleClassName,
        )}
      >
        {title}
      </h1>
      {description != null && (
        <p
          className={mergeClasses(
            'dial-small-text mt-2 text-secondary',
            descriptionClassName,
          )}
        >
          {description}
        </p>
      )}
      {action != null && <div className="mt-4">{action}</div>}
    </section>
  );
};
