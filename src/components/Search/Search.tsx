import { useCallback, useEffect, useState, type FC } from 'react';
import classNames from 'classnames';
import { IconSearch, IconX } from '@tabler/icons-react';

import { DialIcon } from '@/components/Icon/Icon';
import { SIZE_CONFIG } from './constants';
import { SearchSize } from '@/types/search';

export interface DialSearchProps {
  elementId: string;
  value?: string | number | null;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  className?: string;
  containerClassName?: string;
  onChange?: (value: string) => void;
  size?: SearchSize;
  allowClear?: boolean;
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
 *   size={SearchSize.Small}
 *   onChange={(value) => setQuery(value)}
 *   disabled={false}
 * />
 * ```
 *
 * @param elementId - Unique identifier for the input element
 * @param [value] - The current value of the input
 * @param [placeholder] - Placeholder text shown when input is empty
 * @param [disabled=false] - Whether the input is disabled
 * @param [readonly=false] - Whether the input is read-only (non-editable)
 * @param [invalid=false] - Whether the input should be styled as invalid
 * @param [className] - Additional CSS classes applied to the input element
 * @param [containerClassName] - Additional CSS classes applied to the container
 * @param [onChange] - Callback fired when the input value changes
 * @param [size=SearchSize.Base] - The size of the search input. Uses the {@link SearchSize} enum.
 * @param [allowClear=true] - Whether to show a clear button when there is a value
 */
export const DialSearch: FC<DialSearchProps> = ({
  elementId,
  value,
  placeholder = 'Search...',
  disabled,
  readonly,
  invalid,
  className,
  containerClassName,
  onChange,
  size = SearchSize.Base,
  allowClear = true,
}) => {
  const [query, setQuery] = useState(value || '');

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const handleChange = useCallback(
    (newValue: string) => {
      setQuery(newValue);
      onChange?.(newValue);
    },
    [onChange],
  );

  const sizeConfig = SIZE_CONFIG[size];

  const handleClear = useCallback(() => {
    handleChange('');
  }, [handleChange]);

  return (
    <div
      className={classNames(
        'dial-input flex flex-row items-center justify-between',
        invalid && 'dial-input-error',
        disabled && 'dial-input-disable',
        readonly && 'dial-input-readonly',
        sizeConfig.containerClassName,
        containerClassName,
      )}
    >
      <DialIcon
        className={classNames(disabled ? 'text-secondary' : 'text-primary')}
        icon={
          <IconSearch
            size={sizeConfig.iconSize}
            stroke={sizeConfig.iconStroke}
          />
        }
      />

      <input
        id={elementId}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={query ?? ''}
        disabled={disabled}
        readOnly={readonly}
        className={classNames(
          'border-0 bg-transparent w-full',
          className,
          sizeConfig.textClass,
        )}
        onChange={(event) =>
          !readonly && handleChange(event.currentTarget.value)
        }
      />

      {query && !readonly && !disabled && allowClear && (
        <DialIcon
          className="text-primary cursor-pointer"
          icon={
            <IconX
              size={sizeConfig.iconSize}
              stroke={sizeConfig.iconStroke}
              onClick={handleClear}
              aria-label="Clear search"
              role="button"
            />
          }
        />
      )}
    </div>
  );
};
