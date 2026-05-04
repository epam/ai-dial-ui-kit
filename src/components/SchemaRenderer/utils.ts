import { JsonSchemaType } from './types';
import type { JsonSchema, JsonSchemaDef, ValidationError } from './types';

export function resolveRef(
  schema: JsonSchemaDef,
  rootSchema: JsonSchema,
  depth = 0,
): JsonSchemaDef {
  if (!schema.$ref || depth > 10) return schema;
  const parts = schema.$ref.replace(/^#\//, '').split('/');
  let resolved: unknown = rootSchema;
  for (const part of parts) {
    resolved = (resolved as Record<string, unknown>)?.[part];
  }
  if (!resolved || typeof resolved !== 'object') return schema;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { $ref: _ref, ...siblings } = schema;
  const resolvedDef = resolved as JsonSchemaDef;
  const fullyResolved = resolvedDef.$ref
    ? resolveRef(resolvedDef, rootSchema, depth + 1)
    : resolvedDef;
  return { ...fullyResolved, ...siblings };
}

export function isObjectType(schema: JsonSchemaDef): boolean {
  return (
    schema.type === JsonSchemaType.Object ||
    (schema.properties != null &&
      schema.oneOf == null &&
      schema.anyOf == null &&
      schema.type == null)
  );
}

export function toFieldLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getOptionLabel(
  schema: JsonSchemaDef,
  rootSchema: JsonSchema,
): string {
  if (schema.type === JsonSchemaType.Null) return 'null';
  if (schema.$ref) {
    const resolved = resolveRef(schema, rootSchema);
    return resolved.title ?? schema.$ref.split('/').pop() ?? 'Option';
  }
  if (schema.title) return schema.title;
  if (schema.type) {
    return Array.isArray(schema.type) ? schema.type.join(' | ') : schema.type;
  }
  if (schema.discriminator) {
    return Object.keys(schema.discriminator.mapping).join(' | ');
  }
  if (schema.const != null) return String(schema.const);
  if (schema.oneOf) return 'One of options';
  return 'Option';
}

export function extractDefaults(
  schema: JsonSchemaDef,
  rootSchema: JsonSchema,
  depth = 0,
): unknown {
  if (depth > 15) return undefined;
  const resolved = resolveRef(schema, rootSchema);

  if ('default' in resolved) {
    return resolved.default;
  }

  if (isObjectType(resolved) && resolved.properties) {
    const obj: Record<string, unknown> = {};
    let hasAny = false;
    for (const [key, propSchema] of Object.entries(resolved.properties)) {
      const def = extractDefaults(propSchema, rootSchema, depth + 1);
      if (def !== undefined) {
        obj[key] = def;
        hasAny = true;
      }
    }
    return hasAny ? obj : undefined;
  }

  return undefined;
}

export function validateRequired(
  value: unknown,
  schema: JsonSchemaDef,
  rootSchema: JsonSchema,
  path = '',
  depth = 0,
): ValidationError[] {
  if (depth > 15) return [];
  const errors: ValidationError[] = [];
  const resolved = resolveRef(schema, rootSchema);

  if (resolved.anyOf) {
    const nonNullSchemas = resolved.anyOf.filter(
      (s) => s.type !== JsonSchemaType.Null,
    );
    if (value !== null && value !== undefined && nonNullSchemas.length === 1) {
      return validateRequired(
        value,
        nonNullSchemas[0],
        rootSchema,
        path,
        depth + 1,
      );
    }
    return errors;
  }

  if (resolved.oneOf && resolved.discriminator) {
    const discProp = resolved.discriminator.propertyName;
    const discValue = (value as Record<string, unknown> | undefined)?.[
      discProp
    ] as string | undefined;
    if (discValue && resolved.discriminator.mapping[discValue]) {
      const variantRef = { $ref: resolved.discriminator.mapping[discValue] };
      const variantSchema = resolveRef(variantRef, rootSchema);
      return validateRequired(
        value,
        variantSchema,
        rootSchema,
        path,
        depth + 1,
      );
    }
    return errors;
  }

  if (
    resolved.type === JsonSchemaType.Array ||
    (!resolved.type && Array.isArray(value))
  ) {
    if (Array.isArray(value) && resolved.items) {
      for (let i = 0; i < value.length; i++) {
        const childErrors = validateRequired(
          value[i],
          resolved.items,
          rootSchema,
          `${path}[${i}]`,
          depth + 1,
        );
        errors.push(...childErrors);
      }
    }
    return errors;
  }

  if (!isObjectType(resolved)) return errors;

  const required = resolved.required ?? [];
  const obj = value as Record<string, unknown> | undefined;

  for (const key of required) {
    const fieldPath = path ? `${path}.${key}` : key;
    const v = obj?.[key];
    if (v === undefined || v === null) {
      const propSchema = resolved.properties?.[key];
      const label = propSchema?.title ?? toFieldLabel(key);
      errors.push({ path: fieldPath, message: `${label} is required` });
    }
  }

  if (obj && resolved.properties) {
    for (const [key, propSchema] of Object.entries(resolved.properties)) {
      const fieldPath = path ? `${path}.${key}` : key;
      const v = obj[key];
      if (v !== undefined && v !== null) {
        const childErrors = validateRequired(
          v,
          propSchema,
          rootSchema,
          fieldPath,
          depth + 1,
        );
        errors.push(...childErrors);
      }
    }
  }

  return errors;
}

export function buildSummary(
  value: unknown,
  schema: JsonSchemaDef,
  rootSchema: JsonSchema,
): string {
  const resolved = resolveRef(schema, rootSchema);

  if (Array.isArray(value)) {
    return `${value.length} item${value.length !== 1 ? 's' : ''}`;
  }

  if (isObjectType(resolved) && resolved.properties) {
    const total = Object.keys(resolved.properties).length;
    const obj = value as Record<string, unknown> | undefined;
    const filled = Object.keys(resolved.properties).filter((key) => {
      const v = obj?.[key];
      return v !== undefined && v !== null && v !== '';
    }).length;
    return `${filled}/${total} fields`;
  }

  return '';
}

export function detectAnyOfVariant(
  value: unknown,
  schemas: JsonSchemaDef[],
  rootSchema: JsonSchema,
): number {
  if (value === null || value === undefined) {
    const nullIdx = schemas.findIndex((s) => s.type === JsonSchemaType.Null);
    return nullIdx >= 0 ? nullIdx : 0;
  }

  if (Array.isArray(value)) {
    const idx = schemas.findIndex((s) => {
      const r = resolveRef(s, rootSchema);
      return r.type === JsonSchemaType.Array;
    });
    return idx >= 0 ? idx : 0;
  }

  if (typeof value === 'boolean') {
    const idx = schemas.findIndex((s) => {
      const r = resolveRef(s, rootSchema);
      return r.type === JsonSchemaType.Boolean;
    });
    return idx >= 0 ? idx : 0;
  }

  if (typeof value === 'number') {
    const idx = schemas.findIndex((s) => {
      const r = resolveRef(s, rootSchema);
      return (
        r.type === JsonSchemaType.Number || r.type === JsonSchemaType.Integer
      );
    });
    return idx >= 0 ? idx : 0;
  }

  if (typeof value === 'string') {
    const idx = schemas.findIndex((s) => {
      const r = resolveRef(s, rootSchema);
      return r.type === JsonSchemaType.String;
    });
    return idx >= 0 ? idx : 0;
  }

  if (typeof value === 'object') {
    const objVal = value as Record<string, unknown>;
    for (let i = 0; i < schemas.length; i++) {
      const r = resolveRef(schemas[i], rootSchema);
      if (r.discriminator) {
        const discProp = r.discriminator.propertyName;
        if (discProp in objVal) return i;
      }
    }
    for (let i = 0; i < schemas.length; i++) {
      const r = resolveRef(schemas[i], rootSchema);
      if (isObjectType(r) || r.oneOf) return i;
    }
    return 0;
  }

  return 0;
}

export function getItemTitle(
  item: unknown,
  discriminatorProp: string | undefined,
  index: number,
): string {
  if (discriminatorProp && typeof item === 'object' && item !== null) {
    const typeVal = (item as Record<string, unknown>)[discriminatorProp];
    if (typeVal) return `Item ${index + 1}: ${typeVal}`;
  }
  if (typeof item === 'object' && item !== null) {
    const obj = item as Record<string, unknown>;
    const nameVal = obj.name ?? obj.title ?? obj.id;
    if (nameVal) return `Item ${index + 1}: ${nameVal}`;
  }
  return `Item ${index + 1}`;
}

export function getSchemaDefault(schema: JsonSchemaDef): unknown {
  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
  switch (type) {
    case JsonSchemaType.String:
      return '';
    case JsonSchemaType.Boolean:
      return false;
    case JsonSchemaType.Array:
      return [];
    case JsonSchemaType.Integer:
    case JsonSchemaType.Number:
      return undefined;
    default:
      return {};
  }
}
