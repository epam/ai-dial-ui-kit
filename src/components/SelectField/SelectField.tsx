import { useCallback, type FC } from 'react';

import {
  DialFormItem,
  type DialFormItemProps,
} from '@/components/FormItem/FormItem';
import { DialSelect, type DialSelectProps } from '@/components/Select/Select';

import type { DialLabelProps } from '@/components/Label/Label';
import { DialMultiSelectTags } from '@/components/Select/MultiSelectTags';

export interface DialSelectFieldProps
  extends
    Omit<DialSelectProps, 'className' | 'elementId'>,
    Omit<DialLabelProps, 'htmlFor'>,
    Omit<DialFormItemProps, 'label' | 'children' | 'value'> {
  selectClassName?: string;
  containerClassName?: string;
}

/**
 * A Select field wrapper that composes `DialFormItem` and `DialSelect`.
 * aliases: SelectInput|ComboField
 *
 * Provides unified label, description, error rendering and a readonly view that shows
 * the selected option labels (comma-separated in single mode, list in multiple).
 *
 * @example
 * ```tsx
 * <DialSelectField
 *   elementId="transport"
 *   fieldTitle="Transport"
 *   options={[
 *     { value: 'SSE', label: 'Server-Sent Events (SSE)' },
 *     { value: 'WS', label: 'WebSocket' },
 *   ]}
 *   value="WS"
 *   onChange={(v) => setTransport(v as string)}
 * />
 *
 * @params - Component properties extending:
 * - {@link DialSelectProps} for select options and props, except for className
 * - {@link DialFormItemProps} for form item props, except for htmlFor
 * - {@link DialLabelProps} for label props, except for label, children, value
 *
 * @param selectClassName CSS class for the select element
 * @param containerClassName CSS class for the form item container
 * @param emptyStateTitle Title to show when there are no options
 * @param restSelectProps All other DialSelect props
 * @param restFormItemProps All other DialFormItem props
 * ```
 */
export const DialSelectField: FC<DialSelectFieldProps> = ({
  label,
  required,
  captionDescription,
  containerClassName,
  selectClassName,
  error,
  id,
  caption,
  readonly,
  value,
  defaultEmptyText,
  ...restSelectProps
}) => {
  const getReadonlyValue = useCallback(() => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return defaultEmptyText ?? 'None';
    }

    if (Array.isArray(value)) {
      return (
        <DialMultiSelectTags
          options={restSelectProps.options}
          selectedValues={value}
        />
      );
    } else {
      const selectedOption = restSelectProps.options?.find(
        (option) => option.value === value,
      );
      return (
        <span aria-readonly={true} className="text-primary">
          {selectedOption?.label || value}
        </span>
      );
    }
  }, [value, restSelectProps.options, defaultEmptyText]);

  return (
    <DialFormItem
      id={id}
      label={label}
      required={required}
      description={caption}
      error={error}
      captionDescription={captionDescription}
      className={containerClassName}
      readonly={readonly}
      value={getReadonlyValue()}
      defaultEmptyText={defaultEmptyText}
    >
      <DialSelect
        className={selectClassName}
        value={value}
        elementId={id}
        invalid={!!error}
        {...restSelectProps}
      />
    </DialFormItem>
  );
};
