import type { SchemaDisplayMode, SchemaOrientation } from '@/types/json-schema';

export interface DialMeta {
  'dial:propertyOrder'?: number;
  [key: string]: unknown;
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
  allOf?: JsonSchemaDef[];
  discriminator?: {
    propertyName: string;
    mapping: Record<string, string>;
  };
  'dial:meta'?: DialMeta;
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
  typeColumnHeader: string;
  entryTypeString: string;
  entryTypeNumber: string;
  entryTypeBoolean: string;
  entryTypeNull: string;
  entryTypeObject: string;
  entryTypeArray: string;
  entryTypeChangeWarning: string;
  booleanTrueOption: string;
  booleanFalseOption: string;
  invalidJsonError: string;
}
