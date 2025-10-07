import classNames from 'classnames';
import type { FC, ReactNode } from 'react';

import { DialTooltip } from '@/components/Tooltip/Tooltip';

export interface DialLabelledTextProps {
  label: string;
  text?: string;
  content?: ReactNode;
  contentAfterText?: ReactNode;
}
/**
 * A label component for form fields with optional tooltip, content, and custom elements.
 *
 * @example
 * ```tsx
 * <FieldLabel
 *   label="Username"
 *   text="Enter your username"
 *   contentAfterText={<span>*</span>}
 * />
 * ```
 *
 * @param label - The main label text for the field
 * @param [text] - Optional tooltip and secondary text
 * @param [content] - Custom content to render instead of the default text/tooltip
 * @param [contentAfterText] - Element to display after the text (e.g., an asterisk)
 */
export const DialLabelledText: FC<DialLabelledTextProps> = ({
  label,
  text,
  content,
  contentAfterText,
}) => {
  return (
    <div
      className={classNames(
        'flex flex-col text-secondary',
        content ? '' : 'max-w-[200px]',
      )}
    >
      <label className="dial-tiny mb-2">{label}</label>
      {content ? (
        content
      ) : (
        <div className="flex flex-row items-center">
          <DialTooltip triggerClassName="text-primary" tooltip={text}>
            {text}
          </DialTooltip>

          {contentAfterText ? contentAfterText : null}
        </div>
      )}
    </div>
  );
};
