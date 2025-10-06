import { useCallback, useEffect, useState, type FC } from 'react';
import classNames from 'classnames';
import { IconSearch, IconX } from '@tabler/icons-react';

import { DialIcon } from '@/components/Icon/Icon';
import { DialSearchInput, type DialSearchInputProps } from './SearchInput';
import { SIZE_CONFIG } from './constants';
import { SearchSize } from '@/types/search';

export interface DialSearchProps extends DialSearchInputProps {
  size?: SearchSize;
}

/**
 * A search input component with a customizable placeholder, icons, flexible props, and the ability
 * to clear the input value via a clear button. Supports multiple sizes for flexible layouts.
 *
 * @example
 * ```tsx
 * <DialSearch
 *   elementId="search"
 *   value={query}
 *   placeholder="Search"
 *   size="small"
 *   onChange={(value) => setQuery(value)}
 *   disabled={false}
 * />
 * ```
 *
 * @param elementId - Unique identifier for the input element
 * @param [value] - The current value of the input
 * @param [placeholder] - The placeholder text for the input
 * @param [size='base'] - The size of the search input. Supported values: `'small'` | `'base'`
 * @param [onChange] - Callback function called when the input value changes
 * @param [disabled=false] - Whether the input is disabled
 */
export const DialSearch: FC<DialSearchProps> = ({
  onChange,
  size = SearchSize.Base,
  ...props
}) => {
  const [query, setQuery] = useState(props.value || '');

  useEffect(() => {
    setQuery(props.value || '');
  }, [props.value]);

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      onChange?.(value);
    },
    [onChange],
  );

  const sizeConfig = SIZE_CONFIG[size];

  return (
    <DialSearchInput
      {...props}
      value={query}
      onChange={handleChange}
      cssClass={classNames('w-full', props.cssClass, sizeConfig.textClass)}
      containerCssClass={classNames(sizeConfig.containerClass)}
      iconBeforeInput={
        <DialIcon
          className={classNames(
            props.disabled ? 'text-secondary' : 'text-primary',
          )}
          icon={
            <IconSearch
              size={sizeConfig.iconSize}
              stroke={sizeConfig.iconStroke}
            />
          }
        />
      }
      iconAfterInput={
        query ? (
          <DialIcon
            className="text-primary cursor-pointer"
            icon={
              <IconX
                size={sizeConfig.iconSize}
                stroke={sizeConfig.iconStroke}
                onClick={() => handleChange('')}
                aria-label="Clear search"
                role="button"
              />
            }
          />
        ) : undefined
      }
    />
  );
};
