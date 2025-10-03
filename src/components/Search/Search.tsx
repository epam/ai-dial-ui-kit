import { useCallback, useEffect, useState, type FC } from 'react';
import { DialInput, type DialInputProps } from '@/components/Input/Input';
import { DialIcon } from '@/components/Icon/Icon';
import { IconSearch, IconX } from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import classNames from 'classnames';

/**
 * An input component with a customizable placeholder, icons, flexible props, and the ability to clear the input value via a clear button.
 *
 * @example
 * ```tsx
 * <DialSearch
 *   elementId="search"
 *   value={query}
 *   placeholder="search"
 *   onChange={e => setQuery(e.target.value)}
 *   disabled={false}
 * />
 * ```
 *
 * @param elementId - Unique identifier for the input element
 * @param [value] - The current value of the input
 * @param [placeholder] - The placeholder text for the input
 * @param [onChange] - Callback function called when the input value changes
 * @param [disabled=false] - Whether the input is disabled
 */
export const DialSearch: FC<DialInputProps> = ({ onChange, ...props }) => {
  const [query, setQuery] = useState(props.value || '');

  useEffect(() => {
    setQuery(props.value || '');
  }, [props.value]);

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      onChange?.(value);
    },
    [onChange, setQuery],
  );

  return (
    <DialInput
      value={query}
      onChange={handleChange}
      tooltipTriggerClassName={classNames([
        props.tooltipTriggerClassName,
        'flex-1',
      ])}
      cssClass={classNames([props.cssClass, 'w-full'])}
      iconBeforeInput={
        <DialIcon
          className={classNames([
            props.disabled ? 'text-secondary' : 'text-primary',
          ])}
          icon={<IconSearch {...BASE_ICON_PROPS} />}
        />
      }
      iconAfterInput={
        props.value ? (
          <DialIcon
            className="text-primary"
            icon={
              <IconX
                {...BASE_ICON_PROPS}
                onClick={() => handleChange('')}
                aria-label="Clear search"
                role="button"
              />
            }
          />
        ) : undefined
      }
      {...props}
    />
  );
};
