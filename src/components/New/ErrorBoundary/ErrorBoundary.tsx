import { IconAlertTriangle } from '@tabler/icons-react';
import {
  Component,
  useEffect,
  useRef,
  useState,
  type ErrorInfo,
  type FC,
  type ReactNode,
} from 'react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { LiveRegionPoliteness } from '@/types/live-region';
import { PrimaryButton } from '../Button/ButtonWrappers';
import { LiveRegion } from '../LiveRegion/LiveRegion';
import { StateScreen } from '../StateScreen/StateScreen';

export interface ErrorBoundaryProps {
  /** The subtree to guard. */
  children?: ReactNode;
  /** Headline of the fallback screen (its `h1`); also what is announced on a crash. */
  title: ReactNode;
  /** Optional line under the title saying what happened or what to do. */
  description?: ReactNode;
  /** Text of the recovery button. */
  actionLabel: string;
  /**
   * Called when the recovery button is activated, before the boundary renders
   * its children again. Omit it to reload the page instead — the right
   * recovery for an app-level boundary, where state may be corrupt.
   */
  onReset?: () => void;
  /**
   * Values that clear the error when any of them changes, compared with
   * `Object.is` — typically the current route path, so navigating away from a
   * crashed page recovers.
   */
  resetKeys?: readonly unknown[];
  /** Called once per caught error, for logging or reporting. */
  onError?: (error: unknown, info: ErrorInfo) => void;
  /** Glyph in the fallback badge. Defaults to a warning triangle; `null` drops the badge. */
  icon?: ReactNode;
  /** Additional CSS classes for the fallback `StateScreen`. */
  className?: string;
}

interface CatcherProps {
  children?: ReactNode;
  onCatch: (error: unknown, info: ErrorInfo) => void;
}

interface CatcherState {
  hasError: boolean;
}

/**
 * The React error boundary proper. React remounts a boundary's subtree when it
 * catches, so it holds only the children: the live region lives above it and
 * stays mounted across the crash.
 */
class Catcher extends Component<CatcherProps, CatcherState> {
  override state: CatcherState = { hasError: false };

  static getDerivedStateFromError = (): CatcherState => ({ hasError: true });

  override componentDidCatch(error: unknown, info: ErrorInfo) {
    this.props.onCatch(error, info);
  }

  override render() {
    return this.state.hasError ? null : this.props.children;
  }
}

const DEFAULT_ICON = (
  <IconAlertTriangle size={DIAL_ICON_SIZE.LG} stroke={DIAL_KIT_ICON_STROKE} />
);

const haveKeysChanged = (
  previous: readonly unknown[] = [],
  next: readonly unknown[] = [],
) =>
  previous.length !== next.length ||
  previous.some((key, index) => !Object.is(key, next[index]));

/**
 * Catches a render error in its subtree and replaces the subtree with a
 * full-container error screen that has one way out.
 * aliases: ErrorFallback|CrashScreen|ErrorPage|SomethingWentWrong|RootErrorBoundary
 * Design system 2.0
 *
 * The fallback is a `StateScreen` with a warning badge and a `PrimaryButton`
 * that takes focus, since the control the user was on is gone. The crash is
 * announced through an assertive `LiveRegion` that is mounted with the
 * boundary, before any error: a region mounted together with its message is
 * often not read.
 *
 * The button calls `onReset` and renders the children again, or reloads the
 * page when `onReset` is omitted. `resetKeys` clears the error without a click.
 * Like every React error boundary, it does not catch errors in event handlers,
 * async code or the boundary itself. All text comes from props.
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   title={t('error.title')}
 *   description={t('error.description')}
 *   actionLabel={t('error.reload')}
 *   onError={(error) => logger.error(error)}
 * >
 *   <App />
 * </ErrorBoundary>
 *
 * <ErrorBoundary
 *   title={t('error.title')}
 *   actionLabel={t('error.tryAgain')}
 *   onReset={() => {}}
 *   resetKeys={[pathname]}
 * >
 *   <SettingsPage />
 * </ErrorBoundary>
 * ```
 *
 * @param [children] - The subtree to guard.
 * @param title - Headline of the fallback; also the announcement.
 * @param [description] - Optional line under the title.
 * @param actionLabel - Text of the recovery button.
 * @param [onReset] - Recovery handler; the page reloads without one.
 * @param [resetKeys] - Values that clear the error when one of them changes.
 * @param [onError] - Called once per caught error.
 * @param [icon] - Glyph in the fallback badge; `null` drops it.
 * @param [className] - Additional CSS classes for the fallback screen.
 */
export const ErrorBoundary: FC<ErrorBoundaryProps> = ({
  children,
  title,
  description,
  actionLabel,
  onReset,
  resetKeys,
  onError,
  icon = DEFAULT_ICON,
  className,
}) => {
  const [hasError, setHasError] = useState(false);
  const previousKeys = useRef(resetKeys);

  // Only an error that was already showing: keys that change in the render
  // which crashed would otherwise reset straight back into the crash.
  useEffect(() => {
    if (hasError && haveKeysChanged(previousKeys.current, resetKeys)) {
      setHasError(false);
    }
    previousKeys.current = resetKeys;
  }, [hasError, resetKeys]);

  const handleCatch = (error: unknown, info: ErrorInfo) => {
    setHasError(true);
    onError?.(error, info);
  };

  const handleAction = () => {
    if (!onReset) {
      window.location.reload();
      return;
    }

    onReset();
    setHasError(false);
  };

  return (
    <>
      <LiveRegion politeness={LiveRegionPoliteness.Assertive} visuallyHidden>
        {hasError && title}
      </LiveRegion>
      {hasError ? (
        <StateScreen
          icon={icon}
          title={title}
          description={description}
          className={className}
          action={
            <PrimaryButton
              autoFocus
              label={actionLabel}
              onClick={handleAction}
            />
          }
        />
      ) : (
        <Catcher onCatch={handleCatch}>{children}</Catcher>
      )}
    </>
  );
};
