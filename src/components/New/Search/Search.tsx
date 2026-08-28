import { IconSearch, IconX } from '@tabler/icons-react';
import { useCallback, useRef, type FC } from 'react';

import { useMergeRefs } from '@floating-ui/react';

import { GhostIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { Input, type InputProps } from '@/components/New/Input/Input';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';

/** The magnifier tracks the field height; the clear button stays small at every size. */
const SEARCH_ICON_SIZE: Record<ElementSize, DIAL_ICON_SIZE> = {
  [ElementSize.Small]: DIAL_ICON_SIZE.SM,
  [ElementSize.Standard]: DIAL_ICON_SIZE.MD,
  [ElementSize.Large]: DIAL_ICON_SIZE.MD,
};

export interface SearchProps extends Omit<
  InputProps,
  | 'type'
  | 'iconBefore'
  | 'iconAfter'
  | 'inputButtonProps'
  | 'prefix'
  | 'postfix'
  | 'children'
> {
  /**
   * Drops the field's border and background so the input sits flush in a
   * toolbar or panel header. The border is kept transparent rather than removed,
   * so toggling this never shifts the layout by a pixel.
   */
  withoutBorder?: boolean;
  /** Accessible name of the clear button. */
  clearLabel?: string;
}

/**
 * A search field with a leading magnifier and a clear button, built on {@link Input}.
 * aliases: SearchField|QueryInput|SearchBox
 * Design system 2.0
 *
 * Fully controlled: it renders exactly the `value` it is given and reports every
 * edit through `onChange`, which receives `undefined` for an empty field. The
 * clear button appears only while there is something to clear, and returns focus
 * to the input once pressed so keyboard users are not dropped to the page body.
 *
 * `type` and both icon slots are owned by this component; every other
 * {@link Input} prop is passed through.
 *
 * @example
 * ```tsx
 * <Search
 *   id="search"
 *   value={query}
 *   placeholder="Search"
 *   onChange={setQuery}
 * />
 * ```
 *
 * @param [size=ElementSize.Standard] - Field height: standard is 40px, small is 24px
 * @param [placeholder="Search..."] - Placeholder shown while the field is empty
 * @param [withoutBorder=false] - Renders the field without its border and background
 * @param [clearLabel="Clear search"] - Accessible name of the clear button
 * @param [disabled=false] - Disables the field and hides the clear button
 */
export const Search: FC<SearchProps> = ({
  size = ElementSize.Standard,
  placeholder = 'Search...',
  withoutBorder = false,
  clearLabel = 'Clear search',
  disabled,
  value,
  onChange,
  wrapperClassName,
  inputRef,
  ...props
}) => {
  const innerRef = useRef<HTMLInputElement | null>(null);
  const ref = useMergeRefs([inputRef, innerRef]);

  // Nothing to clear on an empty field, and a disabled one cannot be cleared.
  const showClear = !!value && !disabled;

  const onClear = useCallback(() => {
    onChange?.(undefined);
    // The button unmounts with the value it cleared, so focus would otherwise
    // fall back to the document body mid-interaction.
    innerRef.current?.focus();
  }, [onChange]);

  return (
    <Input
      {...props}
      size={size}
      value={value}
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      inputRef={ref}
      wrapperClassName={mergeClasses(
        withoutBorder && 'dial-kit-input-borderless',
        wrapperClassName,
      )}
      iconBefore={
        <IconSearch
          size={SEARCH_ICON_SIZE[size]}
          stroke={DIAL_KIT_ICON_STROKE}
          className="text-secondary"
          aria-hidden="true"
        />
      }
      iconAfter={
        showClear ? (
          <GhostIconButton
            size={ElementSize.Small}
            aria-label={clearLabel}
            icon={
              <IconX
                size={DIAL_ICON_SIZE.SM}
                stroke={DIAL_KIT_ICON_STROKE}
                aria-hidden="true"
              />
            }
            onClick={onClear}
          />
        ) : undefined
      }
    />
  );
};
