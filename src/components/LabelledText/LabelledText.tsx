import classNames from 'classnames';
import type { FC, ReactNode } from 'react';

import { DialTooltip } from '@/components/Tooltip/Tooltip';

export interface DialLabelledTextProps {
  label: string;
  text?: string;
  tooltip?: string;
  children?: ReactNode;
  postfix?: ReactNode;
  className?: string;
}
/**
 * A label component for form fields with optional tooltip, content, and custom elements.
 *
 * @example
 * ```tsx
 * <FieldLabel
 *   label="Username"
 *   text="Enter your username"
 *   postfix={<span>*</span>}
 * />
 * ```
 *
 * @param [label] - The main label text for the field
 * @param [text] - Optional tooltip and secondary text
 * @param [tooltip] - Optional tooltip different from main text
 * @param [children] - Custom content to render instead of the default text/tooltip
 * @param [postfix] - Element to display after the text (e.g., an asterisk)
 * @param [className] - Additional CSS classes for the container element.
 */
export const DialLabelledText: FC<DialLabelledTextProps> = ({
  label,
  text,
  tooltip,
  children,
  postfix,
  className,
}) => {
  return (
    <div
      className={classNames(
        'flex flex-col',
        children ? '' : 'max-w-[200px]',
        className,
      )}
    >
      <label className="dial-tiny mb-2 text-secondary">{label}</label>
      {children ? (
        children
      ) : (
        <div className="flex flex-row items-center">
          <DialTooltip
            triggerClassName="text-primary"
            tooltip={tooltip || text}
          >
            {text}
          </DialTooltip>

          {postfix ? postfix : null}
        </div>
      )}
    </div>
  );
};
