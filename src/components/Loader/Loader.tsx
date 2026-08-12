import classNames from 'classnames';
import type { FC } from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { loaderBaseClassName, loaderIconBaseClassName } from './constants';
import LoaderIcon from '@/assets/icons/loader.svg?react';

export interface DialLoaderProps {
  size?: number;
  className?: string;
  iconClassName?: string;
  fullWidth?: boolean;
  ariaLabel?: string;
}

/**
 * A simple loading spinner component.
 * aliases: LoadingSpinner|ProgressSpinner
 * Design system 1.0
 *
 * Renders a spinning SVG with optional full-width container.
 *
 * @example
 * ```tsx
 * // Full width (default)
 * <DialLoader />
 *
 * // Inline (content width)
 * <DialLoader fullWidth={false} />
 *
 * // Custom size and classes
 * <DialLoader size={24} iconClassName="text-accent-primary" />
 * ```
 *
 * @param [size=18] - Icon size in px
 * @param [className] - Additional classes for the container
 * @param [iconClassName] - Additional classes for the SVG icon
 * @param [fullWidth=true] - Stretch to full width/height of container
 * @param [ariaLabel='Loading'] - Accessible label for screen readers
 */
export const DialLoader: FC<DialLoaderProps> = ({
  size = 18,
  className,
  iconClassName,
  fullWidth = true,
  ariaLabel = 'Loading',
}) => {
  return (
    <div
      role="status"
      className={classNames({
        [loaderBaseClassName]: true,
        ['w-full h-full']: fullWidth,
        [className || '']: !!className,
      })}
    >
      <DialIcon
        icon={
          <LoaderIcon
            width={size}
            height={size}
            className={classNames(loaderIconBaseClassName, iconClassName)}
            role="img"
            aria-label={ariaLabel}
          />
        }
      />
    </div>
  );
};
