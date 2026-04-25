import type { FC } from 'react';
import { DialLabel } from '@/components/Label/Label';
import { DialErrorText } from '@/components/CaptionText/CaptionText';
import type { SchemaFieldProps } from '../types';
import { useSchemaContext } from '../context';
import {
  resolveRef,
  isObjectType,
  buildSummary,
  validateRequired,
} from '../utils';
import { SchemaSection } from './SchemaSection';
import { SchemaFieldContent } from './SchemaFieldContent';

export const SchemaField: FC<SchemaFieldProps> = ({
  schema,
  value,
  onChange,
  path,
  level = 0,
  required,
  label,
}) => {
  const { rootSchema } = useSchemaContext();
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
    <div className="flex flex-col gap-1">
      {label && (
        <DialLabel
          label={label}
          required={required}
          caption={resolved.description}
        />
      )}
      <SchemaFieldContent
        schema={resolved}
        value={value}
        onChange={onChange}
        path={path}
        level={level}
        required={required}
      />
      {error && <DialErrorText text={error} />}
    </div>
  );
};
