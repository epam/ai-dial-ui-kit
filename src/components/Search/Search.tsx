import { IconSearch, IconX } from '@tabler/icons-react';
import { useCallback, useEffect, useMemo, useState, type FC } from 'react';

import { ElementSize } from '@/types/size';
import { DialInput, type DialInputProps } from '../Input/Input';
import { SIZE_CONFIG } from './constants';
import { mergeClasses } from '../../utils/merge-classes';

export interface DialSearchProps extends Omit<
  DialInputProps,
  | 'type'
  | 'size'
  | 'inputButtonProps'
  | 'labelProps'
  | 'iconBefore'
  | 'iconAfter'
  | 'prefix'
  | 'postfix'
  | 'onChange'
> {
  withoutBorder?: boolean;
  size?: ElementSize;
  onChange?: (value: string) => void;
}

/**
 * A search input component with a customizable placeholder, icons, flexible props, and the ability
 * aliases: SearchField|QueryInput
 * Design system 1.0
 *
 * to clear the input value via a clear button. Supports multiple sizes for flexible layouts.
 *
 * @example
 * ```tsx
 * <DialSearch
 *   id="search"
 *   value={query}
 *   placeholder="Search"
 *   size={ElementSize.Small}
 *   onChange={(value) => setQuery(value)}
 *   onBlur={() => handleBlur()}
 *   disabled={false}
 * />
 * ```
 *
 * Extends the `DialInput` component, inheriting all of its props except for those that are overridden
 * (like `iconBefore`, `iconAfter`, and `inputButtonProps` which are managed internally). The `size`
 * prop allows you to choose between predefined size configurations that adjust the input's appearance
 * @param [size=ElementSize.Standard] - The size of the search input. Uses the {@link ElementSize} enum.
 * @param [withoutBorder] - If true, the search input will be rendered without a border.
 */
export const DialSearch: FC<DialSearchProps> = ({
  size = ElementSize.Standard,
  placeholder = 'Search...',
  value,
  onChange,
  withoutBorder,
  ...props
}) => {
  const [query, setQuery] = useState(value || '');

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const onQueryChange = useCallback(
    (newValue?: string) => {
      setQuery(newValue || '');
      onChange?.(newValue || '');
    },
    [onChange],
  );

  const sizeConfig = SIZE_CONFIG[size];

  const onClickClear = useCallback(() => {
    onQueryChange('');
  }, [onQueryChange]);

  const inputButtonProps = useMemo(() => {
    if (!query) return void 0;

    return {
      icon: (
        <IconX
          size={sizeConfig.iconSize}
          aria-label="Clear search"
          role="button"
        />
      ),
      className: withoutBorder ? 'bg-transparent' : '',
      onClick: onClickClear,
      size,
    };
  }, [onClickClear, query, size, sizeConfig.iconSize, withoutBorder]);

  return (
    <DialInput
      placeholder={placeholder}
      iconBefore={
        <IconSearch size={sizeConfig.iconSize} stroke={sizeConfig.iconStroke} />
      }
      value={query}
      onChange={onQueryChange}
      inputButtonProps={inputButtonProps}
      containerClassName={sizeConfig.containerClassName}
      className={sizeConfig.className}
      wrapperClassName={mergeClasses(
        sizeConfig.wrapperClassName,
        withoutBorder ? '!border-0 ps-5 [&>div]:!border-0' : '',
      )}
      {...props}
    />
  );
};
