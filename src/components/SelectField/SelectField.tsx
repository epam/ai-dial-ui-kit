import type { FC } from 'react';

import {
  DialFormItem,
  type DialFormItemProps,
} from '@/components/FormItem/FormItem';
import { DialSelect, type DialSelectProps } from '@/components/Select/Select';

import type { DialFieldLabelProps } from '../Field/Field';

export interface DialSelectFieldProps
  extends Omit<DialSelectProps, 'cssClass'>,
    Omit<DialFieldLabelProps, 'htmlFor'>,
    Omit<DialFormItemProps, 'label' | 'children'> {
  selectCssClass?: string;
  containerCssClass?: string;
}

/**
 * A Select field wrapper that composes `DialFormItem` and `DialSelect`.
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
 * @param selectCssClass CSS class for the select element
 * @param containerCssClass CSS class for the form item container
 * @param emptyStateTitle Title to show when there are no options
 * @param restSelectProps All other DialSelect props
 * @param restFormItemProps All other DialFormItem props
 * ```
 */
export const DialSelectField: FC<DialSelectFieldProps> = ({
  fieldTitle,
  optional,
  captionDescription,
  containerCssClass,
  selectCssClass,
  error,
  emptyStateTitle = 'No options available',
  options,
  multiple,
  value,
  defaultValue,
  placeholder,
  searchable,
  selectAll,
  selectAllLabel,
  disabled,
  closable,
  onClose,
  onChange,
  elementId,
  description,
  ...restSelectProps
}) => {
  return (
    <DialFormItem
      elementId={elementId}
      label={fieldTitle}
      optional={optional}
      description={description}
      error={error}
      captionDescription={captionDescription}
      cssClass={containerCssClass}
    >
      <DialSelect
        options={options}
        multiple={multiple}
        value={value ?? undefined}
        defaultValue={defaultValue}
        placeholder={placeholder}
        searchable={searchable}
        selectAll={selectAll}
        selectAllLabel={selectAllLabel}
        emptyStateTitle={emptyStateTitle}
        disabled={disabled}
        closable={closable}
        onClose={onClose}
        onChange={onChange}
        cssClass={selectCssClass}
        {...restSelectProps}
      />
    </DialFormItem>
  );
};
