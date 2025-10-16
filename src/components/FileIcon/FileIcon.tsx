import classNames from 'classnames';
import type { FC } from 'react';
import type { ReactNode } from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import {
  baseIconProps,
  fileIconFactories,
  type BaseFileIconOpts,
} from './constants';

export interface DialFileIconProps {
  extension: string;
  size?: number;
  stroke?: number;
  cssClass?: string;
  decorative?: boolean;
  label?: string;
}

/**
 * Renders a file-type icon based on a file extension.
 *
 * Uses DialIcon to provide consistent icon wrapper styling.
 *
 * @example
 * ```tsx
 * <DialFileIcon extension=".pdf" />
 * <DialFileIcon extension="tsx" size={28} stroke={1.25} />
 * <DialFileIcon extension="unknown" decorative /> // decorative, hidden from AT
 * ```
 *
 * @param extension - File extension string (with or without leading dot)
 * @param [size=baseIconProps.size] - Icon pixel size
 * @param [stroke=baseIconProps.stroke] - Tabler icon stroke width
 * @param [cssClass] - Additional classes on the container
 * @param [decorative=false] - Whether the icon should be hidden from assistive technologies
 * @param [label] - Accessible label when not decorative; defaults to "<EXT> file icon"
 */
export const DialFileIcon: FC<DialFileIconProps> = ({
  extension,
  size = baseIconProps.size,
  stroke = baseIconProps.stroke,
  cssClass,
  decorative = false,
  label,
}) => {
  const normalized = (() => {
    const raw = extension.trim().toLowerCase();
    return raw.startsWith('.') ? raw : `.${raw}`;
  })();

  const factory = fileIconFactories[normalized] ?? fileIconFactories.default;

  const icon: ReactNode = factory({
    size,
    stroke,
  } as BaseFileIconOpts);

  const computedLabel =
    label ?? `${normalized.slice(1).toUpperCase()} file icon`;

  return (
    <span
      className={classNames('inline-flex', cssClass)}
      {...(decorative
        ? { 'aria-hidden': true }
        : { role: 'img', 'aria-label': computedLabel })}
    >
      <DialIcon icon={icon} className="inline-block align-middle" />
    </span>
  );
};
