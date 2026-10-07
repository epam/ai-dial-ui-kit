import type { FC, ReactElement } from 'react';

import { ErrorText } from '@/components/New/CaptionText/CaptionText';
import { JsonSchemaType } from '@/types/json-schema';
import {
  isMissingRequiredValue,
  isObjectType,
  resolveRef,
  toRequiredMessage,
} from '@/utils/json-schema';
import { isPathTouched, useSchemaContext } from '../context';
import type { SchemaFieldContentProps } from '../types';
import { SchemaAnyOfEditor } from './SchemaAnyOfEditor';
import { SchemaArrayEditor } from './SchemaArrayEditor';
import { SchemaJsonEditor } from './SchemaJsonEditor';
import { SchemaKeyValueEditor } from './SchemaKeyValueEditor';
import { SchemaObjectEditor } from './SchemaObjectEditor';
import { SchemaOneOfEditor } from './SchemaOneOfEditor';
import { SchemaPrimitiveField } from './SchemaPrimitiveField';

/**
 * Routes a resolved schema to the editor that renders it.
 * aliases: SchemaEditorRouter|SchemaContentDispatcher
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <SchemaFieldContent
 *   schema={{ type: 'string' }}
 *   value="hello"
 *   onChange={(v) => console.log(v)}
 *   path={['name']}
 *   level={1}
 *   ariaLabel="Name"
 * />
 * ```
 *
 * @param schema - The JSON Schema definition to render
 * @param value - Current field value
 * @param onChange - Called with the updated value when the field changes
 * @param path - Field path segments used for validation error tracking
 * @param level - Nesting depth passed to child editor components
 * @param [required] - Whether the field is required (passed to primitive fields for error styling)
 * @param [suppressInlineError=false] - Leaves the required error to the caller, which renders it under its own label
 * @param [fieldId] - Id given to a primitive control, for a visible label to point at
 * @param [ariaLabel] - Accessible name of the control
 */
export const SchemaFieldContent: FC<SchemaFieldContentProps> = ({
  schema,
  value,
  onChange,
  path,
  level,
  required,
  suppressInlineError = false,
  fieldId,
  ariaLabel,
}) => {
  const { rootSchema, renderField, markTouched, touchedPaths, skipUntouched } =
    useSchemaContext();
  const resolved = resolveRef(schema, rootSchema);
  const pathStr = path.join('.');

  const handleChange = (v: unknown) => {
    markTouched?.(pathStr);
    onChange(v);
  };

  const editorProps = {
    schema: resolved,
    value,
    onChange: handleChange,
    path,
    level,
  };

  let defaultElement: ReactElement;

  if (resolved.oneOf) {
    defaultElement = (
      <SchemaOneOfEditor {...editorProps} ariaLabel={ariaLabel} />
    );
  } else if (resolved.anyOf && resolved.type !== JsonSchemaType.Object) {
    defaultElement = (
      <SchemaAnyOfEditor {...editorProps} ariaLabel={ariaLabel} />
    );
  } else if (isObjectType(resolved)) {
    const hasAdditionalProps =
      resolved.additionalProperties != null &&
      resolved.additionalProperties !== false;
    const hasNoFixedProps =
      !resolved.properties || Object.keys(resolved.properties).length === 0;

    if (hasAdditionalProps && hasNoFixedProps) {
      defaultElement = <SchemaKeyValueEditor {...editorProps} />;
    } else if (hasNoFixedProps && resolved.additionalProperties !== false) {
      defaultElement = (
        <SchemaJsonEditor
          value={value}
          onChange={handleChange}
          id={fieldId}
          ariaLabel={ariaLabel}
        />
      );
    } else {
      defaultElement = <SchemaObjectEditor {...editorProps} />;
    }
  } else if (resolved.type === JsonSchemaType.Array) {
    defaultElement = <SchemaArrayEditor {...editorProps} />;
  } else {
    const isPrimitiveInvalid =
      isPathTouched(pathStr, touchedPaths, skipUntouched) &&
      Boolean(required) &&
      isMissingRequiredValue(value);
    const primitiveErrorMessage =
      !suppressInlineError && isPrimitiveInvalid
        ? toRequiredMessage(resolved.title ?? ariaLabel ?? 'Field')
        : undefined;

    defaultElement = (
      <div className="flex flex-col gap-1">
        <SchemaPrimitiveField
          schema={resolved}
          value={value}
          onChange={handleChange}
          invalid={isPrimitiveInvalid}
          id={fieldId}
          ariaLabel={ariaLabel}
        />
        <ErrorText text={primitiveErrorMessage} />
      </div>
    );
  }

  return renderField
    ? (renderField(path, resolved, defaultElement) as ReactElement)
    : defaultElement;
};
