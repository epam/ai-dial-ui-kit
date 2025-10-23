import classNames from 'classnames';
import type { FC } from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { loaderBaseClasses, loaderIconBaseClasses } from './constants';
import LoaderIcon from '@/assets/icons/loader.svg?react';

export interface DialLoaderProps {
  size?: number;
  cssClass?: string;
  iconClass?: string;
  fullWidth?: boolean;
  ariaLabel?: string;
}

/**
 * A simple loading spinner component.
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
 * <DialLoader size={24} iconClass="text-accent-primary" />
 * ```
 *
 * @param [size=18] - Icon size in px
 * @param [cssClass] - Additional classes for the container
 * @param [iconClass] - Additional classes for the SVG icon
 * @param [fullWidth=true] - Stretch to full width/height of container
 * @param [ariaLabel='Loading'] - Accessible label for screen readers
 */
export const DialLoader: FC<DialLoaderProps> = ({
  size = 18,
  cssClass,
  iconClass,
  fullWidth = true,
  ariaLabel = 'Loading',
}) => {
  return (
    <div
      role="status"
      className={classNames({
        [loaderBaseClasses]: true,
        ['w-full h-full']: fullWidth,
        [cssClass || '']: !!cssClass,
      })}
    >
      <DialIcon
        icon={
          <LoaderIcon
            width={size}
            height={size}
            className={classNames(loaderIconBaseClasses, iconClass)}
            role="img"
            aria-label={ariaLabel}
          />
        }
      />
    </div>
  );
};
