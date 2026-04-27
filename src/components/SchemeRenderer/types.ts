export interface JsonSchemaDef {
  $ref?: string;
  type?: string | string[];
  title?: string;
  description?: string;
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

export interface DialSchemeRendererProps {
  schema: JsonSchema;
  defaultValue?: Record<string, unknown>;
  texts?: Partial<SchemaRendererTexts>;
  className?: string;
  onChange?: (value: Record<string, unknown>) => void;
  onPropertyChange?: (path: string, value: unknown) => void;
  onDefaultValues?: (value: Record<string, unknown>) => void;
}

export interface SchemaFieldContentProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string[];
  level: number;
  required?: boolean;
}

export interface SchemaFieldProps extends SchemaFieldContentProps {
  label?: string;
}
