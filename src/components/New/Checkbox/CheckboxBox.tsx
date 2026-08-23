import { IconCheck, IconMinus } from '@tabler/icons-react';
import type { FC } from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { CHECKBOX_ICON_PROPS } from './constants';

export interface CheckboxBoxProps {
  isSelected?: boolean;
  isIndeterminate?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  htmlFor?: string;
  className?: string;
}

/**
 * The 20px box a checkbox draws — the square, its border, its fill and the
 * check or dash inside.
 * Design system 2.0
 *
 * Two things render it: {@link Checkbox}, where it is the `<label for>` that
 * toggles the input next to it, and rows that only *look* like a checkbox —
 * a `menuitemcheckbox` in a dropdown, whose state lives on `aria-checked` and
 * whose whole row is the control. Passing `htmlFor` picks the first: the box
 * becomes a label with a pointer target of its own. Without it the box is a
 * decorative `<span>`, hidden from assistive technology, and the row around it
 * carries both the state and the pointer target.
 *
 * @param [isSelected=false] - Whether the box is filled with a check
 * @param [isIndeterminate=false] - Whether the box is filled with a dash; takes precedence over `isSelected`
 * @param [invalid=false] - Paints the box with the error colour
 * @param [disabled=false] - Greys the box out
 * @param [htmlFor] - Id of the input this box labels; omit for a decorative box
 * @param [className] - Additional classes for the box
 */
export const CheckboxBox: FC<CheckboxBoxProps> = ({
  isSelected = false,
  isIndeterminate = false,
  invalid = false,
  disabled = false,
  htmlFor,
  className,
}) => {
  const isFilled = isIndeterminate || isSelected;
  const isControl = !!htmlFor;

  const boxClassName = mergeClasses(
    'grid size-[20px] shrink-0 place-items-center rounded border transition-colors duration-200',
    // 20px is below the 24x24 minimum target, so grow the pointer target
    // without touching the rendered size. The 44px enhanced target would
    // overhang by 12px per side and swallow the adjacent label. A decorative
    // box is not a target at all — the row around it is.
    isControl && 'dial-kit-minimum-target',
    isControl && 'peer-focus-visible:outline peer-focus-visible:outline-focus',
    disabled
      ? 'border-transparent bg-control-disable-primary text-control-disable-primary'
      : mergeClasses(
          invalid &&
            isFilled &&
            'border-transparent bg-control-error text-control-permanent',
          invalid && !isFilled && 'border-error bg-control-neutral',
          !invalid &&
            isFilled &&
            'border-transparent bg-control-accent text-control-permanent hover:bg-control-accent-hover',
          !invalid &&
            !isFilled &&
            'border-default bg-control-neutral hover:border-accent hover:bg-control-accent-alpha-hover',
        ),
    disabled ? 'cursor-not-allowed' : isControl && 'cursor-pointer',
    className,
  );

  const glyph = isIndeterminate ? (
    <IconMinus {...CHECKBOX_ICON_PROPS} />
  ) : (
    isSelected && <IconCheck {...CHECKBOX_ICON_PROPS} />
  );

  if (!isControl) {
    return (
      <span aria-hidden="true" className={boxClassName}>
        {glyph}
      </span>
    );
  }

  return (
    <label htmlFor={htmlFor} className={boxClassName}>
      {glyph}
    </label>
  );
};
