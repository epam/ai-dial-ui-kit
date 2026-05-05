import type { FC } from 'react';
import { DialFormItem } from '@/components/FormItem/FormItem';
import { JsonSchemaType } from '@/components/SchemaRenderer/types';
import type { SchemaFieldProps } from '@/components/SchemaRenderer/types';
import { useSchemaContext } from '@/components/SchemaRenderer/context';
import {
  resolveRef,
  isObjectType,
  buildSummary,
  validateRequired,
  isMissingRequiredValue,
} from '@/components/SchemaRenderer/utils';
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
 * @param [skipUntouched] - When `true`, required-field errors are only shown after the user has interacted with a field.
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
  const {
    rootSchema,
    defaultExpanded = true,
    touchedPaths = new Set<string>(),
    skipUntouched = false,
  } = useSchemaContext();
  const resolved = resolveRef(schema, rootSchema);

  const isObject = isObjectType(resolved);
  const isArray = resolved.type === JsonSchemaType.Array;

  if (isObject || isArray) {
    const summary = buildSummary(value, resolved, rootSchema);
    const errors = validateRequired(
      value,
      resolved,
      rootSchema,
      path.join('.'),
    );
    const pathStr = path.join('.');
    const prefix = pathStr + '.';
    const isSectionTouched =
      !skipUntouched ||
      touchedPaths.has(pathStr) ||
      [...touchedPaths].some((p) => p.startsWith(prefix));
    return (
      <SchemaSection
        title={label ?? resolved.title ?? path[path.length - 1] ?? 'Section'}
        description={resolved.description}
        level={level}
        summary={summary}
        errorCount={isSectionTouched ? errors.length : 0}
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

  const isTouched = !skipUntouched || touchedPaths.has(path.join('.'));
  const error =
    isTouched && required && isMissingRequiredValue(value)
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
        suppressInlineError
      />
    </DialFormItem>
  );
};
