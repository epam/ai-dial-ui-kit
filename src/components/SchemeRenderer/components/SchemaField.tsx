import type { FC } from 'react';
import { DialFormItem } from '@/components/FormItem/FormItem';
import type { SchemaFieldProps } from '@/components/SchemeRenderer/types';
import { useSchemaContext } from '@/components/SchemeRenderer/context';
import {
  resolveRef,
  isObjectType,
  buildSummary,
  validateRequired,
} from '@/components/SchemeRenderer/utils';
import { SchemaSection } from './SchemaSection';
import { SchemaFieldContent } from './SchemaFieldContent';

/**
 * Renders a single schema property as a labeled field or a collapsible section.
 * aliases: SchemaPropertyField|SchemaFormField
 *
 * @example
 * ```tsx
 * <SchemaField
 *   schema={{ type: 'string' }}
 *   value="hello"
 *   onChange={(v) => console.log(v)}
 *   path={['name']}
 *   level={1}
 *   required
 *   label="Name"
 * />
 * ```
 *
 * @param schema - The JSON Schema definition for this field
 * @param value - Current field value
 * @param onChange - Called with the updated value when the field changes
 * @param path - Field path segments used for validation error tracking
 * @param [level=0] - Nesting depth; object/array fields render as collapsible sections
 * @param [required] - Whether the field is required (shows error when empty)
 * @param [label] - Display label; falls back to schema title or path segment
 */
export const SchemaField: FC<SchemaFieldProps> = ({
  schema,
  value,
  onChange,
  path,
  level = 0,
  required,
  label,
}) => {
  const { rootSchema, defaultExpanded = true } = useSchemaContext();
  const resolved = resolveRef(schema, rootSchema);

  const isObject = isObjectType(resolved);
  const isArray = resolved.type === 'array';

  if (isObject || isArray) {
    const summary = buildSummary(value, resolved, rootSchema);
    const errors = validateRequired(
      value,
      resolved,
      rootSchema,
      path.join('.'),
    );
    return (
      <SchemaSection
        title={label ?? resolved.title ?? path[path.length - 1] ?? 'Section'}
        description={resolved.description}
        level={level}
        summary={summary}
        errorCount={errors.length}
        defaultExpanded={defaultExpanded}
      >
        <SchemaFieldContent
          schema={resolved}
          value={value}
          onChange={onChange}
          path={path}
          level={level + 1}
          required={required}
        />
      </SchemaSection>
    );
  }

  const error =
    required && (value === undefined || value === null || value === '')
      ? `${label ?? 'Field'} is required`
      : undefined;

  return (
    <DialFormItem
      label={label}
      required={required}
      description={resolved.description}
      error={error}
    >
      <SchemaFieldContent
        schema={resolved}
        value={value}
        onChange={onChange}
        path={path}
        level={level}
        required={required}
      />
    </DialFormItem>
  );
};
