import classNames from 'classnames';
import type { FC } from 'react';
import type { ReactNode } from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { fileIconFactories } from './constants';
import { BASE_ICON_PROPS } from '@/constants/icon';

export interface DialFileIconProps {
  extension?: string;
  size?: number;
  stroke?: number;
  className?: string;
  decorative?: boolean;
  label?: ReactNode;
  indicator?: ReactNode;
}

/**
 * Renders a file-type icon based on a file extension.
 * aliases: ExtensionIcon|TypeIcon
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
 * @param [className] - Additional classes on the container
 * @param [decorative=false] - Whether the icon should be hidden from assistive technologies
 * @param [label] - Accessible label when not decorative; defaults to "<EXT> file icon"
 * @param [indicator] - Optional indicator element to display alongside the icon
 */
export const DialFileIcon: FC<DialFileIconProps> = ({
  extension,
  size = BASE_ICON_PROPS.size,
  stroke = BASE_ICON_PROPS.stroke,
  className,
  decorative = false,
  label,
  indicator,
}) => {
  const normalized = (() => {
    if (!extension) return '';
    const raw = extension.trim().toLowerCase();
    return raw.startsWith('.') ? raw : `.${raw}`;
  })();

  const factory = fileIconFactories[normalized] ?? fileIconFactories.default;

  const icon = factory({
    size,
    stroke,
  });

  const computedLabel =
    typeof label === 'string'
      ? label
      : `${normalized.slice(1).toUpperCase()} file icon`;

  return (
    <span
      className={classNames('inline-flex relative', className)}
      {...(decorative
        ? { 'aria-hidden': true }
        : { role: 'img', 'aria-label': computedLabel })}
    >
      <DialIcon icon={icon} className="inline-block align-middle" />
      {indicator && (
        <span className="absolute -bottom-0.5 -left-0.5">{indicator}</span>
      )}
    </span>
  );
};
