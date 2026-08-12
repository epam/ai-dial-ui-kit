import type { FC, ReactNode } from 'react';
import classNames from 'classnames';

export interface DialIconProps {
  icon?: ReactNode;
  className?: string;
}

/**
 * A wrapper component for rendering icons with consistent styling
 * aliases: IconRenderer|SVGWrapper
 * Design system 1.0
 *
 * @example
 * ```tsx
 * <DialIcon icon={<SearchIcon />} />
 * <DialIcon icon={<CloseIcon />} className="text-primary" />
 * ```
 *
 * @param [icon] - The icon element to render
 * @param [className] - Additional CSS classes to apply to the icon wrapper
 */

// TODO: really need?
export const DialIcon: FC<DialIconProps> = ({ icon, className }) => {
  if (!icon) {
    return null;
  }

  return <span className={classNames('flex-shrink-0', className)}>{icon}</span>;
};
