import { describe, expect, test } from 'vitest';
import {
  resolveRef,
  isObjectType,
  toFieldLabel,
  getOptionLabel,
  extractDefaults,
  validateRequired,
  buildSummary,
  detectAnyOfVariant,
  getItemTitle,
  getSchemaDefault,
  sortByPropertyOrder,
} from '@/components/SchemaRenderer/utils';
import type {
  JsonSchema,
  JsonSchemaDef,
} from '@/components/SchemaRenderer/types';

// ---------------------------------------------------------------------------
// resolveRef
// ---------------------------------------------------------------------------

describe('resolveRef', () => {
  const rootSchema: JsonSchema = {
    $defs: {
      Foo: {
        type: 'object',
        title: 'Foo Object',
        properties: { x: { type: 'string' } },
      },
      Bar: { $ref: '#/$defs/Foo' },
    },
  };

  test('returns schema unchanged when no $ref', () => {
    const schema: JsonSchemaDef = { type: 'string' };
    expect(resolveRef(schema, rootSchema)).toEqual({ type: 'string' });
  });

  test('resolves $ref to the correct $defs entry', () => {
    const schema: JsonSchemaDef = { $ref: '#/$defs/Foo' };
    const result = resolveRef(schema, rootSchema);
    expect(result.type).toBe('object');
    expect(result.title).toBe('Foo Object');
  });

  test('merges sibling properties onto resolved schema (siblings win)', () => {
    const schema: JsonSchemaDef = { $ref: '#/$defs/Foo', title: 'Override' };
    const result = resolveRef(schema, rootSchema);
    expect(result.title).toBe('Override');
  });

  test('follows a chain of $refs', () => {
    const schema: JsonSchemaDef = { $ref: '#/$defs/Bar' };
    const result = resolveRef(schema, rootSchema);
    expect(result.type).toBe('object');
    expect(result.title).toBe('Foo Object');
  });

  test('returns schema unchanged when $ref target does not exist', () => {
    const schema: JsonSchemaDef = { $ref: '#/$defs/Missing' };
    expect(resolveRef(schema, rootSchema)).toEqual({ $ref: '#/$defs/Missing' });
  });

  test('stops resolving at depth > 10 to prevent infinite loops', () => {
    const circular: JsonSchema = { $defs: { A: { $ref: '#/$defs/A' } } };
    const schema: JsonSchemaDef = { $ref: '#/$defs/A' };
    // Should not throw; returns something (schema or partial)
    expect(() => resolveRef(schema, circular)).not.toThrow();
  });

  test('unwraps a single-$ref allOf while keeping sibling default', () => {
    const schema: JsonSchemaDef = {
      allOf: [{ $ref: '#/$defs/Foo' }],
      default: { x: 'hello' },
    };
    const result = resolveRef(schema, rootSchema);
    expect(result.type).toBe('object');
    expect(result.properties?.x).toEqual({ type: 'string' });
    expect(result.default).toEqual({ x: 'hello' });
    expect(result.allOf).toBeUndefined();
  });

  test('merges properties and required from multiple allOf entries', () => {
    const root: JsonSchema = {
      $defs: {
        A: {
          type: 'object',
          properties: { a: { type: 'string' } },
          required: ['a'],
        },
        B: {
          type: 'object',
          properties: { b: { type: 'number' } },
          required: ['b'],
        },
      },
    };
    const schema: JsonSchemaDef = {
      allOf: [{ $ref: '#/$defs/A' }, { $ref: '#/$defs/B' }],
    };
    const result = resolveRef(schema, root);
    expect(result.properties?.a).toEqual({ type: 'string' });
    expect(result.properties?.b).toEqual({ type: 'number' });
    expect(result.required).toEqual(['a', 'b']);
  });
});

// ---------------------------------------------------------------------------
// isObjectType
// ---------------------------------------------------------------------------

