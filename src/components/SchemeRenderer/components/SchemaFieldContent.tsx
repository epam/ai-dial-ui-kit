import type { FC } from 'react';
import type { SchemaFieldContentProps } from '@/components/SchemeRenderer/types';
import { useSchemaContext } from '@/components/SchemeRenderer/context';
import { resolveRef, isObjectType } from '@/components/SchemeRenderer/utils';
import { SchemaObjectEditor } from './SchemaObjectEditor';
import { SchemaArrayEditor } from './SchemaArrayEditor';
import { SchemaOneOfEditor } from './SchemaOneOfEditor';
import { SchemaAnyOfEditor } from './SchemaAnyOfEditor';
import { SchemaKeyValueEditor } from './SchemaKeyValueEditor';
import { SchemaPrimitiveField } from './SchemaPrimitiveField';

/**
 * Routes a resolved schema to the appropriate editor component.
 * aliases: SchemaEditorRouter|SchemaContentDispatcher
 *
 * @example
 * ```tsx
 * <SchemaFieldContent
 *   schema={{ type: 'string' }}
 *   value="hello"
 *   onChange={(v) => console.log(v)}
 *   path={['name']}
 *   level={1}
 * />
 * ```
 *
 * @param schema - The JSON Schema definition to render
 * @param value - Current field value
 * @param onChange - Called with the updated value when the field changes
 * @param path - Field path segments used for validation error tracking
 * @param level - Nesting depth passed to child editor components
 * @param [required] - Whether the field is required (passed to primitive fields for error styling)
 */
export const SchemaFieldContent: FC<SchemaFieldContentProps> = ({
  schema,
  value,
  onChange,
  path,
  level,
  required,
}) => {
  const { rootSchema } = useSchemaContext();
  const resolved = resolveRef(schema, rootSchema);

  if (resolved.discriminator && resolved.oneOf) {
    return (
      <SchemaOneOfEditor
        schema={resolved}
        value={value}
        onChange={onChange}
        path={path}
        level={level}
      />
    );
  }

  if (resolved.oneOf) {
    return (
      <SchemaOneOfEditor
        schema={resolved}
        value={value}
        onChange={onChange}
        path={path}
        level={level}
      />
    );
  }

  if (resolved.anyOf) {
    return (
      <SchemaAnyOfEditor
        schema={resolved}
        value={value}
        onChange={onChange}
        path={path}
        level={level}
      />
    );
  }

  if (isObjectType(resolved)) {
    const hasAdditionalProps =
      resolved.additionalProperties != null &&
      resolved.additionalProperties !== false;
    const hasNoFixedProps =
      !resolved.properties || Object.keys(resolved.properties).length === 0;

    if (hasAdditionalProps && hasNoFixedProps) {
      return (
        <SchemaKeyValueEditor
          schema={resolved}
          value={value}
          onChange={onChange}
        />
      );
    }

    return (
      <SchemaObjectEditor
        schema={resolved}
        value={value}
        onChange={onChange}
        path={path}
        level={level}
      />
    );
  }

  if (resolved.type === 'array') {
    return (
      <SchemaArrayEditor
        schema={resolved}
        value={value}
        onChange={onChange}
        path={path}
        level={level}
      />
    );
  }

  return (
    <SchemaPrimitiveField
      schema={resolved}
      value={value}
      onChange={onChange}
      invalid={
        required && (value === undefined || value === null || value === '')
      }
    />
  );
};
