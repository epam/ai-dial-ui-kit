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

export interface DialSchemeRendererProps {
  schema: JsonSchema;
  defaultValue?: Record<string, unknown>;
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