describe('isObjectType', () => {
  test('returns true for type "object"', () => {
    expect(isObjectType({ type: 'object' })).toBe(true);
  });

  test('returns true when properties exist and no oneOf/anyOf/type', () => {
    expect(isObjectType({ properties: { x: { type: 'string' } } })).toBe(true);
  });

  test('returns false for string type', () => {
    expect(isObjectType({ type: 'string' })).toBe(false);
  });

  test('returns false for array type', () => {
    expect(isObjectType({ type: 'array' })).toBe(false);
  });

  test('returns false when oneOf is present even with properties', () => {
    expect(
      isObjectType({ properties: { x: { type: 'string' } }, oneOf: [] }),
    ).toBe(false);
  });

  test('returns false when anyOf is present even with properties', () => {
    expect(
      isObjectType({ properties: { x: { type: 'string' } }, anyOf: [] }),
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// sortByPropertyOrder
// ---------------------------------------------------------------------------

describe('sortByPropertyOrder', () => {
  test('orders entries by dial:propertyOrder ascending', () => {
    const entries: [string, JsonSchemaDef][] = [
      ['a', { 'dial:meta': { 'dial:propertyOrder': 1 } }],
      ['b', { 'dial:meta': { 'dial:propertyOrder': 0 } }],
    ];
    expect(sortByPropertyOrder(entries).map(([key]) => key)).toEqual([
      'b',
      'a',
    ]);
  });

  test('falls back to source order for entries without the hint', () => {
    const entries: [string, JsonSchemaDef][] = [
      ['a', {}],
      ['b', { 'dial:meta': { 'dial:propertyOrder': 0 } }],
      ['c', {}],
    ];
    expect(sortByPropertyOrder(entries).map(([key]) => key)).toEqual([
      'b',
      'a',
      'c',
    ]);
  });

  test('is a no-op when no entries carry the hint', () => {
    const entries: [string, JsonSchemaDef][] = [
      ['a', {}],
      ['b', {}],
      ['c', {}],
    ];
    expect(sortByPropertyOrder(entries).map(([key]) => key)).toEqual([
      'a',
      'b',
      'c',
    ]);
  });
});

// ---------------------------------------------------------------------------
// toFieldLabel
// ---------------------------------------------------------------------------

describe('toFieldLabel', () => {
  test('converts snake_case to Title Case', () => {
    expect(toFieldLabel('my_field_name')).toBe('My Field Name');
  });

  test('converts camelCase to Title Case with spaces', () => {
    expect(toFieldLabel('myFieldName')).toBe('My Field Name');
  });

  test('capitalises a single-word key', () => {
    expect(toFieldLabel('name')).toBe('Name');
  });

  test('handles already-capitalised single word', () => {
    expect(toFieldLabel('Name')).toBe('Name');
  });

  test('handles mixed snake and camel case', () => {
    expect(toFieldLabel('my_fieldName')).toBe('My Field Name');
  });
});

// ---------------------------------------------------------------------------
// getOptionLabel
// ---------------------------------------------------------------------------

describe('getOptionLabel', () => {
  test('returns "null" for type null schema', () => {
    expect(getOptionLabel({ type: 'null' }, {})).toBe('null');
  });

  test('returns schema title when present', () => {
    expect(getOptionLabel({ type: 'string', title: 'My Option' }, {})).toBe(
      'My Option',
    );
  });

  test('returns type string for simple type', () => {
    expect(getOptionLabel({ type: 'string' }, {})).toBe('string');
  });

  test('joins array of types with " | "', () => {
    expect(getOptionLabel({ type: ['string', 'number'] }, {})).toBe(
      'string | number',
    );
  });

  test('returns $ref last segment when no title', () => {
    const schema: JsonSchemaDef = { $ref: '#/$defs/MyType' };
    expect(getOptionLabel(schema, {})).toBe('MyType');
  });

  test('returns resolved title for $ref when available', () => {
    const root: JsonSchema = { $defs: { MyType: { title: 'My Type' } } };
    expect(getOptionLabel({ $ref: '#/$defs/MyType' }, root)).toBe('My Type');
  });

  test('returns const value as string', () => {
    expect(getOptionLabel({ const: 42 }, {})).toBe('42');
  });

  test('returns "One of options" for oneOf schema', () => {
    expect(getOptionLabel({ oneOf: [] }, {})).toBe('One of options');
  });

  test('returns "Option" as fallback', () => {
    expect(getOptionLabel({}, {})).toBe('Option');
  });
});

// ---------------------------------------------------------------------------
// extractDefaults
// ---------------------------------------------------------------------------

describe('extractDefaults', () => {
  test('returns the default value from schema', () => {
    expect(extractDefaults({ type: 'string', default: 'hello' }, {})).toBe(
      'hello',
    );
  });

  test('returns false as default for boolean', () => {
    expect(extractDefaults({ type: 'boolean', default: false }, {})).toBe(
      false,
    );
  });

  test('returns undefined when no default exists', () => {
    expect(extractDefaults({ type: 'string' }, {})).toBeUndefined();
  });

  test('recursively extracts defaults from nested object properties', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      properties: {
        name: { type: 'string', default: 'Alice' },
        age: { type: 'integer', default: 30 },
      },
    };
    expect(extractDefaults(schema, {})).toEqual({ name: 'Alice', age: 30 });
  });

  test('returns undefined for object with no defaulted properties', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      properties: { x: { type: 'string' } },
    };
    expect(extractDefaults(schema, {})).toBeUndefined();
  });

  test('partially fills object when only some properties have defaults', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      properties: {
        a: { type: 'string', default: 'yes' },
        b: { type: 'string' },
      },
    };
    expect(extractDefaults(schema, {})).toEqual({ a: 'yes' });
  });

  test('resolves $ref before extracting defaults', () => {
    const root: JsonSchema = {
      $defs: { Base: { type: 'string', default: 'from-ref' } },
    };
    expect(extractDefaults({ $ref: '#/$defs/Base' }, root)).toBe('from-ref');
  });

  test('returns empty object for additionalProperties-only object schema', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      additionalProperties: { type: 'string' },
    };
    expect(extractDefaults(schema, {})).toEqual({});
  });

  test('returns empty object for required key-value map without explicit default', () => {
    const root: JsonSchema = {
      $defs: {
        CustomConfig: {
          type: 'object',
          properties: {
            variables: {
              type: 'object',
              additionalProperties: { type: 'string' },
              title: 'Variables',
            },
            type: {
              const: 'custom',
              default: 'custom',
              type: 'string',
            },
            content: {
              type: 'string',
              title: 'Content',
            },
          },
          required: ['variables', 'content'],
        },
      },
    };
    const result = extractDefaults(
      { $ref: '#/$defs/CustomConfig' },
      root,
    ) as Record<string, unknown>;
    expect(result).toBeDefined();
    expect(result.type).toBe('custom');
    expect(result.variables).toEqual({});
  });

  test('recursively resolves nested discriminator fields to their first variant', () => {
    const root: JsonSchema = {
      $defs: {
        ChunkIndexConfig: {
          type: 'object',
          properties: {
            type: { const: 'chunk', default: 'chunk', type: 'string' },
            display_name: { type: 'string', title: 'Display Name' },
            indexer: {
              discriminator: {
                propertyName: 'type',
                mapping: {
                  text_embeddings: '#/$defs/TextEmbeddingsIndexerConfig',
                  bm25: '#/$defs/Bm25IndexerConfig',
                },
              },
              oneOf: [
                { $ref: '#/$defs/TextEmbeddingsIndexerConfig' },
                { $ref: '#/$defs/Bm25IndexerConfig' },
              ],
            },
          },
        },
        TextEmbeddingsIndexerConfig: {
          type: 'object',
          properties: {
            type: {
              const: 'text_embeddings',
              default: 'text_embeddings',
              type: 'string',
            },
            model: { type: 'string', default: 'text-embedding-3-small' },
          },
        },
        Bm25IndexerConfig: {
          type: 'object',
          properties: {
            type: { const: 'bm25', default: 'bm25', type: 'string' },
          },
        },
      },
    };

    const result = extractDefaults(
      { $ref: '#/$defs/ChunkIndexConfig' },
      root,
    ) as Record<string, unknown>;

    expect(result.type).toBe('chunk');
    expect(result.indexer).toEqual({
      type: 'text_embeddings',
      model: 'text-embedding-3-small',
    });
    expect(result.display_name).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// validateRequired
// ---------------------------------------------------------------------------

describe('validateRequired', () => {
  test('returns empty array when schema has no required fields', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      properties: { x: { type: 'string' } },
    };
    expect(validateRequired({ x: '' }, schema, {}, '')).toHaveLength(0);
  });

  test('returns error for a missing required field', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      required: ['name'],
      properties: { name: { type: 'string', title: 'Name' } },
    };
    const errors = validateRequired({}, schema, {}, '');
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('Name');
    expect(errors[0].path).toBe('name');
  });

  test('returns error when required field is null', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      required: ['email'],
      properties: { email: { type: 'string' } },
    };
    const errors = validateRequired({ email: null }, schema, {}, '');
    expect(errors).toHaveLength(1);
    expect(errors[0].path).toBe('email');
  });

  test('returns no error when required field has a value', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      required: ['name'],
      properties: { name: { type: 'string' } },
    };
    expect(validateRequired({ name: 'Alice' }, schema, {}, '')).toHaveLength(0);
  });

  test('uses toFieldLabel for error message when no title', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      required: ['myField'],
      properties: { myField: { type: 'string' } },
    };
    const errors = validateRequired({}, schema, {}, '');
    expect(errors[0].message).toContain('My Field');
  });

  test('recursively validates nested object properties', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      properties: {
        address: {
          type: 'object',
          required: ['city'],
          properties: { city: { type: 'string', title: 'City' } },
        },
      },
    };
    const errors = validateRequired({ address: {} }, schema, {}, '');
    expect(errors).toHaveLength(1);
    expect(errors[0].path).toContain('city');
  });

  test('validates each array item against items schema', () => {
    const schema: JsonSchemaDef = {
      type: 'array',
      items: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', title: 'ID' } },
      },
    };
    const errors = validateRequired([{}, { id: 'x' }, {}], schema, {}, '');
    expect(errors).toHaveLength(2);
  });

  test('returns empty array for non-object primitives', () => {
    expect(validateRequired('hello', { type: 'string' }, {}, '')).toHaveLength(
      0,
    );
    expect(validateRequired(42, { type: 'integer' }, {}, '')).toHaveLength(0);
  });

  test('handles anyOf by delegating to the single non-null schema', () => {
    const schema: JsonSchemaDef = {
      anyOf: [
        { type: 'null' },
        {
          type: 'object',
          required: ['x'],
          properties: { x: { type: 'string', title: 'X' } },
        },
      ],
    };
    const errors = validateRequired({ x: null }, schema, {}, '');
    expect(errors.length).toBeGreaterThan(0);
  });

  test('uses dot-separated path prefix for nested error paths', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      required: ['name'],
      properties: { name: { type: 'string' } },
    };
    const errors = validateRequired({}, schema, {}, 'parent');
    expect(errors[0].path).toBe('parent.name');
  });

  test('ignores required hidden fields', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      required: ['visible', 'secret'],
      properties: {
        visible: { type: 'string', title: 'Visible' },
        secret: { type: 'string', title: 'Secret', isHidden: true },
      },
    };

    const errors = validateRequired({}, schema, {}, '');
    expect(errors).toHaveLength(1);
    expect(errors[0].path).toBe('visible');
  });

  test('recursively validates additionalProperties map entries', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      additionalProperties: {
        type: 'object',
        required: ['display_name'],
        properties: { display_name: { type: 'string', title: 'Display Name' } },
      },
    };
    const errors = validateRequired(
      { primary: {}, secondary: { display_name: 'Secondary' } },
      schema,
      {},
      'indexes',
    );
    expect(errors).toHaveLength(1);
    expect(errors[0].path).toBe('indexes.primary.display_name');
  });

  test('ignores additionalProperties when it is a boolean or missing', () => {
    expect(
      validateRequired({ a: 'x' }, { type: 'object' }, {}, ''),
    ).toHaveLength(0);
    expect(
      validateRequired(
        { a: 'x' },
        { type: 'object', additionalProperties: true },
        {},
        '',
      ),
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// buildSummary
// ---------------------------------------------------------------------------

describe('buildSummary', () => {
  test('returns "X items" for an array value', () => {
    expect(buildSummary(['a', 'b', 'c'], { type: 'array' }, {})).toBe(
      '3 items',
    );
  });

  test('uses singular "item" for a single-element array', () => {
    expect(buildSummary(['a'], { type: 'array' }, {})).toBe('1 item');
  });

  test('returns "0 items" for empty array', () => {
    expect(buildSummary([], { type: 'array' }, {})).toBe('0 items');
  });

  test('returns "X/N fields" counting non-null/non-empty properties', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      properties: {
        a: { type: 'string' },
        b: { type: 'string' },
        c: { type: 'string' },
      },
    };
    expect(buildSummary({ a: 'yes', b: '', c: null }, schema, {})).toBe(
      '1/3 fields',
    );
  });

  test('counts all filled fields correctly', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      properties: {
        x: { type: 'string' },
        y: { type: 'integer' },
      },
    };
    expect(buildSummary({ x: 'hello', y: 42 }, schema, {})).toBe('2/2 fields');
  });

  test('returns empty string for primitive values', () => {
    expect(buildSummary('hello', { type: 'string' }, {})).toBe('');
    expect(buildSummary(42, { type: 'integer' }, {})).toBe('');
  });

  test('returns empty string for undefined value', () => {
    expect(buildSummary(undefined, { type: 'string' }, {})).toBe('');
  });

  test('excludes hidden fields from totals', () => {
    const schema: JsonSchemaDef = {
      type: 'object',
      properties: {
        visibleA: { type: 'string' },
        hiddenB: { type: 'string', isHidden: true },
        visibleC: { type: 'string' },
      },
    };

    expect(
      buildSummary({ visibleA: 'x', hiddenB: '', visibleC: '' }, schema, {}),
    ).toBe('1/2 fields');
  });
});

