import type { FC, ReactNode } from 'react';

import { EllipsisTooltip } from '@/components/New/EllipsisTooltip/EllipsisTooltip';
import { Label } from '@/components/New/Label/Label';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { mergeClasses } from '@/utils/merge-classes';

export interface LabelledTextProps {
  /** Small caption above the value, naming it. */
  label: ReactNode;
  /** The value. Truncates with an ellipsis, revealing the full text in a tooltip only when clipped. */
  text?: ReactNode;
  /** Tooltip content shown instead of `text` while it is clipped. */
  tooltip?: ReactNode;
  /** Custom value content, rendered instead of `text`. */
  children?: ReactNode;
  /** Element after the value, e.g. a copy button. */
  postfix?: ReactNode;
  /** Additional CSS classes for the root element. */
  className?: string;
}

/**
 * A read-only label/value pair: a small caption above a value.
 * aliases: LabelValue|DisplayText|ReadOnlyField|KeyValue
 * Design system 2.0
 *
 * The caption is the kit's `Label`, so it matches the other 2.0 fields. There is
 * no control to point its `htmlFor` at: it sits beside the value and reads in
 * DOM order. It is not a form field: use `Label` with an input for editable
 * values.
 *
 * Without `children` the value is a single line capped at 200px that truncates;
 * the tooltip appears only while the text is actually clipped. With `children`
 * the value takes the content's own width.
 *
 * @example
 * ```tsx
 * <LabelledText label="Endpoint" text="https://example.com/v1/chat" />
 *
 * <LabelledText
 *   label="Key"
 *   text="sk-0000"
 *   postfix={<IconButton icon={<IconCopy />} ariaLabel="Copy key" />}
 * />
 * ```
 *
 * @param label - Caption above the value.
 * @param [text] - The value, truncated with an ellipsis when it does not fit.
 * @param [tooltip] - Tooltip content used instead of `text` while it is clipped.
 * @param [children] - Custom value content, rendered instead of `text`.
 * @param [postfix] - Element after the value.
 * @param [className] - Additional CSS classes for the root element.
 */
export const LabelledText: FC<LabelledTextProps> = ({
  label,
  text,
  tooltip,
  children,
  postfix,
  className,
}) => {
  const hasValue = !!children || text != null;

  return (
    <div
      className={mergeClasses(
        'flex flex-col gap-1',
        !children && 'max-w-[200px]',
        className,
        DIAL_KIT_CLASS.labelledText,
      )}
    >
      <Label label={label} />
      {hasValue && (
        <div className="flex min-w-0 items-center gap-2 text-primary">
          {children ?? (
            <EllipsisTooltip
              text={text}
              customTooltipContent={tooltip}
              className="dial-small-text min-w-0 flex-1"
            />
          )}
          {!children && postfix}
        </div>
      )}
    </div>
  );
};
