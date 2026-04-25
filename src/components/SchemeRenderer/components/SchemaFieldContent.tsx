import type { FC } from 'react';
import type { SchemaFieldContentProps } from '../types';
import { useSchemaContext } from '../context';
import { resolveRef, isObjectType } from '../utils';
import { SchemaObjectEditor } from './SchemaObjectEditor';
import { SchemaArrayEditor } from './SchemaArrayEditor';
import { SchemaOneOfEditor } from './SchemaOneOfEditor';
import { SchemaAnyOfEditor } from './SchemaAnyOfEditor';
import { SchemaKeyValueEditor } from './SchemaKeyValueEditor';
import { SchemaPrimitiveField } from './SchemaPrimitiveField';

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