// ---------------------------------------------------------------------------
// detectAnyOfVariant
// ---------------------------------------------------------------------------

describe('detectAnyOfVariant', () => {
  const schemas: JsonSchemaDef[] = [
    { type: 'null' },
    { type: 'string' },
    { type: 'integer' },
    { type: 'boolean' },
    { type: 'array' },
    { type: 'object' },
  ];

  test('returns index of null variant for null value', () => {
    expect(detectAnyOfVariant(null, schemas, {})).toBe(0);
  });

  test('returns index of null variant for undefined value', () => {
    expect(detectAnyOfVariant(undefined, schemas, {})).toBe(0);
  });

  test('returns index of string variant for string value', () => {
    expect(detectAnyOfVariant('hello', schemas, {})).toBe(1);
  });

  test('returns index of integer/number variant for numeric value', () => {
    expect(detectAnyOfVariant(42, schemas, {})).toBe(2);
  });

  test('returns index of boolean variant for boolean value', () => {
    expect(detectAnyOfVariant(true, schemas, {})).toBe(3);
  });

  test('returns index of array variant for array value', () => {
    expect(detectAnyOfVariant([], schemas, {})).toBe(4);
  });

  test('returns index of object variant for object value', () => {
    expect(detectAnyOfVariant({}, schemas, {})).toBe(5);
  });

  test('returns 0 when no matching variant found', () => {
    const twoSchemas: JsonSchemaDef[] = [
      { type: 'string' },
      { type: 'boolean' },
    ];
    expect(detectAnyOfVariant(42, twoSchemas, {})).toBe(0);
  });

  test('prefers discriminator-property match for objects', () => {
    const discriminated: JsonSchemaDef[] = [
      { type: 'string' },
      {
        discriminator: {
          propertyName: 'kind',
          mapping: { foo: '#/$defs/Foo' },
        },
      },
    ];
    expect(detectAnyOfVariant({ kind: 'foo' }, discriminated, {})).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// getItemTitle
// ---------------------------------------------------------------------------

describe('getItemTitle', () => {
  test('returns "Item N" for a non-object value', () => {
    expect(getItemTitle('hello', undefined, 0)).toBe('Item 1');
  });

  test('returns "Item N: {type}" when discriminatorProp matches', () => {
    expect(getItemTitle({ kind: 'dog' }, 'kind', 2)).toBe('Item 3: dog');
  });

  test('returns "Item N: {name}" when item has a name property', () => {
    expect(getItemTitle({ name: 'Fluffy' }, undefined, 0)).toBe(
      'Item 1: Fluffy',
    );
  });

  test('prefers name over title and id', () => {
    expect(getItemTitle({ name: 'n', title: 't', id: 'i' }, undefined, 0)).toBe(
      'Item 1: n',
    );
  });

  test('falls back to title when name is absent', () => {
    expect(getItemTitle({ title: 'My Title' }, undefined, 0)).toBe(
      'Item 1: My Title',
    );
  });

  test('falls back to id when name and title are absent', () => {
    expect(getItemTitle({ id: 'abc' }, undefined, 0)).toBe('Item 1: abc');
  });

  test('returns "Item N" for empty object', () => {
    expect(getItemTitle({}, undefined, 4)).toBe('Item 5');
  });

  test('returns "Item N" for null item', () => {
    expect(getItemTitle(null, 'kind', 1)).toBe('Item 2');
  });
});

// ---------------------------------------------------------------------------
// getSchemaDefault
// ---------------------------------------------------------------------------

describe('getSchemaDefault', () => {
  test('returns "" for string type', () => {
    expect(getSchemaDefault({ type: 'string' })).toBe('');
  });

  test('returns false for boolean type', () => {
    expect(getSchemaDefault({ type: 'boolean' })).toBe(false);
  });

  test('returns [] for array type', () => {
    expect(getSchemaDefault({ type: 'array' })).toEqual([]);
  });

  test('returns undefined for integer type', () => {
    expect(getSchemaDefault({ type: 'integer' })).toBeUndefined();
  });

  test('returns undefined for number type', () => {
    expect(getSchemaDefault({ type: 'number' })).toBeUndefined();
  });

  test('returns {} for object type', () => {
    expect(getSchemaDefault({ type: 'object' })).toEqual({});
  });

  test('returns {} for unknown/missing type', () => {
    expect(getSchemaDefault({})).toEqual({});
  });

  test('uses first element when type is an array', () => {
    expect(getSchemaDefault({ type: ['string', 'null'] })).toBe('');
  });
});
