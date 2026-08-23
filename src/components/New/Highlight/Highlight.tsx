import type { FC } from 'react';
import { mergeClasses } from '../../../utils/merge-classes';
import { EllipsisTooltip } from '../EllipsisTooltip/EllipsisTooltip';

/** Props for `Highlight`. */
export interface HighlightProps {
  /** Full text to display. */
  text: string;
  /** Search query; the first case-insensitive match is highlighted. */
  query: string;
  /** Optional class name for the highlighted segment. */
  markClassName?: string;
  /** Optional class name forwarded to the `EllipsisTooltip` container. */
  className?: string;
  /** Maximum number of lines to display before truncating. Use `1` for single-line ellipsis truncation (e.g. list rows). Defaults to `2`. */
  maxLines?: number;
}

const LINE_CLAMP_CLASS_NAMES: Record<number, string> = {
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
};

const getClampClassName = (maxLines: number): string =>
  maxLines === 1
    ? '!truncate !whitespace-nowrap'
    : `${LINE_CLAMP_CLASS_NAMES[maxLines] ?? LINE_CLAMP_CLASS_NAMES[2]} !whitespace-normal`;

/**
 * Renders text with the first occurrence of `query` wrapped in a highlight mark, with ellipsis truncation and a tooltip when overflowing.
 * Design system 2.0
 */
export const Highlight: FC<HighlightProps> = ({
  text,
  query,
  markClassName,
  className,
  maxLines = 2,
}) => {
  const clampClassName = getClampClassName(maxLines);

  if (!query.trim()) {
    return (
      <EllipsisTooltip
        className={mergeClasses(clampClassName, className)}
        text={text}
      />
    );
  }

  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  const content =
    idx === -1 ? (
      text
    ) : (
      <>
        {text.slice(0, idx)}
        <mark
          className={mergeClasses(
            'text-accent bg-control-accent-alpha-hover',
            markClassName,
          )}
        >
          {text.slice(idx, idx + query.length)}
        </mark>
        {text.slice(idx + query.length)}
      </>
    );

  return (
    <EllipsisTooltip
      className={mergeClasses(clampClassName, className)}
      text={content}
    />
  );
};
