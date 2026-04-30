import { IconSearch, IconX } from '@tabler/icons-react';
import { useCallback, useEffect, useMemo, useState, type FC } from 'react';

import { ElementSize } from '@/types/size';
import { DialInput, type DialInputProps } from '../Input/Input';
import { SIZE_CONFIG } from './constants';

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
  size?: ElementSize;
  onChange?: (value: string) => void;
}

/**
 * A search input component with a customizable placeholder, icons, flexible props, and the ability
 * aliases: SearchField|QueryInput
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
 */
export const DialSearch: FC<DialSearchProps> = ({
  size = ElementSize.Standard,
  placeholder = 'Search...',
  value,
  onChange,
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
      onClick: onClickClear,
      size,
    };
  }, [onClickClear, query, size, sizeConfig.iconSize]);

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
      wrapperClassName={sizeConfig.wrapperClassName}
      {...props}
    />
  );
};
