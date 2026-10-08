import { type FC, useId } from 'react';

import { ErrorText } from '@/components/New/CaptionText/CaptionText';
import { Label } from '@/components/New/Label/Label';
import { JsonSchemaType } from '@/types/json-schema';
import {
  buildSummary,
  isMissingRequiredValue,
  isObjectType,
  resolveRef,
  toRequiredMessage,
  validateRequired,
} from '@/utils/json-schema';
import { isPathTouched, useSchemaContext } from '../context';
import type { SchemaFieldProps } from '../types';
import { SchemaFieldContent } from './SchemaFieldContent';
import { SchemaSection } from './SchemaSection';

/**
 * Renders a single schema property: a labelled field for a primitive, or a
 * collapsible section for an object or an array.
 * aliases: SchemaPropertyField|SchemaFormField
 * Design system 2.0
 *
 * The label and the required error sit outside {@link SchemaFieldContent}, so
 * a `renderField` override replaces the control and keeps both.
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
  const fieldId = useId();
  const {
    rootSchema,
    defaultExpanded = true,
    touchedPaths,
    skipUntouched,
  } = useSchemaContext();
  const resolved = resolveRef(schema, rootSchema);
  const pathStr = path.join('.');

  if (isObjectType(resolved) || resolved.type === JsonSchemaType.Array) {
    const errors = validateRequired(value, resolved, rootSchema, pathStr);
    const title = label ?? resolved.title ?? path[path.length - 1] ?? 'Section';

    return (
      <SchemaSection
        title={title}
        description={resolved.description}
        level={level}
        summary={buildSummary(value, resolved, rootSchema)}
        errorCount={
          isPathTouched(pathStr, touchedPaths, skipUntouched, true)
            ? errors.length
            : 0
        }
        defaultExpanded={defaultExpanded}
      >
        <SchemaFieldContent
          schema={resolved}
          value={value}
          onChange={onChange}
          path={path}
          level={level + 1}
          required={required}
          ariaLabel={title}
        />
      </SchemaSection>
    );
  }

  const error =
    isPathTouched(pathStr, touchedPaths, skipUntouched) &&
    required &&
    isMissingRequiredValue(value)
      ? toRequiredMessage(label ?? 'Field')
      : undefined;

  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={fieldId}
        label={label}
        required={required}
        caption={resolved.description}
      />
      <div className="flex flex-col gap-1">
        <SchemaFieldContent
          schema={resolved}
          value={value}
          onChange={onChange}
          path={path}
          level={level}
          required={required}
          suppressInlineError
          fieldId={fieldId}
          ariaLabel={label}
        />
        <ErrorText text={error} />
      </div>
    </div>
  );
};
