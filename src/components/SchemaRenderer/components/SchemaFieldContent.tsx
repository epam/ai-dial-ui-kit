import type { FC, ReactElement } from 'react';
import { DialErrorText } from '@/components/CaptionText/CaptionText';
import { JsonSchemaType } from '@/components/SchemaRenderer/types';
import type { SchemaFieldContentProps } from '@/components/SchemaRenderer/types';
import { useSchemaContext } from '@/components/SchemaRenderer/context';
import {
  resolveRef,
  isObjectType,
  isMissingRequiredValue,
} from '@/components/SchemaRenderer/utils';
import { SchemaObjectEditor } from './SchemaObjectEditor';
import { SchemaArrayEditor } from './SchemaArrayEditor';
import { SchemaOneOfEditor } from './SchemaOneOfEditor';
import { SchemaAnyOfEditor } from './SchemaAnyOfEditor';
import { SchemaKeyValueEditor } from './SchemaKeyValueEditor';
import { SchemaPrimitiveField } from './SchemaPrimitiveField';
import { SchemaAdditionalPropertiesEditor } from './SchemaAdditionalPropertiesEditor';

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
  suppressInlineError = false,
}) => {
  const {
    rootSchema,
    renderField,
    markTouched = () => {},
    touchedPaths = new Set<string>(),
    skipUntouched = false,
    jsonEditorTheme,
  } = useSchemaContext();
  const resolved = resolveRef(schema, rootSchema);

  const handleChange = (v: unknown) => {
    markTouched(path.join('.'));
    onChange(v);
  };

  const isTouched = !skipUntouched || touchedPaths.has(path.join('.'));

  let defaultElement: ReactElement;

  if (resolved.oneOf) {
    defaultElement = (
      <SchemaOneOfEditor
        schema={resolved}
        value={value}
        onChange={handleChange}
        path={path}
        level={level}
      />
    );
  } else if (resolved.anyOf && resolved.type !== JsonSchemaType.Object) {
    defaultElement = (
      <SchemaAnyOfEditor
        schema={resolved}
        value={value}
        onChange={handleChange}
        path={path}
        level={level}
      />
    );
  } else if (isObjectType(resolved)) {
    const hasAdditionalProps =
      resolved.additionalProperties != null &&
      resolved.additionalProperties !== false;
    const hasNoFixedProps =
      !resolved.properties || Object.keys(resolved.properties).length === 0;

    if (hasAdditionalProps && hasNoFixedProps) {
      defaultElement = (
        <SchemaKeyValueEditor
          schema={resolved}
          value={value}
          onChange={handleChange}
        />
      );
    } else if (hasNoFixedProps && resolved.additionalProperties !== false) {
      defaultElement = (
        <SchemaAdditionalPropertiesEditor
          value={value}
          onChange={handleChange}
          theme={jsonEditorTheme}
        />
      );
    } else {
      defaultElement = (
        <SchemaObjectEditor
          schema={resolved}
          value={value}
          onChange={handleChange}
          path={path}
          level={level}
        />
      );
    }
  } else if (resolved.type === JsonSchemaType.Array) {
    defaultElement = (
      <SchemaArrayEditor
        schema={resolved}
        value={value}
        onChange={handleChange}
        path={path}
        level={level}
      />
    );
  } else {
    const isPrimitiveInvalid =
      isTouched && required && isMissingRequiredValue(value);
    const primitiveErrorMessage =
      !suppressInlineError && isPrimitiveInvalid
        ? `${resolved.title ?? 'Field'} is required`
        : undefined;
    defaultElement = (
      <>
        <SchemaPrimitiveField
          schema={resolved}
          value={value}
          onChange={handleChange}
          invalid={isPrimitiveInvalid}
        />
        <DialErrorText text={primitiveErrorMessage} />
      </>
    );
  }

  return renderField
    ? (renderField(path, resolved, defaultElement) as ReactElement)
    : defaultElement;
};
