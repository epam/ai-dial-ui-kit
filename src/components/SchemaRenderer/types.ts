import type React from 'react';
import type { EditorThemes } from '@/types/editor';

export enum SchemaRendererVariant {
  Sections = 'sections',
  Flat = 'flat',
  FlatSections = 'flat-sections',
}

export enum SchemaDisplayMode {
  Select = 'select',
  Radio = 'radio',
}

export enum SchemaOrientation {
  Row = 'row',
  Column = 'column',
}

export enum JsonSchemaType {
  String = 'string',
  Number = 'number',
  Integer = 'integer',
  Boolean = 'boolean',
  Object = 'object',
  Array = 'array',
  Null = 'null',
}

export interface JsonSchemaDef {
  $ref?: string;
  type?: string | string[];
  title?: string;
  description?: string;
  isHidden?: boolean;
  isProtected?: boolean;
  enumDisplay?: SchemaDisplayMode;
  enumOrientation?: SchemaOrientation;
  discriminatorDisplay?: SchemaDisplayMode;
  discriminatorOrientation?: SchemaOrientation;
  default?: unknown;
  const?: unknown;
  enum?: unknown[];
  properties?: Record<string, JsonSchemaDef>;
  required?: string[];
  items?: JsonSchemaDef;
  oneOf?: JsonSchemaDef[];
  anyOf?: JsonSchemaDef[];
  discriminator?: {
    propertyName: string;
    mapping: Record<string, string>;
  };
  'dial:meta'?: Record<string, unknown>;
  'dial:resource'?: boolean;
  acceptableResourceTypes?: string[];
  [key: string]: unknown;
}

export interface JsonSchema extends JsonSchemaDef {
  $defs?: Record<string, JsonSchemaDef>;
}

export interface ValidationError {
  path: string;
  message: string;
}

export interface SchemaRendererTexts {
  noItemSchema: string;
  noItemsYet: string;
  addItem: string;
  selectTypeToAdd: string;
  noConfigurableProperties: string;
  noFieldsYet: string;
  keyColumnHeader: string;
  valueColumnHeader: string;
  addField: string;
  keyInputPlaceholder: string;
  stringInputPlaceholder: string;
  integerInputPlaceholder: string;
  numberInputPlaceholder: string;
  enumSelectPlaceholder: string;
  selectTypePlaceholder: string;
  removeItemAriaLabel: string;
  removeFieldAriaLabel: string;
}

export const DEFAULT_SCHEMA_TEXTS: SchemaRendererTexts = {
  noItemSchema: 'No item schema defined.',
  noItemsYet: 'No items yet. Add one below.',
  addItem: 'Add Item',
  selectTypeToAdd: 'Select type to add…',
  noConfigurableProperties: 'No configurable properties.',
  noFieldsYet: 'No fields yet. Add one below.',
  keyColumnHeader: 'Key',
  valueColumnHeader: 'Value',
  addField: 'Add Field',
  keyInputPlaceholder: 'Enter key',
  stringInputPlaceholder: 'Enter a value',
  integerInputPlaceholder: 'Enter a whole number',
  numberInputPlaceholder: 'Enter a number',
  enumSelectPlaceholder: 'Select an option',
  selectTypePlaceholder: 'Select type',
  removeItemAriaLabel: 'Remove item',
  removeFieldAriaLabel: 'Remove field',
};

export interface DialSchemaRendererProps {
  schema: JsonSchema;
  defaultValue?: Record<string, unknown>;
  texts?: Partial<SchemaRendererTexts>;
  className?: string;
  readonly?: boolean;
  defaultExpanded?: boolean;
  inputClassName?: string;
  /**
   * `'sections'` (default) — every top-level property is a collapsible SchemaSection card.
   * `'flat'` — primitive top-level properties render as plain DialFormItem fields; object/array
   * properties still use collapsible sections.
   */
  variant?: SchemaRendererVariant;
  /**
   * When `true`, required-field errors are only shown after the user has interacted
   * with a field. When `false` (default), all unfilled required fields are highlighted immediately.
   */
  skipUntouched?: boolean;
  /**
   * Theme applied to the JSON editor shown for value keys that are not declared in the
   * schema's `properties`. Defaults to `EditorThemes.dark`.
   */
  jsonEditorTheme?: EditorThemes;
  /**
   * Live resource options for schema properties flagged with `dial:resource: true`.
   * Keyed by the resource type name referenced in a property's `acceptableResourceTypes`
   * array; each value provides the selectable entries for that resource type (a string
   * array for string-typed properties).
   */
  acceptableResourceTypes?: Record<string, unknown>;
  onChange?: (value: Record<string, unknown>) => void;
  onPropertyChange?: (path: string, value: unknown) => void;
  onDefaultValues?: (value: Record<string, unknown>) => void;
  /**
   * Override the rendered element for any field by path.
   * Return `defaultElement` to fall back to the built-in renderer.
   * @param path - Array of schema property keys leading to this field (e.g. ['connection', 'token'])
   * @param schema - The resolved JSON Schema definition for this field
   * @param defaultElement - The element that would be rendered without customization
   */
  renderField?: (
    path: string[],
    schema: JsonSchemaDef,
    defaultElement: React.ReactElement,
  ) => React.ReactNode;
}

export interface SchemaFieldContentProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string[];
  level: number;
  required?: boolean;
  suppressInlineError?: boolean;
}

export interface SchemaFieldProps extends SchemaFieldContentProps {
  label?: string;
}
